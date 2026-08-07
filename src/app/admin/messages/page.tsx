"use client";

import { useEffect, useState } from "react";
import { AdminShell, AdminButton, AdminCard } from "@/components/admin/AdminShell";
import { apiGet, apiPatch, readApiResult } from "@/lib/api";

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
    setError("");
    const res = await apiGet("/admin/messages");
    const data = await readApiResult<{ messages: MessageRow[] }>(res);
    if (!data.ok) {
      setError(data.error);
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
    const data = await readApiResult(res);
    if (data.ok) {
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)));
    } else {
      setError(data.error);
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
    <AdminShell title="Messages" subtitle="Contact form inbox - same fields as public contact.">
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-grid-sidebar">
        <div>
          {messages.length === 0 && !loading ? (
            <p className="admin-muted">No messages yet.</p>
          ) : null}
          {messages.map((msg) => (
            <button
              key={msg._id}
              type="button"
              onClick={() => openMessage(msg._id)}
              className={`admin-list-item ${selectedId === msg._id ? "is-active" : ""}`}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p className={`admin-list-item-title ${msg.read ? "" : "admin-badge unread"}`}>
                    {msg.name}
                  </p>
                  <p className="admin-list-item-meta">{msg.email}</p>
                </div>
                {!msg.read ? <span className="admin-badge unread">New</span> : null}
              </div>
              <p className="admin-muted" style={{ marginTop: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {msg.subject || msg.message}
              </p>
              <p className="admin-list-item-meta" style={{ marginTop: 4 }}>
                {msg.type} · {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        <AdminCard style={{ minHeight: 320 }}>
          {selected ? (
            <div>
              <div className="admin-panel-title">
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-xl)" }}>
                      {selected.name}
                    </h2>
                    <a href={`mailto:${selected.email}`} className="admin-link" style={{ marginTop: 8 }}>
                      {selected.email}
                    </a>
                  </div>
                  <span className="admin-badge">{selected.type}</span>
                </div>
              </div>
              {selected.subject ? (
                <p className="admin-stat-label" style={{ marginTop: 16 }}>
                  Subject: {selected.subject}
                </p>
              ) : null}
              {selected.company ? (
                <p className="admin-stat-label" style={{ marginTop: 8 }}>
                  Company: {selected.company}
                </p>
              ) : null}
              {selected.projectType ? (
                <p className="admin-stat-label" style={{ marginTop: 8 }}>
                  Project: {selected.projectType}
                </p>
              ) : null}
              <p className="admin-message-body">{selected.message}</p>
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                {!selected.read ? (
                  <AdminButton onClick={() => markRead(selected._id, true)} className="filled">
                    Mark read
                  </AdminButton>
                ) : (
                  <AdminButton variant="ghost" onClick={() => markRead(selected._id, false)}>
                    Mark unread
                  </AdminButton>
                )}
              </div>
            </div>
          ) : (
            <p className="admin-muted">Select a message to view.</p>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
