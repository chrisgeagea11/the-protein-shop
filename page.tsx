const TESTIMONIALS = [
  {
    quote: "First whey isolate that doesn't leave a chalky aftertaste. Mixes fully with just a shaker ball.",
    name: "Priya R.",
    detail: "Verified buyer · Dark Chocolate",
  },
  {
    quote: "The cookie dough bar is the only protein bar my kids will also eat, which is somehow the bigger win.",
    name: "Marcus T.",
    detail: "Verified buyer · Chocolate Chip Cookie Dough",
  },
  {
    quote: "Switched to the plant blend for digestion reasons and didn't lose any recovery quality I could notice.",
    name: "Devon L.",
    detail: "Verified buyer · Cacao & Sea Salt",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-char-700 bg-char-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-400 mb-3">From the reviews</p>
        <h2 className="font-display text-3xl text-chalk mb-10">People who actually train, actually saying this.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="rounded-2xl border border-char-700 bg-char-950 p-6">
              <p className="text-chalk/90 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <p className="text-chalk font-semibold">{t.name}</p>
                <p className="text-chalk/40">{t.detail}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
