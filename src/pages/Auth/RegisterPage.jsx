// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.error || "Registration failed");
      }
      // If success, navigate to login
      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <h2 className="text-xl mb-4">Register</h2>
      {error && <p className="text-red-400">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2 w-64">
        <input
          className="border rounded w-full p-2"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="border rounded w-full p-2"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          className="border rounded w-full p-2"
          placeholder="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          className="border rounded w-full p-2"
          placeholder="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
        <button type="submit" className="btn w-full mt-2">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
