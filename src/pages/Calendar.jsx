// user/Calendar.jsx
import React, { useState, useEffect } from "react";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    is_blocked: false
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/calendar`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load calendar events");
        }
        const data = await res.json();
        setEvents(data);  // array of { id, user_id, date, title, is_blocked, created_at }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [token]);

  async function addEvent() {
    if (!formData.date || !formData.title) {
      alert("Date and Title are required");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formData.date,
          title: formData.title,
          is_blocked: formData.is_blocked
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create calendar event");
      }
      const created = await res.json();
      // created.event => the new event
      setEvents([...events, created.event]);
      setFormData({ date: "", title: "", is_blocked: false });
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading calendar...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Calendar / Availability</h2>
      
      <div className="card p-4">
        <h3 className="text-lg font-bold mb-2">Add New Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Title</label>
            <input
              type="text"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              placeholder="e.g. 'Block off evening'"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <label className="text-sm">Block Off Entire Day?</label>
          <input
            type="checkbox"
            checked={formData.is_blocked}
            onChange={(e) => setFormData({ ...formData, is_blocked: e.target.checked })}
          />
        </div>
        <button className="btn" onClick={addEvent}>
          Add Event
        </button>
      </div>

      <div className="card p-4">
        <h3 className="text-lg font-bold mb-2">My Events</h3>
        {events.length === 0 && (
          <p className="text-sm text-muted">No events yet.</p>
        )}
        <ul className="space-y-2">
          {events.map((evt) => (
            <li key={evt.id} className="bg-[var(--color-dark)] p-2 rounded">
              <strong>{evt.date}</strong> - {evt.title}
              {evt.is_blocked && <span className="text-red-400 ml-2">(Blocked)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarPage;
