import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Briefcase, MapPin, Calendar, DollarSign, ExternalLink, 
  Plus, Search, X, Loader, Building, Info, CheckCircle, UploadCloud, FileText 
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_DATA = [
    { _id: 'mock1', title: 'Frontend Developer Intern', company: 'TechCorp', type: 'Internship', location: 'Remote', stipend: '₹15,000/mo', deadline: '2025-05-20', applyLink: '#', isMock: true },
    { _id: 'mock2', title: 'SDE-1 (Fresher)', company: 'InnovateX', type: 'Job', location: 'Bangalore', stipend: '₹12 LPA', deadline: '2025-06-01', applyLink: '#', isMock: true },
];

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false); // For Faculty
  const [showApplyModal, setShowApplyModal] = useState(false);   // For Student
  const [selectedOpp, setSelectedOpp] = useState(null);          // Job being applied to
  const [resumeFile, setResumeFile] = useState(null);            // File to upload
  
  const [userRole, setUserRole] = useState('student');
  const [filter, setFilter] = useState('');
  const [usingMock, setUsingMock] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);

  // Faculty Form Data
  const [formData, setFormData] = useState({
    title: '', company: '', type: 'Internship', 
    location: 'Remote', stipend: '', deadline: '', applyLink: '', description: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchOpportunities();
    fetchAppliedStatus();
    const role = localStorage.getItem('role');
    if(role) setUserRole(role);
  }, []);

  const fetchOpportunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setOpportunities(MOCK_DATA); setUsingMock(true); setLoading(false); return; }

      const res = await axios.get('http://127.0.0.1:8080/api/opportunities', { headers: { 'x-auth-token': token } });
      if (res.data.length > 0) { setOpportunities(res.data); setUsingMock(false); } 
      else { setOpportunities(MOCK_DATA); setUsingMock(true); }
    } catch (err) { setOpportunities(MOCK_DATA); setUsingMock(true); } finally { setLoading(false); }
  };

  const fetchAppliedStatus = async () => {
      try {
          const token = localStorage.getItem('token');
          if(!token) return;
          const res = await axios.get('http://127.0.0.1:8080/api/applications/my-applications', { headers: { 'x-auth-token': token } });
          const ids = res.data.map(app => app.opportunity._id);
          setAppliedIds(ids);
      } catch(err) { console.error(err); }
  };

  // --- 1. HANDLE APPLY CLICK (Open Modal) ---
  const onApplyClick = (op) => {
      if(op.isMock) { toast.error("Cannot apply to mock data."); return; }
      setSelectedOpp(op);
      setResumeFile(null); // Reset file
      setShowApplyModal(true);
  };

  // --- 2. SUBMIT APPLICATION (With File) ---
  const submitApplication = async (e) => {
      e.preventDefault();
      if(!resumeFile) { toast.error("Please select a resume PDF"); return; }

      const formData = new FormData();
      formData.append('resume', resumeFile);

      try {
          const toastId = toast.loading("Submitting Application...");
          const token = localStorage.getItem('token');
          
          await axios.post(`http://127.0.0.1:8080/api/applications/apply/${selectedOpp._id}`, formData, {
              headers: { 
                  'x-auth-token': token,
                  'Content-Type': 'multipart/form-data'
              }
          });
          
          toast.dismiss(toastId);
          toast.success("Applied Successfully!");
          setAppliedIds([...appliedIds, selectedOpp._id]);
          setShowApplyModal(false);

          // Optional: Still open external link if needed
          // if(selectedOpp.applyLink && selectedOpp.applyLink !== '#') window.open(selectedOpp.applyLink, '_blank');

      } catch (err) {
          toast.dismiss();
          toast.error(err.response?.data?.msg || "Failed to apply");
      }
  };

  // --- 3. FACULTY CREATE LOGIC ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://127.0.0.1:8080/api/opportunities/create', formData, {
            headers: { 'x-auth-token': token }
        });
        toast.success("Opportunity Posted!");
        setShowCreateModal(false);
        setFormData({ title: '', company: '', type: 'Internship', location: 'Remote', stipend: '', deadline: '', applyLink: '', description: '' });
        fetchOpportunities(); 
    } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to post");
    }
  };

  const handleDelete = async (id) => {
      if (id.toString().startsWith('mock')) { toast.error("Cannot delete mock data."); return; }
      if(!window.confirm("Remove this?")) return;
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://127.0.0.1:8080/api/opportunities/${id}`, { headers: { 'x-auth-token': token } });
          toast.success("Removed");
          fetchOpportunities();
      } catch (err) { toast.error("Failed to delete"); }
  };

  const filteredOpps = opportunities.filter(op => 
      op.title.toLowerCase().includes(filter.toLowerCase()) || 
      op.company.toLowerCase().includes(filter.toLowerCase())
  );

  if(loading) return <div style={{padding:'50px',textAlign:'center'}}><Loader className="spin"/> Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div><h1 style={styles.title}>Opportunities</h1><p style={styles.subtitle}>Find your next role.</p></div>
        {userRole === 'faculty' && <button onClick={() => setShowCreateModal(true)} style={styles.createBtn}><Plus size={18}/> Post Opportunity</button>}
      </div>

      {usingMock && <div style={styles.mockAlert}><Info size={18}/><span><b>Demo Mode:</b> Showing sample data.</span></div>}

      <div style={styles.searchBar}><Search size={20} color="#64748b"/><input style={styles.searchInput} placeholder="Search..." value={filter} onChange={(e) => setFilter(e.target.value)}/></div>

      <div style={styles.grid}>
          {filteredOpps.map((op) => {
              const isApplied = appliedIds.includes(op._id);
              return (
              <div key={op._id} style={{...styles.card, border: op.isMock ? '1px dashed #cbd5e1' : '1px solid #e2e8f0'}}>
                  <div style={styles.cardHeader}>
                      <div style={styles.iconBox}><Building size={24} color="#4f46e5"/></div>
                      <div><h3 style={styles.cardTitle}>{op.title}</h3><p style={styles.cardCompany}>{op.company}</p></div>
                      <span style={styles.typeBadge}>{op.type}</span>
                  </div>
                  <div style={styles.cardBody}>
                      <div style={styles.row}><MapPin size={16}/> {op.location}</div>
                      <div style={styles.row}><DollarSign size={16}/> {op.stipend || 'Unpaid'}</div>
                      <div style={styles.row}><Calendar size={16}/> {new Date(op.deadline).toLocaleDateString()}</div>
                  </div>
                  <div style={styles.cardFooter}>
                      {userRole === 'student' && (
                          <button 
                            onClick={() => onApplyClick(op)} 
                            disabled={isApplied}
                            style={{...styles.applyBtn, background: isApplied ? '#f1f5f9' : 'none', color: isApplied ? '#10b981' : '#4f46e5', cursor: isApplied ? 'default' : 'pointer'}}
                          >
                              {isApplied ? <><CheckCircle size={16}/> Applied</> : <>Apply Now <ExternalLink size={16}/></>}
                          </button>
                      )}
                      {userRole === 'faculty' && <button onClick={() => handleDelete(op._id)} style={styles.deleteBtn}>{op.isMock ? '' : 'Remove'}</button>}
                  </div>
              </div>
          )})}
      </div>

      {/* --- FACULTY CREATE MODAL --- */}
      {showCreateModal && (
          <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                  <div style={styles.modalHeader}><h2>Post New Opportunity</h2><X style={{cursor:'pointer'}} onClick={() => setShowCreateModal(false)}/></div>
                  <form onSubmit={handleCreate} style={styles.form}>
                      <input style={styles.input} placeholder="Job Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required />
                      <input style={styles.input} placeholder="Company Name" value={formData.company} onChange={e=>setFormData({...formData, company:e.target.value})} required />
                      <div style={{display:'flex', gap:'10px'}}>
                          <select style={styles.select} value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})}>
                              <option>Internship</option><option>Job</option><option>Hackathon</option>
                          </select>
                          <input style={styles.input} placeholder="Location" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} />
                      </div>
                      <div style={{display:'flex', gap:'10px'}}>
                           <input style={styles.input} placeholder="Stipend" value={formData.stipend} onChange={e=>setFormData({...formData, stipend:e.target.value})} />
                           <input style={styles.input} type="date" value={formData.deadline} onChange={e=>setFormData({...formData, deadline:e.target.value})} required />
                      </div>
                      <input style={styles.input} placeholder="Apply Link / Email" value={formData.applyLink} onChange={e=>setFormData({...formData, applyLink:e.target.value})} required />
                      <button type="submit" style={styles.submitBtn}>Post Opportunity</button>
                  </form>
              </div>
          </div>
      )}

      {/* --- STUDENT APPLY MODAL --- */}
      {showApplyModal && selectedOpp && (
          <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                  <div style={styles.modalHeader}>
                      <div>
                        <h2 style={{fontSize:'1.3rem'}}>Apply to {selectedOpp.company}</h2>
                        <p style={{color:'#64748b', fontSize:'0.9rem'}}>{selectedOpp.title}</p>
                      </div>
                      <X style={{cursor:'pointer'}} onClick={() => setShowApplyModal(false)}/>
                  </div>

                  <form onSubmit={submitApplication} style={styles.form}>
                      <div 
                        style={styles.uploadBox} 
                        onClick={() => fileInputRef.current.click()}
                      >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display:'none'}} 
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                          />
                          <UploadCloud size={32} color={resumeFile ? '#10b981' : '#64748b'}/>
                          <p style={{margin:'10px 0 0 0', color:'#475569', fontWeight:'500'}}>
                              {resumeFile ? resumeFile.name : "Click to Upload Resume (PDF)"}
                          </p>
                      </div>

                      <div style={{fontSize:'0.85rem', color:'#64748b', background:'#f8fafc', padding:'10px', borderRadius:'8px'}}>
                          <Info size={14} style={{verticalAlign:'middle', marginRight:'5px'}}/>
                          Ensure your resume is updated before applying.
                      </div>

                      <button type="submit" style={styles.submitBtn}>Submit Application</button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

// Styles
const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' },
  subtitle: { color: '#64748b' },
  createBtn: { background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  mockAlert: { background: '#fffbeb', border: '1px solid #fcd34d', color: '#b45309', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: { width: '40px', height: '40px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight:'10px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', margin: 0 },
  cardCompany: { fontSize: '0.9rem', color: '#64748b', margin: 0 },
  typeBadge: { fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', color: '#475569', fontWeight: '600', height:'fit-content' },
  cardBody: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#334155' },
  row: { display: 'flex', alignItems: 'center', gap: '8px' },
  cardFooter: { marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' },
  applyBtn: { background:'none', border:'none', textDecoration: 'none', color: '#4f46e5', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', flex: 1 },
  textArea: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', minHeight: '80px' },
  submitBtn: { background: '#0f172a', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  uploadBox: { border: '2px dashed #cbd5e1', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s' }
};

export default Opportunities;