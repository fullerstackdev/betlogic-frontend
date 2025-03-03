import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const base = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetch(`${base}/auth/verify/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMessage(data.message);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl text-white">Email Verification</h2>
      {message && <p className="text-green-400">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Link to="/auth/login" className="text-blue-400 hover:text-blue-200 font-semibold">
        Proceed to Login
      </Link>
    </div>
  );
}

export default VerifyPage;
