import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const base = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "user");
      localStorage.setItem("firstName", data.firstName || "");
      localStorage.setItem("lastName", data.lastName || "");

      navigate(data.role === "admin" || data.role === "superadmin" ? "/admin" : "/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

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
        {loading ? "Logging in..." : "Log In"}
      </button>

      <div className="flex flex-col items-center text-sm text-gray-400 space-y-2">
        <Link to="/auth/forgot" className="hover:text-gray-200">
          Forgot Password?
        </Link>
        <span>
          Not registered?{" "}
          <Link
            to="/auth/register"
            className="text-blue-400 hover:text-blue-200 font-semibold"
          >
            Register Now
          </Link>
        </span>
      </div>
    </form>
  );
}

export default LoginPage;
