import React, { useEffect, useState } from "react";

/**
 * AdminTasksPage
 * - fetches all tasks
 * - can create new tasks for any user
 * - shows them in simple columns by status
 */

function AdminTasksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]); // array of raw tasks from DB
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    user_id: "",
    title: "",
    description: "",
    status: "todo"
  });

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch admin tasks");
      }
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function createTask(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${base}/admin/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }
      setShowCreateModal(false);
      setNewTask({
        user_id: "",
        title: "",
        description: "",
        status: "todo"
      });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  // Let's group tasks by status to do a simple 3-column layout
  const grouped = { todo: [], inProgress: [], done: [], other: [] };
  tasks.forEach(t => {
    if (t.status === "todo") grouped.todo.push(t);
    else if (t.status === "inProgress") grouped.inProgress.push(t);
    else if (t.status === "done") grouped.done.push(t);
    else grouped.other.push(t);
  });

  if (loading) return <div>Loading admin tasks...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Tasks</h2>
      <button className="btn" onClick={() => setShowCreateModal(true)}>
        + Create Task
      </button>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {/* Column for todo */}
        <div className="card min-h-[300px]">
          <h3 className="text-lg font-bold mb-2 uppercase">To Do</h3>
          {grouped.todo.map(t => (
            <div key={t.id} className="bg-panel p-2 mb-2 rounded text-sm">
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-muted">
                User #{t.user_id} | {t.description}
              </p>
            </div>
          ))}
          {grouped.todo.length === 0 && <p>No tasks in To Do</p>}
        </div>
        {/* inProgress */}
        <div className="card min-h-[300px]">
          <h3 className="text-lg font-bold mb-2 uppercase">In Progress</h3>
          {grouped.inProgress.map(t => (
            <div key={t.id} className="bg-panel p-2 mb-2 rounded text-sm">
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-muted">
                User #{t.user_id} | {t.description}
              </p>
            </div>
          ))}
          {grouped.inProgress.length === 0 && <p>No tasks in progress</p>}
        </div>
        {/* done */}
        <div className="card min-h-[300px]">
          <h3 className="text-lg font-bold mb-2 uppercase">Done</h3>
          {grouped.done.map(t => (
            <div key={t.id} className="bg-panel p-2 mb-2 rounded text-sm">
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-muted">
                User #{t.user_id} | {t.description}
              </p>
            </div>
          ))}
          {grouped.done.length === 0 && <p>No tasks done</p>}
        </div>
        {/* other */}
        <div className="card min-h-[300px]">
          <h3 className="text-lg font-bold mb-2 uppercase">Other Status</h3>
          {grouped.other.map(t => (
            <div key={t.id} className="bg-panel p-2 mb-2 rounded text-sm">
              <p className="font-semibold">{t.title}</p>
              <p className="text-xs text-muted">
                User #{t.user_id} | status={t.status}
              </p>
              <p className="text-xs text-muted">{t.description}</p>
            </div>
          ))}
          {grouped.other.length === 0 && <p>No tasks here</p>}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Create Task</h3>
            <form onSubmit={createTask} className="space-y-2">
              <div>
                <label>User ID</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  required
                  value={newTask.user_id}
                  onChange={(e) => setNewTask({ ...newTask, user_id: e.target.value })}
                />
              </div>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="btn">Create</button>
                <button
                  type="button"
                  className="btn bg-[var(--color-mid)]"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTasksPage;
