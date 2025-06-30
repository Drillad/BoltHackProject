import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LessonPlanner from './components/LessonPlanner';
import LessonSummary from './components/LessonSummary';
import ActivityDesigner from './components/ActivityDesigner';
import ActivitySummary from './components/ActivitySummary';
import TestBuilder from './components/TestBuilder';
import TestSummary from './components/TestSummary';
import StudentAssessment from './components/StudentAssessment';
import StudentProfiles from './components/StudentProfiles';
import TeachingMethods from './components/TeachingMethods';
import TeachingResources from './components/TeachingResources';
import GoogleIntegrations from './components/GoogleIntegrations';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Settings/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, settings } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: string, data?: any) => {
    setActiveTab(tab);
    
    // Handle data passing for editing
    if (data) {
      if (tab === 'lesson-planner') {
        // Store lesson data for editing
        localStorage.setItem('editingLesson', JSON.stringify(data));
      } else if (tab === 'activity-designer') {
        // Store activity data for editing
        localStorage.setItem('editingActivity', JSON.stringify(data));
      } else if (tab === 'test-builder') {
        // Store test data for editing
        localStorage.setItem('editingTest', JSON.stringify(data));
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={handleTabChange} />;
      case 'lesson-planner':
        return <LessonPlanner />;
      case 'lesson-summary':
        return <LessonSummary onNavigate={handleTabChange} />;
      case 'activity-designer':
        return <ActivityDesigner />;
      case 'activity-summary':
        return <ActivitySummary onNavigate={handleTabChange} />;
      case 'test-builder':
        return <TestBuilder />;
      case 'test-summary':
        return <TestSummary onNavigate={handleTabChange} />;
      case 'student-assessment':
        return <StudentAssessment />;
      case 'student-profiles':
        return <StudentProfiles />;
      case 'teaching-methods':
        return <TeachingMethods />;
      case 'teaching-resources':
        return <TeachingResources />;
      case 'google-integrations':
        return <GoogleIntegrations />;
      case 'performance-analytics':
        return <PerformanceAnalytics />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onTabChange={handleTabChange} />;
    }
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.theme === 'dark' ? 'dark bg-dark-background text-dark-text-primary' : 'bg-light-background text-light-text-primary'
    }`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;