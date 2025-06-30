import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Save, Trash2, Copy, Sparkles, Brain, Wand2, CheckCircle, Edit } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const TestBuilder: React.FC = () => {
  const { t, generateAIContent, saveTest, getTests, updateTest, settings } = useApp();
  const [testData, setTestData] = useState({
    title: '',
    subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
    duration: '60',
    instructions: '',
    questions: [],
    totalPoints: 0,
    isPublished: false
  });

  const [savedTests, setSavedTests] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [aiContext, setAiContext] = useState({
    topic: '',
    questionCount: '5',
    difficulty: 'medium',
    questionType: 'multiple-choice'
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    id: '',
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const subjects = settings.language === 'th' ? 
    ['ภาษาไทย', 'คณิตศาสตร์', 'วิทยาศาสตร์', 'สังคมศึกษา', 'ภาษาอังกฤษ'] :
    settings.language === 'en' ?
    ['Thai Language', 'Mathematics', 'Science', 'Social Studies', 'English'] :
    ['泰语', '数学', '科学', '社会研究', '英语'];

  const grades = settings.language === 'th' ? 
    ['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'] :
    settings.language === 'en' ?
    ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] :
    ['1年级', '2年级', '3年级', '4年级', '5年级', '6年级', '7年级', '8年级', '9年级', '10年级', '11年级', '12年级'];

  const questionTypes = [
    { 
      value: 'multiple-choice', 
      label: settings.language === 'th' ? 'ปรนัย (ตัวเลือก)' :
             settings.language === 'en' ? 'Multiple Choice' :
             '选择题'
    },
    { 
      value: 'true-false', 
      label: settings.language === 'th' ? 'ถูก/ผิด' :
             settings.language === 'en' ? 'True/False' :
             '判断题'
    },
    { 
      value: 'short-answer', 
      label: settings.language === 'th' ? 'คำตอบสั้น' :
             settings.language === 'en' ? 'Short Answer' :
             '简答题'
    },
    { 
      value: 'essay', 
      label: settings.language === 'th' ? 'อัตนัย (เรียงความ)' :
             settings.language === 'en' ? 'Essay' :
             '论述题'
    },
    { 
      value: 'mixed', 
      label: settings.language === 'th' ? 'ผสมผสาน' :
             settings.language === 'en' ? 'Mixed' :
             '混合题型'
    }
  ];

  const difficultyLevels = [
    { 
      value: 'easy', 
      label: settings.language === 'th' ? 'ง่าย' :
             settings.language === 'en' ? 'Easy' :
             '简单'
    },
    { 
      value: 'medium', 
      label: settings.language === 'th' ? 'ปานกลาง' :
             settings.language === 'en' ? 'Medium' :
             '中等'
    },
    { 
      value: 'hard', 
      label: settings.language === 'th' ? 'ยาก' :
             settings.language === 'en' ? 'Hard' :
             '困难'
    }
  ];

  useEffect(() => {
    loadSavedTests();
    
    // Check if there's a test to edit from localStorage
    const editingTestData = localStorage.getItem('editingTest');
    if (editingTestData) {
      try {
        const test = JSON.parse(editingTestData);
        loadTest(test);
        localStorage.removeItem('editingTest'); // Clear after loading
      } catch (error) {
        console.error('Error loading test from localStorage:', error);
      }
    }
  }, []);

  const loadSavedTests = async () => {
    const tests = await getTests();
    setSavedTests(tests);
  };

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const context = {
        subject: testData.subject,
        grade: testData.grade,
        topic: aiContext.topic,
        questionCount: parseInt(aiContext.questionCount),
        difficulty: aiContext.difficulty,
        questionType: aiContext.questionType
      };
      
      // Get AI content for questions
      const aiContent = await generateAIContent('test-questions', context);
      
      // Parse the AI content and create questions
      const questionLines = aiContent.split('\n').filter(line => line.trim());
      const newQuestions = [];
      
      for (const line of questionLines) {
        // Check if this is a formatted question with options
        if (line.includes('|')) {
          const parts = line.split('|');
          const questionText = parts[0].replace(/^\d+\.\s*/, '').trim();
          const options = parts.slice(1, parts.length - 1).map(opt => opt.trim());
          const correctAnswerIndex = parseInt(parts[parts.length - 1].trim());
          
          newQuestions.push({
            id: `q${Date.now()}-${newQuestions.length}`,
            question: questionText,
            type: 'multiple-choice',
            options: options,
            correctAnswer: correctAnswerIndex.toString(),
            points: aiContext.difficulty === 'easy' ? 1 : aiContext.difficulty === 'medium' ? 2 : 3
          });
        } else {
          // Simple question without options
          const questionText = line.replace(/^\d+\.\s*/, '').trim();
          
          // Create different question types based on the selected type
          const questionType = aiContext.questionType === 'mixed' 
            ? ['multiple-choice', 'true-false', 'short-answer', 'essay'][newQuestions.length % 4]
            : aiContext.questionType;
          
          const question: any = {
            id: `q${Date.now()}-${newQuestions.length}`,
            question: questionText,
            type: questionType,
            points: aiContext.difficulty === 'easy' ? 1 : aiContext.difficulty === 'medium' ? 2 : 3
          };
          
          if (questionType === 'multiple-choice') {
            // Generate sample options based on the topic
            question.options = [
              settings.language === 'th' ? 'ตัวเลือกที่ 1' : settings.language === 'en' ? 'Option 1' : '选项1',
              settings.language === 'th' ? 'ตัวเลือกที่ 2' : settings.language === 'en' ? 'Option 2' : '选项2',
              settings.language === 'th' ? 'ตัวเลือกที่ 3' : settings.language === 'en' ? 'Option 3' : '选项3',
              settings.language === 'th' ? 'ตัวเลือกที่ 4' : settings.language === 'en' ? 'Option 4' : '选项4'
            ];
            question.correctAnswer = '0'; // Default to first option
          } else if (questionType === 'true-false') {
            question.correctAnswer = 'true';
          }
          
          newQuestions.push(question);
        }
      }
      
      setTestData(prev => ({
        ...prev,
        questions: [...prev.questions, ...newQuestions],
        totalPoints: prev.totalPoints + newQuestions.reduce((sum, q) => sum + q.points, 0)
      }));
      
      setShowAIPanel(false);
    } catch (error) {
      console.error('Error generating AI questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionInputChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question) {
      const message = settings.language === 'th' ? 'กรุณากรอกคำถาม' :
                     settings.language === 'en' ? 'Please enter a question' :
                     '请输入问题';
      alert(message);
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: `q${Date.now()}`
    };

    if (editingQuestionIndex !== null) {
      // Update existing question
      setTestData(prev => {
        const updatedQuestions = [...prev.questions];
        const oldPoints = updatedQuestions[editingQuestionIndex].points;
        updatedQuestions[editingQuestionIndex] = newQuestion;
        
        return {
          ...prev,
          questions: updatedQuestions,
          totalPoints: prev.totalPoints - oldPoints + newQuestion.points
        };
      });
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setTestData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
        totalPoints: prev.totalPoints + newQuestion.points
      }));
    }

    // Reset current question
    setCurrentQuestion({
      id: '',
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const editQuestion = (index: number) => {
    const question = testData.questions[index];
    setCurrentQuestion(question);
    setEditingQuestionIndex(index);
  };

  const removeQuestion = (index: number) => {
    setTestData(prev => {
      const updatedQuestions = [...prev.questions];
      const removedPoints = updatedQuestions[index].points;
      updatedQuestions.splice(index, 1);
      
      return {
        ...prev,
        questions: updatedQuestions,
        totalPoints: prev.totalPoints - removedPoints
      };
    });
  };

  const handleSaveTest = async () => {
    if (!testData.title || !testData.subject || !testData.grade) {
      const message = settings.language === 'th' ? 'กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน' :
                     settings.language === 'en' ? 'Please fill in all basic information' :
                     '请填写完整的基本信息';
      alert(message);
      return;
    }

    if (testData.questions.length === 0) {
      const message = settings.language === 'th' ? 'ต้องมีอย่างน้อย 1 คำถาม' :
                     settings.language === 'en' ? 'At least 1 question is required' :
                     '至少需要1个问题';
      alert(message);
      return;
    }

    setIsSaving(true);
    try {
      let success;
      if (editingTest) {
        success = await updateTest(editingTest.id, testData);
      } else {
        success = await saveTest(testData);
      }

      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadSavedTests();
        // Reset form if not editing
        if (!editingTest) {
          setTestData({
            title: '',
            subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
            grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
            duration: '60',
            instructions: '',
            questions: [],
            totalPoints: 0,
            isPublished: false
          });
        }
      } else {
        const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                       settings.language === 'en' ? 'Error saving data' :
                       '保存数据时出错';
        alert(message);
      }
    } catch (error) {
      console.error('Error saving test:', error);
      const message = settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
                     settings.language === 'en' ? 'Error saving data' :
                     '保存数据时出错';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const loadTest = (test: any) => {
    setTestData({
      title: test.title,
      subject: test.subject,
      grade: test.grade,
      duration: test.duration?.toString() || '60',
      instructions: test.instructions || '',
      questions: test.questions || [],
      totalPoints: test.total_points || 0,
      isPublished: test.is_published || false
    });
    setEditingTest(test);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <ClipboardList className="h-8 w-8 mr-3 text-orange-600 dark:text-orange-400" />
          {t('pages.testBuilder.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.testBuilder.description')}</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200">
            {editingTest ? 
              (settings.language === 'th' ? 'อัปเดตแบบทดสอบเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Test updated successfully!' :
               '测试更新成功！') :
              (settings.language === 'th' ? 'บันทึกแบบทดสอบเรียบร้อยแล้ว!' :
               settings.language === 'en' ? 'Test saved successfully!' :
               '测试保存成功！')
            }
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Question Generator */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                {t('ai.help')} - {settings.language === 'th' ? 'สร้างคำถามด้วย AI' :
                                  settings.language === 'en' ? 'Generate questions with AI' :
                                  '使用 AI 生成问题'}
              </h3>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
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
                    <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                      {t('testBuilder.topic')}
                    </label>
                    <input
                      type="text"
                      value={aiContext.topic}
                      onChange={(e) => setAiContext(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                      placeholder={settings.language === 'th' ? 'เช่น ระบบสุริยะ, การอ่านจับใจความ' :
                                  settings.language === 'en' ? 'e.g., Solar System, Reading Comprehension' :
                                  '例如：太阳系，阅读理解'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                      {t('form.questionCount')}
                    </label>
                    <select
                      value={aiContext.questionCount}
                      onChange={(e) => setAiContext(prev => ({ ...prev, questionCount: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      {[5, 10, 15, 20].map(count => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                      {t('testBuilder.difficulty')}
                    </label>
                    <select
                      value={aiContext.difficulty}
                      onChange={(e) => setAiContext(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                      {t('testBuilder.questionType')}
                    </label>
                    <select
                      value={aiContext.questionType}
                      onChange={(e) => setAiContext(prev => ({ ...prev, questionType: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateAIQuestions}
                  disabled={isGenerating || !aiContext.topic}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-500 dark:to-yellow-500 text-white rounded-md hover:from-orange-700 hover:to-yellow-700 dark:hover:from-orange-600 dark:hover:to-yellow-600 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isGenerating ? t('ai.generating') : t('testBuilder.generateQuestions')}
                </button>
              </div>
            )}
          </div>

          {/* Test Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {settings.language === 'th' ? 'ข้อมูลแบบทดสอบ' :
               settings.language === 'en' ? 'Test Information' :
               '测试信息'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {settings.language === 'th' ? 'ชื่อแบบทดสอบ' :
                   settings.language === 'en' ? 'Test Title' :
                   '测试标题'}
                </label>
                <input
                  type="text"
                  value={testData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder={settings.language === 'th' ? 'เช่น แบบทดสอบการอ่านจับใจความ' :
                              settings.language === 'en' ? 'e.g., Reading Comprehension Test' :
                              '例如：阅读理解测试'}
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
                  value={testData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('form.subject')}
                </label>
                <select
                  value={testData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
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
                  value={testData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {settings.language === 'th' ? 'คำแนะนำสำหรับผู้ทำแบบทดสอบ' :
                 settings.language === 'en' ? 'Instructions for Test Takers' :
                 '测试说明'}
              </label>
              <textarea
                value={testData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder={settings.language === 'th' ? 'เช่น อ่านคำถามให้เข้าใจก่อนตอบ...' :
                            settings.language === 'en' ? 'e.g., Read questions carefully before answering...' :
                            '例如：回答前仔细阅读问题...'}
              />
            </div>
          </div>

          {/* Add Question Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingQuestionIndex !== null ? 
                (settings.language === 'th' ? 'แก้ไขคำถาม' :
                 settings.language === 'en' ? 'Edit Question' :
                 '编辑问题') :
                (settings.language === 'th' ? 'เพิ่มคำถาม' :
                 settings.language === 'en' ? 'Add Question' :
                 '添加问题')
              }
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {settings.language === 'th' ? 'คำถาม' :
                   settings.language === 'en' ? 'Question' :
                   '问题'}
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => handleQuestionInputChange('question', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder={settings.language === 'th' ? 'พิมพ์คำถามที่นี่...' :
                              settings.language === 'en' ? 'Type your question here...' :
                              '在此处输入问题...'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'ประเภทคำถาม' :
                     settings.language === 'en' ? 'Question Type' :
                     '问题类型'}
                  </label>
                  <select
                    value={currentQuestion.type}
                    onChange={(e) => handleQuestionInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    {questionTypes.filter(t => t.value !== 'mixed').map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'คะแนน' :
                     settings.language === 'en' ? 'Points' :
                     '分数'}
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => handleQuestionInputChange('points', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Multiple Choice Options */}
              {currentQuestion.type === 'multiple-choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'ตัวเลือก' :
                     settings.language === 'en' ? 'Options' :
                     '选项'}
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index.toString()}
                          onChange={() => handleQuestionInputChange('correctAnswer', index.toString())}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder={`${settings.language === 'th' ? 'ตัวเลือกที่' : settings.language === 'en' ? 'Option' : '选项'} ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {settings.language === 'th' ? 'เลือกปุ่มวงกลมด้านซ้ายเพื่อกำหนดคำตอบที่ถูกต้อง' :
                     settings.language === 'en' ? 'Select the radio button on the left to set the correct answer' :
                     '选择左侧的单选按钮设置正确答案'}
                  </p>
                </div>
              )}

              {/* True/False Options */}
              {currentQuestion.type === 'true-false' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'คำตอบที่ถูกต้อง' :
                     settings.language === 'en' ? 'Correct Answer' :
                     '正确答案'}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="true"
                        checked={currentQuestion.correctAnswer === 'true'}
                        onChange={() => handleQuestionInputChange('correctAnswer', 'true')}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {settings.language === 'th' ? 'ถูก' :
                         settings.language === 'en' ? 'True' :
                         '正确'}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="false"
                        checked={currentQuestion.correctAnswer === 'false'}
                        onChange={() => handleQuestionInputChange('correctAnswer', 'false')}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {settings.language === 'th' ? 'ผิด' :
                         settings.language === 'en' ? 'False' :
                         '错误'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Short Answer */}
              {currentQuestion.type === 'short-answer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'คำตอบที่ยอมรับได้ (ไม่จำเป็น)' :
                     settings.language === 'en' ? 'Acceptable Answer (Optional)' :
                     '可接受的答案（可选）'}
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.correctAnswer || ''}
                    onChange={(e) => handleQuestionInputChange('correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder={settings.language === 'th' ? 'พิมพ์คำตอบที่ยอมรับได้...' :
                                settings.language === 'en' ? 'Type acceptable answer...' :
                                '输入可接受的答案...'}
                  />
                </div>
              )}

              <div className="flex space-x-4 mt-4">
                <button 
                  onClick={addQuestion}
                  className="flex items-center px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
                >
                  {editingQuestionIndex !== null ? <Edit className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                  {editingQuestionIndex !== null ? 
                    (settings.language === 'th' ? 'อัปเดตคำถาม' :
                     settings.language === 'en' ? 'Update Question' :
                     '更新问题') :
                    (settings.language === 'th' ? 'เพิ่มคำถาม' :
                     settings.language === 'en' ? 'Add Question' :
                     '添加问题')
                  }
                </button>
                {editingQuestionIndex !== null && (
                  <button 
                    onClick={() => {
                      setCurrentQuestion({
                        id: '',
                        question: '',
                        type: 'multiple-choice',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                        points: 1
                      });
                      setEditingQuestionIndex(null);
                    }}
                    className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {settings.language === 'th' ? 'ยกเลิก' :
                     settings.language === 'en' ? 'Cancel' :
                     '取消'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {settings.language === 'th' ? 'คำถามในแบบทดสอบ' :
                 settings.language === 'en' ? 'Test Questions' :
                 '测试问题'}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'ทั้งหมด' :
                 settings.language === 'en' ? 'Total' :
                 '总计'} {testData.questions.length} {settings.language === 'th' ? 'ข้อ' :
                                                    settings.language === 'en' ? 'questions' :
                                                    '题'} ({testData.totalPoints} {settings.language === 'th' ? 'คะแนน' :
                                                                                 settings.language === 'en' ? 'points' :
                                                                                 '分'})
              </div>
            </div>

            {testData.questions.length > 0 ? (
              <div className="space-y-4">
                {testData.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white mr-2">
                            {index + 1}.
                          </span>
                          <p className="text-gray-900 dark:text-white">{question.question}</p>
                        </div>
                        
                        <div className="mt-2 ml-6">
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  <span className={`text-sm ${optIndex.toString() === question.correctAnswer ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                    {optIndex.toString() === question.correctAnswer && ' ✓'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {settings.language === 'th' ? 'คำตอบที่ถูกต้อง:' :
                               settings.language === 'en' ? 'Correct answer:' :
                               '正确答案:'} {question.correctAnswer === 'true' ? 
                                          (settings.language === 'th' ? 'ถูก' :
                                           settings.language === 'en' ? 'True' :
                                           '正确') : 
                                          (settings.language === 'th' ? 'ผิด' :
                                           settings.language === 'en' ? 'False' :
                                           '错误')}
                            </div>
                          )}

                          {question.type === 'short-answer' && question.correctAnswer && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {settings.language === 'th' ? 'คำตอบที่ยอมรับได้:' :
                               settings.language === 'en' ? 'Acceptable answer:' :
                               '可接受的答案:'} {question.correctAnswer}
                            </div>
                          )}

                          {question.type === 'essay' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                              {settings.language === 'th' ? '[คำถามแบบเรียงความ]' :
                               settings.language === 'en' ? '[Essay question]' :
                               '[论述题]'}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {questionTypes.find(t => t.value === question.type)?.label} • {question.points} {settings.language === 'th' ? 'คะแนน' :
                                                                                                           settings.language === 'en' ? 'points' :
                                                                                                           '分'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => editQuestion(index)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {settings.language === 'th' ? 'ยังไม่มีคำถาม กรุณาเพิ่มคำถามหรือใช้ AI สร้างคำถาม' :
                   settings.language === 'en' ? 'No questions yet. Please add questions or use AI to generate them' :
                   '暂无问题。请添加问题或使用AI生成问题'}
                </p>
              </div>
            )}
          </div>

          {/* Save Test */}
          <div className="flex space-x-4">
            <button 
              onClick={handleSaveTest}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 
                (settings.language === 'th' ? 'กำลังบันทึก...' :
                 settings.language === 'en' ? 'Saving...' :
                 '保存中...') : 
                editingTest ? 
                  (settings.language === 'th' ? 'อัปเดตแบบทดสอบ' :
                   settings.language === 'en' ? 'Update Test' :
                   '更新测试') :
                  (settings.language === 'th' ? 'บันทึกแบบทดสอบ' :
                   settings.language === 'en' ? 'Save Test' :
                   '保存测试')
              }
            </button>
            <button 
              onClick={() => {
                setTestData({
                  title: '',
                  subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
                  grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
                  duration: '60',
                  instructions: '',
                  questions: [],
                  totalPoints: 0,
                  isPublished: false
                });
                setEditingTest(null);
                setEditingQuestionIndex(null);
                setCurrentQuestion({
                  id: '',
                  question: '',
                  type: 'multiple-choice',
                  options: ['', '', '', ''],
                  correctAnswer: '',
                  points: 1
                });
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

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {settings.language === 'th' ? 'แบบทดสอบที่บันทึกไว้' :
               settings.language === 'en' ? 'Saved Tests' :
               '已保存的测试'}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedTests.length > 0 ? (
                savedTests.map((test) => (
                  <div 
                    key={test.id} 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{test.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{test.subject} • {test.grade}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {test.questions?.length || 0} {settings.language === 'th' ? 'ข้อ' :
                                                     settings.language === 'en' ? 'questions' :
                                                     '题'} • {test.total_points || 0} {settings.language === 'th' ? 'คะแนน' :
                                                                                     settings.language === 'en' ? 'points' :
                                                                                     '分'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(test.created_at).toLocaleDateString(
                        settings.language === 'th' ? 'th-TH' : 
                        settings.language === 'en' ? 'en-US' : 'zh-CN'
                      )}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => loadTest(test)}
                        className="flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {t('common.edit')}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {settings.language === 'th' ? 'ยังไม่มีแบบทดสอบที่บันทึกไว้' :
                   settings.language === 'en' ? 'No saved tests yet' :
                   '暂无已保存的测试'}
                </p>
              )}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
              💡 {settings.language === 'th' ? 'เคล็ดลับการสร้างแบบทดสอบ' :
                   settings.language === 'en' ? 'Test Creation Tips' :
                   '测试创建技巧'}
            </h3>
            <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
              <li>• {settings.language === 'th' ? 'ใช้คำถามที่ชัดเจนและเข้าใจง่าย' :
                     settings.language === 'en' ? 'Use clear and easy-to-understand questions' :
                     '使用清晰易懂的问题'}</li>
              <li>• {settings.language === 'th' ? 'ผสมผสานประเภทคำถามเพื่อวัดทักษะที่หลากหลาย' :
                     settings.language === 'en' ? 'Mix question types to measure various skills' :
                     '混合问题类型以测量各种技能'}</li>
              <li>• {settings.language === 'th' ? 'จัดลำดับคำถามจากง่ายไปยาก' :
                     settings.language === 'en' ? 'Arrange questions from easy to difficult' :
                     '从简单到困难排列问题'}</li>
              <li>• {settings.language === 'th' ? 'ให้คะแนนตามความยากของคำถาม' :
                     settings.language === 'en' ? 'Assign points based on question difficulty' :
                     '根据问题难度分配分数'}</li>
              <li>• {settings.language === 'th' ? 'ตรวจสอบความถูกต้องของคำถามและคำตอบ' :
                     settings.language === 'en' ? 'Verify the accuracy of questions and answers' :
                     '验证问题和答案的准确性'}</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              {t('ai.suggestions')}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>• {settings.language === 'th' ? 'ใช้ AI เพื่อสร้างคำถามพื้นฐาน' :
                     settings.language === 'en' ? 'Use AI to generate basic questions' :
                     '使用 AI 生成基本问题'}</li>
              <li>• {settings.language === 'th' ? 'ปรับแต่งคำถามที่ AI สร้างให้เหมาะสม' :
                     settings.language === 'en' ? 'Customize AI-generated questions as needed' :
                     '根据需要自定义 AI 生成的问题'}</li>
              <li>• {settings.language === 'th' ? 'ใช้ AI ช่วยสร้างตัวเลือกที่น่าสนใจ' :
                     settings.language === 'en' ? 'Use AI to help create interesting options' :
                     '使用 AI 帮助创建有趣的选项'}</li>
              <li>• {settings.language === 'th' ? 'ตรวจสอบความถูกต้องของเนื้อหาเสมอ' :
                     settings.language === 'en' ? 'Always verify content accuracy' :
                     '始终验证内容准确性'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBuilder;