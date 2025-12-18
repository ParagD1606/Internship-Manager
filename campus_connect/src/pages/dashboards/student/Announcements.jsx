import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Info, AlertTriangle, ArrowLeft } from 'lucide-react';

// Accept onBack prop
const Announcements = ({ onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8080/api/notifications', {
          headers: { 'x-auth-token': token }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
      switch(type) {
          case 'success': return <CheckCircle size={20} color="#16a34a" />;
          case 'warning': return <AlertTriangle size={20} color="#ca8a04" />;
          default: return <Info size={20} color="#2563eb" />;
      }
  };

  return (
    <div style={styles.wrapper}>
      {/* Back Button */}
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={18} /> Back to Overview
      </button>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconBox}><Bell size={24} color="#4f46e5" /></div>
          <div>
              <h2 style={styles.title}>Announcements & Activity</h2>
              <p style={styles.subtitle}>Stay updated with your latest applications and alerts.</p>
          </div>
        </div>

        <div style={styles.list}>
          {loading ? (
              <p style={{padding:'20px', textAlign:'center', color:'#64748b'}}>Loading...</p>
          ) : notifications.length === 0 ? (
              <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>
                  <p>No announcements yet.</p>
              </div>
          ) : (
              notifications.map((n) => (
                  <div key={n._id} style={{...styles.item, opacity: n.isRead ? 0.7 : 1}}>
                      <div style={{padding:'10px', background:'#f8fafc', borderRadius:'50%'}}>
                          {getIcon(n.type)}
                      </div>
                      <div style={{flex:1}}>
                          <h4 style={styles.itemTitle}>{n.title}</h4>
                          <p style={styles.itemMsg}>{n.message}</p>
                          <span style={styles.date}>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      {!n.isRead && <div style={styles.unreadDot}></div>}
                  </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '800px', margin: '0 auto' },
  backBtn: { 
    display: 'flex', alignItems: 'center', gap: '8px', 
    background: 'none', border: 'none', color: '#64748b', 
    cursor: 'pointer', marginBottom: '15px', fontWeight: '600',
    fontSize: '0.9rem', padding: '0'
  },
  container: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' },
  header: { padding: '30px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px', alignItems: 'center', background: '#f8fafc' },
  iconBox: { width: '50px', height: '50px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  title: { fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 5px 0' },
  subtitle: { color: '#64748b', margin: 0 },
  list: { padding: '0' },
  item: { padding: '20px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px', alignItems: 'flex-start', transition: 'background 0.2s' },
  itemTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 5px 0' },
  itemMsg: { fontSize: '0.9rem', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.5' },
  date: { fontSize: '0.75rem', color: '#94a3b8' },
  unreadDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb', marginTop: '8px' }
};

export default Announcements;