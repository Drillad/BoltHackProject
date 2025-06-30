import React from 'react';
import { Settings, Globe, Palette, Type, User, Moon, Sun, Monitor } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, t } = useApp();

  const languages = [
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  const fontSizes = [
    { value: 'small', label: 'เล็ก / Small / 小' },
    { value: 'medium', label: 'ปานกลาง / Medium / 中' },
    { value: 'large', label: 'ใหญ่ / Large / 大' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            {t('settings.title')}
          </h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Language Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              {t('settings.language')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => updateSettings({ language: lang.code as any })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    settings.language === lang.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{lang.flag}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              {t('settings.theme')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => updateSettings({ theme: theme.value as any })}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      settings.theme === theme.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <IconComponent className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <div className="font-medium text-gray-900 dark:text-white">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Type className="h-5 w-5 mr-2" />
              {t('settings.fontSize')}
            </h2>
            <div className="space-y-3">
              {fontSizes.map((size) => (
                <label key={size.value} className="flex items-center">
                  <input
                    type="radio"
                    name="fontSize"
                    value={size.value}
                    checked={settings.fontSize === size.value}
                    onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                    className="mr-3 text-blue-600 dark:bg-gray-700"
                  />
                  <span className={`text-gray-900 dark:text-white ${
                    size.value === 'small' ? 'text-sm' : 
                    size.value === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {size.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ตัวอย่าง / Preview / 预览</h2>
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {settings.language === 'th' ? 'ตัวอย่างข้อความ' : 
                 settings.language === 'en' ? 'Sample Text' : '示例文本'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {settings.language === 'th' ? 'นี่คือตัวอย่างข้อความที่แสดงผลตามการตั้งค่าที่คุณเลือก' :
                 settings.language === 'en' ? 'This is sample text displayed according to your selected settings' :
                 '这是根据您选择的设置显示的示例文本'}
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              บัญชีผู้ใช้ / Account / 账户
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">เปลี่ยนรหัสผ่าน / Change Password / 更改密码</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">อัปเดตรหัสผ่านของคุณ</div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">การแจ้งเตือน / Notifications / 通知</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">จัดการการแจ้งเตือนทางอีเมลและแอป</div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">ความเป็นส่วนตัว / Privacy / 隐私</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ตั้งค่าความเป็นส่วนตัวและการรักษาความปลอดภัย</div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
              <button className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <div className="font-medium text-red-600 dark:text-red-400">ลบบัญชี / Delete Account / 删除账户</div>
                <div className="text-sm text-red-500 dark:text-red-300">ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;