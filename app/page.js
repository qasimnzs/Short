"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', img: '' });
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Connecting to server...');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.shortId) {
        setShortUrl(`${window.location.origin}/${data.shortId}`);
        setMsg('Link Created Successfully!');
      } else {
        setMsg('Error: Could not save link.');
      }
    } catch (err) {
      setMsg('Failed. Check your internet/Vercel settings.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px',
    border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '15px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', backgroundColor: '#0f172a' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px' }}>ShortLink Pro</h2>
        
        <form onSubmit={handleSubmit}>
          <input type="url" placeholder="Long URL *" required style={inputStyle} onChange={e => setFormData({...formData, url: e.target.value})} />
          <input type="text" placeholder="Custom Title" style={inputStyle} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Custom Description" style={inputStyle} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <input type="url" placeholder="Image URL (Direct Link)" style={inputStyle} onChange={e => setFormData({...formData, img: e.target.value})} />

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px' }}>
            {loading ? 'Working...' : 'Create Social Link'}
          </button>
        </form>

        {msg && <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '15px' }}>{msg}</p>}

        {shortUrl && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#0f172a', borderRadius: '12px', border: '1px solid #2563eb' }}>
            <p style={{ color: 'white', wordBreak: 'break-all', fontSize: '14px', textAlign: 'center' }}>{shortUrl}</p>
            <button onClick={() => {navigator.clipboard.writeText(shortUrl); setMsg('Link Copied!')}} style={{ width: '100%', marginTop: '10px', background: '#334155', color: 'white', border: 'none', padding: '8px', borderRadius: '6px' }}>Copy Link</button>
          </div>
        )}
      </div>
    </div>
  );
}
