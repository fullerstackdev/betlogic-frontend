// src/pages/PromotionsTake.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PromotionsTake() {
  const { promoId } = useParams();
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSteps() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        // GET the steps from the same endpoint or a separate "steps" endpoint
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/promotions/${promoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load promotion steps");
        }
        const data = await res.json();
        setSteps(data.steps || []);
        // if the server also returns user progress, setCompletedSteps(...) here
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSteps();
  }, [promoId]);

  async function toggleStep(stepId) {
    let updated = [];
    if (completedSteps.includes(stepId)) {
      updated = completedSteps.filter(id => id !== stepId);
    } else {
      updated = [...completedSteps, stepId];
    }
    setCompletedSteps(updated);

    // Save progress
    const token = localStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/promotions/${promoId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completedSteps: updated })
      });
      // you can get updated progressPct from response if needed
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  }

  if (loading) return <p>Loading promotion steps...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!steps.length) return <p>No steps found for this promo.</p>;

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-2">Taking Promo #{promoId}</h2>
      <p className="text-sm text-muted">
        Follow these steps to complete the sportsbook promotion and earn your bonus.
      </p>
      <div className="card p-4">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-2">Progress:</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--color-border)] rounded relative mb-4">
          <div
            className="absolute left-0 top-0 h-2 bg-[var(--color-primary)] rounded"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {steps.map((step) => (
          <div key={step.id} className="mb-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={completedSteps.includes(step.id)}
                onChange={() => toggleStep(step.id)}
              />
              <div>
                <div className="font-bold">Step {step.step_number}: {step.title}</div>
                <p className="text-sm text-muted">{step.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {progressPercent === 100 && (
        <div className="card p-4 text-sm text-pos">
          <strong>All steps completed!</strong> You can now claim your bonus or revisit the lesson for further info.
        </div>
      )}
    </div>
  );
}

export default PromotionsTake;
