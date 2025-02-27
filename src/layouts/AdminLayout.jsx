import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token || (userRole !== "admin" && userRole !== "superadmin")) {
      // not admin => redirect
      navigate("/");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  if (!role) {
    return <div>Checking admin access...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px", background: "#222", color: "#fff", padding: "1rem" }}>
        <h2>Admin Panel</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <NavLink
            to="/admin/users"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/finances"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Finances
          </NavLink>
          <NavLink
            to="/admin/promotions"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Promotions
          </NavLink>
          <NavLink
            to="/admin/tasks"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Tasks
          </NavLink>
          <NavLink
            to="/admin/bets"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Bets
          </NavLink>
          <NavLink
            to="/admin/messages"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Messages
          </NavLink>
        </nav>
      </div>
      <div style={{ flex: 1, padding: "1rem", overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
