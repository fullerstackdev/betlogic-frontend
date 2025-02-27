// user/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName") || "John";
  const lastName = localStorage.getItem("lastName") || "Deo";
  const fullName = (firstName + " " + lastName).trim();

  // Finances partial detail
  const [moneyIn, setMoneyIn] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const [showFinancesModal, setShowFinancesModal] = useState(false);

  // Pending tasks
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  // Promotions in progress
  const [promotionsInProgress, setPromotionsInProgress] = useState([]);

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newCalEvent, setNewCalEvent] = useState({ date: "", title: "" });

  // 1) Load finances
  useEffect(() => {
    async function loadFinances() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/finances/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load transactions");
        }
        const txData = await res.json();
        let inSum = 0;
        let outSum = 0;
        txData.forEach((tx) => {
          if (tx.to_account_name === "User Bank") {
            inSum += Number(tx.amount);
          }
          if (tx.from_account_name === "User Bank") {
            outSum += Number(tx.amount);
          }
        });
        setMoneyIn(inSum);
        setMoneyOut(outSum);
      } catch (err) {
        console.error("Finances error:", err.message);
      }
    }
    loadFinances();
  }, [token]);

  // 2) Load tasks
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load tasks");
        }
        const tasksData = await res.json();
        const todoCount = tasksData.filter((t) => t.status === "todo").length;
        setPendingTasksCount(todoCount);
      } catch (err) {
        console.error("Tasks error:", err.message);
      }
    }
    loadTasks();
  }, [token]);

  // 3) Load promotions
  useEffect(() => {
    async function loadPromos() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/promotions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load promotions");
        }
        const promoData = await res.json();
        // filter out archived
        const inProgressList = promoData.filter((p) => p.status !== "archived");
        setPromotionsInProgress(inProgressList);
      } catch (err) {
        console.error("Promotions error:", err.message);
      }
    }
    loadPromos();
  }, [token]);

  // 4) Load calendar
  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/calendar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load calendar events");
        }
        const calData = await res.json();
        setCalendarEvents(calData);
      } catch (err) {
        console.error("Calendar error:", err.message);
      }
    }
    loadCalendar();
  }, [token]);

  async function addCalendarEvent() {
    if (!newCalEvent.date || !newCalEvent.title) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: newCalEvent.date,
          title: newCalEvent.title,
          is_blocked: false,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create calendar event");
      }
      const created = await res.json();
      setCalendarEvents([...calendarEvents, created.event]);
      setNewCalEvent({ date: "", title: "" });
    } catch (err) {
      alert(err.message);
    }
  }

  const netBalance = moneyIn - moneyOut;
  const monthlyChange = "+3% vs last month"; 

  // Show only first 2
  const coursesToShow = promotionsInProgress.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Greeting */}
        <div
          className="
            card 
            flex 
            flex-col 
            justify-center 
            p-4 
            bg-gradient-to-r 
            from-[var(--color-primary)] 
            to-[var(--color-accent)] 
            text-white
          "
        >
          <h2 className="text-xl font-bold mb-1">Hello, {fullName}!</h2>
          <p className="text-sm">Welcome back to your BetLogic dashboard.</p>
        </div>

        {/* Finances partial detail */}
        <div 
          className="card p-4 cursor-pointer"
          onClick={() => setShowFinancesModal(true)}
        >
          <h3 className="text-sm text-muted mb-1">Finances Overview</h3>
          <div className="text-2xl font-bold">${netBalance}</div>
          <p className="text-xs text-pos mt-1">{monthlyChange}</p>
          <p className="text-xs text-muted mt-2">Click for more details</p>
        </div>

        {/* Pending Tasks */}
        <div className="card p-4 flex flex-col">
          <h3 className="text-sm text-muted mb-1">Pending Tasks</h3>
          <div className="text-2xl font-bold">{pendingTasksCount} Tasks</div>
          <p className="text-xs text-muted mt-1">Go to your Kanban board</p>
          <button className="btn mt-auto" onClick={() => navigate("/tasks")}>
            Go to Tasks
          </button>
        </div>
      </div>

      {/* Row 2: promotions + calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Promotions */}
        <div className="card p-4">
          <h3 className="text-sm text-muted mb-2">Promotions In Progress</h3>
          {coursesToShow.length === 0 && <p>No promotions found.</p>}
          <div className="space-y-3">
            {coursesToShow.map((p) => (
              <div key={p.id} className="bg-panel p-3 rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{p.title}</div>
                    {/* If p.progress_pct, show it here */}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn text-xs"
                      onClick={() => navigate(`/promotions/${p.id}/take`)}
                    >
                      Resume
                    </button>
                    <button
                      className="btn text-xs bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                      onClick={() => navigate(`/promotions/${p.id}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini calendar + event list */}
        <div className="grid grid-rows-2 gap-4">
          <div className="card p-4">
            <h3 className="text-sm text-muted mb-2">Quick Calendar</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="border rounded px-2 py-1 bg-[var(--color-dark)] text-white"
                value={newCalEvent.date}
                onChange={(e) => setNewCalEvent({ ...newCalEvent, date: e.target.value })}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 bg-[var(--color-dark)] text-white"
                placeholder="Title"
                value={newCalEvent.title}
                onChange={(e) => setNewCalEvent({ ...newCalEvent, title: e.target.value })}
              />
              <button className="btn" onClick={addCalendarEvent}>
                Add
              </button>
            </div>
            <button className="btn text-xs mt-2" onClick={() => navigate("/calendar")}>
              Full Calendar
            </button>
          </div>

          <div className="card p-4">
            <h3 className="text-sm text-muted mb-2">My Recent Events</h3>
            <div className="h-32 overflow-auto text-sm">
              {calendarEvents.length === 0 && <p>No events</p>}
              {calendarEvents.map((evt) => (
                <div key={evt.id} className="mb-1 p-1 bg-[var(--color-mid)] rounded">
                  <strong>{evt.date}</strong>: {evt.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Finances partial detail modal */}
      {showFinancesModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowFinancesModal(false)}
        >
          <div className="modal-content w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Finances Overview</h3>
            <p className="text-sm mb-2">
              <strong>Total Money In:</strong> ${moneyIn}<br />
              <strong>Total Money Out:</strong> ${moneyOut}<br />
              <strong>Net Balance:</strong> ${netBalance}<br />
            </p>
            <p className="text-xs text-pos mb-4">{monthlyChange}</p>
            <button
              className="btn mr-2"
              onClick={() => {
                navigate("/finances");
                setShowFinancesModal(false);
              }}
            >
              View All Finances
            </button>
            <button
              className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
              onClick={() => setShowFinancesModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
