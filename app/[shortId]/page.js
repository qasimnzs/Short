import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// YE FUNCTION BOTS KO PREVIEW DIKHAYEGA
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
      images: [{ url: data.image }], // Aapka image URL yahan jayega
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

// YE FUNCTION INSAAN KO REDIRECT KAREGA
export default async function RedirectPage({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);

  if (!rawData) redirect('/');

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  
  const userAgent = headers().get('user-agent') || '';
  // Crawler Bots ki list
  const isBot = /bot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|telegrambot|slackbot/i.test(userAgent);

  // Agar Bot nahi hai toh Fauran Redirect (Direct Airbridge Style)
  if (!isBot) {
    redirect(data.longUrl);
  }

  // Agar Bot hai toh sirf blank page dikhao (Metadata upar generate ho chuka hai)
  return (
    <html>
      <body>
        <p>Redirecting to {data.longUrl}...</p>
      </body>
    </html>
  );
}
