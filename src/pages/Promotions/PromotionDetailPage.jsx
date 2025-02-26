import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PromotionDetailPage() {
  const { promoId } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");

  // for user progress
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");

  async function fetchPromotion() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(import.meta.env.VITE_API_BASE + `/promotions/${promoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch promotion");
      }
      setPromotion(data.promotion);
      setSteps(data.steps);
    } catch (err) {
      setError(err.message);
    }
  }

  // user updates progress
  async function updateProgress() {
    try {
      const token = localStorage.getItem("token");
      const body = {
        completedSteps,
        progressPct
      };
      const res = await fetch(import.meta.env.VITE_API_BASE + `/promotions/${promoId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update progress");
      }
      setProgressMsg(data.message);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchPromotion();
  }, [promoId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  if (!promotion) {
    return <p>Loading promotion...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>{promotion.title}</h2>
      <p>{promotion.description}</p>
      {promotion.image_url && <img src={promotion.image_url} alt="promo" width="200" />}
      <ul>
        {steps.map(s => {
          const checked = completedSteps.includes(s.step_number);
          return (
            <li key={s.id}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => {
                    if (e.target.checked) {
                      setCompletedSteps(prev => [...prev, s.step_number]);
                    } else {
                      setCompletedSteps(prev => prev.filter(num => num !== s.step_number));
                    }
                  }}
                />
                Step {s.step_number}: {s.title}
              </label>
              <p>{s.description}</p>
            </li>
          );
        })}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <label>Progress %</label>
        <input
          type="number"
          value={progressPct}
          onChange={e => setProgressPct(Number(e.target.value))}
        />
        <button onClick={updateProgress}>Update Progress</button>
      </div>

      {progressMsg && <p style={{ color: "green" }}>{progressMsg}</p>}
    </div>
  );
}

export default PromotionDetailPage;
