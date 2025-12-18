import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-elite-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .home-elite-root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --bg: #0f172a;
          --glass: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.1);
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--bg);
          color: white;
          overflow-x: hidden;
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 35%);
        }

        .container { max-width: 1300px; margin: 0 auto; padding: 0 24px; }

        /* HERO SECTION ANIMATED */
        .hero {
          padding: 160px 0 100px;
          text-align: center;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          color: #818cf8;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }

        .hero h1 {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 20px rgba(99, 102, 241, 0.3));
        }

        .hero p {
          font-size: 1.25rem;
          color: #94a3b8;
          max-width: 700px;
          margin: 0 auto 48px;
          line-height: 1.6;
        }

        .btn-group { display: flex; gap: 20px; justify-content: center; }
        
        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 16px 36px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.5);
        }

        .btn-primary:hover { transform: translateY(-5px); box-shadow: 0 30px 60px -12px rgba(99, 102, 241, 0.6); }

        .btn-glass {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
          color: white;
          padding: 16px 36px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          transition: 0.3s;
        }
        .btn-glass:hover { background: rgba(255,255,255,0.1); }

        /* BENTO GRID GLASSMORPHISM */
        .features { padding: 120px 0; }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .bento-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 32px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .bento-card:hover { 
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.05);
        }

        .card-span-2 { grid-column: span 2; }

        .icon-box {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 16px;
          display: flex; alignItems: center; justifyContent: center;
          margin-bottom: 24px;
          font-size: 24px;
        }

        .tag-row { display: flex; gap: 10px; margin-top: 24px; }
        .tag {
          padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }
        .tag-match { background: rgba(34, 197, 94, 0.1); color: #4ade80; border-color: rgba(34, 197, 94, 0.2); }

        /* PROGRESS BAR ANIMATION */
        .progress-container {
          margin-top: 30px;
          background: rgba(0,0,0,0.3);
          border-radius: 100px;
          height: 8px;
          width: 100%;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #6366f1, #a855f7);
          border-radius: 100px;
          width: 85%;
          position: relative;
        }
        .progress-bar::after {
          content: '';
          position: absolute;
          right: 0; top: -4px;
          height: 16px; width: 16px;
          background: white; border-radius: 50%;
          box-shadow: 0 0 15px white;
        }

        /* SUCCESS STORIES GRID */
        .story-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 60px;
        }

        .story-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          padding: 30px;
          border-radius: 24px;
        }

        @media (max-width: 1024px) {
          .bento-grid, .story-grid { grid-template-columns: 1fr; }
          .card-span-2 { grid-column: span 1; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="hero container">
        <div className="badge">
          <span style={{ color: '#4ade80', marginRight: '8px' }}>●</span> SYSTEM STATUS: OPERATIONAL V2.0
        </div>
        <h1>
          Your Projects, <br />
          <span className="gradient-text">Fully Accelerated.</span>
        </h1>
        <p>
          Connect with elite faculty and industry leaders in a high-performance ecosystem designed for the ED004 Problem Statement.
        </p>
        <div className="btn-group">
          <Link to="/dashboard" className="btn-primary">
            Explore Universe <span style={{fontSize: '20px'}}>→</span>
          </Link>
          <Link to="/post" className="btn-glass">
            Deploy Opportunity
          </Link>
        </div>
      </section>

      {/* --- BENTO FEATURES --- */}
      <section className="features container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>The Command Center</h2>
          <p style={{ color: '#94a3b8' }}>Modern tools for modern academic infrastructure.</p>
        </div>

        <div className="bento-grid">
          {/* AI Engine Card */}
          <div className="bento-card card-span-2">
            <div className="icon-box">🔍</div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>AI Neural Matcher</h3>
            <p style={{ color: '#94a3b8', maxWidth: '500px' }}>
              Our proprietary algorithm analyzes over 50+ data points in your profile to find projects where you hold a 95%+ success probability.
            </p>
            <div className="tag-row">
              <span className="tag">TensorFlow</span>
              <span className="tag">NLP</span>
              <span className="tag tag-match">98.4% Match Rate</span>
            </div>
          </div>

          {/* Gamification Card */}
          <div className="bento-card">
            <div className="icon-box" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>🏆</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Skill Velocity</h3>
            <p style={{ color: '#94a3b8' }}>Real-time milestone tracking with blockchain-backed badges.</p>
            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
            <p style={{marginTop: '15px', fontSize: '12px', fontWeight: '700', color: '#f59e0b'}}>RANK: GOLD TIER</p>
          </div>

          {/* Small Cards */}
          <div className="bento-card">
            <h4 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Faculty Relay</h4>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>Encrypted direct channels for research approvals.</p>
          </div>
          <div className="bento-card">
            <h4 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Industry Portal</h4>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>Bridge the gap between lab research and market.</p>
          </div>
          <div className="bento-card">
            <h4 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Smart Certs</h4>
            <p style={{color: '#94a3b8', fontSize: '14px'}}>One-click verification for LinkedIn & CVs.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="stories container" style={{paddingBottom: '150px'}}>
        <div className="story-grid">
            <div className="story-card">
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <div style={{width:'50px', height:'50px', borderRadius:'15px', background:'linear-gradient(45deg, #ec4899, #f43f5e)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800'}}>P</div>
                    <div>
                        <div style={{fontWeight:'700'}}>Priya Mishra</div>
                        <div style={{fontSize:'12px', color:'#6366f1'}}>Machine Learning Lead</div>
                    </div>
                </div>
                <p style={{marginTop: '20px', color: '#94a3b8', lineHeight: '1.6'}}>"The AI recommendation engine found me a research project that matched my exactly."</p>
            </div>
            {/* Add more cards here if needed */}
        </div>
      </section>
    </div>
  );
}