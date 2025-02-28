import React, { useEffect, useState } from "react";

function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create new promo
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromo, setNewPromo] = useState({
    title: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    sportsbook_name: "",
    status: "active"
  });

  // Possibly an “edit” modal
  const [editModal, setEditModal] = useState(false);
  const [editPromo, setEditPromo] = useState({}); 

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchPromotions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/promotions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch admin promotions");
      }
      setPromotions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function handleCreatePromo(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${base}/admin/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPromo)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create promotion");
      }
      setShowCreateModal(false);
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

  function openEditModal(promo) {
    setEditPromo({ ...promo }); 
    setEditModal(true);
  }

  async function saveEditPromo() {
    try {
      setError("");
      const { id, ...fields } = editPromo;
      const res = await fetch(`${base}/admin/promotions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update promotion");
      }
      setEditModal(false);
      fetchPromotions();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Loading admin promotions...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Promotions</h2>
      <button
        className="btn"
        onClick={() => setShowCreateModal(true)}
      >
        + Create Promotion
      </button>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Sportsbook</th>
            <th>Dates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.status}</td>
              <td>{p.sportsbook_name}</td>
              <td>
                {p.start_date?.slice(0,10)} → {p.end_date?.slice(0,10)}
              </td>
              <td>
                <button
                  className="btn text-xs"
                  onClick={() => openEditModal(p)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Create Promotion</h3>
            <form onSubmit={handleCreatePromo} className="space-y-2 text-sm">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  required
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                />
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.image_url}
                  onChange={(e) => setNewPromo({ ...newPromo, image_url: e.target.value })}
                />
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.start_date}
                  onChange={(e) => setNewPromo({ ...newPromo, start_date: e.target.value })}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.end_date}
                  onChange={(e) => setNewPromo({ ...newPromo, end_date: e.target.value })}
                />
              </div>
              <div>
                <label>Sportsbook Name</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.sportsbook_name}
                  onChange={(e) => setNewPromo({ ...newPromo, sportsbook_name: e.target.value })}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newPromo.status}
                  onChange={(e) => setNewPromo({ ...newPromo, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
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

      {/* EDIT MODAL */}
      {editModal && (
        <div
          className="modal-backdrop"
          onClick={() => setEditModal(false)}
        >
          <div
            className="modal-content w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Edit Promotion</h3>
            <div className="space-y-2 text-sm">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.title || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, title: e.target.value })}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.description || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, description: e.target.value })}
                />
              </div>
              <div>
                <label>Image URL</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.image_url || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, image_url: e.target.value })}
                />
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.start_date?.slice(0,10) || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, start_date: e.target.value })}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.end_date?.slice(0,10) || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, end_date: e.target.value })}
                />
              </div>
              <div>
                <label>Sportsbook Name</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.sportsbook_name || ""}
                  onChange={(e) => setEditPromo({ ...editPromo, sportsbook_name: e.target.value })}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editPromo.status || "active"}
                  onChange={(e) => setEditPromo({ ...editPromo, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={saveEditPromo}>
                Save
              </button>
              <button
                className="btn bg-[var(--color-mid)]"
                onClick={() => setEditModal(false)}
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

export default AdminPromotionsPage;
