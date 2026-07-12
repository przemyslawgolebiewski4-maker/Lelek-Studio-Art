"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminButton, AdminCard } from "@/components/admin/AdminShell";
import { apiGet, apiPatch } from "@/lib/api";

type MessageRow = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  type: "general" | "architect" | "custom-order";
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages() {
    setLoading(true);
    const res = await apiGet("/admin/messages");
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load messages");
      setLoading(false);
      return;
    }
    setMessages(data.messages);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function markRead(id: string, read = true) {
    const res = await apiPatch(`/admin/messages/${id}`, { read });
    const data = await res.json();
    if (data.ok) {
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)));
    }
  }

  function openMessage(id: string) {
    setSelectedId(id);
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) {
      markRead(id, true);
    }
  }

  const selected = messages.find((m) => m._id === selectedId) ?? null;

  return (
    <AdminShell title="Messages" subtitle="Contact form inbox">
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="text-rust-light">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          {messages.length === 0 && !loading ? (
            <p className="text-metal">No messages yet.</p>
          ) : null}
          {messages.map((msg) => (
            <button
              key={msg._id}
              type="button"
              onClick={() => openMessage(msg._id)}
              className={`w-full border p-4 text-left transition-colors ${
                selectedId === msg._id
                  ? "border-rust bg-peat/60"
                  : "border-sand/20 bg-peat/30 hover:border-sand/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm ${msg.read ? "text-sand" : "font-medium text-cream"}`}>
                    {msg.name}
                  </p>
                  <p className="text-xs text-metal">{msg.email}</p>
                </div>
                {!msg.read ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-rust-light">
                    New
                  </span>
                ) : null}
              </div>
              <p className="mt-2 truncate text-sm text-metal">
                {msg.subject || msg.message}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-metal">
                {msg.type} · {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        <AdminCard className="min-h-[320px]">
          {selected ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sand/15 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-cream">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-rust-light hover:text-cream">
                    {selected.email}
                  </a>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-metal">
                  {selected.type}
                </span>
              </div>
              {selected.subject ? (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-metal">
                  Subject: {selected.subject}
                </p>
              ) : null}
              {selected.company ? (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-metal">
                  Company: {selected.company}
                </p>
              ) : null}
              {selected.projectType ? (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-metal">
                  Project: {selected.projectType}
                </p>
              ) : null}
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-sand">
                {selected.message}
              </p>
              <div className="mt-6 flex gap-3">
                {!selected.read ? (
                  <AdminButton onClick={() => markRead(selected._id, true)}>Mark read</AdminButton>
                ) : (
                  <AdminButton variant="ghost" onClick={() => markRead(selected._id, false)}>
                    Mark unread
                  </AdminButton>
                )}
              </div>
            </div>
          ) : (
            <p className="text-metal">Select a message to view.</p>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
