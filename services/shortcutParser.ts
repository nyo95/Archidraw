
import { Priority, Stakeholder, AppSettings } from '../types';

export interface ParsedShortcut {
  cleanTitle: string;
  priority?: Priority;
  stakeholderId?: string;
  newStakeholderName?: string;
  dueDate?: string;
}

export function parseTaskShortcuts(
  input: string, 
  stakeholders: Stakeholder[], 
  settings: AppSettings
): ParsedShortcut {
  let text = input;
  let priority: Priority | undefined;
  let stakeholderId: string | undefined;
  let newStakeholderName: string | undefined;
  let dueDate: string | undefined;

  // 1. Parse Priority (p1, p2, p3)
  if (settings.enablePriorityShortcuts) {
    const pMatch = text.match(/\b(p[1-3])\b/i);
    if (pMatch) {
      const pNum = parseInt(pMatch[1].substring(1));
      priority = pNum as Priority;
      if (settings.autoCleanShortcuts) text = text.replace(pMatch[0], '');
    }
  }

  // 2. Parse Mentions (@Name) with smart matching
  if (settings.enableMentionShortcuts) {
    const mMatch = text.match(/@([\w.-]+)/);
    if (mMatch) {
      const mentionName = mMatch[1];
      const normalizedMention = mentionName.toLowerCase().trim();
      
      // Try exact or partial match
      const found = stakeholders.find(s => 
        s.name.toLowerCase() === normalizedMention || 
        s.name.toLowerCase().startsWith(normalizedMention)
      );

      if (found) {
        stakeholderId = found.id;
      } else {
        // If not found, flag it for creation in App.tsx
        newStakeholderName = mentionName;
      }
      
      if (settings.autoCleanShortcuts) text = text.replace(mMatch[0], '');
    }
  }

  // 3. Parse Dates
  if (settings.enableDateShortcuts) {
    const dateKeywords = ['today', 'tomorrow', 'next week', 'mid week'];
    for (const kw of dateKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(text)) {
        const d = new Date();
        if (kw === 'tomorrow') d.setDate(d.getDate() + 1);
        else if (kw === 'next week') d.setDate(d.getDate() + 7);
        else if (kw === 'mid week') {
          const day = d.getDay();
          const diff = (3 + 7 - day) % 7 || 7;
          d.setDate(d.getDate() + diff);
        }
        dueDate = d.toISOString();
        if (settings.autoCleanShortcuts) text = text.replace(regex, '');
        break;
      }
    }
  }

  return {
    cleanTitle: text.trim().replace(/\s+/g, ' '),
    priority,
    stakeholderId,
    newStakeholderName,
    dueDate
  };
}
