// src/layouts/AuthLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, might redirect them away from auth pages
    const token = localStorage.getItem("token");
    if (token) {
      // If they're admin, maybe go /admin, else go user
      const role = localStorage.getItem("role");
      if (role === "admin" || role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div 
    className="
    min-h-screen w-full
    bg-gray-900
    text-white
    flex items-center justify-center
    p-4
    auth-layout
  "

    >
      <div className="
    bg-black/60
    backdrop-blur-sm
    rounded-lg
    w-full
    max-w-3xl
    p-6
    flex
  ">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
