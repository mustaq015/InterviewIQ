import { Octokit } from 'octokit';
import { encrypt, decrypt } from './encryption';
import type { GitHubConfig, Company, Question, Answer, Interview, ChecklistItem, Flashcard, StreakData } from '../types';

const DATA_FILE = 'interviewiq-data.json.enc';

interface SyncData {
  version: number;
  companies: Company[];
  questions: Question[];
  answers: Answer[];
  interviews: Interview[];
  checklist: ChecklistItem[];
  flashcards: Flashcard[];
  streak: StreakData;
  lastUpdated: string;
}

interface RemoteData {
  iv: string;
  data: string;
  version: number;
  lastUpdated: string;
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
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

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.octokit || !this.config) {
      return { success: false, message: 'GitHub not configured' };
    }

    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo
      });

      const branchExistsResult = await this.branchExists(this.config.branch);
      if (!branchExistsResult) {
        return { 
          success: false, 
          message: `Repository found, but branch "${this.config.branch}" does not exist. Default branch is "${data.default_branch}". Please use an existing branch.` 
        };
      }

      return { success: true, message: 'Connection successful!' };
    } catch (error: unknown) {
      console.error('GitHub connection test failed:', error);
      if (error instanceof Error && error.message.includes('Not Found')) {
        return { success: false, message: 'Repository not found. Check owner and repo name.' };
      }
      return { success: false, message: (error as Error).message };
    }
  }

  async getDefaultBranch(): Promise<string> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub not configured');
    }

    const { data } = await this.octokit.rest.repos.get({
      owner: this.config.owner,
      repo: this.config.repo
    });
    return data.default_branch;
  }

  async branchExists(branch: string): Promise<boolean> {
    if (!this.octokit || !this.config) {
      return false;
    }

    try {
      await this.octokit.rest.repos.getBranch({
        owner: this.config.owner,
        repo: this.config.repo,
        branch
      });
      return true;
    } catch {
      return false;
    }
  }

  async ensureBranchExists(): Promise<string> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub not configured');
    }

    const branchExists = await this.branchExists(this.config.branch);
    
    if (branchExists) {
      return this.config.branch;
    }

    const defaultBranch = await this.getDefaultBranch();
    const sha = await this.getBranchSha(defaultBranch);
    
    try {
      await this.octokit.rest.git.createRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `refs/heads/${this.config.branch}`,
        sha: sha
      });
      return this.config.branch;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return this.config.branch;
      }
      throw new Error(`Branch "${this.config.branch}" does not exist. Please use an existing branch or create it on GitHub first.`);
    }
  }

  private async getBranchSha(branch: string): Promise<string> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub not configured');
    }

    const { data } = await this.octokit.rest.repos.getBranch({
      owner: this.config.owner,
      repo: this.config.repo,
      branch: branch
    });

    return data.commit.sha;
  }

  async pullChanges(): Promise<SyncData | null> {
    if (!this.octokit || !this.config || !this.password) {
      throw new Error('GitHub not configured');
    }

    try {
      const branch = await this.ensureBranchExists();
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: DATA_FILE,
        ref: branch
      });

      if (!('content' in data)) {
        return null;
      }

      const content = fromBase64(data.content);
      const remoteData: RemoteData = JSON.parse(content);

      const decrypted = decrypt(
        { iv: remoteData.iv, data: remoteData.data },
        this.password
      ) as SyncData;

      return decrypted;
    } catch (error: unknown) {
      if (error instanceof Error && (error.message.includes('Not Found') || error.message.includes('No commit found'))) {
        return null;
      }
      throw error;
    }
  }

  async pushChanges(localData: SyncData): Promise<void> {
    if (!this.octokit || !this.config || !this.password) {
      throw new Error('GitHub not configured');
    }

    const branch = await this.ensureBranchExists();

    const encrypted = encrypt(localData, this.password);
    
    const remoteData: RemoteData = {
      ...encrypted,
      version: localData.version + 1,
      lastUpdated: new Date().toISOString()
    };

    const content = toBase64(JSON.stringify(remoteData));

    let sha: string | undefined;
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: DATA_FILE,
        ref: branch
      });
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch {
      // File doesn't exist yet, sha will be undefined (which is fine for new files)
    }

    try {
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: DATA_FILE,
        message: 'sync: Update InterviewIQ data',
        content,
        branch: branch,
        sha
      });
    } catch (error: unknown) {
      console.error('Failed to push changes:', error);
      if (error instanceof Error && error.message.includes('No commit found')) {
        throw new Error(`Branch "${this.config.branch}" has no commits. Please make sure the repository has at least one commit.`);
      }
      throw error;
    }
  }

  async fullSync(localData: SyncData): Promise<SyncData> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub not configured');
    }

    const branchExistsResult = await this.branchExists(this.config.branch);
    if (!branchExistsResult) {
      const defaultBranch = await this.getDefaultBranch();
      throw new Error(`Branch "${this.config.branch}" does not exist. The repository's default branch is "${defaultBranch}". Please update your sync settings to use an existing branch, or create a new branch on GitHub first.`);
    }

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
    const mergedChecklist = this.mergeChecklist(local.checklist, remote.checklist);
    const mergedFlashcards = this.mergeFlashcards(local.flashcards, remote.flashcards);
    const mergedStreak = local.streak.streak >= remote.streak.streak ? local.streak : remote.streak;

    return {
      version: Math.max(local.version, remote.version) + 1,
      companies: mergedCompanies,
      questions: mergedQuestions,
      answers: mergedAnswers,
      interviews: mergedInterviews,
      checklist: mergedChecklist,
      flashcards: mergedFlashcards,
      streak: mergedStreak,
      lastUpdated: new Date().toISOString()
    };
  }

  private mergeChecklist(local: SyncData['checklist'], remote: SyncData['checklist']): SyncData['checklist'] {
    const merged = new Map<number, SyncData['checklist'][0]>();
    const all = [...local, ...remote];

    for (const item of all) {
      const existing = merged.get(item.id);
      if (!existing) {
        merged.set(item.id, item);
      } else if (item.done && !existing.done) {
        merged.set(item.id, item);
      }
    }

    return Array.from(merged.values()).sort((a, b) => a.id - b.id);
  }

  private mergeFlashcards(local: SyncData['flashcards'], remote: SyncData['flashcards']): SyncData['flashcards'] {
    const merged = new Map<number, SyncData['flashcards'][0]>();
    const all = [...local, ...remote];

    for (const card of all) {
      const existing = merged.get(card.id);
      if (!existing) {
        merged.set(card.id, card);
      } else if (card.known && !existing.known) {
        merged.set(card.id, card);
      }
    }

    return Array.from(merged.values()).sort((a, b) => a.id - b.id);
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
