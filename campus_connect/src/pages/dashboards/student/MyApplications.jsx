import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, CheckCircle, Clock, XCircle, Info, FileText } from 'lucide-react';

// --- MOCK DATA (For Layout Preview) ---
const MOCK_APPS = [
    { 
        _id: 'm1', 
        opportunity: { title: 'Frontend Developer Intern', company: 'TechCorp', type: 'Internship' }, 
        status: 'Applied', 
        appliedAt: '2025-01-10T10:00:00Z',
        resumeLink: '#'
    },
    { 
        _id: 'm2', 
        opportunity: { title: 'Junior Data Analyst', company: 'DataWise', type: 'Job' }, 
        status: 'Shortlisted', 
        appliedAt: '2025-01-05T14:30:00Z',
        resumeLink: '#' 
    },
    { 
        _id: 'm3', 
        opportunity: { title: 'React Native Developer', company: 'AppStudio', type: 'Internship' }, 
        status: 'Rejected', 
        appliedAt: '2024-12-28T09:15:00Z',
        resumeLink: '#' 
    }
];

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingMock, setUsingMock] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Guest / No Token -> Show Mock
                setApplications(MOCK_APPS);
                setUsingMock(true);
                setLoading(false);
                return;
            }

            const res = await axios.get('http://127.0.0.1:8080/api/applications/my-applications', {
                headers: { 'x-auth-token': token }
            });

            if (res.data.length > 0) {
                setApplications(res.data);
                setUsingMock(false);
            } else {
                // DB Empty -> Show Mock
                setApplications(MOCK_APPS);
                setUsingMock(true);
            }
        } catch (err) {
            console.error(err);
            // API Error -> Fallback to Mock
            setApplications(MOCK_APPS);
            setUsingMock(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{padding:'50px',textAlign:'center'}}><Loader className="spin"/> Loading...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>My Applications</h1>
            <p style={styles.subtitle}>Track the status of your applications here.</p>

            {usingMock && (
                <div style={styles.mockAlert}>
                    <Info size={18}/>
                    <span><b>Demo Mode:</b> Showing sample data because no applications were found.</span>
                </div>
            )}

            <div style={styles.tableContainer}>
                {applications.length === 0 ? (
                    <div style={styles.emptyState}>You haven't applied to any opportunities yet.</div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tr}>
                                <th style={styles.th}>Role / Company</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Applied On</th>
                                <th style={styles.th}>Resume</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id} style={styles.trBody}>
                                    <td style={styles.td}>
                                        <div style={{fontWeight:'bold', color:'#0f172a'}}>{app.opportunity.title}</div>
                                        <div style={{fontSize:'0.85rem', color:'#64748b'}}>{app.opportunity.company}</div>
                                    </td>
                                    <td style={styles.td}><span style={styles.badge}>{app.opportunity.type}</span></td>
                                    <td style={styles.td}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td style={styles.td}>
                                        <a href={app.resumeLink} target="_blank" rel="noreferrer" style={styles.resumeLink}>
                                            <FileText size={16}/> View PDF
                                        </a>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.statusBadge, 
                                            background: app.status === 'Applied' ? '#e0f2fe' : app.status === 'Shortlisted' ? '#dcfce7' : '#fee2e2',
                                            color: app.status === 'Applied' ? '#0369a1' : app.status === 'Shortlisted' ? '#16a34a' : '#b91c1c'
                                        }}>
                                            {app.status === 'Applied' && <Clock size={14}/>}
                                            {app.status === 'Shortlisted' && <CheckCircle size={14}/>}
                                            {app.status === 'Rejected' && <XCircle size={14}/>}
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' },
    subtitle: { color: '#64748b', marginBottom: '20px' },
    
    mockAlert: { background: '#fffbeb', border: '1px solid #fcd34d', color: '#b45309', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' },

    tableContainer: { background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    tr: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '15px 20px', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' },
    trBody: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '20px', verticalAlign: 'middle' },
    
    badge: { background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
    resumeLink: { display:'flex', alignItems:'center', gap:'5px', textDecoration:'none', color:'#4f46e5', fontSize:'0.9rem', fontWeight:'500' },
    
    emptyState: { padding: '50px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }
};

export default MyApplications;