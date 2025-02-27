// src/pages/Auth/VerifyPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const base = import.meta.env.VITE_API_BASE;
        const res = await fetch(`${base}/auth/verify/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verify failed");
        setMessage(data.message || "Email verified. You may login now.");
      } catch (err) {
        setError(err.message);
      }
    }
    verify();
  }, [token]);

  if (error) return <p className="text-red-400">{error}</p>;
  return <p>{message}</p>;
}

export default VerifyPage;
