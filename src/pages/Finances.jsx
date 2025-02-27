// src/pages/Finances.jsx
import React, { useState, useEffect, useMemo } from "react";

/**
 * Assuming endpoints:
 *  GET /api/accounts        => user accounts
 *  GET /api/transactions    => user transactions
 *  POST /api/transactions   => create transaction
 */
function Finances() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For the "Add Transaction" modal
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTx, setNewTx] = useState({
    date: "",
    from_account: "User Bank",
    to_account: "BetMGM",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending",
  });

  // For transaction detail modal
  const [selectedTx, setSelectedTx] = useState(null);

  // For partial detail modals (top 4 cards)
  const [detailModal, setDetailModal] = useState(null);

  // Load accounts and transactions on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        // 1) Fetch accounts
        const accRes = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/accounts`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!accRes.ok) {
          throw new Error("Failed to load accounts");
        }
        const accData = await accRes.json();

        // 2) Fetch transactions
        const txRes = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!txRes.ok) {
          throw new Error("Failed to load transactions");
        }
        const txData = await txRes.json();

        setAccounts(accData);
        setTransactions(txData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Derived values from accounts + transactions
  const {
    totalIn,
    totalOut,
    netBalance
  } = useMemo(() => {
    let inSum = 0;
    let outSum = 0;

    transactions.forEach((tx) => {
      if (tx.to_account === "User Bank") {
        inSum += Number(tx.amount);
      }
      if (tx.from_account === "User Bank") {
        outSum += Number(tx.amount);
      }
    });

    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: inSum - outSum
    };
  }, [transactions]);

  // Add a new transaction
  async function addTransaction() {
    if (!newTx.date || !newTx.amount || !newTx.type) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: newTx.date,
          from_account: newTx.from_account,
          to_account: newTx.to_account,
          amount: parseFloat(newTx.amount),
          type: newTx.type,
          description: newTx.description || "",
          status: newTx.status || "Pending"
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create transaction");
      }
      const createdTx = await res.json();

      // Refresh local state
      setTransactions([...transactions, createdTx]);
      setNewTx({
        date: "",
        from_account: "User Bank",
        to_account: "BetMGM",
        amount: "",
        type: "Deposit",
        description: "",
        status: "Pending",
      });
      setShowAddTxModal(false);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return <p>Loading finances...</p>;
  }
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
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

      {/* ACCOUNTS + TRANSACTIONS CHART not shown, but let's show accounts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Accounts */}
        <div className="card">
          <h3 className="text-lg font-bold mb-2">Accounts</h3>
          {accounts.length === 0 && <p>No accounts found.</p>}
          {accounts.map((acc, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-muted">Balance: ${acc.balance}</p>
            </div>
          ))}
        </div>

        {/* We'll skip the actual chart for brevity */}
        <div className="card">
          <h3 className="text-lg font-bold mb-2">[Placeholder] Chart</h3>
          <p className="text-sm text-muted">Implement your chart if desired.</p>
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
        {transactions.length === 0 && <p>No transactions yet.</p>}
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
        )}
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
                  <label>From</label>
                  <input
                    type="text"
                    className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                    value={newTx.from_account}
                    onChange={(e) => setNewTx({ ...newTx, from_account: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label>To</label>
                  <input
                    type="text"
                    className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                    value={newTx.to_account}
                    onChange={(e) => setNewTx({ ...newTx, to_account: e.target.value })}
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
              <button
                className="btn"
                onClick={addTransaction}
              >
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
              <strong>From:</strong> {selectedTx.from_account}
              <br />
              <strong>To:</strong> {selectedTx.to_account}
              <br />
              <strong>Amount:</strong> ${selectedTx.amount}
              <br />
              <strong>Type:</strong> {selectedTx.type}
              <br />
              <strong>Status:</strong> {selectedTx.status}
              <br />
            </p>
            <p className="text-xs text-muted mb-4">
              {selectedTx.description}
            </p>
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
                  Sum of all deposits into "User Bank": currently ${totalIn}.
                </p>
              </>
            )}
            {detailModal === "moneyout" && (
              <>
                <h4 className="text-xl font-bold mb-2">Total Money Out</h4>
                <p className="text-sm mb-4">
                  All withdrawals from "User Bank": currently ${totalOut}.
                </p>
              </>
            )}
            {detailModal === "net" && (
              <>
                <h4 className="text-xl font-bold mb-2">Net Balance</h4>
                <p className="text-sm mb-4">
                  ${netBalance} = (Money In) - (Money Out)
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

export default Finances;
