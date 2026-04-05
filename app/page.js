"use client";
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setShortUrl(`${window.location.origin}/${data.shortId}`);
    setLoading(false);
  };

  return (
    <main style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Link Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="url" 
          placeholder="Paste link here..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Creating...' : 'Shorten Link'}
        </button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <p>Your Short Link:</p>
          <a href={shortUrl} target="_blank">{shortUrl}</a>
        </div>
      )}
    </main>
  );
}
