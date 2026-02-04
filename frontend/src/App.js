import React, { useState } from 'react';
import './App.css';
import logoHimasta from './assets/logo.png';

const App = () => {
  const [nrp, setNrp] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, error
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    // 1. Validasi Input
    if (!nrp.trim()) {
      alert('Mohon masukkan NRP terlebih dahulu!');
      return;
    }
    
    setStatus('loading');
    setResult(null);

    // Simulasi delay biar transisinya cakep
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      // 2. Fetch ke API (Sesuai dengan vercel.json rewrite)
      // Kita pakai Query Parameter ?nrp=...
      const response = await fetch(`/api?nrp=${nrp.trim()}`);
      
      if (!response.ok) {
        throw new Error('Server bermasalah atau data tidak ditemukan');
      }

      const data = await response.json();

      // 3. Jika Backend mengirimkan field error
      if (data.error) {
        console.error("Backend Error:", data.error);
        setStatus('error');
        return;
      }

      // 4. Set Hasil ke State
      setResult({
        nama: data.nama,
        lolos: data.lolos,
        nrp: data.nrp,
        time: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })
      });
      
      setNrp(''); 
      setStatus('idle');
    } catch (error) {
      console.error('Fetch Error:', error);
      setStatus('error');
      // Balikin ke idle setelah 3 detik biar user bisa coba lagi
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && status !== 'loading') {
      handleCheck();
    }
  };

  return (
    <div className="main-background">
      <div className="logo-container">
        <img src={logoHimasta} alt="Logo HIMASTA-ITS" className="main-logo" />
      </div>
      
      <div className="glass-container">
        <header>
          <h1 className="title">HIMASTA-ITS 2026</h1>
          <p className="subtitle">Pengumuman Calon Staff HIMASTA-ITS 2026</p>
        </header>

        <div className="input-box">
          <input 
            type="text" 
            placeholder="Masukkan NRP..." 
            value={nrp}
            onChange={(e) => setNrp(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={status === 'loading'}
            maxLength={10}
          />
          <button 
            onClick={handleCheck} 
            className="btn-glow"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <><span>🔍</span> Memproses...</>
            ) : (
              <><span>✨</span> Cek Status</>
            )}
          </button>
        </div>

        <div className="display-area">
          {/* Efek Loading */}
          {status === 'loading' && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Mengecek data di server...</p>
            </div>
          )}

          {/* Hasil Pengumuman */}
          {result && status === 'idle' && (
            <div className={`card-announcement ${result.lolos ? 'lolos' : 'gagal'} scale-in`}>
              {result.lolos ? (
                <div className="msg-content">
                  <h3 className="congrats">🎊 SELAMAT! 🎊</h3>
                  <h2 className="name-display">{result.nama}</h2>
                  <p className="nrp-info">NRP: <span className="nrp-highlight">{result.nrp}</span></p>
                  <p className="caption">
                    🌟 Kamu telah menjadi bagian dari <strong>Resonansi Sinergis HIMASTA-ITS</strong>! 
                    <br/>Mari bersama membangun sinergi yang luar biasa! 🚀
                  </p>
                  <div className="celebration-dots">
                    <span>✨</span><span>⭐</span><span>💫</span><span>🌟</span><span>✨</span>
                  </div>
                </div>
              ) : (
                <div className="msg-content">
                  <h3>💙 Semangat Terus! 💙</h3>
                  <h2 className="name-display">{result.nama}</h2>
                  <p className="caption">
                    Mohon maaf, kamu belum berkesempatan menjadi staff periode ini. 
                    <br/>Setiap langkah adalah pembelajaran berharga. 💪
                  </p>
                  <p className="motivasi">
                    <em>"Kesuksesan adalah perjalanan, bukan tujuan akhir."</em>
                  </p>
                </div>
              )}
              <span className="timestamp">⏰ Dicek pada: {result.time}</span>
            </div>
          )}
          
          {/* Tampilan Error */}
          {status === 'error' && (
            <div className="error scale-in">
              <h3>⚠️ Terjadi Kesalahan</h3>
              <p>Gagal menghubungi server atau file data tidak terbaca.</p>
              <p>Coba lagi beberapa saat lagi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;