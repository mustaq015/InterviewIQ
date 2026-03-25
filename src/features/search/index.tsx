import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Input } from '../../components/ui';
import { Search, Building2, MessageCircleQuestion, FileText, Calendar, X, ChevronRight, Bookmark, Tag } from 'lucide-react';
import { useAppStore } from '../../store';
import { useLocalStorage } from '../../hooks';
import type { Note } from '../materials/data';

interface SearchResult {
  type: 'company' | 'question' | 'answer' | 'interview' | 'note';
  id: string | number;
  title: string;
  subtitle?: string;
  content?: string;
  metadata?: string;
  score: number;
  companyId?: number;
  tags?: string[];
}

interface NoteItem extends Note {
  id: string;
}

export function SearchView() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const { companies, questions, answers, interviews } = useAppStore();
  const [notes] = useLocalStorage<NoteItem[]>('materials-notes', []);

  const searchResults = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    
    const q = debouncedQuery.toLowerCase();
    const terms = q.split(/\s+/).filter(t => t.length > 0);
    const results: SearchResult[] = [];

    const score = (text: string | undefined, multiplier = 1) => {
      if (!text) return 0;
      const lt = text.toLowerCase();
      let s = 0;
      if (lt === q) s += 100 * multiplier;
      if (lt.includes(q)) s += 50 * multiplier;
      terms.forEach(t => {
        const words = lt.split(/\s+/);
        if (words.includes(t)) s += 20 * multiplier;
        else if (lt.includes(t)) s += 10 * multiplier;
      });
      return s;
    };

    // Search companies
    companies.forEach(company => {
      const nameScore = score(company.name, 3);
      const descScore = score(company.description, 1);
      const totalScore = nameScore + descScore;
      
      if (totalScore > 0) {
        results.push(        {
          type: 'company',
          id: company.id!,
          title: company.name,
          subtitle: company.description || `${company.name} interview preparation`,
          metadata: company.website || 'Company',
          score: totalScore + nameScore,
        });
      }
    });

    // Search questions
    questions.forEach(question => {
      const titleScore = score(question.title, 3);
      const descScore = score(question.description, 1);
      const tagsScore = score(question.tags?.join(' '), 2);
      const totalScore = titleScore + descScore + tagsScore;
      
      if (totalScore > 0) {
        results.push({
          type: 'question',
          id: question.id!,
          title: question.title,
          subtitle: question.description,
          metadata: `${question.category} • ${question.difficulty}`,
          content: question.description,
          score: totalScore,
          companyId: question.companyId,
          tags: question.tags,
        });
      }
    });

    // Search answers
    answers.forEach(answer => {
      const contentScore = score(answer.content, 2);
      if (contentScore > 0) {
        const question = questions.find(q => q.id === answer.questionId);
        results.push({
          type: 'answer',
          id: answer.id!,
          title: question?.title || `Answer ${answer.id}`,
          subtitle: answer.content.slice(0, 100) + (answer.content.length > 100 ? '...' : ''),
          content: answer.content,
          score: contentScore,
          companyId: question?.companyId,
        });
      }
    });

    // Search interviews
    interviews.forEach(interview => {
      const notesScore = score(interview.notes, 1);
      const totalScore = notesScore;
      
      if (totalScore > 0) {
        const company = companies.find(c => c.id === interview.companyId);
        results.push({
          type: 'interview',
          id: interview.id!,
          title: `${interview.type} Interview${company ? ` at ${company.name}` : ''}`,
          subtitle: interview.notes || interview.outcome,
          metadata: `${interview.status} • ${new Date(interview.date).toLocaleDateString()}`,
          score: totalScore,
          companyId: interview.companyId,
        });
      }
    });

    // Search notes
    notes.forEach(note => {
      const titleScore = score(note.title, 3);
      const contentScore = score(note.content, 1);
      const tagsScore = score(note.tags?.join(' '), 2);
      const totalScore = titleScore + contentScore + tagsScore;
      
      if (totalScore > 0) {
        results.push({
          type: 'note',
          id: note.id,
          title: note.title,
          subtitle: note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
          content: note.content,
          metadata: note.topic,
          score: totalScore,
          tags: note.tags,
        });
      }
    });

    // Sort by score
    return results.sort((a, b) => b.score - a.score);
  }, [debouncedQuery, companies, questions, answers, interviews, notes]);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return searchResults;
    return searchResults.filter(r => r.type === activeFilter);
  }, [searchResults, activeFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'question': return <MessageCircleQuestion className="h-4 w-4" />;
      case 'answer': return <FileText className="h-4 w-4" />;
      case 'interview': return <Calendar className="h-4 w-4" />;
      case 'note': return <Bookmark className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-500';
      case 'question': return 'bg-purple-500';
      case 'answer': return 'bg-green-500';
      case 'interview': return 'bg-orange-500';
      case 'note': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">{part}</mark> : part
    );
  };

  const typeFilters = [
    { id: 'all', label: 'All', count: searchResults.length },
    { id: 'company', label: 'Companies', count: searchResults.filter(r => r.type === 'company').length },
    { id: 'question', label: 'Questions', count: searchResults.filter(r => r.type === 'question').length },
    { id: 'answer', label: 'Answers', count: searchResults.filter(r => r.type === 'answer').length },
    { id: 'interview', label: 'Interviews', count: searchResults.filter(r => r.type === 'interview').length },
    { id: 'note', label: 'Notes', count: searchResults.filter(r => r.type === 'note').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search</h2>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search companies, questions, answers, interviews, notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {query.length >= 2 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {typeFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {query.length < 2 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Start typing to search</p>
            <p className="text-sm text-muted-foreground mt-2">
              Search across companies, questions, answers, interviews, and notes
            </p>
          </CardContent>
        </Card>
      )}

      {query.length >= 2 && filteredResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No results found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try different keywords or clear filters
            </p>
          </CardContent>
        </Card>
      )}

      {filteredResults.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </p>
          
          {filteredResults.map((result) => (
            <Card key={`${result.type}-${result.id}`} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(result.type)} text-white`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(result.type)} text-white`}>
                        {result.type}
                      </span>
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {result.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg truncate">
                      {highlightMatch(result.title, query)}
                    </h3>
                    {result.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {highlightMatch(result.subtitle, query)}
                      </p>
                    )}
                    {result.metadata && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.metadata}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}
