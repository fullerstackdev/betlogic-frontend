import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    birthday: '',
    has_paypal: false,
    primary_bank: '',
    used_sportsbooks: false,
    sportsbooks_used: [],
    calendar_availability: { days: [], times: [] },
    completed_promotions: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/onboarding`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/");
    } else {
      alert("Onboarding failed, please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-2xl mb-4">User Onboarding</h1>

      {step === 1 && (
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="p-2 w-full rounded bg-gray-700 mt-2"
          />
          <button className="mt-4 btn" onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="has_paypal"
              checked={form.has_paypal}
              onChange={handleChange}
              className="mr-2"
            />
            Do you have a PayPal account?
          </label>
          <select
            name="primary_bank"
            value={form.primary_bank}
            onChange={handleChange}
            className="p-2 w-full rounded bg-gray-700 mt-4"
          >
            <option value="">Select Your Bank</option>
            <option value="Chase">Chase</option>
            <option value="Bank of America">Bank of America</option>
            <option value="Wells Fargo">Wells Fargo</option>
            <option value="Other">Other</option>
          </select>
          <button className="mt-4 btn" onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="used_sportsbooks"
              checked={form.used_sportsbooks}
              onChange={handleChange}
              className="mr-2"
            />
            Have you used sportsbooks before?
          </label>
          {form.used_sportsbooks && (
            <select
              multiple
              name="sportsbooks_used"
              value={form.sportsbooks_used}
              onChange={(e) =>
                setForm({ ...form, sportsbooks_used: [...e.target.selectedOptions].map(o => o.value) })
              }
              className="p-2 w-full rounded bg-gray-700 mt-4"
            >
              <option value="DraftKings">DraftKings</option>
              <option value="FanDuel">FanDuel</option>
              <option value="BetMGM">BetMGM</option>
              <option value="Other">Other</option>
            </select>
          )}
          <button className="mt-4 btn" onClick={() => setStep(4)}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <p>Select your calendar availability (example simplified):</p>
          <input
            type="text"
            placeholder="e.g., Monday 10:00-12:00"
            className="p-2 w-full rounded bg-gray-700 mt-2"
            onChange={(e) =>
              setForm({ ...form, calendar_availability: { days: ['Monday'], times: [e.target.value] } })
            }
          />
          <button className="mt-4 btn" onClick={handleSubmit}>Complete Onboarding</button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
