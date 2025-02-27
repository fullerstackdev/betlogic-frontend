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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send the user’s data to your back-end endpoint
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // If your back end sends a success message
      // but doesn't auto-login, we just navigate to login:
      setLoading(false);
      alert("Registration successful! Check your email for verification link.");
      navigate("/auth/login");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="border w-full p-2 bg-[var(--color-dark)] text-white"
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="border w-full p-2 bg-[var(--color-dark)] text-white"
            required
          />
        </div>
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
        <button type="submit" className="btn w-full mt-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="underline text-[var(--color-primary)]">
          Login
        </a>
      </p>
    </div>
  );
}

export default RegisterPage;
