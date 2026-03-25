import { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Button, Card, CardContent, Input, Label, Textarea, Select, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Plus, Pencil, Trash2, MessageCircleQuestion, Search, Star, Sparkles, Bot, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import type { QuestionCategory, Difficulty } from '../../types';

interface AIConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom';
  apiKey: string;
  model: string;
  customEndpoint?: string;
}

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

interface QAItem {
  id: number;
  questionId: number;
  question: string;
  answer: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  tags: string[];
  isFavorite: boolean;
  companyId: number;
  company: string;
}

export function QAView() {
  const { questions, answers, addQuestion, updateQuestion, deleteQuestion, addAnswer, updateAnswer, deleteAnswer, companies } = useAppStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QAItem | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [aiConfig, setAiConfig] = useLocalStorage<AIConfig>('ai-config', {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
  });

  const [settingsForm, setSettingsForm] = useState(aiConfig);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'behavioral' as QuestionCategory,
    difficulty: 'medium' as Difficulty,
    tags: '',
    companyId: 0,
  });

  const qaItems: QAItem[] = useMemo(() => {
    return questions.map(q => {
      const answer = answers.find(a => a.questionId === q.id && a.isBest) || answers.find(a => a.questionId === q.id);
      const company = companies.find(c => c.id === q.companyId);
      return {
        id: q.id!,
        questionId: q.id!,
        question: q.title,
        answer: answer?.content || '',
        category: q.category,
        difficulty: q.difficulty,
        tags: q.tags,
        isFavorite: false,
        companyId: q.companyId,
        company: company?.name || 'Unknown',
      };
    });
  }, [questions, answers, companies]);

  const filteredItems = useMemo(() => {
    return qaItems.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || item.category === filterCategory;
      const matchesDifficulty = !filterDifficulty || item.difficulty === filterDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [qaItems, searchTerm, filterCategory, filterDifficulty]);

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const handleOpenDialog = (item?: QAItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        question: item.question,
        answer: item.answer,
        category: item.category,
        difficulty: item.difficulty,
        tags: item.tags.join(', '),
        companyId: item.companyId,
      });
    } else {
      setEditingItem(null);
      setFormData({
        question: '',
        answer: '',
        category: 'behavioral',
        difficulty: 'medium',
        tags: '',
        companyId: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    
      if (editingItem) {
        await updateQuestion(editingItem.questionId, {
          title: formData.question,
          description: '',
          category: formData.category,
          difficulty: formData.difficulty,
          tags,
          frequency: 0,
          companyId: formData.companyId,
        });
        const existingAnswer = answers.find(a => a.questionId === editingItem.questionId);
        if (existingAnswer) {
          await updateAnswer(existingAnswer.id!, { content: formData.answer });
        } else if (formData.answer.trim()) {
          await addAnswer({ questionId: editingItem.questionId, content: formData.answer, isBest: true });
        }
      } else {
        const newId = await addQuestion({
          title: formData.question,
          description: '',
          category: formData.category,
          difficulty: formData.difficulty,
          tags,
          frequency: 0,
          companyId: formData.companyId,
        });
        if (formData.answer.trim()) {
          await addAnswer({ questionId: newId, content: formData.answer, isBest: true });
        }
      }
    setIsDialogOpen(false);
  };

  const handleDelete = async (item: QAItem) => {
    if (confirm('Delete this Q&A?')) {
      const answerIds = answers.filter(a => a.questionId === item.questionId).map(a => a.id!);
      for (const id of answerIds) {
        await deleteAnswer(id);
      }
      await deleteQuestion(item.questionId);
    }
  };

  const handleToggleBest = async (item: QAItem) => {
    const answer = answers.find(a => a.questionId === item.questionId && a.isBest);
    if (answer) {
      await updateAnswer(answer.id!, { isBest: false });
    }
    const anyAnswer = answers.find(a => a.questionId === item.questionId);
    if (anyAnswer) {
      await updateAnswer(anyAnswer.id!, { isBest: true });
    }
  };

  const generateAnswer = async (item: QAItem) => {
    if (!aiConfig.apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setGeneratingFor(item.questionId);
    setGeneratedAnswer(null);
    setAiError(null);

    const systemPrompt = 'You are an expert interview coach. Write concise, impactful answers to interview questions using the STAR method where appropriate.';
    const userPrompt = `Question: ${item.question}\n\nCompany: ${item.company}\n\nWrite a professional, effective answer to this interview question.`;

    try {
      let response: Response;
      let result: string;

      switch (aiConfig.provider) {
        case 'anthropic': {
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': aiConfig.apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: aiConfig.model || 'claude-3-5-haiku-20241022',
              max_tokens: 500,
              system: systemPrompt,
              messages: [{ role: 'user', content: userPrompt }],
            }),
          });
          const anthropicData = await response.json();
          if (!response.ok) throw new Error(anthropicData.error?.message || 'Failed to generate');
          result = anthropicData.content[0].text;
          break;
        }

        case 'google': {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model || 'gemini-1.5-flash'}:generateContent?key=${aiConfig.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
            }),
          });
          const googleData = await response.json();
          if (!response.ok) throw new Error(googleData.error?.message || 'Failed to generate');
          result = googleData.candidates[0].content.parts[0].text;
          break;
        }

        case 'azure': {
          response = await fetch(aiConfig.customEndpoint || 'https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-02-01', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': aiConfig.apiKey,
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });
          const azureData = await response.json();
          if (!response.ok) throw new Error(azureData.error?.message || 'Failed to generate');
          result = azureData.choices[0].message.content;
          break;
        }

        case 'custom': {
          response = await fetch(aiConfig.customEndpoint || '', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${aiConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: aiConfig.model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });
          const customData = await response.json();
          if (!response.ok) throw new Error(customData.error?.message || 'Failed to generate');
          result = customData.choices?.[0]?.message?.content || customData.content || JSON.stringify(customData);
          break;
        }

        default: { // openai
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${aiConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: aiConfig.model || 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });
          const openaiData = await response.json();
          if (!response.ok) throw new Error(openaiData.error?.message || 'Failed to generate');
          result = openaiData.choices[0].message.content;
        }
      }

      setGeneratedAnswer(result);
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setGeneratingFor(null);
    }
  };

  const applyGeneratedAnswer = async (item: QAItem) => {
    if (!generatedAnswer) return;
    
    const existingAnswer = answers.find(a => a.questionId === item.questionId);
    if (existingAnswer) {
      await updateAnswer(existingAnswer.id!, { content: generatedAnswer, isBest: true });
    } else {
      await addAnswer({ questionId: item.questionId, content: generatedAnswer, isBest: true });
    }
    setGeneratedAnswer(null);
  };

  const handleSaveSettings = () => {
    setAiConfig(settingsForm);
    setIsSettingsOpen(false);
  };

  const hasApiKey = aiConfig.apiKey.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <MessageCircleQuestion className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Q&A</h2>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)} className="border-purple-300 dark:border-purple-700 px-4">
            <Bot className="h-4 w-4 mr-2 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-medium">{hasApiKey ? 'AI On' : 'AI Setup'}</span>
          </Button>
          <Button onClick={() => handleOpenDialog()} size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 border-0 text-white shadow-lg px-4 font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add Q&A
          </Button>
        </div>
      </div>

      <Card className="border-purple-200 dark:border-purple-800 overflow-hidden">
        <CardContent className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
          <Select
            options={[{ label: 'All', value: '' }, ...categories]}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-[160px] h-10 text-sm"
          />
          <Select
            options={[{ label: 'All', value: '' }, ...difficulties]}
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-[130px] h-10 text-sm"
          />
        </CardContent>
      </Card>

      {filteredItems.length === 0 ? (
        <Card className="border-dashed border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6 shadow-xl">
              <MessageCircleQuestion className="h-10 w-10 text-white" />
            </div>
            <p className="text-xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">No Q&A found</p>
            <p className="text-sm text-muted-foreground mt-2">Start by adding your first question</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item, idx) => {
            const isExpanded = expandedIds.has(item.id);
            const colors = [
              { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-500' },
              { from: 'from-violet-500', to: 'to-purple-500', bg: 'bg-violet-500' },
              { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-500' },
              { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500' },
              { from: 'from-amber-500', to: 'to-orange-500', bg: 'bg-amber-500' },
              { from: 'from-fuchsia-500', to: 'to-pink-500', bg: 'bg-fuchsia-500' },
            ];
            const color = colors[idx % colors.length];
            return (
              <Card key={item.id} className="overflow-hidden border-0 shadow-md">
                <div 
                  className={`flex items-start gap-3 p-4 cursor-pointer bg-gradient-to-r ${idx % 2 === 0 ? 'from-gray-50 to-white' : 'from-white to-gray-50'} dark:from-gray-900 dark:to-gray-800 hover:opacity-90 transition-opacity`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center shadow-md shrink-0`}>
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100">{item.question}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className={`${color.bg} text-white text-xs px-2 py-1 shadow-sm`}>
                        {item.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.company}</span>
                      {item.tags.map(tag => (
                        <span key={tag} className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${color.from} ${color.to} text-white shadow-sm`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleBest(item); }}
                    className="p-2 hover:bg-muted rounded-lg shrink-0"
                    title="Mark as best"
                  >
                    <Star className={`h-5 w-5 ${item.answer ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </div>
                
                {isExpanded && (
                  <CardContent className={`p-4 pt-0 border-t border-dashed ${color.bg}/20`}>
                    {item.answer ? (
                      <div className={`mt-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-inner`}>
                        <div className="prose prose-sm dark:prose-invert max-w-none markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground italic">No answer yet</p>
                        {hasApiKey && (
                          <Button 
                            size="sm" 
                            onClick={() => generateAnswer(item)}
                            disabled={generatingFor === item.questionId}
                            className={`mt-3 bg-gradient-to-r ${color.from} ${color.to} border-0 text-white shadow-md`}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {generatingFor === item.questionId ? 'Generating...' : 'Generate with AI'}
                          </Button>
                        )}
                      </div>
                    )}

                    {generatedAnswer && expandedIds.has(item.id) && (
                      <div className={`mt-3 p-4 rounded-lg bg-gradient-to-br ${color.from}/10 to-${color.to.split('-')[2]}/10 dark:from-gray-800 dark:to-gray-900 border border-${color.bg}/30`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">AI Generated</span>
                          <Button size="sm" variant="ghost" onClick={() => setGeneratedAnswer(null)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{generatedAnswer}</p>
                        <Button size="sm" onClick={() => applyGeneratedAnswer(item)} className={`mt-3 bg-gradient-to-r ${color.from} ${color.to} border-0 text-white shadow-md`}>
                          Use This Answer
                        </Button>
                      </div>
                    )}

                    {aiError && expandedIds.has(item.id) && (
                      <p className="mt-3 text-sm text-destructive">{aiError}</p>
                    )}

                    <div className="flex gap-2 mt-3">
                      {item.answer && hasApiKey && (
                        <Button size="sm" variant="outline" onClick={() => generateAnswer(item)} className={`border-${color.bg} text-${color.bg}`}>
                          <Sparkles className="h-4 w-4 mr-2" /> Regenerate
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleOpenDialog(item)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingItem ? 'Edit Q&A' : 'Add Q&A'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm">Company</Label>
                <Select
                  options={companies.map(c => ({ label: c.name, value: String(c.id) }))}
                  value={String(formData.companyId)}
                  onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Category</Label>
                <Select
                  options={categories}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Difficulty</Label>
              <Select
                options={difficulties}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Question</Label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter question..."
                rows={3}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Answer</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter answer..."
                rows={6}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="SQL, Python, System Design"
                className="text-xs h-8"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.question.trim()} size="sm">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Provider</Label>
              <select
                value={settingsForm.provider}
                onChange={(e) => setSettingsForm({ ...settingsForm, provider: e.target.value as AIConfig['provider'], model: '' })}
                className="w-full h-8 px-2 rounded-md border text-xs"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="google">Google Gemini</option>
                <option value="azure">Azure OpenAI</option>
                <option value="custom">Custom / Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">API Key</Label>
              <Input
                type="password"
                value={settingsForm.apiKey}
                onChange={(e) => setSettingsForm({ ...settingsForm, apiKey: e.target.value })}
                placeholder={settingsForm.provider === 'google' ? 'Google API Key' : settingsForm.provider === 'anthropic' ? 'Anthropic API Key' : 'sk-...'}
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Model</Label>
              <Input
                value={settingsForm.model}
                onChange={(e) => setSettingsForm({ ...settingsForm, model: e.target.value })}
                placeholder={settingsForm.provider === 'openai' ? 'gpt-4o-mini' : settingsForm.provider === 'anthropic' ? 'claude-3-5-haiku-20241022' : settingsForm.provider === 'google' ? 'gemini-1.5-flash' : 'model-name'}
                className="text-xs h-8"
              />
            </div>
            {(settingsForm.provider === 'azure' || settingsForm.provider === 'custom') && (
              <div className="space-y-1">
                <Label className="text-xs">Custom Endpoint URL</Label>
                <Input
                  value={settingsForm.customEndpoint || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, customEndpoint: e.target.value })}
                  placeholder={settingsForm.provider === 'azure' ? 'https://xxx.openai.azure.com/...' : 'https://api.example.com/chat'}
                  className="text-xs h-8"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleSaveSettings} size="sm">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
