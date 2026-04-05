import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const shortId = nanoid(6);
    await redis.set(shortId, url);

    return NextResponse.json({ shortId });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
