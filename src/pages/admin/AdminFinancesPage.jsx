import React, { useEffect, useState, useMemo } from "react";

function AdminFinancesPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // For "Add Transaction" modal
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTx, setNewTx] = useState({
    user_id: "",
    from_account: "",
    to_account: "",
    amount: "",
    type: "Deposit",
    description: "",
    status: "Pending"
  });

  // Derived stats for top cards
  const { totalDeposit, totalWithdrawal, netVolume } = useMemo(() => {
    let depositSum = 0;
    let withdrawalSum = 0;
    transactions.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === "Deposit") {
        depositSum += amt;
      } else if (tx.type === "Withdrawal") {
        withdrawalSum += amt;
      }
      // you can handle "Bonus" or other types if needed
    });
    const net = depositSum - withdrawalSum;
    return {
      totalDeposit: depositSum,
      totalWithdrawal: withdrawalSum,
      netVolume: net
    };
  }, [transactions]);

  // Load all transactions
  async function fetchTransactions() {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        import.meta.env.VITE_API_BASE + "/admin/finances",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch transactions");
      }
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  }

  // Create new transaction
  async function createTransaction(e) {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        import.meta.env.VITE_API_BASE + "/admin/finances",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newTx)
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transaction");
      }
      // Clear form
      setNewTx({
        user_id: "",
        from_account: "",
        to_account: "",
        amount: "",
        type: "Deposit",
        description: "",
        status: "Pending"
      });
      setShowAddTxModal(false);
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  }

  // Update transaction status or fields
  async function updateTransaction(id, patchData) {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        import.meta.env.VITE_API_BASE + "/admin/finances/" + id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(patchData)
        }
      );
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Admin Finances</h2>
      {error && <div className="text-red-400">{error}</div>}

      {/* TOP CARDS: total deposit, total withdrawal, net */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card cursor-pointer">
          <h3 className="text-sm text-muted">Total Deposit</h3>
          <p className="text-2xl font-bold">${totalDeposit}</p>
        </div>
        <div className="card cursor-pointer">
          <h3 className="text-sm text-muted">Total Withdrawal</h3>
          <p className="text-2xl font-bold">${totalWithdrawal}</p>
        </div>
        <div className="card cursor-pointer">
          <h3 className="text-sm text-muted">Net Volume</h3>
          <p className="text-2xl font-bold">
            ${netVolume >= 0 ? netVolume : `-${Math.abs(netVolume)}`}
          </p>
        </div>
      </div>

      {/* "Add Transaction" Button */}
      <div>
        <button
          className="btn"
          onClick={() => setShowAddTxModal(true)}
        >
          + Add Transaction
        </button>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="card p-4">
        <h3 className="text-lg font-bold mb-2">All Transactions</h3>
        <div className="overflow-auto">
          <table className="table min-w-full">
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.user_id}</td>
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
                  <td>{tx.date}</td>
                  <td className="text-center">
                    {tx.status !== "Confirmed" && (
                      <button
                        className="btn text-xs mr-2"
                        onClick={() =>
                          updateTransaction(tx.id, { status: "Confirmed" })
                        }
                      >
                        Confirm
                      </button>
                    )}
                    {tx.status !== "Disputed" && (
                      <button
                        className="btn text-xs bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
                        onClick={() =>
                          updateTransaction(tx.id, { status: "Disputed" })
                        }
                      >
                        Dispute
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showAddTxModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddTxModal(false)}
        >
          <div
            className="modal-content w-[400px]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Add Transaction</h3>
            <div className="space-y-2 text-sm">
              <div>
                <label className="block mb-1">User ID:</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.user_id}
                  onChange={e =>
                    setNewTx({ ...newTx, user_id: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">From Account:</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.from_account}
                  onChange={e =>
                    setNewTx({ ...newTx, from_account: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">To Account:</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.to_account}
                  onChange={e =>
                    setNewTx({ ...newTx, to_account: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Amount:</label>
                <input
                  type="number"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.amount}
                  onChange={e =>
                    setNewTx({ ...newTx, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Type:</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.type}
                  onChange={e => setNewTx({ ...newTx, type: e.target.value })}
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Bonus">Bonus</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Description:</label>
                <input
                  type="text"
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.description}
                  onChange={e =>
                    setNewTx({ ...newTx, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Status:</label>
                <select
                  className="border w-full p-1 rounded bg-[var(--color-dark)] text-white"
                  value={newTx.status}
                  onChange={e => setNewTx({ ...newTx, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Disputed">Disputed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button className="btn" onClick={createTransaction}>
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
    </div>
  );
}

export default AdminFinancesPage;
