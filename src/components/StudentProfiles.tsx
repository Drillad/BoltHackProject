import React, { useState, useEffect } from 'react';
import { User, Plus, Search, Edit, Trash2, Camera, Brain, Sparkles, Save, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Student {
  id?: string;
  studentId: string;
  name: string;
  grade: string;
  class: string;
  photoUrl?: string;
  personality: {
    traits: string[];
    learningStyle: string;
    interests: string[];
    strengths: string[];
    challenges: string[];
  };
  academicData: {
    subjects: { [key: string]: number };
    overallGrade: number;
    attendance: number;
    participation: number;
  };
  behavioralData: {
    cooperation: number;
    leadership: number;
    creativity: number;
    responsibility: number;
  };
  notes: {
    teacher: string;
    parent: string;
    observations: string[];
  };
}

const StudentProfiles: React.FC = () => {
  const { t, getStudents, saveStudent, updateStudent, generateAIContent, settings } = useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [newStudent, setNewStudent] = useState<Student>({
    studentId: '',
    name: '',
    grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
    class: '',
    personality: {
      traits: [],
      learningStyle: settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合',
      interests: [],
      strengths: [],
      challenges: []
    },
    academicData: {
      subjects: {},
      overallGrade: 0,
      attendance: 95,
      participation: 80
    },
    behavioralData: {
      cooperation: 80,
      leadership: 70,
      creativity: 75,
      responsibility: 85
    },
    notes: {
      teacher: '',
      parent: '',
      observations: []
    }
  });

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
    settings.language === 'th' ? 'ม.3' : settings.language === 'en' ? 'Grade 9' : '9年级'
  ];

  const personalityTraits = settings.language === 'th' ? 
    ['ขยัน', 'สุภาพ', 'ช่วยเหลือผู้อื่น', 'มีความคิดสร้างสรรค์', 'เป็นผู้นำ', 'ชอบทำงานเป็นทีม', 'มีความรับผิดชอบ', 'ใจเย็น', 'กล้าแสดงออก', 'ชอบเรียนรู้'] :
    settings.language === 'en' ?
    ['Hardworking', 'Polite', 'Helpful', 'Creative', 'Leadership', 'Team Player', 'Responsible', 'Patient', 'Expressive', 'Curious'] :
    ['勤奋', '礼貌', '乐于助人', '有创造力', '领导力', '团队合作', '负责任', '耐心', '表达能力强', '好奇心强'];

  const learningStyles = [
    { 
      value: settings.language === 'th' ? 'ภาพ' : settings.language === 'en' ? 'Visual' : '视觉型',
      label: settings.language === 'th' ? 'ภาพ (Visual)' : settings.language === 'en' ? 'Visual' : '视觉型'
    },
    { 
      value: settings.language === 'th' ? 'เสียง' : settings.language === 'en' ? 'Auditory' : '听觉型',
      label: settings.language === 'th' ? 'เสียง (Auditory)' : settings.language === 'en' ? 'Auditory' : '听觉型'
    },
    { 
      value: settings.language === 'th' ? 'การเคลื่อนไหว' : settings.language === 'en' ? 'Kinesthetic' : '动觉型',
      label: settings.language === 'th' ? 'การเคลื่อนไหว (Kinesthetic)' : settings.language === 'en' ? 'Kinesthetic' : '动觉型'
    },
    { 
      value: settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合型',
      label: settings.language === 'th' ? 'ผสมผสาน (Mixed)' : settings.language === 'en' ? 'Mixed' : '混合型'
    }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedGrade]);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      
      // Ensure all student data has the required structure
      const processedData = data.map(student => {
        // Make sure academicData exists and has the required properties
        if (!student.academicData) {
          student.academicData = {
            subjects: {},
            overallGrade: 0,
            attendance: 95,
            participation: 80
          };
        } else if (student.academicData && !student.academicData.overallGrade) {
          student.academicData.overallGrade = 0;
        }
        
        // Make sure personality exists and has the required properties
        if (!student.personality) {
          student.personality = {
            traits: [],
            learningStyle: settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合',
            interests: [],
            strengths: [],
            challenges: []
          };
        }
        
        // Make sure behavioralData exists
        if (!student.behavioralData) {
          student.behavioralData = {
            cooperation: 80,
            leadership: 70,
            creativity: 75,
            responsibility: 85
          };
        }
        
        // Make sure notes exists
        if (!student.notes) {
          student.notes = {
            teacher: '',
            parent: '',
            observations: []
          };
        }
        
        return student;
      });
      
      setStudents(processedData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm)
      );
    }

    if (selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')) {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    setFilteredStudents(filtered);
  };

  const generateStudentProfile = async () => {
    if (!newStudent.name || !newStudent.grade) {
      alert(settings.language === 'th' ? 'กรุณากรอกชื่อและระดับชั้น' :
            settings.language === 'en' ? 'Please enter name and grade' :
            '请输入姓名和年级');
      return;
    }

    setIsGeneratingProfile(true);
    try {
      const context = {
        studentName: newStudent.name,
        grade: newStudent.grade,
        class: newStudent.class
      };
      
      const aiSuggestions = await generateAIContent('student-profile-suggestions', context);
      
      // Parse AI suggestions and update the student profile
      // This is a simplified implementation - you might want to parse the AI response more sophisticatedly
      setNewStudent(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          traits: personalityTraits.slice(0, 3), // Default traits
          interests: [
            settings.language === 'th' ? 'การอ่าน' : settings.language === 'en' ? 'Reading' : '阅读',
            settings.language === 'th' ? 'กีฬา' : settings.language === 'en' ? 'Sports' : '运动'
          ]
        },
        notes: {
          ...prev.notes,
          teacher: aiSuggestions.substring(0, 200) + '...'
        }
      }));
    } catch (error) {
      console.error('Error generating student profile:', error);
      alert(settings.language === 'th' ? 'เกิดข้อผิดพลาดในการสร้างโปรไฟล์' :
            settings.language === 'en' ? 'Error generating profile' :
            '生成档案时出错');
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleSaveStudent = async () => {
    try {
      // Ensure academicData is properly structured before saving
      const studentToSave = {
        ...newStudent,
        academicData: {
          subjects: newStudent.academicData?.subjects || {},
          overallGrade: newStudent.academicData?.overallGrade || 0,
          attendance: newStudent.academicData?.attendance || 95,
          participation: newStudent.academicData?.participation || 80
        }
      };
      
      let success;
      if (editingStudent) {
        success = await updateStudent(editingStudent.id!, studentToSave);
      } else {
        success = await saveStudent(studentToSave);
      }

      if (success) {
        await loadStudents();
        setShowAddForm(false);
        setEditingStudent(null);
        resetForm();
        alert(editingStudent ? 
          (settings.language === 'th' ? 'อัปเดตข้อมูลนักเรียนเรียบร้อย' :
           settings.language === 'en' ? 'Student updated successfully' :
           '学生信息更新成功') :
          (settings.language === 'th' ? 'เพิ่มนักเรียนเรียบร้อย' :
           settings.language === 'en' ? 'Student added successfully' :
           '学生添加成功')
        );
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert(settings.language === 'th' ? 'เกิดข้อผิดพลาดในการบันทึก' :
            settings.language === 'en' ? 'Error saving student' :
            '保存学生信息时出错');
    }
  };

  const resetForm = () => {
    setNewStudent({
      studentId: '',
      name: '',
      grade: settings.language === 'th' ? 'ม.1' : settings.language === 'en' ? 'Grade 7' : '7年级',
      class: '',
      personality: {
        traits: [],
        learningStyle: settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合',
        interests: [],
        strengths: [],
        challenges: []
      },
      academicData: {
        subjects: {},
        overallGrade: 0,
        attendance: 95,
        participation: 80
      },
      behavioralData: {
        cooperation: 80,
        leadership: 70,
        creativity: 75,
        responsibility: 85
      },
      notes: {
        teacher: '',
        parent: '',
        observations: []
      }
    });
  };

  const handleEditStudent = (student: Student) => {
    // Ensure the student object has all required properties before editing
    const studentToEdit = {
      ...student,
      academicData: {
        subjects: student.academicData?.subjects || {},
        overallGrade: student.academicData?.overallGrade || 0,
        attendance: student.academicData?.attendance || 95,
        participation: student.academicData?.participation || 80
      },
      personality: {
        traits: student.personality?.traits || [],
        learningStyle: student.personality?.learningStyle || (settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合'),
        interests: student.personality?.interests || [],
        strengths: student.personality?.strengths || [],
        challenges: student.personality?.challenges || []
      },
      behavioralData: {
        cooperation: student.behavioralData?.cooperation || 80,
        leadership: student.behavioralData?.leadership || 70,
        creativity: student.behavioralData?.creativity || 75,
        responsibility: student.behavioralData?.responsibility || 85
      },
      notes: {
        teacher: student.notes?.teacher || '',
        parent: student.notes?.parent || '',
        observations: student.notes?.observations || []
      }
    };
    
    setNewStudent(studentToEdit);
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (grade >= 80) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    if (grade >= 60) return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <User className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              {settings.language === 'th' ? 'ข้อมูลนักเรียน' : 
               settings.language === 'en' ? 'Student Profiles' : 
               '学生档案'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {settings.language === 'th' ? 'จัดการข้อมูลและโปรไฟล์นักเรียน' : 
               settings.language === 'en' ? 'Manage student data and profiles' : 
               '管理学生数据和档案'}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {settings.language === 'th' ? 'เพิ่มนักเรียน' : 
             settings.language === 'en' ? 'Add Student' : 
             '添加学生'}
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
              placeholder={settings.language === 'th' ? 'ค้นหานักเรียน...' : 
                          settings.language === 'en' ? 'Search students...' : 
                          '搜索学生...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
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
               '总共'} {filteredStudents.length} {settings.language === 'th' ? 'คน' : 
                                                  settings.language === 'en' ? 'students' : 
                                                  '人'}
            </span>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{student.studentId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{student.grade} • {student.class}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {settings.language === 'th' ? 'เกรดเฉลี่ย:' : 
                     settings.language === 'en' ? 'Overall Grade:' : 
                     '总成绩:'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.academicData?.overallGrade || 0)}`}>
                    {student.academicData?.overallGrade || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {settings.language === 'th' ? 'การเข้าเรียน:' : 
                     settings.language === 'en' ? 'Attendance:' : 
                     '出勤率:'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{student.academicData?.attendance || 0}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {settings.language === 'th' ? 'การมีส่วนร่วม:' : 
                     settings.language === 'en' ? 'Participation:' : 
                     '参与度:'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{student.academicData?.participation || 0}%</span>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {settings.language === 'th' ? 'รูปแบบการเรียน:' : 
                     settings.language === 'en' ? 'Learning Style:' : 
                     '学习方式:'}
                  </p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                    {student.personality?.learningStyle || (settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <User className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'ดูโปรไฟล์' : 
                   settings.language === 'en' ? 'View Profile' : 
                   '查看档案'}
                </button>
                <button
                  onClick={() => handleEditStudent(student)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {settings.language === 'th' ? 'แก้ไข' : 
                   settings.language === 'en' ? 'Edit' : 
                   '编辑'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {settings.language === 'th' ? 'ไม่พบนักเรียน' : 
               settings.language === 'en' ? 'No students found' : 
               '未找到学生'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedGrade !== (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部')
                ? (settings.language === 'th' ? 'ไม่พบนักเรียนที่ตรงกับเงื่อนไขการค้นหา' : 
                   settings.language === 'en' ? 'No students match your search criteria' : 
                   '没有符合您搜索条件的学生') 
                : (settings.language === 'th' ? 'คุณยังไม่มีข้อมูลนักเรียน เริ่มเพิ่มนักเรียนคนแรกของคุณ' : 
                   settings.language === 'en' ? 'You don\'t have any students yet. Start adding your first student' : 
                   '您还没有任何学生。开始添加您的第一个学生')
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingStudent ? 
                    (settings.language === 'th' ? 'แก้ไขข้อมูลนักเรียน' :
                     settings.language === 'en' ? 'Edit Student' :
                     '编辑学生') :
                    (settings.language === 'th' ? 'เพิ่มนักเรียนใหม่' :
                     settings.language === 'en' ? 'Add New Student' :
                     '添加新学生')
                  }
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'ข้อมูลพื้นฐาน' :
                   settings.language === 'en' ? 'Basic Information' :
                   '基本信息'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'รหัสนักเรียน' :
                       settings.language === 'en' ? 'Student ID' :
                       '学生ID'}
                    </label>
                    <input
                      type="text"
                      value={newStudent.studentId}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ชื่อ-นามสกุล' :
                       settings.language === 'en' ? 'Full Name' :
                       '姓名'}
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ระดับชั้น' :
                       settings.language === 'en' ? 'Grade' :
                       '年级'}
                    </label>
                    <select
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      {grades.slice(1).map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ห้อง' :
                       settings.language === 'en' ? 'Class' :
                       '班级'}
                    </label>
                    <input
                      type="text"
                      value={newStudent.class}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={generateStudentProfile}
                    disabled={isGeneratingProfile || !newStudent.name}
                    className="flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isGeneratingProfile ? 
                      (settings.language === 'th' ? 'กำลังสร้าง...' :
                       settings.language === 'en' ? 'Generating...' :
                       '生成中...') :
                      (settings.language === 'th' ? 'สร้างโปรไฟล์ด้วย AI' :
                       settings.language === 'en' ? 'Generate Profile with AI' :
                       '使用AI生成档案')
                    }
                  </button>
                </div>
              </div>

              {/* Personality */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'บุคลิกภาพ' :
                   settings.language === 'en' ? 'Personality' :
                   '性格'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'รูปแบบการเรียนรู้' :
                       settings.language === 'en' ? 'Learning Style' :
                       '学习方式'}
                    </label>
                    <select
                      value={newStudent.personality.learningStyle}
                      onChange={(e) => setNewStudent(prev => ({
                        ...prev,
                        personality: { ...prev.personality, learningStyle: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      {learningStyles.map(style => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ลักษณะนิสัย' :
                       settings.language === 'en' ? 'Personality Traits' :
                       '性格特征'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {personalityTraits.map(trait => (
                        <label key={trait} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newStudent.personality.traits.includes(trait)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewStudent(prev => ({
                                  ...prev,
                                  personality: {
                                    ...prev.personality,
                                    traits: [...prev.personality.traits, trait]
                                  }
                                }));
                              } else {
                                setNewStudent(prev => ({
                                  ...prev,
                                  personality: {
                                    ...prev.personality,
                                    traits: prev.personality.traits.filter(t => t !== trait)
                                  }
                                }));
                              }
                            }}
                            className="mr-2 text-indigo-600 dark:bg-gray-700"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{trait}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Data */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'ข้อมูลการเรียน' :
                   settings.language === 'en' ? 'Academic Data' :
                   '学业数据'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'เกรดเฉลี่ย (%)' :
                       settings.language === 'en' ? 'Overall Grade (%)' :
                       '总成绩 (%)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newStudent.academicData.overallGrade}
                      onChange={(e) => setNewStudent(prev => ({
                        ...prev,
                        academicData: { 
                          ...prev.academicData, 
                          overallGrade: parseInt(e.target.value) || 0 
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'การเข้าเรียน (%)' :
                       settings.language === 'en' ? 'Attendance (%)' :
                       '出勤率 (%)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newStudent.academicData.attendance}
                      onChange={(e) => setNewStudent(prev => ({
                        ...prev,
                        academicData: { 
                          ...prev.academicData, 
                          attendance: parseInt(e.target.value) || 0 
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'การมีส่วนร่วม (%)' :
                       settings.language === 'en' ? 'Participation (%)' :
                       '参与度 (%)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newStudent.academicData.participation}
                      onChange={(e) => setNewStudent(prev => ({
                        ...prev,
                        academicData: { 
                          ...prev.academicData, 
                          participation: parseInt(e.target.value) || 0 
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'บันทึกเพิ่มเติม' :
                   settings.language === 'en' ? 'Additional Notes' :
                   '附加备注'}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {settings.language === 'th' ? 'บันทึกของครู' :
                     settings.language === 'en' ? 'Teacher Notes' :
                     '教师备注'}
                  </label>
                  <textarea
                    value={newStudent.notes.teacher}
                    onChange={(e) => setNewStudent(prev => ({
                      ...prev,
                      notes: { ...prev.notes, teacher: e.target.value }
                    }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingStudent(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {settings.language === 'th' ? 'ยกเลิก' :
                 settings.language === 'en' ? 'Cancel' :
                 '取消'}
              </button>
              <button
                onClick={handleSaveStudent}
                className="flex items-center px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingStudent ? 
                  (settings.language === 'th' ? 'อัปเดต' :
                   settings.language === 'en' ? 'Update' :
                   '更新') :
                  (settings.language === 'th' ? 'บันทึก' :
                   settings.language === 'en' ? 'Save' :
                   '保存')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    {selectedStudent.photoUrl ? (
                      <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStudent.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{selectedStudent.studentId} • {selectedStudent.grade} • {selectedStudent.class}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Academic Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'ผลการเรียน' :
                   settings.language === 'en' ? 'Academic Performance' :
                   '学业表现'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${getGradeColor(selectedStudent.academicData?.overallGrade || 0).split(' ')[0]}`}>
                        {selectedStudent.academicData?.overallGrade || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {settings.language === 'th' ? 'เกรดเฉลี่ย' :
                         settings.language === 'en' ? 'Overall Grade' :
                         '总成绩'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {selectedStudent.academicData?.attendance || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {settings.language === 'th' ? 'การเข้าเรียน' :
                         settings.language === 'en' ? 'Attendance' :
                         '出勤率'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {selectedStudent.academicData?.participation || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {settings.language === 'th' ? 'การมีส่วนร่วม' :
                         settings.language === 'en' ? 'Participation' :
                         '参与度'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personality */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {settings.language === 'th' ? 'บุคลิกภาพ' :
                   settings.language === 'en' ? 'Personality' :
                   '性格'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'รูปแบบการเรียนรู้:' :
                       settings.language === 'en' ? 'Learning Style:' :
                       '学习方式:'}
                    </p>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                      {selectedStudent.personality?.learningStyle || (settings.language === 'th' ? 'ผสมผสาน' : settings.language === 'en' ? 'Mixed' : '混合')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {settings.language === 'th' ? 'ลักษณะนิสัย:' :
                       settings.language === 'en' ? 'Personality Traits:' :
                       '性格特征:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedStudent.personality?.traits || []).map((trait, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-sm">
                          {trait}
                        </span>
                      ))}
                      {(selectedStudent.personality?.traits || []).length === 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'ไม่มีข้อมูล' :
                           settings.language === 'en' ? 'No data available' :
                           '无可用数据'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Notes */}
              {selectedStudent.notes?.teacher && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {settings.language === 'th' ? 'บันทึกของครู' :
                     settings.language === 'en' ? 'Teacher Notes' :
                     '教师备注'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedStudent.notes.teacher}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {settings.language === 'th' ? 'ปิด' :
                 settings.language === 'en' ? 'Close' :
                 '关闭'}
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  handleEditStudent(selectedStudent);
                }}
                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                {settings.language === 'th' ? 'แก้ไขข้อมูล' :
                 settings.language === 'en' ? 'Edit Profile' :
                 '编辑档案'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfiles;