import React, { useEffect, useState } from "react";

function AdminBetsPage() {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState("");
  const [newBet, setNewBet] = useState({
    user_id: "",
    date: "",
    matchup: "",
    amount: "",
    result: "Open",
    profit: ""
  });

  async function fetchBets() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/bets", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch bets");
      }
      setBets(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createBet(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = newBet;
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create bet");
      }
      setNewBet({
        user_id: "",
        date: "",
        matchup: "",
        amount: "",
        result: "Open",
        profit: ""
      });
      fetchBets();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchBets();
  }, []);

  return (
    <div>
      <h2>Admin Bets</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createBet} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Create Bet for Any User</h3>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={newBet.user_id}
            onChange={e => setNewBet({ ...newBet, user_id: e.target.value })}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={newBet.date}
            onChange={e => setNewBet({ ...newBet, date: e.target.value })}
          />
        </div>
        <div>
          <label>Matchup:</label>
          <input
            type="text"
            value={newBet.matchup}
            onChange={e => setNewBet({ ...newBet, matchup: e.target.value })}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={newBet.amount}
            onChange={e => setNewBet({ ...newBet, amount: e.target.value })}
          />
        </div>
        <div>
          <label>Result:</label>
          <input
            type="text"
            value={newBet.result}
            onChange={e => setNewBet({ ...newBet, result: e.target.value })}
          />
        </div>
        <div>
          <label>Profit:</label>
          <input
            type="number"
            value={newBet.profit}
            onChange={e => setNewBet({ ...newBet, profit: e.target.value })}
          />
        </div>
        <button type="submit">Create Bet</button>
      </form>

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Matchup</th>
            <th>Amount</th>
            <th>Result</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {bets.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user_id}</td>
              <td>{b.date}</td>
              <td>{b.matchup}</td>
              <td>{b.amount}</td>
              <td>{b.result}</td>
              <td>{b.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBetsPage;
