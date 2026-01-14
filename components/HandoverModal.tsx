
import React, { useState } from 'react';
import { Stakeholder, Task } from '../types';
import { Icons } from '../constants';

interface HandoverModalProps {
  task: Task;
  stakeholders: Stakeholder[];
  onHandoverDecision: (taskId: string, outcome: 'approved' | 'rejected', feedback?: string) => void;
  onClose: () => void;
}

const HandoverModal: React.FC<HandoverModalProps> = ({ task, stakeholders, onHandoverDecision, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [mode, setMode] = useState<'decision' | 'feedback'>('decision');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] shadow-2xl border border-zinc-100 w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-zinc-50 text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-3xl mx-auto flex items-center justify-center text-white mb-6">
            <Icons.Revision />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-2 uppercase tracking-tight">{task.title}</h3>
          <p className="text-zinc-400 text-sm font-medium">Apa hasil review dari klien/reviewer?</p>
        </div>

        {mode === 'decision' ? (
          <div className="p-10 grid grid-cols-2 gap-4">
            <button 
              onClick={() => onHandoverDecision(task.id, 'approved')}
              className="group flex flex-col items-center gap-4 p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 hover:bg-zinc-900 hover:border-zinc-900 transition-all text-center"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-sm group-hover:bg-white group-hover:scale-110 transition-all">
                <Icons.Check />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white/50">Approved</span>
            </button>

            <button 
              onClick={() => setMode('feedback')}
              className="group flex flex-col items-center gap-4 p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 hover:bg-red-600 hover:border-red-600 transition-all text-center"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-900 shadow-sm group-hover:bg-white group-hover:scale-110 transition-all">
                <Icons.AlertCircle />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white/50">Needs Revision</span>
            </button>
          </div>
        ) : (
          <div className="p-10 space-y-6 animate-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Feedback / Komentar Klien</label>
              <textarea 
                autoFocus
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Misal: 'Ubah material lantai jadi marmer'..."
                className="w-full h-32 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium outline-none focus:border-zinc-900 transition-all resize-none"
              />
              <p className="text-[9px] text-zinc-400 italic font-medium">Komentar ini akan otomatis menjadi instruksi di REV {task.revision + 1}</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setMode('decision')}
                className="flex-grow py-4 bg-zinc-100 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Back
              </button>
              <button 
                disabled={!feedback.trim()}
                onClick={() => onHandoverDecision(task.id, 'rejected', feedback)}
                className="flex-[2] py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-30 shadow-xl"
              >
                Start Next Revision
              </button>
            </div>
          </div>
        )}

        <div className="p-6 bg-zinc-50/50 text-center">
          <button onClick={onClose} className="text-[10px] font-bold text-zinc-300 hover:text-zinc-600 uppercase tracking-widest">Cancel Review</button>
        </div>
      </div>
    </div>
  );
};

export default HandoverModal;
