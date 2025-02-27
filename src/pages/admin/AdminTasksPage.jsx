import React, { useEffect, useState } from "react";

function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({
    user_id: "",
    title: "",
    description: "",
    status: "todo"
  });

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch tasks");
      }
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = newTask;
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Admin Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createTask} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Create Task for Any User</h3>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={newTask.user_id}
            onChange={e => setNewTask({ ...newTask, user_id: e.target.value })}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={newTask.status}
            onChange={e => setNewTask({ ...newTask, status: e.target.value })}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.user_id}</td>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.status}</td>
              <td>{t.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTasksPage;
