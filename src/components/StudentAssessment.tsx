import React, { useState } from 'react';
import { Users, TrendingUp, Award, BarChart3, User, Search, Filter, Download, Brain, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  scores: {
    subject: string;
    tests: number[];
    assignments: number[];
    participation: number;
    overall: number;
  }[];
}

const StudentAssessment: React.FC = () => {
  const { t, generateAIContent, settings } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const students: Student[] = [
    {
      id: '1',
      name: t('student.somjai'),
      studentId: '12345',
      grade: settings.language === 'th' ? 'ม.1/1' : settings.language === 'en' ? 'Grade 7/1' : '7年级1班',
      scores: [
        {
          subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
          tests: [85, 78, 82],
          assignments: [88, 85, 90],
          participation: 85,
          overall: 84
        },
        {
          subject: settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
          tests: [75, 70, 78],
          assignments: [80, 75, 82],
          participation: 78,
          overall: 76
        }
      ]
    },
    {
      id: '2',
      name: t('student.somsak'),
      studentId: '12346',
      grade: settings.language === 'th' ? 'ม.1/1' : settings.language === 'en' ? 'Grade 7/1' : '7年级1班',
      scores: [
        {
          subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
          tests: [92, 88, 90],
          assignments: [95, 90, 88],
          participation: 92,
          overall: 91
        },
        {
          subject: settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
          tests: [88, 85, 90],
          assignments: [90, 88, 92],
          participation: 90,
          overall: 89
        }
      ]
    },
    {
      id: '3',
      name: t('student.priya'),
      studentId: '12347',
      grade: settings.language === 'th' ? 'ม.1/1' : settings.language === 'en' ? 'Grade 7/1' : '7年级1班',
      scores: [
        {
          subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
          tests: [70, 68, 72],
          assignments: [75, 70, 78],
          participation: 72,
          overall: 72
        },
        {
          subject: settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
          tests: [65, 62, 68],
          assignments: [70, 68, 72],
          participation: 68,
          overall: 67
        }
      ]
    }
  ];

  const subjects = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部', 
    settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语', 
    settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学', 
    settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学', 
    settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究'
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  );

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    if (score >= 60) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const getGradeLabel = (score: number) => {
    if (score >= 90) return settings.language === 'th' ? 'ดีเยี่ยม' : settings.language === 'en' ? 'Excellent' : '优秀';
    if (score >= 80) return settings.language === 'th' ? 'ดี' : settings.language === 'en' ? 'Good' : '良好';
    if (score >= 70) return settings.language === 'th' ? 'ปานกลาง' : settings.language === 'en' ? 'Fair' : '一般';
    if (score >= 60) return settings.language === 'th' ? 'พอใช้' : settings.language === 'en' ? 'Satisfactory' : '及格';
    return settings.language === 'th' ? 'ต้องปรับปรุง' : settings.language === 'en' ? 'Needs Improvement' : '需要改进';
  };

  const generateStudentAnalysis = async (student: Student) => {
    setIsGeneratingAnalysis(true);
    try {
      const context = {
        studentName: student.name,
        scores: {
          average: Math.round(student.scores.reduce((sum, score) => sum + score.overall, 0) / student.scores.length)
        },
        behavior: 'active participation'
      };
      
      const analysis = await generateAIContent('student-analysis', context);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error generating student analysis:', error);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const downloadStudentData = () => {
    const csvContent = generateCSV(students);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (students: Student[]) => {
    const headers = [
      settings.language === 'th' ? 'รหัสนักเรียน' : settings.language === 'en' ? 'Student ID' : '学生ID',
      settings.language === 'th' ? 'ชื่อ-นามสกุล' : settings.language === 'en' ? 'Full Name' : '姓名',
      settings.language === 'th' ? 'ระดับชั้น' : settings.language === 'en' ? 'Grade' : '年级',
      settings.language === 'th' ? 'วิชา' : settings.language === 'en' ? 'Subject' : '科目',
      settings.language === 'th' ? 'คะแนนสอบ1' : settings.language === 'en' ? 'Test 1' : '测试1',
      settings.language === 'th' ? 'คะแนนสอบ2' : settings.language === 'en' ? 'Test 2' : '测试2',
      settings.language === 'th' ? 'คะแนนสอบ3' : settings.language === 'en' ? 'Test 3' : '测试3',
      settings.language === 'th' ? 'คะแนนงาน1' : settings.language === 'en' ? 'Assignment 1' : '作业1',
      settings.language === 'th' ? 'คะแนนงาน2' : settings.language === 'en' ? 'Assignment 2' : '作业2',
      settings.language === 'th' ? 'คะแนนงาน3' : settings.language === 'en' ? 'Assignment 3' : '作业3',
      settings.language === 'th' ? 'คะแนนมีส่วนร่วม' : settings.language === 'en' ? 'Participation' : '参与度',
      settings.language === 'th' ? 'คะแนนรวม' : settings.language === 'en' ? 'Overall' : '总分'
    ];

    const rows = [];
    students.forEach(student => {
      student.scores.forEach(score => {
        rows.push([
          student.studentId,
          student.name,
          student.grade,
          score.subject,
          score.tests[0] || '',
          score.tests[1] || '',
          score.tests[2] || '',
          score.assignments[0] || '',
          score.assignments[1] || '',
          score.assignments[2] || '',
          score.participation,
          score.overall
        ]);
      });
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400" />
          {t('pages.studentAssessment.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.studentAssessment.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {settings.language === 'th' ? 'รายชื่อนักเรียน' : 
                 settings.language === 'en' ? 'Student List' : 
                 '学生名单'}
              </h3>
              <button 
                onClick={downloadStudentData}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title={settings.language === 'th' ? 'ดาวน์โหลดข้อมูลนักเรียน CSV' : 
                      settings.language === 'en' ? 'Download student data CSV' : 
                      '下载学生数据CSV'}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Search and Filter */}
            <div className="mb-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={settings.language === 'th' ? 'ค้นหานักเรียน...' : 
                              settings.language === 'en' ? 'Search students...' : 
                              '搜索学生...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => {
                const avgScore = student.scores.reduce((sum, score) => sum + score.overall, 0) / student.scores.length;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent === student.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId} • {student.grade}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(avgScore)}`}>
                            {Math.round(avgScore)}% • {getGradeLabel(avgScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudentData ? (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedStudentData.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedStudentData.studentId} • {selectedStudentData.grade}</p>
                  </div>
                  <button
                    onClick={() => generateStudentAnalysis(selectedStudentData)}
                    disabled={isGeneratingAnalysis}
                    className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isGeneratingAnalysis ? t('ai.generating') : t('studentAssessment.aiAnalysis')}
                  </button>
                </div>

                {/* AI Analysis */}
                {aiAnalysis && (
                  <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('ai.analysis')}
                    </h4>
                    <div className="text-sm text-purple-800 dark:text-purple-200 whitespace-pre-line">{aiAnalysis}</div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedStudentData.scores.map((subject, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{subject.subject}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{subject.overall}%</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.overall)}`}>
                          {getGradeLabel(subject.overall)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Scores */}
              {selectedStudentData.scores.map((subject, subjectIndex) => (
                <div key={subjectIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    {subject.subject}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Tests */}
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {settings.language === 'th' ? 'การทดสอบ' : 
                         settings.language === 'en' ? 'Tests' : 
                         '测试'}
                      </h4>
                      <div className="space-y-2">
                        {subject.tests.map((score, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {settings.language === 'th' ? 'ครั้งที่' : 
                               settings.language === 'en' ? 'Test' : 
                               '测试'} {index + 1}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(score)}`}>
                              {score}%
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {settings.language === 'th' ? 'เฉลี่ย' : 
                               settings.language === 'en' ? 'Average' : 
                               '平均'}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Math.round(subject.tests.reduce((a, b) => a + b, 0) / subject.tests.length)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assignments */}
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {settings.language === 'th' ? 'งานที่มอบหมาย' : 
                         settings.language === 'en' ? 'Assignments' : 
                         '作业'}
                      </h4>
                      <div className="space-y-2">
                        {subject.assignments.map((score, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {settings.language === 'th' ? 'งานที่' : 
                               settings.language === 'en' ? 'Assignment' : 
                               '作业'} {index + 1}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(score)}`}>
                              {score}%
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {settings.language === 'th' ? 'เฉลี่ย' : 
                               settings.language === 'en' ? 'Average' : 
                               '平均'}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {Math.round(subject.assignments.reduce((a, b) => a + b, 0) / subject.assignments.length)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Participation */}
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {settings.language === 'th' ? 'การมีส่วนร่วม' : 
                         settings.language === 'en' ? 'Participation' : 
                         '参与度'}
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <div className={`text-2xl font-bold mb-1 ${getGradeColor(subject.participation).split(' ')[0]}`}>
                          {subject.participation}%
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.participation)}`}>
                          {getGradeLabel(subject.participation)}
                        </span>
                      </div>
                    </div>

                    {/* Overall */}
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {settings.language === 'th' ? 'คะแนนรวม' : 
                         settings.language === 'en' ? 'Overall Score' : 
                         '总分'}
                      </h4>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {subject.overall}%
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.overall)}`}>
                          {getGradeLabel(subject.overall)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('studentAssessment.recommendations')}
                    </h4>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      {subject.overall >= 90 ? (
                        <p>
                          {settings.language === 'th' ? 'นักเรียนมีผลการเรียนดีเยี่ยม ควรส่งเสริมให้เป็นผู้ช่วยสอนเพื่อนร่วมชั้น' : 
                           settings.language === 'en' ? 'Student has excellent performance. Consider encouraging them to help teach classmates.' : 
                           '学生表现优秀。考虑鼓励他们帮助教导同学。'}
                        </p>
                      ) : subject.overall >= 80 ? (
                        <p>
                          {settings.language === 'th' ? 'นักเรียนมีผลการเรียนดี ควรมอบหมายงานที่ท้าทายมากขึ้น' : 
                           settings.language === 'en' ? 'Student has good performance. Consider assigning more challenging tasks.' : 
                           '学生表现良好。考虑分配更具挑战性的任务。'}
                        </p>
                      ) : subject.overall >= 70 ? (
                        <p>
                          {settings.language === 'th' ? 'นักเรียนมีผลการเรียนปานกลาง ควรให้การสนับสนุนเพิ่มเติม' : 
                           settings.language === 'en' ? 'Student has average performance. Should provide additional support.' : 
                           '学生表现一般。应提供额外支持。'}
                        </p>
                      ) : subject.overall >= 60 ? (
                        <p>
                          {settings.language === 'th' ? 'นักเรียนต้องการการช่วยเหลืออย่างใกล้ชิด และอาจต้องมีการสอนเสริม' : 
                           settings.language === 'en' ? 'Student needs close assistance and may require supplementary teaching.' : 
                           '学生需要密切协助，可能需要补充教学。'}
                        </p>
                      ) : (
                        <p>
                          {settings.language === 'th' ? 'นักเรียนต้องการการช่วยเหลือเร่งด่วน ควรปรึกษาผู้ปกครองและจัดทำแผนการสอนเสริม' : 
                           settings.language === 'en' ? 'Student needs urgent help. Should consult parents and create a supplementary teaching plan.' : 
                           '学生需要紧急帮助。应咨询家长并制定补充教学计划。'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {settings.language === 'th' ? 'เลือกนักเรียน' : 
                 settings.language === 'en' ? 'Select a Student' : 
                 '选择学生'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'กรุณาเลือกนักเรียนจากรายชื่อด้านซ้ายเพื่อดูรายละเอียดการประเมิน' : 
                 settings.language === 'en' ? 'Please select a student from the list on the left to view assessment details' : 
                 '请从左侧列表中选择学生以查看评估详情'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssessment;