import React, { useEffect, useState } from 'react';
import { BookOpen, Users, ClipboardList, TrendingUp, Calendar as CalendarIcon, Award, Clock, Target, RefreshCw, ChevronRight, Eye, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Calendar from './Calendar';
import ClassShortcuts from './ClassShortcuts';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const { user, t, getLessonPlans, getActivities, getTests, getStudents, settings } = useApp();
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    lessonPlans: 0,
    activities: 0,
    tests: 0,
    students: 0
  });

  const upcomingTasks = [
    { 
      title: settings.language === 'th' ? 'จัดเตรียมแบบทดสอบปลายภาค' : 
             settings.language === 'en' ? 'Prepare final exam' : 
             '准备期末考试',
      deadline: settings.language === 'th' ? 'วันศุกร์นี้' : 
                settings.language === 'en' ? 'This Friday' : 
                '本周五',
      priority: settings.language === 'th' ? 'สูง' : 
                settings.language === 'en' ? 'High' : 
                '高'
    },
    { 
      title: settings.language === 'th' ? 'ประเมินโครงงานวิทยาศาสตร์' : 
             settings.language === 'en' ? 'Evaluate science projects' : 
             '评估科学项目',
      deadline: settings.language === 'th' ? 'สัปดาห์หน้า' : 
                settings.language === 'en' ? 'Next week' : 
                '下周',
      priority: settings.language === 'th' ? 'ปานกลาง' : 
                settings.language === 'en' ? 'Medium' : 
                '中'
    },
    { 
      title: settings.language === 'th' ? 'สร้างกิจกรรมสำหรับงานวันแม่' : 
             settings.language === 'en' ? 'Create activities for Mother\'s Day' : 
             '为母亲节创建活动',
      deadline: settings.language === 'th' ? '2 สัปดาหิ์' : 
                settings.language === 'en' ? '2 weeks' : 
                '2周',
      priority: settings.language === 'th' ? 'ต่ำ' : 
                settings.language === 'en' ? 'Low' : 
                '低'
    },
  ];

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [lessonPlans, activities, tests, students] = await Promise.all([
        getLessonPlans(),
        getActivities(),
        getTests(),
        getStudents()
      ]);

      // Update stats
      setStats({
        lessonPlans: lessonPlans.length,
        activities: activities.length,
        tests: tests.length,
        students: students.length
      });

      const allActivities = [
        ...lessonPlans.map(item => ({
          title: settings.language === 'th' ? `สร้างแผนการสอน "${item.title}"` :
                  settings.language === 'en' ? `Created lesson plan "${item.title}"` :
                  `创建了课程计划"${item.title}"`,
          time: getTimeAgo(item.created_at),
          icon: BookOpen,
          type: 'lesson'
        })),
        ...activities.map(item => ({
          title: settings.language === 'th' ? `ออกแบบกิจกรรม "${item.name}"` :
                  settings.language === 'en' ? `Designed activity "${item.name}"` :
                  `设计了活动"${item.name}"`,
          time: getTimeAgo(item.created_at),
          icon: Users,
          type: 'activity'
        })),
        ...tests.map(item => ({
          title: settings.language === 'th' ? `สร้างแบบทดสอบ "${item.title}"` :
                  settings.language === 'en' ? `Created test "${item.title}"` :
                  `创建了测试"${item.title}"`,
          time: getTimeAgo(item.created_at),
          icon: ClipboardList,
          type: 'test'
        }))
      ];

      // Sort by creation time and take the 4 most recent
      allActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivities(allActivities.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return settings.language === 'th' ? 'เมื่อสักครู่' :
             settings.language === 'en' ? 'Just now' :
             '刚刚';
    }
    if (diffInHours < 24) {
      return settings.language === 'th' ? `${diffInHours} ชั่วโมงที่แล้ว` :
             settings.language === 'en' ? `${diffInHours} hours ago` :
             `${diffInHours} 小时前`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return settings.language === 'th' ? `${diffInDays} วันที่แล้ว` :
           settings.language === 'en' ? `${diffInDays} days ago` :
           `${diffInDays} 天前`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleStatClick = (type: string) => {
    switch (type) {
      case 'lessonPlans':
        onTabChange('lesson-summary');
        break;
      case 'activities':
        onTabChange('activity-summary');
        break;
      case 'tests':
        onTabChange('test-summary');
        break;
      case 'students':
        onTabChange('student-profiles');
        break;
    }
  };

  const statsConfig = [
    { 
      key: 'lessonPlans',
      label: t('dashboard.lessonPlans'), 
      value: stats.lessonPlans.toString(), 
      icon: BookOpen, 
      color: 'bg-indigo-500 dark:bg-indigo-600',
      hoverColor: 'hover:bg-indigo-600 dark:hover:bg-indigo-700'
    },
    { 
      key: 'activities',
      label: t('dashboard.activities'), 
      value: stats.activities.toString(), 
      icon: Users, 
      color: 'bg-purple-500 dark:bg-purple-600',
      hoverColor: 'hover:bg-purple-600 dark:hover:bg-purple-700'
    },
    { 
      key: 'tests',
      label: t('dashboard.tests'), 
      value: stats.tests.toString(), 
      icon: ClipboardList, 
      color: 'bg-blue-500 dark:bg-blue-600',
      hoverColor: 'hover:bg-blue-600 dark:hover:bg-blue-700'
    },
    { 
      key: 'students',
      label: t('dashboard.students'), 
      value: stats.students.toString(), 
      icon: TrendingUp, 
      color: 'bg-violet-500 dark:bg-violet-600',
      hoverColor: 'hover:bg-violet-600 dark:hover:bg-violet-700'
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.welcome')}, {user?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboard.todayTasks')} 3 {t('dashboard.studentsWaiting')} 15 {t('dashboard.waitingAssessment')}
          </p>
        </div>

        {/* Stats Cards - Now Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <div 
              key={index} 
              onClick={() => handleStatClick(stat.key)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center">
                <div className={`${stat.color} ${stat.hoverColor} p-3 rounded-lg transition-colors group-hover:scale-105 transform duration-200`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar />
          </div>

          {/* Class Shortcuts */}
          <div className="lg:col-span-2">
            <ClassShortcuts />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('dashboard.recentActivities')}
                </h3>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg">
                        <activity.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    {settings.language === 'th' ? 'ยังไม่มีกิจกรรมล่าสุด' :
                     settings.language === 'en' ? 'No recent activities' :
                     '暂无最近活动'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                {t('dashboard.upcomingTasks')}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {task.deadline}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === (settings.language === 'th' ? 'สูง' : settings.language === 'en' ? 'High' : '高') ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      task.priority === (settings.language === 'th' ? 'ปานกลาง' : settings.language === 'en' ? 'Medium' : '中') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.quickActions')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => onTabChange('lesson-planner')}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-xl p-6 text-center hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/30 transition-all group"
            >
              <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">{t('quickAction.createLesson')}</p>
            </button>
            <button 
              onClick={() => onTabChange('test-builder')}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl p-6 text-center hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all group"
            >
              <ClipboardList className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300">{t('quickAction.createTest')}</p>
            </button>
            <button 
              onClick={() => onTabChange('activity-designer')}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 text-center hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all group"
            >
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{t('quickAction.createActivity')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;