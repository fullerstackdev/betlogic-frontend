import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// user pages
import Dashboard from "./pages/Dashboard";
import Finances from "./pages/Finances";
import Promotions from "./pages/Promotions";
import PromotionDetail from "./pages/PromotionDetail";
import Tasks from "./pages/Tasks";
import Bets from "./pages/Bets";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";

// admin pages
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AdminFinancesPage from "./pages/admin/AdminFinancesPage";
import AdminPromotionsPage from "./pages/admin/AdminPromotionsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import AdminBetsPage from "./pages/admin/AdminBetsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";

function App() {
  return (
    <Routes>
      {/* USER LAYOUT */}
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
      <Route path="*" element={<NotFound />} />

      {/* ADMIN LAYOUT */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="finances" element={<AdminFinancesPage />} />
        <Route path="promotions" element={<AdminPromotionsPage />} />
        <Route path="tasks" element={<AdminTasksPage />} />
        <Route path="bets" element={<AdminBetsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
