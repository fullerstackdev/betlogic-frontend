import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import VerifyPage from "./pages/Auth/VerifyPage"; // optional
import ForgotPage from "./pages/Auth/ForgotPage";
import ResetPage from "./pages/Auth/ResetPage";
import LogoutPage from "./pages/Auth/LogoutPage";
import FinancesPage from "./pages/Finances/FinancesPage";
import PromotionsPage from "./pages/Promotions/PromotionsPage";
import PromotionDetailPage from "./pages/Promotions/PromotionDetailPage";
import TasksPage from "./pages/Tasks/TasksPage";
import BetsPage from "./pages/Bets/BetsPage";
import CalendarPage from "./pages/Calendar/CalendarPage";

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/verify/:token" element={<VerifyPage />} />
      <Route path="/auth/forgot" element={<ForgotPage />} />
      <Route path="/auth/reset" element={<ResetPage />} />
      <Route path="/auth/logout" element={<LogoutPage />} />
      <Route path="/finances" element={<FinancesPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/promotions/:promoId" element={<PromotionDetailPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/bets" element={<BetsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
