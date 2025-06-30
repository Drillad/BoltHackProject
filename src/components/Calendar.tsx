import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { th, enUS, zhCN } from 'date-fns/locale';
import { useApp } from '../contexts/AppContext';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'meeting' | 'event';
  location?: string;
}

const Calendar: React.FC = () => {
  const { t, settings } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const locale = settings.language === 'th' ? th : settings.language === 'zh' ? zhCN : enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: settings.language === 'th' ? 'ภาษาไทย ม.1/1' : 
             settings.language === 'en' ? 'Thai Language M.1/1' : 
             '泰语 M.1/1',
      time: '08:00',
      type: 'class',
      location: settings.language === 'th' ? 'ห้อง 101' : 
                settings.language === 'en' ? 'Room 101' : 
                '101室'
    },
    {
      id: '2',
      title: settings.language === 'th' ? 'ภาษาไทย ม.1/2' : 
             settings.language === 'en' ? 'Thai Language M.1/2' : 
             '泰语 M.1/2',
      time: '10:00',
      type: 'class',
      location: settings.language === 'th' ? 'ห้อง 102' : 
                settings.language === 'en' ? 'Room 102' : 
                '102室'
    },
    {
      id: '3',
      title: settings.language === 'th' ? 'ประชุมครู' : 
             settings.language === 'en' ? 'Teacher Meeting' : 
             '教师会议',
      time: '14:00',
      type: 'meeting',
      location: settings.language === 'th' ? 'ห้องประชุม' : 
                settings.language === 'en' ? 'Meeting Room' : 
                '会议室'
    }
  ];

  const todayEvents = events.filter(event => isToday(selectedDate));

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
      case 'event': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const dayNames = settings.language === 'th' ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] :
                   settings.language === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
                   ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          {t('calendar.title')}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map((day, index) => (
          <div key={index} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day)}
            className={`p-2 text-center text-sm rounded-lg transition-colors ${
              !isSameMonth(day, currentDate)
                ? 'text-gray-300 dark:text-gray-600'
                : isToday(day)
                ? 'bg-indigo-600 text-white font-semibold'
                : isSameDay(day, selectedDate)
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>

      {/* Today's Events */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          {isToday(selectedDate) ? 
            (settings.language === 'th' ? 'กิจกรรมวันนี้' : 
             settings.language === 'en' ? 'Today\'s Events' :
             '今日活动') : 
            `${settings.language === 'th' ? 'กิจกรรมวันที่' :
              settings.language === 'en' ? 'Events on' :
              '活动日期'} ${format(selectedDate, 'd MMMM', { locale })}`}
        </h4>
        <div className="space-y-2">
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} cursor-pointer hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        <Clock className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <MapPin className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {settings.language === 'th' ? 'ไม่มีกิจกรรมในวันนี้' :
               settings.language === 'en' ? 'No events today' :
               '今天没有活动'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;