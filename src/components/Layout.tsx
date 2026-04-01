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
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-red-500 to-red-600', textColor: 'text-red-500' },
  { id: 'profile', label: 'My Profile', icon: User, color: 'from-orange-500 to-orange-600', textColor: 'text-orange-500' },
  { id: 'companies', label: 'Companies', icon: Building2, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-500' },
  { id: 'questions', label: 'Q&A', icon: MessageCircleQuestion, color: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-600' },
  { id: 'practice', label: 'Practice', icon: Code, color: 'from-lime-500 to-lime-600', textColor: 'text-lime-600' },
  { id: 'interview-hub', label: 'Interview Hub', icon: BookOpen, color: 'from-green-500 to-green-600', textColor: 'text-green-500' },
  { id: 'materials', label: 'Materials', icon: StickyNote, color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-500' },
  { id: 'interviews', label: 'Interviews', icon: Calendar, color: 'from-teal-500 to-teal-600', textColor: 'text-teal-500' },
  { id: 'sync', label: 'Sync', icon: RefreshCw, color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-500' },
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rainbow-gradient flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">IQ</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">InterviewIQ</h1>
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
        <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-purple-200 dark:border-purple-800 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950 dark:via-purple-950 dark:to-pink-950">
          <div className="flex flex-col w-full h-full">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rainbow-gradient flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-lg">IQ</span>
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">InterviewIQ</h1>
                  <p className="text-xs bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent font-medium">Interview Prep</p>
                </div>
              </div>
            </div>
          
            <nav className="flex-1 p-2 space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-sm`
                        : `${tab.textColor} hover:bg-accent hover:text-accent-foreground`
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'sync' && syncState.pendingChanges > 0 && (
                      <span className="ml-auto rounded-full bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[10px] font-medium">
                        {syncState.pendingChanges}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-2 border-t border-border">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 px-3 py-2 h-auto text-sm',
                  isDarkMode 
                    ? 'hover:bg-accent text-yellow-500' 
                    : 'hover:bg-accent text-slate-600'
                )}
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-72 border-r bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-violet-900 dark:via-purple-900 dark:to-pink-900 flex-col z-50 transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b border-purple-200 dark:border-purple-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rainbow-gradient flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <div>
                <h1 className="text-base font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">InterviewIQ</h1>
                <p className="text-xs bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent font-medium">Interview Prep</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-sm`
                      : `${tab.textColor} hover:bg-accent hover:text-accent-foreground`
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'sync' && syncState.pendingChanges > 0 && (
                    <span className="ml-auto rounded-full bg-destructive text-destructive-foreground px-1.5 py-0.5 text-[10px] font-medium">
                      {syncState.pendingChanges}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 px-3 py-2 h-auto text-sm',
                isDarkMode 
                  ? 'hover:bg-accent text-yellow-500' 
                  : 'hover:bg-accent text-slate-600'
              )}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="min-h-full">
            {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
