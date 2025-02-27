// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiDollarSign,
  FiGift,
  FiUsers,
  FiEdit,
  FiMessageSquare,
  FiCalendar,
  FiLogOut
} from "react-icons/fi";
import adminLogo from "../assets/betlogic-logo-with-text.png"; 
import adminAvatar from "../assets/images/users/user2.jpg";  

function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();

  const navItems = [
    { to: "/admin", icon: <FiBarChart2 size={18} />, label: "Dashboard" },
    { to: "/admin/finances", icon: <FiDollarSign size={18} />, label: "Finances" },
    { to: "/admin/promotions", icon: <FiGift size={18} />, label: "Promotions" },
    { to: "/admin/users", icon: <FiUsers size={18} />, label: "Users" },
    { to: "/admin/tasks", icon: <FiEdit size={18} />, label: "Tasks" },
    { to: "/admin/messages", icon: <FiMessageSquare size={18} />, label: "Messages" },
    { to: "/admin/calendar", icon: <FiCalendar size={18} />, label: "Calendar" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth/login");
  }

  return (
    <div
      className={`bg-[var(--color-dark)] text-gray-300 h-full flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-200`}
    >
      {/* LOGO SECTION */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-[var(--color-border)]">
        <img 
          src={adminLogo}
          alt="Admin Logo"
          className="h-8 w-auto"
        />
      </div>

      {/* NAVIGATION */}
      <ul className="list-none m-0 p-0 flex-1 overflow-auto">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 hover:bg-[var(--color-mid)] transition-colors ${
                  isActive ? "bg-[var(--color-mid)]" : ""
                }`
              }
            >
              <span className={`${collapsed ? "w-full text-center" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* PROFILE SECTION AT THE BOTTOM */}
      <div className="border-t border-[var(--color-border)] px-4 py-3 flex items-center">
        <img
          src={adminAvatar}
          alt="Admin Avatar"
          className="rounded-full h-8 w-8 mr-2"
        />
        {!collapsed && (
          <div className="flex flex-col text-sm">
            <span className="text-white font-semibold">Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-1"
            >
              <FiLogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSidebar;
