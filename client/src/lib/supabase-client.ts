import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database table types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface Application {
  id: string;
  startup_name: string;
  founder_email: string;
  accelerator_name: string;
  status: 'pending' | 'submitted' | 'in_review' | 'interview' | 'accepted' | 'rejected';
  submitted_at: string;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  expertise: string[];
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  created_at: string;
}

// Helper functions for database operations
export const subscribeToNewsletter = async (email: string) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])
    .select();
  
  if (error) throw error;
  return data;
};

export const addApplication = async (application: Omit<Application, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([application])
    .select();
  
  if (error) throw error;
  return data;
};

export const getApplications = async (founderEmail: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('founder_email', founderEmail);
  
  if (error) throw error;
  return data;
};

export const getCommunityMembers = async () => {
  const { data, error } = await supabase
    .from('community_members')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getResources = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select('*');
  
  if (error) throw error;
  return data;
};
