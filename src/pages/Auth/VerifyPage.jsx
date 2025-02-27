// src/pages/auth/VerifyPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function doVerify() {
      try {
        const res = await fetch(import.meta.env.VITE_API_BASE + "/auth/verify/" + token);
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text);
        }
        setMessage(text);
      } catch (err) {
        setError(err.message);
      }
    }
    doVerify();
  }, [token]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  return <p>{message || "Verifying..."}</p>;
}

export default VerifyPage;
