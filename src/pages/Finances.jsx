// src/pages/Finances.jsx

import React, { useState, useEffect, useMemo } from "react";

/**
 * Final code for Finances, which:
 * - Lists user accounts (GET /api/finances/accounts)
 * - Lets user add a new account (POST /api/finances/accounts)
 * - Lists user transactions (GET /api/finances/transactions)
 * - Lets user create a transaction (POST /api/finances/transactions)
 * No speculation, referencing your known endpoints.
 */

export default function Finances() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Add Transaction Modal
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

  // Transaction Detail Modal
  const [selectedTx, setSelectedTx] = useState(null);

  // Account Modal
  const [showAddAcctModal, setShowAddAcctModal] = useState(false);
  const [acctName, setAcctName] = useState("");

  // Partial detail (top cards) modal
  const [detailModal, setDetailModal] = useState(null);

  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_BASE; // e.g. "https://betlogic-backend.onrender.com/api"

  // 1) Load user accounts
  useEffect(() => {
    async function loadAccounts() {
      try {
        const resA = await fetch(`${base}/finances/accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resA.ok) {
          const errData = await resA.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load accounts");
        }
        const dataA = await resA.json();
        setAccounts(dataA); // array of { id, name, balance }
      } catch (err) {
        setError(err.message);
      }
    }
    loadAccounts();
  }, [base, token]);

  // 2) Load user transactions
  useEffect(() => {
    async function loadTransactions() {
      try {
        const resT = await fetch(`${base}/finances/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resT.ok) {
          const errData = await resT.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load transactions");
        }
        const dataT = await resT.json();
        // dataT => [
        //   {
        //     id, date, amount, type, description, status,
        //     from_account_name, to_account_name
        //   }, ...
        // ]
        setTransactions(dataT);
      } catch (err) {
        setError(err.message);
      }
    }
    loadTransactions();
  }, [base, token]);

  // 3) Compute top summary stats
  const { totalIn, totalOut, netBalance } = useMemo(() => {
    let inSum = 0;
    let outSum = 0;
    transactions.forEach((tx) => {
      if (tx.to_account_name === "User Bank") {
        inSum += Number(tx.amount);
      }
      if (tx.from_account_name === "User Bank") {
        outSum += Number(tx.amount);
      }
    });
    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: inSum - outSum,
    };
  }, [transactions]);

  // Add a new transaction
  async function addTransaction() {
    if (
      !newTx.date ||
      !newTx.fromAccount ||
      !newTx.toAccount ||
      !newTx.amount
    ) {
      alert("All transaction fields (except description) are required.");
      return;
    }
    try {
      const amt = parseFloat(newTx.amount);
      if (amt <= 0) {
        alert("Amount must be > 0");
        return;
      }
      const bodyObj = {
        date: newTx.date,
        fromAccount: newTx.fromAccount,
        toAccount: newTx.toAccount,
        amount: amt,
        type: newTx.type,
        description: newTx.description || null,
        status: newTx.status,
      };
      const res = await fetch(`${base}/finances/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyObj),
      });
      const resultData = await res.json();
      if (!res.ok) {
        throw new Error(resultData.error || "Failed to create transaction");
      }
      // resultData => { message, transaction: {...} }
      setTransactions([...transactions, resultData.transaction]);
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

  // Add a new account
  async function addAccount() {
    if (!acctName.trim()) {
      alert("Account name is required.");
      return;
    }
    try {
      const res = await fetch(`${base}/finances/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: acctName.trim() }),
      });
      const resultData = await res.json();
      if (!res.ok) {
        throw new Error(resultData.error || "Failed to create account");
      }
      // resultData => { message, account: {id, name, balance} }
      setAccounts([...accounts, resultData.account]);
      setShowAddAcctModal(false);
      setAcctName("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return (
      <div className="text-red-400 font-semibold animate-pulse">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 transition-all duration-300 ease-out">
      <h2 className="text-2xl font-bold mb-2">Your Finances</h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="card cursor-pointer hover:scale-105"
          onClick={() => setDetailModal("moneyin")}
        >
          <h3 className="text-sm text-muted">Total Money In</h3>
          <p className="text-2xl font-bold">${totalIn}</p>
        </div>
        <div
          className="card cursor-pointer hover:scale-105"
          onClick={() => setDetailModal("moneyout")}
        >
          <h3 className="text-sm text-muted">Total Money Out</h3>
          <p className="text-2xl font-bold">${totalOut}</p>
        </div>
        <div
          className="card cursor-pointer hover:scale-105"
          onClick={() => setDetailModal("net")}
        >
          <h3 className="text-sm text-muted">Net Balance</h3>
          <p
            className={`text-2xl font-bold ${
              netBalance >= 0 ? "text-pos" : "text-neg"
            }`}
          >
            ${netBalance}
          </p>
        </div>
        <div
          className="card cursor-pointer hover:scale-105"
          onClick={() => setDetailModal("other")}
        >
          <h3 className="text-sm text-muted">Other Metric</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>

      {/* Accounts + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ACCOUNTS CARD */}
        <div className="card hover:scale-105 transition-transform">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Accounts</h3>
            <button
              className="btn text-sm"
              onClick={() => setShowAddAcctModal(true)}
            >
              + Add Account
            </button>
          </div>
          {accounts.length === 0 && (
            <p className="text-sm text-muted">No accounts found.</p>
          )}
          {accounts.map((acc) => (
            <div key={acc.id} className="mb-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-muted">Balance: ${acc.balance}</p>
            </div>
          ))}
        </div>

        {/* CHART PLACEHOLDER */}
        <div className="card hover:scale-105 transition-transform">
          <h3 className="text-lg font-bold mb-2">Cashflow Chart</h3>
          <div className="h-40 flex items-center justify-center text-muted">
            [Placeholder Chart or Insert a Chart Library]
          </div>
        </div>
      </div>

      {/* TRANSACTIONS CARD */}
      <div className="card hover:scale-105 transition-transform">
        <div className="flex justify-between mb-2 items-center">
          <h3 className="text-lg font-bold">All Transactions</h3>
          <button
            className="btn text-sm"
            onClick={() => setShowAddTxModal(true)}
          >
            + Add Transaction
          </button>
        </div>
        {transactions.length === 0 && (
          <p className="text-sm text-muted">No transactions yet.</p>
        )}
        {transactions.length > 0 && (
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
                  <td>{tx.from_account_name}</td>
                  <td>{tx.to_account_name}</td>
                  <td>${tx.amount}</td>
                  <td>{tx.type}</td>
                  <td>{tx.description || ""}</td>
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
        )}
      </div>

      {/* ADD ACCOUNT MODAL */}
      {showAddAcctModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowAddAcctModal(false)}
        >
          <div
            className="modal-content w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Add Account</h3>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Account Name</label>
              <input
                type="text"
                className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                placeholder="E.g. 'User Bank', 'BetMGM'"
                value={acctName}
                onChange={(e) => setAcctName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={addAccount}>
                Save
              </button>
              <button
                className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                onClick={() => setShowAddAcctModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="date"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.date}
                  onChange={(e) =>
                    setNewTx({ ...newTx, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">From Account</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  placeholder="ID or name"
                  value={newTx.fromAccount}
                  onChange={(e) =>
                    setNewTx({ ...newTx, fromAccount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">To Account</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  placeholder="ID or name"
                  value={newTx.toAccount}
                  onChange={(e) =>
                    setNewTx({ ...newTx, toAccount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  placeholder="0.00"
                  value={newTx.amount}
                  onChange={(e) =>
                    setNewTx({ ...newTx, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Type</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.type}
                  onChange={(e) =>
                    setNewTx({ ...newTx, type: e.target.value })
                  }
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Bonus">Bonus</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  placeholder="Optional note"
                  value={newTx.description}
                  onChange={(e) =>
                    setNewTx({ ...newTx, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.status}
                  onChange={(e) =>
                    setNewTx({ ...newTx, status: e.target.value })
                  }
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
              <strong>Date:</strong> {selectedTx.date}
              <br />
              <strong>From:</strong> {selectedTx.from_account_name}
              <br />
              <strong>To:</strong> {selectedTx.to_account_name}
              <br />
              <strong>Amount:</strong> ${selectedTx.amount}
              <br />
              <strong>Type:</strong> {selectedTx.type}
              <br />
              <strong>Status:</strong> {selectedTx.status}
              <br />
            </p>
            <p className="text-xs text-muted mb-4">
              {selectedTx.description || ""}
            </p>
            <button className="btn" onClick={() => setSelectedTx(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* PARTIAL DETAIL MODAL for the top cards */}
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
                <p className="text-sm mb-4">Currently ${totalIn}</p>
              </>
            )}
            {detailModal === "moneyout" && (
              <>
                <h4 className="text-xl font-bold mb-2">Total Money Out</h4>
                <p className="text-sm mb-4">Currently ${totalOut}</p>
              </>
            )}
            {detailModal === "net" && (
              <>
                <h4 className="text-xl font-bold mb-2">Net Balance</h4>
                <p className="text-sm mb-4">
                  Currently ${netBalance} (In minus Out)
                </p>
              </>
            )}
            {detailModal === "other" && (
              <>
                <h4 className="text-xl font-bold mb-2">Other Metric</h4>
                <p className="text-sm mb-4">Currently unused placeholder.</p>
              </>
            )}
            <button className="btn" onClick={() => setDetailModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
