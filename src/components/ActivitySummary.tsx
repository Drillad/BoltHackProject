import React, { useState, useEffect } from 'react';
import { Users, Plus, Eye, Edit, Trash2, Search, Filter, Calendar, Clock, Target, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ActivitySummaryProps {
  onNavigate?: (tab: string, data?: any) => void;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ onNavigate }) => {
  const { t, getActivities, settings } = useApp();
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    t('teachingMethod.interactive'),
    t('teachingMethod.cooperative'),
    t('teachingMethod.inquiry'),
    t('teachingMethod.project'),
    settings.language === 'th' ? 'เทคโนโลยีการศึกษา' : settings.language === 'en' ? 'Educational Technology' : '教育技术'
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedCategory]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    setFilteredActivities(filtered);
  };

  const handlePreview = (activity: any) => {
    setSelectedActivity(activity);
    setShowPreview(true);
  };

  const handleEdit = (activity: any) => {
    // Pass activity data to the activity designer
    if (onNavigate) {
      onNavigate('activity-designer', activity);
    } else {
      // Fallback: store in localStorage and navigate
      localStorage.setItem('editingActivity', JSON.stringify(activity));
      window.location.hash = '#activity-designer';
      window.location.reload();
    }
  };

  const handleCreateNew = () => {
    // Clear any existing editing data
    localStorage.removeItem('editingActivity');
    if (onNavigate) {
      onNavigate('activity-designer');
    } else {
      window.location.hash = '#activity-designer';
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Users className="h-8 w-8 mr-3 text-green-600 dark:text-green-400" />
              {settings.language === 'th' ? 'กิจกรรมทั้งหมด' : 
               settings.language === 'en' ? 'All Activities' : 
               '所有活动'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {settings.language === 'th' ? 'จัดการและดูกิจกรรมการเรียนรู้ของคุณ' : 
               settings.language === 'en' ? 'Manage and view your learning activities' : 
               '管理和查看您的学习活动'}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างกิจกรรมใหม่' : 
             settings.language === 'en' ? 'Create New Activity' : 
             '创建新活动'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={settings.language === 'th' ? 'ค้นหากิจกรรม...' : 
                          settings.language === 'en' ? 'Search activities...' : 
                          '搜索活动...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span>
              {settings.language === 'th' ? 'ทั้งหมด' : 
               settings.language === 'en' ? 'Total' : 
               '总共'} {filteredActivities.length} {settings.language === 'th' ? 'กิจกรรม' : 
                                                  settings.language === 'en' ? 'activities' : 
                                                  '活动'}
            </span>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{activity.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {activity.category && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {activity.category}
                      </div>
                    )}
                    {activity.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.duration} {settings.language === 'th' ? 'นาที' : 
                                           settings.language === 'en' ? 'minutes' : 
                                           '分钟'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activity.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{activity.description}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {settings.language === 'th' ? 'สร้างเมื่อ' : 
                   settings.language === 'en' ? 'Created on' : 
                   '创建于'} {new Date(activity.created_at).toLocaleDateString(
                    settings.language === 'th' ? 'th-TH' : 
                    settings.language === 'en' ? 'en-US' : 'zh-CN'
                  )}
                </div>
                {activity.updated_at !== activity.created_at && (
                  <div>
                    {settings.language === 'th' ? 'แก้ไขล่าสุด' : 
                     settings.language === 'en' ? 'Last edited' : 
                     '最后编辑'} {new Date(activity.updated_at).toLocaleDateString(
                      settings.language === 'th' ? 'th-TH' : 
                      settings.language === 'en' ? 'en-US' : 'zh-CN'
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(activity)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'ดูตัวอย่าง' : 
                   settings.language === 'en' ? 'Preview' : 
                   '预览'}
                </button>
                <button
                  onClick={() => handleEdit(activity)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'แก้ไข' : 
                   settings.language === 'en' ? 'Edit' : 
                   '编辑'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {settings.language === 'th' ? 'ไม่พบกิจกรรม' : 
             settings.language === 'en' ? 'No activities found' : 
             '未找到活动'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm || selectedCategory !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')
              ? (settings.language === 'th' ? 'ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา' : 
                 settings.language === 'en' ? 'No activities match your search criteria' : 
                 '没有符合您搜索条件的活动') 
              : (settings.language === 'th' ? 'คุณยังไม่มีกิจกรรม เริ่มสร้างกิจกรรมแรกของคุณ' : 
                 settings.language === 'en' ? 'You don\'t have any activities yet. Start creating your first activity' : 
                 '您还没有任何活动。开始创建您的第一个活动')
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างกิจกรรมใหม่' : 
             settings.language === 'en' ? 'Create New Activity' : 
             '创建新活动'}
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedActivity.name}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                {selectedActivity.category && <span>{settings.language === 'th' ? 'ประเภท:' : settings.language === 'en' ? 'Category:' : '类别:'} {selectedActivity.category}</span>}
                {selectedActivity.duration && <span>{settings.language === 'th' ? 'เวลา:' : settings.language === 'en' ? 'Duration:' : '时间:'} {selectedActivity.duration} {settings.language === 'th' ? 'นาที' : settings.language === 'en' ? 'minutes' : '分钟'}</span>}
                {selectedActivity.group_size && <span>{settings.language === 'th' ? 'ขนาดกลุ่ม:' : settings.language === 'en' ? 'Group Size:' : '小组规模:'} {selectedActivity.group_size}</span>}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedActivity.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'คำอธิบายกิจกรรม' : 
                     settings.language === 'en' ? 'Activity Description' : 
                     '活动描述'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedActivity.description}</p>
                  </div>
                </div>
              )}

              {selectedActivity.objectives && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'จุดประสงค์การเรียนรู้' : 
                     settings.language === 'en' ? 'Learning Objectives' : 
                     '学习目标'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedActivity.objectives}</p>
                  </div>
                </div>
              )}

              {selectedActivity.instructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'ขั้นตอนการดำเนินกิจกรรม' : 
                     settings.language === 'en' ? 'Activity Procedures' : 
                     '活动步骤'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedActivity.instructions}</p>
                  </div>
                </div>
              )}

              {selectedActivity.materials && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'วัสดุอุปกรณ์' : 
                     settings.language === 'en' ? 'Materials and Equipment' : 
                     '材料和设备'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedActivity.materials}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {settings.language === 'th' ? 'ปิด' : 
                 settings.language === 'en' ? 'Close' : 
                 '关闭'}
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleEdit(selectedActivity);
                }}
                className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                {settings.language === 'th' ? 'แก้ไขกิจกรรมนี้' : 
                 settings.language === 'en' ? 'Edit this activity' : 
                 '编辑此活动'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;