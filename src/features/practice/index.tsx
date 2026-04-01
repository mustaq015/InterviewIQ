import { useState, useMemo, lazy, Suspense, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Button, Input } from '../../components/ui';
import { CheckCircle, Circle, Search, BarChart, Plus, Edit2, Trash2, Save, Code, Copy, Check, X, ChevronLeft, Star, Bot, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Editor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })));

const EditorSkeleton = () => (
  <div className="h-[350px] rounded-xl border flex items-center justify-center bg-muted/20">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  </div>
);

interface Problem {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
  expectedTime?: number;
  tags?: string[];
  isFavorite?: boolean;
}

interface Topic {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

interface ProblemCode {
  code: string;
  language: string;
  lastModified: Date;
}

const topicColorOptions = [
  { value: 'bg-red-500' },
  { value: 'bg-orange-500' },
  { value: 'bg-yellow-500' },
  { value: 'bg-green-500' },
  { value: 'bg-teal-500' },
  { value: 'bg-blue-500' },
  { value: 'bg-indigo-500' },
  { value: 'bg-purple-500' },
  { value: 'bg-pink-500' },
  { value: 'bg-gray-500' },
];

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'pyspark', label: 'PySpark' },
  { value: 'sql', label: 'SQL' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'scala', label: 'Scala' },
  { value: 'markdown', label: 'Markdown' },
];

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

export function Practice() {
  const [topics, setTopics] = useLocalStorage<Topic[]>('practice-topics', []);
  const [problems, setProblems] = useLocalStorage<Record<string, Problem[]>>('practice-problems', {});
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>('practice-progress', {});
  const [codes, setCodes] = useLocalStorage<Record<string, ProblemCode>>('practice-codes', {});

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showSolved, setShowSolved] = useState(true);

  const [topicForm, setTopicForm] = useState({ name: '', color: 'bg-blue-500' });
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const [problemForm, setProblemForm] = useState<{ name: string; difficulty: 'easy' | 'medium' | 'hard'; description: string; expectedTime: number; tags: string }>({ name: '', difficulty: 'medium', description: '', expectedTime: 30, tags: '' });
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLang, setCurrentLang] = useState('python');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiExplaining, setAiExplaining] = useState(false);
  const [queryExplanation, setQueryExplanation] = useState<string | null>(null);
  const [queryExplanationError, setQueryExplanationError] = useState<string | null>(null);
  const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
  const [lineAnnotations, setLineAnnotations] = useState<Array<{
    line: number;
    type: 'correct' | 'incorrect' | 'suggestion';
    message: string;
  }>>([]);
  const editorRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);

  const getCodeKey = (topicId: string, problemId: string) => `${topicId}:${problemId}`;

  const stats = useMemo(() => {
    let total = 0, solved = 0;
    Object.values(problems).forEach(topicProblems => {
      topicProblems.forEach(p => {
        total++;
        if (progress[getCodeKey(p.id, p.id)]) solved++;
      });
    });
    return { total, solved };
  }, [problems, progress]);

  const getTopicStats = (topicId: string) => {
    const topicProblems = problems[topicId] || [];
    const solved = topicProblems.filter(p => progress[getCodeKey(p.id, p.id)]).length;
    return { total: topicProblems.length, solved };
  };

  const openTopicForm = (topic?: Topic) => {
    if (topic) {
      setEditingTopic(topic);
      setIsCreatingTopic(false);
      setTopicForm({ name: topic.name, color: topic.color });
    } else {
      setEditingTopic(null);
      setIsCreatingTopic(true);
      setTopicForm({ name: '', color: 'bg-blue-500' });
    }
  };

  const closeTopicForm = () => {
    setEditingTopic(null);
    setIsCreatingTopic(false);
    setTopicForm({ name: '', color: 'bg-blue-500' });
  };

  const saveTopic = () => {
    if (!topicForm.name.trim()) return;
    if (editingTopic) {
      setTopics(topics.map(t => t.id === editingTopic.id ? { ...t, ...topicForm } : t));
    } else {
      setTopics([...topics, { id: `topic-${Date.now()}`, ...topicForm, createdAt: new Date() }]);
    }
    closeTopicForm();
  };

  const deleteTopic = (id: string) => {
    if (!confirm('Delete this topic and all its problems?')) return;
    setTopics(topics.filter(t => t.id !== id));
    const newProblems = { ...problems };
    delete newProblems[id];
    setProblems(newProblems);
    if (selectedTopicId === id) setSelectedTopicId(null);
  };

  const openProblemForm = (problem?: Problem) => {
    if (problem) {
      setEditingProblem(problem);
      setIsCreatingProblem(false);
      setProblemForm({
        name: problem.name,
        difficulty: problem.difficulty,
        description: problem.description || '',
        expectedTime: problem.expectedTime || 30,
        tags: problem.tags?.join(', ') || '',
      });
    } else {
      setEditingProblem(null);
      setIsCreatingProblem(true);
      setProblemForm({ name: '', difficulty: 'medium', description: '', expectedTime: 30, tags: '' });
    }
  };

  const closeProblemForm = () => {
    setEditingProblem(null);
    setIsCreatingProblem(false);
    setProblemForm({ name: '', difficulty: 'medium', description: '', expectedTime: 30, tags: '' });
  };

  const saveProblem = () => {
    if (!problemForm.name.trim() || !selectedTopicId) return;
    const tags = problemForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editingProblem) {
      setProblems(prev => ({
        ...prev,
        [selectedTopicId]: prev[selectedTopicId].map(p =>
          p.id === editingProblem.id
            ? { ...p, name: problemForm.name, difficulty: problemForm.difficulty, description: problemForm.description, expectedTime: problemForm.expectedTime, tags }
            : p
        ),
      }));
    } else {
      const newProblem: Problem = {
        id: `problem-${Date.now()}`,
        name: problemForm.name,
        difficulty: problemForm.difficulty,
        description: problemForm.description,
        expectedTime: problemForm.expectedTime,
        tags,
      };
      setProblems(prev => ({
        ...prev,
        [selectedTopicId]: [...(prev[selectedTopicId] || []), newProblem],
      }));
    }
    closeProblemForm();
  };

  const deleteProblem = (id: string) => {
    if (!confirm('Delete this problem?')) return;
    setProblems(prev => ({
      ...prev,
      [selectedTopicId!]: prev[selectedTopicId!].filter(p => p.id !== id),
    }));
    closeProblemForm();
  };

  const toggleSolved = (topicId: string, problemId: string) => {
    const key = getCodeKey(topicId, problemId);
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFavorite = (topicId: string, problemId: string) => {
    setProblems(prev => ({
      ...prev,
      [topicId]: prev[topicId].map(p =>
        p.id === problemId ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    }));
  };

  const openCodeEditor = (topicId: string, problemId: string) => {
    const key = getCodeKey(topicId, problemId);
    setCurrentCode(codes[key]?.code || '');
    setCurrentLang(codes[key]?.language || 'python');
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  const saveCode = () => {
    if (!selectedTopicId || !expandedProblemId) return;
    const key = getCodeKey(selectedTopicId, expandedProblemId);
    setCodes(prev => ({
      ...prev,
      [key]: { code: currentCode, language: currentLang, lastModified: new Date() },
    }));
  };



  const getAiReview = async () => {
    if (!currentCode.trim()) {
      setAiReviewError('Please write some code first');
      return;
    }

    setAiReviewLoading(true);
    setAiReviewError(null);
    setAiReview(null);
    setOptimizedCode(null);
    setLineAnnotations([]);

    try {
      const problem = problems[selectedTopicId!]?.find(p => p.id === expandedProblemId);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert code reviewer. Analyze the code and provide structured feedback. 

IMPORTANT: For your response, you MUST use this exact format:
<ANNOTATIONS>
[LINE_NUMBER]|correct|Correct description here
[LINE_NUMBER]|incorrect|Why it's incorrect|Suggestion for fix
[LINE_NUMBER]|suggestion|General improvement suggestion
</ANNOTATIONS>
<OPTIMIZED_CODE>
\`\`\`${currentLang}
[Your optimized/rewritten code here]
\`\`\`
</OPTIMIZED_CODE>
<REVIEW>
[Your detailed markdown review here - bugs, improvements, complexity analysis]
</REVIEW>`
            },
            {
              role: 'user',
              content: `Problem: ${problem?.name || 'Unknown'}\nDescription: ${problem?.description || 'N/A'}\n\nLanguage: ${currentLang}\n\nCode:\n\`\`\`${currentLang}\n${currentCode}\n\`\`\`\n\nAnalyze each line of code and provide:\n1. Line-by-line annotations marking correct (green), incorrect (red), or suggestions (yellow)\n2. An optimized version of the code\n3. A detailed review with feedback`
            }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to get review');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const annotationsMatch = content.match(/<ANNOTATIONS>([\s\S]*?)<\/ANNOTATIONS>/);
      const optimizedMatch = content.match(/<OPTIMIZED_CODE>[\s\S]*?```[\w]*\n?([\s\S]*?)```[\s]*<\/OPTIMIZED_CODE>/);
      const reviewMatch = content.match(/<REVIEW>([\s\S]*?)<\/REVIEW>/);
      
      if (annotationsMatch) {
        const annotations: Array<{line: number; type: 'correct' | 'incorrect' | 'suggestion'; message: string}> = [];
        const lines = annotationsMatch[1].trim().split('\n');
        lines.forEach(line => {
          const parts = line.split('|');
          if (parts.length >= 2) {
            const lineNum = parseInt(parts[0].trim());
            if (!isNaN(lineNum)) {
              annotations.push({
                line: lineNum,
                type: parts[1].trim() as 'correct' | 'incorrect' | 'suggestion',
                message: parts.slice(2).join(' | ').trim()
              });
            }
          }
        });
        setLineAnnotations(annotations);
      }
      
      if (optimizedMatch) {
        setOptimizedCode(optimizedMatch[1].trim());
      }
      
      if (reviewMatch) {
        setAiReview(reviewMatch[1].trim());
      } else {
        setAiReview(content);
      }
      
      applyDecorations();
    } catch (err) {
      setAiReviewError((err as Error).message);
    } finally {
      setAiReviewLoading(false);
    }
  };

  const parseInt = (str: string) => {
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  };

  const applyDecorations = useCallback(() => {
    if (!editorRef.current || lineAnnotations.length === 0) return;
    
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const decorations = lineAnnotations.map(ann => {
      const lineNumber = ann.line;
      const lineContent = model.getLineContent(lineNumber);
      const startColumn = 1;
      const endColumn = lineContent.length + 1;
      
      const isDark = isDarkMode;
      let className = '';
      let glyphClassName = '';
      
      if (ann.type === 'correct') {
        className = isDark ? 'correct-line-dark' : 'correct-line-light';
        glyphClassName = isDark ? 'correct-glyph-dark' : 'correct-glyph-light';
      } else if (ann.type === 'incorrect') {
        className = isDark ? 'incorrect-line-dark' : 'incorrect-line-light';
        glyphClassName = isDark ? 'incorrect-glyph-dark' : 'incorrect-glyph-light';
      } else {
        className = isDark ? 'suggestion-line-dark' : 'suggestion-line-light';
        glyphClassName = isDark ? 'suggestion-glyph-dark' : 'suggestion-glyph-light';
      }
      
      return {
        range: {
          startLineNumber: lineNumber,
          startColumn,
          endLineNumber: lineNumber,
          endColumn
        },
        options: {
          isWholeLine: true,
          className: className,
          glyphMarginClassName: glyphClassName,
          glyphMarginHoverMessage: { value: `**${ann.type.toUpperCase()}**: ${ann.message}` },
          hoverMessage: { value: `**${ann.type.toUpperCase()}**: ${ann.message}` },
          overviewRuler: {
            color: ann.type === 'correct' ? '#22c55e' : ann.type === 'incorrect' ? '#ef4444' : '#f59e0b',
            position: 2
          }
        }
      };
    });

    editor.deltaDecorations([], decorations);
  }, [lineAnnotations, isDarkMode]);

  const generateCode = async () => {
    const problem = problems[selectedTopicId!]?.find(p => p.id === expandedProblemId);
    if (!problem) return;

    setAiGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert programmer. Generate clean, working code based on the problem description. Only output the code, no explanations.'
            },
            {
              role: 'user',
              content: `Problem Name: ${problem.name}
Description: ${problem.description || 'Solve this problem'}
Difficulty: ${problem.difficulty}
Expected Time: ${problem.expectedTime || 30} minutes
Tags: ${problem.tags?.join(', ') || 'None'}

Language: ${currentLang}

Generate code to solve this problem. Only output the code block with the solution.`
            }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to generate code');
      }

      const data = await response.json();
      const generatedCode = data.choices[0].message.content;
      
      const codeMatch = generatedCode.match(/```(?:\w+)?\n?([\s\S]*?)```/);
      const cleanCode = codeMatch ? codeMatch[1].trim() : generatedCode;
      
      setCurrentCode(cleanCode);
    } catch (err) {
      setAiReviewError((err as Error).message);
    } finally {
      setAiGenerating(false);
    }
  };

  const explainQuery = async () => {
    if (!currentCode.trim()) {
      setQueryExplanationError('Please write a query first');
      return;
    }

    setAiExplaining(true);
    setQueryExplanationError(null);
    setQueryExplanation(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert in SQL and data analysis. Explain queries clearly and concisely.'
            },
            {
              role: 'user',
              content: `Language: ${currentLang}

Query to explain:
\`\`\`${currentLang}
${currentCode}
\`\`\`

Please explain this query in a clear, structured way covering:
1. What the query does (brief summary)
2. Step-by-step breakdown of each part
3. Key functions/clauses used
4. Expected output or result`
            }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to explain query');
      }

      const data = await response.json();
      setQueryExplanation(data.choices[0].message.content);
    } catch (err) {
      setQueryExplanationError((err as Error).message);
    } finally {
      setAiExplaining(false);
    }
  };

  const filteredProblems = useMemo(() => {
    if (!selectedTopicId) return [];
    let list = problems[selectedTopicId] || [];
    if (searchTerm) list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterDifficulty !== 'all') list = list.filter(p => p.difficulty === filterDifficulty);
    if (!showSolved) list = list.filter(p => !progress[getCodeKey(selectedTopicId, p.id)]);
    return list.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [selectedTopicId, problems, searchTerm, filterDifficulty, showSolved, progress]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Coding Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">{stats.solved} of {stats.total} solved</p>
        </div>
        {!selectedTopicId && (
          <Button onClick={() => openTopicForm()}>
            <Plus className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        )}
      </div>

      {(editingTopic || isCreatingTopic) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{isCreatingTopic ? 'New Topic' : 'Edit Topic'}</CardTitle>
              <button onClick={closeTopicForm} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Topic Name</label>
                <Input
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  placeholder="e.g., SQL Queries"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-1">
                  {topicColorOptions.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setTopicForm({ ...topicForm, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${topicForm.color === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeTopicForm}>Cancel</Button>
              <Button onClick={saveTopic} disabled={!topicForm.name.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {isCreatingTopic ? 'Create' : 'Update'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(editingProblem || isCreatingProblem) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{isCreatingProblem ? 'New Problem' : 'Edit Problem'}</CardTitle>
              <button onClick={closeProblemForm} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Problem Name *</label>
                <Input
                  value={problemForm.name}
                  onChange={(e) => setProblemForm({ ...problemForm, name: e.target.value })}
                  placeholder="e.g., Find Duplicate Employees"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <select
                  value={problemForm.difficulty}
                  onChange={(e) => setProblemForm({ ...problemForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={problemForm.description}
                onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                placeholder="What does this problem ask for..."
                className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Expected Time (min)</label>
                <Input
                  type="number"
                  value={problemForm.expectedTime}
                  onChange={(e) => setProblemForm({ ...problemForm, expectedTime: parseInt(e.target.value) || 30 })}
                  min={5}
                  max={180}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                <Input
                  value={problemForm.tags}
                  onChange={(e) => setProblemForm({ ...problemForm, tags: e.target.value })}
                  placeholder="e.g., JOIN, Window Functions"
                />
              </div>
            </div>
            <div className="flex justify-between">
              {editingProblem && (
                <Button variant="destructive" onClick={() => deleteProblem(editingProblem.id)}>Delete</Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={closeProblemForm}>Cancel</Button>
                <Button onClick={saveProblem} disabled={!problemForm.name.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {isCreatingProblem ? 'Create' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedTopicId && !editingTopic && (
        topics.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <BarChart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Topics Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first topic to start practicing</p>
            <Button onClick={() => openTopicForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Topic
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {topics.map(topic => {
              const topicStats = getTopicStats(topic.id);
              return (
                <Card
                  key={topic.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTopicId === topic.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-3 h-3 rounded-full ${topic.color}`} />
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openTopicForm(topic); }}
                          className="p-1 hover:bg-muted rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
                          className="p-1 hover:bg-destructive hover:text-white rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 truncate">{topic.name}</h3>
                    <p className="text-sm text-muted-foreground">{topicStats.solved}/{topicStats.total} solved</p>
                    {topicStats.total > 0 && (
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${topic.color.replace('bg-', 'bg-')}`}
                          style={{ width: `${(topicStats.solved / topicStats.total) * 100}%` }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )
      )}

      {selectedTopicId && !editingProblem && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedTopicId(null)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <CardTitle>{topics.find(t => t.id === selectedTopicId)?.name}</CardTitle>
              </div>
              <Button size="sm" onClick={() => openProblemForm()}>
                <Plus className="h-4 w-4 mr-1" />
                Add Problem
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSolved}
                  onChange={(e) => setShowSolved(e.target.checked)}
                  className="h-4 w-4"
                />
                Show Solved
              </label>
            </div>

            <div className="space-y-2">
              {filteredProblems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No problems found
                </div>
              ) : (
                filteredProblems.map(problem => {
                  const key = getCodeKey(selectedTopicId, problem.id);
                  const isSolved = progress[key];
                  const hasCode = codes[key];
                  const isExpanded = expandedProblemId === problem.id;
                  return (
                    <div
                      key={problem.id}
                      className={`rounded-lg border ${isSolved ? 'bg-green-500/5 border-green-500/30' : 'border-border'}`}
                    >
                      <div className="flex items-start justify-between p-4">
                        <div className="flex items-start gap-3 flex-1">
                          <button onClick={() => toggleSolved(selectedTopicId, problem.id)} className="mt-0.5">
                            {isSolved ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                          </button>
                          <div className="flex-1">
                            <div className={`font-medium ${isSolved ? 'line-through text-muted-foreground' : ''}`}>{problem.name}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[problem.difficulty]} text-white`}>
                                {problem.difficulty}
                              </span>
                              {problem.tags?.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted">{tag}</span>
                              ))}
                              {hasCode && (
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-600">Code saved</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(selectedTopicId, problem.id)}
                            className="p-2 hover:bg-muted rounded"
                            title="Favorite"
                          >
                            <Star className={`h-4 w-4 ${problem.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => openCodeEditor(selectedTopicId, problem.id)}
                            className={`p-2 rounded ${isExpanded ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            title="Write Code"
                          >
                            <Code className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openProblemForm(problem)}
                            className="p-2 hover:bg-muted rounded"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (!confirm('Delete this problem?')) return;
                              setProblems(prev => ({
                                ...prev,
                                [selectedTopicId!]: prev[selectedTopicId!].filter(p => p.id !== problem.id),
                              }));
                            }}
                            className="p-2 hover:bg-destructive hover:text-white rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t p-4 bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <select
                                  value={currentLang}
                                  onChange={(e) => setCurrentLang(e.target.value)}
                                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  {languages.map(l => (
                                    <option key={l.value} value={l.value}>{l.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(currentCode);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsDarkMode(!isDarkMode)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isDarkMode ? (
                                    <span className="text-sm">Light</span>
                                  ) : (
                                    <span className="text-sm">Dark</span>
                                  )}
                                </Button>
                                <div className="h-4 w-px bg-border mx-1" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => { saveCode(); }}
                                  className="gap-1.5"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={generateCode}
                                  disabled={aiGenerating}
                                  className="gap-1.5"
                                >
                                  {aiGenerating ? (
                                    <>
                                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-3.5 w-3.5" />
                                      Generate
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={getAiReview}
                                  disabled={aiReviewLoading}
                                  className="gap-1.5"
                                >
                                  {aiReviewLoading ? (
                                    <>
                                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                                      Reviewing...
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="h-3.5 w-3.5" />
                                      Review
                                    </>
                                  )}
                                </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={explainQuery}
                                disabled={aiExplaining}
                                className="gap-1.5"
                              >
                                {aiExplaining ? (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                                    Explaining...
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-3.5 w-3.5" />
                                    Explain
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-zinc-700' : 'border-border'}`}>
                            <Suspense fallback={<EditorSkeleton />}>
                            <Editor
                              height="350px"
                              language={currentLang}
                              value={currentCode}
                              onChange={(v) => setCurrentCode(v || '')}
                              theme={isDarkMode ? 'vs-dark' : 'vs'}
                              options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                fontLigatures: true,
                                minimap: { enabled: false },
                                wordWrap: 'on',
                                padding: { top: 16, bottom: 16 },
                                links: false,
                                folding: true,
                                glyphMargin: true,
                                lineDecorationsWidth: 8,
                                lineNumbersMinChars: 3,
                                renderLineHighlight: 'all',
                                occurrencesHighlight: 'singleFile',
                                selectionHighlight: false,
                                matchBrackets: 'always',
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                                contextmenu: true,
                                bracketPairColorization: { enabled: true },
                                formatOnPaste: true,
                                formatOnType: true,
                                renderWhitespace: 'none',
                                codeLens: false,
                                contextmenu: true,
                                scrollBeyondLastLine: false,
                              }}
                              onMount={(editor) => {
                                editor.updateOptions({
                                  links: false,
                                  glyphMargin: true,
                                });
                                editorRef.current = editor;
                                try {
                                  editor.getAction('editor.action.openLink')?.disable();
                                } catch {
  // Disable link action
}
                              }}
                            />
                            </Suspense>
                          </div>
                          
                          {lineAnnotations.length > 0 && (
                            <div className="mt-4 p-4 rounded-xl border bg-card">
                              <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold text-sm text-foreground">Inline Review</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  Hover over highlighted lines for details
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500"></div>
                                  <span className="text-muted-foreground">Correct</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></div>
                                  <span className="text-muted-foreground">Needs Improvement</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500"></div>
                                  <span className="text-muted-foreground">Suggestion</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {optimizedCode && (
                            <div className="mt-4 p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-4 w-4 text-green-500" />
                                <span className="font-semibold text-sm text-foreground">Optimized Code</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="ml-auto gap-1.5 text-xs"
                                  onClick={() => setCurrentCode(optimizedCode)}
                                >
                                  <Code className="h-3 w-3" />
                                  Use This Code
                                </Button>
                              </div>
                              <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto max-h-64">
                                <code>{optimizedCode}</code>
                              </pre>
                            </div>
                          )}
                          
                          {(aiReview || aiReviewError) && (
                            <div className="mt-4 border-t pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-full bg-primary/10">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-semibold text-sm text-foreground">Detailed Review</span>
                              </div>
                              {aiReviewError && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                  {aiReviewError}
                                </div>
                              )}
                              {aiReview && (
                                <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                                  <div className="p-4 text-sm text-foreground/90 leading-relaxed [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-2 [&_p]:first:mt-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {aiReview}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {(queryExplanation || queryExplanationError) && (
                            <div className="mt-4 border-t pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-full bg-blue-500/10">
                                  <Bot className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="font-semibold text-sm text-foreground">Query Explanation</span>
                              </div>
                              {queryExplanationError && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                  {queryExplanationError}
                                </div>
                              )}
                              {queryExplanation && (
                                <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                                  <div className="p-4 text-sm text-foreground/90 leading-relaxed [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-2 [&_p]:first:mt-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-zinc-900 [&_pre]:text-zinc-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-blue-500 [&_a]:underline [&_strong]:font-semibold [&_table]:w-full [&_table]:text-xs [&_thead]:bg-muted [&_th]:p-2 [&_th]:text-left [&_td]:p-2 [&_td]:border-t [&_tr]:border-b">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {queryExplanation}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
