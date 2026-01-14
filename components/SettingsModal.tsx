
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User, AppSettings, Stakeholder } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserUpdate: (updates: Partial<User>) => void;
  stakeholders: Stakeholder[];
  onStakeholdersUpdate: (newStakeholders: Stakeholder[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUser, onUserUpdate, stakeholders, onStakeholdersUpdate }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'stakeholders' | 'preferences'>('branding');

  if (!isOpen) return null;

  const updateBranding = (updates: any) => {
    onUserUpdate({
      settings: {
        ...currentUser.settings,
        branding: { ...currentUser.settings.branding, ...updates }
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBranding({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const ROLES = ['Client', 'Contractor', 'Vendor', 'Consultant', 'Internal'];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.1)] border border-zinc-100 w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in duration-300">
        <div className="flex border-b border-zinc-50 bg-zinc-50/50">
          {[
            { id: 'branding', label: 'Identity' },
            { id: 'stakeholders', label: 'Reviewers' },
            { id: 'preferences', label: 'System' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-grow py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-white text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-10 space-y-10 min-h-[500px] max-h-[70vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'branding' && (
            <section className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Office Branding</h3>
                <div className="flex flex-col items-center p-8 border-2 border-dashed border-zinc-100 rounded-[32px] bg-zinc-50/30 gap-6">
                  {currentUser.settings.branding.logoUrl ? (
                    <img 
                      src={currentUser.settings.branding.logoUrl} 
                      style={{ 
                        width: `${currentUser.settings.branding.logoSize}px`,
                        filter: currentUser.settings.branding.logoInverted ? 'invert(1)' : 'none'
                      }}
                      className="object-contain" 
                      alt="Current logo"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-200"><Icons.Project /></div>
                  )}
                  <div className="flex gap-4">
                    <label className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black transition-all">
                      Upload Logo
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    <button onClick={() => updateBranding({ logoUrl: undefined })} className="px-6 py-2 bg-white text-zinc-400 border border-zinc-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-all">Reset</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold text-zinc-900">Logo Size</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Adjust dimensions for sidebar display</p>
                  </div>
                  <input 
                    type="range" min="40" max="180" step="5"
                    value={currentUser.settings.branding.logoSize}
                    onChange={(e) => updateBranding({ logoSize: parseInt(e.target.value) })}
                    className="w-32 accent-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold text-zinc-900">Invert Color</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Force logo to white (for dark sidebars)</p>
                  </div>
                  <button 
                    onClick={() => updateBranding({ logoInverted: !currentUser.settings.branding.logoInverted })}
                    className={`w-10 h-5 rounded-full transition-all relative ${currentUser.settings.branding.logoInverted ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${currentUser.settings.branding.logoInverted ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'stakeholders' && (
            <section className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Network Members</h3>
                <button onClick={() => onStakeholdersUpdate([...stakeholders, { id: Math.random().toString(), name: 'New Contact', role: 'Internal' }])} className="text-[10px] font-bold text-zinc-900 flex items-center gap-1 hover:underline">
                  <Icons.Plus /> New Stakeholder
                </button>
              </div>
              <div className="space-y-4">
                {stakeholders.map(s => (
                  <div key={s.id} className="p-6 bg-zinc-50/50 rounded-[24px] border border-zinc-100 group transition-all hover:bg-white hover:shadow-xl hover:border-zinc-200">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <div className="flex-grow">
                        <input 
                          value={s.name}
                          onChange={(e) => onStakeholdersUpdate(stakeholders.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))}
                          className="bg-transparent text-sm font-bold text-zinc-900 outline-none w-full focus:bg-zinc-100 rounded px-2 -ml-2 transition-colors placeholder:text-zinc-200"
                          placeholder="Contact Name"
                        />
                      </div>
                      <button onClick={() => onStakeholdersUpdate(stakeholders.filter(x => x.id !== s.id))} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all">
                        <Icons.Trash />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <select
                        value={s.role}
                        onChange={(e) => onStakeholdersUpdate(stakeholders.map(x => x.id === s.id ? { ...x, role: e.target.value as any } : x))}
                        className="w-full appearance-none bg-white border border-zinc-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all cursor-pointer"
                      >
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <Icons.ChevronDown />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'preferences' && (
            <section className="space-y-8 animate-in fade-in duration-300">
               <div>
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">Workflow Intelligence</h3>
                <div className="space-y-6">
                  {[
                    { key: 'enablePriorityShortcuts', label: 'Priority Mapping', desc: 'Auto-set P1-P3 using text shortcuts' },
                    { key: 'enableMentionShortcuts', label: 'Stakeholder Mentions', desc: 'Tag reviewers using @username' },
                    { key: 'enableDateShortcuts', label: 'Chronos Parsing', desc: 'Detect dates like "next week" or "today"' },
                  ].map((s) => (
                    <div key={s.key} className="flex items-center justify-between group">
                      <div>
                        <p className="text-[13px] font-bold text-zinc-900">{s.label}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{s.desc}</p>
                      </div>
                      <button 
                        onClick={() => onUserUpdate({ settings: { ...currentUser.settings, [s.key]: !currentUser.settings[s.key as keyof AppSettings] }})}
                        className={`w-12 h-6 rounded-full transition-all relative ${currentUser.settings[s.key as keyof AppSettings] ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${currentUser.settings[s.key as keyof AppSettings] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="p-8 bg-zinc-50/50 border-t border-zinc-50">
          <button onClick={onClose} className="w-full py-5 bg-zinc-900 text-white rounded-[20px] text-sm font-bold hover:bg-black transition-all shadow-xl">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
