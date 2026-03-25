import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Building2, MessageCircleQuestion, Calendar, TrendingUp, Flame, CheckCircle2, Clock, Zap } from 'lucide-react';
import { StudyTimer, Checklist, Flashcards } from '../../features';
import { InterviewCountdown } from './InterviewCountdown';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { companies, questions, answers, interviews, checklist, flashcards, streak, updateStreak } = useAppStore();
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Companies',
      value: companies.length,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      title: 'Interviews',
      value: interviews.length,
      icon: Calendar,
      color: 'text-orange-500',
    },
  ];

  const qaStats = {
    questions: questions.length,
    answers: answers.length,
  };

  const questionsByDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

  const questionsByCategory = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weakAreas = Object.entries(questionsByCategory)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([category]) => category);

  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const successRate = completedInterviews > 0 
    ? Math.round((completedInterviews / interviews.length) * 100) 
    : 0;

  const checklistDone = checklist.filter(i => i.done).length;
  const checklistProgress = checklist.length > 0 
    ? Math.round((checklistDone / checklist.length) * 100) 
    : 0;

  const flashcardsKnown = flashcards.filter(f => f.known).length;
  const flashcardsProgress = flashcards.length > 0 
    ? Math.round((flashcardsKnown / flashcards.length) * 100) 
    : 0;

  const today = new Date().toISOString().split('T')[0];
  const alreadyCheckedIn = streak.last === today;
  
  const daysSinceLastStreak = streak.last 
    ? Math.floor((currentTime - new Date(streak.last).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleStreakClick = () => {
    if (!alreadyCheckedIn) {
      updateStreak();
    }
  };

  const recentActivities = [
    ...companies.map(c => ({ type: 'Company', name: c.name, date: c.updatedAt || c.createdAt })),
    ...questions.map(q => ({ type: 'Question', name: q.title, date: q.updatedAt || q.createdAt })),
    ...interviews.map(i => ({ type: 'Interview', name: i.type, date: i.updatedAt || i.createdAt })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const frequentQuestions = [...questions]
    .filter(q => q.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <StudyTimer />
          <Flashcards />
          <Checklist />
        </div>
      </div>

      <InterviewCountdown onNavigate={() => onNavigate?.('interviews')} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <ul className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-xs font-medium text-primary capitalize">
                        {activity.type}
                      </span>
                      <span className="truncate max-w-[150px]">{activity.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Frequently Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            {frequentQuestions.length > 0 ? (
              <ul className="space-y-3">
                {frequentQuestions.map((q) => (
                  <li key={q.id} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[180px]">{q.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      {q.frequency}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No practice data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Q&A</CardTitle>
            <MessageCircleQuestion className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <div className="text-2xl font-bold text-green-500">{qaStats.questions}</div>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="border-l pl-4">
                <div className="text-2xl font-bold text-purple-500">{qaStats.answers}</div>
                <p className="text-xs text-muted-foreground">Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Questions by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Easy</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-green-500" 
                    style={{ width: `${(questionsByDifficulty.easy / Math.max(questions.length, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{questionsByDifficulty.easy}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Medium</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-yellow-500" 
                    style={{ width: `${(questionsByDifficulty.medium / Math.max(questions.length, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{questionsByDifficulty.medium}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hard</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 rounded-full bg-secondary">
                  <div 
                    className="h-2 rounded-full bg-red-500" 
                    style={{ width: `${(questionsByDifficulty.hard / Math.max(questions.length, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{questionsByDifficulty.hard}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interview Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-secondary"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${successRate}, 100`}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{successRate}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {completedInterviews} of {interviews.length} interviews completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${alreadyCheckedIn ? 'opacity-75' : 'hover:border-primary/50'}`}
          onClick={handleStreakClick}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className={`h-5 w-5 ${streak.streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              Day Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-500">{streak.streak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            {daysSinceLastStreak !== null && daysSinceLastStreak > 0 && (
              <p className="text-sm text-red-500 font-medium">
                ⚠️ {daysSinceLastStreak} day{daysSinceLastStreak !== 1 ? 's' : ''} since last activity
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {alreadyCheckedIn ? '✓ Checked in today!' : 'Click to check in'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Checklist Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold">{checklistDone}/{checklist.length}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{checklistProgress}% complete</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🃏 Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Known</span>
                <span className="font-bold">{flashcardsKnown}/{flashcards.length}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${flashcardsProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{flashcardsProgress}% mastered</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakAreas.length > 0 ? (
              <ul className="space-y-2">
                {weakAreas.map((area) => (
                  <li key={area} className="text-sm capitalize">
                    {area.replace('-', ' ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Add questions to see analytics</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
