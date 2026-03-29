import { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea, Select, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui';
import { Plus, Pencil, Trash2, MessageCircleQuestion, Search, Sparkles, Bot } from 'lucide-react';
import type { Question, QuestionCategory, Difficulty } from '../../types';
import { useLocalStorage } from '../../hooks';

const categories: { label: string; value: QuestionCategory }[] = [
  { label: 'Behavioral', value: 'behavioral' },
  { label: 'Technical', value: 'technical' },
  { label: 'System Design', value: 'system-design' },
  { label: 'Coding', value: 'coding' },
  { label: 'Culture Fit', value: 'culture-fit' },
  { label: 'Problem Solving', value: 'problem-solving' },
];

const difficulties: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

interface AIConfig {
  apiKey: string;
  model: string;
  provider: 'openai' | 'groq';
}

export function Questions() {
  const { companies, questions, addQuestion, updateQuestion, deleteQuestion } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterCompany, setFilterCompany] = useState<string>('');
  
  const [aiConfig] = useLocalStorage<AIConfig>('ai-config', { apiKey: '', model: 'llama-3.1-70b-versatile', provider: 'groq' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    companyId: 0,
    title: '',
    description: '',
    category: 'behavioral' as QuestionCategory,
    difficulty: 'medium' as Difficulty,
    tags: '',
    frequency: 0,
  });

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || q.category === filterCategory;
      const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
      const matchesCompany = !filterCompany || q.companyId === parseInt(filterCompany);
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesCompany;
    });
  }, [questions, searchTerm, filterCategory, filterDifficulty, filterCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    const questionData = {
      ...formData,
      tags,
    };

    if (editingQuestion) {
      await updateQuestion(editingQuestion.id!, questionData);
    } else {
      await addQuestion(questionData);
    }
    
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setFormData({
      companyId: companies[0]?.id || 0,
      title: '',
      description: '',
      category: 'behavioral',
      difficulty: 'medium',
      tags: '',
      frequency: 0,
    });
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      companyId: question.companyId,
      title: question.title,
      description: question.description || '',
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags.join(', '),
      frequency: question.frequency,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(id);
    }
  };

  const generateQuestions = async () => {
    if (!aiConfig.apiKey) {
      setAiError('Please configure your OpenAI API key in Answers settings');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const endpoint = aiConfig.provider === 'groq' 
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach. Generate practice interview questions.'
            },
            {
              role: 'user',
              content: `${aiPrompt}\n\nGenerate 5 interview questions, one per line. Format: just the question text, no numbering.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to generate questions');
      }

      const data = await response.json();
      const generated = data.choices[0].message.content
        .split('\n')
        .map((q: string) => q.trim())
        .filter((q: string) => q.length > 0);
      
      setGeneratedQuestions(generated);
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addGeneratedQuestion = async (questionText: string) => {
    await addQuestion({
      companyId: formData.companyId || companies[0]?.id || 0,
      title: questionText,
      description: '',
      category: formData.category,
      difficulty: formData.difficulty,
      tags: [],
      frequency: 0,
    });
    setGeneratedQuestions(prev => prev.filter(q => q !== questionText));
  };

  const getCompanyName = (companyId: number) => {
    return companies.find(c => c.id === companyId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAIDialogOpen(true)} 
            variant="outline"
            disabled={companies.length === 0}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Generate
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} disabled={companies.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-4 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            options={[{ label: 'All Categories', value: '' }, ...categories]}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-[160px]"
          />
          <Select
            options={[{ label: 'All Difficulties', value: '' }, ...difficulties]}
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-[160px]"
          />
          <Select
            options={[{ label: 'All Companies', value: '' }, ...companies.map(c => ({ label: c.name, value: String(c.id) }))]}
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="w-[160px]"
          />
        </CardContent>
      </Card>

      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircleQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No questions found. Add your first question!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {question.category.replace('-', ' ')}
                    </Badge>
                    <Badge className={difficultyColors[question.difficulty]}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {getCompanyName(question.companyId)}
                    </Badge>
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(question)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(question.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {question.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{question.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Edit Question' : 'Add Question'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  options={companies.map(c => ({ label: c.name, value: String(c.id) }))}
                  value={String(formData.companyId)}
                  onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Question title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Question details"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    options={categories}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    options={difficulties}
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="arrays, dynamic programming, trees"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuestion ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Question Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="aiPrompt">What type of questions do you need?</Label>
              <Textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Generate questions about system design for senior backend positions, or behavioral questions about leadership..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aiCategory">Category</Label>
                <Select
                  options={categories}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aiDifficulty">Difficulty</Label>
                <Select
                  options={difficulties}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                />
              </div>
            </div>

            {aiError && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{aiError}</p>
              </div>
            )}

            {generatedQuestions.length > 0 && (
              <div className="space-y-2">
                <Label>Generated Questions</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-md border p-2">
                      <span className="flex-1 text-sm">{q}</span>
                      <Button 
                        size="sm" 
                        onClick={() => addGeneratedQuestion(q)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsAIDialogOpen(false);
              setGeneratedQuestions([]);
              setAiPrompt('');
            }}>
              Close
            </Button>
            <Button onClick={generateQuestions} disabled={isGenerating || !aiPrompt}>
              {isGenerating ? 'Generating...' : 'Generate Questions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
