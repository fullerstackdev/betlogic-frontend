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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // store token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // redirect
      if (data.role === "admin" || data.role === "superadmin") {
        navigate("/admin/users");
      } else {
        // normal user
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border w-full p-2 bg-[var(--color-dark)] text-white"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border w-full p-2 bg-[var(--color-dark)] text-white"
            required
          />
        </div>

        <button type="submit" className="btn w-full mt-2">
          Log In
        </button>
      </form>

      <p className="mt-4 text-sm">
        <a href="/auth/register" className="underline text-[var(--color-primary)]">
          Register
        </a>{" "}
        if you don’t have an account.
      </p>
    </div>
  );
}

export default LoginPage;
