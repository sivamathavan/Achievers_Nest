import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Copy } from 'lucide-react';
// Assuming supabase client is set up in src/lib/supabase
import { supabase } from '../../../../lib/supabase';

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    isWhatsapp: true,
    studentClass: '',
    board: '',
    medium: '',
    source: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Load from local storage
    const draft = localStorage.getItem('achievers_enquiry_draft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        // ignore
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'parentName':
      case 'studentName':
        if (!value.trim()) error = 'This field is required';
        break;
      case 'phone':
        if (!/^[0-9]{10}$/.test(value)) error = 'Enter a valid 10-digit phone number';
        break;
      case 'studentClass':
      case 'board':
      case 'medium':
        if (!value) error = 'Please make a selection';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    const newForm = { ...formData, [name]: val };
    setFormData(newForm);
    localStorage.setItem('achievers_enquiry_draft', JSON.stringify(newForm));
    
    if (errors[name]) {
      validateField(name, val);
    }
  };

  const isFormValid = () => {
    const required = ['parentName', 'studentName', 'phone', 'studentClass', 'board', 'medium'];
    for (let field of required) {
      if (!formData[field]) return false;
    }
    if (Object.values(errors).some(err => err !== '')) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([{
          parent_name: formData.parentName,
          student_name: formData.studentName,
          phone: formData.phone,
          is_whatsapp: formData.isWhatsapp,
          class: formData.studentClass,
          board: formData.board,
          medium: formData.medium,
          source: formData.source,
          message: formData.message,
          status: 'new'
        }]);

      if (error) throw error;
      
      setIsSuccess(true);
      localStorage.removeItem('achievers_enquiry_draft');
      setFormData({
        parentName: '', studentName: '', phone: '', isWhatsapp: true,
        studentClass: '', board: '', medium: '', source: '', message: ''
      });
      
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      alert('Something went wrong. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="enroll" ref={sectionRef} className="py-24 bg-[#0A0A0F] relative z-10">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-[#4F8EF7]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Enroll Your Child Today</h2>
          <p className="text-white/60 text-lg">Fill the form — we'll call you within 24 hours</p>
        </div>

        <div className={`glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {isSuccess ? (
            <div className="text-center py-10 animate-[fadeIn_0.5s_ease-out]">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enquiry Received! 🎉</h3>
              <p className="text-white/60 mb-8">We will call you within 24 hours to discuss the admission.</p>
              
              <div className="bg-white/5 p-6 rounded-xl text-left border border-white/10 relative">
                <p className="text-sm text-white/50 mb-2 uppercase tracking-wide font-medium">Or Send WhatsApp directly:</p>
                <p className="text-white font-medium">
                  Hi, I am interested in joining Achievers Nest. <br/>
                  Student: {formData.studentName || '[Name]'} <br/>
                  Class: {formData.studentClass || '[Class]'}
                </p>
                <a 
                  href={`https://wa.me/916381169124?text=Hi, I am interested in joining Achievers Nest. Student: ${formData.studentName}, Class: ${formData.studentClass}`}
                  target="_blank" rel="noreferrer"
                  className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg inline-block transition-colors"
                >
                  Send to WhatsApp
                </a>
              </div>
              
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-8 text-white/50 hover:text-white underline text-sm"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Parent Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Parent Name *</label>
                  <input 
                    type="text" name="parentName" value={formData.parentName} 
                    onChange={handleChange} onBlur={handleBlur}
                    className={`w-full bg-white/5 border ${errors.parentName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors`}
                    placeholder="Enter parent's name"
                  />
                  {errors.parentName && <p className="text-red-400 text-xs mt-1 animate-[fadeIn_0.2s_ease-out]">{errors.parentName}</p>}
                </div>
                
                {/* Student Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Student Name *</label>
                  <input 
                    type="text" name="studentName" value={formData.studentName} 
                    onChange={handleChange} onBlur={handleBlur}
                    className={`w-full bg-white/5 border ${errors.studentName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors`}
                    placeholder="Enter student's name"
                  />
                  {errors.studentName && <p className="text-red-400 text-xs mt-1 animate-[fadeIn_0.2s_ease-out]">{errors.studentName}</p>}
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Phone Number *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-white/50">+91</span>
                  <input 
                    type="tel" name="phone" value={formData.phone} maxLength={10}
                    onChange={handleChange} onBlur={handleBlur}
                    className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-gold transition-colors`}
                    placeholder="10 digit mobile number"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1 animate-[fadeIn_0.2s_ease-out]">{errors.phone}</p>}
                
                <label className="flex items-center mt-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-2">
                    <input type="checkbox" name="isWhatsapp" checked={formData.isWhatsapp} onChange={handleChange} className="peer appearance-none w-5 h-5 border-2 border-white/20 rounded bg-white/5 checked:bg-green-500 checked:border-green-500 transition-colors" />
                    <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">Same as WhatsApp number</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Class */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Student Class *</label>
                  <select 
                    name="studentClass" value={formData.studentClass} 
                    onChange={handleChange} onBlur={handleBlur}
                    className={`w-full bg-[#12121A] border ${errors.studentClass ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors appearance-none`}
                  >
                    <option value="" disabled>Select Class</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                  {errors.studentClass && <p className="text-red-400 text-xs mt-1">{errors.studentClass}</p>}
                </div>

                {/* Source */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">How did you hear about us?</label>
                  <select 
                    name="source" value={formData.source} onChange={handleChange}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                  >
                    <option value="">Select an option (Optional)</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Facebook/Instagram">Facebook / Instagram</option>
                    <option value="Friends/Family">Friends / Family Reference</option>
                    <option value="Banner/Pamphlet">Banner / Pamphlet</option>
                    <option value="Justdial/Sulekha">Justdial / Sulekha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Board */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Board *</label>
                  <div className="flex flex-wrap gap-3">
                    {['State Board', 'CBSE', 'Matric', 'ICSE'].map(b => (
                      <label key={b} className="cursor-pointer relative">
                        <input type="radio" name="board" value={b} checked={formData.board === b} onChange={handleChange} className="peer sr-only" />
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:border-gold/50 peer-checked:bg-gold/10 peer-checked:border-gold peer-checked:text-gold transition-all">
                          {b}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.board && <p className="text-red-400 text-xs mt-2">{errors.board}</p>}
                </div>

                {/* Medium */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Medium *</label>
                  <div className="flex flex-wrap gap-3">
                    {['Tamil Medium', 'English Medium'].map(m => (
                      <label key={m} className="cursor-pointer relative">
                        <input type="radio" name="medium" value={m} checked={formData.medium === m} onChange={handleChange} className="peer sr-only" />
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:border-gold/50 peer-checked:bg-gold/10 peer-checked:border-gold peer-checked:text-gold transition-all">
                          {m}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.medium && <p className="text-red-400 text-xs mt-2">{errors.medium}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Message (Optional)</label>
                <textarea 
                  name="message" value={formData.message} onChange={handleChange} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Any specific requirements?"
                ></textarea>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting || !isFormValid()}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center text-lg transition-all ${
                  isSubmitting || !isFormValid() 
                    ? 'bg-white/10 text-white/30 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-gold to-yellow-400 text-dark-bg hover:scale-[1.02] glow-gold-hover'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>🚀 Submit Enquiry</>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
