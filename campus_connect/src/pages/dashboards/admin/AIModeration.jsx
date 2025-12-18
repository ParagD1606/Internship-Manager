import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, ShieldX, Bot, 
  AlertCircle, Eye, Trash2, CheckCircle,
  MessageSquare, FileText, User, BarChart
} from 'lucide-react';

const AIModeration = () => {
  // 1. Initial Mock Data for AI-Flagged Content
  const [flags, setFlags] = useState([
    { 
      id: 1, 
      type: 'Internship Post', 
      author: 'Global Tech Inc', 
      content: 'Easy $5000/week! No experience needed. Click this link: bit.ly/scam-link', 
      reason: 'Suspicious Link / Phishing',
      confidence: 98,
      status: 'Flagged'
    },
    { 
      id: 2, 
      type: 'Comment', 
      author: 'Student_99', 
      content: 'This mentor is absolutely terrible and should be fired immediately!', 
      reason: 'Aggressive Language',
      confidence: 82,
      status: 'Flagged'
    },
    { 
      id: 3, 
      type: 'Profile Bio', 
      author: 'Aniket S.', 
      content: 'Looking for crypto trading partners only. Dm for signals.', 
      reason: 'Off-platform Solicitation',
      confidence: 74,
      status: 'Flagged'
    }
  ]);

  // 2. Logic: Handle Moderation Actions
  const handleModeration = (id, action) => {
    if (action === 'Remove') {
      setFlags(flags.filter(f => f.id !== id));
    } else {
      // Keep in list but change status to 'Approved' (or filter out for this view)
      setFlags(flags.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* AI STATUS HEADER */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50">
            <Bot size={32} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Sentinel Active</h2>
            <p className="text-gray-400 text-sm">Monitoring 420+ daily interactions across the platform.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{flags.length}</p>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pending Flags</p>
          </div>
          <div className="text-center border-l border-gray-800 pl-6">
            <p className="text-2xl font-bold text-green-400">99.2%</p>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">AI Accuracy</p>
          </div>
        </div>
      </div>

      {/* MODERATION QUEUE */}
      <div className="grid grid-cols-1 gap-4">
        {flags.map((flag) => (
          <div key={flag.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Flag Meta */}
              <div className="md:w-64 p-4 bg-gray-50/50 border-r border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {flag.type === 'Internship Post' ? <FileText size={14} className="text-blue-500" /> : <MessageSquare size={14} className="text-purple-500" />}
                    <span className="text-xs font-bold text-gray-500 uppercase">{flag.type}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    <User size={14} className="text-gray-400" /> {flag.author}
                  </p>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1">
                    <span>AI Confidence</span>
                    <span className="text-red-500">{flag.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${flag.confidence}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Content and Reason */}
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-700 uppercase leading-none mb-1">Reason: {flag.reason}</p>
                    <p className="text-sm text-gray-700 italic">"{flag.content}"</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => handleModeration(flag.id, 'Approve')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition"
                  >
                    <ShieldCheck size={16} /> Ignore Flag
                  </button>
                  <button 
                    onClick={() => handleModeration(flag.id, 'Remove')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                  >
                    <ShieldX size={16} /> Delete Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {flags.length === 0 && (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Platform is Clean</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">No content is currently flagged for moderation. Your AI filters are working effectively.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModeration;