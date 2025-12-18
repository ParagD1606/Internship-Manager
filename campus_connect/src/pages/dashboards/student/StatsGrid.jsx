import React, { useEffect, useState } from 'react';
import { FileText, BarChart2, Award, Bell } from 'lucide-react';
import axios from 'axios';

const StatsGrid = ({ setActiveTab }) => {
  // Default Mock Data (Fallback)
  const [stats, setStats] = useState({
    applied: 12,
    shortlisted: 4,
    accepted: 2,
    announcements: 3
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8080/api/opportunities/student/my-applications', {
          headers: { 'x-auth-token': token }
        });
            const notifRes = await axios.get('http://127.0.0.1:8080/api/notifications', { headers: { 'x-auth-token': token } });
const unread = notifRes.data.filter(n => !n.isRead).length;
        // If data exists, overwrite mock data
        if(res.data && res.data.length > 0) {
            const apps = res.data;
            setStats({
              applied: apps.length,
              shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
              accepted: apps.filter(a => a.status === 'Accepted').length,
             // announcements: 3 // Static for now
              announcements: unread
            });
        }
      } catch (err) {
        console.warn("Using mock data for stats");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Applied', value: stats.applied, 
      icon: <FileText size={22} color="#2563eb"/>, bg: '#dbeafe', trend: 'Total Applications',
      action: () => setActiveTab('Applications') 
    },
    { 
      label: 'Shortlisted', value: stats.shortlisted, 
      icon: <BarChart2 size={22} color="#7c3aed"/>, bg: '#ede9fe', trend: 'Under Review',
      action: () => setActiveTab('Applications') 
    },
    { 
      label: 'Accepted', value: stats.accepted, 
      icon: <Award size={22} color="#059669"/>, bg: '#d1fae5', trend: 'Congrats! 🎉',
      action: () => setActiveTab('Certificates') 
    },
   
    { 
      label: 'Announcements', value: stats.announcements + ' New', 
      icon: <Bell size={22} color="#d97706"/>, bg: '#fef3c7', trend: 'Check now',
      action: () => setActiveTab('Announcements') // 👈 Add this action
    },
  ];

  return (
    <div style={styles.grid}>
      {statCards.map((stat, i) => (
        <div 
            key={i} 
            style={styles.card} 
            onClick={stat.action}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ ...styles.iconBox, background: stat.bg }}>{stat.icon}</div>
          </div>
          <div>
             <h3 style={styles.value}>{stat.value}</h3>
             <p style={styles.label}>{stat.label}</p>
          </div>
          <p style={styles.trend}>{stat.trend}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px', 
    marginBottom: '20px', 
    width: '100%'
  },
  card: { 
    background: 'white', 
    padding: '20px 24px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    minHeight: '140px', cursor: 'pointer', transition: 'transform 0.2s ease'
  },
  iconBox: { width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', margin: '15px 0 5px 0', lineHeight: '1' },
  label: { fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
  trend: { fontSize: '0.75rem', color: '#94a3b8', marginTop: 'auto', paddingTop: '10px', fontWeight: '500' },
};

export default StatsGrid;