import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const base = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${base}/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error || "Password reset failed");

      alert("Password reset successfully. Please log in.");
      navigate("/auth/login");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-white text-2xl">Reset Your Password</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition-colors"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default ResetPage;
