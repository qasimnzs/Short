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
    const { url, title, desc, img } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    const shortId = nanoid(6);
    const linkData = {
      longUrl: url,
      title: title || "Shared via QuickLink",
      description: desc || "Click to open the link",
      image: img || "https://vercel.com/og-image.png" // Default image agar user na de
    };

    await redis.set(shortId, JSON.stringify(linkData));
    return NextResponse.json({ shortId });
  } catch (error) {
    return NextResponse.json({ error: 'Server Connection Error' }, { status: 500 });
  }
}
