// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// LAYOUTS
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Onboarding
import OnboardingPage from "./pages/OnboardingPage";

// AUTH PAGES
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPage from "./pages/Auth/ForgotPage";
import ResetPage from "./pages/Auth/ResetPage";
import VerifyPage from "./pages/Auth/VerifyPage";
import LogoutPage from "./pages/Auth/LogoutPage";

// USER PAGES (Protected)
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

// ADMIN PAGES (Protected)
import AdminDashboard from "./pages/admin/AdminDashboard"; // NEW: a default admin page
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AdminFinancesPage from "./pages/admin/AdminFinancesPage";
import AdminPromotionsPage from "./pages/admin/AdminPromotionsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import AdminBetsPage from "./pages/admin/AdminBetsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";

// Not Found
import NotFound from "./pages/NotFound";

// AUTH PROTECTOR
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />


      
      {/* PUBLIC AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot" element={<ForgotPage />} />
        <Route path="/auth/reset" element={<ResetPage />} />
        <Route path="/auth/verify/:token" element={<VerifyPage />} />
        <Route path="/auth/logout" element={<LogoutPage />} />
      </Route>

      {/* PROTECTED USER ROUTES */}
      <Route
        element={
          <RequireAuth allowedRoles={["user", "admin", "superadmin"]} />
        }
      >
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

           {/* NEW: Onboarding Route */}
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>

      {/* PROTECTED ADMIN ROUTES */}
      <Route element={<RequireAuth allowedRoles={["admin", "superadmin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* *** CRITICAL: Add a default index route so /admin is not blank *** */}
          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<ManageUsersPage />} />
          <Route path="finances" element={<AdminFinancesPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="tasks" element={<AdminTasksPage />} />
          <Route path="bets" element={<AdminBetsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
      </Route>

      {/* CATCH-ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
