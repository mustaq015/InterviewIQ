import { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select } from '../../components/ui';
import { Plus, Pencil, Trash2, FileText, Star, StarOff, Sparkles, Bot } from 'lucide-react';
import type { Answer } from '../../types';
import { AIFeedback, AISettings } from './ai-feedback';

export function Answers() {
  const { questions, answers, addAnswer, updateAnswer, deleteAnswer } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
  const [filterQuestion, setFilterQuestion] = useState<string>('');
  const [selectedAnswerForAI, setSelectedAnswerForAI] = useState<{ question: string; answer: string } | null>(null);
  
  const [formData, setFormData] = useState({
    questionId: 0,
    content: '',
    isBest: false,
  });

  const answersWithQuestions = useMemo(() => {
    return answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      return { ...answer, questionTitle: question?.title || 'Unknown' };
    }).filter(a => !filterQuestion || String(a.questionId) === filterQuestion);
  }, [answers, questions, filterQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAnswer) {
      await updateAnswer(editingAnswer.id!, {
        content: formData.content,
        isBest: formData.isBest,
        version: editingAnswer.version + 1,
      });
    } else {
      await addAnswer({
        questionId: formData.questionId,
        content: formData.content,
        isBest: formData.isBest,
      });
    }
    
    setIsDialogOpen(false);
    setEditingAnswer(null);
    setFormData({
      questionId: questions[0]?.id || 0,
      content: '',
      isBest: false,
    });
  };

  const handleEdit = (answer: Answer) => {
    setEditingAnswer(answer);
    setFormData({
      questionId: answer.questionId,
      content: answer.content,
      isBest: answer.isBest,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this answer?')) {
      await deleteAnswer(id);
    }
  };

  const handleMarkBest = async (answer: Answer) => {
    const otherAnswers = answers.filter(a => a.questionId === answer.questionId && a.id !== answer.id);
    
    for (const a of otherAnswers) {
      if (a.isBest) {
        await updateAnswer(a.id!, { isBest: false });
      }
    }
    
    await updateAnswer(answer.id!, { isBest: !answer.isBest });
  };

  const handleNewAnswer = (questionId: number) => {
    setFormData({
      questionId,
      content: '',
      isBest: false,
    });
    setEditingAnswer(null);
    setIsDialogOpen(true);
  };

  const handleAIEnhance = (answer: Answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      setSelectedAnswerForAI({ question: question.title, answer: answer.content });
    }
  };

  const handleApplyImprovedAnswer = async (improvedAnswer: string) => {
    if (selectedAnswerForAI) {
      const answer = answers.find(a => a.content === selectedAnswerForAI.answer);
      if (answer) {
        await updateAnswer(answer.id!, {
          content: improvedAnswer,
          version: answer.version + 1,
        });
        setSelectedAnswerForAI(null);
      }
    }
  };

  const getAnswersForQuestion = (questionId: number) => {
    return answers.filter(a => a.questionId === questionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Answers</h2>
        <div className="flex gap-2">
          <AISettings />
          <Button onClick={() => handleNewAnswer(questions[0]?.id || 0)} disabled={questions.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add Answer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Select
            options={[{ label: 'All Questions', value: '' }, ...questions.map(q => ({ label: q.title, value: String(q.id) }))]}
            value={filterQuestion}
            onChange={(e) => setFilterQuestion(e.target.value)}
            className="w-full max-w-md"
          />
        </CardContent>
      </Card>

      {selectedAnswerForAI && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIFeedback 
              question={selectedAnswerForAI.question}
              answer={selectedAnswerForAI.answer}
              onApply={handleApplyImprovedAnswer}
            />
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => setSelectedAnswerForAI(null)}
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      {answersWithQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No answers yet. Add your first answer!</p>
          </CardContent>
        </Card>
      ) : filterQuestion ? (
        <div className="space-y-4">
          {answersWithQuestions.map((answer) => (
            <Card key={answer.id} className={answer.isBest ? 'border-primary' : ''}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Version {answer.version}</CardTitle>
                  <div className="flex gap-2">
                    {answer.isBest && (
                      <Badge className="bg-primary">Best Answer</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleAIEnhance(answer)}
                    title="AI Enhancement"
                  >
                    <Bot className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleMarkBest(answer)}
                    title={answer.isBest ? 'Unmark as best' : 'Mark as best'}
                  >
                    {answer.isBest ? <Star className="h-4 w-4 text-primary" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(answer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(answer.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {answer.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => {
            const questionAnswers = getAnswersForQuestion(question.id!);
            if (questionAnswers.length === 0) return null;
            
            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questionAnswers.map((answer) => (
                    <div 
                      key={answer.id} 
                      className={`rounded-lg border p-4 ${answer.isBest ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <Badge variant="secondary">Version {answer.version}</Badge>
                            {answer.isBest && (
                              <Badge className="bg-primary">Best Answer</Badge>
                            )}
                          </div>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap mt-2">
                            {answer.content}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAIEnhance(answer)}
                            title="AI Enhancement"
                          >
                            <Bot className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleMarkBest(answer)}
                          >
                            {answer.isBest ? <Star className="h-4 w-4 text-primary" /> : <StarOff className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(answer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(answer.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleNewAnswer(question.id!)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Version
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingAnswer ? 'Edit Answer' : 'Add Answer'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Select
                  options={questions.map(q => ({ label: q.title, value: String(q.id) }))}
                  value={String(formData.questionId)}
                  onChange={(e) => setFormData({ ...formData, questionId: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Answer Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your answer here..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBest"
                  checked={formData.isBest}
                  onChange={(e) => setFormData({ ...formData, isBest: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isBest" className="cursor-pointer">Mark as best answer</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAnswer ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ htmlFor, children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  );
}
