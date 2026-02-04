from fastapi import FastAPI, HTTPException
import pandas as pd
import os

app = FastAPI()

# Path absolut agar Vercel tidak bingung mencari file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_PATH = os.path.join(BASE_DIR, "Lolos Staff.xlsx")

@app.get("/api")
async def cek_penerimaan(nrp: str = None):
    if not nrp:
        return {"error": "NRP tidak boleh kosong"}
    
    try:
        # Membaca file excel
        df = pd.read_excel(EXCEL_PATH)
        
        # Cari data berdasarkan kolom 'NRP' (pastikan di Excel kolomnya bernama 'NRP')
        result = df[df['id'].astype(str) == str(nrp)]
        
        if not result.empty:
            row = result.iloc[0]
            return {
                "nama": str(row['nama']), # Pastikan kolom 'Nama' ada di Excel
                "lolos": True,
                "nrp": str(nrp)
            }
        else:
            return {
                "nama": "Tidak Ditemukan",
                "lolos": False,
                "nrp": str(nrp)
            }
    except Exception as e:
        return {"error": str(e)}