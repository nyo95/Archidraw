
import React from 'react';
import { ProjectPhase } from '../types';
import { Icons } from '../constants';

interface NextPhaseSuggestionModalProps {
  lastPhase: ProjectPhase;
  lastRev: number;
  availablePhases: ProjectPhase[];
  onSelectNext: (phase: ProjectPhase) => void;
  onClose: () => void;
}

const NextPhaseSuggestionModal: React.FC<NextPhaseSuggestionModalProps> = ({ lastPhase, lastRev, availablePhases, onSelectNext, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[48px] shadow-2xl border border-zinc-100 w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="p-12 text-center bg-zinc-50/50">
          <div className="w-20 h-20 bg-zinc-900 rounded-[32px] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl animate-bounce">
            <Icons.Check />
          </div>
          <h3 className="text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tight">Phase Approved!</h3>
          <p className="text-zinc-400 text-sm font-medium">
            <span className="text-zinc-900 font-bold">{lastPhase}</span> berhasil disetujui pada revisi ke-{lastRev}.
          </p>
        </div>

        <div className="p-12 space-y-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] text-center">Lanjutkan ke Phase Berikutnya?</h4>
            <div className="grid grid-cols-1 gap-3">
              {availablePhases.slice(0, 3).map(phase => (
                <button 
                  key={phase}
                  onClick={() => onSelectNext(phase)}
                  className="group w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-[24px] hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                >
                  <div className="text-left">
                    <span className="block text-[9px] font-bold opacity-40 uppercase tracking-widest group-hover:text-white/50">Next Step</span>
                    <span className="text-[14px] font-black uppercase tracking-tight">{phase}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all">
                    <Icons.ChevronRight />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 text-center">
            <button 
              onClick={onClose}
              className="text-[11px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-all"
            >
              Nanti saja, saya input manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPhaseSuggestionModal;
