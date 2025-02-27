// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiGift,
  FiEdit,
  FiActivity,
} from "react-icons/fi";
import logo from "../assets/betlogic-logo-with-text.png";
import userAvatar from "../assets/images/users/user1.jpg";

function Sidebar({ collapsed, openMobile, onCloseMobile }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fn = localStorage.getItem("firstName") || "";
    const ln = localStorage.getItem("lastName") || "";
    const combined = (fn + " " + ln).trim();
    if (combined) setUserName(combined);
  }, []);

  const navItems = [
    { to: "/", icon: <FiHome size={18} />, label: "Dashboard" },
    { to: "/finances", icon: <FiDollarSign size={18} />, label: "Finances" },
    { to: "/promotions", icon: <FiGift size={18} />, label: "Promotions" },
    { to: "/tasks", icon: <FiEdit size={18} />, label: "Tasks" },
    { to: "/bets", icon: <FiActivity size={18} />, label: "Bets" },
  ];

  // Desktop sidebar
  const desktopSidebar = (
    <div
      className={`
        hidden md:flex
        flex-col
        bg-[var(--color-dark)]
        text-gray-300
        h-full
        transition-all duration-200
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* LOGO */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-[var(--color-border)]">
        <img src={logo} alt="BetLogic Logo" className="h-8 w-auto" />
      </div>

      {/* NAV */}
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

      {/* PROFILE */}
      <div
        className="border-t border-[var(--color-border)] px-4 py-3 flex items-center cursor-pointer hover:bg-[var(--color-mid)]"
        onClick={() => navigate("/profile")}
      >
        <img
          src={userAvatar}
          alt="User Avatar"
          className="rounded-full h-8 w-8 mr-2"
        />
        {!collapsed && (
          <div>
            <div className="text-white text-sm font-semibold">{userName}</div>
            <div className="text-xs text-gray-400">View Profile</div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile overlay
  const mobileSidebar = openMobile && (
    <div className="md:hidden fixed inset-0 z-50 flex" onClick={onCloseMobile}>
      <div
        className="bg-[var(--color-dark)] text-gray-300 w-64 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center px-4 py-4 border-b border-[var(--color-border)]">
          <img src={logo} alt="BetLogic Logo" className="h-8 w-auto" />
        </div>
        <ul className="list-none m-0 p-0 flex-1 overflow-auto">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 hover:bg-[var(--color-mid)] transition-colors ${
                    isActive ? "bg-[var(--color-mid)]" : ""
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div
          className="border-t border-[var(--color-border)] px-4 py-3 flex items-center cursor-pointer hover:bg-[var(--color-mid)]"
          onClick={() => {
            navigate("/profile");
            onCloseMobile();
          }}
        >
          <img
            src={userAvatar}
            alt="User Avatar"
            className="rounded-full h-8 w-8 mr-2"
          />
          <div>
            <div className="text-white text-sm font-semibold">{userName}</div>
            <div className="text-xs text-gray-400">View Profile</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black bg-opacity-50" />
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
}

export default Sidebar;

