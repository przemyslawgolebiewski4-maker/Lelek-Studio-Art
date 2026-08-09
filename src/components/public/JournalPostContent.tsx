import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/types/content";

export function JournalPostContent({ post }: { post: JournalPost }) {
  const html = marked.parse(post.body ?? "", { async: false }) as string;

  return (
    <article>
      <div className="page-shell">
        <Link href="/journal" className="back-link">
          ← Journal
        </Link>
        <div className="sec-eyebrow">Journal</div>
        <h1 className="page-h1">{post.title}</h1>
        {post.excerpt ? <p className="page-intro">{post.excerpt}</p> : null}
      </div>

      {post.coverImage ? (
        <div style={{ background: "var(--B)", borderBottom: "3px solid var(--B)", padding: 40 }}>
          <div className="product-detail-hero" style={{ maxWidth: 900, margin: "0 auto" }}>
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              sizes="900px"
              priority
            />
          </div>
        </div>
      ) : null}

      <div className="page-content">
        <div className="prose-brutal" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
