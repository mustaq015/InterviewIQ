import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Button, Input } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { problemsData, topicNames, topicColors, type TopicKey, type Difficulty } from './data';
import { CheckCircle, Circle, Search, BarChart, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { useLocalStorage } from '../../hooks';

interface ProblemProgress {
  [key: string]: boolean;
}

interface CustomProblem {
  id: string;
  name: string;
  difficulty: Difficulty;
  topic: TopicKey;
}

export function Practice() {
  const [progress, setProgress] = useLocalStorage<ProblemProgress>('problem-progress', {});
  const [customProblems, setCustomProblems] = useLocalStorage<CustomProblem[]>('custom-problems', []);
  const [selectedTopic, setSelectedTopic] = useState<TopicKey | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSolved, setShowSolved] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<CustomProblem | null>(null);
  const [formData, setFormData] = useState({ name: '', difficulty: 'medium' as Difficulty });

  const topics = Object.keys(problemsData) as TopicKey[];

  const getProgressKey = (topic: TopicKey, name: string) => `${topic}:${name}`;

  const toggleSolved = (topic: TopicKey, name: string) => {
    const key = getProgressKey(topic, name);
    setProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getAllProblemsForTopic = (topic: TopicKey) => {
    const predefined = problemsData[topic];
    const custom = customProblems.filter(p => p.topic === topic);
    return [...predefined, ...custom.map(p => ({ name: p.name, difficulty: p.difficulty }))];
  };

  const getTopicStats = (topic: TopicKey) => {
    const problems = getAllProblemsForTopic(topic);
    const solved = problems.filter(p => progress[getProgressKey(topic, p.name)]).length;
    return { total: problems.length, solved };
  };

  const getOverallStats = useMemo(() => {
    let total = 0;
    let solved = 0;
    topics.forEach(topic => {
      const stats = getTopicStats(topic);
      total += stats.total;
      solved += stats.solved;
    });
    return { total, solved };
  }, [progress, topics, customProblems, getTopicStats]);

  const filteredProblems = useMemo(() => {
    if (!selectedTopic) return [];
    
    let problems = getAllProblemsForTopic(selectedTopic).map((p, idx) => ({
      ...p,
      idx,
      isCustom: idx >= problemsData[selectedTopic].length
    }));
    
    if (filterDifficulty !== 'all') {
      problems = problems.filter(p => p.difficulty === filterDifficulty);
    }
    
    if (searchTerm) {
      problems = problems.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (!showSolved) {
      problems = problems.filter(p => !progress[getProgressKey(selectedTopic, p.name)]);
    }
    
    return problems;
  }, [selectedTopic, filterDifficulty, searchTerm, progress, showSolved, customProblems, getAllProblemsForTopic]);

  const handleOpenAddForm = () => {
    setFormData({ name: '', difficulty: 'medium' });
    setEditingProblem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (problem: CustomProblem) => {
    setFormData({ name: problem.name, difficulty: problem.difficulty });
    setEditingProblem(problem);
    setIsFormOpen(true);
  };

  const handleSaveProblem = () => {
    if (!formData.name.trim() || !selectedTopic) return;
    
    if (editingProblem) {
      setCustomProblems(prev => prev.map(p => 
        p.id === editingProblem.id 
          ? { ...p, name: formData.name, difficulty: formData.difficulty }
          : p
      ));
    } else {
      const newProblem: CustomProblem = {
        id: `custom-${Date.now()}`,
        name: formData.name,
        difficulty: formData.difficulty,
        topic: selectedTopic
      };
      setCustomProblems(prev => [...prev, newProblem]);
    }
    
    setIsFormOpen(false);
    setEditingProblem(null);
    setFormData({ name: '', difficulty: 'medium' });
  };

  const handleDeleteProblem = (id: string) => {
    if (!confirm('Delete this problem?')) return;
    setCustomProblems(prev => prev.filter(p => p.id !== id));
  };

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500', 
    hard: 'bg-red-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Coding Practice</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart className="h-4 w-4" />
          <span>{getOverallStats.solved} / {getOverallStats.total} solved</span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Select a Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {topics.map(topic => {
              const stats = getTopicStats(topic);
              const color = topicColors[topic];
              return (
                <button
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setFilterDifficulty('all');
                    setSearchTerm('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTopic === topic 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${color} mb-2`} />
                  <div className="text-sm font-medium">{topicNames[topic]}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.solved}/{stats.total}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedTopic && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{topicNames[selectedTopic]}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTopic(null)}
              >
                Close
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
                <option value="all">All Difficulties</option>
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
                Show solved
              </label>
              
              <Button variant="default" size="sm" onClick={handleOpenAddForm}>
                <Plus className="h-4 w-4 mr-1" />
                Add Problem
              </Button>
            </div>

            <div className="space-y-2">
              {filteredProblems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No problems match your filters.
                </div>
              ) : (
                filteredProblems.map((problem, idx) => {
                  const isSolved = progress[getProgressKey(selectedTopic, problem.name)];
                  const customProblem = 'isCustom' in problem ? customProblems.find(p => p.name === problem.name && p.topic === selectedTopic) : null;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isSolved ? 'bg-green-500/5 border-green-500/30' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSolved(selectedTopic, problem.name)}
                          className="flex items-center gap-2"
                        >
                          {isSolved ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <span className={isSolved ? 'line-through text-muted-foreground' : ''}>
                          {problem.name}
                        </span>
                        {'isCustom' in problem && problem.isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-600">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {'isCustom' in problem && problem.isCustom && customProblem && (
                          <>
                            <button
                              onClick={() => handleOpenEditForm(customProblem)}
                              className="p-1 hover:bg-secondary rounded"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProblem(customProblem.id)}
                              className="p-1 hover:bg-secondary rounded text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${difficultyColors[problem.difficulty as Difficulty]} text-white`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map(topic => {
              const stats = getTopicStats(topic);
              const percentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{topicNames[topic]}</span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${topicColors[topic]} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProblem ? 'Edit Problem' : 'Add Custom Problem'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Two Sum, Reverse Linked List"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Topic: {topicNames[selectedTopic!]}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProblem} disabled={!formData.name.trim()}>
              <Save className="h-4 w-4 mr-1" />
              {editingProblem ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
