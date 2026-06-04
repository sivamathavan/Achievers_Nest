import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IndianRupee, CheckCircle, Clock, FileDown, ArrowUpRight } from 'lucide-react';
import jsPDF from 'jspdf';

const initialParentPayments = [
  { receipt: 'RCPT-1045', amount: 2000, date: 'Oct 15, 2026', method: 'UPI', status: 'PAID' },
  { receipt: 'RCPT-0988', amount: 2000, date: 'Sep 14, 2026', method: 'Cash', status: 'PAID' },
  { receipt: 'RCPT-0812', amount: 2000, date: 'Aug 15, 2026', method: 'UPI', status: 'PAID' },
];

const ParentFees = () => {
  const { user } = useAuth();
  const childName = user?.childName || 'Your Child';
  const childId = user?.childId || 'STU2024001';

  const [payments, setPayments] = useState(() => {
    // Attempt to read from admin's global achiever payments if they exist
    try {
      const saved = localStorage.getItem('achievers_payments');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter by the student child's ID
        const childPayments = parsed.filter(p => p.id === childId);
        if (childPayments.length > 0) {
          return childPayments.map(p => ({
            receipt: p.receipt,
            amount: p.amount,
            date: p.date,
            method: p.method,
            status: 'PAID'
          }));
        }
      }
    } catch (e) {}
    return initialParentPayments;
  }, [childId]);

  const [hasDues, setHasDues] = useState(() => {
    try {
      const savedDues = localStorage.getItem('achievers_pending_fees');
      if (savedDues) {
        const parsed = JSON.parse(savedDues);
        return parsed.some(d => d.id === childId);
      }
    } catch (e) {}
    return false;
  }, [childId]);

  const dueAmount = 2000;

  const downloadReceipt = (p) => {
    const doc = new jsPDF();
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ACHIEVERS NEST', 14, 22);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('FEE RECEIPT', 14, 34);
    
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    
    const rows = [
      ['Receipt No', p.receipt],
      ['Student Name', childName],
      ['Student ID', childId],
      ['Amount Paid', `Rs. ${p.amount}`],
      ['Payment Method', p.method],
      ['Payment Date', p.date],
      ['Status', 'PAID'],
    ];
    
    rows.forEach(([label, value], i) => {
      doc.setTextColor(150, 150, 150);
      doc.text(label, 14, 50 + i * 12);
      doc.setTextColor(255, 255, 255);
      doc.text(String(value), 80, 50 + i * 12);
    });
    
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(10);
    doc.text('Thank you for supporting your child\'s learning! — Achievers Nest', 14, 145);
    doc.save(`${p.receipt}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Fee Details</h1>
        <p className="text-white/60 mt-1">Manage and view fee payments for {childName}.</p>
      </div>

      {/* Fee Status Card */}
      {hasDues ? (
        <div className="glass-card p-6 border-l-4 border-l-orange-400 bg-orange-500/5">
          <h3 className="text-white/60 text-xs font-semibold uppercase mb-1">Dues Pending</h3>
          <div className="text-3xl font-bold text-white mt-2 flex items-center">
            <Clock size={28} className="text-orange-400 mr-2" />
            <IndianRupee size={24} className="text-orange-400 mr-0.5" />
            {dueAmount}
          </div>
          <p className="text-xs text-white/40 mt-1.5">Please pay at the center or via UPI to clear dues.</p>
        </div>
      ) : (
        <div className="glass-card p-6 border-l-4 border-l-[#00FF88] bg-[#00FF88]/5">
          <h3 className="text-white/60 text-xs font-semibold uppercase mb-1">Fee Status</h3>
          <div className="text-3xl font-bold text-white mt-2 flex items-center">
            <CheckCircle size={28} className="text-[#00FF88] mr-2" />
            PAID
          </div>
          <p className="text-xs text-white/40 mt-1.5">Next payment cycle starts on Nov 1, 2026.</p>
        </div>
      )}

      {/* Payment History */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6">Payment History</h2>
        
        <div className="space-y-4">
          {payments.map((p, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className="w-10 h-10 bg-[#00FF88]/20 rounded-full flex items-center justify-center text-[#00FF88]">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium flex items-center">
                    {p.receipt}
                  </h3>
                  <p className="text-xs text-white/40">{p.date} • {p.method}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                <div className="text-left sm:text-right">
                  <p className="text-[#00FF88] font-bold text-lg flex items-center"><IndianRupee size={16} className="mr-0.5" />{p.amount}</p>
                  <p className="text-[10px] text-white/40 uppercase">Receipt Available</p>
                </div>
                <button
                  onClick={() => downloadReceipt(p)}
                  className="text-gold hover:text-gold-hover text-sm font-medium flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Download <FileDown size={14} className="ml-1.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentFees;
