export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'teacher' | 'admin';
  school?: string;
  subjects?: string[];
  experience?: number;
  bio?: string;
  phone?: string;
  address?: string;
  education?: string[];
  certifications?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface AppSettings {
  language: 'th' | 'en' | 'zh';
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
}

export type Language = 'th' | 'en' | 'zh';