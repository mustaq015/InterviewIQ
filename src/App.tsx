import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard, Companies, QAView, Practice, InterviewHub, Materials, Interviews, Sync, Profile } from './features';
import { CompanyDetail } from './features/companies/CompanyDetail';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCompanyDetail, setIsCompanyDetail] = useState(false);

  useEffect(() => {
    const checkCompanyDetail = () => {
      setIsCompanyDetail(window.location.pathname.startsWith('/company/'));
    };
    checkCompanyDetail();
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
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
