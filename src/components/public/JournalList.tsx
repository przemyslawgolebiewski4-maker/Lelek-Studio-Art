import Link from "next/link";
import Image from "next/image";
import type { JournalPostSummary } from "@/types/content";

export function JournalList({ posts }: { posts: JournalPostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="mt-10 text-metal">No journal entries yet. Check back soon.</p>
    );
  }

  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/journal/${post.slug}`}
          className="group border border-ink/10 bg-sand/10 transition-colors hover:border-rust/40"
        >
          {post.coverImage ? (
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : null}
          <div className="p-6">
            <h2 className="font-serif text-2xl text-ink group-hover:text-rust">{post.title}</h2>
            {post.excerpt ? <p className="mt-3 text-sm leading-relaxed text-metal">{post.excerpt}</p> : null}
            <span className="btn-text mt-4 inline-block">Read more ↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
