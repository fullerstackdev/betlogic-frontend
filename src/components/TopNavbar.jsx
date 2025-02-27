// src/components/TopNavbar.jsx
import React, { useState, useEffect } from "react";
import { FiMenu, FiMessageSquare, FiBell, FiChevronDown } from "react-icons/fi";
import userAvatar from "../assets/images/users/user1.jpg"; // Or real user avatar if you store it.

function TopNavbar({ onToggleSidebarDesktop, onToggleSidebarMobile }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User Name"); // default

  useEffect(() => {
    // Read user’s first/last from localStorage, or do a quick fetch if needed.
    const fn = localStorage.getItem("firstName") || "";
    const ln = localStorage.getItem("lastName") || "";
    if (fn || ln) {
      setUserName(`${fn} ${ln}`.trim() || "User");
    } else {
      setUserName("User"); // fallback
    }
  }, []);

  return (
    <div className="relative z-[999] flex items-center justify-between h-12 px-4 bg-[var(--color-dark)] border-b border-[var(--color-border)] text-[var(--color-text)]">
      {/* LEFT SECTION: Sidebar Toggle + Search */}
      <div className="flex items-center">
        {/* Mobile hamburger (< md) */}
        <button
          className="md:hidden hover:text-[var(--color-primary)] mr-2"
          onClick={onToggleSidebarMobile}
        >
          <FiMenu size={20} />
        </button>
        {/* Desktop collapse toggle (hidden < md) */}
        <button
          className="hidden md:inline hover:text-[var(--color-primary)] mr-2"
          onClick={onToggleSidebarDesktop}
        >
          <FiMenu size={20} />
        </button>
        {/* Optional search bar */}
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Search & Enter"
            className="
              bg-[var(--color-panel)]
              border border-[var(--color-border)]
              rounded
              px-2 py-1
              text-sm
              placeholder:text-gray-400
              focus:outline-none
              focus:border-[var(--color-primary)]
            "
          />
        </div>
      </div>

      {/* RIGHT SECTION: Icons + Profile */}
      <div className="flex items-center gap-4">
        {/* Messages Icon (stub) */}
        <div className="relative">
          <button className="hover:text-[var(--color-primary)]">
            <FiMessageSquare size={20} />
          </button>
          <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-[var(--color-accent)] text-white text-xs rounded-full px-1">
            0
          </span>
        </div>

        {/* Notifications Icon (stub) */}
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
                  // Simple logout
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
