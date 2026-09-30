import { redirect } from "next/navigation";
import { aboutHref } from "@/lib/links";

/** Legacy Works catalog - Originals now live on the maker page. */
export default function CollectionsPage() {
  redirect(aboutHref("originals"));
}
