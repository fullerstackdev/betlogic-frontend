// src/pages/auth/LogoutPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth/login");
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default LogoutPage;
