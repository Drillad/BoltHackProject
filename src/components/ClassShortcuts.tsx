import React from 'react';
import { Users, Clock, MapPin, BookOpen, ChevronRight, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  time: string;
  location: string;
  students: number;
  nextClass?: string;
  status: 'current' | 'upcoming' | 'completed';
}

interface ClassShortcutsProps {
  onViewClass?: (classId: string) => void;
}

const ClassShortcuts: React.FC<ClassShortcutsProps> = ({ onViewClass }) => {
  const { t, settings } = useApp();

  const classes: ClassInfo[] = [
    {
      id: '1',
      name: 'ม.1/1',
      subject: settings.language === 'th' ? 'ภาษาไทย' : 
               settings.language === 'en' ? 'Thai Language' : 
               '泰语',
      time: '08:00 - 09:00',
      location: settings.language === 'th' ? 'ห้อง 101' : 
                settings.language === 'en' ? 'Room 101' : 
                '101室',
      students: 35,
      status: 'current'
    },
    {
      id: '2',
      name: 'ม.1/2',
      subject: settings.language === 'th' ? 'ภาษาไทย' : 
               settings.language === 'en' ? 'Thai Language' : 
               '泰语',
      time: '10:00 - 11:00',
      location: settings.language === 'th' ? 'ห้อง 102' : 
                settings.language === 'en' ? 'Room 102' : 
                '102室',
      students: 33,
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'ม.2/1',
      subject: settings.language === 'th' ? 'ภาษาไทย' : 
               settings.language === 'en' ? 'Thai Language' : 
               '泰语',
      time: '13:00 - 14:00',
      location: settings.language === 'th' ? 'ห้อง 201' : 
                settings.language === 'en' ? 'Room 201' : 
                '201室',
      students: 32,
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'ม.2/2',
      subject: settings.language === 'th' ? 'ภาษาไทย' : 
               settings.language === 'en' ? 'Thai Language' : 
               '泰语',
      time: '14:00 - 15:00',
      location: settings.language === 'th' ? 'ห้อง 202' : 
                settings.language === 'en' ? 'Room 202' : 
                '202室',
      students: 34,
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current': 
        return settings.language === 'th' ? 'กำลังสอน' : 
               settings.language === 'en' ? 'Current' : 
               '当前';
      case 'upcoming': 
        return settings.language === 'th' ? 'ถัดไป' : 
               settings.language === 'en' ? 'Upcoming' : 
               '即将到来';
      case 'completed': 
        return settings.language === 'th' ? 'เสร็จแล้ว' : 
               settings.language === 'en' ? 'Completed' : 
               '已完成';
      default: return '';
    }
  };

  const handleClassClick = (classInfo: ClassInfo) => {
    if (onViewClass) {
      onViewClass(classInfo.id);
    }
    // Could also navigate to a detailed class view
    console.log('Viewing class:', classInfo);
  };

  const handleViewAllClasses = () => {
    // Navigate to a comprehensive class management page
    console.log('Navigate to all classes view');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          {t('class.myClasses')}
        </h3>
        <button 
          onClick={handleViewAllClasses}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center"
        >
          {t('class.viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {classes.map((classInfo) => (
          <div
            key={classInfo.id}
            onClick={() => handleClassClick(classInfo)}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {classInfo.subject} {classInfo.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(classInfo.status)}`}>
                      {getStatusText(classInfo.status)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassClick(classInfo);
                      }}
                      className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={settings.language === 'th' ? 'ดูรายละเอียดชั้นเรียน' : 
                             settings.language === 'en' ? 'View class details' : 
                             '查看班级详情'}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    {classInfo.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    {classInfo.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    {classInfo.students} {settings.language === 'th' ? 'คน' : 
                                          settings.language === 'en' ? 'students' : 
                                          '人'}
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ml-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.open('https://meet.google.com/', '_blank')}
            className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
          >
            {t('class.joinGoogleMeet')}
          </button>
          <button 
            onClick={() => window.open('https://classroom.google.com/', '_blank')}
            className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm font-medium"
          >
            {t('class.openGoogleClassroom')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassShortcuts;