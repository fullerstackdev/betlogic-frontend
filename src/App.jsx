import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import VerifyPage from "./pages/Auth/VerifyPage"; // optional
import ForgotPage from "./pages/Auth/ForgotPage";
import ResetPage from "./pages/Auth/ResetPage";
import LogoutPage from "./pages/Auth/LogoutPage";
import FinancesPage from "./pages/Finances/FinancesPage";

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
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
