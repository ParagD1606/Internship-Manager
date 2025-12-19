import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, AlertTriangle, CheckCircle, 
  TrendingUp, Globe, Zap, ArrowUpRight, 
  FileText, Shield, BarChart3, Clock
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    completedInternships: 0,
    placementRate: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch live metrics from backend
        const statsRes = await axios.get('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 2. Fetch live audit logs/activities
        const activityRes = await axios.get('/api/admin/audit-logs?limit=4', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Visual configuration for the 4 top metrics
  const metrics = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users className="text-blue-600" />, trend: '+4%', color: 'bg-blue-50' },
    { label: 'Active Projects', value: stats.activeProjects, icon: <Briefcase className="text-purple-600" />, trend: 'Live', color: 'bg-purple-50' },
    { label: 'Pending Reviews', value: stats.pendingApprovals, icon: <Clock className="text-orange-600" />, trend: stats.pendingApprovals > 5 ? 'High' : 'Low', color: 'bg-orange-50' },
    { label: 'Completed Internships', value: stats.completedInternships, icon: <CheckCircle className="text-emerald-600" />, trend: 'Done', color: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. WELCOME & DYNAMIC STATUS */}
      <div className="bg-gray-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black mb-3">Institutional Command</h2>
            <p className="text-gray-400 max-w-lg leading-relaxed">
              Your platform is currently overseeing <span className="text-indigo-400 font-bold">{stats.activeProjects} academic projects</span>. 
              Review efficiency is currently at <span className="text-emerald-400 font-bold">{stats.placementRate}%</span> this week.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black transition-all shadow-lg shadow-indigo-900/40">
              Generate Audit Report
            </button>
          </div>
        </div>
        <Globe size={250} className="absolute -right-20 -bottom-20 text-white/5 animate-pulse" />
      </div>

      {/* 2. DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-5">
              <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black px-3 py-1 bg-gray-100 text-gray-600 rounded-full tracking-tighter uppercase">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. PROJECT LIFECYCLE ANALYTICS */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <TrendingUp className="text-emerald-500" size={24} />
              Project Completion Velocity
            </h3>
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500 border border-gray-100">
              Live Flow Monitor
            </div>
          </div>
          
          <div className="h-72 w-full bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 relative">
             
             <p className="text-xs font-bold uppercase tracking-widest mt-4">Weekly Milestone Performance Tracking</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Approved Logs</p>
              <p className="text-2xl font-black text-gray-900">{stats.activeProjects * 2}</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Pending Verify</p>
              <p className="text-2xl font-black text-orange-500">{stats.pendingApprovals}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Completion Rate</p>
              <p className="text-2xl font-black text-emerald-500">{stats.placementRate}%</p>
            </div>
          </div>
        </div>

        {/* 4. LIVE ACTIVITY FEED (Dynamic) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <Zap className="text-amber-500" size={24} fill="#f59e0b" />
            System Pulse
          </h3>
          <div className="space-y-8">
            {activities.length > 0 ? activities.map((item) => (
              <div key={item.id} className="flex gap-5 group">
                <div className="relative">
                  <div className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center z-10 relative shadow-lg group-hover:bg-indigo-600 transition-colors">
                    {item.type === 'PROJECT' ? <FileText size={18} /> : <Shield size={18} />}
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-10 bg-gray-100 group-last:hidden"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 leading-snug">
                    <span className="font-black text-gray-900">{item.userName}</span> {item.action} 
                    <span className="text-indigo-600 font-bold ml-1">{item.targetName}</span>
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-2 tracking-widest">{item.timeAgo}</p>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm italic">No recent pulses detected.</p>
            )}
          </div>
          <button className="w-full mt-10 py-4 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100">
            View System Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;