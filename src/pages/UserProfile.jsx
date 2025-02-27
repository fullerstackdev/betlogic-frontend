// src/pages/UserProfile.jsx

import React, { useState, useEffect } from "react";

/**
 * Final code for user profile:
 *  - GET /api/users/me => { id, email, first_name, last_name, phone, address, role, created_at, ... }
 *  - PATCH /api/users/me => update any fields
 */
export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${base}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load user profile");
        }
        const data = await res.json(); // e.g. {id, email, first_name, last_name, phone, address, ...}
        setUser(data);
        // prepare form
        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    loadUser();
  }, [base, token]);

  // Toggle edit
  function toggleEdit() {
    setEditMode(!editMode);
  }

  // Save changes
  async function saveChanges() {
    try {
      const body = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        address: form.address,
      };
      const res = await fetch(`${base}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.error || "Failed to update profile");
      }
      // updated => { ...the user data... }
      setUser(updated);
      setForm({
        firstName: updated.first_name || "",
        lastName: updated.last_name || "",
        phone: updated.phone || "",
        address: updated.address || "",
      });
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return (
      <div className="text-red-400 font-semibold animate-pulse">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return <div className="text-sm text-muted animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {!editMode && (
        <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* If you have a user avatar field in DB, show it here */}
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="rounded mb-2"
            />
            <div className="font-bold text-xl">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-sm text-muted">Role: {user.role}</div>
            <div className="text-sm text-muted">
              Joined on: {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "(none)"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "(none)"}
            </p>
          </div>
        </div>
      )}

      {editMode && (
        <div className="card max-w-md space-y-4">
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <div>
            <label className="block text-sm font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Last Name</label>
            <input
              type="text"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="text"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              type="text"
              className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button className="btn" onClick={saveChanges}>
              Save
            </button>
            <button
              className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        {!editMode && (
          <button className="btn" onClick={toggleEdit}>
            Edit Profile
          </button>
        )}
        {editMode && (
          <button className="btn" onClick={() => setEditMode(false)}>
            Discard Changes
          </button>
        )}
      </div>
    </div>
  );
}
