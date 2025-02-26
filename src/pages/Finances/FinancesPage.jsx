import React, { useEffect, useState } from "react";

function FinancesPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [newTx, setNewTx] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending"
  });

  async function fetchAccounts() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/finances/accounts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch accounts");
      }
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/finances/transactions", {
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
      const res = await fetch(import.meta.env.VITE_API_BASE + "/finances/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTx)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }
      // Refresh transactions after successful creation
      fetchTransactions();
      setNewTx({
        fromAccount: "",
        toAccount: "",
        amount: "",
        type: "Deposit",
        description: "",
        status: "Pending"
      });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Finances</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section>
        <h3>Accounts</h3>
        <ul>
          {accounts.map(acc => (
            <li key={acc.id}>
              {acc.name} - Balance: ${acc.balance}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>Transactions</h3>
        <ul>
          {transactions.map(tx => (
            <li key={tx.id}>
              {tx.type} ${tx.amount} from {tx.from_account_name} to {tx.to_account_name} - {tx.status}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h4>Add Transaction</h4>
        <form onSubmit={createTransaction}>
          <div>
            <label>From Account</label>
            <select
              value={newTx.fromAccount}
              onChange={e => setNewTx({ ...newTx, fromAccount: e.target.value })}
            >
              <option value="">--Select--</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>To Account</label>
            <select
              value={newTx.toAccount}
              onChange={e => setNewTx({ ...newTx, toAccount: e.target.value })}
            >
              <option value="">--Select--</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input
              type="number"
              value={newTx.amount}
              onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
            />
          </div>
          <div>
            <label>Type</label>
            <select
              value={newTx.type}
              onChange={e => setNewTx({ ...newTx, type: e.target.value })}
            >
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Bonus">Bonus</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              value={newTx.description}
              onChange={e => setNewTx({ ...newTx, description: e.target.value })}
            />
          </div>
          <div>
            <label>Status</label>
            <select
              value={newTx.status}
              onChange={e => setNewTx({ ...newTx, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>Create Transaction</button>
        </form>
      </section>
    </div>
  );
}

export default FinancesPage;
