import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle, XCircle, Clock, ExternalLink, 
  Send, FileText, Calendar, Info, Search, User
} from 'lucide-react';

const ApprovalSystem = () => {
  const [pendingLogs, setPendingLogs] = useState([]);
  const [allEngagements, setAllEngagements] = useState([]); // For Fresh Assignments
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Modal State
  const [newTask, setNewTask] = useState({ 
    weekNumber: '', 
    deliverables: '',
    engagementId: '', 
    studentId: '',
    studentName: '' 
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingData();
    fetchAllEngagements();
  }, []);

  const fetchPendingData = async () => {
    try {
      const res = await axios.get('/api/admin/pending-approvals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLogs(res.data);
    } catch (err) { console.error("Error fetching approvals"); }
  };

  const fetchAllEngagements = async () => {
    try {
      const res = await axios.get('/api/admin/all-engagements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllEngagements(res.data);
    } catch (err) { console.error("Error fetching all students"); }
  };

  const handleReview = async (id, status) => {
    try {
      await axios.patch(`/api/admin/review-log/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Log ${status} successfully!`);
      setSelectedLog(null);
      fetchPendingData();
    } catch (err) { alert("Action failed"); }
  };

  // Open Modal for Fresh Assignment (from the all students list)
  const openAssignModal = (eng) => {
    setNewTask({
      ...newTask,
      engagementId: eng._id,
      studentId: eng.studentId._id,
      studentName: eng.studentId.name,
      weekNumber: '1' // Default to week 1 for fresh assign
    });
    setShowAssignModal(true);
  };

  // Open Modal for Next Week Assignment (from selected pending log)
  const openNextWeekModal = () => {
    setNewTask({
      ...newTask,
      engagementId: selectedLog.engagementId,
      studentId: selectedLog.studentId,
      studentName: selectedLog.studentName,
      weekNumber: (parseInt(selectedLog.weekNumber) + 1).toString()
    });
    setShowAssignModal(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/progress/assign-task', {
        engagementId: newTask.engagementId,
        studentId: newTask.studentId,
        weekNumber: newTask.weekNumber,
        tasks: newTask.deliverables.split(',').map(t => t.trim())
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Milestone assigned successfully!");
      setShowAssignModal(false);
      setNewTask({ weekNumber: '', deliverables: '', engagementId: '', studentId: '', studentName: '' });
    } catch (err) { alert("Assignment failed: " + err.response?.data?.message); }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: PENDING QUEUE */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-[#111827] p-5 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6 text-lg">
              <Clock className="text-amber-500" size={20} />
              Review Queue ({pendingLogs.length})
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingLogs.map((log) => (
                <div 
                  key={log._id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedLog?._id === log._id ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-800 bg-[#0b0e14] hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Week {log.weekNumber}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white leading-tight">{log.studentName}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">{log.projectTitle}</p>
                </div>
              ))}
              {pendingLogs.length === 0 && <p className="text-center text-gray-600 py-4 text-sm">No submissions to review</p>}
            </div>
          </div>

          {/* FRESH ASSIGN LIST (Critical for starting tasks) */}
          <div className="bg-[#111827] p-5 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-widest text-gray-400">
              <User size={16} /> All Active Students
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {allEngagements.map((eng) => (
                <div key={eng._id} className="flex items-center justify-between p-3 bg-[#0b0e14] rounded-xl border border-gray-800">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{eng.studentId?.name}</p>
                    <p className="text-[9px] text-gray-500 truncate">{eng.title}</p>
                  </div>
                  <button 
                    onClick={() => openAssignModal(eng)}
                    className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Send size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL VIEW */}
        <div className="xl:col-span-2">
          {selectedLog ? (
            <div className="bg-[#111827] rounded-2xl border border-gray-800 shadow-2xl flex flex-col h-full overflow-hidden min-h-[600px]">
              <div className="p-8 border-b border-gray-800 bg-[#111827] flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">Reviewing Week {selectedLog.weekNumber}</h2>
                  <p className="text-indigo-400 font-bold text-sm">{selectedLog.studentName} — {selectedLog.projectTitle}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={openNextWeekModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all">
                    <Send size={14} /> Assign Next Week
                  </button>
                  <a href={selectedLog.evidenceLinks?.[0]} target="_blank" className="p-3 bg-gray-800 text-indigo-400 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              <div className="p-8 flex-1 space-y-6">
                <div className="bg-[#0b0e14] p-6 rounded-2xl border border-gray-800">
                  <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} /> Submission Summary
                  </h5>
                  <p className="text-gray-300 leading-relaxed italic">"{selectedLog.summary}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0b0e14] rounded-xl border border-gray-800">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-amber-500 uppercase tracking-tighter">Pending Review</p>
                  </div>
                  <div className="p-4 bg-[#0b0e14] rounded-xl border border-gray-800">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Deliverables</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                       {selectedLog.tasks?.map((t, i) => (
                         <span key={i} className="text-[9px] bg-gray-800 px-2 py-0.5 rounded border border-gray-700 text-gray-400">{t}</span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-800 flex gap-4 bg-[#0b0e14]/40">
                <button onClick={() => handleReview(selectedLog._id, 'APPROVED')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-emerald-900/20">APPROVE & VERIFY</button>
                <button onClick={() => handleReview(selectedLog._id, 'REJECTED')} className="flex-1 border border-red-500/30 text-red-500 hover:bg-red-500/10 py-4 rounded-xl font-black transition-all">REJECT LOG</button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] rounded-2xl border border-dashed border-gray-800 h-full min-h-[600px] flex flex-col items-center justify-center text-gray-600">
              <FileText size={48} className="mb-4 opacity-10" />
              <p className="font-bold text-gray-500">Select a submission or student to continue</p>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGN TASK MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[1000] p-4">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-black text-white">Assign Milestone</h3>
              <p className="text-indigo-400 text-xs font-bold mt-1">Student: {newTask.studentName}</p>
            </div>
            
            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Week Number</label>
                <input 
                  type="number" 
                  value={newTask.weekNumber}
                  onChange={(e) => setNewTask({...newTask, weekNumber: e.target.value})}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-indigo-500"
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tasks (Comma separated)</label>
                <textarea 
                  placeholder="e.g. Design UI, Setup Backend, Connect API"
                  onChange={(e) => setNewTask({...newTask, deliverables: e.target.value})}
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-indigo-500"
                  rows="4" required 
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-4 font-bold text-gray-500 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 py-4 rounded-xl font-black text-white shadow-xl shadow-indigo-900/30">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSystem;