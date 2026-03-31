import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard, Companies, QAView, Practice, InterviewHub, Materials, Interviews, Sync, Profile } from './features';
import { CompanyDetail } from './features/companies/CompanyDetail';
import { RotateCcw } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCompanyDetail, setIsCompanyDetail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkCompanyDetail = () => {
      setIsCompanyDetail(window.location.pathname.startsWith('/company/'));
    };
    checkCompanyDetail();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = () => {
    if (isCompanyDetail) {
      return <CompanyDetail />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'profile':
        return <Profile />;
      case 'companies':
        return <Companies />;
      case 'questions':
        return <QAView />;
      case 'practice':
        return <Practice />;
      case 'interview-hub':
        return <InterviewHub />;
      case 'materials':
        return <Materials />;
      case 'interviews':
        return <Interviews />;
      case 'sync':
        return <Sync />;
      default:
        return <Dashboard />;
    }
  };

  if (isCompanyDetail) {
    return <CompanyDetail />;
  }

  return (
    <>
      {isMobile && isPortrait && (
        <div className="rotate-device-notice fixed inset-0 z-[9999] bg-background flex-col items-center justify-center gap-4 hidden">
          <RotateCcw className="h-16 w-16 text-muted-foreground animate-spin" style={{ animationDuration: '3s' }} />
          <p className="text-lg font-medium text-center px-8">Please rotate your device to landscape mode for the best experience</p>
        </div>
      )}
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
}

export default App;
