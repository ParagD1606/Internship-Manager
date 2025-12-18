// src/pages/admin/ApprovalSystem.jsx
import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Eye, 
  ExternalLink, Filter, Search, Building2, 
  User, Calendar, AlertCircle 
} from 'lucide-react';

const ApprovalSystem = () => {
  // 1. Initial Mock Data for Pending Approvals
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      type: 'Internship', 
      title: 'Full Stack Developer', 
      requester: 'TechCorp Solutions', 
      date: '2023-10-25', 
      status: 'Pending',
      details: '3-month remote internship for final year students.' 
    },
    { 
      id: 2, 
      type: 'Faculty', 
      title: 'New Faculty Registration', 
      requester: 'Dr. Sunil Verma', 
      date: '2023-10-26', 
      status: 'Pending',
      details: 'Computer Science Department - specialized in AI/ML.' 
    },
    { 
      id: 3, 
      type: 'Internship', 
      title: 'UI/UX Design Intern', 
      requester: 'Creative Minds', 
      date: '2023-10-24', 
      status: 'Pending',
      details: 'Product design internship focusing on mobile apps.' 
    },
  ]);

  const [filterType, setFilterType] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // 2. Logic: Handle Approval
  const handleAction = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    if (selectedRequest?.id === id) setSelectedRequest(null);
  };

  // 3. Logic: Filtered List
  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const filteredRequests = filterType === 'All' 
    ? pendingRequests 
    : pendingRequests.filter(req => req.type === filterType);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* LIST SECTION */}
      <div className="xl:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-orange-500" size={18} />
              Pending Review ({filteredRequests.length})
            </h3>
            <select 
              className="text-xs border-none bg-gray-50 rounded-lg p-1 font-medium focus:ring-0"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Internship">Internships</option>
              <option value="Faculty">Faculty</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredRequests.map((req) => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRequest?.id === req.id 
                    ? 'border-red-500 bg-red-50/30' 
                    : 'border-transparent bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    req.type === 'Internship' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {req.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{req.date}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight">{req.title}</h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Building2 size={12} /> {req.requester}
                </p>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="text-center py-10">
                <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                <p className="text-sm text-gray-500 font-medium">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL VIEW SECTION */}
      <div className="xl:col-span-2">
        {selectedRequest ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.title}</h2>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    Submitted by <span className="font-bold text-gray-700">{selectedRequest.requester}</span>
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:bg-white hover:text-gray-600 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Submission Date</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Calendar size={14}/> {selectedRequest.date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Request Category</p>
                  <p className="text-sm font-medium flex items-center gap-2"><Filter size={14}/> {selectedRequest.type}</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  Description / Details
                </h5>
                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 text-sm text-gray-600 leading-relaxed">
                  {selectedRequest.details}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => handleAction(selectedRequest.id, 'Approved')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-green-100"
              >
                <CheckCircle size={20} /> Approve Request
              </button>
              <button 
                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                className="flex-1 border-2 border-red-100 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle size={20} /> Reject Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Eye size={48} className="text-gray-300" />
            </div>
            <p className="font-medium">Select a request from the sidebar to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalSystem;