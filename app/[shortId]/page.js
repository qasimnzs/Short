import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function RedirectPage({ params }) {
  const { shortId } = params;
  const longUrl = await redis.get(shortId);

  if (!longUrl) {
    redirect('/');
  }

  redirect(longUrl);
}
