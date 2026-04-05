import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default async function RedirectPage({ params }: { params: { shortId: string } }) {
  const shortId = params.shortId;
  const longUrl: string | null = await redis.get(shortId);

  if (!longUrl) {
    redirect('/');
  }

  redirect(longUrl);
}
