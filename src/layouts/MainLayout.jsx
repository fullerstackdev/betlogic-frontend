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
      // No token => user not logged in => push them to login
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleToggleSidebarDesktop = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleToggleSidebarMobile = () => {
    setSidebarOpenMobile((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={sidebarCollapsed}
        openMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      {/* RIGHT SECTION: NAVBAR + MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <TopNavbar
            onToggleSidebarDesktop={handleToggleSidebarDesktop}
            onToggleSidebarMobile={handleToggleSidebarMobile}
          />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
