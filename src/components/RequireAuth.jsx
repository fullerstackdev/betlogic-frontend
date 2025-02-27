// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // stored in LoginPage

  // if no token => go login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // if roles are restricted (like admin only) and our role is not in that array => go "/"
  if (allowedRoles && !allowedRoles.includes(role)) {
    // or navigate("/auth/login") if you prefer
    return <Navigate to="/" replace />;
  }

  // otherwise good
  return <Outlet />;
}

export default RequireAuth;
