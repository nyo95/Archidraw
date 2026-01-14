
import React, { useMemo, useState, useCallback } from 'react';
import { Project, Priority, Task, TaskStatus } from '../types';

interface TimelineViewProps {
  projects: Project[];
  tasks: Task[];
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  isFullScreen?: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({ projects, tasks, onUpdateProject, onUpdateTask, isFullScreen = false }) => {
  const activeProjects = useMemo(() => projects.filter(p => !p.isArchived), [projects]);
  const [activeLane, setActiveLane] = useState<'projects' | 'tasks'>('tasks');
  
  const daysToDisplay = 45; 
  const today = new Date();
  
  const workdayCalendar = useMemo(() => {
    const days: Date[] = [];
    let current = new Date(today);
    current.setDate(current.getDate() - 7); 
    
    while (days.length < daysToDisplay) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, []);

  const getWorkdayPosition = useCallback((dateStr?: string) => {
    if (!dateStr) return -100;
    const targetDate = new Date(dateStr);
    targetDate.setHours(0,0,0,0);

    const index = workdayCalendar.findIndex(d => {
      const day = new Date(d);
      day.setHours(0,0,0,0);
      return day.getTime() === targetDate.getTime();
    });

    if (index === -1) {
      if (targetDate < workdayCalendar[0]) return -5;
      return 105;
    }

    return (index / workdayCalendar.length) * 100;
  }, [workdayCalendar]);

  const moveDateByWorkdays = (start: Date, delta: number) => {
    let current = new Date(start);
    let remaining = Math.abs(delta);
    let step = delta > 0 ? 1 : -1;
    
    while (remaining > 0) {
      current.setDate(current.getDate() + step);
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        remaining--;
      }
    }
    return current;
  };

  const adjustSchedule = (id: string, type: 'project' | 'task', delta: number, edge: 'both' | 'start' | 'end') => {
    if (type === 'project') {
      const p = projects.find(x => x.id === id);
      if (!p) return;
      if (edge === 'both') {
        onUpdateProject(id, { 
          startDate: moveDateByWorkdays(new Date(p.startDate), delta).toISOString(), 
          endDate: moveDateByWorkdays(new Date(p.endDate), delta).toISOString() 
        });
      } else if (edge === 'start') {
        onUpdateProject(id, { startDate: moveDateByWorkdays(new Date(p.startDate), delta).toISOString() });
      } else {
        onUpdateProject(id, { endDate: moveDateByWorkdays(new Date(p.endDate), delta).toISOString() });
      }
    } else {
      const t = tasks.find(x => x.id === id);
      if (!t) return;
      const start = t.startDate ? new Date(t.startDate) : new Date(t.createdAt);
      const end = t.dueDate ? new Date(t.dueDate) : new Date(start);
      
      if (edge === 'both') {
        onUpdateTask(id, { 
          startDate: moveDateByWorkdays(start, delta).toISOString(), 
          dueDate: moveDateByWorkdays(end, delta).toISOString() 
        });
      } else if (edge === 'start') {
        onUpdateTask(id, { startDate: moveDateByWorkdays(start, delta).toISOString() });
      } else {
        onUpdateTask(id, { dueDate: moveDateByWorkdays(end, delta).toISOString() });
      }
    }
  };

  return (
    <div className={`bg-white h-full flex flex-col ${isFullScreen ? 'h-full' : 'rounded-2xl border border-zinc-200'}`}>
      <div className="flex items-center justify-between p-6 border-b border-zinc-50">
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">
          <button 
            onClick={() => setActiveLane('projects')}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${activeLane === 'projects' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveLane('tasks')}
            className={`px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${activeLane === 'tasks' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
          >
            Active Tasks
          </button>
        </div>
        <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
          Mon - Fri Workforce Logic
        </div>
      </div>

      <div className="flex-grow overflow-auto p-6">
        <div className="min-w-[1200px] relative">
          <div className="grid grid-cols-[250px_1fr] mb-6 border-b border-zinc-50 pb-4 sticky top-0 bg-white z-20">
            <div className="text-[10px] font-bold text-zinc-400 uppercase flex items-center">Entity</div>
            <div className="flex justify-between px-4">
              {workdayCalendar.map((day, idx) => (
                <div key={idx} className={`text-[10px] w-12 text-center flex flex-col items-center ${day.toDateString() === today.toDateString() ? 'text-zinc-900' : 'text-zinc-300'}`}>
                  <span className="font-bold opacity-40">{day.toLocaleDateString('id-ID', { weekday: 'narrow' })}</span>
                  <span className={`mt-1 p-1 rounded ${day.toDateString() === today.toDateString() ? 'bg-zinc-900 text-white font-black' : ''}`}>{day.getDate()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 relative">
            {activeLane === 'projects' && activeProjects.map(p => {
              const startPos = getWorkdayPosition(p.startDate);
              const endPos = getWorkdayPosition(p.endDate);
              const width = Math.max(4, endPos - startPos);

              return (
                <div key={p.id} className="grid grid-cols-[250px_1fr] items-center h-10 group">
                  <div className="text-[12px] font-bold text-zinc-800 truncate pr-4">{p.name}</div>
                  <div className="relative h-6 bg-zinc-50/50 rounded flex items-center">
                    <div 
                      className="absolute h-4 bg-zinc-900 rounded shadow-sm transition-all cursor-move flex items-center group/pill"
                      style={{ left: `${startPos}%`, width: `${width}%` }}
                    >
                      <button onClick={(e) => { e.stopPropagation(); adjustSchedule(p.id, 'project', -1, 'start'); }} className="opacity-0 group-hover/pill:opacity-100 absolute -left-2 top-0 bottom-0 w-2 bg-black/20 hover:bg-black/40 cursor-col-resize rounded-l"></button>
                      <div className="flex-grow flex items-center justify-center gap-2 px-4 select-none">
                        <button onClick={() => adjustSchedule(p.id, 'project', -1, 'both')} className="text-[10px] text-white/50 hover:text-white">«</button>
                        <button onClick={() => adjustSchedule(p.id, 'project', 1, 'both')} className="text-[10px] text-white/50 hover:text-white">»</button>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); adjustSchedule(p.id, 'project', 1, 'end'); }} className="opacity-0 group-hover/pill:opacity-100 absolute -right-2 top-0 bottom-0 w-2 bg-black/20 hover:bg-black/40 cursor-col-resize rounded-r"></button>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeLane === 'tasks' && tasks.map(t => {
              const startPos = getWorkdayPosition(t.startDate || t.createdAt);
              const endPos = getWorkdayPosition(t.dueDate || t.startDate || t.createdAt);
              const width = Math.max(3, endPos - startPos);

              return (
                <div key={t.id} className="grid grid-cols-[250px_1fr] items-center h-8 group">
                  <div className="text-[11px] font-medium text-zinc-500 truncate pr-4">{t.title}</div>
                  <div className="relative h-4 flex items-center">
                    <div 
                      className={`absolute h-2.5 rounded transition-all cursor-move flex items-center justify-between group/pill ${t.status === TaskStatus.COMPLETED ? 'bg-zinc-200' : 'bg-zinc-400'}`}
                      style={{ left: `${startPos}%`, width: `${width}%` }}
                    >
                      <div 
                        onClick={() => adjustSchedule(t.id, 'task', -1, 'start')} 
                        className="opacity-0 group-hover/pill:opacity-100 w-1.5 h-full bg-zinc-900/10 cursor-col-resize hover:bg-zinc-900/30 rounded-l"
                      />
                      <div className="flex-grow flex items-center justify-center gap-2 select-none">
                        <button onClick={() => adjustSchedule(t.id, 'task', -1, 'both')} className="opacity-0 group-hover:opacity-100 text-[8px] text-zinc-300">«</button>
                        <button onClick={() => adjustSchedule(t.id, 'task', 1, 'both')} className="opacity-0 group-hover:opacity-100 text-[8px] text-zinc-300">»</button>
                      </div>
                      <div 
                        onClick={() => adjustSchedule(t.id, 'task', 1, 'end')} 
                        className="opacity-0 group-hover/pill:opacity-100 w-1.5 h-full bg-zinc-900/10 cursor-col-resize hover:bg-zinc-900/30 rounded-r"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
