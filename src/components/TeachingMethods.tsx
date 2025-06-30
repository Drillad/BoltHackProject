import React, { useState } from 'react';
import { Lightbulb, BookOpen, Users, Target, Clock, Star, Search, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface TeachingMethod {
  id: string;
  title: string;
  description: string;
  category: string;
  subjects: string[];
  grades: string[];
  duration: string;
  difficulty: string;
  rating: number;
  pros: string[];
  cons: string[];
  steps: string[];
  tips: string[];
}

const TeachingMethods: React.FC = () => {
  const { t, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedSubject, setSelectedSubject] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedMethod, setSelectedMethod] = useState<TeachingMethod | null>(null);

  const categories = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    t('teachingMethod.interactive'),
    t('teachingMethod.cooperative'),
    t('teachingMethod.inquiry'),
    t('teachingMethod.project'),
    settings.language === 'th' ? 'เทคโนโลยีการศึกษา' : settings.language === 'en' ? 'Educational Technology' : '教育技术'
  ];
  
  const subjects = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
    settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
    settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究',
    settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语'
  ];

  const teachingMethods: TeachingMethod[] = [
    {
      id: '1',
      title: settings.language === 'th' ? 'การสอนแบบอภิปราย (Discussion Method)' :
             settings.language === 'en' ? 'Discussion Method' :
             '讨论教学法',
      description: settings.language === 'th' ? 'วิธีการสอนที่ส่งเสริมให้นักเรียนแสดงความคิดเห็นและแลกเปลี่ยนมุมมองร่วมกัน' :
                   settings.language === 'en' ? 'A teaching method that encourages students to express opinions and exchange viewpoints' :
                   '鼓励学生表达意见和交流观点的教学方法',
      category: t('teachingMethod.interactive'),
      subjects: [
        settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
        settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究'
      ],
      grades: settings.language === 'th' ? ['ม.1', 'ม.2', 'ม.3'] :
              settings.language === 'en' ? ['Grade 7', 'Grade 8', 'Grade 9'] :
              ['7年级', '8年级', '9年级'],
      duration: settings.language === 'th' ? '30-45 นาที' :
                settings.language === 'en' ? '30-45 minutes' :
                '30-45分钟',
      difficulty: settings.language === 'th' ? 'ปานกลาง' :
                  settings.language === 'en' ? 'Medium' :
                  '中等',
      rating: 4.5,
      pros: settings.language === 'th' ? 
        ['ส่งเสริมการคิดวิเคราะห์', 'เพิ่มความมั่นใจในการแสดงความคิดเห็น', 'พัฒนาทักษะการสื่อสาร', 'เรียนรู้จากมุมมองที่หลากหลาย'] :
        settings.language === 'en' ?
        ['Promotes analytical thinking', 'Increases confidence in expressing opinions', 'Develops communication skills', 'Learning from diverse perspectives'] :
        ['促进分析性思考', '增加表达意见的信心', '发展沟通技能', '从多样化的视角学习'],
      cons: settings.language === 'th' ?
        ['ใช้เวลามาก', 'นักเรียนเงียบอาจไม่ได้รับโอกาส', 'ต้องการการควบคุมที่ดี', 'อาจเบี่ยงเบนจากหัวข้อหลัก'] :
        settings.language === 'en' ?
        ['Time-consuming', 'Quiet students may not get opportunities', 'Requires good control', 'May deviate from main topic'] :
        ['耗时', '安静的学生可能没有机会', '需要良好的控制', '可能偏离主题'],
      steps: settings.language === 'th' ?
        ['กำหนดหัวข้อและวัตถุประสงค์ที่ชัดเจน', 'เตรียมคำถามกระตุ้นและคำถามเสริม', 'แบ่งกลุ่มนักเรียนหรือทำเป็นวงกลม', 'เริ่มต้นด้วยคำถามเปิด', 'ให้นักเรียนแสดงความคิดเห็นอย่างเสรี', 'ครูเป็นผู้อำนวยการสนทนา', 'สรุปประเด็นสำคัญร่วมกัน'] :
        settings.language === 'en' ?
        ['Define clear topic and objectives', 'Prepare stimulating and follow-up questions', 'Divide students into groups or form a circle', 'Start with open-ended questions', 'Let students express opinions freely', 'Teacher facilitates the conversation', 'Summarize key points together'] :
        ['确定明确的主题和目标', '准备激发性和后续问题', '将学生分成小组或围成一圈', '以开放式问题开始', '让学生自由表达意见', '教师引导对话', '共同总结要点'],
      tips: settings.language === 'th' ?
        ['สร้างบรรยากาศที่ปลอดภัยและเปิดกว้าง', 'ใช้คำถามเปิดมากกว่าคำถามปิด', 'ให้เวลาคิดก่อนตอบ (Wait Time)', 'ชื่นชมความคิดเห็นที่หลากหลาย', 'จดบันทึกประเด็นสำคัญบนกระดาน'] :
        settings.language === 'en' ?
        ['Create a safe and open atmosphere', 'Use open-ended questions more than closed questions', 'Give thinking time before answering (Wait Time)', 'Appreciate diverse opinions', 'Note key points on the board'] :
        ['创造安全开放的氛围', '使用开放式问题多于封闭式问题', '在回答前给予思考时间（等待时间）', '欣赏多样化的意见', '在黑板上记录要点']
    },
    {
      id: '2',
      title: settings.language === 'th' ? 'การเรียนรู้แบบร่วมมือ (Cooperative Learning)' :
             settings.language === 'en' ? 'Cooperative Learning' :
             '合作学习',
      description: settings.language === 'th' ? 'วิธีการสอนที่เน้นให้นักเรียนทำงานร่วมกันเป็นทีมเพื่อบรรลุเป้าหมายการเรียนรู้' :
                   settings.language === 'en' ? 'A teaching method that emphasizes students working together as a team to achieve learning goals' :
                   '强调学生作为团队共同工作以实现学习目标的教学方法',
      category: t('teachingMethod.cooperative'),
      subjects: [
        settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
        settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
        settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语'
      ],
      grades: settings.language === 'th' ? ['ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2'] :
              settings.language === 'en' ? ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'] :
              ['4年级', '5年级', '6年级', '7年级', '8年级'],
      duration: settings.language === 'th' ? '40-60 นาที' :
                settings.language === 'en' ? '40-60 minutes' :
                '40-60分钟',
      difficulty: settings.language === 'th' ? 'ปานกลาง' :
                  settings.language === 'en' ? 'Medium' :
                  '中等',
      rating: 4.7,
      pros: settings.language === 'th' ? 
        ['พัฒนาทักษะการทำงานร่วมกัน', 'เรียนรู้จากเพื่อน', 'เพิ่มแรงจูงใจในการเรียน', 'ลดความเครียดในการเรียน'] :
        settings.language === 'en' ?
        ['Develops teamwork skills', 'Peer learning', 'Increases learning motivation', 'Reduces learning stress'] :
        ['发展团队合作技能', '同伴学习', '增加学习动机', '减轻学习压力'],
      cons: settings.language === 'th' ?
        ['นักเรียนบางคนอาจไม่ร่วมมือ', 'ความขัดแย้งในกลุ่ม', 'ใช้เวลาในการจัดกลุ่ม', 'ต้องควบคุมเสียงดัง'] :
        settings.language === 'en' ?
        ['Some students may not cooperate', 'Group conflicts', 'Time spent on group organization', 'Need to control noise'] :
        ['有些学生可能不合作', '小组冲突', '花时间组织小组', '需要控制噪音'],
      steps: settings.language === 'th' ?
        ['อธิบายวัตถุประสงค์และกฎกติกา', 'แบ่งกลุ่มอย่างเหมาะสม (3-5 คน)', 'มอบหมายบทบาทให้สมาชิกแต่ละคน', 'แจกใบงานและอุปกรณ์', 'ให้เวลาทำงานกลุ่ม', 'ครูเดินดูและให้คำแนะนำ', 'นำเสนอผลงานหน้าชั้น', 'สรุปและประเมินผล'] :
        settings.language === 'en' ?
        ['Explain objectives and rules', 'Divide into appropriate groups (3-5 people)', 'Assign roles to each member', 'Distribute worksheets and materials', 'Allow time for group work', 'Teacher monitors and provides guidance', 'Present work to the class', 'Summarize and evaluate'] :
        ['解释目标和规则', '分成适当的小组（3-5人）', '为每个成员分配角色', '分发工作表和材料', '留出小组工作时间', '教师监督并提供指导', '向全班展示工作', '总结和评估'],
      tips: settings.language === 'th' ?
        ['จัดกลุ่มให้หลากหลายทั้งความสามารถ', 'กำหนดบทบาทให้ชัดเจน', 'ให้รางวัลกลุ่มมากกว่าให้รางวัลบุคคล', 'สอนทักษะการทำงานร่วมกันก่อน', 'ใช้เทคนิค "คิด-จับคู่-แบ่งปัน"'] :
        settings.language === 'en' ?
        ['Form diverse groups in terms of abilities', 'Define clear roles', 'Reward groups rather than individuals', 'Teach collaboration skills first', 'Use the "Think-Pair-Share" technique'] :
        ['组建能力多样化的小组', '明确角色定义', '奖励小组而非个人', '先教授协作技能', '使用"思考-配对-分享"技术']
    },
    {
      id: '3',
      title: settings.language === 'th' ? 'การสอนแบบสืบเสาะหาความรู้ (Inquiry-Based Learning)' :
             settings.language === 'en' ? 'Inquiry-Based Learning' :
             '探究式学习',
      description: settings.language === 'th' ? 'วิธีการสอนที่ส่งเสริมให้นักเรียนค้นหาความรู้ด้วยตนเองผ่านการตั้งคำถามและการสำรวจ' :
                   settings.language === 'en' ? 'A teaching method that encourages students to discover knowledge themselves through questioning and exploration' :
                   '鼓励学生通过提问和探索自己发现知识的教学方法',
      category: t('teachingMethod.inquiry'),
      subjects: [
        settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
        settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究'
      ],
      grades: settings.language === 'th' ? ['ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3'] :
              settings.language === 'en' ? ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'] :
              ['5年级', '6年级', '7年级', '8年级', '9年级'],
      duration: settings.language === 'th' ? '50-90 นาที' :
                settings.language === 'en' ? '50-90 minutes' :
                '50-90分钟',
      difficulty: settings.language === 'th' ? 'ยาก' :
                  settings.language === 'en' ? 'Hard' :
                  '困难',
      rating: 4.3,
      pros: settings.language === 'th' ? 
        ['พัฒนาทักษะการคิดวิเคราะห์', 'เรียนรู้อย่างลึกซึ้ง', 'จดจำได้นาน', 'สร้างความอยากรู้อยากเห็น'] :
        settings.language === 'en' ?
        ['Develops analytical thinking skills', 'Deep learning', 'Long-term retention', 'Creates curiosity'] :
        ['发展分析思维技能', '深度学习', '长期记忆', '培养好奇心'],
      cons: settings.language === 'th' ?
        ['ใช้เวลามาก', 'ต้องการทรัพยากรมาก', 'นักเรียนอาจหลงทาง', 'ยากต่อการประเมินผล'] :
        settings.language === 'en' ?
        ['Time-consuming', 'Resource-intensive', 'Students may get lost', 'Difficult to assess'] :
        ['耗时', '资源密集', '学生可能迷失方向', '难以评估'],
      steps: settings.language === 'th' ?
        ['นำเสนอปรากฏการณ์หรือปัญหาที่น่าสนใจ', 'ให้นักเรียนตั้งคำถาม', 'วางแผนการสืบเสาะหาคำตอบ', 'รวบรวมข้อมูลและหลักฐาน', 'วิเคราะห์และตีความข้อมูล', 'สรุปและนำเสนอผลการสืบเสาะ', 'สะท้อนการเรียนรู้'] :
        settings.language === 'en' ?
        ['Present interesting phenomena or problems', 'Have students ask questions', 'Plan the inquiry process', 'Collect data and evidence', 'Analyze and interpret data', 'Conclude and present inquiry results', 'Reflect on learning'] :
        ['呈现有趣的现象或问题', '让学生提问', '规划探究过程', '收集数据和证据', '分析和解释数据', '总结并展示探究结果', '反思学习'],
      tips: settings.language === 'th' ?
        ['เริ่มจากสิ่งที่นักเรียนสนใจ', 'ให้คำแนะนำแต่อย่าให้คำตอบ', 'ส่งเสริมการตั้งคำถาม', 'เตรียมแหล่งข้อมูลที่หลากหลาย', 'สอนวิธีการค้นคว้าที่ถูกต้อง'] :
        settings.language === 'en' ?
        ['Start with student interests', 'Provide guidance but not answers', 'Encourage questioning', 'Prepare diverse information sources', 'Teach proper research methods'] :
        ['从学生兴趣开始', '提供指导但不给答案', '鼓励提问', '准备多样化的信息来源', '教授正确的研究方法']
    },
    {
      id: '4',
      title: settings.language === 'th' ? 'การสอนแบบโครงงาน (Project-Based Learning)' :
             settings.language === 'en' ? 'Project-Based Learning' :
             '项目式学习',
      description: settings.language === 'th' ? 'วิธีการสอนที่ให้นักเรียนทำโครงงานจริงเพื่อแก้ปัญหาหรือตอบคำถามที่มีความหมาย' :
                   settings.language === 'en' ? 'A teaching method where students work on real projects to solve problems or answer meaningful questions' :
                   '学生通过实际项目解决问题或回答有意义问题的教学方法',
      category: t('teachingMethod.project'),
      subjects: [settings.language === 'th' ? 'ทุกวิชา' : settings.language === 'en' ? 'All subjects' : '所有科目'],
      grades: settings.language === 'th' ? ['ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3'] :
              settings.language === 'en' ? ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'] :
              ['4年级', '5年级', '6年级', '7年级', '8年级', '9年级'],
      duration: settings.language === 'th' ? '2-4 สัปดาห์' :
                settings.language === 'en' ? '2-4 weeks' :
                '2-4周',
      difficulty: settings.language === 'th' ? 'ยาก' :
                  settings.language === 'en' ? 'Hard' :
                  '困难',
      rating: 4.6,
      pros: settings.language === 'th' ? 
        ['เชื่อมโยงการเรียนกับชีวิตจริง', 'พัฒนาทักษะศตวรรษที่ 21', 'เรียนรู้แบบบูรณาการ', 'เพิ่มแรงจูงใจอย่างมาก'] :
        settings.language === 'en' ?
        ['Connects learning to real life', 'Develops 21st century skills', 'Integrated learning', 'Greatly increases motivation'] :
        ['将学习与现实生活联系起来', '发展21世纪技能', '综合学习', '大大增加动机'],
      cons: settings.language === 'th' ?
        ['ใช้เวลาและทรัพยากรมาก', 'ยากต่อการจัดการ', 'การประเมินผลซับซ้อน', 'ต้องการการวางแผนที่ดี'] :
        settings.language === 'en' ?
        ['Time and resource intensive', 'Difficult to manage', 'Complex assessment', 'Requires good planning'] :
        ['时间和资源密集', '难以管理', '评估复杂', '需要良好的规划'],
      steps: settings.language === 'th' ?
        ['กำหนดคำถามหลักหรือปัญหาที่ต้องแก้', 'วางแผนโครงงานร่วมกัน', 'แบ่งหน้าที่ความรับผิดชอบ', 'ค้นคว้าและรวบรวมข้อมูล', 'ดำเนินการตามแผน', 'ปรับปรุงและพัฒนาผลงาน', 'นำเสนอผลงานต่อผู้ฟัง', 'ประเมินผลและสะท้อนการเรียนรู้'] :
        settings.language === 'en' ?
        ['Define main question or problem to solve', 'Plan project together', 'Divide responsibilities', 'Research and gather information', 'Execute according to plan', 'Improve and develop work', 'Present work to audience', 'Evaluate and reflect on learning'] :
        ['确定要解决的主要问题', '共同规划项目', '分配责任', '研究和收集信息', '按计划执行', '改进和发展工作', '向观众展示工作', '评估和反思学习'],
      tips: settings.language === 'th' ?
        ['เลือกหัวข้อที่เชื่อมโยงกับชีวิตจริง', 'กำหนดเป้าหมายที่ชัดเจนและวัดได้', 'ให้คำแนะนำอย่างต่อเนื่อง', 'ใช้ Rubric ในการประเมิน', 'เชิญผู้เชี่ยวชาญมาให้คำปรึกษา'] :
        settings.language === 'en' ?
        ['Choose topics connected to real life', 'Set clear and measurable goals', 'Provide continuous guidance', 'Use rubrics for assessment', 'Invite experts for consultation'] :
        ['选择与现实生活相关的主题', '设定明确可衡量的目标', '提供持续指导', '使用评分标准进行评估', '邀请专家咨询']
    },
    {
      id: '5',
      title: settings.language === 'th' ? 'การสอนผ่านเกม (Game-Based Learning)' :
             settings.language === 'en' ? 'Game-Based Learning' :
             '游戏化学习',
      description: settings.language === 'th' ? 'วิธีการสอนที่ใช้เกมเป็นเครื่องมือในการถ่ายทอดความรู้และทักษะ' :
                   settings.language === 'en' ? 'A teaching method that uses games as tools to convey knowledge and skills' :
                   '使用游戏作为传授知识和技能的工具的教学方法',
      category: settings.language === 'th' ? 'เทคโนโลยีการศึกษา' : settings.language === 'en' ? 'Educational Technology' : '教育技术',
      subjects: [
        settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
        settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语',
        settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学'
      ],
      grades: settings.language === 'th' ? ['ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'] :
              settings.language === 'en' ? ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'] :
              ['1年级', '2年级', '3年级', '4年级', '5年级', '6年级'],
      duration: settings.language === 'th' ? '20-40 นาที' :
                settings.language === 'en' ? '20-40 minutes' :
                '20-40分钟',
      difficulty: settings.language === 'th' ? 'ง่าย' :
                  settings.language === 'en' ? 'Easy' :
                  '简单',
      rating: 4.8,
      pros: settings.language === 'th' ? 
        ['สร้างความสนุกสนาน', 'เพิ่มแรงจูงใจสูง', 'จดจำได้ดี', 'ลดความเครียด'] :
        settings.language === 'en' ?
        ['Creates fun', 'High motivation', 'Good retention', 'Reduces stress'] :
        ['创造乐趣', '高度动机', '良好记忆', '减轻压力'],
      cons: settings.language === 'th' ?
        ['อาจเน้นความสนุกมากกว่าการเรียน', 'ใช้เวลาเตรียม', 'ต้องควบคุมวินัย', 'ต้องมีอุปกรณ์'] :
        settings.language === 'en' ?
        ['May emphasize fun over learning', 'Preparation time', 'Discipline control needed', 'Equipment required'] :
        ['可能强调乐趣而非学习', '准备时间', '需要纪律控制', '需要设备'],
      steps: settings.language === 'th' ?
        ['เลือกเกมที่เหมาะกับเนื้อหา', 'อธิบายกฎกติกาให้ชัดเจน', 'แบ่งทีมหรือให้เล่นเดี่ยว', 'เริ่มเล่นเกม', 'ครูคอยดูและให้คำแนะนำ', 'สรุปบทเรียนจากเกม', 'ประเมินการเรียนรู้'] :
        settings.language === 'en' ?
        ['Choose games suitable for content', 'Explain rules clearly', 'Divide into teams or individual play', 'Start the game', 'Teacher observes and provides guidance', 'Summarize lessons from the game', 'Assess learning'] :
        ['选择适合内容的游戏', '清楚解释规则', '分成团队或个人游戏', '开始游戏', '教师观察并提供指导', '总结游戏中的教训', '评估学习'],
      tips: settings.language === 'th' ?
        ['เลือกเกมที่เหมาะกับอายุ', 'ผสมผสานการแข่งขันและความร่วมมือ', 'ให้รางวัลที่เหมาะสม', 'เชื่อมโยงเกมกับเนื้อหา', 'เตรียมเกมสำรองไว้'] :
        settings.language === 'en' ?
        ['Choose age-appropriate games', 'Mix competition and cooperation', 'Provide appropriate rewards', 'Connect games to content', 'Prepare backup games'] :
        ['选择适合年龄的游戏', '混合竞争和合作', '提供适当的奖励', '将游戏与内容联系起来', '准备备用游戏']
    }
  ];

  const filteredMethods = teachingMethods.filter(method => {
    const matchesSearch = method.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') || method.category === selectedCategory;
    const matchesSubject = selectedSubject === (settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部') || method.subjects.includes(selectedSubject);
    
    return matchesSearch && matchesCategory && matchesSubject;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case settings.language === 'th' ? 'ง่าย' : settings.language === 'en' ? 'Easy' : '简单': 
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case settings.language === 'th' ? 'ปานกลาง' : settings.language === 'en' ? 'Medium' : '中等': 
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case settings.language === 'th' ? 'ยาก' : settings.language === 'en' ? 'Hard' : '困难': 
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: 
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Lightbulb className="h-8 w-8 mr-3 text-yellow-600 dark:text-yellow-400" />
          {t('pages.teachingMethods.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.teachingMethods.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters and Methods List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={settings.language === 'th' ? 'ค้นหาวิธีการสอน...' : 
                              settings.language === 'en' ? 'Search teaching methods...' : 
                              '搜索教学方法...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{method.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                    {method.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(method.difficulty)}`}>
                    {method.difficulty}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">{method.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {method.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {method.subjects.length > 1 ? 
                      (settings.language === 'th' ? 'หลายวิชา' : 
                       settings.language === 'en' ? 'Multiple subjects' : 
                       '多个科目') : 
                      method.subjects[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Method Details */}
        <div className="lg:col-span-1">
          {selectedMethod ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedMethod.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedMethod.description}</p>

              <div className="space-y-4">
                {/* Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'ระยะเวลา:' : 
                       settings.language === 'en' ? 'Duration:' : 
                       '持续时间:'}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMethod.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'ความยาก:' : 
                       settings.language === 'en' ? 'Difficulty:' : 
                       '难度:'}
                    </span>
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${getDifficultyColor(selectedMethod.difficulty)}`}>
                      {selectedMethod.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'วิชา:' : 
                       settings.language === 'en' ? 'Subjects:' : 
                       '科目:'}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMethod.subjects.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {settings.language === 'th' ? 'ระดับชั้น:' : 
                       settings.language === 'en' ? 'Grades:' : 
                       '年级:'}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMethod.grades.join(', ')}</p>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">✅ {settings.language === 'th' ? 'ข้อดี' : 
                                                                       settings.language === 'en' ? 'Pros' : 
                                                                       '优点'}</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedMethod.pros.map((pro, index) => (
                        <li key={index}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">⚠️ {settings.language === 'th' ? 'ข้อควรระวัง' : 
                                                                     settings.language === 'en' ? 'Cautions' : 
                                                                     '注意事项'}</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedMethod.cons.map((con, index) => (
                        <li key={index}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">📋 {settings.language === 'th' ? 'ขั้นตอนการดำเนินการ' : 
                                                                   settings.language === 'en' ? 'Implementation Steps' : 
                                                                   '实施步骤'}</h4>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedMethod.steps.map((step, index) => (
                      <li key={index}>{index + 1}. {step}</li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">💡 {settings.language === 'th' ? 'เคล็ดลับ' : 
                                                                   settings.language === 'en' ? 'Tips' : 
                                                                   '技巧'}</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {selectedMethod.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {settings.language === 'th' ? 'เลือกวิธีการสอน' : 
                 settings.language === 'en' ? 'Select a Teaching Method' : 
                 '选择教学方法'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'กรุณาเลือกวิธีการสอนเพื่อดูรายละเอียด' : 
                 settings.language === 'en' ? 'Please select a teaching method to view details' : 
                 '请选择教学方法以查看详情'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Methods */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {settings.language === 'th' ? 'วิธีการสอนแนะนำ' : 
           settings.language === 'en' ? 'Recommended Teaching Methods' : 
           '推荐教学方法'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachingMethods.filter(m => m.rating >= 4.5).slice(0, 3).map((method) => (
            <div key={method.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center mb-3">
                <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
                <span className="font-bold text-yellow-700 dark:text-yellow-300">{method.rating}</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{method.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{method.description.substring(0, 100)}...</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(method.difficulty)}`}>
                  {method.difficulty}
                </span>
                <button
                  onClick={() => setSelectedMethod(method)}
                  className="text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium"
                >
                  {settings.language === 'th' ? 'ดูรายละเอียด →' : 
                   settings.language === 'en' ? 'View details →' : 
                   '查看详情 →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachingMethods;