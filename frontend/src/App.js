import React, { useState } from 'react';
import './App.css';
import logoHimasta from './assets/logo.png';
import dataStaff from './data_lolos.json'; // MEMANGGIL DATA LOKAL

const App = () => {
  const [nrp, setNrp] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    if (!nrp.trim()) {
      alert('Mohon masukkan NRP terlebih dahulu!');
      return;
    }
    
    setStatus('loading');
    setResult(null);

    // Simulasi loading sebentar biar kelihatan keren
    setTimeout(() => {
      // Cari NRP di file JSON
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
        // Jika tidak ada di list
        setResult({
          nama: "Maaf, NRP Tidak Terdaftar",
          lolos: false,
          nrp: nrp.trim(),
          time: new Date().toLocaleTimeString('id-ID')
        });
      }
      
      setStatus('idle');
      setNrp('');
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && status !== 'loading') handleCheck();
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
          />
          <button onClick={handleCheck} className="btn-glow" disabled={status === 'loading'}>
            {status === 'loading' ? "Memproses..." : "✨ Cek Status"}
          </button>
        </div>

        <div className="display-area">
          {status === 'loading' && <div className="spinner"></div>}

          {result && status === 'idle' && (
            <div className={`card-announcement ${result.lolos && result.nama !== "Maaf, NRP Tidak Terdaftar" ? 'lolos' : 'gagal'} scale-in`}>
              {result.lolos && result.nama !== "Maaf, NRP Tidak Terdaftar" ? (
                <div className="msg-content">
                  <h3 className="congrats">🎊 SELAMAT! 🎊</h3>
                  <h2 className="name-display">{result.nama}</h2>
                  <p className="nrp-info">Posisi: <strong>{result.posisi}</strong></p>
                  <p className="caption">Selamat bergabung di Resonansi Sinergis HIMASTA-ITS! 🚀</p>
                </div>
              ) : (
                <div className="msg-content">
                  <h3>💙 Tetap Semangat! 💙</h3>
                  <p className="caption">NRP {result.nrp} belum terdaftar sebagai staff periode ini. Jangan menyerah!</p>
                </div>
              )}
              <span className="timestamp">⏰ Dicek pada: {result.time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;