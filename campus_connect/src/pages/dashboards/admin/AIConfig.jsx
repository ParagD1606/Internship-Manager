import React, { useRef, useState } from 'react';
import { 
  Upload, FileText, CheckCircle, X, 
  Settings, ShieldAlert, Cpu, Sparkles, 
  Database, Trash2, Save, RefreshCw 
} from 'lucide-react';

const AIConfig = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([
    { name: 'Placement_Policy_2024.pdf', size: '1.2 MB', status: 'Indexed' },
    { name: 'Internship_Guidelines_v2.docx', size: '0.8 MB', status: 'Indexed' }
  ]);
  const [restrictedTopics, setRestrictedTopics] = useState('Political debates, External commercial links, Religious discussions');
  const [autoModeration, setAutoModeration] = useState(true);
  const [persona, setPersona] = useState('Professional Mentor');
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulation for "Re-indexing" the GenAI Knowledge Base
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('GenAI Knowledge Base has been successfully updated with new documents.');
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const formatted = selectedFiles.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'Ready to Sync'
    }));
    setFiles((prev) => [...prev, ...formatted]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header with Sync Action */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50">
            <Sparkles size={24} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">GenAI Assistant Config</h2>
            <p className="text-gray-400 text-sm">Manage the knowledge and behavior of the student AI.</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
            isSyncing ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 active:scale-95'
          }`}
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Indexing...' : 'Sync Knowledge'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Knowledge Base (RAG Sources) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Database size={20} className="text-blue-500" />
                Knowledge Sources
              </h3>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                {files.length} Documents
              </span>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              hidden
              onChange={handleFileSelect}
            />

            <div
              onClick={() => fileInputRef.current.click()}
              className="group border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-red-500 hover:bg-red-50/30 transition-all"
            >
              <Upload className="mx-auto text-gray-400 group-hover:text-red-500 mb-2 transition-colors" />
              <p className="text-sm font-bold text-gray-700">Upload College Policies</p>
              <p className="text-xs text-gray-400 mt-1">Files are used to ground AI responses (RAG)</p>
            </div>

            <div className="mt-6 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <FileText size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{file.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{file.size} • {file.status}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Persona & Constraints */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-gray-700" />
              AI Personality
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">System Role</label>
                <select 
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option>Professional Mentor</option>
                  <option>Friendly Assistant</option>
                  <option>Strict Policy Officer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Restricted Topics</label>
                <textarea
                  value={restrictedTopics}
                  onChange={(e) => setRestrictedTopics(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[100px]"
                  placeholder="Items the AI should not discuss..."
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-600" />
                  <span className="text-xs font-bold text-red-700">Auto-Moderation</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoModeration} 
                    onChange={() => setAutoModeration(!autoModeration)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
                <Save size={18} /> Save AI Constraints
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;