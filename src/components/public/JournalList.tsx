import Link from "next/link";
import Image from "next/image";
import type { JournalPostSummary } from "@/types/content";

export function JournalList({ posts }: { posts: JournalPostSummary[] }) {
  if (posts.length === 0) {
    return <p className="sec-intro mt-10">No journal entries yet. Check back soon.</p>;
  }

  return (
    <div className="mt-14 grid-portrait">
      {posts.map((post) => (
        <Link key={post._id} href={`/journal/${post.slug}`} className="card">
          {post.coverImage ? (
            <div className="card-thumb card-thumb-ratio-portrait relative">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 220px"
              />
            </div>
          ) : null}
          <div className="card-body">
            <div className="card-title">{post.title}</div>
            {post.excerpt ? <div className="card-meta">{post.excerpt}</div> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
