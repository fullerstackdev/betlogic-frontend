// src/pages/UserProfile.jsx
import React from "react";

function UserProfile() {
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const role = localStorage.getItem("role") || "user";
  //const email = localStorage.getItem("email") || "";
  // joined date not tracked yet, phone / address not tracked. 
  // If you want them, we must store them or fetch from an endpoint.

  const fullName = (firstName + " " + lastName).trim();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded mb-2"
          />
          <div className="font-bold text-xl">{fullName || "Unnamed User"}</div>
          <div className="text-sm text-muted">Role: {role}</div>
          {/* joined or creation date not in localStorage. Could skip. */}
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {email}</p>
          {/* If you want phone/address, we must store or fetch them */}
          <p><strong>Phone:</strong> n/a</p>
          <p><strong>Address:</strong> n/a</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-2">Account Settings</h3>
        <button className="btn mr-2">Change Password</button>
        <button className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]">
          Notification Preferences
        </button>
      </div>
    </div>
  );
}

export default UserProfile;