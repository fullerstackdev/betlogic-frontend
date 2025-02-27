// src/services/useAuth.js
import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("betlogic_token") || "";
  });
  const [user, setUser] = useState(null);

  // On mount, if we have a token, fetch the user profile from /api/users/me
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    // Example fetch to get user info
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => setUser(data)) // data might be { id, email, first_name, role, ... }
      .catch((err) => {
        console.error("useAuth: user profile error:", err);
        // If unauthorized, remove token
        localStorage.removeItem("betlogic_token");
        setToken("");
        setUser(null);
      });
  }, [token]);

  // A simple login method that sets the token, triggers re-fetch
  function login(tokenValue) {
    localStorage.setItem("betlogic_token", tokenValue);
    setToken(tokenValue);
  }

  // A logout method
  function logout() {
    localStorage.removeItem("betlogic_token");
    setToken("");
    setUser(null);
  }

  return { token, user, login, logout };
}
