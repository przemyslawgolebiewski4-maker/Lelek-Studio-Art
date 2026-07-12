"use client";

import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { JournalPostForm, postToForm } from "@/components/admin/JournalPostForm";

export default function AdminJournalNewPage() {
  return (
    <AdminShell title="New journal post" subtitle="Write in Markdown">
      <AdminCard className="max-w-3xl">
        <JournalPostForm initial={postToForm()} />
      </AdminCard>
    </AdminShell>
  );
}
