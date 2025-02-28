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

  // NEW: "Add Account" modal
  const [showAddAcctModal, setShowAddAcctModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  // Load user’s accounts & transactions on mount
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE; 
    const token = localStorage.getItem("token");

    async function loadAccounts() {
      try {
        const resA = await fetch(`${base}/finances/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resA.ok) {
          const errData = await resA.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load accounts");
        }
        const dataA = await resA.json(); // array of {id, name, balance}
        setAccounts(dataA);
      } catch (err) {
        setError(err.message);
      }
    }

    async function loadTransactions() {
      try {
        const resT = await fetch(`${base}/finances/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resT.ok) {
          const errData = await resT.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load transactions");
        }
        const dataT = await resT.json(); 
        // each row: { id, date, amount, type, description, status,
        //            from_account_name, to_account_name }
        setTransactions(dataT);
      } catch (err) {
        setError(err.message);
      }
    }

    loadAccounts();
    loadTransactions();
  }, []);

  // Compute top summary stats
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

    const net = inSum - outSum;
    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: net,
    };
  }, [transactions]);

  // ADD TRANSACTION
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

      const res = await fetch(`${base}/finances/transactions`, {
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
      // “transaction” in data => { message, transaction: {id,date,amount,type,status} }
      if (!data.transaction) {
        throw new Error("Invalid response creating transaction");
      }
      // push new transaction
      setTransactions([...transactions, {
        id: data.transaction.id,
        date: data.transaction.date,
        amount: data.transaction.amount,
        type: data.transaction.type,
        description: data.transaction.description,
        status: data.transaction.status,
        // from_account_name / to_account_name are unknown now, so no direct updates
        from_account_name: newTx.fromAccount,
        to_account_name: newTx.toAccount,
      }]);
      // reset
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

  // ADD ACCOUNT
  async function addAccount() {
    if (!newAccountName.trim()) {
      alert("Account name cannot be empty");
      return;
    }
    try {
      const base = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem("token");
      const res = await fetch(`${base}/finances/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newAccountName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }
      if (!data.account) {
        throw new Error("Invalid response from create account");
      }
      // push into local accounts
      setAccounts([...accounts, data.account]);
      setShowAddAcctModal(false);
      setNewAccountName("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Your Finances</h2>

      {/* ROW 1: TOP CARDS + Add Account Button */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div
          className="card cursor-pointer w-36"
          onClick={() => setDetailModal("moneyin")}
        >
          <h3 className="text-sm text-muted">Total In</h3>
          <p className="text-2xl font-bold">${totalIn}</p>
        </div>
        <div
          className="card cursor-pointer w-36"
          onClick={() => setDetailModal("moneyout")}
        >
          <h3 className="text-sm text-muted">Total Out</h3>
          <p className="text-2xl font-bold">${totalOut}</p>
        </div>
        <div
          className="card cursor-pointer w-36"
          onClick={() => setDetailModal("net")}
        >
          <h3 className="text-sm text-muted">Net</h3>
          <p
            className={`text-2xl font-bold ${
              netBalance >= 0 ? "text-pos" : "text-neg"
            }`}
          >
            ${netBalance}
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowAddAcctModal(true)}
        >
          + Add Account
        </button>
      </div>

      {/* ACCOUNTS + CHART */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-bold mb-2">Accounts</h3>
          {accounts.length === 0 && <p className="text-sm text-muted">No accounts yet.</p>}
          {accounts.map((acc) => (
            <div key={acc.id} className="mb-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-sm text-muted">Balance: ${acc.balance}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-2">Cashflow Chart</h3>
          <div className="h-40 flex items-center justify-center text-muted">
            [Placeholder Chart]
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
      </div>

      {/* ADD ACCOUNT MODAL */}
      {showAddAcctModal && (
        <div
          className="modal-backdrop flex items-center justify-center"
          onClick={() => setShowAddAcctModal(false)}
        >
          <div
            className="modal-content w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Create Account</h3>
            <input
              type="text"
              className="border w-full p-2 rounded bg-[var(--color-dark)] text-white mb-4"
              placeholder="Account Name (e.g. 'My Checking')"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="btn" onClick={addAccount}>Save</button>
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
              <strong>From:</strong> {selectedTx.from_account_name}<br />
              <strong>To:</strong> {selectedTx.to_account_name}<br />
              <strong>Amount:</strong> ${selectedTx.amount}<br />
              <strong>Type:</strong> {selectedTx.type}<br />
              <strong>Status:</strong> {selectedTx.status}<br />
            </p>
            <p className="text-xs text-muted mb-4">
              {selectedTx.description || ""}
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
                <p className="text-sm mb-4">Currently ${totalIn}.</p>
              </>
            )}
            {detailModal === "moneyout" && (
              <>
                <h4 className="text-xl font-bold mb-2">Total Money Out</h4>
                <p className="text-sm mb-4">Currently ${totalOut}.</p>
              </>
            )}
            {detailModal === "net" && (
              <>
                <h4 className="text-xl font-bold mb-2">Net Balance</h4>
                <p className="text-sm mb-4">
                  ${netBalance} = (In minus Out).
                </p>
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
