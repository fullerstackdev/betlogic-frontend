// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiGift,
  FiEdit,
  FiActivity,
  FiLogOut
} from "react-icons/fi";
import logo from "../assets/betlogic-logo-with-text.png";
import userAvatar from "../assets/images/users/user1.jpg"; 

function Sidebar({ collapsed, openMobile, onCloseMobile }) {
  const navigate = useNavigate();

  const navItems = [
    { to: "/", icon: <FiHome size={18} />, label: "Dashboard" },
    { to: "/finances", icon: <FiDollarSign size={18} />, label: "Finances" },
    { to: "/promotions", icon: <FiGift size={18} />, label: "Promotions" },
    { to: "/tasks", icon: <FiEdit size={18} />, label: "Tasks" },
    { to: "/bets", icon: <FiActivity size={18} />, label: "Bets" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth/login");
  }

  return (
    <div>
      {/* DESKTOP SIDEBAR */}
      <div
        className={`
          hidden md:flex
          bg-[var(--color-dark)] text-gray-300 h-full
          flex-col
          transition-all duration-200
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-center px-4 py-4 border-b border-[var(--color-border)]">
          <img 
            src={logo} 
            alt="BetLogic Logo" 
            className="h-8 w-auto"
          />
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

        {/* BOTTOM PROFILE */}
        <div className="border-t border-[var(--color-border)] px-4 py-3 flex items-center">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="rounded-full h-8 w-8 mr-2"
          />
          {!collapsed && (
            <div className="flex flex-col text-sm">
              <span className="text-white font-semibold">John Deo</span>
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

      {/* MOBILE OVERLAY SIDEBAR */}
      {openMobile && (
        <div 
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={onCloseMobile}
        >
          {/* Sidebar panel */}
          <div
            className="
              bg-[var(--color-dark)]
              text-gray-300
              w-64
              flex flex-col
              transition-transform
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* LOGO */}
            <div className="flex items-center justify-center px-4 py-4 border-b border-[var(--color-border)]">
              <img 
                src={logo} 
                alt="BetLogic Logo" 
                className="h-8 w-auto"
              />
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
                    onClick={onCloseMobile}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* BOTTOM PROFILE */}
            <div
              className="border-t border-[var(--color-border)] px-4 py-3 flex items-center"
            >
              <img
                src={userAvatar}
                alt="User Avatar"
                className="rounded-full h-8 w-8 mr-2"
              />
              <div className="flex flex-col text-sm">
                <span className="text-white font-semibold">John Deo</span>
                <button
                  onClick={() => {
                    handleLogout();
                    onCloseMobile();
                  }}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-1"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="flex-1 bg-black bg-opacity-50" />
        </div>
      )}
    </div>
  );
}

export default Sidebar;
