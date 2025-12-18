import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: '20px 0',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LOGO SECTION */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '8px'
          }}></div>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            CampusConnect
          </span>
        </Link>

        {/* NAV LINKS (Glass Background) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          padding: '6px',
          borderRadius: '100px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {['Projects', 'Mentors', 'Stories'].map((item) => (
            <Link key={item} to={`#${item.toLowerCase()}`} style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              padding: '8px 20px',
              borderRadius: '100px',
              transition: '0.3s'
            }} className="nav-item-hover">
              {item}
            </Link>
          ))}
        </div>

        {/* AUTH ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
            Sign In
          </Link>
          <Link to="/register" style={{
            background: 'white',
            color: '#0f172a',
            padding: '10px 24px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '800',
            transition: '0.3s'
          }}>
            Get Started
          </Link>
        </div>
      </div>

      <style>{`
        .nav-item-hover:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;