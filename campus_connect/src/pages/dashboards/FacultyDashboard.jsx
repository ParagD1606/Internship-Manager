import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Activity aur Zap ko yahan add kiya hai
import { 
  LayoutDashboard, Users, CheckCircle, BarChart3, Cpu, 
  Award, Megaphone, AlertTriangle, Database, ScrollText, 
  Settings, LogOut, Search, UserCircle, Activity, Zap 
} from 'lucide-react';

// components ka path verify kar lena
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement';
import ApprovalSystem from './admin/ApprovalSystem';
import AnalyticsView from './admin/AnalyticsView';
import AIModeration from './admin/AIModeration';
import CertificateControl from './admin/CertificateControl';
import AnnouncementManager from './admin/AnnouncementManager';
import DisputeHandler from './admin/DisputeHandler';
import AIConfig from './admin/AIConfig';
import AuditLogs from './admin/AuditLogs';
import SystemSettings from './admin/SystemSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('Overview');

  const adminName = localStorage.getItem('name') || 'Admin User';
  const institute = localStorage.getItem('userCollege') || 'CampusConnect Authority';

  const navItems = [
    { name: 'Overview', icon: <LayoutDashboard size={19} />, component: AdminOverview },
    { name: 'Users', icon: <Users size={19} />, component: UserManagement },
    { name: 'Approvals', icon: <CheckCircle size={19} />, component: ApprovalSystem },
    { name: 'Analytics', icon: <BarChart3 size={19} />, component: AnalyticsView },
    { name: 'AI Shield', icon: <Cpu size={19} />, component: AIModeration },
    { name: 'Credentials', icon: <Award size={19} />, component: CertificateControl },
    { name: 'Broadcast', icon: <Megaphone size={19} />, component: AnnouncementManager },
    { name: 'Disputes', icon: <AlertTriangle size={19} />, component: DisputeHandler },
    { name: 'AI Models', icon: <Database size={19} />, component: AIConfig },
    { name: 'Activity', icon: <ScrollText size={19} />, component: AuditLogs },
    { name: 'Settings', icon: <Settings size={19} />, component: SystemSettings },
  ];

  const ActiveComponent = navItems.find(i => i.name === activeView)?.component || AdminOverview;

  return (

    <div className="dashboard-active"
    style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0b0e14', color: '#e2e8f0', overflow: 'hidden' }}>
      
      {/* ELITE SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1f2937', flexShrink: 0 }}>
        
        {/* Brand Section */}
        <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ height: '35px', width: '35px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* ✅ FIXED: Pehle 'Activity' undefined tha, ab chalega */}
            <Activity color="white" size={20} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>CORE ADMIN</h2>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '10px 15px', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <div 
              key={item.name}
              onClick={() => setActiveView(item.name)}
              style={{
                display: 'flex', alignItems: 'center', padding: '14px 18px', marginBottom: '8px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                backgroundColor: activeView === item.name ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeView === item.name ? '#818cf8' : '#64748b',
                border: activeView === item.name ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
              }}
            >
              <span style={{ marginRight: '14px', display: 'flex' }}>{item.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: activeView === item.name ? '700' : '500' }}>{item.name}</span>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #1f2937', backgroundColor: '#0f172a' }}>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #374151', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: '80px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', background: '#0b0e14', flexShrink: 0 }}>
          <div>
            <span style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>System Command / {activeView}</span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.6rem', fontWeight: '800' }}>{activeView} Center</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '8px 15px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '8px', color: '#22c55e', fontSize: '11px', fontWeight: 'bold' }}>SYSTEM HEALTH: OPTIMAL</div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', backgroundColor: '#0b0e14' }}>
          <div style={{ backgroundColor: '#111827', borderRadius: '24px', border: '1px solid #1f2937', padding: '30px', minHeight: '100%' }}>
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;