import React from 'react';
import { 
  Users, Briefcase, AlertTriangle, CheckCircle, 
  TrendingUp, Globe, Zap, ArrowUpRight, 
  MessageSquare, FileText, Shield
} from 'lucide-react';

const AdminOverview = () => {
  // 1. Mock Data for Metrics
  const stats = [
    { label: 'Total Students', value: '1,284', icon: <Users className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50' },
    { label: 'Active Internships', value: '432', icon: <Briefcase className="text-purple-600" />, trend: '+5%', color: 'bg-purple-50' },
    { label: 'Pending Approvals', value: '18', icon: <Zap className="text-orange-600" />, trend: '-2', color: 'bg-orange-50' },
    { label: 'Unresolved Disputes', value: '3', icon: <AlertTriangle className="text-red-600" />, trend: 'Critical', color: 'bg-red-50' },
  ];

  // 2. Mock Data for Recent Activity
  const activities = [
    { id: 1, user: 'TechCorp', action: 'posted a new internship', target: 'Frontend Dev', time: '2 mins ago', icon: <Briefcase size={14} /> },
    { id: 2, user: 'Admin', action: 'resolved dispute', target: 'Case #1024', time: '45 mins ago', icon: <Shield size={14} /> },
    { id: 3, user: 'Rahul V.', action: 'submitted certificate', target: 'Verification', time: '2 hours ago', icon: <FileText size={14} /> },
    { id: 4, user: 'System', action: 'flagged content', target: 'User Comment', time: '5 hours ago', icon: <AlertTriangle size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* 1. WELCOME & QUICK ACTIONS */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Institutional Command</h2>
            <p className="text-gray-400 max-w-md">
              Your platform is currently supporting <span className="text-white font-bold">12 partner companies</span> and 
              <span className="text-white font-bold"> 84% student placement</span> this semester.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/20">
              Generate Report
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all">
              System Health
            </button>
          </div>
        </div>
        {/* Decorative Background Element */}
        <Globe size={200} className="absolute -right-20 -bottom-20 text-white/5" />
      </div>

      {/* 2. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. SYSTEM PERFORMANCE (Placeholder for Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={20} />
              Placement Velocity
            </h3>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-lg p-2 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-64 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <BarChart3 size={48} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">Engagement analytics will be visualized here.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase">Average Stipend</p>
              <p className="text-lg font-bold text-gray-900">₹18,500</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase">Top Dept</p>
              <p className="text-lg font-bold text-gray-900">CS / IT</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase">Hire Rate</p>
              <p className="text-lg font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>

        {/* 4. RECENT ACTIVITY FEED */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <zap className="text-yellow-500" size={20} fill="currentColor" />
            Live Activity
          </h3>
          <div className="space-y-6">
            {activities.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative">
                  <div className="h-10 w-10 bg-gray-900 text-white rounded-xl flex items-center justify-center z-10 relative">
                    {item.icon}
                  </div>
                  {/* Timeline connector line */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-gray-100 group-last:hidden"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-tight">
                    <span className="font-bold text-gray-900">{item.user}</span> {item.action} <span className="text-red-600 font-medium">{item.target}</span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{item.time}</p>
                </div>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            View All Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Import for Placeholder
const BarChart3 = ({ className, size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20V14"/>
  </svg>
);

export default AdminOverview;