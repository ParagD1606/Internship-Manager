// src/pages/admin/CertificateControl.jsx
import React, { useState } from 'react';
import { 
  Award, CheckCircle, XCircle, Search, 
  Download, Eye, Filter, Send, 
  ShieldCheck, Clock, User
} from 'lucide-react';

const CertificateControl = () => {
  // 1. Initial Mock Data for Certificates
  const [certificates, setCertificates] = useState([
    { 
      id: "CERT-8821", 
      student: 'Rahul Verma', 
      internship: 'Full Stack Dev', 
      provider: 'TechCorp', 
      status: 'Pending', 
      date: '2023-11-01' 
    },
    { 
      id: "CERT-8822", 
      student: 'Sneha Rao', 
      internship: 'UI/UX Design', 
      provider: 'CreativeMinds', 
      status: 'Issued', 
      date: '2023-10-28' 
    },
    { 
      id: "CERT-8823", 
      student: 'Amit Patel', 
      internship: 'Data Science', 
      provider: 'DataSoft', 
      status: 'Pending', 
      date: '2023-11-02' 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // 2. Logic: Issue Certificate
  const issueCertificate = (id) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, status: 'Issued' } : cert
    ));
  };

  // 3. Logic: Filtered List
  const filteredCerts = certificates.filter(cert =>
    cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Award size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Review</p>
            <h3 className="text-2xl font-bold">{certificates.filter(c => c.status === 'Pending').length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Issued</p>
            <h3 className="text-2xl font-bold">{certificates.filter(c => c.status === 'Issued').length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Generation Rate</p>
            <h3 className="text-2xl font-bold">12/Day</h3>
          </div>
        </div>
      </div>

      {/* SEARCH & CONTROLS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by student name or Cert ID..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition">
          <Send size={16} /> Bulk Issue
        </button>
      </div>

      {/* CERTIFICATES TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Certificate ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student & Course</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Issuer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCerts.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-red-600 font-bold">{cert.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{cert.student}</p>
                    <p className="text-xs text-gray-500">{cert.internship}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{cert.provider}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    cert.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    {cert.status === 'Pending' ? (
                      <button 
                        onClick={() => issueCertificate(cert.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve & Issue"
                      >
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateControl;