// src/layouts/MainLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function MainLayout() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Force login if user not logged in
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleToggleSidebarDesktop = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleSidebarMobile = () => {
    setSidebarOpenMobile(!sidebarOpenMobile);
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* SIDEBAR (desktop or overlay for mobile) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        openMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
        <div className="flex-shrink-0">
          <TopNavbar
            onToggleSidebarDesktop={handleToggleSidebarDesktop}
            onToggleSidebarMobile={handleToggleSidebarMobile}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
