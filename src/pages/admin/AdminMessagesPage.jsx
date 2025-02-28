import React, { useEffect, useState } from "react";

/**
 * AdminMessagesPage
 * - calls GET /api/admin/messages => list threads
 * - if you want to see the actual conversation, you'd use the normal /api/messages/threads/:threadId
 *   or have an "admin" version. 
 */

function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchThreads() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch admin messages/threads");
      }
      setThreads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadThreadDetails(tid) {
    try {
      setError("");
      setSelectedThread(tid);
      setThreadMessages([]); // clear old
      // normal route: GET /api/messages/threads/:threadId
      const res = await fetch(`${base}/messages/threads/${tid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch thread detail");
      }
      setThreadMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function postNewMessage() {
    try {
      if (!selectedThread) return;
      const bodyObj = { content: newMsg };
      const res = await fetch(`${base}/messages/threads/${selectedThread}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      setNewMsg("");
      // reload the thread
      loadThreadDetails(selectedThread);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchThreads();
  }, []);

  if (loading) return <div>Loading admin messages...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Messages</h2>
      <div className="flex gap-4">
        {/* left: thread list */}
        <div className="card w-1/3">
          <h3 className="font-bold mb-2">Threads</h3>
          {threads.map(th => (
            <div
              key={th.id}
              className="bg-panel p-2 mb-2 rounded cursor-pointer"
              onClick={() => loadThreadDetails(th.id)}
            >
              <p className="font-semibold">{th.title || "Untitled Thread"}</p>
              <p className="text-xs text-muted">
                CreatedAt: {th.created_at?.slice(0,10)}
              </p>
            </div>
          ))}
        </div>

        {/* right: thread detail */}
        <div className="flex-1 card">
          {selectedThread ? (
            <>
              <h3 className="font-bold mb-2">Thread #{selectedThread} Detail</h3>
              <div className="mb-2 max-h-64 overflow-auto space-y-2">
                {threadMessages.map((m) => (
                  <div key={m.id} className="bg-[var(--color-dark)] p-2 rounded">
                    <p>
                      <strong>From user {m.sender_id}:</strong> {m.content}
                    </p>
                    <p className="text-xs text-muted">
                      {m.created_at?.slice(0,19).replace("T"," ")}
                    </p>
                  </div>
                ))}
                {threadMessages.length === 0 && (
                  <p className="text-muted">No messages in this thread yet.</p>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  className="border rounded w-full px-2 py-1 bg-[var(--color-dark)] text-white"
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button
                  className="btn"
                  onClick={postNewMessage}
                >
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

export default AdminMessagesPage;
