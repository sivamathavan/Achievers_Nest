import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Award, Book, LogOut, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const avatars = ['🧑‍🎓', '👩‍🎓', '🦸‍♂️', '🦸‍♀️', '🥷', '🧑‍🚀', '🦁', '🦊', '🦉', '🦄'];

const Profile = () => {
  const { user, logout } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem(`avatar_${user?.user_id}`) || avatars[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setShowAvatarPicker(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setSelectedAvatar(data.secure_url);
        // Save to local storage so it persists between reloads
        localStorage.setItem(`avatar_${user?.user_id}`, data.secure_url);
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button className="text-white/50 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </header>

      {/* Main Profile Card */}
      <div className="glass-card p-6 text-center relative">
        <div className="relative inline-block mb-4">
          <motion.div 
            className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-5xl border-4 border-dark-bg shadow-xl mx-auto overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : selectedAvatar.startsWith('http') ? (
              <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              selectedAvatar
            )}
          </motion.div>
          <button 
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-dark-bg shadow-lg hover:scale-110 transition-transform z-10"
          >
            <ImageIcon size={16} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
        <p className="text-white/60 mb-6">ID: {user?.user_id}</p>

        {showAvatarPicker && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white/5 p-4 rounded-xl mb-6 flex flex-col items-center"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {avatars.map((av, i) => (
                <button 
                  key={i}
                  onClick={() => { 
                    setSelectedAvatar(av); 
                    localStorage.setItem(`avatar_${user?.user_id}`, av);
                    setShowAvatarPicker(false); 
                  }}
                  className={`text-2xl p-2 rounded-lg transition-colors ${selectedAvatar === av ? 'bg-gold/30' : 'hover:bg-white/10'}`}
                >
                  {av}
                </button>
              ))}
            </div>
            
            <div className="w-full h-px bg-white/10 mb-4"></div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <ImageIcon size={16} className="mr-2" /> 
              {isUploading ? 'Uploading...' : 'Upload custom picture'}
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Class</p>
            <p className="font-semibold text-white mt-1">{user?.class || 'N/A'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 font-medium">Board</p>
            <p className="font-semibold text-white mt-1">{user?.board || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Achievements section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Award className="mr-2 text-gold" size={20} />
          Achievements
        </h3>
        <div className="glass-card p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl">
            🏆
          </div>
          <div>
            <h4 className="font-medium text-white">Fast Learner</h4>
            <p className="text-xs text-white/60">Completed 5 chapters this week</p>
          </div>
        </div>
      </div>

      {/* Settings / Preferences */}
      <div className="glass-card p-2 divide-y divide-white/10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Book className="text-white/50" size={20} />
            <span className="text-white">Medium</span>
          </div>
          <span className="text-white/60 text-sm bg-white/5 px-3 py-1 rounded-full">{user?.medium || 'English'}</span>
        </div>
        
        <button 
          onClick={logout}
          className="w-full p-4 flex items-center space-x-3 text-red-400 hover:bg-red-400/10 transition-colors rounded-b-xl"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
