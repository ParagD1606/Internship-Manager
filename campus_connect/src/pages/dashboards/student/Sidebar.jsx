import React from 'react';
import { 
  LayoutDashboard, User, Briefcase, FileText, Bot, 
  BarChart2, MessageSquare, Award, Settings, LogOut 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, userName, handleLogout }) => {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <LayoutDashboard size={20} />
        </div>
        <h2 style={styles.logoText}>CampusConnect</h2>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <MenuItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
        <MenuItem icon={<User size={18} />} label="My Profile" active={activeTab === 'My Profile'} onClick={() => setActiveTab('My Profile')} />
        <MenuItem icon={<Briefcase size={18} />} label="Opportunities" active={activeTab === 'Opportunities'} onClick={() => setActiveTab('Opportunities')} />
        <MenuItem icon={<FileText size={18} />} label="Applications" active={activeTab === 'Applications'} onClick={() => setActiveTab('Applications')} />
        <MenuItem icon={<Bot size={18} />} label="AI Tools" active={activeTab === 'AI Tools'} onClick={() => setActiveTab('AI Tools')} />
        <MenuItem icon={<BarChart2 size={18} />} label="Progress Tracker" active={activeTab === 'Progress Tracker'} onClick={() => setActiveTab('Progress Tracker')} />
        <MenuItem icon={<MessageSquare size={18} />} label="Chat" active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} />
        <MenuItem icon={<Award size={18} />} label="Certificates" active={activeTab === 'Certificates'} onClick={() => setActiveTab('Certificates')} />
        <MenuItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
      </nav>

      {/* Footer */}
      <div style={styles.profileFooter}>
        <div style={styles.avatar}>{userName.charAt(0)}</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h4 style={styles.userName}>{userName}</h4>
          <p style={styles.viewProfile}>View Profile</p>
        </div>
        <LogOut size={18} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={handleLogout} />
      </div>
    </aside>
  );
};

// Sub-component for Menu Items
const MenuItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{
      ...styles.menuItem,
      background: active ? '#eff6ff' : 'transparent',
      color: active ? '#4f46e5' : '#64748b',
      borderRight: active ? '3px solid #4f46e5' : '3px solid transparent',
  }}>
    {icon}
    <span style={{ fontSize: '0.9rem', fontWeight: active ? '600' : '500' }}>{label}</span>
  </div>
);

const styles = {
  sidebar: { 
    width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', 
    display: 'flex', flexDirection: 'column', padding: '20px', 
    position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1000,
    boxSizing: 'border-box', alignItems: 'flex-start' 
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', paddingLeft: '10px', width: '100%' },
  logoIcon: { width: '32px', height: '32px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
  logoText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a', margin: 0 },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', margin: '20px 0', width: '100%' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' },
  profileFooter: { borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  userName: { fontSize: '0.9rem', margin: 0, color: '#0f172a' },
  viewProfile: { fontSize: '0.75rem', color: '#64748b', margin: 0, cursor: 'pointer' },
};

export default Sidebar;