
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { Stakeholder, AppSettings, Priority, ProjectPhase } from '../types';
import { parseTaskShortcuts } from '../services/shortcutParser';

interface TaskComposerProps {
  onAdd: (title: string, data: any) => void;
  onCancel: () => void;
  stakeholders: Stakeholder[];
  settings: AppSettings;
  defaultPhase?: ProjectPhase;
  isSubtask?: boolean;
}

const TaskComposer: React.FC<TaskComposerProps> = ({ onAdd, onCancel, stakeholders, settings, defaultPhase, isSubtask }) => {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<ProjectPhase>(defaultPhase || ProjectPhase.MOODBOARD);
  const [priority, setPriority] = useState<Priority>(Priority.P3);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const final = parseTaskShortcuts(input, stakeholders, settings);
    onAdd(final.cleanTitle, { ...final, phase, priority: final.priority || priority });
    setInput('');
  };

  return (
    <div className="bg-white border-2 border-zinc-900 rounded-[24px] shadow-2xl p-6 mb-8 animate-in slide-in-from-top-4 duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          autoFocus
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isSubtask ? "Enter instruction detail..." : "Drawing Title @Reviewer p1 tomorrow"}
          className="w-full text-[18px] font-black text-zinc-900 placeholder:text-zinc-200 seamless-input uppercase tracking-tight"
        />
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-50 pt-4">
          <div className="flex items-center gap-3">
            {!isSubtask && (
              <div className="relative">
                <select 
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as ProjectPhase)}
                  className="appearance-none pl-4 pr-10 py-2 bg-zinc-50 border border-zinc-100 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:bg-zinc-100 transition-all"
                >
                  {Object.values(ProjectPhase).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <Icons.ChevronDown />
                </div>
              </div>
            )}

            <select 
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value) as Priority)}
              className={`appearance-none px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer transition-all ${priority === Priority.P1 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-zinc-50 text-zinc-500 border-zinc-100'}`}
            >
              <option value={Priority.P1}>P1.HIGH</option>
              <option value={Priority.P2}>P2.MED</option>
              <option value={Priority.P3}>P3.LOW</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={onCancel} 
              className="text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:text-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!input.trim()}
              className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${input.trim() ? 'bg-zinc-900 text-white hover:bg-black shadow-xl' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
            >
              Add Entry
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskComposer;
