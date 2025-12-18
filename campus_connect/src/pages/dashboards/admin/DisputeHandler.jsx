// src/pages/admin/DisputeHandler.jsx
import React, { useState } from 'react';
import { 
  MessageSquare, AlertTriangle, Scale, Search, 
  User, Send, CheckCircle, Info, MoreVertical 
} from 'lucide-react';

const DisputeHandler = () => {
  // 1. State for Dispute Cases (Contact Sidebar)
  const [disputes] = useState([
    { 
      id: 1024, 
      student: 'Rahul V.', 
      mentor: 'TechCorp', 
      subject: 'Attendance Conflict', 
      status: 'High',
      lastMessage: 'I have medical certificates...' 
    },
    { 
      id: 1025, 
      student: 'Sneha R.', 
      mentor: 'DataSoft', 
      subject: 'Stipend Delay', 
      status: 'Medium',
      lastMessage: 'Monthly payment not received.' 
    },
    { 
      id: 1026, 
      student: 'Amit P.', 
      mentor: 'WebSol', 
      subject: 'Role Mismatch', 
      status: 'Low',
      lastMessage: 'Assigned data entry instead of dev.' 
    },
  ]);

  const [activeDispute, setActiveDispute] = useState(disputes[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'student', name: 'Rahul V.', text: 'I have medical certificates for the missing 3 days.', time: '10:05 AM' },
    { id: 2, sender: 'mentor', name: 'TechCorp', text: 'Documents were not submitted on the portal in time.', time: '11:20 AM' },
    { id: 3, sender: 'admin', name: 'Admin', text: 'Please upload the scanned copies here for verification.', time: '11:45 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      sender: 'admin',
      name: 'Admin',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. DISPUTE CASES SIDEBAR */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-bold text-gray-800">Active Disputes</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search cases..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {disputes.map((caseItem) => (
            <button
              key={caseItem.id}
              onClick={() => setActiveDispute(caseItem)}
              className={`w-full text-left p-4 border-b border-gray-100 transition-colors ${
                activeDispute.id === caseItem.id ? 'bg-white border-l-4 border-l-red-500 shadow-sm' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Case #{caseItem.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  caseItem.status === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {caseItem.status}
                </span>
              </div>
              <p className="font-bold text-sm text-gray-900">{caseItem.subject}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{caseItem.student} vs {caseItem.mentor}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. RESOLUTION & CHAT WINDOW */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Case #{activeDispute.id}: {activeDispute.subject}</h3>
              <p className="text-xs text-gray-500">Managing Resolution for <span className="font-medium text-gray-700">{activeDispute.student}</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition">
              <CheckCircle size={14} /> Override Status
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          <div className="flex justify-center">
            <span className="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              Dispute Investigation Started
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">{msg.name}</span>
                <span className="text-[10px] text-gray-400">{msg.time}</span>
              </div>
              <div className={`
                max-w-[70%] p-3 rounded-2xl text-sm shadow-sm
                ${msg.sender === 'admin' 
                  ? 'bg-gray-900 text-white rounded-tr-none' 
                  : msg.sender === 'mentor' 
                    ? 'bg-red-50 text-red-900 border border-red-100 rounded-tl-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
              `}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <footer className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button type="button" className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
              <Info size={20} />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Post internal resolution or message parties..." 
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button 
              type="submit"
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md"
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

export default DisputeHandler;