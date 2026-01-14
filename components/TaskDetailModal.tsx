
import React from 'react';
import { Task, Stakeholder, Priority, TaskStatus, ProjectPhase } from '../types';
import { Icons } from '../constants';
import EditableText from './EditableText';

interface TaskDetailModalProps {
  task: Task;
  stakeholders: Stakeholder[];
  onUpdate: (updates: Partial<Task>) => void;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, stakeholders, onUpdate, onClose }) => {
  const currentStakeholder = stakeholders.find(s => s.id === task.ballWith);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl border border-zinc-100 w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex h-[80vh]">
          {/* Main Content */}
          <div className="flex-grow flex flex-col p-10 overflow-y-auto custom-scrollbar">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative group/phase">
                  <select 
                    value={task.phase}
                    onChange={(e) => onUpdate({ phase: e.target.value as ProjectPhase })}
                    className="appearance-none px-3 py-1 bg-zinc-900 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer outline-none hover:bg-black transition-all pr-8"
                  >
                    {Object.values(ProjectPhase).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                    <Icons.ChevronDown />
                  </div>
                </div>
                
                <span className="text-[10px] font-black text-zinc-300 uppercase">Rev {task.revision}</span>

                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] border ${task.status === TaskStatus.IN_REVIEW ? 'bg-zinc-100 border-zinc-900 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <EditableText 
                value={task.title} 
                onSave={(v) => onUpdate({ title: v })}
                className="text-3xl font-bold text-zinc-900"
              />
            </header>

            <section className="mb-10">
              <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Brief & Detail Instruction</h4>
              <EditableText 
                multiline
                value={task.description}
                onSave={(v) => onUpdate({ description: v })}
                placeholder="Tambahkan detail atau catatan teknis di sini..."
                className="text-sm text-zinc-600 leading-relaxed"
              />
            </section>

            {task.history && task.history.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Revision History</h4>
                <div className="space-y-4">
                  {task.history.map((h, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border border-zinc-100 shrink-0">
                        v{h.revision}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-800 font-medium mb-1">{h.note}</p>
                        <p className="text-[10px] text-zinc-400">{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Properties */}
          <div className="w-64 border-l border-zinc-50 bg-zinc-50/30 p-8 space-y-8 shrink-0">
            <div>
              <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Reviewer</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">
                  {currentStakeholder ? currentStakeholder.name.substring(0,2).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">{currentStakeholder?.name || 'Unassigned'}</p>
                  <p className="text-[9px] text-zinc-400 uppercase">{currentStakeholder?.role || 'Awaiting Review'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Priority</h4>
              <div className="flex gap-1">
                {[Priority.P1, Priority.P2, Priority.P3].map(p => (
                  <button 
                    key={p}
                    onClick={() => onUpdate({ priority: p })}
                    className={`flex-grow py-2 rounded-lg text-[10px] font-bold transition-all border ${task.priority === p ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                  >
                    P{p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Deadlines</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Icons.Calendar />
                  <span className="text-xs font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('id-ID') : 'No date set'}</span>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
