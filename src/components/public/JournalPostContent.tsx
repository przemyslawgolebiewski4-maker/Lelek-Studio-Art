import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/types/content";

export function JournalPostContent({ post }: { post: JournalPost }) {
  const html = marked.parse(post.body ?? "", { async: false }) as string;

  return (
    <article className="section-pad pt-28">
      <div className="container max-w-3xl">
        <Link href="/journal" className="btn-text mb-8 inline-block">
          ← Journal
        </Link>

        <header>
          <p className="eyebrow mb-3">Journal</p>
          <h1 className="text-[var(--text-3xl)]">{post.title}</h1>
          {post.excerpt ? <p className="italic-serif mt-4 text-lg text-metal">{post.excerpt}</p> : null}
        </header>

        {post.coverImage ? (
          <div className="relative mt-10 aspect-[16/10] overflow-hidden border border-ink/20">
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

        <div
          className="prose-lelek mt-10 space-y-4 text-sm leading-relaxed text-metal md:text-base [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}
