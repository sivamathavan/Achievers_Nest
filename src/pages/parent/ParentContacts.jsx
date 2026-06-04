import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Phone, MessageSquare, ArrowRight, User } from 'lucide-react';

const mockTeachers = [
  { name: 'John Doe', subject: 'Mathematics', phone: '919876543210', email: 'john.doe@achieversnest.com', batches: 'Class 10 CBSE' },
  { name: 'Alice Smith', subject: 'Physics & Science', phone: '919876543211', email: 'alice.smith@achieversnest.com', batches: 'Class 10 CBSE, Class 8 State' },
  { name: 'Robert Lee', subject: 'Chemistry', phone: '919876543212', email: 'robert.lee@achieversnest.com', batches: 'Class 11, Class 12' },
];

const ParentContacts = () => {
  const { user } = useAuth();
  const childName = user?.childName || 'Your Child';

  const handleMessageTeacher = (teacher) => {
    const text = `Hello Mr/Ms ${teacher.name},\nThis is ${user?.name || 'Parent'}, parent of ${childName}.\nI am messaging regarding my child's progress at Achievers Nest. Please let me know when we can connect.\nThank you!`;
    const url = `https://wa.me/${teacher.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Teacher Contacts</h1>
        <p className="text-white/60 mt-1">Get in touch with {childName}'s teachers at the center.</p>
      </div>

      <div className="space-y-4">
        {mockTeachers.map((teacher, idx) => (
          <div key={idx} className="glass-card p-5 border-l-4 border-l-gold hover:border-gold/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-snug">{teacher.name}</h3>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mt-0.5">{teacher.subject}</p>
                <p className="text-xs text-white/40 mt-1">Batches: {teacher.batches}</p>
                <p className="text-xs text-white/40">{teacher.email}</p>
              </div>
            </div>

            <button
              onClick={() => handleMessageTeacher(teacher)}
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
            >
              <MessageSquare size={16} className="mr-2" /> Message on WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentContacts;
