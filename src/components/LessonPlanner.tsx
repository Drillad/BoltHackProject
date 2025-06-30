import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, Sparkles, Clock, Users, Target, FileText, Brain, Wand2, CheckCircle, Edit } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LessonPlanner: React.FC = () => {
  const { t, generateAIContent, saveLessonPlan, getLessonPlans, updateLessonPlan, settings } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [lessonData, setLessonData] = useState({
    title: '',
    subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
    duration: '50',
    objectives: '',
    activities: '',
    materials: '',
    assessment: ''
  });

  const [savedLessons, setSavedLessons] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [aiContext, setAiContext] = useState({
    topic: '',
    learningStyle: 'mixed'
  });

  const subjects = settings.language === 'th' ? 
    ['ภาษาไทย', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'สังคมศึกษา', 'ภาษาอังกฤษ', 'ศิลปะ', 'พลศึกษา'] :
    settings.language === 'en' ?
    ['Thai Language', 'Mathematics', 'Science', 'Social Studies', 'English', 'Art', 'Physical Education'] :
    ['泰语', '数学', '科学', '社会研究', '英语', '艺术', '体育'];

  const grades = settings.language === 'th' ? 
    ['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'] :
    settings.language === 'en' ?
    ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] :
    ['1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '7年级', '8年级', '9年级', '10年级', '11年级', '12年级'];

  const learningStyles = [
    { 
      value: 'visual', 
      label: settings.language === 'th' ? 'Visual - การเรียนรู้ผ่านการมองเห็น' :
             settings.language === 'en' ? 'Visual - Learning through seeing' :
             'Visual - 通过视觉学习'
    },
    { 
      value: 'auditory', 
      label: settings.language === 'th' ? 'Auditory - การเรียนรู้ผ่านการฟัง' :
             settings.language === 'en' ? 'Auditory - Learning through hearing' :
             'Auditory - 通过听觉学习'
    },
    { 
      value: 'kinesthetic', 
      label: settings.language === 'th' ? 'Kinesthetic - การเรียนรู้ผ่านการลงมือทำ' :
             settings.language === 'en' ? 'Kinesthetic - Learning through doing' :
             'Kinesthetic - 通过实践学习'
    },
    { 
      value: 'mixed', 
      label: settings.language === 'th' ? 'Mixed - ผสมผสานทุกรูปแบบ' :
             settings.language === 'en' ? 'Mixed - Combination of all styles' :
             'Mixed - 混合所有方式'
    }
  ];

  useEffect(() => {
    loadSavedLessons();
    
    // Check if there's a lesson to edit from localStorage
    const editingLessonData = localStorage.getItem('editingLesson');
    if (editingLessonData) {
      try {
        const lesson = JSON.parse(editingLessonData);
        loadLesson(lesson);
        localStorage.removeItem('editingLesson'); // Clear after loading
      } catch (error) {
        console.error('Error loading lesson from localStorage:', error);
      }
    }
  }, []);

  const loadSavedLessons = async () => {
    const lessons = await getLessonPlans();
    setSavedLessons(lessons);
  };

  const handleGenerateFieldContent = async (field: string) => {
    setIsGenerating(true);
    try {
      const context = {
        subject: lessonData.subject,
        grade: lessonData.grade,
        topic: aiContext.topic || lessonData.title,
        duration: lessonData.duration,
        learningStyle: aiContext.learningStyle
      };
      
      const aiContent = await generateAIContent(field, context);
      handleInputChange(field, aiContent);
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullLesson = async () => {
    setIsGenerating(true);
    try {
      const context = {
        subject: lessonData.subject,
        grade: lessonData.grade,
        topic: aiContext.topic,
        duration: lessonData.duration,
        learningStyle: aiContext.learningStyle
      };
      
      // Generate all sections
      const [objectives, activities, materials, assessment] = await Promise.all([
        generateAIContent('lesson-objectives', context),
        generateAIContent('lesson-activities', context),
        generateAIContent('lesson-materials', context),
        generateAIContent('lesson-assessment', context)
      ]);
      
      setLessonData(prev => ({
        ...prev,
        title: settings.language === 'th' ? `บทเรียน: ${aiContext.topic}` :
               settings.language === 'en' ? `Lesson: ${aiContext.topic}` :
               `课程：${aiContext.topic}`,
        objectives,
        activities,
        materials,
        assessment
      }));
      
      setShowAIPanel(false);
    } catch (error) {
      console.error('Error generating full lesson:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLessonData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveLesson = async () => {
    if (!lessonData.title || !lessonData.subject || !lessonData.grade) {
      const message = settings.language === 'th' ? 'กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน' :
                     settings.language === 'en' ? 'Please fill in all basic information' :
                     '请填写完整的基本信息';
      alert(message);
      return;
    }

    setIsSaving(true);
    try {
      let success;
      if (editingLesson) {
        success = await updateLessonPlan(editingLesson.id, lessonData);
      } else {
        success = await saveLessonPlan(lessonData);
      }

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadSavedLessons();
        // Reset form
        setLessonData({
          title: '',
          subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
          grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
          duration: '50',
          objectives: '',
          activities: '',
          materials: '',
          assessment: ''
        });
        setEditingLesson(null);
      } else {
        const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                       settings.language === 'en' ? 'Error saving data' :
                       '保存数据时出错';
        alert(message);
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                     settings.language === 'en' ? 'Error saving data' :
                     '保存数据时出错';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadLesson = (lesson: any) => {
    setLessonData({
      title: lesson.title,
      subject: lesson.subject,
      grade: lesson.grade,
      duration: lesson.duration?.toString() || '50',
      objectives: lesson.objectives || '',
      activities: lesson.activities || '',
      materials: lesson.materials || '',
      assessment: lesson.assessment || ''
    });
    setEditingLesson(lesson);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
          {t('pages.lessonPlanner.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.lessonPlanner.description')}</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">
            {editingLesson ? 
              (settings.language === 'th' ? 'อัปเดตแผนการสอนเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Lesson plan updated successfully!' :
               '课程计划更新成功！') :
              (settings.language === 'th' ? 'บันทึกแผนการสอนเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Lesson plan saved successfully!' :
               '课程计划保存成功！')
            }
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Lesson Generator */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                {t('ai.help')} - {settings.language === 'th' ? 'สร้างแผนการสอนด้วย AI' :
                                  settings.language === 'en' ? 'Create lesson plan with AI' :
                                  '使用 AI 创建课程计划'}
              </h3>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {showAIPanel ? 
                  (settings.language === 'th' ? 'ซ่อน' : settings.language === 'en' ? 'Hide' : '隐藏') : 
                  (settings.language === 'th' ? 'เปิด' : settings.language === 'en' ? 'Open' : '打开')
                } AI Panel
              </button>
            </div>

            {showAIPanel && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                      {settings.language === 'th' ? 'หัวข้อบทเรียน' :
                       settings.language === 'en' ? 'Lesson Topic' :
                       '课程主题'}
                    </label>
                    <input
                      type="text"
                      value={aiContext.topic}
                      onChange={(e) => setAiContext(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={settings.language === 'th' ? 'เช่น การอ่านจับใจความ' :
                                  settings.language === 'en' ? 'e.g., Reading comprehension' :
                                  '例如：阅读理解'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                      {settings.language === 'th' ? 'รูปแบบการเรียนรู้' :
                       settings.language === 'en' ? 'Learning Style' :
                       '学习方式'}
                    </label>
                    <select
                      value={aiContext.learningStyle}
                      onChange={(e) => setAiContext(prev => ({ ...prev, learningStyle: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {learningStyles.map(style => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateFullLesson}
                  disabled={isGenerating || !aiContext.topic}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isGenerating ? t('ai.generating') : 
                    (settings.language === 'th' ? 'สร้างแผนการสอนด้วย AI' :
                     settings.language === 'en' ? 'Generate lesson plan with AI' :
                     '使用 AI 生成课程计划')
                  }
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingLesson ? 
                (settings.language === 'th' ? 'แก้ไขข้อมูลพื้นฐาน' :
                 settings.language === 'en' ? 'Edit basic information' :
                 '编辑基本信息') :
                (settings.language === 'th' ? 'ข้อมูลพื้นฐาน' :
                 settings.language === 'en' ? 'Basic Information' :
                 '基本信息')
              }
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {settings.language === 'th' ? 'หัวข้อบทเรียน' :
                   settings.language === 'en' ? 'Lesson Title' :
                   '课程标题'}
                </label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={settings.language === 'th' ? 'เช่น การอ่านจับใจความ' :
                              settings.language === 'en' ? 'e.g., Reading comprehension' :
                              '例如：阅读理解'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {settings.language === 'th' ? 'ระยะเวลา (นาที)' :
                   settings.language === 'en' ? 'Duration (minutes)' :
                   '持续时间（分钟）'}
                </label>
                <input
                  type="number"
                  value={lessonData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('form.subject')}
                </label>
                <select
                  value={lessonData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('form.grade')}
                </label>
                <select
                  value={lessonData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          {[
            { 
              field: 'objectives', 
              label: settings.language === 'th' ? 'จุดประสงค์การเรียนรู้' :
                     settings.language === 'en' ? 'Learning Objectives' :
                     '学习目标',
              icon: Target 
            },
            { 
              field: 'activities', 
              label: settings.language === 'th' ? 'กิจกรรมการเรียนการสอน' :
                     settings.language === 'en' ? 'Teaching Activities' :
                     '教学活动',
              icon: Users 
            },
            { 
              field: 'materials', 
              label: settings.language === 'th' ? 'สื่อและอุปกรณ์' :
                     settings.language === 'en' ? 'Materials and Equipment' :
                     '材料和设备',
              icon: FileText 
            },
            { 
              field: 'assessment', 
              label: settings.language === 'th' ? 'การวัดและประเมินผล' :
                     settings.language === 'en' ? 'Assessment and Evaluation' :
                     '评估和评价',
              icon: Clock 
            }
          ].map(section => (
            <div key={section.field} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <section.icon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  {section.label}
                </h3>
                <button
                  onClick={() => handleGenerateFieldContent(section.field)}
                  disabled={isGenerating}
                  className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {isGenerating ? 
                    (settings.language === 'th' ? 'กำลังสร้าง...' :
                     settings.language === 'en' ? 'Generating...' :
                     '生成中...') : 
                    t('ai.help')
                  }
                </button>
              </div>
              <textarea
                value={lessonData[section.field as keyof typeof lessonData]}
                onChange={(e) => handleInputChange(section.field, e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={settings.language === 'th' ? `กรอก${section.label.toLowerCase()}...` :
                            settings.language === 'en' ? `Enter ${section.label.toLowerCase()}...` :
                            `输入${section.label}...`}
              />
            </div>
          ))}

          <div className="flex space-x-4">
            <button 
              onClick={handleSaveLesson}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 
                (settings.language === 'th' ? 'กำลังบันทึก...' :
                 settings.language === 'en' ? 'Saving...' :
                 '保存中...') : 
                editingLesson ? 
                  (settings.language === 'th' ? 'อัปเดตแผนการสอน' :
                   settings.language === 'en' ? 'Update lesson plan' :
                   '更新课程计划') :
                  (settings.language === 'th' ? 'บันทึกแผนการสอน' :
                   settings.language === 'en' ? 'Save lesson plan' :
                   '保存课程计划')
              }
            </button>
            <button 
              onClick={() => {
                setLessonData({
                  title: '',
                  subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
                  grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
                  duration: '50',
                  objectives: '',
                  activities: '',
                  materials: '',
                  assessment: ''
                });
                setEditingLesson(null);
              }}
              className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              {settings.language === 'th' ? 'สร้างใหม่' :
               settings.language === 'en' ? 'Create New' :
               '新建'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {settings.language === 'th' ? 'แผนการสอนที่บันทึกไว้' :
               settings.language === 'en' ? 'Saved Lesson Plans' :
               '已保存的课程计划'}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedLessons.length > 0 ? (
                savedLessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.subject} • {lesson.grade}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(lesson.created_at).toLocaleDateString(
                        settings.language === 'th' ? 'th-TH' : 
                        settings.language === 'en' ? 'en-US' : 'zh-CN'
                      )}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => loadLesson(lesson)}
                        className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {t('common.edit')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {settings.language === 'th' ? 'ยังไม่มีแผนการสอนที่บันทึกไว้' :
                   settings.language === 'en' ? 'No saved lesson plans yet' :
                   '暂无已保存的课程计划'}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 {settings.language === 'th' ? 'เคล็ดลับการสอน' :
                   settings.language === 'en' ? 'Teaching Tips' :
                   '教学技巧'}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>• {settings.language === 'th' ? 'เริ่มต้นด้วยการเชื่อมโยงความรู้เดิม' :
                     settings.language === 'en' ? 'Start by connecting prior knowledge' :
                     '从连接先前知识开始'}</li>
              <li>• {settings.language === 'th' ? 'ใช้กิจกรรมที่หลากหลายเพื่อความน่าสนใจ' :
                     settings.language === 'en' ? 'Use diverse activities for engagement' :
                     '使用多样化的活动来吸引学生'}</li>
              <li>• {settings.language === 'th' ? 'ให้นักเรียนมีส่วนร่วมในการเรียนรู้' :
                     settings.language === 'en' ? 'Encourage student participation' :
                     '鼓励学生参与学习'}</li>
              <li>• {settings.language === 'th' ? 'ประเมินผลอย่างต่อเนื่อง' :
                     settings.language === 'en' ? 'Conduct continuous assessment' :
                     '进行持续评估'}</li>
            </ul>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              {t('ai.suggestions')}
            </h3>
            <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-2">
              <li>• {settings.language === 'th' ? 'ใช้ AI เพื่อสร้างเนื้อหาที่หลากหลาย' :
                     settings.language === 'en' ? 'Use AI to create diverse content' :
                     '使用 AI 创建多样化内容'}</li>
              <li>• {settings.language === 'th' ? 'ปรับแผนการสอนตามรูปแบบการเรียนรู้' :
                     settings.language === 'en' ? 'Adapt lessons to learning styles' :
                     '根据学习方式调整课程'}</li>
              <li>• {settings.language === 'th' ? 'สร้างกิจกรรมที่เหมาะกับวัย' :
                     settings.language === 'en' ? 'Create age-appropriate activities' :
                     '创建适合年龄的活动'}</li>
              <li>• {settings.language === 'th' ? 'ใช้การประเมินที่หลากหลาย' :
                     settings.language === 'en' ? 'Use diverse assessment methods' :
                     '使用多样化的评估方法'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;