"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', img: '' });
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.shortId) setShortUrl(`${window.location.origin}/${data.shortId}`);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Advanced Link Shortener</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="url" placeholder="Long URL (Required)" required className="w-full p-3 rounded bg-slate-900 border border-slate-700"
            onChange={e => setFormData({...formData, url: e.target.value})} />
          
          <input type="text" placeholder="Custom Title (for Social Media)" className="w-full p-3 rounded bg-slate-900 border border-slate-700"
            onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <input type="text" placeholder="Short Description" className="w-full p-3 rounded bg-slate-900 border border-slate-700"
            onChange={e => setFormData({...formData, desc: e.target.value})} />
          
          <input type="url" placeholder="Preview Image URL (https://...)" className="w-full p-3 rounded bg-slate-900 border border-slate-700"
            onChange={e => setFormData({...formData, img: e.target.value})} />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition">
            {loading ? 'Creating...' : 'Create Social Link'}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-slate-900 rounded border border-green-500">
            <p className="text-sm text-green-400 mb-2">Success! Share this link:</p>
            <a href={shortUrl} target="_blank" className="text-white underline break-all">{shortUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
}
