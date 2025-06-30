import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Image, 
  FileText, 
  ExternalLink, 
  Search, 
  Filter,
  Star,
  Download,
  Heart,
  Eye,
  Play,
  Bookmark,
  Share2,
  Globe,
  Youtube,
  Camera,
  Headphones
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Resource {
  id: string;
  title: {
    th: string;
    en: string;
    zh: string;
  };
  description: {
    th: string;
    en: string;
    zh: string;
  };
  type: 'video' | 'image' | 'document' | 'interactive' | 'audio';
  source: string;
  subject: string;
  grade: string[];
  rating: number;
  views: number;
  likes: number;
  thumbnail: string;
  url: string;
  duration?: string;
  tags: {
    th: string[];
    en: string[];
    zh: string[];
  };
}

const TeachingResources: React.FC = () => {
  const { t, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedSubject, setSelectedSubject] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [selectedSource, setSelectedSource] = useState(settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部');
  const [favorites, setFavorites] = useState<string[]>([]);

  const resourceTypes = [
    { 
      value: settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部', 
      label: settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部', 
      icon: BookOpen 
    },
    { 
      value: 'video', 
      label: settings.language === 'th' ? 'วิดีโอ' : settings.language === 'en' ? 'Video' : '视频', 
      icon: Video 
    },
    { 
      value: 'image', 
      label: settings.language === 'th' ? 'รูปภาพ' : settings.language === 'en' ? 'Image' : '图片', 
      icon: Image 
    },
    { 
      value: 'document', 
      label: settings.language === 'th' ? 'เอกสาร' : settings.language === 'en' ? 'Document' : '文档', 
      icon: FileText 
    },
    { 
      value: 'interactive', 
      label: settings.language === 'th' ? 'สื่อโต้ตอบ' : settings.language === 'en' ? 'Interactive' : '互动媒体', 
      icon: Play 
    },
    { 
      value: 'audio', 
      label: settings.language === 'th' ? 'เสียง' : settings.language === 'en' ? 'Audio' : '音频', 
      icon: Headphones 
    }
  ];

  const subjects = [
    settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部',
    settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
    settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
    settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
    settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究',
    settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语',
    settings.language === 'th' ? 'ศิลปะ' : settings.language === 'en' ? 'Art' : '艺术'
  ];
  
  const sources = [
    { 
      name: settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部', 
      url: '#',
      description: {
        th: 'แหล่งสื่อทั้งหมด',
        en: 'All resource sources',
        zh: '所有资源来源'
      }
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/results?search_query=educational+videos',
      description: {
        th: 'วิดีโอการศึกษาและบทเรียนออนไลน์',
        en: 'Educational videos and online lessons',
        zh: '教育视频和在线课程'
      }
    },
    { 
      name: 'Khan Academy', 
      url: 'https://www.khanacademy.org/',
      description: {
        th: 'บทเรียนออนไลน์ฟรีในหลากหลายวิชา',
        en: 'Free online lessons in various subjects',
        zh: '各种科目的免费在线课程'
      }
    },
    { 
      name: 'TED-Ed', 
      url: 'https://ed.ted.com/',
      description: {
        th: 'วิดีโอการศึกษาที่น่าสนใจและสร้างแรงบันดาลใจ',
        en: 'Interesting and inspiring educational videos',
        zh: '有趣且鼓舞人心的教育视频'
      }
    },
    { 
      name: 'National Geographic', 
      url: 'https://www.nationalgeographic.com/education/',
      description: {
        th: 'สื่อการเรียนรู้เกี่ยวกับธรรมชาติ วิทยาศาสตร์ และวัฒนธรรม',
        en: 'Learning resources about nature, science, and culture',
        zh: '关于自然、科学和文化的学习资源'
      }
    },
    { 
      name: 'BBC Learning', 
      url: 'https://www.bbc.co.uk/bitesize',
      description: {
        th: 'สื่อการเรียนรู้ภาษาอังกฤษและวิชาอื่นๆ',
        en: 'English language and other subject learning resources',
        zh: '英语和其他学科的学习资源'
      }
    },
    { 
      name: 'Coursera', 
      url: 'https://www.coursera.org/',
      description: {
        th: 'คอร์สเรียนออนไลน์จากมหาวิทยาลัยชั้นนำ',
        en: 'Online courses from leading universities',
        zh: '来自顶尖大学的在线课程'
      }
    },
    { 
      name: 'edX', 
      url: 'https://www.edx.org/',
      description: {
        th: 'หลักสูตรออนไลน์จากสถาบันชั้นนำทั่วโลก',
        en: 'Online courses from leading institutions worldwide',
        zh: '来自全球领先机构的在线课程'
      }
    }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: {
        th: 'การอ่านจับใจความสำคัญ - เทคนิคการอ่านอย่างมีประสิทธิภาพ',
        en: 'Reading Comprehension - Effective Reading Techniques',
        zh: '阅读理解 - 有效阅读技巧'
      },
      description: {
        th: 'วิดีโอสอนเทคนิคการอ่านจับใจความสำคัญ พร้อมตัวอย่างและแบบฝึกหัด',
        en: 'Video teaching reading comprehension techniques with examples and exercises',
        zh: '教授阅读理解技巧的视频，附有示例和练习'
      },
      type: 'video',
      source: 'YouTube',
      subject: settings.language === 'th' ? 'ภาษาไทย' : settings.language === 'en' ? 'Thai Language' : '泰语',
      grade: settings.language === 'th' ? ['ม.1', 'ม.2', 'ม.3'] : 
             settings.language === 'en' ? ['Grade 7', 'Grade 8', 'Grade 9'] : 
             ['7年级', '8年级', '9年级'],
      rating: 4.8,
      views: 15420,
      likes: 892,
      thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      url: 'https://www.youtube.com/results?search_query=การอ่านจับใจความ',
      duration: '12:34',
      tags: {
        th: ['การอ่าน', 'จับใจความ', 'ทักษะการเรียน'],
        en: ['Reading', 'Comprehension', 'Learning Skills'],
        zh: ['阅读', '理解', '学习技能']
      }
    },
    {
      id: '2',
      title: {
        th: 'สมการเชิงเส้นตัวแปรเดียว - แนวคิดพื้นฐานและการแก้ปัญหา',
        en: 'Linear Equations with One Variable - Basic Concepts and Problem Solving',
        zh: '一元线性方程 - 基本概念和解题方法'
      },
      description: {
        th: 'บทเรียนออนไลน์เรื่องสมการเชิงเส้น พร้อมตัวอย่างและแบบฝึกหัดแบบโต้ตอบ',
        en: 'Online lesson about linear equations with examples and interactive exercises',
        zh: '关于线性方程的在线课程，包含示例和互动练习'
      },
      type: 'interactive',
      source: 'Khan Academy',
      subject: settings.language === 'th' ? 'คณิตศาสตร์' : settings.language === 'en' ? 'Mathematics' : '数学',
      grade: settings.language === 'th' ? ['ม.1', 'ม.2'] : 
             settings.language === 'en' ? ['Grade 7', 'Grade 8'] : 
             ['7年级', '8年级'],
      rating: 4.9,
      views: 23150,
      likes: 1205,
      thumbnail: 'https://images.pexels.com/photos/6256/mathematics-computation-math-blackboard.jpg',
      url: 'https://www.khanacademy.org/math/algebra',
      duration: '25:00',
      tags: {
        th: ['สมการ', 'พีชคณิต', 'คณิตศาสตร์'],
        en: ['Equations', 'Algebra', 'Mathematics'],
        zh: ['方程', '代数', '数学']
      }
    },
    {
      id: '3',
      title: {
        th: 'ระบบสุริยะและดาวเคราะห์ - การสำรวจอวกาศ',
        en: 'Solar System and Planets - Space Exploration',
        zh: '太阳系和行星 - 太空探索'
      },
      description: {
        th: 'วิดีโอสารคดีเกี่ยวกับระบบสุริยะ ดาวเคราะห์ และการสำรวจอวกาศ',
        en: 'Documentary video about the solar system, planets, and space exploration',
        zh: '关于太阳系、行星和太空探索的纪录片视频'
      },
      type: 'video',
      source: 'National Geographic',
      subject: settings.language === 'th' ? 'วิทยาศาสตร์' : settings.language === 'en' ? 'Science' : '科学',
      grade: settings.language === 'th' ? ['ป.5', 'ป.6', 'ม.1'] : 
             settings.language === 'en' ? ['Grade 5', 'Grade 6', 'Grade 7'] : 
             ['5年级', '6年级', '7年级'],
      rating: 4.7,
      views: 45230,
      likes: 2156,
      thumbnail: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg',
      url: 'https://www.nationalgeographic.com/science/space/',
      duration: '18:45',
      tags: {
        th: ['ดาราศาสตร์', 'ระบบสุริยะ', 'อวกาศ'],
        en: ['Astronomy', 'Solar System', 'Space'],
        zh: ['天文学', '太阳系', '太空']
      }
    },
    {
      id: '4',
      title: {
        th: 'ประวัติศาสตร์ไทย - สมัยสุโขทัย',
        en: 'Thai History - Sukhothai Period',
        zh: '泰国历史 - 素可泰时期'
      },
      description: {
        th: 'เอกสารประกอบการสอนเรื่องประวัติศาสตร์ไทยสมัยสุโขทัย พร้อมแผนที่และภาพประกอบ',
        en: 'Teaching materials about Thai history during the Sukhothai period with maps and illustrations',
        zh: '关于素可泰时期泰国历史的教学材料，配有地图和插图'
      },
      type: 'document',
      source: 'TED-Ed',
      subject: settings.language === 'th' ? 'สังคมศึกษา' : settings.language === 'en' ? 'Social Studies' : '社会研究',
      grade: settings.language === 'th' ? ['ป.4', 'ป.5', 'ป.6'] : 
             settings.language === 'en' ? ['Grade 4', 'Grade 5', 'Grade 6'] : 
             ['4年级', '5年级', '6年级'],
      rating: 4.6,
      views: 12890,
      likes: 567,
      thumbnail: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      url: 'https://ed.ted.com/lessons?category=history',
      tags: {
        th: ['ประวัติศาสตร์', 'สุโขทัย', 'ไทย'],
        en: ['History', 'Sukhothai', 'Thailand'],
        zh: ['历史', '素可泰', '泰国']
      }
    },
    {
      id: '5',
      title: {
        th: 'ไวยากรณ์ภาษาอังกฤษ: Present Perfect Tense',
        en: 'English Grammar: Present Perfect Tense',
        zh: '英语语法：现在完成时'
      },
      description: {
        th: 'บทเรียนไวยากรณ์ภาษาอังกฤษเรื่อง Present Perfect Tense พร้อมตัวอย่างและแบบฝึกหัด',
        en: 'English grammar lesson on Present Perfect Tense with examples and exercises',
        zh: '关于现在完成时的英语语法课程，包含示例和练习'
      },
      type: 'video',
      source: 'BBC Learning',
      subject: settings.language === 'th' ? 'ภาษาอังกฤษ' : settings.language === 'en' ? 'English' : '英语',
      grade: settings.language === 'th' ? ['ม.1', 'ม.2', 'ม.3'] : 
             settings.language === 'en' ? ['Grade 7', 'Grade 8', 'Grade 9'] : 
             ['7年级', '8年级', '9年级'],
      rating: 4.5,
      views: 18750,
      likes: 934,
      thumbnail: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg',
      url: 'https://www.bbc.co.uk/bitesize/topics/zwwp8mn',
      duration: '15:20',
      tags: {
        th: ['ไวยากรณ์', 'Present Perfect', 'ภาษาอังกฤษ'],
        en: ['Grammar', 'Present Perfect', 'English'],
        zh: ['语法', '现在完成时', '英语']
      }
    },
    {
      id: '6',
      title: {
        th: 'ศิลปะการวาดภาพ - เทคนิคการใช้สี',
        en: 'Art of Drawing - Color Techniques',
        zh: '绘画艺术 - 用色技巧'
      },
      description: {
        th: 'วิดีโอสอนเทคนิคการใช้สีในการวาดภาพ พร้อมการสาธิตขั้นตอนการวาด',
        en: 'Video teaching color techniques in drawing with step-by-step demonstrations',
        zh: '教授绘画中用色技巧的视频，附有逐步演示'
      },
      type: 'video',
      source: 'YouTube',
      subject: settings.language === 'th' ? 'ศิลปะ' : settings.language === 'en' ? 'Art' : '艺术',
      grade: settings.language === 'th' ? ['ป.1', 'ป.2', 'ป.3', 'ป.4'] : 
             settings.language === 'en' ? ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'] : 
             ['1年级', '2年级', '3年级', '4年级'],
      rating: 4.4,
      views: 9876,
      likes: 445,
      thumbnail: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
      url: 'https://www.youtube.com/results?search_query=art+painting+techniques',
      duration: '22:15',
      tags: {
        th: ['ศิลปะ', 'การวาด', 'สี'],
        en: ['Art', 'Drawing', 'Colors'],
        zh: ['艺术', '绘画', '颜色']
      }
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title[settings.language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description[settings.language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags[settings.language].some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const allType = settings.language === 'th' ? 'ทั้งหมด' : settings.language === 'en' ? 'All' : '全部';
    const matchesType = selectedType === allType || resource.type === selectedType;
    
    const matchesSubject = selectedSubject === allType || resource.subject === selectedSubject;
    
    const matchesSource = selectedSource === allType || resource.source === selectedSource;
    
    return matchesSearch && matchesType && matchesSubject && matchesSource;
  });

  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return Image;
      case 'document': return FileText;
      case 'interactive': return Play;
      case 'audio': return Headphones;
      default: return BookOpen;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'YouTube': return Youtube;
      case 'National Geographic': return Globe;
      case 'BBC Learning': return Globe;
      default: return ExternalLink;
    }
  };

  const handleSourceClick = (sourceName: string) => {
    const source = sources.find(s => s.name === sourceName);
    if (source && source.url !== '#') {
      window.open(source.url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
          {t('pages.teachingResources.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{t('pages.teachingResources.description')}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={settings.language === 'th' ? 'ค้นหาสื่อการสอน...' : 
                          settings.language === 'en' ? 'Search teaching resources...' : 
                          '搜索教学资源...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {resourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            {sources.map(source => (
              <option key={source.name} value={source.name}>{source.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          const SourceIcon = getSourceIcon(resource.source);
          
          return (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative">
                <img 
                  src={resource.thumbnail} 
                  alt={resource.title[settings.language]}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-2">
                  <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded text-xs flex items-center">
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {resourceTypes.find(t => t.value === resource.type)?.label}
                  </span>
                  {resource.duration && (
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white rounded text-xs">
                      {resource.duration}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(resource.id)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(resource.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs">
                    {resource.subject}
                  </span>
                  <div className="flex items-center">
                    <SourceIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{resource.source}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{resource.title[settings.language]}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{resource.description[settings.language]}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags[settings.language].slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{resource.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{resource.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Grade levels */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {resource.grade.map((grade, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open(resource.url, '_blank')}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4 inline mr-1" />
                    {settings.language === 'th' ? 'เปิดดู' : 
                     settings.language === 'en' ? 'Open' : 
                     '打开'}
                  </button>
                  <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popular Sources */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {settings.language === 'th' ? 'แหล่งสื่อยอดนิยม' : 
           settings.language === 'en' ? 'Popular Resources' : 
           '热门资源'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {sources.slice(1).map((source, index) => (
            <div 
              key={index} 
              onClick={() => handleSourceClick(source.name)}
              className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{source.description[settings.language]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachingResources;