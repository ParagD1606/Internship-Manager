import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Header = ({ activeTab, userName, setActiveTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // --- 1. FETCH NOTIFICATIONS ---
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8080/api/notifications', {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll every 30 seconds for new alerts
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. MARK ALL READ ---
  const markAllRead = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.put('http://127.0.0.1:8080/api/notifications/mark-read', {}, {
            headers: { 'x-auth-token': token }
        });
        // Update UI locally
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All marked as read");
    } catch (err) {
        console.error("Failed to mark read");
    }
  };

  // --- 3. HANDLE CLICK ---
  const handleNotificationClick = (notif) => {
      // 1. Navigate if link exists
      if (notif.link && setActiveTab) {
          setActiveTab(notif.link);
      }
      setShowNotifications(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Time formatter (e.g. "2h", "5m")
  const formatTime = (dateString) => {
      const diff = Date.now() - new Date(dateString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
  };

  return (
    <header style={styles.header}>
      {/* Title Section */}
      <div>
        <h1 style={styles.pageTitle}>{activeTab}</h1>
        <p style={styles.subTitle}>Welcome back, {userName}! 👋</p>
      </div>

      {/* Right Side Actions */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', position: 'relative' }} ref={dropdownRef}>
        
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <div 
            style={{...styles.iconBtn, background: showNotifications ? '#eff6ff' : 'white'}} 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} color={showNotifications ? '#4f46e5' : '#64748b'} />
            {unreadCount > 0 && <div style={styles.redDot}></div>}
          </div>

          {/* Dropdown UI */}
          {showNotifications && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <span style={{fontWeight:'700', fontSize:'0.95rem'}}>Notifications</span>
                <span onClick={markAllRead} style={styles.markReadBtn}>Mark all read</span>
              </div>
              
              <div style={styles.list}>
                {notifications.length === 0 ? (
                    <div style={{padding:'20px', textAlign:'center', color:'#94a3b8', fontSize:'0.85rem'}}>No new notifications</div>
                ) : (
                    notifications.map(n => (
                      <div key={n._id} onClick={() => handleNotificationClick(n)} style={{...styles.notifItem, background: n.isRead ? 'white' : '#f8fafc'}}>
                        {/* Blue Dot for Unread */}
                        <div style={{width:'8px', height:'8px', borderRadius:'50%', background: n.isRead ? 'transparent' : '#3b82f6', marginTop:'6px', flexShrink:0}}></div>
                        
                        <div style={{flex:1}}>
                            <p style={{margin:0, fontSize:'0.85rem', fontWeight: n.isRead ? '400' : '600', color:'#1e293b'}}>
                                {n.title}
                            </p>
                            <p style={{margin:'2px 0 0 0', fontSize:'0.75rem', color:'#64748b'}}>
                                {n.message}
                            </p>
                        </div>
                        <span style={{fontSize:'0.7rem', color:'#94a3b8'}}>{formatTime(n.createdAt)}</span>
                      </div>
                    ))
                )}
              </div>
              
              <div style={styles.dropdownFooter}  onClick={() => {
    setActiveTab('Announcements'); // 👈 Switch tab
    setShowNotifications(false);   // Close dropdown
  }}>View All Activity</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '5px' },
  subTitle: { color: '#64748b', margin: 0 },
  iconBtn: { 
    width: '44px', height: '44px', borderRadius: '50%', background: 'white', 
    border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', 
    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  redDot: { position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' },
  
  // Dropdown Styles
  dropdown: {
    position: 'absolute', top: '55px', right: '0', width: '340px', 
    background: 'white', borderRadius: '12px', 
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', 
    border: '1px solid #f1f5f9', zIndex: 200, overflow:'hidden'
  },
  dropdownHeader: {
    padding: '15px 20px', borderBottom: '1px solid #f1f5f9', 
    display:'flex', justifyContent:'space-between', alignItems:'center', color:'#0f172a'
  },
  markReadBtn: { fontSize:'0.75rem', color:'#4f46e5', cursor:'pointer', fontWeight:'600' },
  list: { maxHeight: '320px', overflowY: 'auto' },
  notifItem: {
    padding: '12px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start',
    borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition:'background 0.2s'
  },
  dropdownFooter: {
    padding: '12px', textAlign:'center', fontSize:'0.8rem', color:'#4f46e5', fontWeight:'700',
    background:'#f8fafc', cursor:'pointer', borderTop:'1px solid #f1f5f9'
  }
};

export default Header;