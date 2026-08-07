import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calculateShippingCents, calculateTaxCents, applyDiscount } from "@/lib/pricing";
import { getSession } from "@/lib/auth";

const CartItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantId: z.string(),
  flavor: z.string(),
  size: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
});

const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  shippingAddress: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  discountCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const { items, shippingAddress, discountCode } = parsed.data;

  const subtotalCts = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shippingCts = calculateShippingCents(subtotalCts, itemCount);
  const taxCts = calculateTaxCents(subtotalCts, shippingAddress.country, shippingAddress.region);

  let discountCts = 0;
  if (discountCode) {
    const discount = await db.discountCode.findUnique({ where: { code: discountCode } }).catch(() => null);
    if (discount && discount.active) {
      discountCts = applyDiscount(subtotalCts, {
        percentOff: discount.percentOff ?? undefined,
        amountOffCts: discount.amountOffCts ?? undefined,
      });
    }
  }

  const totalCts = subtotalCts + shippingCts + taxCts - discountCts;
  const session = getSession();

  // Create a pending order record before redirecting to Stripe. It gets
  // marked PAID by the webhook once Stripe confirms payment.
  const order = await db.order
    .create({
      data: {
        userId: session?.userId,
        email: shippingAddress.email,
        status: "PENDING",
        subtotalCts,
        discountCts,
        taxCts,
        shippingCts,
        totalCts,
        shippingAddress: shippingAddress as any,
        items: {
          create: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            priceCts: Math.round(i.price * 100),
          })),
        },
      },
    })
    .catch(() => null);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: shippingAddress.email,
    line_items: [
      ...items.map((i) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: `${i.productName} — ${i.flavor} (${i.size})` },
        },
        quantity: i.quantity,
      })),
      ...(taxCts > 0
        ? [
            {
              price_data: {
                currency: "usd",
                unit_amount: taxCts,
                product_data: { name: "Estimated sales tax" },
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingCts, currency: "usd" },
          display_name: shippingCts === 0 ? "Free shipping" : "Standard shipping",
        },
      },
    ],
    automatic_tax: { enabled: false }, // taxCts above is calculated in pricing.ts and added as a line item
    metadata: { orderId: order?.id ?? "" },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order_id=${order?.id ?? ""}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
  });

  if (order) {
    await db.order.update({ where: { id: order.id }, data: { stripeSessionId: checkoutSession.id } }).catch(() => {});
  }

  return NextResponse.json({ url: checkoutSession.url });
}
