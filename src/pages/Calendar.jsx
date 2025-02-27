// src/pages/Calendar.jsx
import React, { useEffect, useState } from "react";

/**
 * This file calls:
 *  - GET /api/calendar
 *  - POST /api/calendar
 *
 * We store the events in local state, display them in a list,
 * and let the user add a new event with an animated overlay modal if you prefer.
 * We'll show a simple approach with no "if" speculation.
 */
export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    is_blocked: false,
  });

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE; // e.g. "https://betlogic-backend.onrender.com/api"

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${base}/calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load calendar events");
        }
        const data = await res.json();
        // data is array of { id, user_id, date, title, is_blocked, created_at, updated_at }
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadEvents();
  }, [base, token]);

  // Add event
  async function addEvent() {
    if (!newEvent.date || !newEvent.title) {
      alert("Date and title are required.");
      return;
    }
    try {
      const res = await fetch(`${base}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });
      const resultData = await res.json();
      if (!res.ok) {
        throw new Error(resultData.error || "Failed to create event");
      }
      // resultData => { message, event: {...} }
      setEvents([...events, resultData.event]);
      setShowAddModal(false);
      setNewEvent({ date: "", title: "", is_blocked: false });
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return (
      <div className="text-red-400 font-semibold animate-pulse">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 transition-all duration-300 ease-out">
      <h2 className="text-2xl font-bold">My Calendar</h2>
      <p className="text-sm text-muted">
        Below are your personal events from /api/calendar.
      </p>

      <button
        className="btn hover:scale-105"
        onClick={() => setShowAddModal(true)}
      >
        + Add Event
      </button>

      {events.length === 0 && (
        <p className="text-sm text-muted mt-4">No events found.</p>
      )}
      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="
                card
                transform
                hover:scale-105
                transition-transform
                cursor-pointer
              "
            >
              <p className="text-sm font-semibold">
                {evt.date} {evt.is_blocked && <span className="text-neg">(Blocked)</span>}
              </p>
              <h4 className="text-md font-bold">{evt.title}</h4>
            </div>
          ))}
        </div>
      )}

      {/* Add event modal */}
      {showAddModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">New Event</h3>
            <div className="space-y-2 text-sm">
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  placeholder="e.g. Meeting, Block off"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={newEvent.is_blocked}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, is_blocked: e.target.checked })
                  }
                />
                <label className="text-sm">Block Off Entire Day?</label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={addEvent}>
                Save
              </button>
              <button
                className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
