import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, Target, Clock, ArrowRight, X } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const mockTasks = [
  { id: 1, subject: 'Physics', task: 'Revise Optics (Weakness Detected)', time: '45 mins', completed: true, tag: 'High Priority' },
  { id: 2, subject: 'Math', task: 'Calculus Practice Set 4', time: '60 mins', completed: false, tag: 'Upcoming Test' },
  { id: 3, subject: 'Chemistry', task: 'Organic Reactions Chart', time: '30 mins', completed: false },
];

const subjectProgress = [
  { subject: 'Physics', progress: 65, color: '#00FF88' },
  { subject: 'Math', progress: 85, color: '#FFD700' },
  { subject: 'Chemistry', progress: 45, color: '#FF6B6B' },
];

const StudyPlanner = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('achievers_tasks');
    return saved ? JSON.parse(saved) : mockTasks;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ subject: 'Physics', task: '', time: '30 mins', tag: 'High Priority' });

  useEffect(() => {
    localStorage.setItem('achievers_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getExamCountdown = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const examYear = now.getMonth() >= 3 ? currentYear + 1 : currentYear;
    const examDate = new Date(`${examYear}-02-15`);
    const diffMs = examDate - now;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const examDays = getExamCountdown();
  const examYearLabel = new Date().getMonth() >= 3 ? new Date().getFullYear() + 1 : new Date().getFullYear();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;
    const added = {
      id: Date.now(),
      subject: newTask.subject,
      task: newTask.task,
      time: newTask.time,
      completed: false,
      tag: newTask.tag
    };
    setTasks([...tasks, added]);
    setNewTask({ subject: 'Physics', task: '', time: '30 mins', tag: 'High Priority' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <header className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Target className="text-gold mr-2" /> Smart Planner
          </h1>
          <p className="text-sm text-white/60 mt-1">AI-optimized schedule based on your weak areas.</p>
        </div>
      </header>

      {/* Board Countdown Widget */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg font-space">Board Exams {examYearLabel}</h2>
          <p className="text-sm text-white/70 flex items-center mt-1">
            <Clock size={14} className="mr-1 text-gold" /> Revision phase starts in 45 days
          </p>
        </div>
        <div className="text-center bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
          <p className="text-3xl font-black text-white font-space">{examDays}</p>
          <p className="text-[10px] uppercase text-gold tracking-widest font-bold">Days Left</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Daily Checklist */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Calendar className="mr-2 text-white/50" size={18} /> Today's Focus
            </h2>
            <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
              {tasks.filter(t => t.completed).length} / {tasks.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 rounded-xl border transition-colors flex items-start space-x-4 cursor-pointer ${task.completed ? 'bg-[#00FF88]/5 border-[#00FF88]/20 opacity-70' : 'bg-white/5 border-white/10 hover:border-gold/30'}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="mt-1 shrink-0">
                  {task.completed ? <CheckCircle className="text-[#00FF88]" /> : <Circle className="text-white/30" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded">
                      {task.subject}
                    </span>
                    {task.tag && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${task.tag.includes('Priority') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {task.tag}
                      </span>
                    )}
                  </div>
                  <p className={`font-medium ${task.completed ? 'text-white/50 line-through' : 'text-white'}`}>{task.task}</p>
                  <p className="text-xs text-white/40 mt-1 flex items-center"><Clock size={12} className="mr-1" /> Est: {task.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowAddModal(true)} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/50 text-sm hover:text-white hover:border-white/50 transition-colors flex items-center justify-center cursor-pointer">
            + Add Custom Task
          </button>
        </div>

        {/* Right Col - Progress */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h2 className="text-sm uppercase font-bold text-white/50 mb-4">Syllabus Completion</h2>
            
            <div className="space-y-4">
              {subjectProgress.map(sub => (
                <div key={sub.subject} className="flex items-center space-x-4">
                  <div className="w-12 h-12 shrink-0">
                    <CircularProgressbar 
                      value={sub.progress} 
                      text={`${sub.progress}%`} 
                      styles={buildStyles({
                        textSize: '28px',
                        pathColor: sub.color,
                        textColor: '#fff',
                        trailColor: 'rgba(255,255,255,0.1)'
                      })} 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{sub.subject}</p>
                    <p className="text-[10px] text-white/40">Chapter 4/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Custom Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Subject</label>
                <select
                  value={newTask.subject}
                  onChange={e => setNewTask({...newTask, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                >
                  <option className="bg-[#0A0A0F]">Physics</option>
                  <option className="bg-[#0A0A0F]">Math</option>
                  <option className="bg-[#0A0A0F]">Chemistry</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Task Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revise Integration formulas"
                  value={newTask.task}
                  onChange={e => setNewTask({...newTask, task: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Estimate Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45 mins"
                    value={newTask.time}
                    onChange={e => setNewTask({...newTask, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase block mb-1">Priority Tag</label>
                  <select
                    value={newTask.tag}
                    onChange={e => setNewTask({...newTask, tag: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                  >
                    <option className="bg-[#0A0A0F]">High Priority</option>
                    <option className="bg-[#0A0A0F]">Upcoming Test</option>
                    <option className="bg-[#0A0A0F]">Normal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 rounded-xl transition-colors mt-2"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
