import React, { useEffect, useState } from "react";

function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState("");

  async function fetchThreads() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/messages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch admin messages");
      }
      setThreads(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <div>
      <h2>Admin Messages</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>This page shows threads for which the admin is a participant, or all threads if you change the route logic to show everything.</p>
      <ul>
        {threads.map(t => (
          <li key={t.id}>
            Thread #{t.id}, title: {t.title}, created at {t.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminMessagesPage;
