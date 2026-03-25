import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { Clock, Video, Phone, Building2, Calendar } from 'lucide-react';
import { useAppStore } from '../../store';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

interface InterviewCountdownProps {
  onNavigate?: () => void;
}

export function InterviewCountdown({ onNavigate }: InterviewCountdownProps) {
  const { interviews, companies } = useAppStore();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const upcomingInterviews = interviews
    .filter(i => i.status === 'scheduled' && new Date(i.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcomingInterviews.length === 0) return null;

  const getTimeRemaining = (interviewDate: Date): TimeRemaining => {
    const now = new Date();
    return {
      days: differenceInDays(interviewDate, now),
      hours: differenceInHours(interviewDate, now) % 24,
      minutes: differenceInMinutes(interviewDate, now) % 60,
    };
  };

  const getItemColor = (time: TimeRemaining) => {
    const totalMinutes = time.days * 24 * 60 + time.hours * 60 + time.minutes;
    if (totalMinutes < 90 && time.days === 0) {
      return 'bg-gradient-to-r from-red-500 to-orange-500';
    }
    return 'bg-white/10';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'onsite': return <Building2 className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatCountdown = (time: TimeRemaining) => {
    const parts = [];
    if (time.days > 0) parts.push(`${time.days}d`);
    if (time.hours > 0 || time.days > 0) parts.push(`${time.hours}h`);
    parts.push(`${time.minutes}m`);
    return parts.join(' ');
  };

  return (
    <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={onNavigate}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Interviews
          <span className="text-sm opacity-75 ml-auto">{upcomingInterviews.length} scheduled</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingInterviews.map((interview, idx) => {
          const company = companies.find(c => c.id === interview.companyId);
          const date = new Date(interview.date);
          const time = getTimeRemaining(date);
          const now = new Date();
          const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
          const isTomorrow = differenceInDays(date, now) === 1;

          return (
            <div 
              key={interview.id} 
              className={`flex items-center justify-between ${getItemColor(time)} rounded-lg p-3 ${idx === 0 ? 'ring-2 ring-white/30' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {getTypeIcon(interview.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{company?.name || 'Unknown Company'}</p>
                  <p className="text-xs opacity-75 capitalize">
                    {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(date, 'MMM d')} at {format(date, 'h:mm a')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatCountdown(time)}</p>
                <p className="text-xs opacity-75 capitalize">{interview.type}</p>
              </div>
            </div>
          );
        })}
        {interviews.filter(i => i.status === 'scheduled' && new Date(i.date) >= new Date()).length > 3 && (
          <p className="text-xs text-center opacity-75">+ {interviews.filter(i => i.status === 'scheduled' && new Date(i.date) >= new Date()).length - 3} more</p>
        )}
      </CardContent>
    </Card>
  );
}
