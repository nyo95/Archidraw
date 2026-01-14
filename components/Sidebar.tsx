
import React from 'react';
import { Project, Stakeholder, Task, BrandingSettings } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  branding: BrandingSettings;
  onHomeClick: () => void;
  view: string;
  setView: (v: any) => void;
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
  onAddProject: () => void;
  stakeholders: Stakeholder[];
  tasks: Task[];
  selectedStakeholderId: string | null;
  setSelectedStakeholderId: (id: string) => void;
  onArchiveProject: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, branding, onHomeClick, view, setView, projects, activeProjectId, 
  setActiveProjectId, onAddProject, stakeholders, tasks, selectedStakeholderId, setSelectedStakeholderId,
  onArchiveProject
}) => {
  const activeProjects = projects.filter(p => !p.isArchived);

  return (
    <aside className={`glass-sidebar h-screen border-r border-zinc-100 transition-all duration-500 z-40 relative ${isOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
      <div className="flex flex-col h-full px-8 py-10">
        <div className="mb-12">
          <button onClick={onHomeClick} className="group flex items-center gap-3 transition-all active:scale-95">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt="Logo" 
                style={{ width: `${branding.logoSize}px`, filter: branding.logoInverted ? 'invert(1)' : 'none' }}
                className="object-contain"
              />
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:rotate-6 transition-transform">A</div>
                <div className="text-left">
                  <h1 className="font-black text-[16px] tracking-tight text-zinc-900 uppercase leading-none">Archidraw</h1>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">Studio Studio</span>
                </div>
              </div>
            )}
          </button>
        </div>

        <div className="space-y-1 mb-10">
          <button 
            onClick={() => setView('today')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-[13px] font-bold transition-all ${view === 'today' ? 'bg-zinc-900 text-white shadow-xl translate-x-1' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <Icons.Today /> <span>Daily Briefing</span>
          </button>
          <button 
            onClick={() => setView('timeline')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-[13px] font-bold transition-all ${view === 'timeline' ? 'bg-zinc-900 text-white shadow-xl translate-x-1' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            <Icons.Timeline /> <span>Project Timeline</span>
          </button>
        </div>

        <div className="mb-10">
          <div className="px-4 mb-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">Ball With Reviewers</span>
          </div>
          <div className="space-y-1">
            {stakeholders.map(s => {
              const count = tasks.filter(t => t.ballWith === s.id && t.status !== 'COMPLETED').length;
              if (count === 0) return null;
              return (
                <button 
                  key={s.id} 
                  onClick={() => { setSelectedStakeholderId(s.id); setView('reviews'); }} 
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[12px] text-[12px] font-bold transition-all ${view === 'reviews' && selectedStakeholderId === s.id ? 'bg-zinc-100 text-zinc-900 border-l-4 border-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
                >
                  <span className="truncate">@{s.name.toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${view === 'reviews' && selectedStakeholderId === s.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 mb-4">
            <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">Project Library</span>
            <button onClick={onAddProject} className="p-1 hover:bg-zinc-900 hover:text-white rounded-lg transition-all"><Icons.Plus /></button>
          </div>
          <div className="space-y-1 overflow-y-auto custom-scrollbar flex-grow pr-2">
            {activeProjects.map(p => (
              <div key={p.id} className="group relative">
                <button 
                  onClick={() => setActiveProjectId(p.id)}
                  className={`w-full text-left px-4 py-3 rounded-[16px] text-[12px] font-bold transition-all truncate ${activeProjectId === p.id && view === 'tasks' ? 'bg-zinc-900 text-white shadow-lg translate-x-1' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}
                >
                  {p.name.toUpperCase()}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onArchiveProject(p.id); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
                >
                  <Icons.Archive />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-50">
           <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400"><Icons.User /></div>
              <div className="text-left">
                <p className="text-[10px] font-black text-zinc-900 uppercase">Arch. Principal</p>
                <p className="text-[9px] font-bold text-zinc-300 uppercase">Active Studio</p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
