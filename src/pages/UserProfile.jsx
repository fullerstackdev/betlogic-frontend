import React from "react";

function UserProfile() {
  const user = {
    name: "John Deo",
    email: "john.deo@betlogic.com",
    joined: "2025-07-15",
    role: "User",
    phone: "(555) 555-1234",
    address: "123 Betting St, Las Vegas, NV",
  };

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
          <div className="font-bold text-xl">{user.name}</div>
          <div className="text-sm text-muted">Role: {user.role}</div>
          <div className="text-sm text-muted">
            Joined on: {new Date(user.joined).toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
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
