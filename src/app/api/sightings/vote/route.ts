import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sighting_id, direction } = body; // direction: 'up' | 'down'

  if (!sighting_id || !direction) {
    return NextResponse.json({ error: 'sighting_id and direction required' }, { status: 400 });
  }

  const field = direction === 'up' ? 'upvotes' : 'downvotes';

  // Fetch current value
  const { data: current, error: fetchErr } = await supabase
    .from('sightings')
    .select(field)
    .eq('id', sighting_id)
    .single();

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

  const newVal = ((current as any)[field] || 0) + 1;
  const { data, error } = await supabase
    .from('sightings')
    .update({ [field]: newVal })
    .eq('id', sighting_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
