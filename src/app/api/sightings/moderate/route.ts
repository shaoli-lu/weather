import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: fetch pending sightings for moderation
export async function GET() {
  const { data, error } = await supabase
    .from('sightings')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: approve or reject a sighting
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, approved } = body;
  if (id === undefined || approved === undefined) {
    return NextResponse.json({ error: 'id and approved are required' }, { status: 400 });
  }

  if (!approved) {
    // Delete rejected sightings
    const { data, error } = await supabase
      .from('sightings')
      .delete()
      .eq('id', id)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No row was deleted from Supabase. Please ensure Row Level Security (RLS) is disabled or SUPABASE_SERVICE_ROLE_KEY is configured in env variables.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ deleted: true });
  }

  const { data, error } = await supabase
    .from('sightings')
    .update({ approved: true })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

