import React, { useEffect, useState } from "react";

function PromotionsPage() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState("");

  async function fetchPromotions() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + "/promotions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch promotions");
      }
      setPromos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Promotions</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {promos.map(p => (
          <li key={p.id}>
            <a href={`/promotions/${p.id}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PromotionsPage;
