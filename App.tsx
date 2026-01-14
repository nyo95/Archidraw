
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, Task, TaskStatus, Priority, User, Stakeholder, ProjectPhase } from './types';
import { Icons, STAKEHOLDERS as INITIAL_STAKEHOLDERS, SIMULATED_USERS } from './constants';
import TaskItem from './components/TaskItem';
import SettingsModal from './components/SettingsModal';
import TaskComposer from './components/TaskComposer';
import Sidebar from './components/Sidebar';
import HandoverModal from './components/HandoverModal';
import TaskDetailModal from './components/TaskDetailModal';
import AssignReviewerModal from './components/AssignReviewerModal';
import NextPhaseSuggestionModal from './components/NextPhaseSuggestionModal';
import TimelineView from './components/TimelineView';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('archidraw_studio_p_v19');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Penthouse Dharmawangsa', description: 'Luxury Modern Classic', priority: Priority.P1, isArchived: false, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 2592000000).toISOString(), clientName: 'Bapak Surya' }
    ];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('archidraw_studio_t_v19');
    return saved ? JSON.parse(saved) : [];
  });

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(() => {
    const saved = localStorage.getItem('archidraw_studio_s_v19');
    return saved ? JSON.parse(saved) : INITIAL_STAKEHOLDERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('archidraw_studio_u_v19');
    const defaults = SIMULATED_USERS[0];
    try {
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {}
    return defaults;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects.find(p => !p.isArchived)?.id || null);
  const [view, setView] = useState<'tasks' | 'timeline' | 'archive' | 'reviews' | 'today' | 'upcoming'>('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
  const [composerTarget, setComposerTarget] = useState<{projectId: string, parentId?: string} | null>(null);
  const [isPhasePickerOpen, setIsPhasePickerOpen] = useState(false);
  
  const [assignReviewId, setAssignReviewId] = useState<string | null>(null);
  const [handoverTaskId, setHandoverTaskId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [approvedTaskData, setApprovedTaskData] = useState<{phase: ProjectPhase, rev: number} | null>(null);

  useEffect(() => localStorage.setItem('archidraw_studio_p_v19', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('archidraw_studio_t_v19', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('archidraw_studio_s_v19', JSON.stringify(stakeholders)), [stakeholders]);
  useEffect(() => localStorage.setItem('archidraw_studio_u_v19', JSON.stringify(currentUser)), [currentUser]);

  const availablePhases = useMemo(() => {
    if (!activeProjectId) return [];
    const activeOrInReviewPhases = tasks
      .filter(t => t.projectId === activeProjectId && !t.parentId && t.status !== TaskStatus.COMPLETED)
      .map(t => t.phase);
    
    return Object.values(ProjectPhase).filter(p => !activeOrInReviewPhases.includes(p));
  }, [tasks, activeProjectId]);

  const handleAddPhaseInstantly = useCallback((selectedPhase: ProjectPhase) => {
    const pId = activeProjectId || (projects.length > 0 ? projects[0].id : null);
    if (!pId) return;

    const pastPhases = tasks.filter(t => t.projectId === pId && t.phase === selectedPhase && !t.parentId);
    const nextRev = pastPhases.length > 0 ? Math.max(...pastPhases.map(p => p.revision)) + 1 : 1;

    const newId = Math.random().toString(36).substr(2, 9);
    const newPhase: Task = {
      id: newId,
      projectId: pId,
      title: `${selectedPhase} REV ${nextRev}`,
      description: '',
      priority: Priority.P2,
      status: TaskStatus.TODO,
      phase: selectedPhase,
      revision: nextRev,
      createdAt: new Date().toISOString(),
      history: []
    };
    
    setTasks(prev => [...prev, newPhase]);
    setIsPhasePickerOpen(false);
    setComposerTarget({ projectId: pId, parentId: newId });
    setApprovedTaskData(null);
  }, [activeProjectId, projects, tasks]);

  const handleUpdateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const handleReviewOutcome = useCallback((taskId: string, outcome: 'approved' | 'rejected', feedback?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (outcome === 'approved') {
      setTasks(prev => prev.map(t => t.id === taskId ? { 
        ...t, 
        status: TaskStatus.COMPLETED, 
        title: `${t.phase} REV ${t.revision} - APPROVED`,
        ballWith: undefined 
      } : t));
      setApprovedTaskData({ phase: task.phase, rev: task.revision });
    } else {
      const nextRev = task.revision + 1;
      const newPhaseId = Math.random().toString(36).substr(2, 9);
      
      const updatedTasks = tasks.map(t => t.id === taskId ? { 
        ...t, 
        status: TaskStatus.COMPLETED, 
        title: `${t.phase} REV ${t.revision} - REJECTED`,
        ballWith: undefined 
      } : t);

      const newPhase: Task = {
        id: newPhaseId,
        projectId: task.projectId,
        title: `${task.phase} REV ${nextRev}`,
        description: '',
        priority: task.priority,
        status: TaskStatus.TODO,
        phase: task.phase,
        revision: nextRev,
        createdAt: new Date().toISOString(),
        history: [...(task.history || []), { revision: task.revision, note: feedback || 'Revision requested', date: new Date().toISOString() }]
      };

      setTasks([...updatedTasks, newPhase]);
    }
    setHandoverTaskId(null);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (view === 'tasks' && activeProjectId) {
      return tasks.filter(t => t.projectId === activeProjectId && !t.parentId && t.status !== TaskStatus.COMPLETED);
    }
    if (view === 'reviews' && selectedStakeholderId) {
      return tasks.filter(t => t.ballWith === selectedStakeholderId && t.status === TaskStatus.IN_REVIEW);
    }
    return [];
  }, [tasks, view, activeProjectId, selectedStakeholderId]);

  return (
    <div className="flex h-screen bg-white text-zinc-900 overflow-hidden font-sans page-transition">
      <Sidebar 
        isOpen={isSidebarOpen} branding={currentUser.settings.branding}
        onHomeClick={() => { setView('tasks'); setActiveProjectId(projects.find(p => !p.isArchived)?.id || null); }}
        view={view} setView={setView} projects={projects}
        activeProjectId={activeProjectId} setActiveProjectId={(id) => { setActiveProjectId(id); setView('tasks'); }}
        onAddProject={() => {}} stakeholders={stakeholders}
        tasks={tasks} selectedStakeholderId={selectedStakeholderId} setSelectedStakeholderId={setSelectedStakeholderId}
        onArchiveProject={(id) => setProjects(prev => prev.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p))}
      />

      <main className="flex-grow flex flex-col bg-white overflow-hidden relative">
        <header className="px-12 pt-12 pb-10 border-b border-zinc-50 z-30 bg-white/80 backdrop-blur-md sticky top-0">
          <div className="flex items-center justify-between mb-2">
             <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                   {view === 'reviews' ? 'Review Queue' : 'Studio Project'}
                </span>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">
                  {view === 'reviews' ? stakeholders.find(s => s.id === selectedStakeholderId)?.name : (projects.find(p => p.id === activeProjectId)?.name || 'Projects')}
                </h2>
             </div>
             <div className="flex items-center gap-6">
                <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all shadow-sm"><Icons.Settings /></button>
                <div className="w-12 h-12 bg-zinc-900 rounded-[20px] shadow-xl flex items-center justify-center text-white font-bold">P</div>
             </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto px-12 pt-10 pb-64 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {view === 'tasks' && (
              <div className="mb-12">
                {!isPhasePickerOpen ? (
                  <button 
                    onClick={() => setIsPhasePickerOpen(true)}
                    className="group w-full flex items-center justify-center gap-3 py-6 px-10 border-2 border-dashed border-zinc-100 rounded-[32px] hover:border-zinc-900 hover:bg-zinc-50 transition-all text-zinc-300 hover:text-zinc-900"
                  >
                    <Icons.Plus />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em]">Initiate New Drawing Phase</span>
                  </button>
                ) : (
                  <div className="p-10 bg-zinc-50 rounded-[40px] border border-zinc-100 animate-in zoom-in duration-300">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Select Work Phase</h3>
                      <button onClick={() => setIsPhasePickerOpen(false)} className="text-zinc-300 hover:text-zinc-900"><Icons.Check /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availablePhases.map(phase => (
                        <button 
                          key={phase}
                          onClick={() => handleAddPhaseInstantly(phase)}
                          className="p-6 bg-white border border-zinc-100 rounded-[24px] text-left hover:border-zinc-900 hover:shadow-2xl transition-all group"
                        >
                          <span className="block text-[10px] font-black text-zinc-300 uppercase mb-2 group-hover:text-zinc-900">#DrawingSet</span>
                          <span className="text-[14px] font-black uppercase text-zinc-900">{phase}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === 'timeline' ? (
              <TimelineView projects={projects} tasks={tasks} onUpdateProject={(id, u) => setProjects(p => p.map(x => x.id === id ? {...x,...u} : x))} onUpdateTask={handleUpdateTask} isFullScreen />
            ) : (
              <div className="space-y-12">
                {filteredTasks.length > 0 ? filteredTasks.map(phase => (
                  <div key={phase.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <TaskItem 
                      task={phase} 
                      onUpdate={(u) => handleUpdateTask(phase.id, u)} 
                      onDelete={() => setTasks(prev => prev.filter(t => t.id !== phase.id && t.parentId !== phase.id))}
                      onAddSubtask={(parentId) => setComposerTarget({projectId: phase.projectId, parentId})}
                      onHandoverTrigger={() => setHandoverTaskId(phase.id)}
                      onAssignTrigger={() => setAssignReviewId(phase.id)}
                      onApproveTrigger={() => handleReviewOutcome(phase.id, 'approved')}
                      onClickDetail={() => setDetailTaskId(phase.id)}
                      allStakeholders={stakeholders} 
                      subTasks={tasks.filter(t => t.parentId === phase.id)}
                    />
                    {composerTarget?.parentId === phase.id && (
                      <div className="mt-4">
                        <TaskComposer 
                          isSubtask
                          onAdd={(t, d) => {
                            const newId = Math.random().toString(36).substr(2, 9);
                            setTasks(prev => [...prev, {
                               id: newId, projectId: phase.projectId, parentId: phase.id,
                               title: t, description: '', priority: d.priority || Priority.P3,
                               status: TaskStatus.TODO, phase: phase.phase, revision: 0,
                               dueDate: d.dueDate, createdAt: new Date().toISOString(), history: []
                            }]);
                            setComposerTarget(null);
                          }} 
                          onCancel={() => setComposerTarget(null)} 
                          stakeholders={stakeholders} settings={currentUser.settings} 
                        />
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-40 text-center opacity-10 grayscale select-none">
                    <div className="text-9xl mb-10">🏛️</div>
                    <p className="text-[14px] font-black uppercase tracking-[0.5em]">Drawing Archive is Empty</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Studio Overlays */}
        {approvedTaskData && (
          <NextPhaseSuggestionModal 
            lastPhase={approvedTaskData.phase}
            lastRev={approvedTaskData.rev}
            availablePhases={availablePhases}
            onSelectNext={handleAddPhaseInstantly}
            onClose={() => setApprovedTaskData(null)}
          />
        )}

        {assignReviewId && (
          <AssignReviewerModal 
            stakeholders={stakeholders}
            onAssign={(sId) => {
              handleUpdateTask(assignReviewId, { status: TaskStatus.IN_REVIEW, ballWith: sId });
              setAssignReviewId(null);
            }}
            onClose={() => setAssignReviewId(null)}
          />
        )}

        {handoverTaskId && (
          <HandoverModal 
            task={tasks.find(t => t.id === handoverTaskId)!}
            stakeholders={stakeholders}
            onHandoverDecision={handleReviewOutcome}
            onClose={() => setHandoverTaskId(null)}
          />
        )}

        {detailTaskId && (
          <TaskDetailModal 
            task={tasks.find(t => t.id === detailTaskId)!}
            stakeholders={stakeholders}
            onUpdate={(u) => handleUpdateTask(detailTaskId, u)}
            onClose={() => setDetailTaskId(null)}
          />
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentUser={currentUser} onUserUpdate={setCurrentUser} stakeholders={stakeholders} onStakeholdersUpdate={setStakeholders} />
    </div>
  );
};

export default App;
