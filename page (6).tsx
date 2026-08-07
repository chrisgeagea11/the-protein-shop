import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-char-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-400 mb-5">27g protein · 1g sugar · no clay taste</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tightest text-chalk">
            FUEL THE
            <br />
            <span className="text-lime-400">NEXT REP.</span>
          </h1>
          <p className="mt-6 text-chalk/70 max-w-md text-lg">
            Whey, plant, and collagen protein — powders and bars — made with labels you can actually read out loud.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-lime-400 text-char-950 px-6 py-3 font-semibold hover:bg-lime-500 transition-colors"
            >
              Shop all products
            </Link>
            <Link
              href="/products?category=bar"
              className="rounded-full border border-char-700 text-chalk px-6 py-3 font-semibold hover:border-lime-400 transition-colors"
            >
              Try the bars
            </Link>
          </div>
        </div>

        {/* Signature element: the macro ring, echoing the nutrition-facts
            visualization used throughout product pages. */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="macro-ring w-full h-full" style={{ ["--pct" as any]: 78 }}>
              <div className="bg-char-950 rounded-full w-[78%] h-[78%] grid place-items-center text-center">
                <div>
                  <p className="font-display text-4xl text-chalk">27g</p>
                  <p className="text-xs uppercase tracking-wide text-chalk/50 mt-1">protein / serving</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-char-900 border border-char-700 rounded-xl px-4 py-2">
              <p className="font-tabular text-sm text-chalk">1g <span className="text-chalk/40">sugar</span></p>
            </div>
            <div className="absolute -top-4 -right-2 bg-char-900 border border-char-700 rounded-xl px-4 py-2">
              <p className="font-tabular text-sm text-chalk">130 <span className="text-chalk/40">cal</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
