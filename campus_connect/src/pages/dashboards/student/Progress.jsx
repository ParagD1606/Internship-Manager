import { useEffect, useState } from "react";
import axios from "axios";

// Helper: Progress bar moves ONLY for logs marked APPROVED by Admin
const getApprovedProgress = (logs) => {
  if (!logs || logs.length === 0) return 0;
  const approved = logs.filter(l => l.reviewStatus === "APPROVED").length;
  const totalWeeks = 10; 
  return Math.min((approved / totalWeeks) * 100, 100);
};

export default function StudentProgress() {
  const [engagements, setEngagements] = useState([]);
  const [selectedEng, setSelectedEng] = useState(null);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchEngagements(); }, []);

  const fetchEngagements = async () => {
    try {
      const res = await axios.get("/api/engagements/my", { headers: { Authorization: `Bearer ${token}` } });
      setEngagements(res.data);
    } catch (err) { console.error("Error fetching engagements"); }
  };

  const loadTasks = async (eng) => {
    setSelectedEng(eng);
    try {
      const res = await axios.get(`/api/progress/${eng._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setWeeklyTasks(res.data);
    } catch (err) { setWeeklyTasks([]); }
  };

  // Certificate Upload Logic
  const handleCertificateUpload = async (e, engId) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("certificate", file); 

    try {
      await axios.post(`/api/internship/${engId}/upload-certificate`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Certificate uploaded! Status updated to COMPLETED.");
      fetchEngagements(); 
    } catch (err) { alert("Upload failed."); }
  };

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/progress/submit-work/${activeTask._id}`, {
        summary: e.target.summary.value,
        evidenceLinks: [e.target.link.value]
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Submitted! Waiting for Admin approval.");
      setActiveTask(null);
      loadTasks(selectedEng);
    } catch (err) { alert("Submission failed."); }
  };

  return (
    <div style={styles.page}>
      <style>{`
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .assigned { background: #e0f2fe; color: #0369a1; }
        .pending_review { background: #fef3c7; color: #92400e; }
        .approved { background: #dcfce7; color: #166534; }
        .btn-primary { background: #0f172a; color: white; padding: 12px; border: none; borderRadius: 12px; cursor: pointer; fontWeight: 700; width: 100%; margin-top: 15px; transition: 0.3s; }
        .btn-upload { background: #16a34a; color: white; padding: 12px; border-radius: 12px; display: block; text-align: center; cursor: pointer; font-weight: 700; margin-top: 15px; }
      `}</style>

      <h2 style={{ fontWeight: 800, fontSize: '28px', color: '#1e293b' }}>Progress Tracker</h2>

      <div style={styles.grid}>
        {engagements.map(eng => (
          <div key={eng._id} style={{ ...styles.card, border: selectedEng?._id === eng._id ? '2px solid #6366f1' : '1px solid #e2e8f0' }}>
            <div style={styles.cardHeader}>
               <span style={{ fontSize: '10px', fontWeight: 800, color: '#6366f1', background: '#eef2ff', padding: '4px 8px', borderRadius: '6px' }}>{eng.type}</span>
               <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{eng.status}</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '10px 0 5px 0' }}>{eng.title}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{eng.organization}</p>

            {eng.type === "PROJECT" ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span>Verified Progress</span>
                  <span style={{ fontWeight: 800 }}>{selectedEng?._id === eng._id ? getApprovedProgress(weeklyTasks) : 0}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${selectedEng?._id === eng._id ? getApprovedProgress(weeklyTasks) : 0}%` }} />
                </div>
                <button onClick={() => loadTasks(eng)} className="btn-primary">Manage Weekly Logs</button>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                {eng.certificateUrl ? (
                  <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                    <a href={eng.certificateUrl} target="_blank" style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>View Certificate ✅</a>
                  </div>
                ) : (
                  <label className="btn-upload">
                    Upload Internship Certificate
                    <input type="file" style={{ display: 'none' }} onChange={(e) => handleCertificateUpload(e, eng._id)} accept=".pdf,.jpg,.png" />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedEng && selectedEng.type === "PROJECT" && (
        <div style={styles.tableSection}>
          <h3 style={{ margin: 0 }}>Expected Milestones: {selectedEng.title}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '12px' }}>WEEK</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '12px' }}>ADMIN REQUIREMENTS</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '12px' }}>STATUS</th>
                <th style={{ padding: '15px', color: '#64748b', fontSize: '12px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTasks.map(w => (
                <tr key={w._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 800 }}>Week {w.weekNumber}</td>
                  <td style={{ padding: '15px' }}>{w.tasks?.join(", ")}</td>
                  <td style={{ padding: '15px' }}>
                    <span className={`status-pill ${w.reviewStatus?.toLowerCase() || 'assigned'}`}>{w.reviewStatus || "ASSIGNED"}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {w.reviewStatus !== "APPROVED" && (
                      <button onClick={() => setActiveTask(w)} style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Submit Work</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal logic remains same for Projects */}
      {activeTask && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleWorkSubmit} style={styles.modal}>
            <h3>Submit Week {activeTask.weekNumber}</h3>
            <textarea name="summary" placeholder="Describe your work..." rows="4" style={styles.input} required />
            <input name="link" type="url" placeholder="Evidence Link (GitHub/Drive)" style={styles.input} required />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setActiveTask(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#6366f1', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700 }}>Send to Admin</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: '"Inter", sans-serif' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '30px' },
  card: { background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  progressBarBg: { width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
  progressBarFill: { height: '100%', background: '#6366f1', transition: 'width 0.6s ease' },
  tableSection: { marginTop: '40px', background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' },
  modal: { background: 'white', padding: '30px', borderRadius: '24px', width: '400px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }
};