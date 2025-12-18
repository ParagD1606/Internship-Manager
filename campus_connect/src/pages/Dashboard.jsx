import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Sub-Dashboards
import StudentDashboard from './dashboards/StudentDashboard';
import FacultyDashboard from './dashboards/FacultyDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get Role from Storage
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    // 2. Security Check
    if (!token) {
      navigate('/login');
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  // 3. Render based on Role
  if (role === 'owner') {
    return <OwnerDashboard />;
  } 
  
  if (role === 'faculty') {
    return <FacultyDashboard />;
  }

  if (role === 'student') {
    return <StudentDashboard />;
  }

  return (
    <div className="container" style={{textAlign:'center', paddingTop:'50px'}}>
      <h2>Loading...</h2>
    </div>
  );
}