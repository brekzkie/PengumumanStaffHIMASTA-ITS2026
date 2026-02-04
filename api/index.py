import pandas as pd
from fastapi.responses import JSONResponse
import os

def handler(request, context):
    query = request.get("query", {})
    nrp = query.get("nrp")

    if not nrp:
        return JSONResponse(
            status_code=400,
            content={"message": "NRP wajib diisi"}
        )

    try:
        base_dir = os.path.dirname(__file__)
        excel_path = os.path.join(base_dir, "Lolos_Staff.xlsx")

        # Baca semua baris sebagai string
        df = pd.read_excel(excel_path, header=None)

        data = {}

        for i, row in df.iterrows():
            row_str = str(row[0])

            # skip header
            if row_str.lower().startswith("id,"):
                continue

            parts = row_str.split(",")

            if len(parts) >= 4:
                id_nrp = parts[0].strip()
                nama = parts[1].strip()
                status = parts[3].strip().lower()

                if status == "lolos":
                    data[id_nrp] = nama

        if nrp in data:
            return {
                "nrp": nrp,
                "lolos": True,
                "nama": data[nrp]
            }

        return {
            "nrp": nrp,
            "lolos": False,
            "nama": None
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
