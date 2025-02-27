import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // If a token exists, redirect away from auth pages
    if (token) {
      navigate("/");
    }
    // Run this effect only once on mount
  }, [navigate]);

  return (
    <div 
      className="
        min-h-screen w-full
        bg-gray-900
        text-white
        flex items-center justify-center
        p-4
      "
      style={{
        background: 'url("https://via.placeholder.com/1600x900?text=Landing+Background")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
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
