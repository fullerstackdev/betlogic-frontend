// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Auth pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPage from "./pages/Auth/ForgotPage";
import ResetPage from "./pages/Auth/ResetPage";
import VerifyPage from "./pages/Auth/VerifyPage";
import LogoutPage from "./pages/Auth/LogoutPage";

// User pages
import Dashboard from "./pages/Dashboard";
import Finances from "./pages/Finances";
import Promotions from "./pages/Promotions";
import PromotionDetail from "./pages/PromotionDetail";
import Tasks from "./pages/Tasks";
import Bets from "./pages/Bets";
import Messages from "./pages/Messages";
import Calendar from "./pages/Calendar";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";

// Admin pages
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AdminFinancesPage from "./pages/admin/AdminFinancesPage";
import AdminPromotionsPage from "./pages/admin/AdminPromotionsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import AdminBetsPage from "./pages/admin/AdminBetsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";

// Not Found
import NotFound from "./pages/NotFound";

// The new component that enforces auth
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      {/* AUTH LAYOUT (public) */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot" element={<ForgotPage />} />
        <Route path="/auth/reset" element={<ResetPage />} />
        <Route path="/auth/verify/:token" element={<VerifyPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
      </Route>

      {/* USER LAYOUT - protected */}
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/promotions/:promoId" element={<PromotionDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/bets" element={<Bets />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* ADMIN LAYOUT - protected with roles */}
      <Route element={<RequireAuth requiredRoles={["admin","superadmin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="finances" element={<AdminFinancesPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="tasks" element={<AdminTasksPage />} />
          <Route path="bets" element={<AdminBetsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
      </Route>

      {/* 404 CATCH ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
