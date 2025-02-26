import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyUser } from "../../services/api";

function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function doVerify() {
      try {
        const resp = await verifyUser(token);
        setMessage(resp.message);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) doVerify();
  }, [token]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!message) {
    return <p>Verifying...</p>;
  }

  return <p style={{ color: "green" }}>{message}</p>;
}

export default VerifyPage;
