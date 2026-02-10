import React, { useState, useRef } from 'react';
import './App.css';
import logoHimasta from './assets/logo.png';
import backgroundImage from './assets/background.jpg';
import dataStaff from './data_lolos.json';

const App = () => {
  const [nrp, setNrp] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleCheck = () => {
    if (!nrp.trim()) {
      alert('Mohon masukkan NRP terlebih dahulu!');
      return;
    }
    
    setStatus('loading');
    setResult(null);

    setTimeout(() => {
      const foundUser = dataStaff.find(user => user.nrp === nrp.trim());

      if (foundUser) {
        setResult({
          nama: foundUser.nama,
          posisi: foundUser.posisi,
          lolos: true,
          nrp: foundUser.nrp,
          time: new Date().toLocaleTimeString('id-ID')
        });
      } else {
        setResult({
          nama: "NRP Tidak Ditemukan",
          lolos: false,
          nrp: nrp.trim(),
          time: new Date().toLocaleTimeString('id-ID')
        });
      }
      
      setStatus('idle');
      setNrp('');
      
      // Auto clear result after 5 seconds
      setTimeout(() => {
        setResult(null);
      }, 15000);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && status !== 'loading') {
      handleCheck();
    }
  };

  const handleClear = () => {
    setNrp('');
    setResult(null);
    inputRef.current?.focus();
  };

  return (
    <div className="main-background">
      <div className="logo-container">
        <img src={logoHimasta} alt="Logo HIMASTA-ITS" className="main-logo" />
      </div>

      <div className="glass-container">
        <header>
          <h1 className="title">HIMASTA-ITS 2026</h1>
          <p className="subtitle">Cek Status Penerimaan Staff</p>
        </header>

        <div className="input-box">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Masukkan NRP..." 
            value={nrp}
            onChange={(e) => setNrp(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={status === 'loading'}
            autoComplete="off"
            maxLength="20"
          />
          <button 
            onClick={handleCheck} 
            className="btn-glow" 
            disabled={status === 'loading'}
            aria-label="Cek Status"
          >
            {status === 'loading' ? "..." : "✨ Cek"}
          </button>
        </div>

        <div className="display-area">
          {status === 'loading' && <div className="spinner"></div>}

          {result && status === 'idle' && (
            <>
              <div className={`card-announcement ${result.lolos ? 'lolos' : 'gagal'} scale-in`}>
                <div className="msg-content">
                  {result.lolos ? (
                    <>
                      <h3 className="congrats">🎊 SELAMAT! 🎊</h3>
                      <h2 className="name-display">{result.nama}</h2>
                      <p className="nrp-info">NRP: <strong>{result.nrp}</strong></p>
                      <p className="caption">Kamu berhasil menjadi bagian Staff HIMASTA-ITS 2026 🥳</p>
                      <p className="caption">Terima kasih sudah berani melangkah. Saatnya tumbuh, berkontribusi, dan bersinergi bersama Resonansi Sinergis 🔥</p>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '12px' }}> 💓 Mohon maaf, kamu belum berhasil menjadi bagian dari Staf HIMASTA-ITS 2026 💓</h3>
                      <p className="caption">Terima kasih atas antusiasme selama proses seleksi.</p>
                      <p className="caption">Kami percaya masih banyak tempat di luar sana untuk kamu bertumbuh dan bersinar, tetap semangat. 🌱✨</p>
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={handleClear}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  fontWeight: '500',
                  fontFamily: 'Plus Jakarta Sans'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'var(--text-main)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                Cek Lagi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;