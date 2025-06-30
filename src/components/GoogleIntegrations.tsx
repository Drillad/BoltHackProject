import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  CheckCircle, 
  Clock, 
  Upload,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertCircle,
  Link,
  Unlink,
  RefreshCw,
  UserPlus,
  BookOpen,
  Globe
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const GoogleIntegrations: React.FC = () => {
  const { settings, getStudents } = useApp();
  const [isConnected, setIsConnected] = useState({
    forms: false,
    classroom: false,
    drive: false,
    calendar: false,
    teams: false
  });

  const [isConnecting, setIsConnecting] = useState({
    forms: false,
    classroom: false,
    drive: false,
    calendar: false,
    teams: false
  });

  const [formData, setFormData] = useState([
    {
      id: '1',
      title: settings.language === 'th' ? 'แบบประเมินความเข้าใจ - บทที่ 1' :
             settings.language === 'en' ? 'Comprehension Assessment - Chapter 1' :
             '理解评估 - 第1章',
      responses: 28,
      avgScore: 85,
      lastResponse: settings.language === 'th' ? '2 ชั่วโมงที่แล้ว' :
                    settings.language === 'en' ? '2 hours ago' :
                    '2小时前',
      status: 'active'
    },
    {
      id: '2', 
      title: settings.language === 'th' ? 'แบบสอบถามความพึงพอใจการเรียน' :
             settings.language ===   'en' ? 'Learning Satisfaction Survey' :
             '学习满意度调查',
      responses: 32,
      avgScore: 92,
      lastResponse: settings.language === 'th' ? '1 วันที่แล้ว' :
                    settings.language === 'en' ? '1 day ago' :
                    '1天前',
      status: 'active'
    }
  ]);

  const [classroomData, setClassroomData] = useState([
    {
      id: '1',
      className: settings.language === 'th' ? 'ภาษาไทย ม.1/1' :
                 settings.language === 'en' ? 'Thai Language G.7/1' :
                 '泰语 7年级1班',
      students: 35,
      assignments: 12,
      pendingGrades: 8,
      nextClass: settings.language === 'th' ? 'วันจันทร์ 08:00' :
                 settings.language === 'en' ? 'Monday 08:00' :
                 '周一 08:00'
    },
    {
      id: '2',
      className: settings.language === 'th' ? 'ภาษาไทย ม.1/2' :
                 settings.language === 'en' ? 'Thai Language G.7/2' :
                 '泰语 7年级2班', 
      students: 33,
      assignments: 10,
      pendingGrades: 5,
      nextClass: settings.language === 'th' ? 'วันจันทร์ 10:00' :
                 settings.language === 'en' ? 'Monday 10:00' :
                 '周一 10:00'
    }
  ]);

  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const students = await getStudents();
      setStudentsData(students);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectService = (service: string) => {
    // Simulate connection process with loading state
    setIsConnecting(prev => ({ ...prev, [service]: true }));
    
    // Simulate API call delay
    setTimeout(() => {
      setIsConnecting(prev => ({ ...prev, [service]: false }));
      setIsConnected(prev => ({ ...prev, [service]: true }));
      
      // Show success message
      const serviceName = service === 'classroom' ? 'Google Classroom' : 
                         service === 'forms' ? 'Google Forms' :
                         service === 'drive' ? 'Google Drive' :
                         service === 'calendar' ? 'Google Calendar' :
                         service === 'teams' ? 'Microsoft Teams' : service;
      
      alert(`${serviceName} ${settings.language === 'th' ? 'เชื่อมต่อสำเร็จ!' : 
                              settings.language === 'en' ? 'connected successfully!' : 
                              '连接成功！'}`);
    }, 1500);
  };

  const disconnectService = (service: string) => {
    setIsConnected(prev => ({ ...prev, [service]: false }));
  };

  const handleConnectedServiceClick = (service: string) => {
    // If already connected, show the actual service interface
    const serviceUrls = {
      forms: 'https://docs.google.com/forms/',
      classroom: 'https://classroom.google.com/',
      drive: 'https://drive.google.com/',
      calendar: 'https://calendar.google.com/',
      teams: 'https://teams.microsoft.com/'
    };
    
    const url = serviceUrls[service as keyof typeof serviceUrls];
    if (url) {
      window.open(url, '_blank');
    }
  };

  const syncStudentsFromClassroom = () => {
    // Simulate syncing students from Google Classroom
    alert(settings.language === 'th' ? 'ซิงค์ข้อมูลนักเรียนจาก Google Classroom สำเร็จ!' :
          settings.language === 'en' ? 'Successfully synced student data from Google Classroom!' :
          '成功从 Google Classroom 同步学生数据！');
  };

  const syncStudentsFromTeams = () => {
    // Simulate syncing students from Microsoft Teams
    alert(settings.language === 'th' ? 'ซิงค์ข้อมูลนักเรียนจาก Microsoft Teams สำเร็จ!' :
          settings.language === 'en' ? 'Successfully synced student data from Microsoft Teams!' :
          '成功从 Microsoft Teams 同步学生数据！');
  };

  const addNewStudent = () => {
    alert(settings.language === 'th' ? 'กรุณาเพิ่มนักเรียนในหน้าข้อมูลนักเรียน' :
          settings.language === 'en' ? 'Please add students in the Student Profiles page' :
          '请在学生档案页面添加学生');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <ExternalLink className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
          {settings.language === 'th' ? 'การเชื่อมต่อบริการภายนอก' : 
           settings.language === 'en' ? 'External Service Integrations' : 
           '外部服务集成'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {settings.language === 'th' ? 'เชื่อมต่อและจัดการบริการต่างๆ เพื่อการสอนที่มีประสิทธิภาพ' :
           settings.language === 'en' ? 'Connect and manage various services for effective teaching' :
           '连接和管理各种服务以实现有效教学'}
        </p>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {[
          { key: 'forms', name: 'Google Forms', icon: FileText, color: 'green' },
          { key: 'classroom', name: 'Google Classroom', icon: Users, color: 'blue' },
          { key: 'drive', name: 'Google Drive', icon: Upload, color: 'yellow' },
          { key: 'calendar', name: 'Google Calendar', icon: Calendar, color: 'red' },
          { key: 'teams', name: 'Microsoft Teams', icon: Users, color: 'purple' }
        ].map((service) => (
          <div key={service.key} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <service.icon className={`h-8 w-8 text-${service.color}-600 dark:text-${service.color}-400`} />
              {isConnected[service.key as keyof typeof isConnected] ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
            <p className={`text-sm mb-3 ${isConnected[service.key as keyof typeof isConnected] ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isConnected[service.key as keyof typeof isConnected] ? 
                (settings.language === 'th' ? 'เชื่อมต่อแล้ว' : settings.language === 'en' ? 'Connected' : '已连接') : 
                (settings.language === 'th' ? 'ยังไม่ได้เชื่อมต่อ' : settings.language === 'en' ? 'Not connected' : '未连接')
              }
            </p>
            
            {isConnected[service.key as keyof typeof isConnected] ? (
              <div className="space-y-2">
                <button 
                  onClick={() => handleConnectedServiceClick(service.key)}
                  className="w-full px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {settings.language === 'th' ? 'เปิด' : settings.language === 'en' ? 'Open' : '打开'} {service.name}
                </button>
                <button 
                  onClick={() => disconnectService(service.key)}
                  className="w-full px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm flex items-center justify-center"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  {settings.language === 'th' ? 'ยกเลิกการเชื่อมต่อ' : settings.language === 'en' ? 'Disconnect' : '断开连接'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => connectService(service.key)}
                disabled={isConnecting[service.key as keyof typeof isConnecting]}
                className="w-full px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm flex items-center justify-center disabled:opacity-70"
              >
                {isConnecting[service.key as keyof typeof isConnecting] ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {settings.language === 'th' ? 'กำลังเชื่อมต่อ...' : 
                     settings.language === 'en' ? 'Connecting...' : 
                     '连接中...'}
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    {settings.language === 'th' ? 'เชื่อมต่อ' : settings.language === 'en' ? 'Connect' : '连接'}
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Student Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            {settings.language === 'th' ? 'การจัดการข้อมูลนักเรียน' : 
             settings.language === 'en' ? 'Student Data Management' : 
             '学生数据管理'}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={addNewStudent}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {settings.language === 'th' ? 'เพิ่มนักเรียนใหม่' : 
               settings.language === 'en' ? 'Add New Student' : 
               '添加新学生'}
            </button>
            {isConnected.classroom && (
              <button 
                onClick={syncStudentsFromClassroom}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {settings.language === 'th' ? 'ซิงค์จาก Classroom' : 
                 settings.language === 'en' ? 'Sync from Classroom' : 
                 '从 Classroom 同步'}
              </button>
            )}
            {isConnected.teams && (
              <button 
                onClick={syncStudentsFromTeams}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {settings.language === 'th' ? 'ซิงค์จาก Teams' : 
                 settings.language === 'en' ? 'Sync from Teams' : 
                 '从 Teams 同步'}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {settings.language === 'th' ? 'ชื่อนักเรียน' : 
                     settings.language === 'en' ? 'Student Name' : 
                     '学生姓名'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {settings.language === 'th' ? 'รหัสนักเรียน' : 
                     settings.language === 'en' ? 'Student ID' : 
                     '学号'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {settings.language === 'th' ? 'ชั้นเรียน' : 
                     settings.language === 'en' ? 'Class' : 
                     '班级'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {settings.language === 'th' ? 'เกรดเฉลี่ย' : 
                     settings.language === 'en' ? 'Avg Grade' : 
                     '平均成绩'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {settings.language === 'th' ? 'การดำเนินการ' : 
                     settings.language === 'en' ? 'Actions' : 
                     '操作'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {studentsData.length > 0 ? (
                  studentsData.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.studentId || student.student_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.grade} {student.class && `/ ${student.class}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (student.academicData?.overallGrade || 0) >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          (student.academicData?.overallGrade || 0) >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          (student.academicData?.overallGrade || 0) >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {student.academicData?.overallGrade || 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                          {settings.language === 'th' ? 'ดูโปรไฟล์' : 
                           settings.language === 'en' ? 'View Profile' : 
                           '查看档案'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      {settings.language === 'th' ? 'ไม่พบข้อมูลนักเรียน กรุณาเพิ่มนักเรียนในหน้าข้อมูลนักเรียน' :
                       settings.language === 'en' ? 'No student data found. Please add students in the Student Profiles page' :
                       '未找到学生数据。请在学生档案页面添加学生'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Connected Services Content */}
      {(isConnected.forms || isConnected.classroom) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Google Forms Dashboard */}
          {isConnected.forms && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Google Forms Dashboard
                </h3>
                <button 
                  onClick={() => window.open('https://docs.google.com/forms/create', '_blank')}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                >
                  {settings.language === 'th' ? 'สร้าง Form ใหม่' : 
                   settings.language === 'en' ? 'Create New Form' : 
                   '创建新表单'}
                </button>
              </div>

              <div className="space-y-4">
                {formData.map((form) => (
                  <div key={form.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{form.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'อัปเดตล่าสุด:' : 
                           settings.language === 'en' ? 'Last updated:' : 
                           '最后更新:'} {form.lastResponse}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        {form.status === 'active' ? 
                          (settings.language === 'th' ? 'เปิดใช้งาน' : 
                           settings.language === 'en' ? 'Active' : 
                           '活跃') : 
                          (settings.language === 'th' ? 'ปิดใช้งาน' : 
                           settings.language === 'en' ? 'Inactive' : 
                           '非活跃')
                        }
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{form.responses}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'คำตอบ' : 
                           settings.language === 'en' ? 'Responses' : 
                           '回复'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{form.avgScore}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'คะแนนเฉลี่ย' : 
                           settings.language === 'en' ? 'Average Score' : 
                           '平均分数'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">A</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'เกรดเฉลี่ย' : 
                           settings.language === 'en' ? 'Average Grade' : 
                           '平均等级'}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open('https://docs.google.com/forms/', '_blank')}
                        className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                      >
                        <BarChart3 className="h-4 w-4 inline mr-1" />
                        {settings.language === 'th' ? 'ดูสถิติ' : 
                         settings.language === 'en' ? 'View Statistics' : 
                         '查看统计'}
                      </button>
                      <button 
                        onClick={() => window.open('https://docs.google.com/spreadsheets/', '_blank')}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                      >
                        <Download className="h-4 w-4 inline mr-1" />
                        {settings.language === 'th' ? 'ส่งออกข้อมูล' : 
                         settings.language === 'en' ? 'Export Data' : 
                         '导出数据'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Classroom Dashboard */}
          {isConnected.classroom && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Google Classroom Dashboard
                </h3>
                <button 
                  onClick={() => window.open('https://classroom.google.com/', '_blank')}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  {settings.language === 'th' ? 'จัดการชั้นเรียน' : 
                   settings.language === 'en' ? 'Manage Classes' : 
                   '管理班级'}
                </button>
              </div>

              <div className="space-y-4">
                {classroomData.map((classroom) => (
                  <div key={classroom.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{classroom.className}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'ชั้นเรียนถัดไป:' : 
                           settings.language === 'en' ? 'Next class:' : 
                           '下一节课:'} {classroom.nextClass}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400 mr-1" />
                        <span className="text-sm text-orange-600 dark:text-orange-300">
                          {classroom.pendingGrades} {settings.language === 'th' ? 'รอตรวจ' : 
                                                   settings.language === 'en' ? 'pending' : 
                                                   '待批改'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{classroom.students}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'นักเรียน' : 
                           settings.language === 'en' ? 'Students' : 
                           '学生'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">{classroom.assignments}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'งานที่มอบหมาย' : 
                           settings.language === 'en' ? 'Assignments' : 
                           '作业'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{classroom.pendingGrades}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {settings.language === 'th' ? 'รอตรวจ' : 
                           settings.language === 'en' ? 'Pending' : 
                           '待批改'}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open('https://classroom.google.com/', '_blank')}
                        className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                      >
                        {settings.language === 'th' ? 'มอบหมายงาน' : 
                         settings.language === 'en' ? 'Assign Work' : 
                         '分配作业'}
                      </button>
                      <button 
                        onClick={() => window.open('https://classroom.google.com/', '_blank')}
                        className="flex-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                      >
                        {settings.language === 'th' ? 'ตรวจงาน' : 
                         settings.language === 'en' ? 'Grade Work' : 
                         '批改作业'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection Instructions */}
      {!isConnected.forms && !isConnected.classroom && !isConnected.drive && !isConnected.calendar && !isConnected.teams && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center mb-8">
          <ExternalLink className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {settings.language === 'th' ? 'เชื่อมต่อบริการภายนอก' : 
             settings.language === 'en' ? 'Connect External Services' : 
             '连接外部服务'}
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            {settings.language === 'th' ? 'เชื่อมต่อบัญชีของคุณเพื่อใช้งานฟีเจอร์ต่างๆ เช่น Google Classroom, Forms, Drive, Calendar และ Microsoft Teams' : 
             settings.language === 'en' ? 'Connect your accounts to use features like Google Classroom, Forms, Drive, Calendar, and Microsoft Teams' : 
             '连接您的账户以使用 Google Classroom、Forms、Drive、Calendar 和 Microsoft Teams 等功能'}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {settings.language === 'th' ? 'คลิกปุ่ม "เชื่อมต่อ" ในบริการที่ต้องการใช้งาน ระบบจะจำลองการเชื่อมต่อเพื่อการทดสอบ' : 
             settings.language === 'en' ? 'Click the "Connect" button for the service you want to use. The system will simulate the connection for testing' : 
             '点击您想要使用的服务的"连接"按钮。系统将模拟连接以进行测试'}
          </p>
        </div>
      )}

      {/* Automation Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          {settings.language === 'th' ? 'การตั้งค่าอัตโนมัติ' : 
           settings.language === 'en' ? 'Automation Settings' : 
           '自动化设置'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              {settings.language === 'th' ? 'การส่งงานอัตโนมัติ' : 
               settings.language === 'en' ? 'Automatic Assignments' : 
               '自动作业'}
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'ส่งงานทุกวันจันทร์ 08:00' : 
                   settings.language === 'en' ? 'Send assignments every Monday at 08:00' : 
                   '每周一 08:00 发送作业'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'แจ้งเตือนก่อนครบกำหนด 1 วัน' : 
                   settings.language === 'en' ? 'Notify 1 day before deadline' : 
                   '截止日期前1天通知'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'ส่งสรุปผลงานรายสัปดาห์' : 
                   settings.language === 'en' ? 'Send weekly work summary' : 
                   '发送每周工作摘要'}
                </span>
              </label>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              {settings.language === 'th' ? 'การแจกเอกสาร' : 
               settings.language === 'en' ? 'Document Distribution' : 
               '文档分发'}
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'แจกใบงานก่อนเรียน 30 นาที' : 
                   settings.language === 'en' ? 'Distribute worksheets 30 minutes before class' : 
                   '课前30分钟分发工作表'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'ส่งสื่อประกอบหลังเรียน' : 
                   settings.language === 'en' ? 'Send supplementary materials after class' : 
                   '课后发送补充材料'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'อัปโหลดบันทึกการเรียนอัตโนมัติ' : 
                   settings.language === 'en' ? 'Automatically upload class notes' : 
                   '自动上传课堂笔记'}
                </span>
              </label>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              {settings.language === 'th' ? 'การประเมินผล' : 
               settings.language === 'en' ? 'Assessment' : 
               '评估'}
            </h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'สร้างรายงานความก้าวหน้า' : 
                   settings.language === 'en' ? 'Generate progress reports' : 
                   '生成进度报告'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'ส่งผลการประเมินให้ผู้ปกครอง' : 
                   settings.language === 'en' ? 'Send assessment results to parents' : 
                   '向家长发送评估结果'}
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 dark:bg-gray-700" defaultChecked />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {settings.language === 'th' ? 'วิเคราะห์แนวโน้มการเรียนรู้' : 
                   settings.language === 'en' ? 'Analyze learning trends' : 
                   '分析学习趋势'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleIntegrations;