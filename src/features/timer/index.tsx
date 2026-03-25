import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

type TimerMode = 'work' | 'break' | 'long';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string }> = {
  work: { label: 'Focus', minutes: 25, color: 'text-blue-500' },
  break: { label: 'Break', minutes: 5, color: 'text-green-500' },
  long: { label: 'Long Break', minutes: 15, color: 'text-purple-500' },
};

export function StudyTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('interviewiq_timer_date');
    if (stored !== today) {
      localStorage.setItem('interviewiq_timer_date', today);
      localStorage.setItem('interviewiq_timer_sessions', '0');
      return 0;
    }
    return parseInt(localStorage.getItem('interviewiq_timer_sessions') || '0');
  });
  
  const intervalRef = useRef<number | null>(null);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      localStorage.setItem('interviewiq_timer_sessions', String(newSessions));
      
      const nextMode = newSessions % 4 === 0 ? 'long' : 'break';
      setMode(nextMode);
      setTimeLeft(MODES[nextMode].minutes * 60);
    } else {
      setMode('work');
      setTimeLeft(MODES.work.minutes * 60);
    }
  }, [mode, sessions]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (MODES[mode].minutes * 60));
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        <Clock className="h-4 w-4" />
        Study Timer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Timer
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <div className="flex justify-center gap-2 mb-6">
              {(['work', 'break', 'long'] as TimerMode[]).map(m => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => switchMode(m)}
                  className={mode === m ? '' : 'text-muted-foreground'}
                >
                  {MODES[m].label}
                </Button>
              ))}
            </div>

            <div className="relative flex justify-center mb-6">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted opacity-20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-1000 ${MODES[mode].color}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-6xl font-bold font-mono ${MODES[mode].color}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={toggleTimer} size="lg" className="w-32">
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>🍅 Sessions today: <span className="font-bold">{sessions}</span></p>
              <p className="mt-1">
                {mode === 'work' 
                  ? 'Focus on your study material' 
                  : mode === 'break' 
                    ? 'Take a short break' 
                    : 'Great work! Take a longer break'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
