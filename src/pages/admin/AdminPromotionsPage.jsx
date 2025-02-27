import React, { useEffect, useState } from "react";

function AdminPromotionsPage() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState("");
  const [newPromo, setNewPromo] = useState({
    title: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    sportsbook_name: "",
    status: "active"
  });

  async function fetchPromotions() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/promotions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch promotions");
      }
      setPromos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createPromotion(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = newPromo;
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create promotion");
      }
      setNewPromo({
        title: "",
        description: "",
        image_url: "",
        start_date: "",
        end_date: "",
        sportsbook_name: "",
        status: "active"
      });
      fetchPromotions();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updatePromotion(id, patchData) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/promotions/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patchData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update promotion");
      }
      fetchPromotions();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div>
      <h2>Admin Promotions</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createPromotion} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Create Promotion</h3>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={newPromo.title}
            onChange={e => setNewPromo({ ...newPromo, title: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={newPromo.description}
            onChange={e => setNewPromo({ ...newPromo, description: e.target.value })}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={newPromo.image_url}
            onChange={e => setNewPromo({ ...newPromo, image_url: e.target.value })}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={newPromo.start_date}
            onChange={e => setNewPromo({ ...newPromo, start_date: e.target.value })}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={newPromo.end_date}
            onChange={e => setNewPromo({ ...newPromo, end_date: e.target.value })}
          />
        </div>
        <div>
          <label>Sportsbook Name:</label>
          <input
            type="text"
            value={newPromo.sportsbook_name}
            onChange={e => setNewPromo({ ...newPromo, sportsbook_name: e.target.value })}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={newPromo.status}
            onChange={e => setNewPromo({ ...newPromo, status: e.target.value })}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Sportsbook</th>
            <th>Status</th>
            <th>Dates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.sportsbook_name}</td>
              <td>{p.status}</td>
              <td>{p.start_date} - {p.end_date}</td>
              <td>
                <button onClick={() => updatePromotion(p.id, { status: "archived" })}>
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPromotionsPage;
