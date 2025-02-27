import React, { useEffect, useState } from "react";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo"
  });

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/tasks", {
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
      const res = await fetch(import.meta.env.VITE_API_BASE + "/tasks", {
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
      // refresh
      setNewTask({ title: "", description: "", status: "todo" });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateTask(taskId, patchData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/tasks/" + taskId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patchData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update task");
      }
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // group tasks by status
  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "inProgress");
  const doneTasks = tasks.filter(t => t.status === "done");

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>My Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createTask} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={e => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "1rem" }}>
          <h3>To Do</h3>
          {todoTasks.map(t => (
            <div key={t.id} style={{ border: "1px solid #999", marginBottom: "0.5rem", padding: "0.5rem" }}>
              <strong>{t.title}</strong>
              <p>{t.description}</p>
              <button onClick={() => updateTask(t.id, { status: "inProgress" })}>Move to In Progress</button>
              <button onClick={() => updateTask(t.id, { status: "done" })}>Move to Done</button>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "1rem" }}>
          <h3>In Progress</h3>
          {inProgressTasks.map(t => (
            <div key={t.id} style={{ border: "1px solid #999", marginBottom: "0.5rem", padding: "0.5rem" }}>
              <strong>{t.title}</strong>
              <p>{t.description}</p>
              <button onClick={() => updateTask(t.id, { status: "todo" })}>Move to To Do</button>
              <button onClick={() => updateTask(t.id, { status: "done" })}>Move to Done</button>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Done</h3>
          {doneTasks.map(t => (
            <div key={t.id} style={{ border: "1px solid #999", marginBottom: "0.5rem", padding: "0.5rem" }}>
              <strong>{t.title}</strong>
              <p>{t.description}</p>
              <button onClick={() => updateTask(t.id, { status: "todo" })}>Move to To Do</button>
              <button onClick={() => updateTask(t.id, { status: "inProgress" })}>Move to In Progress</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
