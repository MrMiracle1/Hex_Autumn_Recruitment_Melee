
export enum Tier {
  SILVER = '白银',
  GOLD = '黄金',
  PRISMATIC = '棱彩'
}

export type ItemType = 'SCHOOL' | 'MAJOR' | 'JOB' | 'COMPANY' | 'INTERNSHIP';

export interface GameItem {
  id: string;
  type: ItemType;
  name: string;
  subTitle: string; // Title or Location or Category
  tier: Tier;
  imageUrl: string;
  description: string;
  tags?: string[]; // For company tags like "996", "SOE", "Remote"
  
  // Specific Logic properties
  salary?: string; // For jobs/companies
  parentId?: string; // For linking majors to schools logic (optional sim)
  statBonus?: number; // Internal score for calculating final offer
  
  // Logic for Round 3 -> Round 4 linkage
  category?: string; // For JOBS (e.g., 'TECH', 'PRODUCT') and MAJORS (e.g., 'STEM', 'ARTS')
  allowedCategories?: string[]; // For INTERNSHIPS (e.g., ['TECH'])
}

export interface EventItem {
  text: string;
  tier: Tier;
}

export type GamePhase = 'IDLE' | 'EVENT_REVEAL' | 'SHUFFLING' | 'DEALING' | 'SELECTION' | 'ROUND_TRANSITION' | 'FINISHED' | 'ANALYZING';

export interface CardSlot {
  item: GameItem;
  hasRerolled: boolean;
  isLocked: boolean;
}

export interface FinalOutcome {
  company: string;
  position: string;
  salary: string;
  desc: string;
  tierClass: string; // CSS color
}
