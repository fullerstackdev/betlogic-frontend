// src/pages/Bets.jsx
import React, { useState, useEffect } from "react";

export default function Bets() {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    matchup: "",
    amount: "",
    result: "Open",
    profit: "",
  });

  useEffect(() => {
    async function loadBets() {
      try {
        const base = import.meta.env.VITE_API_BASE;
        const token = localStorage.getItem("token");
        const res = await fetch(`${base}/bets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load bets");
        }
        const data = await res.json();
        setBets(data); // array of {id, date, matchup, amount, result, profit}
      } catch (err) {
        setError(err.message);
      }
    }
    loadBets();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function addBet() {
    if (!formData.date || !formData.matchup || !formData.amount) {
      alert("Date, matchup, amount are required");
      return;
    }
    try {
      const base = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      const bodyObj = {
        date: formData.date,
        matchup: formData.matchup,
        amount: parseFloat(formData.amount),
        result: formData.result,
        profit: parseFloat(formData.profit || "0"),
      };
      const res = await fetch(`${base}/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyObj),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create bet");
      }
      // push new bet
      setBets([...bets, data]);
      setFormData({
        date: "",
        matchup: "",
        amount: "",
        result: "Open",
        profit: "",
      });
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Bets (Manual Tracker)</h2>

      <div className="card max-w-md">
        <h3 className="text-lg font-semibold mb-2">Add New Bet</h3>
        <div className="mb-2">
          <label className="block text-sm text-muted">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-muted">Matchup</label>
          <input
            type="text"
            name="matchup"
            value={formData.matchup}
            onChange={handleChange}
            className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-muted">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-muted">Result</label>
          <select
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
          >
            <option value="Open">Open</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-muted">Profit (if any)</label>
          <input
            type="number"
            name="profit"
            value={formData.profit}
            onChange={handleChange}
            className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
          />
        </div>
        <button className="btn mt-2" onClick={addBet}>
          Add Bet
        </button>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">My Bets</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Matchup</th>
              <th>Amount</th>
              <th>Result</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr key={bet.id}>
                <td>{bet.date}</td>
                <td>{bet.matchup}</td>
                <td>${bet.amount}</td>
                <td>{bet.result}</td>
                <td>${bet.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
