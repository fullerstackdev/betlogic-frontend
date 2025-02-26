import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import VerifyPage from "./pages/Auth/VerifyPage"; // optional

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/verify/:token" element={<VerifyPage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
