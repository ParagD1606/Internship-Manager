import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentApplications = ({ onViewAll }) => {
  // Default Mock Data
  const mockApps = [
    { project: 'AI Traffic System', company: 'Smart City Lab', status: 'Shortlisted', date: 'Oct 24', color: '#9333ea', bg: '#f3e8ff' },
    { project: 'React Dashboard', company: 'TechCorp', status: 'Approved', date: 'Oct 22', color: '#2563eb', bg: '#dbeafe' },
    { project: 'Blockchain Voting', company: 'Prof. Mehta', status: 'Pending', date: 'Oct 18', color: '#475569', bg: '#f1f5f9' },
  ];

  const [apps, setApps] = useState(mockApps); // Start with mock
  const [usingRealData, setUsingRealData] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8080/api/opportunities/student/my-applications', {
          headers: { 'x-auth-token': token }
        });
        
        if (res.data.length > 0) {
            // Map real data to UI format
            const formatted = res.data.map(app => ({
                project: app.jobId ? app.jobId.title : 'Job Removed',
                company: app.jobId ? app.jobId.company : 'N/A',
                status: app.status,
                date: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                ...getStatusStyle(app.status)
            }));
            setApps(formatted);
            setUsingRealData(true);
        }
      } catch (err) {
        // Silent fail: keep mock data
      }
    };
    fetchApps();
  }, []);

  const getStatusStyle = (status) => {
      switch(status) {
          case 'Accepted': return { color: '#166534', bg: '#dcfce7' };
          case 'Approved': return { color: '#166534', bg: '#dcfce7' };
          case 'Rejected': return { color: '#991b1b', bg: '#fee2e2' };
          case 'Shortlisted': return { color: '#9333ea', bg: '#f3e8ff' };
          default: return { color: '#475569', bg: '#f1f5f9' };
      }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Recent Applications</h3>
        <button style={styles.viewAllBtn} onClick={onViewAll}>View All →</button>
      </div>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={styles.th}>PROJECT NAME</th>
              <th style={styles.th}>COMPANY/FACULTY</th>
              <th style={styles.th}>STATUS</th>
              <th style={{...styles.th, textAlign: 'right'}}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, i) => (
              <tr key={i} style={styles.row}>
                <td style={{ padding: '16px 0', fontWeight: '600', color: '#334155' }}>{app.project}</td>
                <td style={{ color: '#64748b' }}>{app.company}</td>
                <td>
                  <span style={{ ...styles.statusBadge, color: app.color, background: app.bg }}>
                    {app.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right', color: '#94a3b8' }}>{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', flex: '3', minWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 },
  viewAllBtn: { background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'left', paddingBottom: '12px' },
  row: { borderBottom: '1px solid #f8fafc' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-block' }
};

export default RecentApplications;