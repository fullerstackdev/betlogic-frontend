// src/pages/Promotions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Promotions() {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activePromo, setActivePromo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPromos() {
      try {
        const base = import.meta.env.VITE_API_BASE;
        const token = localStorage.getItem("token");
        const res = await fetch(`${base}/promotions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load promotions");
        }
        const data = await res.json();
        setPromos(data); // Suppose array of {id, title, details, dateInfo, image_url}
      } catch (err) {
        setError(err.message);
      }
    }
    loadPromos();
  }, []);

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  // Filter logic if needed:
  const filtered = promos.filter((p) => {
    if (!p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // If filterOption = 'active' vs 'upcoming', do what you need.
    return true;
  });
  // Sort logic if needed.

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
            <option value="">Filter</option>
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((promo) => (
          <div
            key={promo.id}
            className="promo-card"
            onClick={() => setActivePromo(promo)}
          >
            {promo.image_url && (
              <img
                src={promo.image_url}
                alt={promo.title}
                className="w-full h-32 object-cover mb-2 rounded"
              />
            )}
            <h3 className="text-lg font-semibold">{promo.title}</h3>
            <p className="text-sm text-gray-300 mb-2">
              {promo.details || promo.description}
            </p>
            <p className="text-xs text-gray-400">{promo.dateInfo}</p>
          </div>
        ))}
      </div>

      {activePromo && (
        <div className="modal-backdrop" onClick={() => setActivePromo(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">{activePromo.title}</h3>
            {activePromo.image_url && (
              <img
                src={activePromo.image_url}
                alt={activePromo.title}
                className="w-full h-32 object-cover mb-2 rounded"
              />
            )}
            <p className="mb-2 text-sm">
              {activePromo.details || activePromo.description}
            </p>
            <p className="text-xs text-muted mb-4">{activePromo.dateInfo}</p>
            <button
              className="btn mr-2"
              onClick={() => {
                navigate(`/promotions/${activePromo.id}`);
                setActivePromo(null);
              }}
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
