// user/Notifications.jsx
import React, { useState, useEffect } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load notifications");
        }
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [token]);

  async function markAsRead(notifId) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/notifications/${notifId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ read: true })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update notification");
      }
      const updated = await res.json(); 
      // updated.notification => the changed notification
      setNotifications(notifications.map(n => n.id === notifId ? updated.notification : n));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (notifications.length === 0) return <p>No notifications found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className="card p-3 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold">{n.title}</h3>
              <p className="text-sm text-muted">{n.body}</p>
              <p className="text-xs">Created: {n.created_at}</p>
            </div>
            {!n.read && (
              <button
                className="btn text-sm"
                onClick={() => markAsRead(n.id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
