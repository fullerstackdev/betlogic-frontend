// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopNavbar from "../components/AdminTopNavbar";

function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      // Not logged in
      navigate("/auth/login");
    } else if (role !== "admin" && role !== "superadmin") {
      // Logged in but no admin rights
      navigate("/");
    }
  }, [navigate]);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <AdminSidebar collapsed={collapsed} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <AdminTopNavbar onToggleSidebar={handleToggleSidebar} />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
