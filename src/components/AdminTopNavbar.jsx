import React, { useState, useEffect } from "react";
import { FiMenu, FiMessageSquare, FiBell, FiChevronDown } from "react-icons/fi";

// Possibly fetch some notifications for the admin?

function AdminTopNavbar({ onToggleSidebar }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [msgsOpen, setMsgsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  // Example approach: fetch notifications from normal /api/notifications? 
  // or an admin endpoint if you have it.

  // We'll keep it minimal. If you have no admin notifications, skip it.

  return (
    <div className="relative z-[999] flex items-center justify-between h-12 px-4 bg-[var(--color-dark)] border-b border-[var(--color-border)] text-[var(--color-text)]">
      <div>
        <button
          onClick={onToggleSidebar}
          className="mr-4 hover:text-[var(--color-primary)]"
        >
          <FiMenu size={20} />
        </button>
        {/* Could put a search bar or something here if desired */}
      </div>

      <div className="flex items-center gap-4">
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
          {/* If you want a count badge:
              <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-600 ...">2</span>
          */}
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
              <h4 className="font-bold mb-2">Admin Quick Messages</h4>
              {messages.length === 0 ? (
                <p className="text-sm text-gray-800">No messages found</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="border-b pb-2 mb-2">
                    <p className="font-semibold">Thread #{m.thread_id}</p>
                    <p className="text-xs">{m.snippet}</p>
                  </div>
                ))
              )}
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => {
                  window.location.href = "/admin/messages";
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
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-800">No notifications found</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="border-b pb-2 mb-2">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-xs">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ADMIN AVATAR / LOGOUT */}
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
              src="https://via.placeholder.com/40x40?text=Admin"
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
                  // remove token from localStorage, etc.
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
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

export default AdminTopNavbar;
