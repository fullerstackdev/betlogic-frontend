import React, { useEffect, useState } from "react";

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function promoteUser(userId, newRole) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/users/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newRole })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to promote user");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deactivateUser(userId) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/users/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Manage Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>PayPal</th>
            <th>Bank Name</th>
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
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.paypal_email}</td>
              <td>{u.bank_name}</td>
              <td>
                {u.role !== "admin" && u.role !== "superadmin" && (
                  <button onClick={() => promoteUser(u.id, "admin")}>Promote to Admin</button>
                )}
                {u.role !== "superadmin" && (
                  <button onClick={() => deactivateUser(u.id)}>Deactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsersPage;
