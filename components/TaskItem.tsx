
import React from 'react';
import { Task, TaskStatus, Priority, Stakeholder, ProjectPhase } from '../types';
import { Icons } from '../constants';

interface TaskItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onAddSubtask: (parentId: string) => void;
  onHandoverTrigger?: () => void;
  onAssignTrigger?: () => void;
  onApproveTrigger?: () => void;
  onClickDetail?: () => void;
  allStakeholders: Stakeholder[];
  subTasks: Task[];
  isSubtask?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, onUpdate, onDelete, onAddSubtask, onHandoverTrigger, onAssignTrigger, onApproveTrigger, onClickDetail, allStakeholders, subTasks, isSubtask 
}) => {
  const isPhaseLevel = !task.parentId;
  const isInReview = task.status === TaskStatus.IN_REVIEW;
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPhaseLevel) {
      if (task.status === TaskStatus.TODO) {
        if (onAssignTrigger) onAssignTrigger();
      } else if (task.status === TaskStatus.IN_REVIEW) {
        if (onHandoverTrigger) onHandoverTrigger();
      } else {
        onUpdate({ status: TaskStatus.TODO });
      }
    } else {
      onUpdate({ status: isCompleted ? TaskStatus.TODO : TaskStatus.COMPLETED });
    }
  };

  return (
    <div className={`group/item ${isSubtask ? 'ml-12 border-l-2 border-zinc-100 pl-6 py-2' : 'mb-8 bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all'}`}>
      <div 
        onClick={onClickDetail}
        className={`flex items-start gap-5 p-6 transition-colors cursor-pointer ${isPhaseLevel && isCompleted ? 'bg-zinc-50 opacity-60' : 'hover:bg-zinc-50/40'}`}
      >
        {/* Status Area */}
        <div className="shrink-0 mt-1 flex items-center gap-3">
          {isInReview && isPhaseLevel ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); if(onApproveTrigger) onApproveTrigger(); }}
                className="w-10 h-10 rounded-[14px] bg-zinc-900 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                title="Approve Drawing"
              >
                <Icons.Check />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); if(onHandoverTrigger) onHandoverTrigger(); }}
                className="w-10 h-10 rounded-[14px] bg-white border-2 border-red-50 text-red-500 flex items-center justify-center hover:bg-red-50 transition-all shadow-sm"
                title="Request Revision"
              >
                <div className="font-black text-[12px]">REV</div>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAction}
              className={`flex items-center justify-center transition-all border-2 rounded-[12px] ${isPhaseLevel ? 'w-7 h-7 border-zinc-900' : 'w-5 h-5 border-zinc-300'} ${
                isCompleted ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white'
              }`}
            >
              {isCompleted && <Icons.Check />}
            </button>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h4 className={`leading-tight truncate ${isPhaseLevel ? 'text-[18px] font-black text-zinc-900 uppercase tracking-tight' : 'text-[14px] font-medium text-zinc-600'} ${isCompleted && !isPhaseLevel ? 'line-through text-zinc-300' : ''}`}>
              {task.title}
            </h4>
            
            {isPhaseLevel && (
               <div className="flex items-center gap-3">
                 <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${isInReview ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-400 border-zinc-200'}`}>
                   {task.status.replace('_', ' ')}
                 </span>
                 <span className="text-[10px] font-black text-zinc-300 uppercase">Rev.{task.revision}</span>
               </div>
            )}
          </div>
          {!isPhaseLevel && task.dueDate && (
             <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1">
                <Icons.Calendar /> {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
             </p>
          )}
        </div>

        {/* Hover Actions */}
        <div className="opacity-0 group-hover/item:opacity-100 flex items-center gap-2">
          {isPhaseLevel && task.status === TaskStatus.TODO && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddSubtask(task.id); }}
              className="p-2 text-zinc-400 hover:text-zinc-900 bg-white rounded-xl border border-zinc-100 shadow-sm transition-all"
            >
              <Icons.Plus />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-zinc-300 hover:text-red-500 transition-all">
            <Icons.Trash />
          </button>
        </div>
      </div>

      {/* Drawing Instructions Area */}
      {isPhaseLevel && (
        <div className="border-t border-zinc-50 bg-zinc-50/30 p-4">
          {subTasks.length > 0 ? (
            <div className="space-y-1">
              {subTasks.map(st => (
                <TaskItem 
                  key={st.id} task={st} onUpdate={onUpdate} onDelete={onDelete} 
                  onAddSubtask={onAddSubtask} allStakeholders={allStakeholders} 
                  subTasks={[]} isSubtask 
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-4 italic">Waiting for Studio Instructions</p>
              {task.status === TaskStatus.TODO && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddSubtask(task.id); }}
                  className="mx-auto flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-zinc-900 transition-all uppercase tracking-widest bg-white border border-zinc-100 px-8 py-3 rounded-full shadow-sm hover:shadow-md"
                >
                  <Icons.Plus /> Add Task
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
