import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Welcome to BetLogic
        </h2>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

