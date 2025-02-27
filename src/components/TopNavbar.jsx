// src/components/TopNavbar.jsx
import React, { useState } from "react";
import { FiMenu, FiMessageSquare, FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import userAvatar from "../assets/images/users/user1.jpg";

function TopNavbar({ onToggleSidebarDesktop, onToggleSidebarMobile }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgsOpen, setMsgsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Deposit Confirmed", desc: "Your $500 deposit was successful." },
    { id: 2, title: "Promo Expiring", desc: "BetMGM signup steps expire soon!" },
  ];

  const messages = [
    { id: 1, from: "Admin", snippet: "Need more info on deposit..." },
    { id: 2, from: "Support", snippet: "Promo question answered." },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth/login");
  }

  return (
    <div
      className="
        relative
        z-[999]
        flex
        items-center
        justify-between
        h-12
        px-4
        bg-[var(--color-dark)]
        border-b
        border-[var(--color-border)]
        text-[var(--color-text)]
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden hover:text-[var(--color-primary)]"
          onClick={onToggleSidebarMobile}
        >
          <FiMenu size={20} />
        </button>

        {/* DESKTOP COLLAPSE */}
        <button
          className="hidden md:inline hover:text-[var(--color-primary)]"
          onClick={onToggleSidebarDesktop}
        >
          <FiMenu size={20} />
        </button>

        {/* SEARCH (optional) */}
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

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 relative">
        {/* MESSAGES */}
        <div className="relative">
          <button
            className="hover:text-[var(--color-primary)]"
            onClick={() => {
              setMsgsOpen(!msgsOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
          >
            <FiMessageSquare size={20} />
          </button>
          {messages.length > 0 && (
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
              {messages.length}
            </span>
          )}
          {msgsOpen && (
            <div
              className="
                absolute right-0 top-8
                w-64
                bg-white
                text-black
                p-2
                rounded
                shadow-md
                z-[9999]
              "
            >
              <h4 className="font-bold mb-2">Messages</h4>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="border-b pb-2 mb-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => {
                    navigate("/messages");
                    setMsgsOpen(false);
                  }}
                >
                  <strong>{m.from}:</strong> {m.snippet}
                </div>
              ))}
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => {
                  navigate("/messages");
                  setMsgsOpen(false);
                }}
              >
                View all messages
              </button>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            className="hover:text-[var(--color-primary)]"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setMsgsOpen(false);
              setProfileOpen(false);
            }}
          >
            <FiBell size={20} />
          </button>
          {notifications.length > 0 && (
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
              {notifications.length}
            </span>
          )}
          {notifOpen && (
            <div
              className="
                absolute right-0 top-8
                w-64
                bg-white
                text-black
                p-2
                rounded
                shadow-md
                z-[9999]
              "
            >
              <h4 className="font-bold mb-2">Notifications</h4>
              {notifications.map((n) => (
                <div key={n.id} className="border-b pb-2 mb-2">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm">{n.desc}</div>
                </div>
              ))}
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => {
                  navigate("/notifications");
                  setNotifOpen(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
              setMsgsOpen(false);
            }}
            className="flex items-center hover:text-[var(--color-primary)]"
          >
            <img
              src={userAvatar}
              alt="User Avatar"
              className="rounded-full h-8 w-8 mr-2"
            />
            <span className="flex items-center">
              John Deo <FiChevronDown className="ml-1" />
            </span>
          </button>

          {profileOpen && (
            <div
              className="
                absolute right-0 top-8
                bg-white
                text-black
                p-2
                rounded
                shadow-md
                z-[9999]
                w-40
              "
            >
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-200"
                onClick={() => {
                  navigate("/profile");
                  setProfileOpen(false);
                }}
              >
                Profile
              </button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-200">
                Settings
              </button>
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-red-600"
                onClick={() => {
                  handleLogout();
                  setProfileOpen(false);
                }}
              >
                <FiLogOut size={14} className="inline mr-1" />
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
