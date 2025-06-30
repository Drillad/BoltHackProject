import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Eye, Edit, Trash2, Search, Filter, Calendar, Clock, User, ChevronRight, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface TestSummaryProps {
  onNavigate?: (tab: string, data?: any) => void;
}

const TestSummary: React.FC<TestSummaryProps> = ({ onNavigate }) => {
  const { t, getTests, settings } = useApp();
  const [tests, setTests] = useState<any[]>([]);
  const [filteredTests, setFilteredTests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedGrade, setSelectedGrade] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<any>(null);
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
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [tests, searchTerm, selectedSubject, selectedGrade]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const data = await getTests();
      setTests(data);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;

    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(test => test.subject === selectedSubject);
    }

    if (selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(test => test.grade === selectedGrade);
    }

    setFilteredTests(filtered);
  };

  const handlePreview = (test: any) => {
    setSelectedTest(test);
    setShowPreview(true);
  };

  const handleEdit = (test: any) => {
    // Pass test data to the test builder
    if (onNavigate) {
      onNavigate('test-builder', test);
    } else {
      // Fallback: store in localStorage and navigate
      localStorage.setItem('editingTest', JSON.stringify(test));
      window.location.hash = '#test-builder';
      window.location.reload();
    }
  };

  const handleCreateNew = () => {
    // Clear any existing editing data
    localStorage.removeItem('editingTest');
    if (onNavigate) {
      onNavigate('test-builder');
    } else {
      window.location.hash = '#test-builder';
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
              <ClipboardList className="h-8 w-8 mr-3 text-orange-600 dark:text-orange-400" />
              {settings.language === 'th' ? 'แบบทดสอบทั้งหมด' : 
               settings.language === 'en' ? 'All Tests' : 
               '所有测试'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {settings.language === 'th' ? 'จัดการและดูแบบทดสอบของคุณ' : 
               settings.language === 'en' ? 'Manage and view your tests' : 
               '管理和查看您的测试'}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างแบบทดสอบใหม่' : 
             settings.language === 'en' ? 'Create New Test' : 
             '创建新测试'}
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
              placeholder={settings.language === 'th' ? 'ค้นหาแบบทดสอบ...' : 
                          settings.language === 'en' ? 'Search tests...' : 
                          '搜索测试...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span>
              {settings.language === 'th' ? 'ทั้งหมด' : 
               settings.language === 'en' ? 'Total' : 
               '总共'} {filteredTests.length} {settings.language === 'th' ? 'แบบทดสอบ' : 
                                              settings.language === 'en' ? 'tests' : 
                                              '测试'}
            </span>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{test.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      {test.subject}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {test.grade}
                    </div>
                    {test.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {test.duration} {settings.language === 'th' ? 'นาที' : 
                                        settings.language === 'en' ? 'minutes' : 
                                        '分钟'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {test.questions?.length || 0} {settings.language === 'th' ? 'ข้อ' : 
                                                   settings.language === 'en' ? 'questions' : 
                                                   '题'}
                    </div>
                    <div className="flex items-center">
                      <span>{test.total_points || 0} {settings.language === 'th' ? 'คะแนน' : 
                                                     settings.language === 'en' ? 'points' : 
                                                     '分'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {test.instructions && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{test.instructions}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {settings.language === 'th' ? 'สร้างเมื่อ' : 
                   settings.language === 'en' ? 'Created on' : 
                   '创建于'} {new Date(test.created_at).toLocaleDateString(
                    settings.language === 'th' ? 'th-TH' : 
                    settings.language === 'en' ? 'en-US' : 'zh-CN'
                  )}
                </div>
                {test.updated_at !== test.created_at && (
                  <div>
                    {settings.language === 'th' ? 'แก้ไขล่าสุด' : 
                     settings.language === 'en' ? 'Last edited' : 
                     '最后编辑'} {new Date(test.updated_at).toLocaleDateString(
                      settings.language === 'th' ? 'th-TH' : 
                      settings.language === 'en' ? 'en-US' : 'zh-CN'
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(test)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'ดูตัวอย่าง' : 
                   settings.language === 'en' ? 'Preview' : 
                   '预览'}
                </button>
                <button
                  onClick={() => handleEdit(test)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors text-sm"
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
          <ClipboardList className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {settings.language === 'th' ? 'ไม่พบแบบทดสอบ' : 
             settings.language === 'en' ? 'No tests found' : 
             '未找到测试'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm || selectedSubject !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') || selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') 
              ? (settings.language === 'th' ? 'ไม่พบแบบทดสอบที่ตรงกับเงื่อนไขการค้นหา' : 
                 settings.language === 'en' ? 'No tests match your search criteria' : 
                 '没有符合您搜索条件的测试')
              : (settings.language === 'th' ? 'คุณยังไม่มีแบบทดสอบ เริ่มสร้างแบบทดสอบแรกของคุณ' : 
                 settings.language === 'en' ? 'You don\'t have any tests yet. Start creating your first test' : 
                 '您还没有任何测试。开始创建您的第一个测试')
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'สร้างแบบทดสอบใหม่' : 
             settings.language === 'en' ? 'Create New Test' : 
             '创建新测试'}
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTest.title}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  {settings.language === 'th' ? 'วิชา:' : settings.language === 'en' ? 'Subject:' : '科目:'} {selectedTest.subject} | 
                  {settings.language === 'th' ? 'ระดับชั้น:' : settings.language === 'en' ? 'Grade:' : '年级:'} {selectedTest.grade} | 
                  {settings.language === 'th' ? 'เวลา:' : settings.language === 'en' ? 'Duration:' : '时间:'} {selectedTest.duration} {settings.language === 'th' ? 'นาที' : settings.language === 'en' ? 'minutes' : '分钟'}
                </p>
                {selectedTest.instructions && <p className="mt-2">{settings.language === 'th' ? 'คำแนะนำ:' : settings.language === 'en' ? 'Instructions:' : '说明:'} {selectedTest.instructions}</p>}
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {selectedTest.questions?.map((question: any, index: number) => (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {settings.language === 'th' ? 'ข้อ' : 
                         settings.language === 'en' ? 'Question' : 
                         '题'} {index + 1}. {question.question}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">({question.points} {settings.language === 'th' ? 'คะแนน' : 
                                                                                settings.language === 'en' ? 'points' : 
                                                                                '分'})</span>
                    </div>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              className="text-orange-600 dark:bg-gray-700"
                              disabled
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name={`question-${question.id}`} disabled />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {settings.language === 'th' ? 'ถูก' : 
                             settings.language === 'en' ? 'True' : 
                             '正确'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" name={`question-${question.id}`} disabled />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {settings.language === 'th' ? 'ผิด' : 
                             settings.language === 'en' ? 'False' : 
                             '错误'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder={settings.language === 'th' ? 'พิมพ์คำตอบ...' : 
                                    settings.language === 'en' ? 'Type answer...' : 
                                    '输入答案...'}
                        disabled
                      />
                    )}
                    
                    {question.type === 'essay' && (
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder={settings.language === 'th' ? 'เขียนคำตอบ...' : 
                                    settings.language === 'en' ? 'Write answer...' : 
                                    '写答案...'}
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
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
                  handleEdit(selectedTest);
                }}
                className="px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
              >
                {settings.language === 'th' ? 'แก้ไขแบบทดสอบนี้' : 
                 settings.language === 'en' ? 'Edit this test' : 
                 '编辑此测试'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSummary;