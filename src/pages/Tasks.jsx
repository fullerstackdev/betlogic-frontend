// src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [error, setError] = useState("");
  const [dragItem, setDragItem] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const base = import.meta.env.VITE_API_BASE;
        const token = localStorage.getItem("token");
        const res = await fetch(`${base}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load tasks");
        }
        const data = await res.json();
        // Suppose your server returns an array of tasks, each with {id, title, description, status="todo|inProgress|done"}
        // We must distribute them into { todo:[], inProgress:[], done:[] } based on their status.
        const grouped = { todo: [], inProgress: [], done: [] };
        data.forEach((t) => {
          if (t.status === "inProgress") {
            grouped.inProgress.push(t);
          } else if (t.status === "done") {
            grouped.done.push(t);
          } else {
            grouped.todo.push(t);
          }
        });
        setTasks(grouped);
      } catch (err) {
        setError(err.message);
      }
    }
    loadTasks();
  }, []);

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  function onDragStart(e, colIndex, taskIndex) {
    setDragItem({ colIndex, taskIndex });
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e, newColName) {
    e.preventDefault();
    if (!dragItem) return;
    const cols = Object.keys(tasks);
    const oldColName = cols[dragItem.colIndex];
    const item = tasks[oldColName][dragItem.taskIndex];

    // remove from old column
    const oldArr = [...tasks[oldColName]];
    oldArr.splice(dragItem.taskIndex, 1);

    // add to new column
    const newArr = [...tasks[newColName], item];

    setTasks({
      ...tasks,
      [oldColName]: oldArr,
      [newColName]: newArr,
    });
    setDragItem(null);

    // Optional: call a PATCH /api/tasks/:id to update the status in DB
    // e.g.:
    // patchTaskStatus(item.id, newColName === 'inProgress' ? 'inProgress' : newColName );
  }

  const cols = Object.entries(tasks); // [["todo", [...]], ["inProgress", [...]], ["done", [...]]]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks (Kanban)</h2>
      <div className="grid grid-cols-3 gap-4">
        {cols.map(([colName, items], colIndex) => (
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
                onDragStart={(e) => onDragStart(e, colIndex, taskIndex)}
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
