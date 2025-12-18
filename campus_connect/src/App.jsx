import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * 🚀 NavbarWrapper: Controls where the homepage navbar is visible.
 * It hides the navbar on Dashboards and Authentication pages to prevent design breaks.
 */
const NavbarWrapper = () => {
  const location = useLocation();
  
  // 🚫 Navbar in paths par bilkul nahi dikhega
  const hideNavbarPaths = [
    '/dashboard', 
    '/post', 
    '/admin', 
    '/login', 
    '/register'
  ];
  
  // Check if current URL starts with any of the restricted paths
  const shouldHide = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  // Return original Navbar for Homepage and other public pages
  return <Navbar />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Logic-based Navbar rendering */}
      <NavbarWrapper />
      
      <Routes>
        {/* Public Routes - Standard Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Elite Dashboard Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes - Post Job functionality */}
        <Route 
          path="/post" 
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;