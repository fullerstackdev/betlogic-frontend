import React, { useEffect, useState } from "react";

function ManageUsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  
  // For editing a user’s details
  const [editModal, setEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    paypal_email: "",
    bank_name: ""
  });

  // For promoting user role
  const [promoteModal, setPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState("");
  const [newRole, setNewRole] = useState("admin");

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openEditModal(u) {
    setEditUser({
      id: u.id,
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      paypal_email: u.paypal_email || "",
      bank_name: u.bank_name || ""
    });
    setEditModal(true);
  }

  async function saveEditUser() {
    try {
      setError("");
      const { id, ...fields } = editUser;
      const res = await fetch(`${base}/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(fields)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }
      setEditModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deactivateUser(uid) {
    try {
      const res = await fetch(`${base}/admin/users/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: uid })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to deactivate user");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  function openPromoteModal(uid) {
    setPromoteUserId(uid);
    setNewRole("admin");
    setPromoteModal(true);
  }

  async function promoteUser() {
    try {
      const res = await fetch(`${base}/admin/users/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: promoteUserId, newRole })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to promote user");
      }
      setPromoteModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Users</h2>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Name</th>
            <th>PayPal</th>
            <th>Bank</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.paypal_email}</td>
              <td>{u.bank_name}</td>
              <td className="space-x-2">
                <button
                  className="btn text-xs"
                  onClick={() => openEditModal(u)}
                >
                  Edit
                </button>
                <button
                  className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)] text-xs"
                  onClick={() => deactivateUser(u.id)}
                >
                  Deactivate
                </button>
                <button
                  className="btn text-xs"
                  onClick={() => openPromoteModal(u.id)}
                >
                  Promote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT USER MODAL */}
      {editModal && (
        <div
          className="modal-backdrop"
          onClick={() => setEditModal(false)}
        >
          <div
            className="modal-content w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Edit User</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">First Name</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editUser.first_name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">Last Name</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editUser.last_name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, last_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">PayPal Email</label>
                <input
                  type="email"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editUser.paypal_email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, paypal_email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm">Bank Name</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={editUser.bank_name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, bank_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={saveEditUser}>
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

      {/* PROMOTE MODAL */}
      {promoteModal && (
        <div
          className="modal-backdrop"
          onClick={() => setPromoteModal(false)}
        >
          <div
            className="modal-content w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Promote User</h3>
            <div className="space-y-2 text-sm">
              <label>New Role:</label>
              <select
                className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">SuperAdmin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={promoteUser}>
                Confirm
              </button>
              <button
                className="btn bg-[var(--color-mid)]"
                onClick={() => setPromoteModal(false)}
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

export default ManageUsersPage;
