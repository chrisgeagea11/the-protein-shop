import Link from "next/link";
import posts from "@/data/blog.json";

export const metadata = { title: "Nutrition Notes" };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-400 mb-2">Nutrition notes</p>
      <h1 className="font-display text-3xl text-chalk mb-10">Things worth knowing before your next order.</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-char-700 rounded-2xl p-6 hover:border-lime-400/60 transition-colors"
          >
            <p className="text-xs text-chalk/40 mb-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
            <h2 className="font-display text-xl text-chalk mb-2">{post.title}</h2>
            <p className="text-chalk/60 text-sm leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
