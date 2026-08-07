import { notFound } from "next/navigation";
import type { Metadata } from "next";
import posts from "@/data/blog.json";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-xs text-chalk/40 mb-3">{new Date(post.publishedAt).toLocaleDateString()}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-chalk mb-6 leading-tight">{post.title}</h1>
      <div className="aspect-video bg-char-800 rounded-2xl border border-char-700 mb-8" />
      <p className="text-chalk/80 leading-relaxed text-lg">{post.body}</p>
    </article>
  );
}
