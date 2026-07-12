import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/types/content";

export function JournalPostContent({ post }: { post: JournalPost }) {
  const html = marked.parse(post.body ?? "", { async: false }) as string;

  return (
    <article className="section-pad page-top story-sec">
      <div className="container max-w-3xl">
        <Link href="/journal" className="btn-line-dark mb-8 inline-flex">
          ← Journal
        </Link>

        <header>
          <div className="sec-tag">Journal</div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="sec-intro mt-4">{post.excerpt}</p> : null}
        </header>

        {post.coverImage ? (
          <div className="process-img mt-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="768px"
              priority
            />
          </div>
        ) : null}

        <div className="prose-lelek mt-10" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
