import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  generateLessonContent, 
  generateActivityContent, 
  generateTestQuestions, 
  generateStudentAnalysis 
} from '../lib/gemini';
import type { User, AppSettings } from '../types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  settings: AppSettings;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  generateAIContent: (type: string, context?: any) => Promise<string>;
  saveLessonPlan: (lessonData: any) => Promise<boolean>;
  getLessonPlans: () => Promise<any[]>;
  updateLessonPlan: (id: string, lessonData: any) => Promise<boolean>;
  saveActivity: (activityData: any) => Promise<boolean>;
  getActivities: () => Promise<any[]>;
  updateActivity: (id: string, activityData: any) => Promise<boolean>;
  saveTest: (testData: any) => Promise<boolean>;
  getTests: () => Promise<any[]>;
  updateTest: (id: string, testData: any) => Promise<boolean>;
  getStudents: () => Promise<any[]>;
  saveStudent: (studentData: any) => Promise<boolean>;
  updateStudent: (id: string, studentData: any) => Promise<boolean>;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation function
const translations = {
  th: {
    // Navigation
    'nav.dashboard': 'แดชบอร์ด',
    'nav.lessonPlanner': 'วางแผนการสอน',
    'nav.activityDesigner': 'ออกแบบกิจกรรม',
    'nav.testBuilder': 'สร้างแบบทดสอบ',
    'nav.studentAssessment': 'ประเมินนักเรียน',
    'nav.studentProfiles': 'ข้อมูลนักเรียน',
    'nav.teachingMethods': 'วิธีการสอน',
    'nav.teachingResources': 'สื่อการสอน',
    'nav.googleIntegrations': 'เชื่อมต่อ Google',
    'nav.performanceAnalytics': 'วิเคราะห์ผลการเรียน',

    // Pages
    'pages.lessonPlanner.title': 'วางแผนการสอน',
    'pages.lessonPlanner.description': 'สร้างและจัดการแผนการสอนด้วยความช่วยเหลือจาก AI',
    'pages.activityDesigner.title': 'ออกแบบกิจกรรม',
    'pages.activityDesigner.description': 'สร้างกิจกรรมการเรียนรู้ที่น่าสนใจสำหรับนักเรียน',
    'pages.testBuilder.title': 'สร้างแบบทดสอบ',
    'pages.testBuilder.description': 'สร้างแบบทดสอบและแบบประเมินที่มีประสิทธิภาพ',
    'pages.studentAssessment.title': 'ประเมินผลนักเรียน',
    'pages.studentAssessment.description': 'ติดตามและวิเคราะห์ผลการเรียนของนักเรียน',
    'pages.teachingMethods.title': 'วิธีการสอน',
    'pages.teachingMethods.description': 'เรียนรู้วิธีการสอนที่หลากหลายและมีประสิทธิภาพ',
    'pages.teachingResources.title': 'สื่อการสอน',
    'pages.teachingResources.description': 'ค้นหาและใช้สื่อการสอนที่หลากหลาย',
    'pages.performanceAnalytics.title': 'วิเคราะห์ผลการเรียน',
    'pages.performanceAnalytics.description': 'วิเคราะห์ข้อมูลและสถิติการเรียนการสอน',

    // Common
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',

    // Forms
    'form.subject': 'วิชา',
    'form.grade': 'ระดับชั้น',
    'form.topic': 'หัวข้อ',
    'form.questionCount': 'จำนวนคำถาม',

    // AI
    'ai.help': 'ความช่วยเหลือจาก AI',
    'ai.generating': 'กำลังสร้าง...',
    'ai.suggestions': 'คำแนะนำจาก AI',
    'ai.analysis': 'การวิเคราะห์จาก AI',
    'ai.recommendations': 'คำแนะนำ',

    // Auth
    'auth.login': 'เข้าสู่ระบบ',
    'auth.register': 'สมัครสมาชิก',
    'auth.logout': 'ออกจากระบบ',
    'auth.email': 'อีเมล',
    'auth.password': 'รหัสผ่าน',
    'auth.confirmPassword': 'ยืนยันรหัสผ่าน',
    'auth.name': 'ชื่อ-นามสกุล',
    'auth.school': 'โรงเรียน',
    'auth.noAccount': 'ยังไม่มีบัญชี?',
    'auth.haveAccount': 'มีบัญชีแล้ว?',
    'auth.switchToRegister': 'สมัครสมาชิก',
    'auth.switchToLogin': 'เข้าสู่ระบบ',

    // Demo
    'demo.account': 'บัญชีทดลอง:',
    'demo.email': 'อีเมล: teacher@demo.com',
    'demo.password': 'รหัสผ่าน: demo123',

    // Dashboard
    'dashboard.welcome': 'ยินดีต้อนรับ',
    'dashboard.todayTasks': 'งานวันนี้',
    'dashboard.studentsWaiting': 'นักเรียนรอ',
    'dashboard.waitingAssessment': 'รอการประเมิน',
    'dashboard.lessonPlans': 'แผนการสอน',
    'dashboard.activities': 'กิจกรรม',
    'dashboard.tests': 'แบบทดสอบ',
    'dashboard.students': 'นักเรียน',
    'dashboard.recentActivities': 'กิจกรรมล่าสุด',
    'dashboard.upcomingTasks': 'งานที่จะมาถึง',
    'dashboard.quickActions': 'การดำเนินการด่วน',

    // Quick Actions
    'quickAction.createLesson': 'สร้างแผนการสอน',
    'quickAction.createTest': 'สร้างแบบทดสอบ',
    'quickAction.createActivity': 'สร้างกิจกรรม',

    // Teaching Methods
    'teachingMethod.interactive': 'การสอนแบบโต้ตอบ',
    'teachingMethod.cooperative': 'การเรียนรู้แบบร่วมมือ',
    'teachingMethod.inquiry': 'การสอนแบบสืบเสาะ',
    'teachingMethod.project': 'การเรียนรู้แบบโครงงาน',

    // Activity Designer
    'activityDesigner.aiSuggestions': 'คำแนะนำจาก AI',
    'activityDesigner.generateActivity': 'สร้างกิจกรรมด้วย AI',

    // Test Builder
    'testBuilder.topic': 'หัวข้อ',
    'testBuilder.difficulty': 'ระดับความยาก',
    'testBuilder.questionType': 'ประเภทคำถาม',
    'testBuilder.generateQuestions': 'สร้างคำถามด้วย AI',

    // Student Assessment
    'studentAssessment.aiAnalysis': 'วิเคราะห์ด้วย AI',
    'studentAssessment.recommendations': 'คำแนะนำ',

    // Students
    'student.somjai': 'นางสาวสมใจ ใจดี',
    'student.somsak': 'นายสมศักดิ์ เรียนดี',
    'student.priya': 'นางสาวปรียา ขยันเรียน',

    // Time
    'time.minutes': 'นาที',

    // Calendar
    'calendar.title': 'ปฏิทิน',

    // Class
    'class.myClasses': 'ชั้นเรียนของฉัน',
    'class.viewAll': 'ดูทั้งหมด',
    'class.joinGoogleMeet': 'เข้าร่วม Google Meet',
    'class.openGoogleClassroom': 'เปิด Google Classroom',

    // Settings
    'settings.title': 'การตั้งค่า',
    'settings.profile': 'โปรไฟล์',
    'settings.language': 'ภาษา',
    'settings.theme': 'ธีม',
    'settings.fontSize': 'ขนาดตัวอักษร',

    // Profile
    'profile.title': 'โปรไฟล์',
    'profile.edit': 'แก้ไขโปรไฟล์',
    'profile.bio': 'เกี่ยวกับตัวคุณ',
    'profile.experience': 'ประสบการณ์การสอน',
    'profile.subjects': 'วิชาที่สอน',
    'profile.education': 'การศึกษา',
    'profile.certifications': 'ใบรับรอง'
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.lessonPlanner': 'Lesson Planner',
    'nav.activityDesigner': 'Activity Designer',
    'nav.testBuilder': 'Test Builder',
    'nav.studentAssessment': 'Student Assessment',
    'nav.studentProfiles': 'Student Profiles',
    'nav.teachingMethods': 'Teaching Methods',
    'nav.teachingResources': 'Teaching Resources',
    'nav.googleIntegrations': 'Google Integrations',
    'nav.performanceAnalytics': 'Performance Analytics',

    // Pages
    'pages.lessonPlanner.title': 'Lesson Planner',
    'pages.lessonPlanner.description': 'Create and manage lesson plans with AI assistance',
    'pages.activityDesigner.title': 'Activity Designer',
    'pages.activityDesigner.description': 'Create engaging learning activities for students',
    'pages.testBuilder.title': 'Test Builder',
    'pages.testBuilder.description': 'Create effective tests and assessments',
    'pages.studentAssessment.title': 'Student Assessment',
    'pages.studentAssessment.description': 'Track and analyze student performance',
    'pages.teachingMethods.title': 'Teaching Methods',
    'pages.teachingMethods.description': 'Learn diverse and effective teaching methods',
    'pages.teachingResources.title': 'Teaching Resources',
    'pages.teachingResources.description': 'Find and use diverse teaching materials',
    'pages.performanceAnalytics.title': 'Performance Analytics',
    'pages.performanceAnalytics.description': 'Analyze teaching and learning data and statistics',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',

    // Forms
    'form.subject': 'Subject',
    'form.grade': 'Grade',
    'form.topic': 'Topic',
    'form.questionCount': 'Question Count',

    // AI
    'ai.help': 'AI Help',
    'ai.generating': 'Generating...',
    'ai.suggestions': 'AI Suggestions',
    'ai.analysis': 'AI Analysis',
    'ai.recommendations': 'Recommendations',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.school': 'School',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.haveAccount': 'Already have an account?',
    'auth.switchToRegister': 'Sign up',
    'auth.switchToLogin': 'Sign in',

    // Demo
    'demo.account': 'Demo Account:',
    'demo.email': 'Email: teacher@demo.com',
    'demo.password': 'Password: demo123',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.todayTasks': 'Today\'s tasks',
    'dashboard.studentsWaiting': 'students waiting',
    'dashboard.waitingAssessment': 'waiting for assessment',
    'dashboard.lessonPlans': 'Lesson Plans',
    'dashboard.activities': 'Activities',
    'dashboard.tests': 'Tests',
    'dashboard.students': 'Students',
    'dashboard.recentActivities': 'Recent Activities',
    'dashboard.upcomingTasks': 'Upcoming Tasks',
    'dashboard.quickActions': 'Quick Actions',

    // Quick Actions
    'quickAction.createLesson': 'Create Lesson Plan',
    'quickAction.createTest': 'Create Test',
    'quickAction.createActivity': 'Create Activity',

    // Teaching Methods
    'teachingMethod.interactive': 'Interactive Teaching',
    'teachingMethod.cooperative': 'Cooperative Learning',
    'teachingMethod.inquiry': 'Inquiry-Based Learning',
    'teachingMethod.project': 'Project-Based Learning',

    // Activity Designer
    'activityDesigner.aiSuggestions': 'AI Suggestions',
    'activityDesigner.generateActivity': 'Generate Activity with AI',

    // Test Builder
    'testBuilder.topic': 'Topic',
    'testBuilder.difficulty': 'Difficulty',
    'testBuilder.questionType': 'Question Type',
    'testBuilder.generateQuestions': 'Generate Questions with AI',

    // Student Assessment
    'studentAssessment.aiAnalysis': 'AI Analysis',
    'studentAssessment.recommendations': 'Recommendations',

    // Students
    'student.somjai': 'Miss Somjai Jaidee',
    'student.somsak': 'Mr. Somsak Riandee',
    'student.priya': 'Miss Priya Kayan',

    // Time
    'time.minutes': 'minutes',

    // Calendar
    'calendar.title': 'Calendar',

    // Class
    'class.myClasses': 'My Classes',
    'class.viewAll': 'View All',
    'class.joinGoogleMeet': 'Join Google Meet',
    'class.openGoogleClassroom': 'Open Google Classroom',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.fontSize': 'Font Size',

    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.bio': 'About You',
    'profile.experience': 'Teaching Experience',
    'profile.subjects': 'Subjects Taught',
    'profile.education': 'Education',
    'profile.certifications': 'Certifications'
  },
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.lessonPlanner': '课程规划',
    'nav.activityDesigner': '活动设计',
    'nav.testBuilder': '测试构建',
    'nav.studentAssessment': '学生评估',
    'nav.studentProfiles': '学生档案',
    'nav.teachingMethods': '教学方法',
    'nav.teachingResources': '教学资源',
    'nav.googleIntegrations': 'Google集成',
    'nav.performanceAnalytics': '绩效分析',

    // Pages
    'pages.lessonPlanner.title': '课程规划器',
    'pages.lessonPlanner.description': '使用AI辅助创建和管理课程计划',
    'pages.activityDesigner.title': '活动设计器',
    'pages.activityDesigner.description': '为学生创建引人入胜的学习活动',
    'pages.testBuilder.title': '测试构建器',
    'pages.testBuilder.description': '创建有效的测试和评估',
    'pages.studentAssessment.title': '学生评估',
    'pages.studentAssessment.description': '跟踪和分析学生表现',
    'pages.teachingMethods.title': '教学方法',
    'pages.teachingMethods.description': '学习多样化和有效的教学方法',
    'pages.teachingResources.title': '教学资源',
    'pages.teachingResources.description': '查找和使用多样化的教学材料',
    'pages.performanceAnalytics.title': '绩效分析',
    'pages.performanceAnalytics.description': '分析教学和学习数据及统计',

    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.search': '搜索',
    'common.filter': '筛选',

    // Forms
    'form.subject': '科目',
    'form.grade': '年级',
    'form.topic': '主题',
    'form.questionCount': '问题数量',

    // AI
    'ai.help': 'AI帮助',
    'ai.generating': '生成中...',
    'ai.suggestions': 'AI建议',
    'ai.analysis': 'AI分析',
    'ai.recommendations': '推荐',

    // Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.logout': '退出',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.name': '全名',
    'auth.school': '学校',
    'auth.noAccount': '没有账户？',
    'auth.haveAccount': '已有账户？',
    'auth.switchToRegister': '注册',
    'auth.switchToLogin': '登录',

    // Demo
    'demo.account': '演示账户：',
    'demo.email': '邮箱：teacher@demo.com',
    'demo.password': '密码：demo123',

    // Dashboard
    'dashboard.welcome': '欢迎',
    'dashboard.todayTasks': '今日任务',
    'dashboard.studentsWaiting': '学生等待',
    'dashboard.waitingAssessment': '等待评估',
    'dashboard.lessonPlans': '课程计划',
    'dashboard.activities': '活动',
    'dashboard.tests': '测试',
    'dashboard.students': '学生',
    'dashboard.recentActivities': '最近活动',
    'dashboard.upcomingTasks': '即将到来的任务',
    'dashboard.quickActions': '快速操作',

    // Quick Actions
    'quickAction.createLesson': '创建课程计划',
    'quickAction.createTest': '创建测试',
    'quickAction.createActivity': '创建活动',

    // Teaching Methods
    'teachingMethod.interactive': '互动教学',
    'teachingMethod.cooperative': '合作学习',
    'teachingMethod.inquiry': '探究式学习',
    'teachingMethod.project': '项目式学习',

    // Activity Designer
    'activityDesigner.aiSuggestions': 'AI建议',
    'activityDesigner.generateActivity': '使用AI生成活动',

    // Test Builder
    'testBuilder.topic': '主题',
    'testBuilder.difficulty': '难度',
    'testBuilder.questionType': '问题类型',
    'testBuilder.generateQuestions': '使用AI生成问题',

    // Student Assessment
    'studentAssessment.aiAnalysis': 'AI分析',
    'studentAssessment.recommendations': '推荐',

    // Students
    'student.somjai': '宋佳小姐',
    'student.somsak': '宋萨先生',
    'student.priya': '普里雅小姐',

    // Time
    'time.minutes': '分钟',

    // Calendar
    'calendar.title': '日历',

    // Class
    'class.myClasses': '我的班级',
    'class.viewAll': '查看全部',
    'class.joinGoogleMeet': '加入Google Meet',
    'class.openGoogleClassroom': '打开Google Classroom',

    // Settings
    'settings.title': '设置',
    'settings.profile': '个人资料',
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.fontSize': '字体大小',

    // Profile
    'profile.title': '个人资料',
    'profile.edit': '编辑个人资料',
    'profile.bio': '关于您',
    'profile.experience': '教学经验',
    'profile.subjects': '教授科目',
    'profile.education': '教育背景',
    'profile.certifications': '认证'
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'th',
    theme: 'light',
    fontSize: 'medium'
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    // Apply theme
    const theme = savedSettings ? JSON.parse(savedSettings).theme : 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const isDemoUser = () => {
    return user?.id === 'demo-user';
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo login
      if (email === 'teacher@demo.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user',
          name: 'อาจารย์สมชาย ใจดี',
          email: 'teacher@demo.com',
          role: 'teacher',
          school: 'โรงเรียนสาธิต',
          subjects: ['ภาษาไทย', 'สังคมศึกษา'],
          experience: 5,
          bio: 'ครูผู้สอนที่มีประสบการณ์ในการสอนภาษาไทยและสังคมศึกษา'
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        return true;
      }

      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        const userData: User = {
          id: data.user.id,
          name: profile?.name || data.user.email || '',
          email: data.user.email || '',
          role: 'teacher',
          school: profile?.school,
          subjects: profile?.subjects,
          experience: profile?.experience,
          bio: profile?.bio,
          phone: profile?.phone,
          address: profile?.address,
          education: profile?.education,
          certifications: profile?.certifications,
          socialLinks: profile?.social_links
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            school: userData.school
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    // Clear demo data
    localStorage.removeItem('demo_lesson_plans');
    localStorage.removeItem('demo_activities');
    localStorage.removeItem('demo_tests');
    localStorage.removeItem('demo_students');
    supabase.auth.signOut();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));

    // Apply theme immediately
    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const generateAIContent = async (type: string, context?: any): Promise<string> => {
    try {
      // Add the current language to the context
      const contextWithLanguage = {
        ...context,
        language: settings.language
      };
      
      switch (type) {
        case 'lesson-objectives':
        case 'lesson-activities':
        case 'lesson-materials':
        case 'lesson-assessment':
          return await generateLessonContent(type, contextWithLanguage);
        case 'activity-suggestions':
          return await generateActivityContent(contextWithLanguage);
        case 'test-questions':
          return await generateTestQuestions(contextWithLanguage);
        case 'student-analysis':
          return await generateStudentAnalysis(contextWithLanguage);
        case 'student-profile-suggestions':
          return await generateStudentAnalysis(contextWithLanguage);
        default:
          throw new Error(`Unknown content type: ${type}`);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  };

  // Demo data storage helpers
  const getDemoData = (key: string): any[] => {
    const data = localStorage.getItem(`demo_${key}`);
    return data ? JSON.parse(data) : [];
  };

  const setDemoData = (key: string, data: any[]): void => {
    localStorage.setItem(`demo_${key}`, JSON.stringify(data));
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Database operations
  const saveLessonPlan = async (lessonData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      if (isDemoUser()) {
        // Demo user - save to localStorage
        const lessons = getDemoData('lesson_plans');
        const newLesson = {
          id: generateId(),
          teacher_id: user.id,
          title: lessonData.title,
          subject: lessonData.subject,
          grade: lessonData.grade,
          duration: parseInt(lessonData.duration),
          objectives: lessonData.objectives,
          activities: lessonData.activities,
          materials: lessonData.materials,
          assessment: lessonData.assessment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        lessons.push(newLesson);
        setDemoData('lesson_plans', lessons);
        return true;
      }

      const { error } = await supabase
        .from('lesson_plans')
        .insert({
          teacher_id: user.id,
          title: lessonData.title,
          subject: lessonData.subject,
          grade: lessonData.grade,
          duration: parseInt(lessonData.duration),
          objectives: lessonData.objectives,
          activities: lessonData.activities,
          materials: lessonData.materials,
          assessment: lessonData.assessment
        });

      return !error;
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      return false;
    }
  };

  const getLessonPlans = async (): Promise<any[]> => {
    try {
      if (!user) return [];

      if (isDemoUser()) {
        return getDemoData('lesson_plans');
      }

      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error getting lesson plans:', error);
      return [];
    }
  };

  const updateLessonPlan = async (id: string, lessonData: any): Promise<boolean> => {
    try {
      if (isDemoUser()) {
        const lessons = getDemoData('lesson_plans');
        const index = lessons.findIndex(l => l.id === id);
        if (index !== -1) {
          lessons[index] = {
            ...lessons[index],
            title: lessonData.title,
            subject: lessonData.subject,
            grade: lessonData.grade,
            duration: parseInt(lessonData.duration),
            objectives: lessonData.objectives,
            activities: lessonData.activities,
            materials: lessonData.materials,
            assessment: lessonData.assessment,
            updated_at: new Date().toISOString()
          };
          setDemoData('lesson_plans', lessons);
          return true;
        }
        return false;
      }

      const { error } = await supabase
        .from('lesson_plans')
        .update({
          title: lessonData.title,
          subject: lessonData.subject,
          grade: lessonData.grade,
          duration: parseInt(lessonData.duration),
          objectives: lessonData.objectives,
          activities: lessonData.activities,
          materials: lessonData.materials,
          assessment: lessonData.assessment,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating lesson plan:', error);
      return false;
    }
  };

  const saveActivity = async (activityData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      if (isDemoUser()) {
        const activities = getDemoData('activities');
        const newActivity = {
          id: generateId(),
          teacher_id: user.id,
          name: activityData.name,
          description: activityData.description,
          category: activityData.category,
          duration: parseInt(activityData.duration),
          group_size: activityData.groupSize,
          objectives: activityData.objectives,
          instructions: activityData.instructions,
          materials: activityData.materials,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        activities.push(newActivity);
        setDemoData('activities', activities);
        return true;
      }

      const { error } = await supabase
        .from('activities')
        .insert({
          teacher_id: user.id,
          name: activityData.name,
          description: activityData.description,
          category: activityData.category,
          duration: parseInt(activityData.duration),
          group_size: activityData.groupSize,
          objectives: activityData.objectives,
          instructions: activityData.instructions,
          materials: activityData.materials
        });

      return !error;
    } catch (error) {
      console.error('Error saving activity:', error);
      return false;
    }
  };

  const getActivities = async (): Promise<any[]> => {
    try {
      if (!user) return [];

      if (isDemoUser()) {
        return getDemoData('activities');
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  };

  const updateActivity = async (id: string, activityData: any): Promise<boolean> => {
    try {
      if (isDemoUser()) {
        const activities = getDemoData('activities');
        const index = activities.findIndex(a => a.id === id);
        if (index !== -1) {
          activities[index] = {
            ...activities[index],
            name: activityData.name,
            description: activityData.description,
            category: activityData.category,
            duration: parseInt(activityData.duration),
            group_size: activityData.groupSize,
            objectives: activityData.objectives,
            instructions: activityData.instructions,
            materials: activityData.materials,
            updated_at: new Date().toISOString()
          };
          setDemoData('activities', activities);
          return true;
        }
        return false;
      }

      const { error } = await supabase
        .from('activities')
        .update({
          name: activityData.name,
          description: activityData.description,
          category: activityData.category,
          duration: parseInt(activityData.duration),
          group_size: activityData.groupSize,
          objectives: activityData.objectives,
          instructions: activityData.instructions,
          materials: activityData.materials,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating activity:', error);
      return false;
    }
  };

  const saveTest = async (testData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      if (isDemoUser()) {
        const tests = getDemoData('tests');
        const newTest = {
          id: generateId(),
          teacher_id: user.id,
          title: testData.title,
          subject: testData.subject,
          grade: testData.grade,
          duration: parseInt(testData.duration),
          instructions: testData.instructions,
          questions: testData.questions,
          total_points: testData.totalPoints,
          is_published: testData.isPublished,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        tests.push(newTest);
        setDemoData('tests', tests);
        return true;
      }

      const { error } = await supabase
        .from('tests')
        .insert({
          teacher_id: user.id,
          title: testData.title,
          subject: testData.subject,
          grade: testData.grade,
          duration: parseInt(testData.duration),
          instructions: testData.instructions,
          questions: testData.questions,
          total_points: testData.totalPoints,
          is_published: testData.isPublished
        });

      return !error;
    } catch (error) {
      console.error('Error saving test:', error);
      return false;
    }
  };

  const getTests = async (): Promise<any[]> => {
    try {
      if (!user) return [];

      if (isDemoUser()) {
        return getDemoData('tests');
      }

      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error getting tests:', error);
      return [];
    }
  };

  const updateTest = async (id: string, testData: any): Promise<boolean> => {
    try {
      if (isDemoUser()) {
        const tests = getDemoData('tests');
        const index = tests.findIndex(t => t.id === id);
        if (index !== -1) {
          tests[index] = {
            ...tests[index],
            title: testData.title,
            subject: testData.subject,
            grade: testData.grade,
            duration: parseInt(testData.duration),
            instructions: testData.instructions,
            questions: testData.questions,
            total_points: testData.totalPoints,
            is_published: testData.isPublished,
            updated_at: new Date().toISOString()
          };
          setDemoData('tests', tests);
          return true;
        }
        return false;
      }

      const { error } = await supabase
        .from('tests')
        .update({
          title: testData.title,
          subject: testData.subject,
          grade: testData.grade,
          duration: parseInt(testData.duration),
          instructions: testData.instructions,
          questions: testData.questions,
          total_points: testData.totalPoints,
          is_published: testData.isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating test:', error);
      return false;
    }
  };

  const getStudents = async (): Promise<any[]> => {
    try {
      if (!user) return [];

      if (isDemoUser()) {
        return getDemoData('students');
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', user.id)
        .order('name', { ascending: true });

      return data || [];
    } catch (error) {
      console.error('Error getting students:', error);
      return [];
    }
  };

  const saveStudent = async (studentData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      if (isDemoUser()) {
        const students = getDemoData('students');
        const newStudent = {
          id: generateId(),
          teacher_id: user.id,
          student_id: studentData.studentId,
          name: studentData.name,
          grade: studentData.grade,
          class: studentData.class,
          photo_url: studentData.photoUrl,
          personality: studentData.personality,
          academic_data: studentData.academicData,
          behavioral_data: studentData.behavioralData,
          notes: studentData.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        students.push(newStudent);
        setDemoData('students', students);
        return true;
      }

      const { error } = await supabase
        .from('students')
        .insert({
          teacher_id: user.id,
          student_id: studentData.studentId,
          name: studentData.name,
          grade: studentData.grade,
          class: studentData.class,
          photo_url: studentData.photoUrl,
          personality: studentData.personality,
          academic_data: studentData.academicData,
          behavioral_data: studentData.behavioralData,
          notes: studentData.notes
        });

      return !error;
    } catch (error) {
      console.error('Error saving student:', error);
      return false;
    }
  };

  const updateStudent = async (id: string, studentData: any): Promise<boolean> => {
    try {
      if (isDemoUser()) {
        const students = getDemoData('students');
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
          students[index] = {
            ...students[index],
            student_id: studentData.studentId,
            name: studentData.name,
            grade: studentData.grade,
            class: studentData.class,
            photo_url: studentData.photoUrl,
            personality: studentData.personality,
            academic_data: studentData.academicData,
            behavioral_data: studentData.behavioralData,
            notes: studentData.notes,
            updated_at: new Date().toISOString()
          };
          setDemoData('students', students);
          return true;
        }
        return false;
      }

      const { error } = await supabase
        .from('students')
        .update({
          student_id: studentData.studentId,
          name: studentData.name,
          grade: studentData.grade,
          class: studentData.class,
          photo_url: studentData.photoUrl,
          personality: studentData.personality,
          academic_data: studentData.academicData,
          behavioral_data: studentData.behavioralData,
          notes: studentData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  };

  const t = (key: string): string => {
    const lang = settings.language;
    return translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    settings,
    login,
    register,
    logout,
    updateUser,
    updateSettings,
    generateAIContent,
    saveLessonPlan,
    getLessonPlans,
    updateLessonPlan,
    saveActivity,
    getActivities,
    updateActivity,
    saveTest,
    getTests,
    updateTest,
    getStudents,
    saveStudent,
    updateStudent,
    t
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};