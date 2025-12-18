import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  UploadCloud, FileText, CheckCircle, AlertTriangle, 
  Lightbulb, Loader, X, ChevronRight, Award 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AiResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null); // Reset previous results
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const analyzeResume = async () => {
    if (!file) return toast.error("Upload a resume first!");

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      // 🚀 CALLING OUR NEW AI ENDPOINT
      const res = await axios.post('http://127.0.0.1:8080/api/ai-resume/analyze', formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      toast.success("Analysis Complete!");
    } catch (err) {
      console.error(err);
      toast.error("AI Analysis Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for Score Color
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>AI Resume Analyzer</h1>
          <p style={styles.subtitle}>Get instant feedback on your resume powered by Gemini AI.</p>
        </div>
        <div style={styles.badge}>Beta</div>
      </div>

      {/* UPLOAD SECTION */}
      {!result && !loading && (
        <div style={styles.uploadCard}>
          <div 
            style={styles.dropZone}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display:'none'}} 
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <div style={styles.iconCircle}>
              <UploadCloud size={40} color="#4f46e5"/>
            </div>
            <h3 style={{margin:'15px 0 5px 0', color:'#1e293b'}}>
              {file ? file.name : "Click to Upload Resume"}
            </h3>
            <p style={{color:'#64748b', fontSize:'0.9rem'}}>Supported Format: PDF (Max 5MB)</p>
          </div>

          {file && (
            <button onClick={analyzeResume} style={styles.analyzeBtn}>
              Analyze Now <ChevronRight size={18}/>
            </button>
          )}
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div style={styles.loadingState}>
          <Loader size={50} className="spin" color="#4f46e5"/>
          <h3 style={{marginTop:'20px', color:'#1e293b'}}>Analyzing your resume...</h3>
          <p style={{color:'#64748b'}}>Checking ATS compatibility, keywords, and formatting.</p>
        </div>
      )}

      {/* RESULTS DASHBOARD */}
      {result && (
        <div style={styles.resultContainer}>
          
          {/* TOP ROW: Score & Summary */}
          <div style={styles.topRow}>
            {/* Score Card */}
            <div style={styles.scoreCard}>
              <div style={{position:'relative', width:'120px', height:'120px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {/* Simple SVG Ring */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke={getScoreColor(result.score)} strokeWidth="10"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 - (339.292 * result.score) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div style={{position:'absolute', textAlign:'center'}}>
                  <span style={{fontSize:'2rem', fontWeight:'800', color: getScoreColor(result.score)}}>{result.score}</span>
                  <div style={{fontSize:'0.8rem', color:'#64748b', fontWeight:'600'}}>SCORE</div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div style={styles.summaryCard}>
              <h3 style={{display:'flex', alignItems:'center', gap:'10px', color:'#1e293b', marginTop:0}}>
                <Award size={20} color="#f59e0b"/> AI Summary
              </h3>
              <p style={{lineHeight:'1.6', color:'#334155'}}>{result.summary}</p>
              <button onClick={() => {setResult(null); setFile(null);}} style={styles.reUploadBtn}>
                Analyze Another Resume
              </button>
            </div>
          </div>

          {/* BOTTOM ROW: Feedback Grid */}
          <div style={styles.grid}>
            
            {/* Strengths */}
            <div style={{...styles.card, borderTop:'4px solid #10b981'}}>
              <h4 style={{...styles.cardHeader, color:'#065f46'}}>
                <CheckCircle size={18}/> Strengths
              </h4>
              <ul style={styles.list}>
                {result.strengths.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div style={{...styles.card, borderTop:'4px solid #ef4444'}}>
              <h4 style={{...styles.cardHeader, color:'#991b1b'}}>
                <AlertTriangle size={18}/> Improvements Needed
              </h4>
              <ul style={styles.list}>
                {result.weaknesses.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div style={{...styles.card, borderTop:'4px solid #3b82f6'}}>
              <h4 style={{...styles.cardHeader, color:'#1e40af'}}>
                <Lightbulb size={18}/> Action Plan
              </h4>
              <ul style={styles.list}>
                {result.suggestions.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin:0 },
  subtitle: { color: '#64748b', marginTop:'5px' },
  badge: { background:'#e0e7ff', color:'#4f46e5', padding:'4px 12px', borderRadius:'20px', fontWeight:'700', fontSize:'0.8rem' },
  
  uploadCard: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' },
  dropZone: { border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px', cursor: 'pointer', background: '#f8fafc', transition:'all 0.2s' },
  iconCircle: { width:'70px', height:'70px', background:'#e0e7ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' },
  analyzeBtn: { marginTop:'20px', background: '#4f46e5', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display:'inline-flex', alignItems:'center', gap:'8px', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' },
  
  loadingState: { padding: '60px', textAlign: 'center' },
  
  resultContainer: { display: 'flex', flexDirection: 'column', gap: '25px' },
  topRow: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
  
  scoreCard: { flex:'0 0 180px', background: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  summaryCard: { flex: 1, background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  reUploadBtn: { marginTop:'15px', background:'transparent', border:'1px solid #cbd5e1', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', color:'#475569', fontWeight:'600' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '15px', marginTop: 0 },
  list: { paddingLeft: '20px', margin: 0, color: '#334155' },
  listItem: { marginBottom: '8px', lineHeight: '1.5' }
};

export default AiResumeAnalyzer;