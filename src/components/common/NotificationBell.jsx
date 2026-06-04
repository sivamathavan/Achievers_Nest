import React, { useState, useEffect } from 'react';
import { Bell, FileText, HelpCircle, Trophy, IndianRupee, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockNotifications = [
  { id: 1, type: 'Test', title: 'New Test Scheduled', message: 'Optics Weekly Test on Friday', time: '10 mins ago', read: false },
  { id: 2, type: 'Doubt', title: 'Doubt Resolved', message: 'Teacher John answered your question.', time: '2 hrs ago', read: false },
  { id: 3, type: 'Rank', title: 'Rank Up!', message: 'You moved up to rank #5!', time: '1 day ago', read: true },
];

const getIcon = (type) => {
  switch(type) {
    case 'Test': return <FileText size={16} className="text-blue-400" />;
    case 'Doubt': return <HelpCircle size={16} className="text-[#00FF88]" />;
    case 'Rank': return <Trophy size={16} className="text-gold" />;
    case 'Fee': return <IndianRupee size={16} className="text-orange-400" />;
    default: return <Bell size={16} className="text-white/60" />;
  }
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('achievers_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  useEffect(() => {
    localStorage.setItem('achievers_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1A1A24]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 bg-[#1A1A24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-gold hover:underline">Mark all as read</button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">No new notifications.</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-white/5 relative group ${!notif.read ? 'bg-white/5' : ''}`}>
                    {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>}
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 pr-6">
                        <p className="text-sm font-bold text-white leading-tight">{notif.title}</p>
                        <p className="text-xs text-white/60 mt-1">{notif.message}</p>
                        <p className="text-[10px] text-white/30 mt-2">{notif.time}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => removeNotification(e, notif.id)}
                      className="absolute right-4 top-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 text-center border-t border-white/10 bg-white/5">
              <button className="text-xs text-white/40 hover:text-white">View All History</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
