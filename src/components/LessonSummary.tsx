import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Eye, Edit, Trash2, Search, Filter, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LessonSummaryProps {
  onNavigate?: (tab: string, data?: any) => void;
}

const LessonSummary: React.FC<LessonSummaryProps> = ({ onNavigate }) => {
  const { t, getLessonPlans, settings } = useApp();
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedGrade, setSelectedGrade] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const subjects = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
    settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
    settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究',
    settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语'
  ];
  
  const grades = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    settings.language === 'th' ? 'ป.1' : settings.language === 'en' ? 'Grade 1' : '1年级',
    settings.language === 'th' ? 'ป.2' : settings.language === 'en' ? 'Grade 2' : '2年级',
    settings.language === 'th' ? 'ป.3' : settings.language === 'en' ? 'Grade 3' : '3年级',
    settings.language === 'th' ? 'ป.4' : settings.language === 'en' ? 'Grade 4' : '4年级',
    settings.language === 'th' ? 'ป.5' : settings.language === 'en' ? 'Grade 5' : '5年级',
    settings.language === 'th' ? 'ป.6' : settings.language === 'en' ? 'Grade 6' : '6年级',
    settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
    settings.language === 'th' ? 'ม.2' : settings.language === 'en' ? 'Grade 8' : '8年级',
    settings.language === 'th' ? 'ม.3' : settings.language === 'en' ? 'Grade 9' : '9年级',
    settings.language === 'th' ? 'ม.4' : settings.language === 'en' ? 'Grade 10' : '10年级',
    settings.language === 'th' ? 'ม.5' : settings.language === 'en' ? 'Grade 11' : '11年级',
    settings.language === 'th' ? 'ม.6' : settings.language === 'en' ? 'Grade 12' : '12年级'
  ];

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchTerm, selectedSubject, selectedGrade]);

  const loadLessons = async () => {
    setIsLoading(true);
    try {
      const data = await getLessonPlans();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = lessons;

    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(lesson => lesson.subject === selectedSubject);
    }

    if (selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(lesson => lesson.grade === selectedGrade);
    }

    setFilteredLessons(filtered);
  };

  const handlePreview = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowPreview(true);
  };

  const handleEdit = (lesson: any) => {
    // Pass lesson data to the lesson planner
    if (onNavigate) {
      onNavigate('lesson-planner', lesson);
    } else {
      // Fallback: store in localStorage and navigate
      localStorage.setItem('editingLesson', JSON.stringify(lesson));
      window.location.hash = '#lesson-planner';
      window.location.reload();
    }
  };

  const handleCreateNew = () => {
    // Clear any existing editing data
    localStorage.removeItem('editingLesson');
    if (onNavigate) {
      onNavigate('lesson-planner');
    } else {
      window.location.hash = '#lesson-planner';
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
              <BookOpen className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              {settings.language === 'th' ? 'แผนการสอนทั้งหมด' : 
               settings.language === 'en' ? 'All Lesson Plans' : 
               '所有课程计划'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {settings.language === 'th' ? 'จัดการและดูแผนการสอนของคุณ' : 
               settings.language === 'en' ? 'Manage and view your lesson plans' : 
               '管理和查看您的课程计划'}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างแผนการสอนใหม่' : 
             settings.language === 'en' ? 'Create New Lesson Plan' : 
             '创建新课程计划'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={settings.language === 'th' ? 'ค้นหาแผนการสอน...' : 
                          settings.language === 'en' ? 'Search lesson plans...' : 
                          '搜索课程计划...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span>
              {settings.language === 'th' ? 'ทั้งหมด' : 
               settings.language === 'en' ? 'Total' : 
               '总共'} {filteredLessons.length} {settings.language === 'th' ? 'แผน' : 
                                                settings.language === 'en' ? 'plans' : 
                                                '计划'}
            </span>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{lesson.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {lesson.subject}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {lesson.grade}
                    </div>
                    {lesson.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration} {settings.language === 'th' ? 'นาที' : 
                                          settings.language === 'en' ? 'minutes' : 
                                          '分钟'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {lesson.objectives && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{lesson.objectives}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {settings.language === 'th' ? 'สร้างเมื่อ' : 
                   settings.language === 'en' ? 'Created on' : 
                   '创建于'} {new Date(lesson.created_at).toLocaleDateString(
                    settings.language === 'th' ? 'th-TH' : 
                    settings.language === 'en' ? 'en-US' : 'zh-CN'
                  )}
                </div>
                {lesson.updated_at !== lesson.created_at && (
                  <div>
                    {settings.language === 'th' ? 'แก้ไขล่าสุด' : 
                     settings.language === 'en' ? 'Last edited' : 
                     '最后编辑'} {new Date(lesson.updated_at).toLocaleDateString(
                      settings.language === 'th' ? 'th-TH' : 
                      settings.language === 'en' ? 'en-US' : 'zh-CN'
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(lesson)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'ดูตัวอย่าง' : 
                   settings.language === 'en' ? 'Preview' : 
                   '预览'}
                </button>
                <button
                  onClick={() => handleEdit(lesson)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm"
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
          <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {settings.language === 'th' ? 'ไม่พบแผนการสอน' : 
             settings.language === 'en' ? 'No lesson plans found' : 
             '未找到课程计划'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm || selectedSubject !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') || selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') 
              ? (settings.language === 'th' ? 'ไม่พบแผนการสอนที่ตรงกับเงื่อนไขการค้นหา' : 
                 settings.language === 'en' ? 'No lesson plans match your search criteria' : 
                 '没有符合您搜索条件的课程计划')
              : (settings.language === 'th' ? 'คุณยังไม่มีแผนการสอน เริ่มสร้างแผนการสอนแรกของคุณ' : 
                 settings.language === 'en' ? 'You don\'t have any lesson plans yet. Start creating your first lesson plan' : 
                 '您还没有任何课程计划。开始创建您的第一个课程计划')
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างแผนการสอนใหม่' : 
             settings.language === 'en' ? 'Create New Lesson Plan' : 
             '创建新课程计划'}
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLesson.title}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{settings.language === 'th' ? 'วิชา:' : settings.language === 'en' ? 'Subject:' : '科目:'} {selectedLesson.subject}</span>
                <span>{settings.language === 'th' ? 'ระดับชั้น:' : settings.language === 'en' ? 'Grade:' : '年级:'} {selectedLesson.grade}</span>
                {selectedLesson.duration && <span>{settings.language === 'th' ? 'เวลา:' : settings.language === 'en' ? 'Duration:' : '时间:'} {selectedLesson.duration} {settings.language === 'th' ? 'นาที' : settings.language === 'en' ? 'minutes' : '分钟'}</span>}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedLesson.objectives && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'จุดประสงค์การเรียนรู้' : 
                     settings.language === 'en' ? 'Learning Objectives' : 
                     '学习目标'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedLesson.objectives}</p>
                  </div>
                </div>
              )}

              {selectedLesson.activities && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'กิจกรรมการเรียนการสอน' : 
                     settings.language === 'en' ? 'Teaching Activities' : 
                     '教学活动'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedLesson.activities}</p>
                  </div>
                </div>
              )}

              {selectedLesson.materials && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'สื่อและอุปกรณ์' : 
                     settings.language === 'en' ? 'Materials and Equipment' : 
                     '材料和设备'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedLesson.materials}</p>
                  </div>
                </div>
              )}

              {selectedLesson.assessment && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {settings.language === 'th' ? 'การวัดและประเมินผล' : 
                     settings.language === 'en' ? 'Assessment and Evaluation' : 
                     '评估和评价'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedLesson.assessment}</p>
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
                  handleEdit(selectedLesson);
                }}
                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                {settings.language === 'th' ? 'แก้ไขแผนนี้' : 
                 settings.language === 'en' ? 'Edit this plan' : 
                 '编辑此计划'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonSummary;