// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopNavbar from "../components/AdminTopNavbar";

function AdminLayout() {
  return (
    <div className="flex h-screen">
      <div className="transition-all duration-200 w-64">
        <AdminSidebar collapsed={false} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <AdminTopNavbar onToggleSidebar={() => {}} />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
