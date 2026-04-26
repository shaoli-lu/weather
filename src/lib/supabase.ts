import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Sighting = {
  id: number;
  created_at: string;
  country: string;
  city: string;
  submitted_at: string;
  submitter_name: string;
  caption: string;
  media_url: string;
  media_type: 'image' | 'video';
  approved: boolean;
  upvotes: number;
  downvotes: number;
  comment_count: number;
};

export type SightingComment = {
  id: number;
  created_at: string;
  sighting_id: number;
  author: string;
  content: string;
};
