import React, { useEffect, useState } from "react";

/**
 * AdminDashboard
 * Displays quick overview stats (number of users, total transactions, etc.).
 * Calls the existing /api/admin/... endpoints for summary data.
 */

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Basic summary data
  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [activePromos, setActivePromos] = useState(0);

  // We’ll do multiple fetch calls in parallel:
  //   /api/admin/users  => user list => userCount
  //   /api/admin/finances => transactions => transactionCount
  //   /api/admin/bets => totalBets
  //   /api/admin/promotions => activePromos
  // If any fail, we show the error.

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const base = import.meta.env.VITE_API_BASE;

        // 1) user list
        const [resUsers, resFinances, resBets, resPromos] = await Promise.all([
          fetch(`${base}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/admin/finances`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/admin/bets`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/admin/promotions`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const dataUsers = await resUsers.json();
        const dataFinances = await resFinances.json();
        const dataBets = await resBets.json();
        const dataPromos = await resPromos.json();

        if (!resUsers.ok) throw new Error(dataUsers.error || "Failed to load users");
        if (!resFinances.ok) throw new Error(dataFinances.error || "Failed to load transactions");
        if (!resBets.ok) throw new Error(dataBets.error || "Failed to load bets");
        if (!resPromos.ok) throw new Error(dataPromos.error || "Failed to load promotions");

        // stats
        setUserCount(dataUsers.length);
        setTransactionCount(dataFinances.length);
        setTotalBets(dataBets.length);
        
        // for activePromos, we’ll consider anything with status != "archived"
        const active = dataPromos.filter((p) => p.status !== "archived").length;
        setActivePromos(active);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div>Loading Admin Dashboard...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <h3 className="text-sm text-muted mb-1">Total Users</h3>
          <p className="text-2xl font-bold">{userCount}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-muted mb-1">Total Transactions</h3>
          <p className="text-2xl font-bold">{transactionCount}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-muted mb-1">Total Bets</h3>
          <p className="text-2xl font-bold">{totalBets}</p>
        </div>
        <div className="card">
          <h3 className="text-sm text-muted mb-1">Active Promotions</h3>
          <p className="text-2xl font-bold">{activePromos}</p>
        </div>
      </div>
      
      {/* Quick links to other admin sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/users")}
        >
          <h3 className="font-bold">Manage Users</h3>
          <p className="text-sm text-muted">Create, edit, deactivate users, etc.</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/finances")}
        >
          <h3 className="font-bold">Finances</h3>
          <p className="text-sm text-muted">View transactions, create new, override statuses.</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/promotions")}
        >
          <h3 className="font-bold">Promotions</h3>
          <p className="text-sm text-muted">Create/edit promos, track usage.</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/tasks")}
        >
          <h3 className="font-bold">Tasks</h3>
          <p className="text-sm text-muted">Admin Kanban for all user tasks</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/bets")}
        >
          <h3 className="font-bold">Bets</h3>
          <p className="text-sm text-muted">Oversee bets placed by any user</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => (window.location.href = "/admin/messages")}
        >
          <h3 className="font-bold">Messages</h3>
          <p className="text-sm text-muted">View relevant messaging threads</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
