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
    referral_name: '',
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
    <div className="max-w-xl mx-auto p-8 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">User Onboarding</h1>

      {step === 1 && (
        <div className="space-y-4">
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="p-3 w-full rounded bg-gray-700 border border-gray-600"
          />
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded" onClick={() => setStep(2)}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
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
            className="p-3 w-full rounded bg-gray-700 border border-gray-600"
          >
            <option value="">Select Your Bank</option>
            <option value="Chase">Chase</option>
            <option value="Bank of America">Bank of America</option>
            <option value="Wells Fargo">Wells Fargo</option>
            <option value="Other">Other</option>
          </select>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded" onClick={() => setStep(3)}>
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
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
              className="p-3 w-full rounded bg-gray-700 border border-gray-600"
            >
              <option value="DraftKings">DraftKings</option>
              <option value="FanDuel">FanDuel</option>
              <option value="BetMGM">BetMGM</option>
              <option value="Other">Other</option>
            </select>
          )}
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded" onClick={() => setStep(4)}>
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <label>Calendar availability (e.g., Monday 10:00-12:00):</label>
          <input
            type="text"
            className="p-3 w-full rounded bg-gray-700 border border-gray-600"
            onChange={(e) =>
              setForm({ ...form, calendar_availability: { days: ['Monday'], times: [e.target.value] } })
            }
          />
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded" onClick={() => setStep(5)}>
            Next
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <label>Referral Name (Optional):</label>
          <input
            type="text"
            name="referral_name"
            placeholder="Enter referral name if applicable"
            value={form.referral_name}
            onChange={handleChange}
            className="p-3 w-full rounded bg-gray-700 border border-gray-600"
          />
          <button className="w-full py-3 bg-green-600 hover:bg-green-700 rounded" onClick={handleSubmit}>
            Complete Onboarding
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
