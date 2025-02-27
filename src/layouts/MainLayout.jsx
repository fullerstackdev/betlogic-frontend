// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function MainLayout() {
  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* SIDEBAR */}
      <Sidebar collapsed={false} openMobile={false} onCloseMobile={() => {}} />

      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <TopNavbar onToggleSidebarDesktop={() => {}} onToggleSidebarMobile={() => {}} />
        </div>
        <div className="flex-grow overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
