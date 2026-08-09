import { redirect } from "next/navigation";

/** Legacy Works catalog - Originals now live on About. */
export default function CollectionsPage() {
  redirect("/about#originals");
}
