// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      // Example: "https://betlogic-backend.onrender.com/api"
      const base = import.meta.env.VITE_API_BASE; 
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store token & role
      localStorage.setItem("token", data.token);
      // If your back-end returns {role: "..."} do:
      if (data.role) {
        localStorage.setItem("role", data.role);
      } else {
        // If no role is returned, default user
        localStorage.setItem("role", "user");
      }

      // If the user is admin -> /admin, else -> /
      if (data.role === "admin" || data.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
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
          Log In
        </button>
      </form>

      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <a href="/auth/register" className="text-blue-400 underline">
          Register
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
