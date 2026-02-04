import React, { useState } from 'react';
import './App.css';
import logoHimasta from './assets/logo.png';

const App = () => {
  const [nrp, setNrp] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!nrp.trim()) {
      alert('Mohon masukkan NRP terlebih dahulu!');
      return;
    }
    
    setStatus('loading');
    setResult(null);

    // Simulasi delay untuk efek loading yang lebih smooth
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const response = await fetch(`https://api-himasta.vercel.app/cek-penerimaan/${nrp.trim()}`);
      
      if (!response.ok) {
        throw new Error('Data tidak ditemukan');
      }

      const data = await response.json();

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
      console.error('Error:', error);
      setStatus('error');
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
              <>
                <span>🔍</span> Memproses...
              </>
            ) : (
              <>
                <span>✨</span> Cek Status
              </>
            )}
          </button>
        </div>

        <div className="display-area">
          {status === 'loading' && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Mengecek data...</p>
            </div>
          )}

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
                    <span>✨</span>
                    <span>⭐</span>
                    <span>💫</span>
                    <span>🌟</span>
                    <span>✨</span>
                  </div>
                </div>
              ) : (
                <div className="msg-content">
                  <h3>💙 Mohon Maaf Kamu belum berkesempatan 💙</h3>
                  <p className="caption">
                    Tetap semangat dalam menjalani perjalananmu! 
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
          
          {status === 'error' && (
            <div className="error scale-in">
              <h3>⚠️ Oops!</h3>
              <p>Terjadi kesalahan saat mengecek data.</p>
              <p>Pastikan server berjalan dan NRP yang dimasukkan benar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;