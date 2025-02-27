// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopNavbar from "../components/AdminTopNavbar";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || (role !== "admin" && role !== "superadmin")) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div
        className={`
          transition-all duration-200
          overflow-hidden
          ${sidebarCollapsed ? "w-20" : "w-64"}
        `}
      >
        <AdminSidebar collapsed={sidebarCollapsed} />
      </div>

      {/* RIGHT SECTION: NAVBAR + MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <div className="flex-shrink-0">
          <AdminTopNavbar onToggleSidebar={handleToggleSidebar} />
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
