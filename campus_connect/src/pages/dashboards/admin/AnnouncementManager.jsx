// src/pages/admin/AnnouncementManager.jsx
import React from 'react';
import { Megaphone, Send, Users, Shield } from 'lucide-react';

const AnnouncementManager = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Megaphone className="mr-2 text-red-500" /> Create Announcement
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Target Audience</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="target" /> <Users size={16} /> All Students
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="target" /> <Shield size={16} /> Faculty Only
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Announcement Subject</label>
            <input className="w-full p-3 border rounded-lg" placeholder="e.g. Winter Internship Deadline Extended" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Message Content</label>
            <textarea className="w-full p-3 border rounded-lg h-32" placeholder="Write your announcement here..."></textarea>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center hover:bg-red-700 transition">
            <Send size={18} className="mr-2" /> Broadcast Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager;