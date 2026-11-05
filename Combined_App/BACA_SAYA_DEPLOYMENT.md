# FINAL DEPLOYMENT MAP (SINGLE PROJECT)

Pak Faik, ini adalah daftar file final yang harus Bapak buat di **satu project Google Apps Script**. Nama file sudah saya sesuaikan (A untuk Core, Unit untuk Unit) agar tidak ada nama yang sama.

### 1. File Script (.gs)
Di Editor GAS, buatlah file "Script" satu demi satu dengan nama berikut (jangan gunakan ekstensi .js):

| Nama di Editor GAS | Jalur File Lokal (Copy Kodenya) |
| :--- | :--- |
| `Code.gs` | `Combined_App/src/server/Code.js` |
| `A_Config.gs` | `Combined_App/src/server/A_Config.js` |
| `A_Lib_Database.gs` | `Combined_App/src/server/A_Lib_Database.js` |
| `A_Lib_Utils.gs` | `Combined_App/src/server/A_Lib_Utils.js` |
| `A_Service_AI.gs` | `Combined_App/src/server/A_Service_AI.js` |
| `A_Service_Auth.gs` | `Combined_App/src/server/A_Service_Auth.js` |
| `A_Service_Admin.gs` | `Combined_App/src/server/A_Service_Admin.js` |
| `A_Service_Export.gs` | `Combined_App/src/server/A_Service_Export.js` |
| `TK_Service.gs` | `Combined_App/src/server/TK_Service.js` |

### 2. File HTML (.html)
Di Editor GAS, buatlah file "HTML" satu demi satu dengan nama berikut:

| Nama di Editor GAS | Jalur File Lokal (Copy Kodenya) |
| :--- | :--- |
| `index.html` | `Combined_App/src/client/index.html` |
| `UI_Dashboard.html` | `Combined_App/src/client/UI_Dashboard.html` |
| `UI_Style.html` | `Combined_App/src/client/UI_Style.html` |
| `UI_Script.html` | `Combined_App/src/client/UI_Script.html` |
| `UI_Wali_Dashboard.html` | `Combined_App/src/client/UI_Wali_Dashboard.html` |
| `AD_View_Guru.html` | `Combined_App/src/client/AD_View_Guru.html` |
| `AD_View_Siswa.html` | `Combined_App/src/client/AD_View_Siswa.html` |
| `TK_View_Input.html` | `Combined_App/src/client/TK_View_Input.html` |
| `TK_View_Checklist.html` | `Combined_App/src/client/TK_View_Checklist.html` |
| `TK_View_Cetak.html` | `Combined_App/src/client/TK_View_Cetak.html` |

---

---

### ⚙️ Konfigurasi Penting (WAJIB):
1.  Buka file **`A_Config.gs`** di Editor Apps Script.
2.  Cari baris `SPREADSHEET_ID`.
3.  Ganti `'GANTI_DENGAN_ID_SPREADSHEET_BARU_ANDA'` dengan ID Spreadsheet database Bapak.
    *   *Cara ambil ID*: Buka Spreadsheet Bapak, lihat URL-nya. ID adalah kode panjang di antara `/d/` dan `/edit`.
    *   Contoh: `https://docs.google.com/spreadsheets/d/1abc12345/edit` -> ID-nya adalah `1abc12345`.
4.  Jika Script Bapak dibuat langsung dari **Extensions > Apps Script** di dalam Spreadsheet tersebut, maka ID boleh dikosongkan (kode akan otomatis mendeteksi).

### ✅ Catatan Tambahan:
- Semua file lama yang tidak digunakan sudah saya hapus untuk menghindari kebingungan.
- Gunakan folder **`Combined_App`** sebagai satu-satunya sumber pengerjaan Bapak.
- Gunakan file **`FILE RAPOR PG DAN TK`** di dalam folder tersebut sebagai referensi data indikator.
