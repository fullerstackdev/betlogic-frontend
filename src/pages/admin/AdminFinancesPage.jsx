import React, { useEffect, useState } from "react";

function AdminFinancesPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [newTx, setNewTx] = useState({
    user_id: "",
    from_account: "",
    to_account: "",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending"
  });

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/finances", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createTransaction(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const body = newTx;
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/finances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }
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

  async function updateTransaction(id, patchData) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/admin/finances/" + id, {
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

  return (
    <div>
      <h2>Admin Finances</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={createTransaction} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Create Transaction</h3>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={newTx.user_id}
            onChange={e => setNewTx({ ...newTx, user_id: e.target.value })}
          />
        </div>
        <div>
          <label>From Account:</label>
          <input
            type="text"
            value={newTx.from_account}
            onChange={e => setNewTx({ ...newTx, from_account: e.target.value })}
          />
        </div>
        <div>
          <label>To Account:</label>
          <input
            type="text"
            value={newTx.to_account}
            onChange={e => setNewTx({ ...newTx, to_account: e.target.value })}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={newTx.amount}
            onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={newTx.type}
            onChange={e => setNewTx({ ...newTx, type: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={newTx.description}
            onChange={e => setNewTx({ ...newTx, description: e.target.value })}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={newTx.status}
            onChange={e => setNewTx({ ...newTx, status: e.target.value })}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
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
              <td>{tx.date}</td>
              <td>
                {tx.status !== "Confirmed" && (
                  <button onClick={() => updateTransaction(tx.id, { status: "Confirmed" })}>
                    Confirm
                  </button>
                )}
                {tx.status !== "Disputed" && (
                  <button onClick={() => updateTransaction(tx.id, { status: "Disputed" })}>
                    Dispute
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

export default AdminFinancesPage;
