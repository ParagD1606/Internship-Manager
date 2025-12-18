import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      
      // 1. Store Credentials
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "User");
      
     

// ✅ Add this line to Login.jsx to save the Code!
if (res.data.collegeCode) {
    localStorage.setItem("collegeCode", res.data.collegeCode); 
}
      // 2. Store College Info (For filtering dashboards)
      if (res.data.collegeName) {
        localStorage.setItem("userCollege", res.data.collegeName);
      } else {
        localStorage.removeItem("userCollege");
      }

      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${res.data.name || 'User'}!`);
      
      // 3. Redirect
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.msg || "Invalid Credentials");
    }
  };

  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9', padding: '20px' },
    card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' },
    title: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: '10px' },
    subtitle: { color: '#64748b', textAlign: 'center', marginBottom: '30px', fontSize: '0.95rem' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '0.95rem', outline: 'none' },
    btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    link: { color: '#4f46e5', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" />
      
      <form style={styles.card} onSubmit={onSubmit}>
        <div onClick={() => navigate("/")} style={{cursor:'pointer', marginBottom:'20px', color:'#64748b', fontSize:'0.9rem'}}>← Home</div>
        
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Enter your credentials to access the portal.</p>

        <div>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem', color:'#334155'}}>Email Address</label>
            <input 
                type="email" 
                required 
                placeholder="name@college.edu" 
                style={styles.input} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
        </div>

        <div>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem', color:'#334155'}}>Password</label>
            <input 
                type="password" 
                required 
                placeholder="••••••••" 
                style={styles.input} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
        </div>

        <button type="submit" style={styles.btn}>Sign In</button>

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b'}}>
          Don’t have an account? <span style={styles.link} onClick={() => navigate("/register")}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;