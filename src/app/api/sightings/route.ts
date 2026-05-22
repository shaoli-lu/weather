import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch approved sightings
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get('sort') || 'new';
  const page = Math.max(0, parseInt(searchParams.get('page') || '0', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

  let query = supabase
    .from('sightings')
    .select('*')
    .eq('approved', true);

  if (sort === 'new') {
    query = query.order('submitted_at', { ascending: false });
  } else if (sort === 'top') {
    query = query.order('upvotes', { ascending: false });
  } else if (sort === 'hot') {
    // Hot = score weighted by recency
    query = query.order('upvotes', { ascending: false }).order('submitted_at', { ascending: false });
  }

  // Fetch one extra to determine if more pages exist
  const from = page * limit;
  const { data, error } = await query.range(from, from + limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const hasMore = (data?.length ?? 0) > limit;
  const items = hasMore ? data!.slice(0, limit) : (data ?? []);
  return NextResponse.json({ data: items, hasMore });
}

// POST: submit a new sighting (auto-approved by default)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    country = 'Unknown',
    city = 'Unknown',
    submitter_name = 'Unknown',
    caption = '',
    media_url,
    media_type = 'image',
  } = body;

  if (!media_url) {
    return NextResponse.json({ error: 'media_url is required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('sightings').insert([{
    country: country || 'Unknown',
    city: city || 'Unknown',
    submitter_name: submitter_name || 'Unknown',
    caption,
    media_url,
    media_type,
    submitted_at: new Date().toISOString(),
    approved: true,
    upvotes: 0,
    downvotes: 0,
    comment_count: 0,
  }]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
