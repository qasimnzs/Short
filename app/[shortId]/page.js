import { Redis } from '@upstash/redis';

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
      type: 'website',
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
  if (!rawData) return <div style={{color:'white', padding:'20px'}}>Link not found.</div>;

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting you...</h2>
        <p style={{ color: '#94a3b8' }}>Please wait a moment.</p>
        {/* Automatic Redirect Script */}
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { window.location.href = "${data.longUrl}"; }, 500);`
        }} />
      </div>
    </div>
  );
}
