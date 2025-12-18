// src/pages/admin/ApprovalSystem.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';

const ApprovalSystem = () => {
  const [activeTab, setActiveTab] = useState('Internships');

  const pendingItems = [
    { id: '1', title: 'Full Stack Intern', company: 'Google', type: 'Internship', postedBy: 'HR Dept', date: 'Oct 24' },
    { id: '2', title: 'Blockchain Research', company: 'Academic', type: 'Project', postedBy: 'Dr. Khanna', date: 'Oct 23' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex border-b">
        {['Internships', 'Projects'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wider">
              <th className="pb-4 font-semibold">Title / Provider</th>
              <th className="pb-4 font-semibold">Posted By</th>
              <th className="pb-4 font-semibold">Date</th>
              <th className="pb-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                <td className="py-4">
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.company}</div>
                </td>
                <td className="py-4 text-sm">{item.postedBy}</td>
                <td className="py-4 text-sm text-gray-500">{item.date}</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                      <XCircle size={20} />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalSystem;