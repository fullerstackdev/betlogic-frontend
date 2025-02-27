// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  // no forced redirect 
  return (
    <div
      className="
        min-h-screen w-full
        bg-gray-900
        text-white
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          bg-black/60
          backdrop-blur-sm
          rounded-lg
          w-full
          max-w-3xl
          p-6
          flex
        "
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;

