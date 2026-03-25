export interface BaseEntity {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  deleted?: boolean;
  syncedToGitHub?: boolean;
}

export type PipelineStage = 'applied' | 'screening' | 'technical' | 'hr-round' | 'offer' | 'rejected';

export interface Company extends BaseEntity {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  pipeline?: PipelineStage;
  interviewDate?: Date;
  rating?: number;
  rounds?: number;
  icon?: string;
  gradient?: string;
  tips?: string[];
  qa?: CompanyQA[];
  roundDetails?: CompanyRound[];
}

export interface CompanyQA {
  id: string;
  question: string;
  answer: string;
}

export interface CompanyRound {
  id: string;
  roundNumber: number;
  name: string;
  description: string;
  topics: string[];
  questionIds: number[];
}

export interface Question extends BaseEntity {
  companyId: number;
  title: string;
  description?: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  tags: string[];
  frequency: number;
}

export type QuestionCategory = 
  | 'behavioral'
  | 'technical'
  | 'system-design'
  | 'coding'
  | 'culture-fit'
  | 'problem-solving';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Answer extends BaseEntity {
  questionId: number;
  content: string;
  version: number;
  isBest: boolean;
}

export interface Interview extends BaseEntity {
  companyId: number;
  date: Date;
  type: InterviewType;
  status: InterviewStatus;
  notes?: string;
  outcome?: string;
  link?: string;
}

export type InterviewType = 'phone' | 'onsite' | 'video' | 'coding' | 'behavioral';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending';

export interface SyncState {
  lastSyncAt?: Date;
  isSyncing: boolean;
  syncError?: string;
  pendingChanges: number;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface EncryptedData {
  iv: string;
  data: string;
}

export interface UploadedFile extends BaseEntity {
  name: string;
  originalName: string;
  type: string;
  size: number;
  data: string;
  topic: string;
  description?: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
  category: 'prep' | 'technical' | 'logistics';
}

export interface StreakData {
  streak: number;
  last: string;
}

export interface Flashcard {
  id: number;
  q: string;
  a: string;
  tag: string;
  known: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}
