const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
// for CRA, use process.env.REACT_APP_API_BASE

export async function registerUser(userData) {
  // userData = { email, password, firstName, lastName }
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to register");
  }
  return data;
}

export async function verifyUser(token) {
  const res = await fetch(`${API_BASE}/auth/verify/${token}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to verify");
  }
  return data;
}

export async function loginUser(creds) {
  // creds = { email, password }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to login");
  }
  return data; // e.g. { message, token }
}
