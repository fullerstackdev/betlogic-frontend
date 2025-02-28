import React, { useEffect, useState } from "react";

function AdminBetsPage() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // create bet modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBet, setNewBet] = useState({
    user_id: "",
    date: "",
    matchup: "",
    amount: "",
    result: "Open",
    profit: ""
  });

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchBets() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/bets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch bets");
      }
      setBets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBets();
  }, []);

  async function createBet(e) {
    e.preventDefault();
    setError("");
    try {
      const bodyObj = {
        user_id: newBet.user_id,
        date: newBet.date || null,
        matchup: newBet.matchup,
        amount: parseFloat(newBet.amount),
        result: newBet.result,
        profit: parseFloat(newBet.profit || 0)
      };
      const res = await fetch(`${base}/admin/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create bet");
      }
      setShowCreateModal(false);
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

  if (loading) return <div>Loading admin bets...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Bets</h2>
      <button
        className="btn"
        onClick={() => setShowCreateModal(true)}
      >
        + Create Bet
      </button>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>Date</th>
            <th>Matchup</th>
            <th>Amount</th>
            <th>Result</th>
            <th>Profit</th>
            <th>CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {bets.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user_id}</td>
              <td>{b.date?.slice(0,10)}</td>
              <td>{b.matchup}</td>
              <td>{b.amount}</td>
              <td>{b.result}</td>
              <td>{b.profit}</td>
              <td>{b.created_at?.slice(0,10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Create Bet</h3>
            <form onSubmit={createBet} className="space-y-2 text-sm">
              <div>
                <label>User ID</label>
                <input
                  type="number"
                  required
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.user_id}
                  onChange={(e) => setNewBet({ ...newBet, user_id: e.target.value })}
                />
              </div>
              <div>
                <label>Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.date}
                  onChange={(e) => setNewBet({ ...newBet, date: e.target.value })}
                />
              </div>
              <div>
                <label>Matchup</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.matchup}
                  onChange={(e) => setNewBet({ ...newBet, matchup: e.target.value })}
                />
              </div>
              <div>
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.amount}
                  onChange={(e) => setNewBet({ ...newBet, amount: e.target.value })}
                />
              </div>
              <div>
                <label>Result</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.result}
                  onChange={(e) => setNewBet({ ...newBet, result: e.target.value })}
                >
                  <option value="Open">Open</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div>
                <label>Profit</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newBet.profit}
                  onChange={(e) => setNewBet({ ...newBet, profit: e.target.value })}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="btn">Create</button>
                <button
                  type="button"
                  className="btn bg-[var(--color-mid)]"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBetsPage;
