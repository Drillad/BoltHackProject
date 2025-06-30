import React, { useState } from 'react';
import { User, Edit, Save, X, Plus, Trash2, Camera, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ProfilePage: React.FC = () => {
  const { user, updateUser, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(user || {});
    setIsEditing(false);
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...(prev.education || []), '']
    }));
  };

  const updateEducation = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeEducation = (index: number) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || []
    }));
  };

  const addCertification = () => {
    setEditData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), '']
    }));
  };

  const updateCertification = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      certifications: prev.certifications?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeCertification = (index: number) => {
    setEditData(prev => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || []
    }));
  };

  const addSubject = () => {
    setEditData(prev => ({
      ...prev,
      subjects: [...(prev.subjects || []), '']
    }));
  };

  const updateSubject = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      subjects: prev.subjects?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeSubject = (index: number) => {
    setEditData(prev => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index) || []
    }));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('profile.edit')}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('common.save')}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.name')}
                    </label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.school')}
                    </label>
                    <input
                      type="text"
                      value={editData.school || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{user.email}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{user.school}</p>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {user.role === 'teacher' ? 'ครู' : 'ผู้ดูแลระบบ'}
                    </span>
                    {user.experience && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                        {user.experience} ปี
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.bio')}</h3>
            {isEditing ? (
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="เขียนเกี่ยวกับตัวคุณ..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{user.bio || 'ยังไม่ได้เพิ่มข้อมูล'}</p>
            )}
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.experience')}</h3>
            {isEditing ? (
              <input
                type="number"
                value={editData.experience || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="จำนวนปีที่สอน"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{user.experience || 0} ปี</p>
            )}
          </div>

          {/* Subjects */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.subjects')}</h3>
            {isEditing ? (
              <div className="space-y-2">
                {editData.subjects?.map((subject, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => updateSubject(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="วิชาที่สอน"
                    />
                    <button
                      onClick={() => removeSubject(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSubject}
                  className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่มวิชา
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.subjects?.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                    {subject}
                  </span>
                )) || <p className="text-gray-600 dark:text-gray-400">ยังไม่ได้เพิ่มข้อมูล</p>}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.education')}</h3>
            {isEditing ? (
              <div className="space-y-2">
                {editData.education?.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => updateEducation(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="การศึกษา"
                    />
                    <button
                      onClick={() => removeEducation(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่มการศึกษา
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {user.education?.map((edu, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">• {edu}</li>
                )) || <p className="text-gray-600 dark:text-gray-400">ยังไม่ได้เพิ่มข้อมูล</p>}
              </ul>
            )}
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('profile.certifications')}</h3>
            {isEditing ? (
              <div className="space-y-2">
                {editData.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="ใบรับรอง"
                    />
                    <button
                      onClick={() => removeCertification(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCertification}
                  className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  เพิ่มใบรับรอง
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {user.certifications?.map((cert, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">• {cert}</li>
                )) || <p className="text-gray-600 dark:text-gray-400">ยังไม่ได้เพิ่มข้อมูล</p>}
              </ul>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Social Links</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <input
                    type="url"
                    value={editData.socialLinks?.linkedin || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <input
                    type="url"
                    value={editData.socialLinks?.twitter || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Twitter URL"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <input
                    type="url"
                    value={editData.socialLinks?.facebook || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Facebook URL"
                  />
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                {user.socialLinks?.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
                {user.socialLinks?.twitter && (
                  <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {user.socialLinks?.facebook && (
                  <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {!user.socialLinks?.linkedin && !user.socialLinks?.twitter && !user.socialLinks?.facebook && (
                  <p className="text-gray-600 dark:text-gray-400">ยังไม่ได้เพิ่มข้อมูล</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;