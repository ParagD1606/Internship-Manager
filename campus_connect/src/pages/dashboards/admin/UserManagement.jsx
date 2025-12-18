// src/pages/admin/UserManagement.jsx
import React, { useState } from 'react';
import { 
  Users, UserCheck, UserX, Search, Filter, 
  MoreVertical, Trash2, Shield, Mail, Phone 
} from 'lucide-react';

const UserManagement = () => {
  // 1. Initial Mock Data
  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Verma', email: 'rahul@college.edu', role: 'Student', status: 'Active', phone: '+91 98765 43210' },
    { id: 2, name: 'Dr. Arishta Mehta', email: 'arishta@college.edu', role: 'Faculty', status: 'Active', phone: '+91 98765 43211' },
    { id: 3, name: 'Sneha Rao', email: 'sneha@college.edu', role: 'Student', status: 'Suspended', phone: '+91 98765 43212' },
    { id: 4, name: 'Prof. Rajesh Kumar', email: 'rajesh@college.edu', role: 'Faculty', status: 'Active', phone: '+91 98765 43213' },
    { id: 5, name: 'Amit Patel', email: 'amit@college.edu', role: 'Student', status: 'Active', phone: '+91 98765 43214' },
  ]);

  // 2. Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // 3. Logic: Toggle User Status
  const toggleStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return user;
    }));
  };

  // 4. Logic: Delete User
  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // 5. Logic: Filtered List
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <h3 className="text-2xl font-bold">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><UserCheck size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active</p>
            <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><UserX size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Suspended</p>
            <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'Suspended').length}</h3>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Student">Students</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      user.role === 'Faculty' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600 flex items-center gap-1"><Phone size={12}/> {user.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'Active' ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-500'
                        }`}
                      >
                        {user.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;