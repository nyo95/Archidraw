
import React from 'react';
import { Stakeholder } from '../types';
import { Icons } from '../constants';

interface AssignReviewerModalProps {
  stakeholders: Stakeholder[];
  onAssign: (stakeholderId: string) => void;
  onClose: () => void;
}

const AssignReviewerModal: React.FC<AssignReviewerModalProps> = ({ stakeholders, onAssign, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/30 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl border border-zinc-100 w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl">
            <Icons.User />
          </div>
          <h3 className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Assign Reviewer</h3>
          <p className="text-zinc-400 text-sm font-medium">Siapa yang akan memeriksa pengerjaan ini?</p>
        </div>

        <div className="px-10 pb-10 space-y-2">
          {stakeholders.map(s => (
            <button 
              key={s.id}
              onClick={() => onAssign(s.id)}
              className="w-full flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all group"
            >
              <span className="text-sm font-black tracking-tight">@{s.name}</span>
              <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest group-hover:opacity-100">{s.role}</span>
            </button>
          ))}
        </div>

        <div className="p-6 bg-zinc-50/50 text-center">
          <button onClick={onClose} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest">Cancel Assignment</button>
        </div>
      </div>
    </div>
  );
};

export default AssignReviewerModal;
