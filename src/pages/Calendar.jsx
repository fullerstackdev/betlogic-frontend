// src/pages/Calendar.jsx

import React, { useState, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css"; // import default styles
// you can custom style it further in your tailwind or additional CSS

const locales = {
  // optional if you want multiple languages
  enUS: require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  // We'll store the user’s events as an array of { id, user_id, date, title, is_blocked }
  // react-big-calendar needs events shaped like { title, start, end, allDay?, ... }
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // For the "add event" modal
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    is_blocked: false,
  });

  // load events from /api/calendar
  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await fetch(`${base}/calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load calendar events");
        }
        const data = await res.json(); // array of {id, user_id, date, title, is_blocked}
        // transform into RBC events
        const mapped = data.map((evt) => {
          // date => "YYYY-MM-DD" => we can parse to a real Date
          const parsedDate = new Date(evt.date + "T00:00:00");
          // if is_blocked => allDay
          return {
            id: evt.id,
            title: evt.is_blocked ? `[BLOCKED] ${evt.title}` : evt.title,
            start: parsedDate,
            end: parsedDate,
            allDay: true,
            raw: evt, // store original if needed
          };
        });
        setEvents(mapped);
      } catch (err) {
        setError(err.message);
      }
    }
    loadCalendar();
  }, [base, token]);

  // add event
  async function addEvent() {
    if (!newEvent.date || !newEvent.title.trim()) {
      alert("Date and title required.");
      return;
    }
    try {
      const body = {
        date: newEvent.date,
        title: newEvent.title.trim(),
        is_blocked: newEvent.is_blocked,
      };
      const res = await fetch(`${base}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to create event");
      }
      // result => { message, event: {...} }
      // transform to RBC event
      const parsedDate = new Date(result.event.date + "T00:00:00");
      const rbcEvent = {
        id: result.event.id,
        title: result.event.is_blocked
          ? `[BLOCKED] ${result.event.title}`
          : result.event.title,
        start: parsedDate,
        end: parsedDate,
        allDay: true,
        raw: result.event,
      };
      setEvents([...events, rbcEvent]);
      setShowModal(false);
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Calendar</h2>
      <p className="text-sm text-muted">Below is a real monthly calendar.</p>

      <button className="btn" onClick={() => setShowModal(true)}>
        + Add Event
      </button>

      {/* React Big Calendar view */}
      <div style={{ height: "600px" }} className="mt-4">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView={Views.MONTH}
          startAccessor="start"
          endAccessor="end"
          allDayAccessor="allDay"
          style={{ backgroundColor: "#1f1f2e", color: "#f0f0f0" }}
          // Optional customizing
        />
      </div>

      {/* Modal for adding event */}
      {showModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">New Calendar Event</h3>
            <div className="space-y-3 text-sm">
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
                  placeholder="Meeting or 'Block off evening'"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newEvent.is_blocked}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, is_blocked: e.target.checked })
                  }
                />
                <label>Block entire day?</label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={addEvent}>
                Save
              </button>
              <button
                className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                onClick={() => setShowModal(false)}
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
