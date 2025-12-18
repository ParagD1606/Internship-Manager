// src/pages/admin/AnalyticsView.jsx
import React from 'react';
import { Download, PieChart, BarChart } from 'lucide-react';

const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-xl">
        <div>
          <h2 className="text-xl font-bold">Institution Performance</h2>
          <p className="text-gray-400 text-sm">Real-time placement and engagement tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
          <Download size={18} /> Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Application Trends</h3>
            <BarChart className="text-gray-400" />
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="w-full bg-red-100 rounded-t hover:bg-red-500 transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Placement Success</h3>
            <PieChart className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engaged Students</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pending Placements</span>
                <span className="font-bold">15%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;