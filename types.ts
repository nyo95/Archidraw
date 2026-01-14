
export enum Priority {
  P1 = 1,
  P2 = 2,
  P3 = 3
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED'
}

export enum ProjectPhase {
  MOODBOARD = 'Moodboard',
  LAYOUT_2D = 'Layout 2D',
  THREE_D = '3D Design',
  FFNE = 'Materials & FF&E',
  CD = 'Construction Drawings',
  SV = 'Supervision'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface BrandingSettings {
  logoUrl?: string;
  logoSize: number;
  logoInverted: boolean;
}

export interface AppSettings {
  enablePriorityShortcuts: boolean;
  enableMentionShortcuts: boolean;
  enableDateShortcuts: boolean;
  autoCleanShortcuts: boolean;
  branding: BrandingSettings;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  settings: AppSettings;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: 'Client' | 'Contractor' | 'Vendor' | 'Consultant' | 'Internal';
  color?: string;
}

export interface TaskRevisionRecord {
  revision: number;
  note: string;
  date: string;
  ballWith?: string;
}

export interface Task {
  id: string;
  projectId: string;
  parentId?: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  phase: ProjectPhase;
  revision: number;
  ballWith?: string;   
  dueDate?: string;
  startDate?: string;
  createdAt: string;
  history?: TaskRevisionRecord[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  isArchived: boolean;
  startDate: string;
  endDate: string;
  clientName: string;
}
