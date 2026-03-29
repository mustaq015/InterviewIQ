import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui';
import { Bot, Settings, Sparkles, Copy, Check } from 'lucide-react';
import { useLocalStorage } from '../../hooks';

interface AIConfig {
  apiKey: string;
  model: string;
  provider: 'openai' | 'groq';
}

export function AISettings() {
  const [config, setConfig] = useLocalStorage<AIConfig>('ai-config', {
    apiKey: '',
    model: 'llama-3.1-70b-versatile',
    provider: 'groq',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(config);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setConfig(formData);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDialogOpen(false);
    }, 500);
  };

  const hasApiKey = config.apiKey.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {hasApiKey ? (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <Sparkles className="h-4 w-4" />
            AI features enabled ({config.provider === 'groq' ? 'Groq (Free)' : 'OpenAI'})
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Configure your API key to enable AI features
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <DialogHeader>
              <DialogTitle>AI Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <select
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value as AIConfig['provider'], model: e.target.value === 'groq' ? 'llama-3.1-70b-versatile' : 'gpt-4o-mini' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="groq">Groq (Free - Recommended)</option>
                  <option value="openai">OpenAI (Paid)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">{formData.provider === 'groq' ? 'Groq' : 'OpenAI'} API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder={formData.provider === 'groq' ? 'gsk_...' : 'sk-...'}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href={formData.provider === 'groq' ? 'https://console.groq.com/keys' : 'https://platform.openai.com/api-keys'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {formData.provider === 'groq' ? 'Groq Console' : 'OpenAI Platform'}
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {formData.provider === 'groq' ? (
                    <>
                      <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Best Quality)</option>
                      <option value="llama-3.1-8b-instant">Llama 3.1 8B (Faster)</option>
                      <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface AIFeedbackProps {
  question: string;
  answer: string;
  onApply?: (improvedAnswer: string) => void;
}

export function AIFeedback({ question, answer, onApply }: AIFeedbackProps) {
  const [config] = useLocalStorage<AIConfig>('ai-config', {
    apiKey: '',
    model: 'llama-3.1-70b-versatile',
    provider: 'groq',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [improvedAnswer, setImprovedAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getEndpoint = () => {
    return config.provider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
  };

  const getFeedback = async () => {
    if (!config.apiKey) {
      setError('Please configure your API key first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach. Provide constructive feedback on interview answers and suggest improvements.'
            },
            {
              role: 'user',
              content: `Question: ${question}\n\nMy Answer: ${answer}\n\nPlease provide:\n1. Feedback on this answer (strengths and weaknesses)\n2. Suggestions for improvement\n3. A better example answer if applicable`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to get feedback');
      }

      const data = await response.json();
      setFeedback(data.choices[0].message.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const improveAnswer = async () => {
    if (!config.apiKey) {
      setError('Please configure your API key first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach. Write improved, professional answers to interview questions.'
            },
            {
              role: 'user',
              content: `Question: ${question}\n\nOriginal Answer: ${answer}\n\nWrite an improved, more effective answer to this interview question. Make it concise but impactful, using the STAR method where appropriate.`
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to improve answer');
      }

      const data = await response.json();
      setImprovedAnswer(data.choices[0].message.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config.apiKey) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={getFeedback} 
          disabled={isLoading || !answer}
          size="sm"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Get AI Feedback'}
        </Button>
        <Button 
          onClick={improveAnswer} 
          disabled={isLoading || !answer}
          variant="outline"
          size="sm"
        >
          <Bot className="mr-2 h-4 w-4" />
          Improve Answer
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {feedback && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{feedback}</div>
          </CardContent>
        </Card>
      )}

      {improvedAnswer && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Improved Answer</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => copyToClipboard(improvedAnswer)}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{improvedAnswer}</div>
            {onApply && (
              <Button 
                onClick={() => onApply(improvedAnswer)} 
                className="mt-4"
                size="sm"
              >
                Use This Answer
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
