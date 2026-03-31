import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { 
  LayoutDashboard, 
  Building2, 
  MessageCircleQuestion, 
  Calendar,
  RefreshCw,
  Moon,
  Sun,
  Code,
  BookOpen,
  StickyNote,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
  { id: 'profile', label: 'My Profile', icon: User, color: 'from-purple-500 to-pink-500' },
  { id: 'companies', label: 'Companies', icon: Building2, color: 'from-green-500 to-emerald-500' },
  { id: 'questions', label: 'Q&A', icon: MessageCircleQuestion, color: 'from-orange-500 to-amber-500' },
  { id: 'practice', label: 'Practice', icon: Code, color: 'from-indigo-500 to-violet-500' },
  { id: 'interview-hub', label: 'Interview Hub', icon: BookOpen, color: 'from-teal-500 to-green-500' },
  { id: 'materials', label: 'Materials', icon: StickyNote, color: 'from-pink-500 to-rose-500' },
  { id: 'interviews', label: 'Interviews', icon: Calendar, color: 'from-red-500 to-orange-500' },
  { id: 'sync', label: 'Sync', icon: RefreshCw, color: 'from-gray-500 to-slate-500' },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const { isLoading, syncState, isDarkMode, toggleDarkMode, loadData } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">IQ</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">InterviewIQ</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className="flex min-h-screen bg-background pt-14 lg:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r bg-gradient-to-b from-card to-background flex-col h-screen sticky top-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">InterviewIQ</h1>
                <p className="text-xs text-muted-foreground">Interview Prep</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded-lg',
                    isActive ? 'bg-white/20' : 'bg-secondary'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {tab.label}
                  {tab.id === 'sync' && syncState.pendingChanges > 0 && (
                    <span className="ml-auto rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-medium">
                      {syncState.pendingChanges}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 px-3 py-2.5 h-auto',
                isDarkMode 
                  ? 'hover:bg-secondary text-yellow-400' 
                  : 'hover:bg-secondary text-slate-600'
              )}
              onClick={toggleDarkMode}
            >
              <div className="p-1.5 rounded-lg bg-secondary">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </div>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-72 border-r bg-gradient-to-b from-card to-background flex-col z-50 transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">InterviewIQ</h1>
                <p className="text-xs text-muted-foreground">Interview Prep</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded-lg',
                    isActive ? 'bg-white/20' : 'bg-secondary'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {tab.label}
                  {tab.id === 'sync' && syncState.pendingChanges > 0 && (
                    <span className="ml-auto rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-xs font-medium">
                      {syncState.pendingChanges}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 px-3 py-2.5 h-auto',
                isDarkMode 
                  ? 'hover:bg-secondary text-yellow-400' 
                  : 'hover:bg-secondary text-slate-600'
              )}
              onClick={toggleDarkMode}
            >
              <div className="p-1.5 rounded-lg bg-secondary">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </div>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
