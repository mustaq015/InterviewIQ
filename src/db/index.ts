import Dexie, { Table } from 'dexie';
import type { Company, Question, Answer, Interview, UploadedFile } from '../types';

export class InterviewIQDB extends Dexie {
  companies!: Table<Company, number>;
  questions!: Table<Question, number>;
  answers!: Table<Answer, number>;
  interviews!: Table<Interview, number>;
  uploadedFiles!: Table<UploadedFile, number>;

  constructor() {
    super('InterviewIQ');
    
    this.version(1).stores({
      companies: '++id, name, createdAt, updatedAt, deleted, syncedToGitHub',
      questions: '++id, companyId, title, category, difficulty, *tags, createdAt, updatedAt, deleted, syncedToGitHub',
      answers: '++id, questionId, version, isBest, createdAt, updatedAt, deleted, syncedToGitHub',
      interviews: '++id, companyId, date, type, status, createdAt, updatedAt, deleted, syncedToGitHub'
    });

    this.version(2).stores({
      companies: '++id, name, createdAt, updatedAt, deleted, syncedToGitHub',
      questions: '++id, companyId, title, category, difficulty, *tags, createdAt, updatedAt, deleted, syncedToGitHub',
      answers: '++id, questionId, version, isBest, createdAt, updatedAt, deleted, syncedToGitHub',
      interviews: '++id, companyId, date, type, status, createdAt, updatedAt, deleted, syncedToGitHub',
      uploadedFiles: '++id, name, originalName, type, topic, createdAt, updatedAt'
    }).upgrade(tx => {
      return tx.table('uploadedFiles').clear();
    });
  }
}

export const db = new InterviewIQDB();

export async function getAllCompanies(): Promise<Company[]> {
  return db.companies.where('deleted').equals(0).toArray();
}

export async function getCompanyById(id: number): Promise<Company | undefined> {
  return db.companies.get(id);
}

export async function addCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<number> {
  const now = new Date();
  return db.companies.add({
    ...company,
    createdAt: now,
    updatedAt: now,
    version: 1,
    deleted: false,
    syncedToGitHub: false
  } as Company);
}

export async function updateCompany(id: number, updates: Partial<Company>): Promise<number> {
  const company = await db.companies.get(id);
  if (!company) throw new Error('Company not found');
  
  return db.companies.update(id, {
    ...updates,
    updatedAt: new Date(),
    version: company.version + 1,
    syncedToGitHub: false
  });
}

export async function deleteCompany(id: number): Promise<void> {
  await db.companies.update(id, {
    deleted: true,
    updatedAt: new Date(),
    syncedToGitHub: false
  });
}

export async function getAllQuestions(): Promise<Question[]> {
  return db.questions.where('deleted').equals(0).toArray();
}

export async function getQuestionsByCompany(companyId: number): Promise<Question[]> {
  return db.questions.where('companyId').equals(companyId).and(q => !q.deleted).toArray();
}

export async function getQuestionById(id: number): Promise<Question | undefined> {
  return db.questions.get(id);
}

export async function addQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<number> {
  const now = new Date();
  return db.questions.add({
    ...question,
    createdAt: now,
    updatedAt: now,
    version: 1,
    deleted: false,
    syncedToGitHub: false
  } as Question);
}

export async function updateQuestion(id: number, updates: Partial<Question>): Promise<number> {
  const question = await db.questions.get(id);
  if (!question) throw new Error('Question not found');
  
  return db.questions.update(id, {
    ...updates,
    updatedAt: new Date(),
    version: question.version + 1,
    syncedToGitHub: false
  });
}

export async function deleteQuestion(id: number): Promise<void> {
  await db.questions.update(id, {
    deleted: true,
    updatedAt: new Date(),
    syncedToGitHub: false
  });
}

export async function getAllAnswers(): Promise<Answer[]> {
  return db.answers.where('deleted').equals(0).toArray();
}

export async function getAnswersByQuestion(questionId: number): Promise<Answer[]> {
  return db.answers.where('questionId').equals(questionId).and(a => !a.deleted).toArray();
}

export async function getAnswerById(id: number): Promise<Answer | undefined> {
  return db.answers.get(id);
}

export async function addAnswer(answer: Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<number> {
  const now = new Date();
  return db.answers.add({
    ...answer,
    createdAt: now,
    updatedAt: now,
    version: 1,
    deleted: false,
    syncedToGitHub: false
  } as Answer);
}

export async function updateAnswer(id: number, updates: Partial<Answer>): Promise<number> {
  const answer = await db.answers.get(id);
  if (!answer) throw new Error('Answer not found');
  
  return db.answers.update(id, {
    ...updates,
    updatedAt: new Date(),
    version: answer.version + 1,
    syncedToGitHub: false
  });
}

export async function deleteAnswer(id: number): Promise<void> {
  await db.answers.update(id, {
    deleted: true,
    updatedAt: new Date(),
    syncedToGitHub: false
  });
}

export async function getAllInterviews(): Promise<Interview[]> {
  return db.interviews.where('deleted').equals(0).toArray();
}

export async function getInterviewsByCompany(companyId: number): Promise<Interview[]> {
  return db.interviews.where('companyId').equals(companyId).and(i => !i.deleted).toArray();
}

export async function getInterviewById(id: number): Promise<Interview | undefined> {
  return db.interviews.get(id);
}

export async function addInterview(interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<number> {
  const now = new Date();
  return db.interviews.add({
    ...interview,
    createdAt: now,
    updatedAt: now,
    version: 1,
    deleted: false,
    syncedToGitHub: false
  } as Interview);
}

export async function updateInterview(id: number, updates: Partial<Interview>): Promise<number> {
  const interview = await db.interviews.get(id);
  if (!interview) throw new Error('Interview not found');
  
  return db.interviews.update(id, {
    ...updates,
    updatedAt: new Date(),
    version: interview.version + 1,
    syncedToGitHub: false
  });
}

export async function deleteInterview(id: number): Promise<void> {
  await db.interviews.update(id, {
    deleted: true,
    updatedAt: new Date(),
    syncedToGitHub: false
  });
}

export async function getUnsyncedChanges(): Promise<{
  companies: Company[];
  questions: Question[];
  answers: Answer[];
  interviews: Interview[];
}> {
  const [companies, questions, answers, interviews] = await Promise.all([
    db.companies.where('syncedToGitHub').equals(0).toArray(),
    db.questions.where('syncedToGitHub').equals(0).toArray(),
    db.answers.where('syncedToGitHub').equals(0).toArray(),
    db.interviews.where('syncedToGitHub').equals(0).toArray()
  ]);

  return { companies, questions, answers, interviews };
}

export async function markAsSynced(
  type: 'companies' | 'questions' | 'answers' | 'interviews',
  ids: number[]
): Promise<void> {
  const table = db[type];
  await Promise.all(ids.map(id => table.update(id, { syncedToGitHub: true })));
}

export async function getAllUploadedFiles(): Promise<UploadedFile[]> {
  return db.uploadedFiles.toArray();
}

export async function getUploadedFileById(id: number): Promise<UploadedFile | undefined> {
  return db.uploadedFiles.get(id);
}

export async function addUploadedFile(file: Omit<UploadedFile, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<number> {
  const now = new Date();
  return db.uploadedFiles.add({
    ...file,
    createdAt: now,
    updatedAt: now,
    version: 1
  } as UploadedFile);
}

export async function updateUploadedFile(id: number, updates: Partial<UploadedFile>): Promise<number> {
  return db.uploadedFiles.update(id, {
    ...updates,
    updatedAt: new Date()
  });
}

export async function deleteUploadedFile(id: number): Promise<void> {
  await db.uploadedFiles.delete(id);
}
