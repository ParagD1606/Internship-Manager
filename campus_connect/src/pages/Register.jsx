
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [step, setStep] = useState(1);
  const [tempUserId, setTempUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [file, setFile] = useState(null);

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student', // Basic
    state: '', district: '', taluka: '', collegeName: '', // Faculty
    collegeCode: '', branch: '', year: '', cgpa: '' // Student Profile
  });

  const [statesList, setStatesList] = useState([]);      
  const [districtsList, setDistrictsList] = useState([]); 
  const [collegesList, setCollegesList] = useState([]);   
  const [isLoading, setIsLoading] = useState(false);
  const [isManualCollege, setIsManualCollege] = useState(false);

  // --- INIT ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('role')) setFormData(prev => ({ ...prev, role: params.get('role') }));
    
    // Fetch States
    axios.get('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => setStatesList(res.data.states))
      .catch(() => {});
  }, [location]);

  // --- HANDLERS (Location & File) ---
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateObj = statesList.find(s => s.state === selectedState);
    setFormData({ ...formData, state: selectedState, district: '', collegeName: '' });
    setDistrictsList(stateObj ? stateObj.districts : []);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData({ ...formData, district: selectedDistrict, collegeName: '' });
    setIsManualCollege(false);
    if (selectedDistrict) {
       setIsLoading(true);
       axios.get(`http://universities.hipolabs.com/search?country=India`)
        .then(res => setCollegesList(res.data.map(c => c.name).sort()))
        .catch(() => setCollegesList([]))
        .finally(() => setIsLoading(false));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
        if (f.size > 5 * 1024 * 1024) { toast.error("File > 5MB"); e.target.value = ""; return; }
        setFile(f);
        toast.success("File attached");
    }
  };

  // --- STEP 1 SUBMIT: REGISTER ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating Account...');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (formData.role === 'faculty') {
        if (!file) { toast.dismiss(loadingToast); toast.error("Document required"); return; }
        data.append('verificationDoc', file);
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', data, {headers: { "Content-Type": "multipart/form-data" }});
      setTempUserId(res.data.userId);
      setStep(2);
      toast.dismiss(loadingToast);
      toast.success('OTP Sent!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.msg || 'Failed');
    }
  };

  // --- STEP 2 SUBMIT: VERIFY OTP ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/verify-otp', { userId: tempUserId, otp });
      
      if (formData.role === 'faculty') {
          toast.success(`Welcome Admin! Your ID: ${res.data.collegeCode}`, { duration: 8000 });
          navigate('/login');
      } else {
          // If Student, move to Step 3 (Profile)
          toast.success('Verified! Now setup your profile.');
          setStep(3);
      }
    } catch (err) {
      toast.error('Invalid OTP');
    }
  };

  // --- STEP 3 SUBMIT: COMPLETE PROFILE (STUDENT) ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Linking to College...');

    try {
        await axios.post('http://localhost:8080/api/auth/complete-profile', {
            userId: tempUserId,
            collegeCode: formData.collegeCode,
            branch: formData.branch,
            year: formData.year,
            cgpa: formData.cgpa
        });

        toast.dismiss(loadingToast);
        toast.success("🎉 Profile Setup Complete!");
        setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(err.response?.data?.msg || "Failed to link college");
    }
  };

  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9', padding: '20px' },
    card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: '500px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px', background:'#f8fafc' },
    btn: { width: '100%', padding: '14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    stepDot: (active) => ({ width: '10px', height: '10px', borderRadius: '50%', background: active ? '#4f46e5' : '#cbd5e1', margin: '0 5px', transition:'0.3s' })
  };

  return (
    <div style={styles.container}>
      <Toaster />
      <div style={styles.card}>
        
        {/* PROGRESS INDICATOR */}
        <div style={{display:'flex', justifyContent:'center', marginBottom:'30px'}}>
            <div style={styles.stepDot(step >= 1)}></div>
            <div style={styles.stepDot(step >= 2)}></div>
            {formData.role === 'student' && <div style={styles.stepDot(step >= 3)}></div>}
        </div>

        {/* --- STEP 1: REGISTER --- */}
        {step === 1 && (
            <form onSubmit={handleRegisterSubmit}>
                <h2 style={{textAlign:'center', marginBottom:'20px'}}>Create Account</h2>
                
                {/* ROLE TOGGLE */}
                <div style={{display:'flex', background:'#f1f5f9', padding:'5px', borderRadius:'8px', marginBottom:'20px'}}>
                    {['student', 'faculty'].map(r => (
                        <div key={r} onClick={() => setFormData({...formData, role: r})} 
                             style={{flex:1, textAlign:'center', padding:'10px', cursor:'pointer', borderRadius:'6px', textTransform:'capitalize', fontWeight:'600',
                             background: formData.role === r ? 'white' : 'transparent', boxShadow: formData.role === r ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'}}>
                            {r}
                        </div>
                    ))}
                </div>

                <input style={styles.input} type="text" placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
                <input style={styles.input} type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
                <input style={styles.input} type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />

                {/* Faculty Fields */}
                {formData.role === 'faculty' && (
                    <div style={{padding:'15px', background:'#f8fafc', borderRadius:'8px', border:'1px solid #e2e8f0', marginBottom:'15px'}}>
                        <p style={{fontSize:'0.8rem', fontWeight:'bold', marginBottom:'10px'}}>Institution Details</p>
                        <select style={styles.input} onChange={handleStateChange} required>
                            <option value="">Select State</option>
                            {statesList.map((s,i)=><option key={i} value={s.state}>{s.state}</option>)}
                        </select>
                        <select style={styles.input} onChange={handleDistrictChange} disabled={!formData.state} required>
                            <option value="">Select District</option>
                            {districtsList.map((d,i)=><option key={i} value={d}>{d}</option>)}
                        </select>
                        <input style={styles.input} type="text" placeholder="Taluka" required onChange={e=>setFormData({...formData, taluka: e.target.value})} />
                        
                        {!isManualCollege ? (
                            <select style={styles.input} onChange={e=>setFormData({...formData, collegeName: e.target.value})} required>
                                <option>Select College</option>
                                {collegesList.map((c,i)=><option key={i} value={c}>{c}</option>)}
                            </select>
                        ) : (
                            <input style={styles.input} type="text" placeholder="College Name" onChange={e=>setFormData({...formData, collegeName: e.target.value})}/>
                        )}
                        
                        <div style={{marginBottom:'10px', fontSize:'0.8rem'}}>
                            <input type="checkbox" onChange={e=>setIsManualCollege(e.target.checked)}/> My college is not listed
                        </div>
                        
                        <p style={{fontSize:'0.8rem', color:'red'}}>Upload Auth Letter / ID Card</p>
                        <input type="file" required accept=".pdf,.jpg,.png" onChange={handleFileChange} style={{fontSize:'0.9rem'}}/>
                    </div>
                )}

                <button style={styles.btn}>Next →</button>
                <p style={{textAlign:'center', marginTop:'15px', fontSize:'0.9rem'}}>Already registered? <span onClick={()=>navigate('/login')} style={{color:'#4f46e5', cursor:'pointer'}}>Login</span></p>
            </form>
        )}

        {/* --- STEP 2: VERIFY OTP --- */}
        {step === 2 && (
            <div style={{textAlign:'center'}}>
                <h2>Verify Email</h2>
                <p style={{color:'#64748b', marginBottom:'20px'}}>OTP sent to {formData.email}</p>
                <form onSubmit={handleOtpSubmit}>
                    <input style={{...styles.input, textAlign:'center', fontSize:'1.5rem', letterSpacing:'5px'}} 
                           maxLength="6" placeholder="000000" autoFocus 
                           onChange={e => setOtp(e.target.value)} />
                    <button style={styles.btn}>Verify</button>
                </form>
            </div>
        )}

        {/* --- STEP 3: STUDENT PROFILE (NEW) --- */}
        {step === 3 && (
            <form onSubmit={handleProfileSubmit}>
                <h2 style={{textAlign:'center', marginBottom:'10px'}}>Student Profile</h2>
                <p style={{textAlign:'center', color:'#64748b', marginBottom:'30px', fontSize:'0.9rem'}}>
                    Link your account to your college using the ID provided by your Faculty.
                </p>

                <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px'}}>College Admin ID *</label>
                    <input style={styles.input} type="text" placeholder="e.g. FAC-4921" required 
                           onChange={e => setFormData({...formData, collegeCode: e.target.value})} />
                    <p style={{fontSize:'0.75rem', color:'#64748b', marginTop:'-10px'}}>Ask your HOD/Teacher for this code.</p>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
                    <div>
                        <label style={{fontSize:'0.85rem', fontWeight:'600'}}>Branch</label>
                        <select style={styles.input} required onChange={e => setFormData({...formData, branch: e.target.value})}>
                            <option value="">Select</option>
                            <option value="CS">Comp Sci</option>
                            <option value="IT">IT</option>
                            <option value="EnTC">EnTC</option>
                            <option value="Mech">Mechanical</option>
                            <option value="Civil">Civil</option>
                        </select>
                    </div>
                    <div>
                        <label style={{fontSize:'0.85rem', fontWeight:'600'}}>Year</label>
                        <select style={styles.input} required onChange={e => setFormData({...formData, year: e.target.value})}>
                            <option value="">Select</option>
                            <option value="FE">First Year</option>
                            <option value="SE">Second Year</option>
                            <option value="TE">Third Year</option>
                            <option value="BE">Final Year</option>
                        </select>
                    </div>
                </div>

                <label style={{display:'block', fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px'}}>Current CGPA</label>
                <input style={styles.input} type="number" step="0.01" min="0" max="10" placeholder="e.g. 8.5" required 
                       onChange={e => setFormData({...formData, cgpa: e.target.value})} />

                <button style={styles.btn}>Complete Setup 🎉</button>
            </form>
        )}

      </div>
    </div>
  );
}