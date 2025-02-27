// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles = [] }) {
  // read from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1) If no token => go to /auth/login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2) If we have a token but the role isn't allowed => also go to /auth/login
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/auth/login" replace />;
  }

  // 3) Otherwise, good. Render the child route (MainLayout or AdminLayout)
  return <Outlet />;
}

export default RequireAuth;
