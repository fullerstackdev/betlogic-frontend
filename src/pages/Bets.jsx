// user/Bets.jsx
import React, { useState, useEffect } from "react";

function Bets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    matchup: "",
    amount: "",
    result: "Open",
    profit: "0"
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadBets() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/bets`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load bets");
        }
        const betData = await res.json();
        setBets(betData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadBets();
  }, [token]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function addBet() {
    if (!formData.amount) {
      alert("Amount is required");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formData.date || undefined,
          matchup: formData.matchup || "",
          amount: parseFloat(formData.amount),
          result: formData.result || "Open",
          profit: parseFloat(formData.profit)
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create bet");
      }
      const created = await res.json();
      // created.bet => the new bet
      setBets([...bets, created.bet]);
      // reset form
      setFormData({
        date: "",
        matchup: "",
        amount: "",
        result: "Open",
        profit: "0"
      });
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading bets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
          <label className="block text-sm text-muted">Profit</label>
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
        {bets.length === 0 && <p>No bets yet.</p>}
        {bets.length > 0 && (
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
              {bets.map((b) => (
                <tr key={b.id}>
                  <td>{b.date}</td>
                  <td>{b.matchup}</td>
                  <td>${b.amount}</td>
                  <td>{b.result}</td>
                  <td>${b.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Bets;
