// src/pages/admin/AuditLogs.jsx
import React from 'react';
import { History, Terminal, User } from 'lucide-react';

const AuditLogs = () => {
  const logs = [
    { id: 1, action: 'Modified Role', user: 'Admin_1', target: 'Faculty_Dr_Smith', time: '2024-10-25 10:30 AM' },
    { id: 2, action: 'Approved Project', user: 'Admin_1', target: 'Blockchain Research', time: '2024-10-25 09:15 AM' },
    { id: 3, action: 'System Config Change', user: 'Admin_Super', target: 'Application Deadlines', time: '2024-10-24 04:45 PM' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center text-white gap-2 font-mono">
          <Terminal size={20} className="text-green-500" /> system_audit_logs --tail 100
        </div>
        <button className="text-xs text-gray-400 hover:text-white underline">Download Raw Logs</button>
      </div>
      <div className="p-0">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 text-gray-500">{log.time}</td>
                <td className="px-6 py-4 flex items-center gap-2"><User size={14} className="text-blue-400" /> {log.user}</td>
                <td className="px-6 py-4"><span className="text-green-400">{log.action}</span></td>
                <td className="px-6 py-4">{log.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;