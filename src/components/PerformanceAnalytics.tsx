import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  PieChart,
  Activity,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';
import { useApp } from '../contexts/AppContext';

const PerformanceAnalytics: React.FC = () => {
  const { t, settings } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedClass, setSelectedClass] = useState('all');

  // Sample data for analytics
  const classPerformanceData = [
    { class: 'ม.1/1', students: 35, avgScore: 84, improvement: 5 },
    { class: 'ม.1/2', students: 33, avgScore: 78, improvement: 3 },
    { class: 'ม.1/3', students: 34, avgScore: 81, improvement: 7 },
    { class: 'ม.2/1', students: 32, avgScore: 86, improvement: 4 },
    { class: 'ม.2/2', students: 31, avgScore: 79, improvement: 6 }
  ];

  const subjectPerformanceData = [
    { 
      subject: settings.language === 'th' ? 'ภาษาไทย' : 
               settings.language === 'en' ? 'Thai Language' : 
               '泰语', 
      score: 85, 
      target: 80, 
      students: 165 
    },
    { 
      subject: settings.language === 'th' ? 'คณิตศาสตร์' : 
               settings.language === 'en' ? 'Mathematics' : 
               '数学', 
      score: 78, 
      target: 75, 
      students: 165 
    },
    { 
      subject: settings.language === 'th' ? 'วิทยาศาสตร์' : 
               settings.language === 'en' ? 'Science' : 
               '科学', 
      score: 82, 
      target: 80, 
      students: 165 
    },
    { 
      subject: settings.language === 'th' ? 'สังคมศึกษา' : 
               settings.language === 'en' ? 'Social Studies' : 
               '社会研究', 
      score: 88, 
      target: 85, 
      students: 165 
    },
    { 
      subject: settings.language === 'th' ? 'ภาษาอังกฤษ' : 
               settings.language === 'en' ? 'English' : 
               '英语', 
      score: 76, 
      target: 75, 
      students: 165 
    }
  ];

  const monthlyTrendData = [
    { 
      month: settings.language === 'th' ? 'ส.ค.' : 
             settings.language === 'en' ? 'Aug' : 
             '8月', 
      score: 75, 
      participation: 85, 
      attendance: 92 
    },
    { 
      month: settings.language === 'th' ? 'ก.ย.' : 
             settings.language === 'en' ? 'Sep' : 
             '9月', 
      score: 78, 
      participation: 87, 
      attendance: 94 
    },
    { 
      month: settings.language === 'th' ? 'ต.ค.' : 
             settings.language === 'en' ? 'Oct' : 
             '10月', 
      score: 80, 
      participation: 89, 
      attendance: 93 
    },
    { 
      month: settings.language === 'th' ? 'พ.ย.' : 
             settings.language === 'en' ? 'Nov' : 
             '11月', 
      score: 82, 
      participation: 91, 
      attendance: 95 
    },
    { 
      month: settings.language === 'th' ? 'ธ.ค.' : 
             settings.language === 'en' ? 'Dec' : 
             '12月', 
      score: 84, 
      participation: 88, 
      attendance: 91 
    },
    { 
      month: settings.language === 'th' ? 'ม.ค.' : 
             settings.language === 'en' ? 'Jan' : 
             '1月', 
      score: 86, 
      participation: 92, 
      attendance: 96 
    }
  ];

  const gradeDistributionData = [
    { 
      grade: settings.language === 'th' ? 'A (90-100)' : 
             settings.language === 'en' ? 'A (90-100)' : 
             'A (90-100)', 
      count: 45, 
      percentage: 27 
    },
    { 
      grade: settings.language === 'th' ? 'B (80-89)' : 
             settings.language === 'en' ? 'B (80-89)' : 
             'B (80-89)', 
      count: 62, 
      percentage: 38 
    },
    { 
      grade: settings.language === 'th' ? 'C (70-79)' : 
             settings.language === 'en' ? 'C (70-79)' : 
             'C (70-79)', 
      count: 38, 
      percentage: 23 
    },
    { 
      grade: settings.language === 'th' ? 'D (60-69)' : 
             settings.language === 'en' ? 'D (60-69)' : 
             'D (60-69)', 
      count: 15, 
      percentage: 9 
    },
    { 
      grade: settings.language === 'th' ? 'F (0-59)' : 
             settings.language === 'en' ? 'F (0-59)' : 
             'F (0-59)', 
      count: 5, 
      percentage: 3 
    }
  ];

  const teachingEffectivenessData = [
    { 
      method: settings.language === 'th' ? 'การสอนแบบอภิปราย' : 
              settings.language === 'en' ? 'Discussion Method' : 
              '讨论教学法', 
      effectiveness: 85, 
      usage: 70 
    },
    { 
      method: settings.language === 'th' ? 'การเรียนรู้แบบร่วมมือ' : 
              settings.language === 'en' ? 'Cooperative Learning' : 
              '合作学习', 
      effectiveness: 92, 
      usage: 85 
    },
    { 
      method: settings.language === 'th' ? 'การสอนแบบสืบเสาะ' : 
              settings.language === 'en' ? 'Inquiry-Based Learning' : 
              '探究式学习', 
      effectiveness: 78, 
      usage: 45 
    },
    { 
      method: settings.language === 'th' ? 'การสอนผ่านเกม' : 
              settings.language === 'en' ? 'Game-Based Learning' : 
              '游戏化学习', 
      effectiveness: 88, 
      usage: 60 
    },
    { 
      method: settings.language === 'th' ? 'การสอนแบบโครงงาน' : 
              settings.language === 'en' ? 'Project-Based Learning' : 
              '项目式学习', 
      effectiveness: 90, 
      usage: 40 
    }
  ];

  const COLORS = ['#4F46E5', '#059669', '#DC2626', '#D97706', '#7C3AED'];

  const periods = [
    { 
      value: 'week', 
      label: settings.language === 'th' ? 'สัปดาห์นี้' : 
             settings.language === 'en' ? 'This Week' : 
             '本周' 
    },
    { 
      value: 'month', 
      label: settings.language === 'th' ? 'เดือนนี้' : 
             settings.language === 'en' ? 'This Month' : 
             '本月' 
    },
    { 
      value: 'semester', 
      label: settings.language === 'th' ? 'ภาคเรียนนี้' : 
             settings.language === 'en' ? 'This Semester' : 
             '本学期' 
    },
    { 
      value: 'year', 
      label: settings.language === 'th' ? 'ปีการศึกษานี้' : 
             settings.language === 'en' ? 'This Academic Year' : 
             '本学年' 
    }
  ];

  const classes = [
    { 
      value: 'all', 
      label: settings.language === 'th' ? 'ทุกชั้นเรียน' : 
             settings.language === 'en' ? 'All Classes' : 
             '所有班级' 
    },
    { value: 'm1-1', label: 'ม.1/1' },
    { value: 'm1-2', label: 'ม.1/2' },
    { value: 'm1-3', label: 'ม.1/3' },
    { value: 'm2-1', label: 'ม.2/1' },
    { value: 'm2-2', label: 'ม.2/2' }
  ];

  const exportReportCSV = () => {
    // Create CSV content based on the selected data
    const csvContent = generateCSV();
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set filename based on selected period and class
    const periodLabel = periods.find(p => p.value === selectedPeriod)?.label || selectedPeriod;
    const classLabel = classes.find(c => c.value === selectedClass)?.label || selectedClass;
    const timestamp = new Date().toISOString().split('T')[0];
    
    const filename = `performance_report_${periodLabel}_${classLabel}_${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    // Headers for the CSV file
    const headers = [
      settings.language === 'th' ? 'ชื่อ' : settings.language === 'en' ? 'Name' : '名称',
      settings.language === 'th' ? 'ค่า' : settings.language === 'en' ? 'Value' : '值',
      settings.language === 'th' ? 'เป้าหมาย' : settings.language === 'en' ? 'Target' : '目标',
      settings.language === 'th' ? 'หมายเหตุ' : settings.language === 'en' ? 'Notes' : '备注'
    ];
    
    // Combine all data for the report
    const reportData = [];
    
    // Add section header for class performance
    reportData.push([
      settings.language === 'th' ? '# ผลการเรียนรายชั้น' : 
      settings.language === 'en' ? '# Class Performance' : 
      '# 班级表现'
    ]);
    
    // Add class performance data
    classPerformanceData.forEach(item => {
      reportData.push([
        item.class,
        item.avgScore.toString(),
        '',
        `${settings.language === 'th' ? 'นักเรียน' : 
           settings.language === 'en' ? 'Students' : 
           '学生'}: ${item.students}, ${settings.language === 'th' ? 'พัฒนาการ' : 
                                        settings.language === 'en' ? 'Improvement' : 
                                        '进步'}: ${item.improvement}%`
      ]);
    });
    
    // Add empty row as separator
    reportData.push(['']);
    
    // Add section header for subject performance
    reportData.push([
      settings.language === 'th' ? '# ผลการเรียนรายวิชา' : 
      settings.language === 'en' ? '# Subject Performance' : 
      '# 科目表现'
    ]);
    
    // Add subject performance data
    subjectPerformanceData.forEach(item => {
      reportData.push([
        item.subject,
        item.score.toString(),
        item.target.toString(),
        `${settings.language === 'th' ? 'นักเรียน' : 
           settings.language === 'en' ? 'Students' : 
           '学生'}: ${item.students}`
      ]);
    });
    
    // Add empty row as separator
    reportData.push(['']);
    
    // Add section header for monthly trends
    reportData.push([
      settings.language === 'th' ? '# แนวโน้มรายเดือน' : 
      settings.language === 'en' ? '# Monthly Trends' : 
      '# 月度趋势'
    ]);
    
    // Add monthly trend data headers
    reportData.push([
      settings.language === 'th' ? 'เดือน' : settings.language === 'en' ? 'Month' : '月份',
      settings.language === 'th' ? 'คะแนน' : settings.language === 'en' ? 'Score' : '分数',
      settings.language === 'th' ? 'การมีส่วนร่วม' : settings.language === 'en' ? 'Participation' : '参与度',
      settings.language === 'th' ? 'การเข้าเรียน' : settings.language === 'en' ? 'Attendance' : '出勤率'
    ]);
    
    // Add monthly trend data
    monthlyTrendData.forEach(item => {
      reportData.push([
        item.month,
        item.score.toString(),
        item.participation.toString(),
        item.attendance.toString()
      ]);
    });
    
    // Add empty row as separator
    reportData.push(['']);
    
    // Add section header for grade distribution
    reportData.push([
      settings.language === 'th' ? '# การกระจายเกรด' : 
      settings.language === 'en' ? '# Grade Distribution' : 
      '# 成绩分布'
    ]);
    
    // Add grade distribution data
    gradeDistributionData.forEach(item => {
      reportData.push([
        item.grade,
        item.count.toString(),
        '',
        `${item.percentage}%`
      ]);
    });
    
    // Add empty row as separator
    reportData.push(['']);
    
    // Add section header for teaching effectiveness
    reportData.push([
      settings.language === 'th' ? '# ประสิทธิภาพวิธีการสอน' : 
      settings.language === 'en' ? '# Teaching Method Effectiveness' : 
      '# 教学方法效果'
    ]);
    
    // Add teaching effectiveness data
    teachingEffectivenessData.forEach(item => {
      reportData.push([
        item.method,
        item.effectiveness.toString(),
        item.usage.toString(),
        item.effectiveness > 85 && item.usage < 70 ? 
          (settings.language === 'th' ? 'ควรใช้มากขึ้น' : 
           settings.language === 'en' ? 'Use more often' : 
           '应更多使用') : 
          item.effectiveness < 80 ? 
            (settings.language === 'th' ? 'ต้องปรับปรุง' : 
             settings.language === 'en' ? 'Needs improvement' : 
             '需要改进') : 
            (settings.language === 'th' ? 'ใช้งานดี' : 
             settings.language === 'en' ? 'Good usage' : 
             '使用良好')
      ]);
    });
    
    // Convert all rows to CSV format
    return [headers, ...reportData].map(row => row.join(',')).join('\n');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400" />
          {t('pages.performanceAnalytics.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.performanceAnalytics.description')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {settings.language === 'th' ? 'ช่วงเวลา' : 
                 settings.language === 'en' ? 'Time Period' : 
                 '时间段'}
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {settings.language === 'th' ? 'ชั้นเรียน' : 
                 settings.language === 'en' ? 'Class' : 
                 '班级'}
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {classes.map(cls => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              {settings.language === 'th' ? 'รีเฟรช' : 
               settings.language === 'en' ? 'Refresh' : 
               '刷新'}
            </button>
            <button 
              onClick={exportReportCSV}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="h-4 w-4 inline mr-2" />
              {settings.language === 'th' ? 'ส่งออกรายงาน' : 
               settings.language === 'en' ? 'Export Report' : 
               '导出报告'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">165</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'นักเรียนทั้งหมด' : 
                 settings.language === 'en' ? 'Total Students' : 
                 '学生总数'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +5% {settings.language === 'th' ? 'จากเดือนที่แล้ว' : 
                     settings.language === 'en' ? 'from last month' : 
                     '较上月'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 dark:bg-green-600 p-3 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">82%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'คะแนนเฉลี่ย' : 
                 settings.language === 'en' ? 'Average Score' : 
                 '平均分数'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +3% {settings.language === 'th' ? 'จากเดือนที่แล้ว' : 
                     settings.language === 'en' ? 'from last month' : 
                     '较上月'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 dark:bg-purple-600 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'การเข้าเรียน' : 
                 settings.language === 'en' ? 'Attendance' : 
                 '出勤率'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +2% {settings.language === 'th' ? 'จากเดือนที่แล้ว' : 
                     settings.language === 'en' ? 'from last month' : 
                     '较上月'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 dark:bg-orange-600 p-3 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'บรรลุเป้าหมาย' : 
                 settings.language === 'en' ? 'Goals Achieved' : 
                 '目标达成'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +7% {settings.language === 'th' ? 'จากเดือนที่แล้ว' : 
                     settings.language === 'en' ? 'from last month' : 
                     '较上月'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Class Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {settings.language === 'th' ? 'ผลการเรียนรายชั้น' : 
             settings.language === 'en' ? 'Class Performance' : 
             '班级表现'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="class" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb', color: settings.theme === 'dark' ? '#f9fafb' : '#111827' }} />
                <Bar dataKey="avgScore" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {settings.language === 'th' ? 'ผลการเรียนรายวิชา' : 
             settings.language === 'en' ? 'Subject Performance' : 
             '科目表现'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="subject" type="category" width={80} stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb', color: settings.theme === 'dark' ? '#f9fafb' : '#111827' }} />
                <Bar dataKey="score" fill="#059669" />
                <Bar dataKey="target" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {settings.language === 'th' ? 'แนวโน้มรายเดือน' : 
             settings.language === 'en' ? 'Monthly Trends' : 
             '月度趋势'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb', color: settings.theme === 'dark' ? '#f9fafb' : '#111827' }} />
                <Area type="monotone" dataKey="score" stackId="1" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                <Area type="monotone" dataKey="participation" stackId="2" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                <Area type="monotone" dataKey="attendance" stackId="3" stroke="#DC2626" fill="#DC2626" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {settings.language === 'th' ? 'การกระจายเกรด' : 
             settings.language === 'en' ? 'Grade Distribution' : 
             '成绩分布'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={gradeDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: settings.theme === 'dark' ? '#374151' : '#e5e7eb', color: settings.theme === 'dark' ? '#f9fafb' : '#111827' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {gradeDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.grade}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.count} {settings.language === 'th' ? 'คน' : 
                               settings.language === 'en' ? 'students' : 
                               '人'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teaching Effectiveness */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {settings.language === 'th' ? 'ประสิทธิภาพวิธีการสอน' : 
           settings.language === 'en' ? 'Teaching Method Effectiveness' : 
           '教学方法效果'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {settings.language === 'th' ? 'วิธีการสอน' : 
                   settings.language === 'en' ? 'Teaching Method' : 
                   '教学方法'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {settings.language === 'th' ? 'ประสิทธิภาพ' : 
                   settings.language === 'en' ? 'Effectiveness' : 
                   '效果'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {settings.language === 'th' ? 'การใช้งาน' : 
                   settings.language === 'en' ? 'Usage' : 
                   '使用情况'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {settings.language === 'th' ? 'คำแนะนำ' : 
                   settings.language === 'en' ? 'Recommendation' : 
                   '建议'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {teachingEffectivenessData.map((method, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{method.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                          style={{ width: `${method.effectiveness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{method.effectiveness}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                          style={{ width: `${method.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{method.usage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {method.effectiveness > 85 && method.usage < 70 ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        {settings.language === 'th' ? 'ควรใช้มากขึ้น' : 
                         settings.language === 'en' ? 'Use more often' : 
                         '应更多使用'}
                      </span>
                    ) : method.effectiveness < 80 ? (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">
                        {settings.language === 'th' ? 'ต้องปรับปรุง' : 
                         settings.language === 'en' ? 'Needs improvement' : 
                         '需要改进'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                        {settings.language === 'th' ? 'ใช้งานดี' : 
                         settings.language === 'en' ? 'Good usage' : 
                         '使用良好'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'จุดแข็ง' : 
             settings.language === 'en' ? 'Strengths' : 
             '优势'}
          </h3>
          <ul className="space-y-2 text-green-800 dark:text-green-200">
            <li>• {settings.language === 'th' ? 'การเข้าเรียนของนักเรียนอยู่ในระดับดี (94%)' : 
                   settings.language === 'en' ? 'Student attendance is good (94%)' : 
                   '学生出勤率良好 (94%)'}</li>
            <li>• {settings.language === 'th' ? 'วิชาสังคมศึกษามีผลการเรียนสูงสุด (88%)' : 
                   settings.language === 'en' ? 'Social Studies has the highest performance (88%)' : 
                   '社会研究成绩最高 (88%)'}</li>
            <li>• {settings.language === 'th' ? 'การเรียนรู้แบบร่วมมือมีประสิทธิภาพสูง (92%)' : 
                   settings.language === 'en' ? 'Cooperative learning has high effectiveness (92%)' : 
                   '合作学习效果高 (92%)'}</li>
            <li>• {settings.language === 'th' ? 'นักเรียนส่วนใหญ่ได้เกรด B ขึ้นไป (65%)' : 
                   settings.language === 'en' ? 'Most students get grade B or higher (65%)' : 
                   '大多数学生获得B或更高等级 (65%)'}</li>
          </ul>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'จุดที่ต้องพัฒนา' : 
             settings.language === 'en' ? 'Areas for Improvement' : 
             '需要改进的方面'}
          </h3>
          <ul className="space-y-2 text-orange-800 dark:text-orange-200">
            <li>• {settings.language === 'th' ? 'วิชาคณิตศาสตร์ต้องการการสนับสนุนเพิ่มเติม' : 
                   settings.language === 'en' ? 'Mathematics needs additional support' : 
                   '数学需要额外支持'}</li>
            <li>• {settings.language === 'th' ? 'การสอนแบบสืบเสาะยังใช้น้อย แต่มีประสิทธิภาพ' : 
                   settings.language === 'en' ? 'Inquiry-based teaching is underused but effective' : 
                   '探究式教学使用较少但效果好'}</li>
            <li>• {settings.language === 'th' ? 'นักเรียนบางคนยังได้เกรด D และ F (12%)' : 
                   settings.language === 'en' ? 'Some students still get grades D and F (12%)' : 
                   '部分学生仍获得D和F等级 (12%)'}</li>
            <li>• {settings.language === 'th' ? 'ชั้น ม.1/2 มีผลการเรียนต่ำกว่าเป้าหมาย' : 
                   settings.language === 'en' ? 'Class M.1/2 has performance below target' : 
                   '1年级2班成绩低于目标'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;