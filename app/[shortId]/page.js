import { Redis } from '@upstash/redis';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function RedirectPage({ params }) {
  const { shortId } = params;
  const rawData = await redis.get(shortId);

  if (!rawData) redirect('/');

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  
  // Bot Detection (WhatsApp, FB, Twitter, etc.)
  const userAgent = headers().get('user-agent') || '';
  const isBot = /bot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|telegrambot/i.test(userAgent);

  // AGAR BOT HAI (Preview dikhao)
  if (isBot) {
    return (
      <html>
        <head>
          <title>{data.title}</title>
          <meta name="description" content={data.description} />
          {/* Open Graph Tags */}
          <meta property="og:title" content={data.title} />
          <meta property="og:description" content={data.description} />
          <meta property="og:image" content={data.image} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://${headers().get('host')}/${shortId}`} />
          {/* Twitter Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={data.image} />
        </head>
        <body>
          <p>Redirecting to {data.longUrl}...</p>
        </body>
      </html>
    );
  }

  // AGAR INSAAN HAI (Direct Redirect - No Waiting)
  redirect(data.longUrl);
}
