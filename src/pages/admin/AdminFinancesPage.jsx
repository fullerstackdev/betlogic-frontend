import React, { useEffect, useState } from "react";

/**
 * AdminFinancesPage
 * - Lists all transactions
 * - Allows creation of new transaction
 * - Allows patching transaction status or other fields
 */

function AdminFinancesPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For create new transaction
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTx, setNewTx] = useState({
    user_id: "",
    from_account: "",
    to_account: "",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending"
  });

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE;

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${base}/admin/finances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // create transaction
  async function handleCreateTx(e) {
    e.preventDefault();
    setError("");
    try {
      const bodyObj = {
        user_id: newTx.user_id,
        from_account: newTx.from_account,
        to_account: newTx.to_account,
        amount: parseFloat(newTx.amount),
        type: newTx.type,
        description: newTx.description || null,
        status: newTx.status
      };
      const res = await fetch(`${base}/admin/finances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }
      // refresh
      setShowCreateModal(false);
      setNewTx({
        user_id: "",
        from_account: "",
        to_account: "",
        amount: "",
        type: "Deposit",
        description: "",
        status: "Pending"
      });
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  }

  // patch transaction
  async function updateTxStatus(txId, patchData) {
    try {
      setError("");
      const res = await fetch(`${base}/admin/finances/${txId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patchData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update transaction");
      }
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading Admin Finances...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Finances</h2>
      <button
        className="btn"
        onClick={() => setShowCreateModal(true)}
      >
        + Create Transaction
      </button>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>UserID</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.user_id}</td>
              <td>{tx.from_account}</td>
              <td>{tx.to_account}</td>
              <td>{tx.amount}</td>
              <td>{tx.type}</td>
              <td>{tx.description}</td>
              <td>{tx.status}</td>
              <td>{tx.date?.slice(0,10)}</td>
              <td>
                {tx.status !== "Confirmed" && (
                  <button
                    className="btn text-xs mr-2"
                    onClick={() => updateTxStatus(tx.id, { status: "Confirmed" })}
                  >
                    Confirm
                  </button>
                )}
                {tx.status !== "Disputed" && (
                  <button
                    className="btn bg-[var(--color-mid)] text-xs"
                    onClick={() => updateTxStatus(tx.id, { status: "Disputed" })}
                  >
                    Dispute
                  </button>
                )}
              </td>
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
            className="modal-content w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Create Transaction</h3>
            <form onSubmit={handleCreateTx} className="space-y-2 text-sm">
              <div>
                <label>User ID</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.user_id}
                  onChange={(e) => setNewTx({ ...newTx, user_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>From Account</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.from_account}
                  onChange={(e) => setNewTx({ ...newTx, from_account: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>To Account</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.to_account}
                  onChange={(e) => setNewTx({ ...newTx, to_account: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Type</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.type}
                  onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                />
              </div>
              <div>
                <label>Status</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.status}
                  onChange={(e) => setNewTx({ ...newTx, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Disputed">Disputed</option>
                </select>
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

export default AdminFinancesPage;
