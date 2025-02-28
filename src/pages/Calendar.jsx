import React, { useState, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import enUS from "date-fns/locale/en-US"; // <--- ES import instead of require()
import "react-big-calendar/lib/css/react-big-calendar.css"; // default styles
// If you want tailwind + custom overrides, you can do that in your global CSS or a separate file

const locales = {
  // direct reference to enUS
  "en-US": enUS,
};

// dateFnsLocalizer config
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loadingError, setLoadingError] = useState(null);

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE;

  // fetch user’s calendar events on mount
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${baseUrl}/calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to load calendar events");
        }
        const data = await res.json();
        // data: array of { id, user_id, date, title, is_blocked, created_at, updated_at }
        // Convert them into Big Calendar's event shape: { id, title, start, end, ... }
        const mapped = data.map((evt) => ({
          id: evt.id,
          title: evt.title || "",
          start: new Date(evt.date),
          end: new Date(evt.date), // simple 1-day events
          allDay: true,
          is_blocked: evt.is_blocked,
        }));
        setEvents(mapped);
      } catch (err) {
        setLoadingError(err.message);
      }
    }
    loadEvents();
  }, [baseUrl, token]);

  if (loadingError) {
    return (
      <div className="text-red-400">
        Error loading calendar events: {loadingError}
      </div>
    );
  }

  // onSelectEvent example
  function handleEventSelect(event) {
    alert(`Event: ${event.title}`);
  }

  // onSelectSlot example
  async function handleSlotSelect(slotInfo) {
    // e.g. ask user for a title
    const userTitle = prompt("Enter event title:");
    if (!userTitle) return;
    try {
      // POST new event to /api/calendar
      const res = await fetch(`${baseUrl}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: slotInfo.start.toISOString().slice(0, 10),
          title: userTitle,
          is_blocked: false,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to create event");
      }
      const created = await res.json();
      // created => { message, event: { id, user_id, date, title, is_blocked, ... } }
      // convert to BigCalendar shape
      const newEvent = {
        id: created.event.id,
        title: created.event.title,
        start: new Date(created.event.date),
        end: new Date(created.event.date),
        allDay: true,
        is_blocked: created.event.is_blocked,
      };
      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Calendar / Availability</h2>
      <div className="card p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onSelectEvent={handleEventSelect}
          selectable
          onSelectSlot={handleSlotSelect}
        />
      </div>
    </div>
  );
}

export default CalendarPage;
