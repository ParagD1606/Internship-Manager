import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '', companyOrFaculty: '', type: 'Internship', description: '', skillsRequired: ''
  });
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/opportunities', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/');
    } catch (err) {
      alert('Error posting');
    }
  };

  return (
    <div>
      <h2>Post a New Opportunity</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <input placeholder="Job Title" onChange={e=>setFormData({...formData, title: e.target.value})} required className="input-field"/>
        <input placeholder="Company or Department Name" onChange={e=>setFormData({...formData, companyOrFaculty: e.target.value})} required className="input-field"/>
        
        <select onChange={e=>setFormData({...formData, type: e.target.value})} className="input-field">
            <option value="Internship">Internship</option>
            <option value="Project">Project</option>
        </select>
        
        <textarea placeholder="Description" onChange={e=>setFormData({...formData, description: e.target.value})} required className="input-field" rows="4"/>
        <input placeholder="Skills (comma separated)" onChange={e=>setFormData({...formData, skillsRequired: e.target.value})} required className="input-field"/>
        
        <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>Post Opportunity</button>
      </form>
    </div>
  );
};

export default PostOpportunity;