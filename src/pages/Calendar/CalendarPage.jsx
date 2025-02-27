import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    is_blocked: false
  });

  // optional: read query param ?user_id= from admin
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdParam = params.get("user_id"); // if admin wants to view a specific user's events

  async function fetchEvents() {
    try {
      const token = localStorage.getItem("token");
      let url = import.meta.env.VITE_API_BASE + "/calendar";
      if (userIdParam) {
        url += `?user_id=${userIdParam}`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createEvent(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = {
        date: formData.date,
        title: formData.title,
        is_blocked: formData.is_blocked
      };
      // if admin wants to create for someone else, they'd have a separate form or code.
      // user_id: 17, etc.

      const res = await fetch(import.meta.env.VITE_API_BASE + "/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }
      // refresh
      setFormData({ date: "", title: "", is_blocked: false });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [userIdParam]);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Calendar / Availability</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createEvent} style={{ marginBottom: "1rem" }}>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label>Blocked?</label>
          <input
            type="checkbox"
            checked={formData.is_blocked}
            onChange={e => setFormData({ ...formData, is_blocked: e.target.checked })}
          />
        </div>
        <button type="submit">Add Event</button>
      </form>

      <ul>
        {events.map(evt => (
          <li key={evt.id} style={{ marginBottom: "0.5rem", border: "1px solid #ccc", padding: "0.5rem" }}>
            <strong>{evt.date}</strong> - {evt.title} {evt.is_blocked ? "(Blocked)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarPage;
