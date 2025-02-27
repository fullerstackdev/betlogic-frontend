// src/pages/Promotions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Promotions() {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activePromo, setActivePromo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPromotions() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/promotions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load promotions");
        }
        const data = await res.json();
        setPromos(data); // Expecting array of promotions
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  // Filter logic
  const filteredPromos = promos.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading promotions...</p>;
  }
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Promos</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search promo"
            className="border px-2 py-1 rounded text-sm bg-[var(--color-dark)] text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="border px-2 py-1 rounded text-sm bg-[var(--color-dark)] text-white"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            className="border px-2 py-1 rounded text-sm bg-[var(--color-dark)] text-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="title">Title</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      {filteredPromos.length === 0 && <p>No promotions found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPromos.map((promo) => (
          <div
            key={promo.id}
            className="promo-card"
            onClick={() => setActivePromo(promo)}
          >
            <img
              src={promo.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={promo.title}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{promo.title}</h3>
            <p className="text-sm text-gray-300 mb-2">{promo.description}</p>
            <p className="text-xs text-gray-400">
              {promo.start_date} - {promo.end_date}
            </p>
          </div>
        ))}
      </div>

      {activePromo && (
        <div className="modal-backdrop" onClick={() => setActivePromo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{activePromo.title}</h3>
            <img
              src={activePromo.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={activePromo.title}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <p className="mb-2 text-sm">{activePromo.description}</p>
            <p className="text-xs text-muted mb-4">
              {activePromo.start_date} - {activePromo.end_date}
            </p>
            <button
              className="btn mr-2"
              onClick={() => navigate(`/promotions/${activePromo.id}`)}
            >
              View Full Details
            </button>
            <button
              className="btn bg-[var(--color-mid)] hover:bg-[var(--color-accent)]"
              onClick={() => setActivePromo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;
