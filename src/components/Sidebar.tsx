import React from 'react';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  BarChart3, 
  User, 
  Lightbulb, 
  ExternalLink,
  TrendingUp,
  Calendar,
  Home
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, sidebarOpen, setSidebarOpen }) => {
  const { t } = useApp();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'lesson-planner', label: t('nav.lessonPlanner'), icon: BookOpen },
    { id: 'activity-designer', label: t('nav.activityDesigner'), icon: Users },
    { id: 'test-builder', label: t('nav.testBuilder'), icon: ClipboardList },
    { id: 'student-assessment', label: t('nav.studentAssessment'), icon: BarChart3 },
    { id: 'student-profiles', label: t('nav.studentProfiles'), icon: User },
    { id: 'teaching-methods', label: t('nav.teachingMethods'), icon: Lightbulb },
    { id: 'teaching-resources', label: t('nav.teachingResources'), icon: BookOpen },
    { id: 'google-integrations', label: t('nav.googleIntegrations'), icon: ExternalLink },
    { id: 'performance-analytics', label: t('nav.performanceAnalytics'), icon: TrendingUp }
  ];

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TeachAI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 border-r-2 border-indigo-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 TeachAI Assistant
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;