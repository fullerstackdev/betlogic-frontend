import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function AdminFinancesPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/finances`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((acc, cur) => acc + parseFloat(cur.amount), 0)
    .toFixed(2);

  const totalWithdrawals = transactions
    .filter(t => t.type === "withdrawal")
    .reduce((acc, cur) => acc + parseFloat(cur.amount), 0)
    .toFixed(2);

  const data = [
    { name: 'Deposits', amount: parseFloat(totalDeposits) },
    { name: 'Withdrawals', amount: parseFloat(totalWithdrawals) }
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Financial Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-xl">Total Deposits</p>
              <p className="text-2xl font-bold">${totalDeposits}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-xl">Total Withdrawals</p>
              <p className="text-2xl font-bold">${totalWithdrawals}</p>
            </div>
          </div>

          <div className="h-80 bg-gray-800 p-4 rounded">
            <ResponsiveContainer>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Recent Transactions</h2>
          <table className="w-full text-left bg-gray-800 rounded">
            <thead>
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-t border-gray-700">
                  <td className="p-3">{txn.user_id}</td>
                  <td className="p-3">${txn.amount}</td>
                  <td className="p-3 capitalize">{txn.type}</td>
                  <td className="p-3">{txn.description}</td>
                  <td className="p-3">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminFinancesPage;
