import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, BLOG_POSTS } from '@/lib/blog/data';
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles, User } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical: `https://www.mallorcaquotes.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `https://www.mallorcaquotes.com/blog/${post.slug}`,
      type: 'article',
      images: [{ url: post.coverImage }],
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) =>
    post.relatedSlugs.includes(p.slug)
  );

  return (
    <div className="bg-med-sand min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-med-muted hover:text-med-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Guides</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-med-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publicationDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-med-dark font-normal leading-[1.2]">
            {post.title}
          </h1>

          <div className="flex items-center gap-2.5 pt-2">
            <div className="w-8 h-8 rounded-full bg-med-stone flex items-center justify-center text-med-olive">
              <User className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-med-dark">{post.author}</div>
              <div className="text-med-muted text-[11px]">{post.authorRole}</div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-med-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-med-border shadow-sm space-y-6 text-sm text-med-dark/90 leading-relaxed font-sans">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="text-sm sm:text-base leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Inline Estimate CTA Box */}
          <div className="my-8 p-6 rounded-2xl bg-med-sand border border-med-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-med-olive">
              <Sparkles className="w-4 h-4" />
              <span>Planning a Building Project in Mallorca?</span>
            </div>
            <h3 className="font-serif text-xl text-med-dark font-medium">
              Calculate indicative construction costs for your villa in seconds.
            </h3>
            <p className="text-xs text-med-muted leading-relaxed">
              Use our independent pricing tool to test property sizes, quality tiers and pool options without personal data requirements.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#quick-calculator"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-med-dark text-med-sand hover:bg-med-olive transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <span>Launch Quick Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/detailed-estimate"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-med-border bg-white text-med-dark hover:bg-med-stone/60 transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <span>Request Detailed Dossier</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-med-border space-y-6">
            <h3 className="font-serif text-2xl text-med-dark font-normal">
              Related Articles & Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white border border-med-border hover:shadow-sm transition-all group block space-y-2"
                >
                  <h4 className="font-serif text-base font-medium text-med-dark group-hover:text-med-olive transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-med-muted line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
