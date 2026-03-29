import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';
import { Button } from '../../components/ui';
import { Input, Textarea } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  dataEngineeringTopics, 
  allTopics, 
  type DataEngineeringTopic, 
  type InterviewQuestion 
} from './data';
import { 
  Database, 
  Code, 
  Flame, 
  Zap, 
  Wind, 
  Cloud, 
  Server, 
  RefreshCw, 
  GitBranch,
  Layers,
  Table,
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle,
  Circle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Terminal,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  BookOpen,
  User,
  Timer,
  Play,
  Square,
  Trophy,
  Target,
  Bot,
  Sparkles
} from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import type { Difficulty } from '../../types';

interface CustomQuestion extends Omit<InterviewQuestion, 'difficulty'> {
  difficulty: Difficulty;
  isCustom?: boolean;
}

interface SavedQuestion {
  topicId: string;
  questionId: string;
}

interface QuestionTimeData {
  best: number;
  last: number;
  attempts: number;
  expectedTime: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'database': <Database className="h-5 w-5" />,
  'code': <Code className="h-5 w-5" />,
  'table': <Table className="h-5 w-5" />,
  'flame': <Flame className="h-5 w-5" />,
  'zap': <Zap className="h-5 w-5" />,
  'wind': <Wind className="h-5 w-5" />,
  'cloud': <Cloud className="h-5 w-5" />,
  'server': <Server className="h-5 w-5" />,
  'refresh-cw': <RefreshCw className="h-5 w-5" />,
  'git-branch': <GitBranch className="h-5 w-5" />,
  'layers': <Layers className="h-5 w-5" />,
  'terminal': <Terminal className="h-5 w-5" />,
  'user': <User className="h-5 w-5" />,
};

interface QuestionFormData {
  question: string;
  answer: string;
  tips: string;
  difficulty: Difficulty;
  company: string;
  expectedTime: number;
}

interface TopicFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  originalId?: string;
  isPredefined?: boolean;
}

interface ExtendedTopic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: (InterviewQuestion & { isCustom?: boolean })[];
  isCustom: boolean;
}

interface TopicFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  originalId?: string;
  isPredefined?: boolean;
}

interface ExtendedTopic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: (InterviewQuestion & { isCustom?: boolean })[];
  isCustom: boolean;
}

interface CustomTopic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const defaultFormData: QuestionFormData = {
  question: '',
  answer: '',
  tips: '',
  difficulty: 'medium',
  company: '',
  expectedTime: 120
};

const defaultTopicFormData: TopicFormData = {
  name: '',
  description: '',
  icon: 'database',
  color: 'bg-blue-500'
};

const iconOptions = ['database', 'code', 'table', 'flame', 'zap', 'wind', 'cloud', 'server', 'refresh-cw', 'git-branch', 'layers', 'terminal', 'user'];
const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-blue-600', label: 'Dark Blue' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-green-600', label: 'Dark Green' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-gray-700', label: 'Dark Gray' },
];

export function InterviewHub() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [cameFromSearch, setCameFromSearch] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [savedQuestions, setSavedQuestions] = useLocalStorage<SavedQuestion[]>('saved-interview-questions', []);
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>('interview-progress', {});
  
  const [customQuestions, setCustomQuestions] = useLocalStorage<Record<string, CustomQuestion[]>>('custom-interview-questions', {});
  const [customAnswers, setCustomAnswers] = useLocalStorage<Record<string, { answer: string; tips: string[] }>>('custom-answers', {});
  const [customTopics, setCustomTopics] = useLocalStorage<CustomTopic[]>('custom-topics', []);
  const [hiddenTopics, setHiddenTopics] = useLocalStorage<string[]>('hidden-topics', []);
  const [hiddenQuestions, setHiddenQuestions] = useLocalStorage<string[]>('hidden-questions', []);
  const [questionTimes, setQuestionTimes] = useLocalStorage<Record<string, QuestionTimeData>>('interviewhub_question_times', {});
  
  const [activeTimer, setActiveTimer] = useState<{ questionId: string; startTime: number } | null>(null);
  const [timerDisplay, setTimerDisplay] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);
  const [editingExpectedTime, setEditingExpectedTime] = useState(false);
  const [tempExpectedTime, setTempExpectedTime] = useState(60);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; data: CustomQuestion } | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(defaultFormData);
  
  const [isTopicFormOpen, setIsTopicFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ExtendedTopic | null>(null);
  const [topicFormData, setTopicFormData] = useState<TopicFormData>(defaultTopicFormData);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [answerEditData, setAnswerEditData] = useState<{ answer: string; tips: string[] }>({ answer: '', tips: [] });
  const [isPredefinedEditOpen, setIsPredefinedEditOpen] = useState(false);
  const [predefinedEditData, setPredefinedEditData] = useState<{ question: string; answer: string; tips: string }>({ question: '', answer: '', tips: '' });
  const [editingPredefinedId, setEditingPredefinedId] = useState<string | null>(null);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('custom-answers');
      localStorage.removeItem('custom-interview-questions');
    }
  }, []);

  useEffect(() => {
    if (activeTimer) {
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
        setTimerDisplay(elapsed);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimerDisplay(0);
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [activeTimer]);

  const formatTimeDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getTimeColor = (actual: number, expected: number) => {
    const ratio = expected > 0 ? actual / expected : 1;
    if (ratio <= 0.8) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-500', label: 'Excellent!' };
    if (ratio <= 1.0) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500', label: 'Good' };
    if (ratio <= 1.5) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500', label: 'Slow' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-500', label: 'Too Slow' };
  };
  
  const getActiveQuestionTimeData = () => {
    if (!activeTimer) return null;
    return questionTimes[activeTimer.questionId] || null;
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    
    const elapsed = Math.floor((Date.now() - activeTimer.startTime) / 1000);
    const existing = questionTimes[activeTimer.questionId] || { best: Infinity, last: 0, attempts: 0, expectedTime: 60 };
    const bestTime = Math.min(existing.best, elapsed);
    
    setQuestionTimes(prev => ({
      ...prev,
      [activeTimer.questionId]: {
        best: bestTime,
        last: elapsed,
        attempts: (existing.attempts || 0) + 1,
        expectedTime: existing.expectedTime
      }
    }));
    
    setActiveTimer(null);
  };
  
  const handleUpdateExpectedTime = () => {
    if (!activeTimer) return;
    const newExpected = Math.max(10, Math.min(600, tempExpectedTime));
    setQuestionTimes(prev => {
      const existing = prev[activeTimer.questionId] || { best: Infinity, last: 0, attempts: 0 };
      return {
        ...prev,
        [activeTimer.questionId]: {
          ...existing,
          expectedTime: newExpected
        }
      };
    });
    setEditingExpectedTime(false);
  };
  
  const startTimer = (questionId: string, expectedTime: number) => {
    if (activeTimer?.questionId === questionId) {
      stopTimer();
    } else {
      const newTimeData: QuestionTimeData = questionTimes[questionId] || { best: Infinity, last: 0, attempts: 0, expectedTime };
      setQuestionTimes(prev => ({
        ...prev,
        [questionId]: { ...newTimeData, expectedTime }
      }));
      setActiveTimer({ questionId, startTime: Date.now() });
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (topicId: string, questionId: string) => {
    setSavedQuestions(prev => {
      const key = `${topicId}:${questionId}`;
      const exists = prev.some(q => `${q.topicId}:${q.questionId}` === key);
      if (exists) {
        return prev.filter(q => `${q.topicId}:${q.questionId}` !== key);
      }
      return [...prev, { topicId, questionId }];
    });
  };

  const toggleReviewed = (questionId: string) => {
    setProgress(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const isBookmarked = (topicId: string, questionId: string) => {
    return savedQuestions.some(q => q.topicId === topicId && q.questionId === questionId);
  };

  const isReviewed = (questionId: string) => {
    return progress[questionId] === true;
  };

  const getAllQuestionsForTopic = (topicId: string): (InterviewQuestion & { isCustom?: boolean })[] => {
    const predefinedTopic = dataEngineeringTopics[topicId as DataEngineeringTopic];
    const predefined = predefinedTopic?.questions || [];
    const custom = customQuestions[topicId] || [];
    
    const predefinedIds = new Set(predefined.map(q => q.id));
    
    const mergedQuestions = predefined
      .filter(q => !hiddenQuestions.includes(q.id))
      .map(q => {
        const customAnswer = customAnswers[`${topicId}:${q.id}`];
        if (customAnswer) {
          return { ...q, answer: customAnswer.answer, tips: customAnswer.tips };
        }
        return q;
      });
    
    const newCustomQuestions = custom
      .filter(q => !predefinedIds.has(q.id) && !hiddenQuestions.includes(q.id));
    
    return [...mergedQuestions, ...newCustomQuestions.map(q => ({ ...q, isCustom: true }))];
  };

  const getQuestionCustomAnswer = (topicId: string, questionId: string) => {
    return customAnswers[`${topicId}:${questionId}`];
  };

  const handleOpenAddForm = () => {
    setFormData(defaultFormData);
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (q: InterviewQuestion) => {
    const timeData = questionTimes[q.id];
    const defaultExpected = q.difficulty === 'easy' ? 60 : q.difficulty === 'medium' ? 120 : 180;
    setFormData({
      question: q.question,
      answer: q.answer || '',
      tips: q.tips?.join('\n') || '',
      difficulty: q.difficulty,
      company: q.company || '',
      expectedTime: timeData?.expectedTime || defaultExpected
    });
    setEditingQuestion({ id: q.id, data: q as CustomQuestion });
    setIsFormOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!selectedTopic || !formData.question.trim()) return;
    
    const tips = formData.tips.split('\n').map(t => t.trim()).filter(Boolean);
    
    if (editingQuestion) {
      const newCustom = editingQuestion.data.isCustom;
      if (newCustom) {
        setCustomQuestions(prev => ({
          ...prev,
          [selectedTopic]: prev[selectedTopic].map(q => 
            q.id === editingQuestion.id 
              ? { ...q, question: formData.question, answer: formData.answer, tips, difficulty: formData.difficulty, company: formData.company }
              : q
          )
        }));
      }
    } else {
      const newQuestion: CustomQuestion = {
        id: `custom-${Date.now()}`,
        question: formData.question,
        answer: formData.answer,
        tips,
        difficulty: formData.difficulty,
        company: formData.company,
        isCustom: true
      };
      setCustomQuestions(prev => ({
        ...prev,
        [selectedTopic]: [...(prev[selectedTopic] || []), newQuestion]
      }));
      
      const newQuestionId = `custom-${Date.now()}`;
      setQuestionTimes(prev => ({
        ...prev,
        [newQuestionId]: { best: Infinity, last: 0, attempts: 0, expectedTime: formData.expectedTime }
      }));
    }
    
    setIsFormOpen(false);
    setEditingQuestion(null);
    setFormData(defaultFormData);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedTopic || !confirm('Delete this question?')) return;
    
    setCustomQuestions(prev => ({
      ...prev,
      [selectedTopic]: prev[selectedTopic].filter(q => q.id !== questionId)
    }));
    
    setQuestionTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[questionId];
      return newTimes;
    });
  };

  const handleHideQuestion = (questionId: string) => {
    if (!confirm('Hide this question?')) return;
    setHiddenQuestions(prev => [...prev, questionId]);
  };

  const handleRestoreHidden = () => {
    setHiddenQuestions([]);
  };

  const handleOpenEditAnswer = (question: InterviewQuestion & { isCustom?: boolean }, topicId: string) => {
    if (!selectedTopic) return;
    
    const customAnswer = customAnswers[`${topicId}:${question.id}`];
    
    if (question.isCustom) {
      setAnswerEditData({
        answer: question.answer || '',
        tips: question.tips || []
      });
    } else if (customAnswer) {
      setAnswerEditData({
        answer: customAnswer.answer,
        tips: customAnswer.tips
      });
    } else {
      setAnswerEditData({
        answer: question.answer || '',
        tips: question.tips || []
      });
    }
    setEditingAnswer(question.id);
  };

  const handleOpenPredefinedEdit = (question: InterviewQuestion, topicId: string) => {
    const customAnswer = customAnswers[`${topicId}:${question.id}`];
    setPredefinedEditData({
      question: question.question,
      answer: customAnswer?.answer || question.answer || '',
      tips: customAnswer?.tips?.join('\n') || question.tips?.join('\n') || ''
    });
    setEditingPredefinedId(question.id);
    setIsPredefinedEditOpen(true);
  };

  const handleSavePredefinedEdit = () => {
    if (!selectedTopic || !editingPredefinedId) return;
    
    const tips = predefinedEditData.tips.split('\n').map(t => t.trim()).filter(Boolean);
    
    setCustomAnswers(prev => ({
      ...prev,
      [`${selectedTopic}:${editingPredefinedId}`]: {
        answer: predefinedEditData.answer,
        tips
      }
    }));
    
    setIsPredefinedEditOpen(false);
    setEditingPredefinedId(null);
    setPredefinedEditData({ question: '', answer: '', tips: '' });
  };

  const handleSaveAnswer = (questionId: string) => {
    if (!selectedTopic) return;
    
    const key = `${selectedTopic}:${questionId}`;
    
    setCustomAnswers(prev => ({
      ...prev,
      [key]: { answer: answerEditData.answer, tips: answerEditData.tips }
    }));
    
    setEditingAnswer(null);
  };

  const generateAnswer = async (question: string, difficulty?: string) => {
    setGeneratingAnswer(true);
    
    let userContext = '';
    try {
      const profileData = localStorage.getItem('user-profile');
      const selfIntrosData = localStorage.getItem('self-introductions');
      
      if (profileData) {
        const profile = JSON.parse(profileData);
        userContext += `\n\n**MY PROFILE:**
- Name: ${profile.name || 'Not set'}
- Summary: ${profile.summary || 'Not set'}
- Skills: ${profile.skills?.join(', ') || 'Not set'}
- Experience: ${profile.experience?.map((e: { company: string; role: string; startDate: string; endDate: string; description: string }) => 
          `${e.role} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description}`
        ).join('; ') || 'Not set'}`;
      }
      
      if (selfIntrosData) {
        const intros = JSON.parse(selfIntrosData);
        if (intros.length > 0) {
          userContext += `\n\n**MY SELF INTRODUCTION:**
${intros[0].content || 'Not set'}`;
        }
      }
    } catch (e) {
      console.error('Failed to load user context:', e);
    }
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach. Generate professional, concise interview answers using the STAR method where appropriate. Format your response with the answer in markdown.'
            },
            {
              role: 'user',
              content: `Question: ${question}
Difficulty: ${difficulty || 'medium'}
${userContext}

Generate a professional, well-structured interview answer. Include:
1. A clear, concise main answer (using the user's profile above)
2. Key points to remember
3. Any relevant examples or tips

Format the output as:
**Answer:** [Your answer here]

**Key Points:** [bullet points]

**Tips:** [any tips]`
            }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to generate answer');
      }

      const data = await response.json();
      const generated = data.choices[0].message.content;
      
      const answerMatch = generated.match(/\*\*Answer:\*\*\s*([\s\S]*?)(?=\*\*Key Points:|$)/i);
      const keyPointsMatch = generated.match(/\*\*Key Points:\*\*\s*([\s\S]*?)(?=\*\*Tips:|$)/i);
      const tipsMatch = generated.match(/\*\*Tips:\*\*\s*([\s\S]*?)$/i);

      const answer = answerMatch ? answerMatch[1].trim() : generated;
      const tips = keyPointsMatch ? keyPointsMatch[1].split('\n').map((t: string) => t.replace(/^[-*]\s*/, '').trim()).filter(Boolean) : [];
      const tipsText = tipsMatch ? tipsMatch[1].trim() : '';

      setAnswerEditData({
        answer: answer,
        tips: [...tips, ...(tipsText ? [tipsText] : [])].slice(0, 10)
      });
    } catch (err) {
      console.error('Failed to generate answer:', err);
      alert('Failed to generate answer. Please try again.');
    } finally {
      setGeneratingAnswer(false);
    }
  };

  const handleDeleteAnswer = (questionId: string) => {
    if (!selectedTopic || !confirm('Delete the answer for this question?')) return;
    
    const key = `${selectedTopic}:${questionId}`;
    
    setCustomAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[key];
      return newAnswers;
    });
  };

  const handleOpenEditTopic = (topic: ExtendedTopic) => {
    setTopicFormData({
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      originalId: topic.id,
      isPredefined: !topic.isCustom
    });
    setEditingTopic(topic);
    setIsTopicFormOpen(true);
  };

  const handleSaveTopic = () => {
    if (!topicFormData.name.trim() || !topicFormData.description.trim()) return;
    
    if (editingTopic) {
      if (editingTopic.isCustom) {
        setCustomTopics(prev => prev.map(t => 
          t.id === editingTopic.id 
            ? { ...t, name: topicFormData.name, description: topicFormData.description, icon: topicFormData.icon, color: topicFormData.color }
            : t
        ));
      } else {
        const newId = `edited-${editingTopic.id}-${Date.now()}`;
        const newTopic: CustomTopic = {
          id: newId,
          name: topicFormData.name,
          description: topicFormData.description,
          icon: topicFormData.icon,
          color: topicFormData.color
        };
        setCustomTopics(prev => [...prev, newTopic]);
        
        const sourceTopic = dataEngineeringTopics[editingTopic.id as DataEngineeringTopic];
        const sourceQuestions = sourceTopic?.questions || [];
        
        const copiedQuestions: CustomQuestion[] = sourceQuestions.map(q => ({
          ...q,
          isCustom: true
        }));
        
        setCustomQuestions(prev => ({
          ...prev,
          [newId]: copiedQuestions
        }));
      }
    } else {
      const newTopic: CustomTopic = {
        id: `custom-topic-${Date.now()}`,
        name: topicFormData.name,
        description: topicFormData.description,
        icon: topicFormData.icon,
        color: topicFormData.color
      };
      setCustomTopics(prev => [...prev, newTopic]);
    }
    
    setIsTopicFormOpen(false);
    setEditingTopic(null);
    setTopicFormData({
      name: '',
      description: '',
      icon: 'database',
      color: 'bg-blue-500'
    });
  };

  const handleDeleteTopic = (topic: ExtendedTopic) => {
    const message = topic.isCustom 
      ? 'Delete this topic? All custom questions in this topic will also be deleted.'
      : 'Hide this predefined topic?';
    
    if (!confirm(message)) return;
    
    if (topic.isCustom) {
      setCustomTopics(prev => prev.filter(t => t.id !== topic.id));
      setCustomQuestions(prev => {
        const newQuestions = { ...prev };
        delete newQuestions[topic.id as DataEngineeringTopic];
        return newQuestions;
      });
    } else {
      setHiddenTopics(prev => [...prev, topic.id]);
      if (selectedTopic === topic.id) {
        setSelectedTopic(null);
      }
    }
  };

  const getTopicInfo = (topicId: string) => {
    const predefined = dataEngineeringTopics[topicId as DataEngineeringTopic];
    if (predefined) {
      return { name: predefined.name, description: predefined.description };
    }
    const custom = customTopics.find(t => t.id === topicId);
    if (custom) {
      return { name: custom.name, description: custom.description };
    }
    return { name: 'Unknown Topic', description: '' };
  };

  const getTopicColor = (topic: ExtendedTopic) => {
    if (topic.isCustom) return topic.color;
    const predefined = dataEngineeringTopics[topic.id as DataEngineeringTopic];
    return predefined?.color || topic.color;
  };

  const getAllTopics = useMemo(() => {
    const predefined = allTopics
      .filter(t => !hiddenTopics.includes(t.id))
      .map(t => ({
        id: t.id,
        name: t.name,
        icon: t.icon,
        color: t.color,
        description: t.description,
        questions: t.questions.map(q => ({ ...q, isCustom: false })),
        isCustom: false
      }));
    const custom = customTopics.map(t => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      description: t.description,
      questions: customQuestions[t.id]?.map(q => ({ ...q, isCustom: true })) || [],
      isCustom: true
    }));
    return [...predefined, ...custom] as ExtendedTopic[];
  }, [allTopics, hiddenTopics, customTopics, customQuestions]);

  const filteredQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    
    let questions = getAllQuestionsForTopic(selectedTopic);
    
    if (showBookmarkedOnly) {
      questions = questions.filter(q => isBookmarked(selectedTopic, q.id));
    }
    
    if (filterDifficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === filterDifficulty);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(term) ||
        q.answer?.toLowerCase().includes(term) ||
        q.tips?.some(t => t.toLowerCase().includes(term))
      );
    }
    
    return questions;
  }, [selectedTopic, filterDifficulty, searchTerm, showBookmarkedOnly, savedQuestions, progress, customQuestions, hiddenTopics, getAllQuestionsForTopic, isBookmarked]);

  const overallProgress = useMemo(() => {
    let total = 0;
    let reviewed = 0;
    getAllTopics.forEach(topic => {
      const allQuestions = getAllQuestionsForTopic(topic.id);
      const reviewedCount = allQuestions.filter(q => isReviewed(q.id)).length;
      total += allQuestions.length;
      reviewed += reviewedCount;
    });
    return { reviewed, total };
  }, [progress, customQuestions, customTopics, hiddenTopics, getAllQuestionsForTopic, getAllTopics, isReviewed]);

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  };

  const searchResultsCount = useMemo(() => {
    if (!searchTerm) return 0;
    let count = 0;
    getAllTopics.forEach(topic => {
      const questions = getAllQuestionsForTopic(topic.id);
      questions.forEach(q => {
        if (q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            q.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.tips?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))) {
          count++;
        }
      });
    });
    return count;
  }, [searchTerm, getAllTopics, getAllQuestionsForTopic]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Interview Hub</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 h-10"
            />
            {searchTerm && (
              <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                {searchResultsCount} results
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{overallProgress.reviewed} / {overallProgress.total}</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setEditingTopic(null);
              setTopicFormData({ name: '', description: '', icon: 'database', color: 'bg-blue-500' });
              setIsTopicFormOpen(true);
            }}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Topic
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {getAllTopics.map(topic => {
          const allQuestions = getAllQuestionsForTopic(topic.id);
          const reviewed = allQuestions.filter(q => isReviewed(q.id)).length;
          const percentage = allQuestions.length > 0 ? Math.round((reviewed / allQuestions.length) * 100) : 0;
          const topicColor = getTopicColor(topic);
          const isSelected = selectedTopic === topic.id;
          return (
            <div 
              key={topic.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all relative group ${
                isSelected 
                  ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                  : 'bg-card hover:border-primary/50'
              }`}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${topicColor} flex items-center justify-center text-white shrink-0`}>
                  {iconMap[topic.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{topic.name}</div>
                  <div className="text-[10px] text-muted-foreground">{allQuestions.length} Q</div>
                </div>
              </div>
              <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenEditTopic(topic); }}
                  className="p-0.5 bg-background/90 rounded shadow hover:bg-secondary"
                  title="Edit"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic); }}
                  className="p-0.5 bg-background/90 rounded shadow hover:bg-secondary text-destructive"
                  title={topic.isCustom ? "Delete" : "Hide"}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="h-1 bg-secondary rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full ${topicColor} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {searchTerm && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Search Results for "{searchTerm}"
                <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {searchResultsCount}
                </span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const term = searchTerm.toLowerCase();
              const results: { topicId: string; topicName: string; topicColor: string; question: InterviewQuestion }[] = [];
              
              getAllTopics.forEach(topic => {
                const questions = getAllQuestionsForTopic(topic.id);
                questions.forEach(q => {
                  if (q.question.toLowerCase().includes(term) || 
                      q.answer?.toLowerCase().includes(term) ||
                      q.tips?.some((t: string) => t.toLowerCase().includes(term))) {
                    results.push({ topicId: topic.id, topicName: topic.name, topicColor: getTopicColor(topic), question: q });
                  }
                });
              });
              
              if (results.length === 0) {
                return <p className="text-muted-foreground text-center py-8">No results found</p>;
              }
              
              return (
                <div className="space-y-2">
                  {results.map((result, index) => {
                    const isExpanded = expandedQuestions.has(result.question.id);
                    return (
                      <div key={`${result.topicId}-${result.question.id}`} className="border rounded-lg overflow-hidden">
                        <div 
                          className="p-3 hover:bg-muted/50 cursor-pointer transition-colors flex items-start gap-2"
                          onClick={() => toggleExpanded(result.question.id)}
                        >
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {index + 1}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${result.topicColor} text-white text-[10px]`}>
                                {result.topicName}
                              </Badge>
                              <Badge className={`${difficultyColors[result.question.difficulty as keyof typeof difficultyColors]} text-white text-[10px]`}>
                                {result.question.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">{result.question.question}</p>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 pl-9 space-y-3 border-t bg-muted/30">
                            {result.question.answer && (
                              <div>
                                <h4 className="text-sm font-semibold mt-3 mb-1">Answer</h4>
                                <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.question.answer}</ReactMarkdown>
                                </div>
                              </div>
                            )}
                            {result.question.tips && result.question.tips.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1 flex items-center gap-1">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  Key Points
                                </h4>
                              <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.question.tips.map((tip: string) => `- ${tip}`).join('\n')}</ReactMarkdown>
                              </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {selectedTopic && !searchTerm && (
        <div className="space-y-4">
          {activeTimer && (
            <Card className={`border-2 ${getTimeColor(timerDisplay, getActiveQuestionTimeData()?.expectedTime || 60).border}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Practice Timer</span>
                    </div>
                    <div className={`text-3xl font-bold font-mono ${getTimeColor(timerDisplay, getActiveQuestionTimeData()?.expectedTime || 60).text}`}>
                      {formatTimeDisplay(timerDisplay)}
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      Expected: {formatTimeDisplay(getActiveQuestionTimeData()?.expectedTime || 60)}
                      {editingExpectedTime ? (
                        <div className="flex items-center ml-2">
                          <Input
                            type="number"
                            value={tempExpectedTime}
                            onChange={(e) => setTempExpectedTime(parseInt(e.target.value) || 60)}
                            className="w-16 h-6 text-xs px-1"
                            min={10}
                            max={600}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateExpectedTime();
                              if (e.key === 'Escape') setEditingExpectedTime(false);
                            }}
                          />
                          <Button size="sm" className="h-6 px-2 ml-1" onClick={handleUpdateExpectedTime}>OK</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setTempExpectedTime(getActiveQuestionTimeData()?.expectedTime || 60);
                            setEditingExpectedTime(true);
                          }}
                          className="ml-1 hover:text-primary"
                          title="Edit Expected Time"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={stopTimer}
                      className="gap-1"
                    >
                      <Square className="h-4 w-4" />
                      Stop & Save
                    </Button>
                  </div>
                </div>
                <div className={`mt-2 text-sm ${getTimeColor(timerDisplay, getActiveQuestionTimeData()?.expectedTime || 60).text}`}>
                  {getTimeColor(timerDisplay, getActiveQuestionTimeData()?.expectedTime || 60).label}
                  {timerDisplay > 0 && getActiveQuestionTimeData()?.best !== Infinity && (
                    <span className="ml-2">
                      | Best: <span className="font-semibold">{formatTimeDisplay(getActiveQuestionTimeData()?.best || 0)}</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>{getTopicInfo(selectedTopic).name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {getTopicInfo(selectedTopic).description}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedTopic(null);
                  if (cameFromSearch) {
                    setCameFromSearch(false);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                {cameFromSearch ? 'Back to Search' : 'Back to Tiles'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
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

              <Button
                variant={showBookmarkedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Bookmarked
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenAddForm}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Question
              </Button>
              {hiddenQuestions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestoreHidden}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Restore ({hiddenQuestions.length})
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No questions found. Try adjusting your filters.
              </div>
            ) : (
              filteredQuestions.map((q, index) => (
                <div 
                  key={q.id}
                  className={`border rounded-lg ${
                    isReviewed(q.id) ? 'bg-green-500/5 border-green-500/30' : 'border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleExpanded(q.id)}
                    className="w-full p-4 text-left flex items-start gap-3"
                  >
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                      {expandedQuestions.has(q.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[q.difficulty]} text-white`}>
                          {q.difficulty}
                        </span>
                        {q.company && (
                          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                            {q.company}
                          </span>
                        )}
                        {'isCustom' in q && q.isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-600">
                            Custom
                          </span>
                        )}
                        {isReviewed(q.id) && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-600">
                            Reviewed
                          </span>
                        )}
                        {questionTimes[q.id] && questionTimes[q.id].attempts > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            <span className={`text-xs font-semibold ${getTimeColor(questionTimes[q.id].best, questionTimes[q.id].expectedTime).text}`}>
                              {formatTimeDisplay(questionTimes[q.id].best)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 font-medium">{q.question}</p>
                    </div>
                    
                      <div className="flex items-center gap-1">
                        {q.isCustom ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditForm(q);
                            }}
                            className="p-2 hover:bg-secondary rounded"
                            title="Edit Question"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                            className="p-2 hover:bg-secondary rounded text-destructive"
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPredefinedEdit(q, selectedTopic);
                            }}
                            className="p-2 hover:bg-secondary rounded text-blue-600"
                            title="Edit Question & Answer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHideQuestion(q.id);
                            }}
                            className="p-2 hover:bg-secondary rounded text-muted-foreground"
                            title="Hide Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(selectedTopic, q.id);
                        }}
                        className="p-2 hover:bg-secondary rounded"
                        title="Bookmark"
                      >
                        {isBookmarked(selectedTopic, q.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const timeData = questionTimes[q.id];
                          const expectedTime = timeData?.expectedTime || (q.difficulty === 'easy' ? 60 : q.difficulty === 'medium' ? 120 : 180);
                          startTimer(q.id, expectedTime);
                        }}
                        className={`p-2 hover:bg-secondary rounded ${activeTimer?.questionId === q.id ? 'bg-primary/10 text-primary' : ''}`}
                        title="Start Practice Timer"
                      >
                        {activeTimer?.questionId === q.id ? (
                          <Square className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReviewed(q.id);
                        }}
                        className="p-2 hover:bg-secondary rounded"
                        title="Mark as reviewed"
                      >
                        {isReviewed(q.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </button>
                  
                  {expandedQuestions.has(q.id) && (
                    <div className="px-4 pb-4 pl-10 space-y-3">
                      <div className="border-t pt-3">
                          <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold">Answer</h4>
                          <div className="flex gap-1">
                            {editingAnswer === q.id ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAnswer(q.question, q.difficulty)}
                                  disabled={generatingAnswer}
                                >
                                  {generatingAnswer ? (
                                    <>
                                      <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="h-3 w-3 mr-1" />
                                      Generate
                                    </>
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => handleSaveAnswer(q.id)}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setEditingAnswer(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenEditAnswer(q, selectedTopic); setTimeout(() => generateAnswer(q.question, q.difficulty), 100); }}
                                  className="p-1 hover:bg-secondary rounded text-primary"
                                  title="Generate Answer with AI"
                                >
                                  <Sparkles className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenEditAnswer(q, selectedTopic); }}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                                  title="Edit Answer"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                {(q.answer || getQuestionCustomAnswer(selectedTopic, q.id)) && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteAnswer(q.id); }}
                                    className="p-1 hover:bg-secondary rounded text-destructive"
                                    title="Delete Answer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        {editingAnswer === q.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={answerEditData.answer}
                              onChange={(e) => setAnswerEditData(prev => ({ ...prev, answer: e.target.value }))}
                              placeholder="Enter the answer..."
                              rows={4}
                              className="text-sm"
                            />
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Key Points (one per line)</label>
                              <Textarea
                                value={answerEditData.tips.join('\n')}
                                onChange={(e) => setAnswerEditData(prev => ({ 
                                  ...prev, 
                                  tips: e.target.value.split('\n').map(t => t.trim()).filter(Boolean)
                                }))}
                                placeholder="Enter key points, one per line..."
                                rows={3}
                                className="text-sm mt-1"
                              />
                            </div>
                          </div>
                        ) : q.answer ? (
                          <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.answer}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            No answer added yet. {('isCustom' in q && q.isCustom) && 'Click edit to add one.'}
                          </div>
                        )}
                      </div>
                      
                      {!editingAnswer && q.tips && q.tips.length > 0 && (
                        <div className="border-t pt-3">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            Key Points
                          </h4>
                          <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.tips.map((tip: string) => `- ${tip}`).join('\n')}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question *</label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the interview question..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tips (one per line)</label>
              <Textarea
                value={formData.tips}
                onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                placeholder="Enter key points/tips, one per line..."
                rows={3}
              />
            </div>
              <div className="grid grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Time (sec)</label>
                <Input
                  type="number"
                  value={formData.expectedTime}
                  onChange={(e) => setFormData({ ...formData, expectedTime: parseInt(e.target.value) || 60 })}
                  placeholder="e.g., 120"
                  min={10}
                  max={600}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company (optional)</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Google, Amazon"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion} disabled={!formData.question.trim()}>
              <Save className="h-4 w-4 mr-1" />
              {editingQuestion ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTopicFormOpen} onOpenChange={setIsTopicFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTopic?.isCustom ? 'Edit Topic' : 'Copy & Edit Topic'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={topicFormData.name}
                onChange={(e) => setTopicFormData({ ...topicFormData, name: e.target.value })}
                placeholder="Topic name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={topicFormData.description}
                onChange={(e) => setTopicFormData({ ...topicFormData, description: e.target.value })}
                placeholder="Topic description"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <select
                  value={topicFormData.icon}
                  onChange={(e) => setTopicFormData({ ...topicFormData, icon: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <select
                  value={topicFormData.color}
                  onChange={(e) => setTopicFormData({ ...topicFormData, color: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {!editingTopic?.isCustom && editingTopic && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                <p className="text-blue-700 dark:text-blue-400">
                  This will create a copy of "{editingTopic.name}" with all {getAllQuestionsForTopic(editingTopic.id).length} questions.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTopicFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTopic} disabled={!topicFormData.name.trim() || !topicFormData.description.trim()}>
              <Save className="h-4 w-4 mr-1" />
              {editingTopic ? (editingTopic.isCustom ? 'Update' : 'Create Copy') : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPredefinedEditOpen} onOpenChange={setIsPredefinedEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question & Answer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Textarea
                value={predefinedEditData.question}
                onChange={(e) => setPredefinedEditData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Question..."
                rows={2}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={predefinedEditData.answer}
                onChange={(e) => setPredefinedEditData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter your answer..."
                rows={5}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Points (one per line)</label>
              <Textarea
                value={predefinedEditData.tips}
                onChange={(e) => setPredefinedEditData(prev => ({ ...prev, tips: e.target.value }))}
                placeholder="Enter key points, one per line..."
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPredefinedEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePredefinedEdit}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
