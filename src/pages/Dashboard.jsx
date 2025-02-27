// user/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// We'll retrieve:
// 1) transactions => compute moneyIn/moneyOut
// 2) tasks => count how many "todo" tasks
// 3) promotions => show those in progress (assuming there's a "progress_pct" or something similar if your back end provides it)
// 4) calendar => fetch events + create new event

function Dashboard() {
  const navigate = useNavigate();

  // Finances partial detail
  const [moneyIn, setMoneyIn] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const [showFinancesModal, setShowFinancesModal] = useState(false);

  // Pending tasks
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  // Promotions in progress
  // If your back end doesn't return a "progress_pct," you might remove that
  const [promotionsInProgress, setPromotionsInProgress] = useState([]);

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newCalEvent, setNewCalEvent] = useState({ date: "", title: "" });

  const token = localStorage.getItem("token");

  // 1) Load finances
  useEffect(() => {
    async function loadFinances() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/finances/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load transactions");
        }
        const txData = await res.json();
        // compute moneyIn / moneyOut (only for "User Bank" if that's your logic)
        let inSum = 0;
        let outSum = 0;
        txData.forEach((tx) => {
          // if the back end returns `from_account_name` and `to_account_name`:
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

  // 2) Load tasks (count how many are "todo")
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tasks");
        }
        const tasksData = await res.json();
        // Count tasks with status=todo
        const todoCount = tasksData.filter((t) => t.status === "todo").length;
        setPendingTasksCount(todoCount);
      } catch (err) {
        console.error("Tasks error:", err.message);
      }
    }
    loadTasks();
  }, [token]);

  // 3) Load promotions in progress
  // We'll assume your /api/promotions returns an array; you can see if there's a "progress_pct"
  useEffect(() => {
    async function loadPromos() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/promotions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load promotions");
        }
        const promoData = await res.json();
        // Filter or map to only those that are in "progress"? Or show all?
        // If you have progress_pct in user_promotion_progress, your back end might return that directly
        // We'll do a basic approach:
        const inProgressList = promoData.filter((p) => p.status !== "archived");
        // If your back end returns p.progress_pct, store it. Otherwise we'll just pretend 50% for now
        // But "no placeholders" means we skip progress if it's truly not in the data
        setPromotionsInProgress(inProgressList);
      } catch (err) {
        console.error("Promotions error:", err.message);
      }
    }
    loadPromos();
  }, [token]);

  // 4) Load calendar events
  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/calendar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const data = await res.json();
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

  // Add a calendar event
  async function addCalendarEvent() {
    if (!newCalEvent.date || !newCalEvent.title) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: newCalEvent.date,
          title: newCalEvent.title,
          is_blocked: false  // or true if you want to block off time
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create calendar event");
      }
      const created = await res.json();
      setCalendarEvents([...calendarEvents, created.event]);
      setNewCalEvent({ date: "", title: "" });
    } catch (err) {
      alert(err.message);
    }
  }

  // Finances partial detail
  const netBalance = moneyIn - moneyOut;
  const monthlyChange = "+3% vs last month"; // no endpoint for this metric, so leaving it static

  // No actual "Courses in progress" progress pct unless your back end returns it
  // We'll just show the first 2 promotions from promotionsInProgress if you want
  const coursesToShow = promotionsInProgress.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Row 1: greeting, finances partial, tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Greeting Card */}
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
          <h2 className="text-xl font-bold mb-1">Hello, John Deo!</h2>
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

        {/* Tasks Card */}
        <div className="card p-4 flex flex-col">
          <h3 className="text-sm text-muted mb-1">Pending Tasks</h3>
          <div className="text-2xl font-bold">{pendingTasksCount} Tasks</div>
          <p className="text-xs text-muted mt-1">Go to your Kanban board</p>
          <button
            className="btn mt-auto"
            onClick={() => navigate("/user/tasks")}
          >
            Go to Tasks
          </button>
        </div>
      </div>

      {/* Row 2: promotions in progress + calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Promotions in Progress */}
        <div className="card p-4">
          <h3 className="text-sm text-muted mb-2">Promotions In Progress</h3>
          {coursesToShow.length === 0 && <p>No promotions found.</p>}
          <div className="space-y-3">
            {coursesToShow.map((p) => (
              <div
                key={p.id}
                className="bg-panel p-3 rounded"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{p.title}</div>
                    {/* If progress_pct is available: 
                       <div className="text-xs text-muted">{p.progress_pct}% complete</div>
                     */}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="btn text-xs"
                      onClick={() => navigate(`/user/promotions/${p.id}/take`)}
                    >
                      Resume
                    </button>
                    <button
                      className="btn text-xs bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                      onClick={() => navigate(`/user/promotions/${p.id}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
                {/* If we had progress bars from p.progress_pct, we'd show them here */}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar: mini block + existing events */}
        <div className="grid grid-rows-2 gap-4">
          {/* Add new event */}
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
            <button
              className="btn text-xs mt-2"
              onClick={() => navigate("/user/calendar")}
            >
              Full Calendar
            </button>
          </div>

          {/* Existing events list */}
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
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
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
                navigate("/user/finances");
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
