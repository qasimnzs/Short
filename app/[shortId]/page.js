import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';

// Ye line build error ko fix karegi
export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function Page({ params }) {
  const { shortId } = params;
  
  // Link check karein
  const longUrl = await redis.get(shortId);

  if (!longUrl) {
    redirect('/');
  }

  redirect(longUrl);
}
