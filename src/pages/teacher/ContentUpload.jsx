import React, { useState } from 'react';
import { Upload, FileText, Image, Trash2, Eye, Share2, Filter, X, CheckCircle } from 'lucide-react';

const ACCENT = '#4F8EF7';

const MOCK_MATERIALS = [
  { id: 'm1', title: 'Chapter 3 - Algebra Notes', subject: 'Maths', class: '10', board: 'CBSE', type: 'PDF', size: '2.4 MB', date: '1 June 2025', downloads: 18 },
  { id: 'm2', title: 'Quadratic Equations Formula Sheet', subject: 'Maths', class: '10', board: 'CBSE', type: 'PDF', size: '0.8 MB', date: '30 May 2025', downloads: 22 },
  { id: 'm3', title: 'Chemical Bonding Diagrams', subject: 'Science', class: '10', board: 'CBSE', type: 'Image', size: '1.2 MB', date: '28 May 2025', downloads: 15 },
  { id: 'm4', title: 'State Board Algebra Basics', subject: 'Maths', class: '8', board: 'State', type: 'PDF', size: '3.1 MB', date: '25 May 2025', downloads: 8 },
];

const ContentUpload = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [boardFilter, setBoardFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Upload form state
  const [upForm, setUpForm] = useState({ title: '', subject: '', class: '', chapter: '', boards: [] });
  const [upFile, setUpFile] = useState(null);

  const toggleBoard = (b) => setUpForm(f => ({
    ...f,
    boards: f.boards.includes(b) ? f.boards.filter(x => x !== b) : [...f.boards, b]
  }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUpFile(file);
  };

  const handleUpload = async () => {
    if (!upForm.title || !upFile) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newMat = {
      id: 'm' + Date.now(),
      title: upForm.title,
      subject: upForm.subject || 'General',
      class: upForm.class || '—',
      board: upForm.boards.join(', ') || 'All',
      type: upFile.name.endsWith('.pdf') ? 'PDF' : 'Image',
      size: `${(upFile.size / 1048576).toFixed(1)} MB`,
      date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }),
      downloads: 0,
    };
    setMaterials(prev => [newMat, ...prev]);
    setUploading(false);
    setUploaded(true);
    setTimeout(() => { setUploaded(false); setShowUpload(false); setUpForm({ title: '', subject: '', class: '', chapter: '', boards: [] }); setUpFile(null); }, 2000);
  };

  const handleDelete = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  const filtered = materials.filter(m => {
    const matchBoard = boardFilter === 'All' || m.board.includes(boardFilter);
    const matchClass = classFilter === 'All' || m.class === classFilter;
    const matchSubject = subjectFilter === 'All' || m.subject === subjectFilter;
    return matchBoard && matchClass && matchSubject;
  });

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Study Materials</h1>
          <p className="text-sm text-white/50 mt-0.5">{materials.length} materials uploaded</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
          style={{ background: ACCENT, color: '#0A0A0F' }}>
          <Upload size={16} className="mr-2" /> Upload
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Board', state: boardFilter, setState: setBoardFilter, options: ['All', 'CBSE', 'State', 'Matric'] },
          { label: 'Class', state: classFilter, setState: setClassFilter, options: ['All', '8', '9', '10', '11', '12'] },
          { label: 'Subject', state: subjectFilter, setState: setSubjectFilter, options: ['All', 'Maths', 'Science', 'English'] },
        ].map(f => (
          <select key={f.label} value={f.state} onChange={e => f.setState(e.target.value)}
            className="w-full bg-[#12121A] border border-white/5 text-white/70 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4F8EF7]">
            {f.options.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
          </select>
        ))}
      </div>

      {/* Material Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No materials found</p>
          </div>
        ) : filtered.map(mat => (
          <div key={mat.id} className="bg-[#12121A] border border-white/5 rounded-2xl p-5 hover:border-[#4F8EF7]/25 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mat.type === 'PDF' ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>
                  {mat.type === 'PDF' ? <FileText size={20} /> : <Image size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{mat.title}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{mat.subject} • Class {mat.class} • {mat.board}</p>
                  <p className="text-xs text-white/30 mt-0.5">{mat.type} • {mat.size} • {mat.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-white/30">
                <span>⬇</span><span>{mat.downloads}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2 text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-colors font-medium">
                <Eye size={13} className="mr-1.5" /> Preview
              </button>
              <button className="flex-1 flex items-center justify-center py-2 text-xs rounded-xl font-medium transition-colors" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                <Share2 size={13} className="mr-1.5" /> Share
              </button>
              <button onClick={() => handleDelete(mat.id)} className="py-2 px-3 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#12121A] border border-[#4F8EF7]/25 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white">Upload Material</h3>
              <button onClick={() => setShowUpload(false)} className="p-2 text-white/50 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Material Title *</label>
                <input value={upForm.title} onChange={e => setUpForm({ ...upForm, title: e.target.value })}
                  placeholder="e.g. Chapter 3 — Algebra Notes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#4F8EF7] placeholder:text-white/30" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Subject *</label>
                  <select value={upForm.subject} onChange={e => setUpForm({ ...upForm, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7]">
                    <option value="">Select...</option>
                    <option>Maths</option><option>Science</option><option>English</option><option>History</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block">Class *</label>
                  <select value={upForm.class} onChange={e => setUpForm({ ...upForm, class: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4F8EF7]">
                    <option value="">Select...</option>
                    {['6','7','8','9','10','11','12'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 mb-2 block">Boards *</label>
                <div className="flex gap-2 flex-wrap">
                  {['State', 'CBSE', 'Matric', 'ICSE'].map(b => (
                    <button key={b} onClick={() => toggleBoard(b)}
                      className="px-3 py-1.5 rounded-lg text-xs border font-medium transition-all"
                      style={upForm.boards.includes(b) ? { background: ACCENT, borderColor: ACCENT, color: '#0A0A0F' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                      {upForm.boards.includes(b) ? '✓ ' : ''}{b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop Upload */}
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">File Upload *</label>
                <label
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); setUpFile(e.dataTransfer.files?.[0]); }}
                  className={`flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                    dragOver ? 'border-[#4F8EF7] bg-[#4F8EF7]/10' : 'border-white/15 bg-white/3 hover:border-[#4F8EF7]/50 hover:bg-[#4F8EF7]/5'
                  }`}>
                  {upFile ? (
                    <div className="text-center flex flex-col items-center justify-center p-2">
                      {upFile.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(upFile)}
                          alt="Thumbnail preview"
                          className="w-14 h-14 object-cover rounded-lg border border-white/20 mb-1 shadow-md"
                        />
                      ) : (
                        <div className="text-2xl mb-1">📄</div>
                      )}
                      <p className="text-xs text-white font-medium truncate max-w-[200px]">{upFile.name}</p>
                      <p className="text-[10px] text-white/40">{(upFile.size / 1048576).toFixed(1)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="text-white/30 mx-auto mb-2" />
                      <p className="text-sm text-white/50">Tap to upload or drag & drop</p>
                      <p className="text-xs text-white/30 mt-1">PDF, Image, DOC • Max 10MB</p>
                    </div>
                  )}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowUpload(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={handleUpload} disabled={!upForm.title || !upFile || uploading || uploaded}
                className="flex-2 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center transition-all disabled:opacity-50 hover:scale-[1.02]"
                style={{ background: uploaded ? '#00FF88' : ACCENT, color: '#0A0A0F' }}>
                {uploaded ? (<><CheckCircle size={16} className="mr-2" />Uploaded!</>) :
                 uploading ? (<><svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>) :
                 (<><Upload size={16} className="mr-2" />Upload Material</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUpload;
