import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          school: string | null;
          subjects: string[] | null;
          experience: number | null;
          bio: string | null;
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          education: string[] | null;
          certifications: string[] | null;
          social_links: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          school?: string | null;
          subjects?: string[] | null;
          experience?: number | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          education?: string[] | null;
          certifications?: string[] | null;
          social_links?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          school?: string | null;
          subjects?: string[] | null;
          experience?: number | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          education?: string[] | null;
          certifications?: string[] | null;
          social_links?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_plans: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          subject: string;
          grade: string;
          duration: number | null;
          objectives: string | null;
          activities: string | null;
          materials: string | null;
          assessment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          subject: string;
          grade: string;
          duration?: number | null;
          objectives?: string | null;
          activities?: string | null;
          materials?: string | null;
          assessment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          subject?: string;
          grade?: string;
          duration?: number | null;
          objectives?: string | null;
          activities?: string | null;
          materials?: string | null;
          assessment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          teacher_id: string;
          name: string;
          description: string | null;
          category: string | null;
          duration: number | null;
          group_size: string | null;
          objectives: string | null;
          instructions: string | null;
          materials: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          duration?: number | null;
          group_size?: string | null;
          objectives?: string | null;
          instructions?: string | null;
          materials?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          duration?: number | null;
          group_size?: string | null;
          objectives?: string | null;
          instructions?: string | null;
          materials?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tests: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          subject: string;
          grade: string;
          duration: number | null;
          instructions: string | null;
          questions: any | null;
          total_points: number | null;
          is_published: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          subject: string;
          grade: string;
          duration?: number | null;
          instructions?: string | null;
          questions?: any | null;
          total_points?: number | null;
          is_published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          subject?: string;
          grade?: string;
          duration?: number | null;
          instructions?: string | null;
          questions?: any | null;
          total_points?: number | null;
          is_published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          teacher_id: string;
          student_id: string;
          name: string;
          grade: string;
          class: string | null;
          photo_url: string | null;
          personality: any | null;
          academic_data: any | null;
          behavioral_data: any | null;
          notes: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          student_id: string;
          name: string;
          grade: string;
          class?: string | null;
          photo_url?: string | null;
          personality?: any | null;
          academic_data?: any | null;
          behavioral_data?: any | null;
          notes?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          student_id?: string;
          name?: string;
          grade?: string;
          class?: string | null;
          photo_url?: string | null;
          personality?: any | null;
          academic_data?: any | null;
          behavioral_data?: any | null;
          notes?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          test_id: string;
          student_id: string;
          answers: any | null;
          score: number | null;
          total_points: number | null;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          student_id: string;
          answers?: any | null;
          score?: number | null;
          total_points?: number | null;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          test_id?: string;
          student_id?: string;
          answers?: any | null;
          score?: number | null;
          total_points?: number | null;
          completed_at?: string;
          created_at?: string;
        };
      };
    };
  };
}