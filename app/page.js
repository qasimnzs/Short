"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', img: '' });
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(''); // Alert ki jagah message ke liye

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Generating your link...');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.shortId) {
        setShortUrl(`${window.location.origin}/${data.shortId}`);
        setStatus('Link Created Successfully!');
      } else {
        setStatus('Error: ' + (data.error || "Failed to create link"));
      }
    } catch (err) {
      setStatus('Check your internet or Vercel Settings');
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
        <h1 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '5px' }}>QuickLink Social</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginBottom: '25px' }}>Short links with CUSTOM social previews</p>
        
        <form onSubmit={handleSubmit}>
          <input type="url" placeholder="Long URL *" required style={inputStyle} onChange={e => setFormData({...formData, url: e.target.value})} />
          <input type="text" placeholder="Custom Title (Social Media)" style={inputStyle} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Custom Description" style={inputStyle} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <input type="url" placeholder="Custom Image URL (https://...)" style={inputStyle} onChange={e => setFormData({...formData, img: e.target.value})} />

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : 'Create Social Link'}
          </button>
        </form>

        {status && <p style={{ textAlign: 'center', color: '#38bdf8', fontSize: '12px', marginTop: '10px' }}>{status}</p>}

        {shortUrl && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #2563eb', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>SHARE THIS LINK:</p>
            <p style={{ color: 'white', fontWeight: 'bold', wordBreak: 'break-all', margin: '5px 0' }}>{shortUrl}</p>
            <button onClick={() => {navigator.clipboard.writeText(shortUrl); setStatus('Link Copied to Clipboard!');}} style={{ background: '#334155', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Copy Link</button>
          </div>
        )}
      </div>
    </div>
  );
}
