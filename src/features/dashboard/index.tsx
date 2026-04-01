import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Building2, MessageCircleQuestion, Calendar, TrendingUp, Flame, CheckCircle2, Clock, Zap, Target } from 'lucide-react';
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
    { title: 'Companies', value: companies.length, icon: Building2, color: 'text-rose-500', bg: 'from-rose-50 to-orange-50 dark:from-rose-950 dark:to-orange-950' },
    { title: 'Interviews', value: interviews.length, icon: Calendar, color: 'text-violet-500', bg: 'from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950' },
  ];

  const qaStats = { questions: questions.length, answers: answers.length };

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
  const successRate = completedInterviews > 0 ? Math.round((completedInterviews / interviews.length) * 100) : 0;

  const checklistDone = checklist.filter(i => i.done).length;
  const checklistProgress = checklist.length > 0 ? Math.round((checklistDone / checklist.length) * 100) : 0;

  const flashcardsKnown = flashcards.filter(f => f.known).length;
  const flashcardsProgress = flashcards.length > 0 ? Math.round((flashcardsKnown / flashcards.length) * 100) : 0;

  const today = new Date().toISOString().split('T')[0];
  const alreadyCheckedIn = streak.last === today;

  const daysSinceLastStreak = streak.last ? Math.floor((currentTime - new Date(streak.last).getTime()) / (1000 * 60 * 60 * 24)) : null;

  const handleStreakClick = () => {
    if (!alreadyCheckedIn) updateStreak();
  };

  const recentActivities = [
    ...companies.map(c => ({ type: 'Company', name: c.name, date: c.updatedAt || c.createdAt })),
    ...questions.map(q => ({ type: 'Question', name: q.title, date: q.updatedAt || q.createdAt })),
    ...interviews.map(i => ({ type: 'Interview', name: i.type, date: i.updatedAt || i.createdAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const frequentQuestions = [...questions].filter(q => q.frequency > 0).sort((a, b) => b.frequency - a.frequency).slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your interview preparation progress</p>
        </div>
        <div className="flex gap-2">
          <StudyTimer />
          <Flashcards />
          <Checklist />
        </div>
      </div>

      <InterviewCountdown onNavigate={() => onNavigate?.('interviews')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br ${stat.bg}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="hover:shadow-lg transition-all hover:scale-[1.02] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Q&A</CardTitle>
            <MessageCircleQuestion className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{qaStats.questions}</div>
            <p className="text-xs text-muted-foreground">{qaStats.answers} answers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <ul className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-xs font-medium text-primary capitalize shrink-0">
                        {activity.type}
                      </span>
                      <span className="truncate text-foreground">{activity.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 ml-2">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activities</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Frequently Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            {frequentQuestions.length > 0 ? (
              <ul className="space-y-3">
                {frequentQuestions.map((q) => (
                  <li key={q.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-foreground">{q.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      {q.frequency}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No practice data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Questions by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Easy', count: questionsByDifficulty.easy, color: 'bg-green-500' },
              { label: 'Medium', count: questionsByDifficulty.medium, color: 'bg-yellow-500' },
              { label: 'Hard', count: questionsByDifficulty.hard, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full ${color} transition-all`} style={{ width: `${(count / Math.max(questions.length, 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Interview Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${successRate}, 100`} className="text-green-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{successRate}%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{completedInterviews} of {interviews.length} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleStreakClick}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className={`h-4 w-4 ${streak.streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              Day Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">{streak.streak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            {daysSinceLastStreak !== null && daysSinceLastStreak > 0 && (
              <p className="text-xs text-red-500 mt-1">{daysSinceLastStreak} day{daysSinceLastStreak !== 1 ? 's' : ''} since last activity</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{alreadyCheckedIn ? 'Checked in today!' : 'Click to check in'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Checklist Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{checklistDone}/{checklist.length}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: `${checklistProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{checklistProgress}% complete</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Flashcards Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Known</span>
              <span className="font-medium">{flashcardsKnown}/{flashcards.length}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${flashcardsProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{flashcardsProgress}% mastered</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakAreas.length > 0 ? (
              <ul className="space-y-2">
                {weakAreas.map((area) => (
                  <li key={area} className="text-sm text-muted-foreground capitalize">{area.replace(/-/g, ' ')}</li>
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
