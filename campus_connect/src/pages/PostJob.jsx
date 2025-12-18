import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [form, setForm] = useState({ title: '', description: '', type: 'Project', skillsRequired: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, skillsRequired: form.skillsRequired.split(',') };
    await axios.post('http://localhost:8080/api/opportunities', payload);
    navigate('/');
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto'}}>
      <h1>Post New Opportunity</h1>
      <form onSubmit={handleSubmit} className="card">
        <label>Title</label>
        <input onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. AI Research Assistant" />

        <label>Type</label>
        <select onChange={e => setForm({...form, type: e.target.value})}>
          <option>Project</option>
          <option>Internship</option>
        </select>

        <label>Description</label>
        <textarea rows="5" onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the role..." />

        <label>Skills (comma separated)</label>
        <input onChange={e => setForm({...form, skillsRequired: e.target.value})} placeholder="React, Node, MongoDB" />

        <button type="submit" className="btn">Submit Opportunity</button>
      </form>
    </div>
  );
}