import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const base = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Registration successful! Please verify your email before logging in.");
      navigate("/auth/login");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <input
        type="text"
        placeholder="First Name"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email address"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-center text-sm text-gray-400">
        Already registered?{" "}
        <Link
          to="/auth/login"
          className="text-blue-400 hover:text-blue-200 font-semibold"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default RegisterPage;
