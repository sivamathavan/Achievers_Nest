import React, { useState } from 'react';
import { Send, Clock, BellRing, Target, Calendar } from 'lucide-react';

const mockHistory = [
  { id: 1, title: 'Diwali Holidays', audience: 'All', time: 'Oct 10, 2026', status: 'Sent' },
  { id: 2, title: 'Extra Class for Math', audience: 'Batch B', time: 'Tomorrow, 10:00 AM', status: 'Scheduled' },
];

const Announcements = () => {
  const [form, setForm] = useState({ title: '', message: '', audienceType: 'All', audienceValue: '', scheduleType: 'Now', scheduleTime: '' });
  const [history, setHistory] = useState(mockHistory);

  const handleSend = (e) => {
    e.preventDefault();
    const newAnn = {
      id: Date.now(),
      title: form.title,
      audience: form.audienceType === 'All' ? 'All' : form.audienceValue,
      time: form.scheduleType === 'Now' ? 'Just Now' : new Date(form.scheduleTime).toLocaleString(),
      status: form.scheduleType === 'Now' ? 'Sent' : 'Scheduled'
    };
    
    setHistory([newAnn, ...history]);
    alert(form.scheduleType === 'Now' ? 'Announcement Sent!' : 'Announcement Scheduled!');
    setForm({ title: '', message: '', audienceType: 'All', audienceValue: '', scheduleType: 'Now', scheduleTime: '' });
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <p className="text-white/60 mt-1">Broadcast messages to students, parents, and staff.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CREATE ANNOUNCEMENT FORM */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gold/20 text-gold rounded-full flex items-center justify-center mr-3">
              <BellRing size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">New Announcement</h2>
          </div>

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="text-xs text-white/40 uppercase block mb-1">Title</label>
              <input type="text" required placeholder="e.g. Holiday Notice" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none" />
            </div>

            <div>
              <label className="text-xs text-white/40 uppercase block mb-1">Message</label>
              <textarea required placeholder="Type your message here..." value={form.message} onChange={e=>setForm({...form, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none min-h-[120px] resize-none"></textarea>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center text-sm font-semibold text-white/80 uppercase">
                <Target size={16} className="mr-2" /> Target Audience
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.audienceType} onChange={e=>setForm({...form, audienceType: e.target.value})} className="w-full bg-[#1A1A24] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-gold">
                  <option value="All">All Users</option>
                  <option value="Batch">Specific Batch</option>
                  <option value="Board">Specific Board</option>
                </select>
                
                {form.audienceType === 'Batch' && (
                  <select required value={form.audienceValue} onChange={e=>setForm({...form, audienceValue: e.target.value})} className="w-full bg-[#1A1A24] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-gold">
                    <option value="" disabled>Select Batch...</option>
                    <option value="Batch A">Batch A</option>
                    <option value="Batch B">Batch B</option>
                  </select>
                )}
                {form.audienceType === 'Board' && (
                  <select required value={form.audienceValue} onChange={e=>setForm({...form, audienceValue: e.target.value})} className="w-full bg-[#1A1A24] border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-gold">
                    <option value="" disabled>Select Board...</option>
                    <option value="CBSE">CBSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                )}
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center text-sm font-semibold text-white/80 uppercase">
                <Clock size={16} className="mr-2" /> Delivery Time
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="schedule" checked={form.scheduleType === 'Now'} onChange={() => setForm({...form, scheduleType: 'Now'})} className="accent-gold" />
                  <span className="text-white text-sm">Send Now</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="schedule" checked={form.scheduleType === 'Later'} onChange={() => setForm({...form, scheduleType: 'Later'})} className="accent-gold" />
                  <span className="text-white text-sm">Schedule for Later</span>
                </label>
              </div>
              
              {form.scheduleType === 'Later' && (
                <div className="mt-2 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input type="datetime-local" required value={form.scheduleTime} onChange={e=>setForm({...form, scheduleTime: e.target.value})} className="w-full bg-[#1A1A24] border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-white text-sm outline-none focus:border-gold [color-scheme:dark]" />
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 rounded-xl transition-colors flex justify-center items-center">
              <Send size={18} className="mr-2" /> {form.scheduleType === 'Now' ? 'Broadcast Now' : 'Schedule Announcement'}
            </button>
          </form>
        </div>

        {/* HISTORY LIST */}
        <div className="glass-card p-6 h-[700px] flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Recent & Scheduled</h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.map(ann => (
              <div key={ann.id} className="bg-white/5 border border-white/10 p-4 rounded-xl relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white">{ann.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${ann.status === 'Sent' ? 'bg-[#00FF88]/20 text-[#00FF88]' : 'bg-orange-400/20 text-orange-400'}`}>
                    {ann.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-white/60">
                  <span className="flex items-center"><Target size={12} className="mr-1" /> {ann.audience}</span>
                  <span className="flex items-center"><Clock size={12} className="mr-1" /> {ann.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Announcements;
