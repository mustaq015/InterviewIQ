import { Octokit } from 'octokit';
import { encrypt, decrypt } from './encryption';
import type { GitHubConfig, Company, Question, Answer, Interview } from '../types';

const DATA_FILE = 'interviewiq-data.json.enc';

interface SyncData {
  version: number;
  companies: Company[];
  questions: Question[];
  answers: Answer[];
  interviews: Interview[];
  lastUpdated: string;
}

interface RemoteData {
  iv: string;
  data: string;
  version: number;
  lastUpdated: string;
}

export class GitHubSyncService {
  private octokit: Octokit | null = null;
  private config: GitHubConfig | null = null;
  private password: string = '';

  configure(config: GitHubConfig, password: string): void {
    this.config = config;
    this.password = password;
    this.octokit = new Octokit({ auth: config.token });
  }

  isConfigured(): boolean {
    return this.octokit !== null && this.config !== null;
  }

  async testConnection(): Promise<boolean> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub not configured');
    }

    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo
      });
      return data.id > 0;
    } catch (error) {
      console.error('GitHub connection test failed:', error);
      return false;
    }
  }

  async pullChanges(): Promise<SyncData | null> {
    if (!this.octokit || !this.config || !this.password) {
      throw new Error('GitHub not configured');
    }

    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: DATA_FILE,
        ref: this.config.branch
      });

      if (!('content' in data)) {
        return null;
      }

      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const remoteData: RemoteData = JSON.parse(content);

      const decrypted = decrypt(
        { iv: remoteData.iv, data: remoteData.data },
        this.password
      ) as SyncData;

      return decrypted;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Not Found')) {
        return null;
      }
      throw error;
    }
  }

  async pushChanges(localData: SyncData): Promise<void> {
    if (!this.octokit || !this.config || !this.password) {
      throw new Error('GitHub not configured');
    }

    const encrypted = encrypt(localData, this.password);
    
    const remoteData: RemoteData = {
      ...encrypted,
      version: localData.version + 1,
      lastUpdated: new Date().toISOString()
    };

    const content = Buffer.from(JSON.stringify(remoteData)).toString('base64');

    try {
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: DATA_FILE,
        message: 'sync: Update InterviewIQ data',
        content,
        branch: this.config.branch
      });
    } catch (error) {
      console.error('Failed to push changes:', error);
      throw error;
    }
  }

  async fullSync(localData: SyncData): Promise<SyncData> {
    const remoteData = await this.pullChanges();

    if (!remoteData) {
      await this.pushChanges(localData);
      return localData;
    }

    const merged = this.mergeData(localData, remoteData);
    await this.pushChanges(merged);
    
    return merged;
  }

  private mergeData(local: SyncData, remote: SyncData): SyncData {
    const mergedCompanies = this.mergeEntities(local.companies, remote.companies);
    const mergedQuestions = this.mergeEntities(local.questions, remote.questions);
    const mergedAnswers = this.mergeEntities(local.answers, remote.answers);
    const mergedInterviews = this.mergeEntities(local.interviews, remote.interviews);

    return {
      version: Math.max(local.version, remote.version) + 1,
      companies: mergedCompanies,
      questions: mergedQuestions,
      answers: mergedAnswers,
      interviews: mergedInterviews,
      lastUpdated: new Date().toISOString()
    };
  }

  private mergeEntities<T extends { id?: number; version: number }>(
    local: T[],
    remote: T[]
  ): T[] {
    const merged = new Map<number, T>();
    const all = [...local, ...remote];

    for (const entity of all) {
      const id = entity.id!;
      const existing = merged.get(id);

      if (!existing) {
        merged.set(id, entity);
        continue;
      }

      if (entity.version > existing.version) {
        merged.set(id, entity);
      } else if (entity.version === existing.version) {
        merged.set(id, { ...existing, version: existing.version + 1 } as T);
      }
    }

    return Array.from(merged.values());
  }
}

export const githubSync = new GitHubSyncService();
