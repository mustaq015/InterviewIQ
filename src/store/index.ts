import { create } from 'zustand';
import type { Company, Question, Answer, Interview, GitHubConfig, SyncState, ChecklistItem, StreakData, Flashcard } from '../types';
import * as db from '../db';
import { githubSync } from '../services';

interface AppState {
  companies: Company[];
  questions: Question[];
  answers: Answer[];
  interviews: Interview[];
  isLoading: boolean;
  error: string | null;
  
  syncState: SyncState;
  githubConfig: GitHubConfig | null;
  githubPassword: string | null;
  isDarkMode: boolean;

  checklist: ChecklistItem[];
  flashcards: Flashcard[];
  streak: StreakData;

  syncAllData: () => Promise<void>;
  startPeriodicSync: () => void;

  loadData: () => Promise<void>;
  
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<number>;
  updateCompany: (id: number, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;

  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<number>;
  updateQuestion: (id: number, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;

  addAnswer: (answer: Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<number>;
  updateAnswer: (id: number, updates: Partial<Answer>) => Promise<void>;
  deleteAnswer: (id: number) => Promise<void>;

  addInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<number>;
  updateInterview: (id: number, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: number) => Promise<void>;

  configureGitHub: (config: GitHubConfig, password: string) => void;
  disconnectGitHub: () => void;
  sync: () => Promise<void>;
  autoSync: () => Promise<void>;
  toggleDarkMode: () => void;

  toggleChecklistItem: (id: number) => void;
  addChecklistItem: (text: string, category: 'prep' | 'technical' | 'logistics') => void;
  updateChecklistItem: (id: number, text: string, category: 'prep' | 'technical' | 'logistics') => void;
  deleteChecklistItem: (id: number) => void;
  resetChecklist: () => void;

  toggleFlashcardKnown: (id: number) => void;
  addFlashcard: (q: string, a: string, tag: string) => void;
  updateFlashcard: (id: number, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: number) => void;

  updateStreak: () => void;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 1, text: 'Research the company, products and recent news', done: false, category: 'prep' },
  { id: 2, text: 'Review JD and map your experience to requirements', done: false, category: 'prep' },
  { id: 3, text: 'Prepare STAR stories for behavioral questions', done: false, category: 'prep' },
  { id: 4, text: 'Prepare 2-min self introduction', done: false, category: 'prep' },
  { id: 5, text: 'Prepare 3 questions to ask the interviewer', done: false, category: 'prep' },
  { id: 6, text: 'Revise SQL: joins, window functions, aggregates, subqueries', done: false, category: 'technical' },
  { id: 7, text: 'Revise ETL concepts, transformations, and tools', done: false, category: 'technical' },
  { id: 8, text: 'Practice Data Warehouse / DWH concepts and schema types', done: false, category: 'technical' },
  { id: 9, text: 'Review your project architecture and challenges faced', done: false, category: 'technical' },
  { id: 10, text: 'Practice explaining SCD Type 2', done: false, category: 'technical' },
  { id: 11, text: 'Test your camera, mic, internet connection', done: false, category: 'logistics' },
  { id: 12, text: "Get a good night's sleep before interview", done: false, category: 'logistics' },
  { id: 13, text: 'Keep resume and portfolio link ready', done: false, category: 'logistics' },
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  { id: 1, q: 'What is SCD Type 2?', a: 'Tracks historical changes by inserting new rows with effective/expiry dates and a current_flag, preserving full history.', tag: 'DWH', known: false },
  { id: 2, q: 'RANK() vs DENSE_RANK()?', a: "RANK() leaves gaps after ties (1,2,2,4). DENSE_RANK() doesn't leave gaps (1,2,2,3). ROW_NUMBER() is always unique.", tag: 'SQL', known: false },
  { id: 3, q: 'What is a Fact table?', a: 'Stores quantitative measures/metrics (e.g. sales amount). References dimension tables via foreign keys.', tag: 'DWH', known: false },
  { id: 4, q: 'Star Schema vs Snowflake Schema?', a: 'Star: denormalized dimensions, fast queries. Snowflake: normalized dimensions, saves storage but more complex joins.', tag: 'DWH', known: false },
  { id: 5, q: 'What is ETL?', a: 'Extract → Transform → Load. ELT loads first then transforms. ETL is for structured DWH; ELT is for big data/cloud.', tag: 'ETL', known: false },
  { id: 6, q: 'What is a Surrogate Key?', a: 'Artificial primary key (auto-increment integer) assigned independently of natural business keys. Used in DWH for SCD.', tag: 'DWH', known: false },
  { id: 7, q: 'UNION vs UNION ALL?', a: 'UNION removes duplicates (slower). UNION ALL keeps all rows including duplicates (faster). Prefer UNION ALL when safe.', tag: 'SQL', known: false },
  { id: 8, q: 'What is a Window Function?', a: 'Calculates across a related set of rows without collapsing them. Examples: ROW_NUMBER, RANK, SUM, LAG, LEAD.', tag: 'SQL', known: false },
  { id: 9, q: 'Active vs Passive Transformation?', a: 'Active: changes row count (Filter, Aggregator, Joiner). Passive: keeps row count (Expression, Lookup, Sequence Generator).', tag: 'ETL', known: false },
  { id: 10, q: 'What is Normalization?', a: 'Organizing DB to reduce redundancy. 1NF: atomic values. 2NF: no partial dep. 3NF: no transitive dep. BCNF: every determinant is candidate key.', tag: 'SQL', known: false },
  { id: 11, q: 'Types of Slowly Changing Dimensions?', a: 'SCD0: no change. SCD1: overwrite. SCD2: new row + dates. SCD3: add column. SCD4: mini-dimension. SCD6: combo of 1+2+3.', tag: 'DWH', known: false },
  { id: 12, q: 'Data Completeness Testing in ETL?', a: 'Verifying all expected records from source arrived in target. Includes record count checks, null checks, duplicate checks.', tag: 'ETL', known: false },
];

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save failed:', e);
  }
};

const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
};

const GITHUB_CONFIG_KEY = 'interviewiq_github_config';
const GITHUB_PASSWORD_KEY = 'interviewiq_github_password';

let autoSyncTimeout: ReturnType<typeof setTimeout> | null = null;
let periodicSyncInterval: ReturnType<typeof setInterval> | null = null;
const AUTO_SYNC_DELAY = 2000;
const PERIODIC_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useAppStore = create<AppState>((set, get) => ({
  companies: [],
  questions: [],
  answers: [],
  interviews: [],
  isLoading: false,
  error: null,

  syncState: {
    isSyncing: false,
    pendingChanges: 0
  },
  githubConfig: loadFromStorage<GitHubConfig | null>(GITHUB_CONFIG_KEY, null),
  githubPassword: loadFromStorage<string | null>(GITHUB_PASSWORD_KEY, null),
  isDarkMode: loadFromStorage('interviewiq_darkMode', false),

  checklist: loadFromStorage('interviewiq_checklist', DEFAULT_CHECKLIST),
  flashcards: loadFromStorage('interviewiq_flashcards', DEFAULT_FLASHCARDS),
  streak: loadFromStorage('interviewiq_streak', { streak: 0, last: '' }),

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [companies, questions, answers, interviews] = await Promise.all([
        db.getAllCompanies(),
        db.getAllQuestions(),
        db.getAllAnswers(),
        db.getAllInterviews()
      ]);

      const pendingChanges = await db.getUnsyncedChanges();
      
      set({
        companies,
        questions,
        answers,
        interviews,
        isLoading: false,
        syncState: {
          isSyncing: false,
          pendingChanges: 
            pendingChanges.companies.length +
            pendingChanges.questions.length +
            pendingChanges.answers.length +
            pendingChanges.interviews.length
        }
      });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  autoSync: async () => {
    const { githubConfig, githubPassword, syncState } = get();
    
    if (!githubConfig || !githubPassword || syncState.isSyncing) {
      return;
    }

    if (autoSyncTimeout) {
      clearTimeout(autoSyncTimeout);
    }

    autoSyncTimeout = setTimeout(async () => {
      await get().sync();
    }, AUTO_SYNC_DELAY);
  },

  addCompany: async (company) => {
    const id = await db.addCompany(company);
    await get().loadData();
    get().autoSync();
    return id;
  },

  updateCompany: async (id, updates) => {
    await db.updateCompany(id, updates);
    await get().loadData();
    get().autoSync();
  },

  deleteCompany: async (id) => {
    await db.deleteCompany(id);
    await get().loadData();
    get().autoSync();
  },

  addQuestion: async (question) => {
    const id = await db.addQuestion(question);
    await get().loadData();
    get().autoSync();
    return id;
  },

  updateQuestion: async (id, updates) => {
    await db.updateQuestion(id, updates);
    await get().loadData();
    get().autoSync();
  },

  deleteQuestion: async (id) => {
    await db.deleteQuestion(id);
    await get().loadData();
    get().autoSync();
  },

  addAnswer: async (answer) => {
    const id = await db.addAnswer(answer);
    await get().loadData();
    get().autoSync();
    return id;
  },

  updateAnswer: async (id, updates) => {
    await db.updateAnswer(id, updates);
    await get().loadData();
    get().autoSync();
  },

  deleteAnswer: async (id) => {
    await db.deleteAnswer(id);
    await get().loadData();
    get().autoSync();
  },

  addInterview: async (interview) => {
    const id = await db.addInterview(interview);
    await get().loadData();
    get().autoSync();
    return id;
  },

  updateInterview: async (id, updates) => {
    await db.updateInterview(id, updates);
    await get().loadData();
    get().autoSync();
  },

  deleteInterview: async (id) => {
    await db.deleteInterview(id);
    await get().loadData();
    get().autoSync();
  },

  configureGitHub: (config, password) => {
    githubSync.configure(config, password);
    saveToStorage(GITHUB_CONFIG_KEY, config);
    saveToStorage(GITHUB_PASSWORD_KEY, password);
    set({ githubConfig: config, githubPassword: password });
  },

  disconnectGitHub: () => {
    githubSync.configure({ token: '', owner: '', repo: '', branch: '' }, '');
    removeFromStorage(GITHUB_CONFIG_KEY);
    removeFromStorage(GITHUB_PASSWORD_KEY);
    set({ githubConfig: null, githubPassword: null });
  },

  sync: async () => {
    const { companies, questions, answers, interviews, githubPassword } = get();
    
    if (!githubPassword) return;

    set(state => ({
      syncState: { ...state.syncState, isSyncing: true, syncError: undefined }
    }));

    try {
      const syncData = {
        version: 1,
        companies,
        questions,
        answers,
        interviews,
        lastUpdated: new Date().toISOString()
      };

      await githubSync.fullSync(syncData);

      set({
        syncState: {
          isSyncing: false,
          lastSyncAt: new Date(),
          syncError: undefined,
          pendingChanges: 0
        }
      });
    } catch (error) {
      set(state => ({
        syncState: {
          ...state.syncState,
          isSyncing: false,
          syncError: (error as Error).message
        }
      }));
    }
  },

  syncAllData: async () => {
    const { companies, questions, answers, interviews, checklist, flashcards, streak, githubPassword } = get();
    
    if (!githubPassword) return;

    set(state => ({
      syncState: { ...state.syncState, isSyncing: true, syncError: undefined }
    }));

    try {
      const syncData = {
        version: 1,
        companies,
        questions,
        answers,
        interviews,
        checklist,
        flashcards,
        streak,
        lastUpdated: new Date().toISOString()
      };

      await githubSync.fullSync(syncData);

      set({
        syncState: {
          isSyncing: false,
          lastSyncAt: new Date(),
          syncError: undefined,
          pendingChanges: 0
        }
      });
    } catch (error) {
      set(state => ({
        syncState: {
          ...state.syncState,
          isSyncing: false,
          syncError: (error as Error).message
        }
      }));
    }
  },

  startPeriodicSync: () => {
    if (periodicSyncInterval) {
      clearInterval(periodicSyncInterval);
    }
    
    periodicSyncInterval = setInterval(() => {
      const { githubConfig, githubPassword } = get();
      if (githubConfig && githubPassword) {
        get().syncAllData();
      }
    }, PERIODIC_SYNC_INTERVAL);
  },

  toggleDarkMode: () => {
    const newValue = !get().isDarkMode;
    saveToStorage('interviewiq_darkMode', newValue);
    set({ isDarkMode: newValue });
  },

  toggleChecklistItem: (id) => {
    const checklist = get().checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    saveToStorage('interviewiq_checklist', checklist);
    set({ checklist });
    get().autoSync();
  },

  addChecklistItem: (text, category) => {
    const checklist = get().checklist;
    const newId = checklist.length > 0 ? Math.max(...checklist.map(i => i.id)) + 1 : 1;
    const newItem: ChecklistItem = { id: newId, text, done: false, category };
    const updated = [...checklist, newItem];
    saveToStorage('interviewiq_checklist', updated);
    set({ checklist: updated });
    get().autoSync();
  },

  updateChecklistItem: (id, text, category) => {
    const checklist = get().checklist.map(item =>
      item.id === id ? { ...item, text, category } : item
    );
    saveToStorage('interviewiq_checklist', checklist);
    set({ checklist });
    get().autoSync();
  },

  deleteChecklistItem: (id) => {
    const checklist = get().checklist.filter(item => item.id !== id);
    saveToStorage('interviewiq_checklist', checklist);
    set({ checklist });
    get().autoSync();
  },

  resetChecklist: () => {
    const checklist = get().checklist.map(item => ({ ...item, done: false }));
    saveToStorage('interviewiq_checklist', checklist);
    set({ checklist });
    get().autoSync();
  },

  toggleFlashcardKnown: (id) => {
    const flashcards = get().flashcards.map(card =>
      card.id === id ? { ...card, known: !card.known } : card
    );
    saveToStorage('interviewiq_flashcards', flashcards);
    set({ flashcards });
    get().autoSync();
  },

  addFlashcard: (q, a, tag) => {
    const flashcards = get().flashcards;
    const newId = flashcards.length > 0 ? Math.max(...flashcards.map(f => f.id)) + 1 : 1;
    const newCard: Flashcard = { id: newId, q, a, tag, known: false };
    const updated = [...flashcards, newCard];
    saveToStorage('interviewiq_flashcards', updated);
    set({ flashcards: updated });
    get().autoSync();
  },

  updateFlashcard: (id, updates) => {
    const flashcards = get().flashcards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    saveToStorage('interviewiq_flashcards', flashcards);
    set({ flashcards });
    get().autoSync();
  },

  deleteFlashcard: (id) => {
    const flashcards = get().flashcards.filter(card => card.id !== id);
    saveToStorage('interviewiq_flashcards', flashcards);
    set({ flashcards });
    get().autoSync();
  },

  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak = get().streak;
    
    if (streak.last === today) return;
    
    const newStreak: StreakData = {
      streak: streak.last === yesterday ? streak.streak + 1 : 1,
      last: today
    };
    
    saveToStorage('interviewiq_streak', newStreak);
    set({ streak: newStreak });
  }
}));

const initializeGitHub = async () => {
  const config = loadFromStorage<GitHubConfig | null>(GITHUB_CONFIG_KEY, null);
  const password = loadFromStorage<string | null>(GITHUB_PASSWORD_KEY, null);
  
  if (config && password) {
    githubSync.configure(config, password);
    
    // Start periodic sync
    const store = useAppStore.getState();
    store.startPeriodicSync();
    
    // Auto-sync on load
    await store.syncAllData();
  }
};

initializeGitHub();
