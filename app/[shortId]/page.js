import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// BOTS KE LIYE METADATA (Width aur Height ke sath)
export async function generateMetadata({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);
  if (!rawData) return { title: "Not Found" };

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://${headers().get('host')}/${shortId}`,
      siteName: 'QuickLink',
      images: [
        {
          url: data.image,
          width: 1200,  // Facebook ko ye sizes chahiye hote hain
          height: 630,
          alt: data.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.image],
    },
  };
}

export default async function RedirectPage({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);
  if (!rawData) redirect('/');

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  
  const userAgent = headers().get('user-agent') || '';
  const isBot = /bot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|telegrambot/i.test(userAgent);

  // AIRBRIDGE STYLE: Insaan ko direct redirect (0 delay)
  if (!isBot) {
    redirect(data.longUrl);
  }

  // Bots ko Metadata wala page dikhega
  return (
    <html>
      <body>
        <p>Redirecting to {data.longUrl}...</p>
      </body>
    </html>
  );
}
