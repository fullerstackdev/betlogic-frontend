import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // remove token from localStorage
    localStorage.removeItem("token");
    // redirect to /auth/login or home page
    navigate("/auth/login");
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}

export default LogoutPage;
