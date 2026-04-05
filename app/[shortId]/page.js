import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function generateMetadata({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);
  if (!rawData) return { title: "Link Not Found" };

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.image],
    }
  };
}

export default async function RedirectPage({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);
  if (!rawData) redirect('/');

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  redirect(data.longUrl);
}
