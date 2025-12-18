import React from 'react';

const OwnerDashboard = () => {
  return (
    <div className="container" style={{paddingTop:'40px'}}>
      <h1 style={{fontSize:'2rem', fontWeight:'800', marginBottom:'20px'}}>👑 Super Admin Dashboard</h1>
      <p>Welcome, Owner. Here you can manage all colleges and platform settings.</p>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', marginTop:'30px'}}>
          <div style={{background:'#f3e8ff', padding:'30px', borderRadius:'12px', color:'#6b21a8'}}>
              <h2>124</h2>
              <p>Colleges Onboarded</p>
          </div>
          <div style={{background:'#dbeafe', padding:'30px', borderRadius:'12px', color:'#1e40af'}}>
              <h2>8,500+</h2>
              <p>Active Students</p>
          </div>
          <div style={{background:'#dcfce7', padding:'30px', borderRadius:'12px', color:'#166534'}}>
              <h2>$12k</h2>
              <p>Platform Revenue</p>
          </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;