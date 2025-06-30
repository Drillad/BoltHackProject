import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, Edit, Trash2, Clock, Target, Sparkles, Brain, Wand2, Lightbulb, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ActivityDesigner: React.FC = () => {
  const { t, generateAIContent, saveActivity, getActivities, updateActivity, settings } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activityData, setActivityData] = useState({
    name: '',
    description: '',
    objectives: '',
    duration: '30',
    materials: '',
    instructions: '',
    groupSize: '4',
    category: ''
  });

  const [savedActivities, setSavedActivities] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [aiContext, setAiContext] = useState({
    subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
    topic: '',
    activityType: 'group-discussion'
  });

  const templates = [
    {
      id: 'group-discussion',
      name: settings.language === 'th' ? 'การอธิบายแบบกลุ่ม' :
            settings.language === 'en' ? 'Group Discussion' :
            '小组讨论',
      description: settings.language === 'th' ? 'นักเรียนแบ่งกลุ่มเพื่อหารือและแลกเปลี่ยนความคิดเห็น' :
                   settings.language === 'en' ? 'Students work in groups to discuss and exchange ideas' :
                   '学生分组讨论和交流想法',
      icon: '💬',
      duration: settings.language === 'th' ? '20-30 นาที' :
                settings.language === 'en' ? '20-30 minutes' :
                '20-30分钟',
      category: t('teachingMethod.interactive')
    },
    {
      id: 'role-play',
      name: settings.language === 'th' ? 'การแสดงบทบาทสมมติ' :
            settings.language === 'en' ? 'Role Playing' :
            '角色扮演',
      description: settings.language === 'th' ? 'นักเรียนแสดงบทบาทเพื่อฝึกทักษะและความเข้าใจ' :
                   settings.language === 'en' ? 'Students role-play to practice skills and understanding' :
                   '学生通过角色扮演练习技能和理解',
      icon: '🎭',
      duration: settings.language === 'th' ? '30-45 นาที' :
                settings.language === 'en' ? '30-45 minutes' :
                '30-45分钟',
      category: t('teachingMethod.cooperative')
    },
    {
      id: 'problem-solving',
      name: settings.language === 'th' ? 'การแก้ปัญหาเป็นทีม' :
            settings.language === 'en' ? 'Team Problem Solving' :
            '团队解决问题',
      description: settings.language === 'th' ? 'นักเรียนร่วมกันแก้ปัญหาที่กำหนดให้' :
                   settings.language === 'en' ? 'Students work together to solve assigned problems' :
                   '学生合作解决指定的问题',
      icon: '🧩',
      duration: settings.language === 'th' ? '25-40 นาที' :
                settings.language === 'en' ? '25-40 minutes' :
                '25-40分钟',
      category: t('teachingMethod.inquiry')
    },
    {
      id: 'presentation',
      name: settings.language === 'th' ? 'การนำเสนอผลงาน' :
            settings.language === 'en' ? 'Presentation' :
            '演示',
      description: settings.language === 'th' ? 'นักเรียนเตรียมและนำเสนอผลงานหน้าชั้น' :
                   settings.language === 'en' ? 'Students prepare and present their work to the class' :
                   '学生准备并向全班展示他们的作品',
      icon: '📊',
      duration: settings.language === 'th' ? '30-50 นาที' :
                settings.language === 'en' ? '30-50 minutes' :
                '30-50分钟',
      category: t('teachingMethod.interactive')
    },
    {
      id: 'experiment',
      name: settings.language === 'th' ? 'การทดลองและสำรวจ' :
            settings.language === 'en' ? 'Experiment and Exploration' :
            '实验和探索',
      description: settings.language === 'th' ? 'นักเรียนทำการทดลองเพื่อค้นหาความรู้ด้วยตนเอง' :
                   settings.language === 'en' ? 'Students conduct experiments to discover knowledge themselves' :
                   '学生进行实验自主发现知识',
      icon: '🔬',
      duration: settings.language === 'th' ? '40-60 นาที' :
                settings.language === 'en' ? '40-60 minutes' :
                '40-60分钟',
      category: t('teachingMethod.inquiry')
    },
    {
      id: 'creative-workshop',
      name: settings.language === 'th' ? 'เวิร์กช็อปสร้างสรรค์' :
            settings.language === 'en' ? 'Creative Workshop' :
            '创意工作坊',
      description: settings.language === 'th' ? 'นักเรียนสร้างผลงานศิลปะหรือโครงงาน' :
                   settings.language === 'en' ? 'Students create art projects or assignments' :
                   '学生创作艺术作品或项目',
      icon: '🎨',
      duration: settings.language === 'th' ? '45-90 นาที' :
                settings.language === 'en' ? '45-90 minutes' :
                '45-90分钟',
      category: t('teachingMethod.project')
    }
  ];

  const subjects = settings.language === 'th' ? 
    ['ภาษาไทย', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'สังคมศึกษา', 'ภาษาอังกฤษ'] :
    settings.language === 'en' ?
    ['Thai Language', 'Mathematics', 'Science', 'Social Studies', 'English'] :
    ['泰语', '数学', '科学', '社会研究', '英语'];

  const grades = settings.language === 'th' ? 
    ['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3'] :
    settings.language === 'en' ?
    ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'] :
    ['1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '7年级', '8年级', '9年级'];

  useEffect(() => {
    loadSavedActivities();
  }, []);

  const loadSavedActivities = async () => {
    const activities = await getActivities();
    setSavedActivities(activities);
  };

  const generateAIActivity = async () => {
    setIsGenerating(true);
    try {
      const context = {
        subject: aiContext.subject,
        grade: aiContext.grade,
        topic: aiContext.topic,
        activityType: aiContext.activityType
      };
      
      const aiContent = await generateAIContent('activity-suggestions', context);
      const selectedTemplateData = templates.find(t => t.id === aiContext.activityType);
      
      setActivityData(prev => ({
        ...prev,
        name: settings.language === 'th' ? `กิจกรรม${aiContext.topic} - ${selectedTemplateData?.name}` :
              settings.language === 'en' ? `Activity ${aiContext.topic} - ${selectedTemplateData?.name}` :
              `活动${aiContext.topic} - ${selectedTemplateData?.name}`,
        description: settings.language === 'th' ? `กิจกรรมที่ออกแบบโดย AI สำหรับหัวข้อ ${aiContext.topic}` :
                     settings.language === 'en' ? `AI-designed activity for topic ${aiContext.topic}` :
                     `为主题${aiContext.topic}设计的AI活动`,
        objectives: settings.language === 'th' ? `เพื่อให้นักเรียนเข้าใจและสามารถประยุกต์ใช้ความรู้เรื่อง ${aiContext.topic} ได้อย่างมีประสิทธิภาพ` :
                    settings.language === 'en' ? `To help students understand and effectively apply knowledge about ${aiContext.topic}` :
                    `帮助学生理解并有效应用关于${aiContext.topic}的知识`,
        instructions: aiContent,
        materials: settings.language === 'th' ? 'กระดาน, ปากกา, ใบงาน, อุปกรณ์ประกอบการเรียน' :
                   settings.language === 'en' ? 'Whiteboard, markers, worksheets, learning materials' :
                   '白板、马克笔、工作表、学习材料',
        category: selectedTemplateData?.category || ''
      }));
      
      setShowAIPanel(false);
    } catch (error) {
      console.error('Error generating AI activity:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActivityData(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        duration: template.duration.split('-')[0].replace(/[^\d]/g, ''),
        category: template.category
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setActivityData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveActivity = async () => {
    if (!activityData.name || !activityData.description) {
      const message = settings.language === 'th' ? 'กรุณากรอกชื่อกิจกรรมและคำอธิบาย' :
                     settings.language === 'en' ? 'Please fill in activity name and description' :
                     '请填写活动名称和描述';
      alert(message);
      return;
    }

    setIsSaving(true);
    try {
      let success;
      if (editingActivity) {
        success = await updateActivity(editingActivity.id, activityData);
      } else {
        success = await saveActivity(activityData);
      }

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadSavedActivities();
        // Reset form
        setActivityData({
          name: '',
          description: '',
          objectives: '',
          duration: '30',
          materials: '',
          instructions: '',
          groupSize: '4',
          category: ''
        });
        setSelectedTemplate('');
        setEditingActivity(null);
      } else {
        const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                       settings.language === 'en' ? 'Error saving data' :
                       '保存数据时出错';
        alert(message);
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                     settings.language === 'en' ? 'Error saving data' :
                     '保存数据时出错';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadActivity = (activity: any) => {
    setActivityData({
      name: activity.name,
      description: activity.description || '',
      objectives: activity.objectives || '',
      duration: activity.duration?.toString() || '30',
      materials: activity.materials || '',
      instructions: activity.instructions || '',
      groupSize: activity.group_size || '4',
      category: activity.category || ''
    });
    setEditingActivity(activity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Users className="h-8 w-8 mr-3 text-green-600 dark:text-green-400" />
          {t('pages.activityDesigner.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.activityDesigner.description')}</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">
            {editingActivity ? 
              (settings.language === 'th' ? 'อัปเดตกิจกรรมเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Activity updated successfully!' :
               '活动更新成功！') :
              (settings.language === 'th' ? 'บันทึกกิจกรรมเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Activity saved successfully!' :
               '活动保存成功！')
            }
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Activity Generator */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                {t('activityDesigner.aiSuggestions')}
              </h3>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
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
                    <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      {t('form.subject')}
                    </label>
                    <select
                      value={aiContext.subject}
                      onChange={(e) => setAiContext(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      {t('form.grade')}
                    </label>
                    <select
                      value={aiContext.grade}
                      onChange={(e) => setAiContext(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      {t('form.topic')}
                    </label>
                    <input
                      type="text"
                      value={aiContext.topic}
                      onChange={(e) => setAiContext(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder={settings.language === 'th' ? 'เช่น การอ่านจับใจความ' :
                                  settings.language === 'en' ? 'e.g., Reading comprehension' :
                                  '例如：阅读理解'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                      {settings.language === 'th' ? 'ประเภทกิจกรรม' :
                       settings.language === 'en' ? 'Activity Type' :
                       '活动类型'}
                    </label>
                    <select
                      value={aiContext.activityType}
                      onChange={(e) => setAiContext(prev => ({ ...prev, activityType: e.target.value }))}
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateAIActivity}
                  disabled={isGenerating || !aiContext.topic}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-500 dark:to-blue-500 text-white rounded-md hover:from-green-700 hover:to-blue-700 dark:hover:from-green-600 dark:hover:to-blue-600 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isGenerating ? t('ai.generating') : t('activityDesigner.generateActivity')}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {settings.language === 'th' ? 'เลือกรูปแบบกิจกรรม' :
               settings.language === 'en' ? 'Select Activity Template' :
               '选择活动模板'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{template.description}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{template.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Details Form */}
          {(selectedTemplate || activityData.name) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingActivity ? 
                  (settings.language === 'th' ? 'แก้ไขรายละเอียดกิจกรรม' :
                   settings.language === 'en' ? 'Edit Activity Details' :
                   '编辑活动详情') :
                  (settings.language === 'th' ? 'รายละเอียดกิจกรรม' :
                   settings.language === 'en' ? 'Activity Details' :
                   '活动详情')
                }
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ชื่อกิจกรรม' :
                       settings.language === 'en' ? 'Activity Name' :
                       '活动名称'}
                    </label>
                    <input
                      type="text"
                      value={activityData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                      value={activityData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'คำอธิบายกิจกรรม' :
                     settings.language === 'en' ? 'Activity Description' :
                     '活动描述'}
                  </label>
                  <textarea
                    value={activityData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'จุดประสงค์การเรียนรู้' :
                       settings.language === 'en' ? 'Learning Objectives' :
                       '学习目标'}
                    </label>
                    <button className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('ai.help')}
                    </button>
                  </div>
                  <textarea
                    value={activityData.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder={settings.language === 'th' ? 'ระบุจุดประสงค์การเรียนรู้ของกิจกรรม...' :
                                settings.language === 'en' ? 'Specify the learning objectives of the activity...' :
                                '指定活动的学习目标...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'วัสดุอุปกรณ์' :
                     settings.language === 'en' ? 'Materials and Equipment' :
                     '材料和设备'}
                  </label>
                  <textarea
                    value={activityData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder={settings.language === 'th' ? 'ระบุวัสดุอุปกรณ์ที่จำเป็น...' :
                                settings.language === 'en' ? 'Specify necessary materials and equipment...' :
                                '指定必要的材料和设备...'}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'ขั้นตอนการดำเนินกิจกรรม' :
                       settings.language === 'en' ? 'Activity Procedures' :
                       '活动步骤'}
                    </label>
                    <button className="flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('ai.help')}
                    </button>
                  </div>
                  <textarea
                    value={activityData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder={settings.language === 'th' ? 'ระบุขั้นตอนการดำเนินกิจกรรมอย่างละเอียด...' :
                                settings.language === 'en' ? 'Specify detailed activity procedures...' :
                                '详细说明活动步骤...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'ขนาดกลุ่ม (คน)' :
                     settings.language === 'en' ? 'Group Size (people)' :
                     '小组规模（人）'}
                  </label>
                  <select
                    value={activityData.groupSize}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="individual">
                      {settings.language === 'th' ? 'รายบุคคล' :
                       settings.language === 'en' ? 'Individual' :
                       '个人'}
                    </option>
                    <option value="2">2 {settings.language === 'th' ? 'คน' : settings.language === 'en' ? 'people' : '人'}</option>
                    <option value="3">3 {settings.language === 'th' ? 'คน' : settings.language === 'en' ? 'people' : '人'}</option>
                    <option value="4">4 {settings.language === 'th' ? 'คน' : settings.language === 'en' ? 'people' : '人'}</option>
                    <option value="5">5 {settings.language === 'th' ? 'คน' : settings.language === 'en' ? 'people' : '人'}</option>
                    <option value="6">6 {settings.language === 'th' ? 'คน' : settings.language === 'en' ? 'people' : '人'}</option>
                    <option value="whole-class">
                      {settings.language === 'th' ? 'ทั้งชั้น' :
                       settings.language === 'en' ? 'Whole Class' :
                       '全班'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  onClick={handleSaveActivity}
                  disabled={isSaving}
                  className="flex items-center px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {isSaving ? 
                    (settings.language === 'th' ? 'กำลังบันทึก...' :
                     settings.language === 'en' ? 'Saving...' :
                     '保存中...') : 
                    editingActivity ? 
                      (settings.language === 'th' ? 'อัปเดตกิจกรรม' :
                       settings.language === 'en' ? 'Update Activity' :
                       '更新活动') :
                      (settings.language === 'th' ? 'บันทึกกิจกรรม' :
                       settings.language === 'en' ? 'Save Activity' :
                       '保存活动')
                  }
                </button>
                <button 
                  onClick={() => {
                    setActivityData({
                      name: '',
                      description: '',
                      objectives: '',
                      duration: '30',
                      materials: '',
                      instructions: '',
                      groupSize: '4',
                      category: ''
                    });
                    setSelectedTemplate('');
                    setEditingActivity(null);
                  }}
                  className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  {settings.language === 'th' ? 'สร้างใหม่' :
                   settings.language === 'en' ? 'Create New' :
                   '新建'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {settings.language === 'th' ? 'กิจกรรมที่บันทึกไว้' :
               settings.language === 'en' ? 'Saved Activities' :
               '已保存的活动'}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedActivities.length > 0 ? (
                savedActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.category}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.duration} {t('time.minutes')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString(
                            settings.language === 'th' ? 'th-TH' : 
                            settings.language === 'en' ? 'en-US' : 'zh-CN'
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => loadActivity(activity)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {settings.language === 'th' ? 'ยังไม่มีกิจกรรมที่บันทึกไว้' :
                   settings.language === 'en' ? 'No saved activities yet' :
                   '暂无已保存的活动'}
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              🎯 {settings.language === 'th' ? 'เคล็ดลับกิจกรรม' :
                   settings.language === 'en' ? 'Activity Tips' :
                   '活动技巧'}
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li>• {settings.language === 'th' ? 'กำหนดจุดประสงค์ให้ชัดเจน' :
                     settings.language === 'en' ? 'Set clear objectives' :
                     '设定明确的目标'}</li>
              <li>• {settings.language === 'th' ? 'เตรียมวัสดุอุปกรณ์ให้พร้อม' :
                     settings.language === 'en' ? 'Prepare materials in advance' :
                     '提前准备材料'}</li>
              <li>• {settings.language === 'th' ? 'ให้คำแนะนำที่เข้าใจง่าย' :
                     settings.language === 'en' ? 'Give clear instructions' :
                     '给出清晰的指导'}</li>
              <li>• {settings.language === 'th' ? 'เปิดโอกาสให้นักเรียนแสดงความคิดเห็น' :
                     settings.language === 'en' ? 'Encourage student participation' :
                     '鼓励学生参与'}</li>
              <li>• {settings.language === 'th' ? 'สรุปผลการเรียนรู้ร่วมกัน' :
                     settings.language === 'en' ? 'Summarize learning outcomes together' :
                     '共同总结学习成果'}</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              {t('ai.recommendations')}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>• {settings.language === 'th' ? 'ใช้ AI เพื่อสร้างกิจกรรมที่หลากหลาย' :
                     settings.language === 'en' ? 'Use AI to create diverse activities' :
                     '使用 AI 创建多样化活动'}</li>
              <li>• {settings.language === 'th' ? 'ปรับกิจกรรมตามความสนใจของนักเรียน' :
                     settings.language === 'en' ? 'Adapt activities to student interests' :
                     '根据学生兴趣调整活动'}</li>
              <li>• {settings.language === 'th' ? 'เชื่อมโยงกิจกรรมกับชีวิตจริง' :
                     settings.language === 'en' ? 'Connect activities to real life' :
                     '将活动与现实生活联系起来'}</li>
              <li>• {settings.language === 'th' ? 'ส่งเสริมการทำงานร่วมกัน' :
                     settings.language === 'en' ? 'Promote collaboration' :
                     '促进合作'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDesigner;