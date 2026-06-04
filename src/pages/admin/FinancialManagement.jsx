import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { IndianRupee, FileDown, Search, CheckCircle, Clock, MessageCircle, DollarSign, ArrowUpRight, X } from 'lucide-react';
import jsPDF from 'jspdf';

const mockPendingFees = [
  { id: 'STU2024005', name: 'Amit Kumar', batch: 'Batch A', amount: 2000, due: '5 days ago', phone: '919876543210' },
  { id: 'STU2024012', name: 'Priya Patel', batch: 'Batch B', amount: 1500, due: '2 days ago', phone: '919876543211' },
  { id: 'STU2024003', name: 'Rahul Sharma', batch: 'Batch A', amount: 2000, due: '1 day ago', phone: '919876543212' },
  { id: 'STU2024006', name: 'Vijay Anand', batch: 'Batch A', amount: 2000, due: '10 days ago', phone: '919876543213' },
];

const mockPayments = [
  { receipt: 'RCPT-1045', id: 'STU2024001', name: 'Rahul Sharma', amount: 2000, date: 'Oct 15, 2026', method: 'UPI' },
  { receipt: 'RCPT-1044', id: 'STU2024002', name: 'Sneha Reddy', amount: 2000, date: 'Oct 14, 2026', method: 'Cash' },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history' | 'structure'
  
  const [pendingFees, setPendingFees] = useState(() => {
    const saved = localStorage.getItem('achievers_pending_fees');
    return saved ? JSON.parse(saved) : mockPendingFees;
  });
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('achievers_payments');
    return saved ? JSON.parse(saved) : mockPayments;
  });

  useEffect(() => {
    localStorage.setItem('achievers_pending_fees', JSON.stringify(pendingFees));
  }, [pendingFees]);

  useEffect(() => {
    localStorage.setItem('achievers_payments', JSON.stringify(payments));
  }, [payments]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkModalIndex, setBulkModalIndex] = useState(-1); // -1 means closed

  const [markPaidModal, setMarkPaidModal] = useState(null); // null or a student object
  const [paidMethod, setPaidMethod] = useState('Cash');
  const [paymentSearch, setPaymentSearch] = useState('');

  const filteredPayments = payments.filter(p => {
    const q = paymentSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.receipt.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  const handleMarkPaid = () => {
    if (!markPaidModal) return;
    const receipt = {
      receipt: `RCPT-${1045 + payments.length + 1}`,
      id: markPaidModal.id,
      name: markPaidModal.name,
      amount: markPaidModal.amount,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      method: paidMethod,
    };
    setPayments(prev => [receipt, ...prev]);
    setPendingFees(prev => prev.filter(s => s.id !== markPaidModal.id));
    setMarkPaidModal(null);
  };

  const generateReceipt = (payment) => {
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
      ['Receipt No', payment.receipt],
      ['Student Name', payment.name],
      ['Student ID', payment.id],
      ['Amount Paid', `Rs. ${payment.amount}`],
      ['Payment Method', payment.method],
      ['Payment Date', payment.date],
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
    doc.text('Thank you for your payment! — Achievers Nest', 14, 145);
    doc.save(`${payment.receipt}.pdf`);
  };

  const handleExport = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const sendReminder = (student) => {
    const text = `Hello ${student.name}'s Parent,\nThis is a gentle reminder that your fee of ₹${student.amount} for ${student.batch} is pending.\nPlease clear the dues at your earliest convenience to avoid interruption of classes.\nRegards, Achievers Nest.`;
    const url = `https://wa.me/${student.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Management</h1>
          <p className="text-white/60 mt-1">Track fee collections, pending dues, and revenue.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl w-full md:w-auto">
          <button onClick={() => setActiveTab('pending')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Pending Dues</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'history' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Payment History</button>
          <button onClick={() => setActiveTab('structure')} className={`flex-1 md:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'structure' ? 'bg-gold text-dark-bg' : 'text-white/60 hover:text-white'}`}>Fee Structure</button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-[#00FF88]">
          <p className="text-white/50 text-xs font-semibold uppercase mb-1">Total Collected (This Month)</p>
          <div className="flex items-center">
            <IndianRupee size={20} className="text-[#00FF88] mr-1" />
            <span className="text-3xl font-bold text-white">1,45,000</span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-orange-400">
          <p className="text-white/50 text-xs font-semibold uppercase mb-1">Total Pending</p>
          <div className="flex items-center">
            <IndianRupee size={20} className="text-orange-400 mr-1" />
            <span className="text-3xl font-bold text-white">32,500</span>
          </div>
        </div>
        <div className="glass-card p-5 bg-gradient-to-br from-gold/10 to-transparent">
          <p className="text-gold text-xs font-semibold uppercase mb-1">Estimated Monthly Revenue</p>
          <div className="flex items-center">
            <IndianRupee size={20} className="text-gold mr-1" />
            <span className="text-3xl font-bold text-white">1,77,500</span>
          </div>
        </div>
      </div>

      {/* PENDING DUES TAB */}
      {activeTab === 'pending' && (
        <div className="glass-card p-6 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Defaulters List</h2>
            <div className="flex space-x-3">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setBulkModalIndex(0)}
                  className="bg-gold text-dark-bg hover:bg-gold-hover px-4 py-2 text-sm font-bold rounded-xl flex items-center transition-colors shadow-[0_4px_15px_rgba(255,215,0,0.3)] animate-pulse"
                >
                  <MessageCircle size={16} className="mr-2" /> Send Bulk Reminders ({selectedIds.length})
                </button>
              )}
              <button onClick={() => handleExport(pendingFees, 'Pending_Fees')} className="bg-[#00FF88]/20 hover:bg-[#00FF88]/30 border border-[#00FF88]/30 text-[#00FF88] px-4 py-2 text-sm font-bold rounded-xl flex items-center transition-colors">
                <FileDown size={16} className="mr-2" /> Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
              <thead className="bg-white/5 text-white uppercase text-xs border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={pendingFees.length > 0 && selectedIds.length === pendingFees.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(pendingFees.map(s => s.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-white/20 bg-transparent text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Pending Amount</th>
                  <th className="px-6 py-4">Overdue By</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingFees.map((student, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, student.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== student.id));
                          }
                        }}
                        className="rounded border-white/20 bg-transparent text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-xs text-white/40">{student.id}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60">{student.batch}</td>
                    <td className="px-6 py-4 font-bold text-orange-400 flex items-center h-[72px]">
                      <IndianRupee size={14} className="mr-1" /> {student.amount}
                    </td>
                    <td className="px-6 py-4 text-red-400">{student.due}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setMarkPaidModal(student)}
                          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-white/10"
                        >
                          Mark Paid
                        </button>
                        <button onClick={() => sendReminder(student)} className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-colors">
                          <MessageCircle size={14} className="mr-1" /> WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENT HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="glass-card p-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            
            <div className="flex space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="Search receipt or name..."
                  value={paymentSearch}
                  onChange={e => setPaymentSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-gold outline-none"
                />
              </div>
              <button onClick={() => handleExport(payments, 'Payment_History')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-medium rounded-xl flex items-center transition-colors">
                <FileDown size={16} className="mr-2" /> Export
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPayments.map((payment, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-10 h-10 bg-[#00FF88]/20 rounded-full flex items-center justify-center text-[#00FF88]">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium flex items-center">{payment.name} <span className="mx-2 text-white/20">|</span> <span className="text-white/60 font-mono text-xs">{payment.receipt}</span></h3>
                    <p className="text-xs text-white/40">{payment.date} • {payment.method}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end md:space-x-6">
                  <div className="text-right">
                    <p className="text-[#00FF88] font-bold text-lg flex items-center"><IndianRupee size={16} className="mr-1" /> {payment.amount}</p>
                    <p className="text-[10px] text-white/40 uppercase">Paid Successfully</p>
                  </div>
                  <button
                    onClick={() => generateReceipt(payment)}
                    className="text-gold hover:text-gold-hover text-sm font-medium flex items-center"
                  >
                    Receipt <ArrowUpRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEE STRUCTURE TAB */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-6">Current Fee Structures</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">Class 10 - All Subjects</h3>
                  <p className="text-xs text-white/40">Batches A, B</p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold flex items-center"><IndianRupee size={14} className="mr-1" /> 2,000</p>
                  <p className="text-[10px] text-white/40 uppercase">Per Month</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">Class 12 - PCM</h3>
                  <p className="text-xs text-white/40">Batch C</p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold flex items-center"><IndianRupee size={14} className="mr-1" /> 3,500</p>
                  <p className="text-[10px] text-white/40 uppercase">Per Month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-6">Update/Add Fee Structure</h2>
            <form className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Select Batch/Class</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                  <option className="bg-dark-bg">All Classes</option>
                  {CLASSES.map(cls => <option key={cls} className="bg-dark-bg">{cls}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Amount (₹)</label>
                <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase block mb-1">Frequency</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none">
                  <option className="bg-dark-bg">Monthly</option>
                  <option className="bg-dark-bg">One-time / Yearly</option>
                </select>
              </div>
              <button type="button" className="w-full bg-gold hover:bg-gold-hover text-dark-bg font-bold py-3 rounded-xl transition-colors mt-2">
                Save Structure
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Mark Paid Confirmation Modal */}
      {markPaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Confirm Payment</h3>
            <p className="text-white/60 text-sm mb-5">
              Mark <span className="text-white font-medium">{markPaidModal.name}</span>'s fee of{' '}
              <span className="text-gold font-bold">₹{markPaidModal.amount}</span> as paid?
            </p>
            <div className="mb-5">
              <label className="text-xs text-white/40 uppercase block mb-1">Payment Method</label>
              <select
                value={paidMethod}
                onChange={e => setPaidMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
              >
                {['Cash', 'UPI', 'Bank Transfer', 'Cheque'].map(m => (
                  <option key={m} className="bg-[#0A0A0F]">{m}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMarkPaidModal(null)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkPaid}
                className="flex-1 py-3 rounded-xl bg-[#00FF88] text-[#0A0A0F] font-bold text-sm transition-colors hover:opacity-90"
              >
                ✓ Confirm Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Bulk WhatsApp Modal */}
      {bulkModalIndex >= 0 && bulkModalIndex < selectedIds.length && (() => {
        const studentId = selectedIds[bulkModalIndex];
        const student = pendingFees.find(s => s.id === studentId);
        if (!student) return null;

        const messageText = `Hello ${student.name}'s Parent,\nThis is a gentle reminder that your fee of ₹${student.amount} for ${student.batch} is pending.\nPlease clear the dues at your earliest convenience to avoid interruption of classes.\nRegards, Achievers Nest.`;

        const handleSend = () => {
          const url = `https://wa.me/${student.phone}?text=${encodeURIComponent(messageText)}`;
          window.open(url, '_blank');
        };

        const handleNext = () => {
          if (bulkModalIndex + 1 >= selectedIds.length) {
            setBulkModalIndex(-1);
            setSelectedIds([]);
            alert("All reminders sent successfully!");
          } else {
            setBulkModalIndex(prev => prev + 1);
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1A1A24] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <button
                onClick={() => setBulkModalIndex(-1)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-4">
                <span className="text-[11px] font-bold bg-gold/10 text-gold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Reminder {bulkModalIndex + 1} of {selectedIds.length}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">WhatsApp Fee Reminder</h3>
              <p className="text-white/60 text-sm mb-4">
                Sending reminder to <span className="text-white font-medium">{student.name}</span>'s parent.
              </p>

              <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 mb-5">
                <p className="text-xs text-white/30 uppercase font-semibold mb-2">Message Preview</p>
                <p className="text-[13px] text-white/80 whitespace-pre-wrap leading-relaxed italic">
                  {messageText}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Skip Student
                </button>
                <button
                  onClick={() => {
                    handleSend();
                    setTimeout(handleNext, 800); // auto advance slightly after launching window
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center"
                >
                  <MessageCircle size={16} className="mr-2" /> Send & Next →
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default FinancialManagement;
