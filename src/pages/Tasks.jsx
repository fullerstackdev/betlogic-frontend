// user/Tasks.jsx
import React, { useState, useEffect } from "react";

/**
 * Endpoints used:
 *  GET /api/tasks  => returns an array of tasks
 *  PATCH /api/tasks/:id => update { status }
 *
 * We'll store tasks in 3 columns by status: "todo", "inProgress", "done"
 * Any time we drop a task in a new column, we PATCH the back end.
 */

function Tasks() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragItem, setDragItem] = useState(null);

  const token = localStorage.getItem("token");

  // Load all tasks from GET /api/tasks, then split by status
  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load tasks");
        }
        const taskData = await res.json();
        // group them
        const grouped = {
          todo: taskData.filter((t) => t.status === "todo"),
          inProgress: taskData.filter((t) => t.status === "inProgress"),
          done: taskData.filter((t) => t.status === "done")
        };
        setTasks(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [token]);

  // Drag & drop
  function onDragStart(e, colName, taskIndex) {
    setDragItem({ colName, taskIndex });
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function onDrop(e, newStatus) {
    e.preventDefault();
    if (!dragItem) return;
    const { colName, taskIndex } = dragItem;
    const oldArr = [...tasks[colName]];
    const item = oldArr.splice(taskIndex, 1)[0];

    if (item.status === newStatus) {
      // no change, just revert in the UI
      setDragItem(null);
      return;
    }

    // PATCH the task's status
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/tasks/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update task");
      }
      const updated = await res.json();
      // updated.task => the new item

      // move the item to the new column in the UI
      const newArr = [...tasks[newStatus], updated.task];
      setTasks({
        ...tasks,
        [colName]: oldArr,
        [newStatus]: newArr
      });
    } catch (err) {
      alert(err.message);
      // revert if needed
    } finally {
      setDragItem(null);
    }
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks (Kanban)</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(tasks).map(([colName, items]) => (
          <div
            key={colName}
            className="card min-h-[300px]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, colName)}
          >
            <h3 className="text-lg font-semibold mb-2 uppercase">
              {colName === "todo"
                ? "To Do"
                : colName === "inProgress"
                ? "In Progress"
                : "Done"}
            </h3>
            {items.map((task, taskIndex) => (
              <div
                key={task.id}
                className="bg-panel rounded p-3 mb-2 shadow cursor-move"
                draggable
                onDragStart={(e) => onDragStart(e, colName, taskIndex)}
              >
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm">{task.description}</div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-muted text-sm">No tasks</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
