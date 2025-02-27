// src/pages/PromotionDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PromotionDetail() {
  const { promoId } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPromo() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/promotions/${promoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load promotion detail");
        }
        const data = await res.json();
        setPromo(data.promotion);    // from { promotion, steps }
        setSteps(data.steps || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPromo();
  }, [promoId]);

  if (loading) return <p>Loading promo detail...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!promo) return <p>Promotion not found.</p>;

  return (
    <div className="space-y-4 text-[var(--color-text)]">
      <h2 className="text-2xl font-bold">
        {promo.title} (Promo #{promo.id})
      </h2>

      <div className="bg-[var(--color-mid)] h-48 mb-4 flex items-center justify-center rounded">
        <span className="opacity-50">[ Big Banner Placeholder ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main content (left) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-sm text-[var(--color-text)/80]">
            <p>Start Date: {promo.start_date}</p>
            <p>End Date: {promo.end_date}</p>
            <p>Status: {promo.status}</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Description</h3>
            <p className="text-sm">{promo.description}</p>
          </div>

          {steps.length > 0 && (
            <div>
              <h3 className="font-bold mb-1">Steps</h3>
              {steps.map(s => (
                <div key={s.id} className="mb-2 p-2 bg-[var(--color-dark)] rounded">
                  <strong>Step {s.step_number}:</strong> {s.title}
                  <p className="text-sm">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* For advanced usage, you can show howTo, terms, etc. if your real API returns them */}
          <div className="mt-4">
            <button
              className="btn"
              onClick={() => navigate(`/promotions/${promo.id}/take`)}
            >
              Take This Course
            </button>
          </div>
        </div>

        {/* Right column for related or share */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-2">Share</h3>
            <div className="flex gap-2">
              <button className="btn px-2 py-1">FB</button>
              <button className="btn px-2 py-1">TW</button>
              <button className="btn px-2 py-1">IG</button>
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">Maybe Related</h3>
            <p>List related promos here if your API supports it.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionDetail;
