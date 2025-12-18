// src/pages/admin/SystemSettings.jsx
import React from 'react';
import { Save, Calendar, ShieldCheck, ToggleLeft } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Calendar className="text-red-500" /> Academic Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Application Start</label>
            <input type="date" className="w-full mt-1 p-2 border rounded-lg" defaultValue="2024-11-01" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Application Deadline</label>
            <input type="date" className="w-full mt-1 p-2 border rounded-lg" defaultValue="2024-12-15" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><ToggleLeft className="text-red-500" /> Feature Toggles</h3>
        <div className="space-y-4">
          {[
            { label: 'Blockchain Verification', desc: 'Allow public certificate verification' },
            { label: 'AI Proposal Generation', desc: 'Enable student AI tools for applications' },
            { label: 'External Postings', desc: 'Allow companies to post without faculty approval' }
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-red-600" />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition">
        <Save size={18} /> Apply System Changes
      </button>
    </div>
  );
};

export default SystemSettings;