import React, { useEffect, useState } from "react";

function BetsPage() {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    matchup: "",
    amount: "",
    result: "Open",
    profit: ""
  });

  async function fetchBets() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/bets", {
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
      const res = await fetch(import.meta.env.VITE_API_BASE + "/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create bet");
      }
      // refresh
      setFormData({
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

  async function updateBet(betId, patchData) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/bets/" + betId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patchData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update bet");
      }
      fetchBets();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchBets();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Bets (Manual Tracker)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createBet} style={{ marginBottom: "1rem" }}>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <label>Matchup</label>
          <input
            type="text"
            value={formData.matchup}
            onChange={e => setFormData({ ...formData, matchup: e.target.value })}
          />
        </div>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div>
          <label>Result</label>
          <select
            value={formData.result}
            onChange={e => setFormData({ ...formData, result: e.target.value })}
          >
            <option value="Open">Open</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div>
          <label>Profit</label>
          <input
            type="number"
            value={formData.profit}
            onChange={e => setFormData({ ...formData, profit: e.target.value })}
          />
        </div>
        <button type="submit">Create Bet</button>
      </form>

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Matchup</th>
            <th>Amount</th>
            <th>Result</th>
            <th>Profit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bets.map(bet => (
            <tr key={bet.id}>
              <td>{bet.id}</td>
              <td>{bet.date}</td>
              <td>{bet.matchup}</td>
              <td>${bet.amount}</td>
              <td>{bet.result}</td>
              <td>${bet.profit}</td>
              <td>
                {bet.result !== "Won" && (
                  <button onClick={() => updateBet(bet.id, { result: "Won" })}>
                    Set Won
                  </button>
                )}
                {bet.result !== "Lost" && (
                  <button onClick={() => updateBet(bet.id, { result: "Lost" })}>
                    Set Lost
                  </button>
                )}
                {bet.result !== "Open" && (
                  <button onClick={() => updateBet(bet.id, { result: "Open" })}>
                    Set Open
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BetsPage;
