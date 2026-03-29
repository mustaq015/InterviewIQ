import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Button, Input } from '../../components/ui';
import { CheckCircle, Circle, Search, BarChart, Plus, Edit2, Trash2, Save, Code, Copy, Check, X, ChevronLeft, Star, Bot, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import Editor from '@monaco-editor/react';

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

  const closeCodeEditor = () => {
    saveCode();
    setExpandedProblemId(null);
    setAiReview(null);
    setAiReviewError(null);
  };

  const getAiReview = async () => {
    if (!currentCode.trim()) {
      setAiReviewError('Please write some code first');
      return;
    }

    setAiReviewLoading(true);
    setAiReviewError(null);
    setAiReview(null);

    try {
      const problem = problems[selectedTopicId!]?.find(p => p.id === expandedProblemId);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert code reviewer. Review the code and provide constructive feedback.'
            },
            {
              role: 'user',
              content: `Problem: ${problem?.name || 'Unknown'}\n\nLanguage: ${currentLang}\n\nCode:\n\`\`\`${currentLang}\n${currentCode}\n\`\`\`\n\nPlease review this code and provide:\n1. Code quality feedback\n2. Potential bugs or issues\n3. Suggestions for improvement\n4. Time complexity analysis if applicable`
            }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to get review');
      }

      const data = await response.json();
      setAiReview(data.choices[0].message.content);
    } catch (err) {
      setAiReviewError((err as Error).message);
    } finally {
      setAiReviewLoading(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coding Practice</h2>
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
                                className="h-8 px-2 rounded border border-input bg-background text-sm"
                              >
                                {languages.map(l => (
                                  <option key={l.value} value={l.value}>{l.label}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(currentCode);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                              >
                                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copied ? 'Copied!' : 'Copy'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsDarkMode(!isDarkMode)}
                              >
                                {isDarkMode ? 'Light' : 'Dark'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={closeCodeEditor}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Close
                              </Button>
                              <Button size="sm" onClick={() => { saveCode(); }}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={getAiReview}
                                disabled={aiReviewLoading}
                              >
                                {aiReviewLoading ? (
                                  <>
                                    <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                                    Reviewing...
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-3 w-3 mr-1" />
                                    AI Review
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <Editor
                            height="300px"
                            language={currentLang}
                            value={currentCode}
                            onChange={(v) => setCurrentCode(v || '')}
                            theme={isDarkMode ? 'vs-dark' : 'light'}
                            options={{
                              fontSize: 13,
                              minimap: { enabled: false },
                              wordWrap: 'on',
                              padding: { top: 8 }
                            }}
                          />
                          {(aiReview || aiReviewError) && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">AI Code Review</span>
                              </div>
                              {aiReviewError && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                  {aiReviewError}
                                </div>
                              )}
                              {aiReview && (
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
                                    {aiReview}
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
