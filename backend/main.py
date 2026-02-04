from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi dictionary untuk menyimpan data lolos {nrp: nama}
# Ini akan jauh lebih efisien untuk pencarian
data_lolos = {}

def load_data():
    global data_lolos
    try:
        df_raw = pd.read_excel("Lolos Staff.xlsx")
        
        # Asumsi kolom pertama adalah data gabungan "id,nama,posisi,status"
        # Kita perlu memisahkan dan menyimpan id serta nama
        
        temp_data = {}
        for row_str in df_raw.iloc[:, 0].astype(str):
            parts = row_str.split(',')
            if len(parts) >= 2: # Pastikan ada id dan nama
                nrp_id = parts[0].strip()
                nama_lengkap = parts[1].strip()
                temp_data[nrp_id] = nama_lengkap
            
        data_lolos = temp_data
        print(f"✅ Berhasil memuat {len(data_lolos)} data calon staff.")
    except Exception as e:
        print(f"❌ Error saat memuat data Excel: {e}")

# Load saat startup
load_data()

@app.get("/cek-penerimaan/{nrp}")
async def cek_penerimaan_api(nrp: str):
    if not data_lolos:
        raise HTTPException(status_code=500, detail="Data staff belum siap atau gagal dimuat.")

    nrp_stripped = nrp.strip()
    if nrp_stripped in data_lolos:
        return {
            "nrp": nrp_stripped,
            "lolos": True,
            "nama": data_lolos[nrp_stripped] # Kirim nama jika lolos
        }
    else:
        return {
            "nrp": nrp_stripped,
            "lolos": False,
            "nama": None # Atau string kosong, sesuai kebutuhan frontend
        }

@app.get("/")
def home():
    return {"status": "API is running", "total_data_lolos": len(data_lolos)}