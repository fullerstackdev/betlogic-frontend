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
      console.log("Login request to:", import.meta.env.VITE_API_BASE + "/auth/login");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token & role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      console.log("Stored token & role. Navigating now...");

      // Navigate
      if (data.role === "admin" || data.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  }

  return (
    <div className="w-full text-white">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      {error && <p className="text-neg mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="border rounded px-2 py-1 w-full bg-[var(--color-dark)] text-white"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            className="border rounded px-2 py-1 w-full bg-[var(--color-dark)] text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn">
          Log In
        </button>
      </form>
      <p className="mt-4">
        <a href="/auth/register" className="text-[var(--color-primary)] hover:underline">
          Register
        </a>{" "}
        if you don’t have an account.
      </p>
    </div>
  );
}

export default LoginPage;
