"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', img: '' });
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.shortId) {
        setShortUrl(`${window.location.origin}/${data.shortId}`);
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Check your internet or Vercel Environment Variables");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px',
    border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px', border: '1px solid #334155' }}>
        <h1 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '10px' }}>QuickLink Pro</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Short links with social previews</p>
        
        <form onSubmit={handleSubmit}>
          <input type="url" placeholder="Paste Long URL *" required style={inputStyle} onChange={e => setFormData({...formData, url: e.target.value})} />
          <input type="text" placeholder="Social Title" style={inputStyle} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Social Description" style={inputStyle} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <input type="url" placeholder="Social Image URL (https://...)" style={inputStyle} onChange={e => setFormData({...formData, img: e.target.value})} />

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Generating...' : 'Create Social Link'}
          </button>
        </form>

        {shortUrl && (
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #2563eb', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#38bdf8', margin: '0 0 10px 0' }}>YOUR SHORT LINK:</p>
            <a href={shortUrl} target="_blank" style={{ color: 'white', fontWeight: 'bold', wordBreak: 'break-all' }}>{shortUrl}</a>
            <button onClick={() => {navigator.clipboard.writeText(shortUrl); alert("Copied!")}} style={{ display: 'block', margin: '10px auto 0', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>Copy Link</button>
          </div>
        )}
      </div>
    </div>
  );
}
