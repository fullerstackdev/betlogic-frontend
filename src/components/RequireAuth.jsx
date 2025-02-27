// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/useAuth";

function RequireAuth({ requiredRoles = [] }) {
  const { user, token } = useAuth();

  // 1) Check if user has a valid token
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  // 2) If certain roles are required, verify user.role is allowed
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    // Not allowed => either push them to "/" or to an error page
    return <Navigate to="/" replace />;
  }

  // Otherwise, render child routes (the <Outlet>).
  return <Outlet />;
}

export default RequireAuth;
