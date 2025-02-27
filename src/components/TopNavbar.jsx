// src/components/TopNavbar.jsx
import React, { useEffect, useState } from "react";
import { FiMenu, FiMessageSquare, FiBell, FiChevronDown } from "react-icons/fi";
import userAvatar from "../assets/images/users/user1.jpg";

function TopNavbar({ onToggleSidebarDesktop, onToggleSidebarMobile }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fn = localStorage.getItem("firstName") || "";
    const ln = localStorage.getItem("lastName") || "";
    const combined = (fn + " " + ln).trim();
    if (combined) setUserName(combined);
  }, []);

  return (
    <div className="relative z-[999] flex items-center justify-between h-12 px-4 bg-[var(--color-dark)] border-b border-[var(--color-border)] text-[var(--color-text)]">
      {/* LEFT: Sidebar toggles + optional search */}
      <div className="flex items-center">
        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden hover:text-[var(--color-primary)] mr-2"
          onClick={onToggleSidebarMobile}
        >
          <FiMenu size={20} />
        </button>
        {/* DESKTOP COLLAPSE */}
        <button
          className="hidden md:inline hover:text-[var(--color-primary)] mr-2"
          onClick={onToggleSidebarDesktop}
        >
          <FiMenu size={20} />
        </button>
        {/* search bar if needed */}
      </div>

      {/* RIGHT: messages, notifications, profile */}
      <div className="flex items-center gap-4">
        {/* Messages icon */}
        <div className="relative">
          <button className="hover:text-[var(--color-primary)]">
            <FiMessageSquare size={20} />
          </button>
          <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-[var(--color-accent)] text-white text-xs rounded-full px-1">
            0
          </span>
        </div>

        {/* Notifs icon */}
        <div className="relative">
          <button className="hover:text-[var(--color-primary)]">
            <FiBell size={20} />
          </button>
          <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center hover:text-[var(--color-primary)]"
          >
            <img
              src={userAvatar}
              alt="User Avatar"
              className="rounded-full h-8 w-8 mr-2"
            />
            <span className="flex items-center">
              {userName} <FiChevronDown className="ml-1" />
            </span>
          </button>
          {profileOpen && (
            <div
              className="absolute top-10 right-0 bg-white text-black p-2 rounded shadow-md z-[9999] w-40"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/auth/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
