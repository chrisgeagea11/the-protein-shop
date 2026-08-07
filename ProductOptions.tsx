import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-char-700 bg-char-950 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg text-chalk mb-3">
            SURGE<span className="text-lime-400">.</span>
          </p>
          <p className="text-chalk/60">Protein powders and bars built for people who actually train.</p>
        </div>
        <div>
          <p className="text-chalk/40 uppercase tracking-wide text-xs mb-3">Shop</p>
          <ul className="space-y-2 text-chalk/70">
            <li><Link href="/products?category=powder" className="hover:text-lime-400">Powders</Link></li>
            <li><Link href="/products?category=bar" className="hover:text-lime-400">Bars</Link></li>
            <li><Link href="/products" className="hover:text-lime-400">All products</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-chalk/40 uppercase tracking-wide text-xs mb-3">Company</p>
          <ul className="space-y-2 text-chalk/70">
            <li><Link href="/blog" className="hover:text-lime-400">Nutrition notes</Link></li>
            <li><Link href="/account" className="hover:text-lime-400">Account</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-chalk/40 uppercase tracking-wide text-xs mb-3">Support</p>
          <ul className="space-y-2 text-chalk/70">
            <li><a href="mailto:hello@surge.example" className="hover:text-lime-400">hello@surge.example</a></li>
            <li>Shipping &amp; returns</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-char-700 py-4 text-center text-xs text-chalk/40">
        © {new Date().getFullYear()} Surge Nutrition. These statements have not been evaluated by the FDA.
      </div>
    </footer>
  );
}
