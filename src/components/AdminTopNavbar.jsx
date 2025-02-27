// src/components/AdminTopNavbar.jsx
import React, { useState } from "react";
import { FiMenu, FiMessageSquare, FiBell, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import adminAvatar from "../assets/images/users/user2.jpg";

function AdminTopNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth/login");
  }

  return (
    <div className="relative z-[999] flex items-center justify-between h-12 px-4 bg-[var(--color-dark)] border-b border-[var(--color-border)] text-[var(--color-text)]">
      {/* LEFT SECTION: Sidebar Toggle + Search */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-4 hover:text-[var(--color-primary)]"
        >
          <FiMenu size={20} />
        </button>
        <div>
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
        {/* Messages */}
        <div className="relative">
          <button className="hover:text-[var(--color-primary)]">
            <FiMessageSquare size={20} />
          </button>
          <span
            className="
              absolute top-0 right-0 -mt-1 -mr-2
              bg-[var(--color-accent)]
              text-white
              text-xs
              rounded-full
              px-1
            "
          >
            5
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="hover:text-[var(--color-primary)]">
            <FiBell size={20} />
          </button>
          <span
            className="
              absolute top-0 right-0 -mt-1 -mr-2
              bg-red-600
              text-white
              text-xs
              rounded-full
              px-1
            "
          >
            2
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center hover:text-[var(--color-primary)]"
          >
            <img
              src={adminAvatar}
              alt="Admin Avatar"
              className="rounded-full h-8 w-8 mr-2"
            />
            <span className="flex items-center">
              Admin <FiChevronDown className="ml-1" />
            </span>
          </button>

          {profileOpen && (
            <div
              className="
                absolute top-10 right-0
                bg-white
                text-black
                p-2
                rounded
                shadow-md
                z-[9999]
                w-40
              "
            >
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                Profile
              </button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                Settings
              </button>
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-red-600"
                onClick={handleLogout}
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

export default AdminTopNavbar;
