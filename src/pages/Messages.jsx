// user/Messages.jsx
import React, { useState, useEffect } from "react";

function Messages() {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Load threads
  useEffect(() => {
    async function loadThreads() {
      try {
        setLoadingThreads(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/messages/threads`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load message threads");
        }
        const data = await res.json(); // array of { id, title, created_at }
        setThreads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingThreads(false);
      }
    }
    loadThreads();
  }, [token]);

  // Load messages for a thread
  async function loadThreadMessages(threadId) {
    try {
      setLoadingMessages(true);
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/messages/threads/${threadId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load thread messages");
      }
      const data = await res.json();
      // data.messages => array of { id, thread_id, sender_id, content, created_at, sender_email? }
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }

  function selectThread(threadId) {
    setSelectedThreadId(threadId);
    setMessages([]);
    setNewMessage("");
    loadThreadMessages(threadId);
  }

  // Send new message
  async function sendMessage() {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/messages/threads/${selectedThreadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post message");
      }
      const created = await res.json();
      // created.msg => the new message
      setMessages([...messages, created.msg]);
      setNewMessage("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loadingThreads) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="flex gap-4">
        {/* Left side: thread list */}
        <div className="card w-1/3">
          <h3 className="text-sm text-muted mb-2">Inbox Threads</h3>
          {threads.length === 0 && <p>No message threads yet.</p>}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`
                p-2 mb-1 rounded cursor-pointer 
                ${
                  t.id === selectedThreadId
                    ? "bg-[var(--color-mid)]"
                    : "bg-[var(--color-dark)]"
                }
              `}
              onClick={() => selectThread(t.id)}
            >
              <div className="font-semibold">{t.title || `Thread #${t.id}`}</div>
            </div>
          ))}
        </div>

        {/* Right side: conversation */}
        <div className="card flex-1 flex flex-col">
          {selectedThreadId ? (
            <>
              <h3 className="text-sm text-muted mb-2">Thread #{selectedThreadId}</h3>
              {loadingMessages && <p>Loading messages...</p>}
              {!loadingMessages && messages.length === 0 && (
                <p>No messages in this thread.</p>
              )}
              <div className="flex-1 overflow-auto space-y-2 mb-2">
                {messages.map((m) => (
                  <div key={m.id} className="p-2 bg-[var(--color-dark)] rounded">
                    <strong>{m.sender_email || `User#${m.sender_id}`}:</strong> {m.content}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
                  className="border rounded w-full px-2 py-1 bg-[var(--color-dark)] text-white"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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

export default Messages;
