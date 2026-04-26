import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch comments for a sighting
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sighting_id = searchParams.get('sighting_id');

  if (!sighting_id) {
    return NextResponse.json({ error: 'sighting_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('sighting_comments')
    .select('*')
    .eq('sighting_id', sighting_id)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: add a comment
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sighting_id, author = 'Anonymous', content } = body;

  if (!sighting_id || !content) {
    return NextResponse.json({ error: 'sighting_id and content are required' }, { status: 400 });
  }

  const { data: comment, error: commentErr } = await supabase
    .from('sighting_comments')
    .insert([{ sighting_id, author: author || 'Anonymous', content }])
    .select()
    .single();

  if (commentErr) return NextResponse.json({ error: commentErr.message }, { status: 500 });

  // Increment comment_count on sighting
  await supabase.rpc('increment_comment_count', { sighting_id_input: sighting_id });

  return NextResponse.json(comment, { status: 201 });
}
