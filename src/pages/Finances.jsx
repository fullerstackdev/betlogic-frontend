// src/pages/Finances.jsx
import React, { useState, useEffect, useMemo } from "react";

export default function Finances() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // For "Add Transaction" modal
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTx, setNewTx] = useState({
    date: "",
    fromAccount: "",
    toAccount: "",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending",
  });

  // For Transaction detail modal
  const [selectedTx, setSelectedTx] = useState(null);
  // For top-cards partial detail modal
  const [detailModal, setDetailModal] = useState(null);

  // Load user’s accounts & transactions on mount
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE; 
    const token = localStorage.getItem("token");

    async function loadAccounts() {
      try {
        // e.g. GET /api/finances/accounts
        const resA = await fetch(`${base}/finances/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resA.ok) {
          const errData = await resA.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load accounts");
        }
        const dataA = await resA.json();
        setAccounts(dataA); // array of {id, name, balance}
      } catch (err) {
        setError(err.message);
      }
    }

    async function loadTransactions() {
      try {
        // e.g. GET /api/transactions
        const resT = await fetch(`${base}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resT.ok) {
          const errData = await resT.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load transactions");
        }
        const dataT = await resT.json();
        setTransactions(dataT); // array of {id, date, from_account, to_account, amount, type, status, description}
      } catch (err) {
        setError(err.message);
      }
    }

    loadAccounts();
    loadTransactions();
  }, []);

  // Compute top summary stats
  const { totalIn, totalOut, netBalance, updatedAccounts } = useMemo(() => {
    let accountsMap = {};
    accounts.forEach((acc) => {
      accountsMap[acc.name] = acc.balance;
    });

    let inSum = 0;
    let outSum = 0;

    // Adjust the inSum/outSum based on from_account / to_account
    // We assume your DB returns from_account_name, to_account_name 
    // or from_account, to_account. We'll assume "from_account" = string name for now.
    transactions.forEach((tx) => {
      if (tx.from_account === "User Bank") outSum += tx.amount;
      if (tx.to_account === "User Bank") inSum += tx.amount;
    });

    const net = inSum - outSum;

    // If we also want to compute updated balances, we can do it similarly.
    // For now, we’ll keep it simple. If you want to reflect the updates in the UI, you'd do it here:
    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: net,
      updatedAccounts: accounts, // or some computed version
    };
  }, [accounts, transactions]);

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  // Add new transaction
  async function addTransaction() {
    if (!newTx.date || !newTx.amount || !newTx.fromAccount || !newTx.toAccount) {
      alert("All fields required except description");
      return;
    }
    try {
      const base = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      const bodyObj = {
        date: newTx.date,
        fromAccount: newTx.fromAccount,
        toAccount: newTx.toAccount,
        amount: parseFloat(newTx.amount),
        type: newTx.type,
        description: newTx.description || null,
        status: newTx.status,
      };

      const res = await fetch(`${base}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyObj),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }
      // push new transaction onto list
      setTransactions([...transactions, data]);
      setShowAddTxModal(false);
      setNewTx({
        date: "",
        fromAccount: "",
        toAccount: "",
        amount: "",
        type: "Deposit",
        description: "",
        status: "Pending",
      });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Your Finances</h2>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="card cursor-pointer"
          onClick={() => setDetailModal("moneyin")}
        >
          <h3 className="text-sm text-muted">Total Money In</h3>
          <p className="text-2xl font-bold">${totalIn}</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => setDetailModal("moneyout")}
        >
          <h3 className="text-sm text-muted">Total Money Out</h3>
          <p className="text-2xl font-bold">${totalOut}</p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => setDetailModal("net")}
        >
          <h3 className="text-sm text-muted">Net Balance</h3>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-pos" : "text-neg"}`}>
            ${netBalance}
          </p>
        </div>
        <div
          className="card cursor-pointer"
          onClick={() => setDetailModal("other")}
        >
          <h3 className="text-sm text-muted">Other Metric</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>

      {/* ACCOUNTS + CHART (just showing accounts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-bold mb-2">Accounts</h3>
          {updatedAccounts.map((acc) => (
            <div key={acc.id} className="mb-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-muted">
                Balance: ${acc.balance}
              </p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-2">Cashflow Chart</h3>
          <div className="h-40 flex items-center justify-center text-muted">
            [Placeholder Chart or implement your charting logic]
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="card">
        <div className="flex justify-between mb-2 items-center">
          <h3 className="text-lg font-bold">All Transactions</h3>
          <button
            className="btn text-sm"
            onClick={() => setShowAddTxModal(true)}
          >
            + Add Transaction
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="cursor-pointer hover:bg-[var(--color-mid)]"
                onClick={() => setSelectedTx(tx)}
              >
                <td>{tx.date}</td>
                <td>{tx.from_account}</td>
                <td>{tx.to_account}</td>
                <td>${tx.amount}</td>
                <td>{tx.type}</td>
                <td>{tx.description}</td>
                <td
                  className={
                    tx.status === "Confirmed"
                      ? "text-pos"
                      : tx.status === "Pending"
                      ? "text-muted"
                      : "text-neg"
                  }
                >
                  {tx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showAddTxModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowAddTxModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Add Transaction</h3>
            <div className="space-y-2 text-sm">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.date}
                  onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label>From Account</label>
                  <input
                    type="text"
                    className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                    value={newTx.fromAccount}
                    onChange={(e) => setNewTx({ ...newTx, fromAccount: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label>To Account</label>
                  <input
                    type="text"
                    className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                    value={newTx.toAccount}
                    onChange={(e) => setNewTx({ ...newTx, toAccount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label>Amount</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                />
              </div>
              <div>
                <label>Type</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.type}
                  onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
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
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={addTransaction}>
                Save
              </button>
              <button
                className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                onClick={() => setShowAddTxModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION DETAIL MODAL */}
      {selectedTx && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Transaction Details</h3>
            <p className="text-sm mb-2">
              <strong>Date:</strong> {selectedTx.date}<br />
              <strong>From:</strong> {selectedTx.from_account}<br />
              <strong>To:</strong> {selectedTx.to_account}<br />
              <strong>Amount:</strong> ${selectedTx.amount}<br />
              <strong>Type:</strong> {selectedTx.type}<br />
              <strong>Status:</strong> {selectedTx.status}<br />
            </p>
            <p className="text-xs text-muted mb-4">{selectedTx.description}</p>
            <button
              className="btn"
              onClick={() => setSelectedTx(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PARTIAL DETAIL MODAL for TOP CARDS */}
      {detailModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="modal-content w-72"
            onClick={(e) => e.stopPropagation()}
          >
            {detailModal === "moneyin" && (
              <>
                <h4 className="text-xl font-bold mb-2">Total Money In</h4>
                <p className="text-sm mb-4">
                  Currently ${totalIn}.
                </p>
              </>
            )}
            {detailModal === "moneyout" && (
              <>
                <h4 className="text-xl font-bold mb-2">Total Money Out</h4>
                <p className="text-sm mb-4">
                  Currently ${totalOut}.
                </p>
              </>
            )}
            {detailModal === "net" && (
              <>
                <h4 className="text-xl font-bold mb-2">Net Balance</h4>
                <p className="text-sm mb-4">
                  ${netBalance} (In minus Out)
                </p>
              </>
            )}
            {detailModal === "other" && (
              <>
                <h4 className="text-xl font-bold mb-2">Other Metric</h4>
                <p className="text-sm mb-4">Currently unused placeholder.</p>
              </>
            )}
            <button
              className="btn"
              onClick={() => setDetailModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

