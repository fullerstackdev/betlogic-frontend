// src/pages/Messages.jsx
import React, { useState, useEffect } from "react";

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadThreads() {
      try {
        const base = import.meta.env.VITE_API_BASE;
        const token = localStorage.getItem("token");
        // e.g. GET /api/messages/threads => returns an array of { id, title, ...}
        const res = await fetch(`${base}/messages/threads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load message threads");
        }
        const data = await res.json();
        setThreads(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadThreads();
  }, []);

  async function loadMessagesForThread(threadId) {
    try {
      const base = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      // e.g. GET /api/messages/threads/:threadId => returns {threadId, messages: [...], participants: [...] }
      const res = await fetch(`${base}/messages/threads/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load messages");
      }
      const data = await res.json();
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleThreadClick(tid) {
    setSelectedThread(tid);
    loadMessagesForThread(tid);
  }

  async function sendMessage() {
    if (!selectedThread) return;
    if (!newMsg.trim()) return;
    try {
      const base = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      // e.g. POST /api/messages/threads/:threadId => { content: "..." }
      const res = await fetch(`${base}/messages/threads/${selectedThread}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMsg }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      // append new message
      setMessages([...messages, data.msg]);
      setNewMsg("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="flex gap-4">
        {/* Thread list */}
        <div className="card w-1/3">
          <h3 className="text-sm text-muted mb-2">Inbox</h3>
          {threads.map((t) => (
            <div
              key={t.id}
              className={`p-2 mb-1 rounded cursor-pointer bg-[var(--color-dark)] hover:bg-[var(--color-mid)] ${
                t.id === selectedThread ? "border border-[var(--color-primary)]" : ""
              }`}
              onClick={() => handleThreadClick(t.id)}
            >
              <div className="font-semibold">{t.title || `Thread #${t.id}`}</div>
              <div className="text-xs text-muted">Click to view</div>
            </div>
          ))}
        </div>

        {/* Conversation */}
        <div className="card flex-1 flex flex-col">
          {selectedThread ? (
            <>
              <h3 className="text-sm text-muted mb-2">Thread #{selectedThread}</h3>
              <div className="flex-1 space-y-2 overflow-auto">
                {messages.map((m) => (
                  <div key={m.id} className="p-2 bg-[var(--color-dark)] rounded">
                    <strong>{m.sender_email || m.sender_id}:</strong> {m.content}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex">
                <input
                  type="text"
                  className="border rounded w-full px-2 py-1 bg-[var(--color-dark)] text-white"
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button className="btn ml-2" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-muted">Select a thread to view messages</p>
          )}
        </div>
      </div>
    </div>
  );
}
