import Link from "next/link";
import Image from "next/image";
import type { JournalPostSummary } from "@/types/content";
import { resolvePostDate } from "@/lib/dates";

export function JournalList({ posts }: { posts: JournalPostSummary[] }) {
  if (posts.length === 0) {
    return <p className="page-intro">No journal entries yet. Check back soon.</p>;
  }

  return (
    <div className="product-grid" style={{ marginTop: 40 }}>
      {posts.map((post) => {
        const date = resolvePostDate(post);
        return (
          <Link key={post._id} href={`/journal/${post.slug}`} className="product-card">
            {post.coverImage ? (
              <div className="product-card-img portrait">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 220px"
                />
              </div>
            ) : (
              <div className="product-card-img portrait">{post.title}</div>
            )}
            <div className="product-card-body">
              {date ? (
                <time className="journal-list-date" dateTime={date.iso}>
                  {date.label}
                </time>
              ) : null}
              <div className="product-card-title">{post.title}</div>
              {post.excerpt ? <div className="product-card-meta">{post.excerpt}</div> : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
