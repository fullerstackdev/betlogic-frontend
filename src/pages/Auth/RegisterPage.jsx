// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const base = import.meta.env.VITE_API_BASE; 
      const res = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Registration success. Please verify email if needed, then login.");
      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p className="text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label>First Name:</label>
          <input
            type="text"
            className="border w-full p-2 bg-gray-700 text-white"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            className="border w-full p-2 bg-gray-700 text-white"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            className="border w-full p-2 bg-gray-700 text-white"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            className="border w-full p-2 bg-gray-700 text-white"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn w-full mt-3">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
