import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Ye function Social Media Preview banata hai
export async function generateMetadata({ params }) {
  const data = await redis.get(params.shortId);
  if (!data) return { title: "Not Found" };

  const link = typeof data === 'string' ? JSON.parse(data) : data;

  return {
    title: link.title,
    description: link.description,
    openGraph: {
      title: link.title,
      description: link.description,
      images: [link.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: link.title,
      description: link.description,
      images: [link.image],
    },
  };
}

export default async function RedirectPage({ params }) {
  const data = await redis.get(params.shortId);
  if (!data) redirect('/');

  const link = typeof data === 'string' ? JSON.parse(data) : data;

  // Real users ko redirect kar do
  redirect(link.longUrl);
}
