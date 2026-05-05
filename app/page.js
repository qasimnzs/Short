"use client";
import { useState, useEffect } from 'react';

export default function Home() {

  // 🔐 Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginMsg, setLoginMsg] = useState('');

  // 🔗 App State
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', img: '' });
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // 🔁 Check Login on Load
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved === "true") setIsLoggedIn(true);
  }, []);

  // 🔐 Handle Login
  const handleLogin = (e) => {
    e.preventDefault();

    // 👉 Change credentials here
    if (loginData.username === "admin" && loginData.password === "1234") {
      localStorage.setItem("auth", "true");
      setIsLoggedIn(true);
    } else {
      setLoginMsg("Invalid Credentials!");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
  };

  // 🔗 Link Submit
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
    width: '100%',
    padding: '14px',
    marginBottom: '15px',
    borderRadius: '10px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: 'white',
    fontSize: '15px'
  };

  // 🔐 LOGIN UI
  if (!isLoggedIn) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f172a'}}>
        <form onSubmit={handleLogin} style={{background:'#1e293b',padding:'30px',borderRadius:'15px',width:'300px'}}>
          <h2 style={{color:'#38bdf8',textAlign:'center'}}>Login</h2>

          <input type="text" placeholder="Username" required style={inputStyle}
            onChange={e => setLoginData({...loginData, username: e.target.value})} />

          <input type="password" placeholder="Password" required style={inputStyle}
            onChange={e => setLoginData({...loginData, password: e.target.value})} />

          <button style={{width:'100%',padding:'12px',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px'}}>
            Login
          </button>

          {loginMsg && <p style={{color:'red',fontSize:'12px',textAlign:'center'}}>{loginMsg}</p>}
        </form>
      </div>
    );
  }

  // ✅ MAIN APP UI
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'20px', backgroundColor:'#0f172a' }}>
      
      <button onClick={handleLogout} style={{position:'absolute',top:'20px',right:'20px',background:'#ef4444',color:'#fff',padding:'8px 12px',border:'none',borderRadius:'6px'}}>
        Logout
      </button>

      <div style={{ backgroundColor:'#1e293b', padding:'30px', borderRadius:'20px', border:'1px solid #334155', width:'100%', maxWidth:'420px' }}>
        
        <h2 style={{ color:'#38bdf8', textAlign:'center', marginBottom:'30px' }}>ShortLink Pro</h2>

        <form onSubmit={handleSubmit}>
          <input type="url" placeholder="Long URL *" required style={inputStyle}
            onChange={e => setFormData({...formData, url: e.target.value})} />

          <input type="text" placeholder="Custom Title" style={inputStyle}
            onChange={e => setFormData({...formData, title: e.target.value})} />

          <input type="text" placeholder="Custom Description" style={inputStyle}
            onChange={e => setFormData({...formData, desc: e.target.value})} />

          <input type="url" placeholder="Image URL" style={inputStyle}
            onChange={e => setFormData({...formData, img: e.target.value})} />

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'15px', background:'#2563eb', color:'white', border:'none', borderRadius:'10px' }}>
            {loading ? 'Working...' : 'Create Social Link'}
          </button>
        </form>

        {msg && <p style={{ textAlign:'center', fontSize:'12px', color:'#94a3b8', marginTop:'15px' }}>{msg}</p>}

        {shortUrl && (
          <div style={{ marginTop:'25px', padding:'15px', background:'#0f172a', borderRadius:'12px', border:'1px solid #2563eb' }}>
            <p style={{ color:'white', wordBreak:'break-all', fontSize:'14px', textAlign:'center' }}>{shortUrl}</p>

            <button onClick={() => {
              navigator.clipboard.writeText(shortUrl);
              setMsg('Link Copied!');
            }} style={{ width:'100%', marginTop:'10px', background:'#334155', color:'white', border:'none', padding:'8px', borderRadius:'6px' }}>
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
