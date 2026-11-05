/**
 * A_Config.gs
 * KONFIGURASI UTAMA (Shared)
 */
const CONFIG = {
    SPREADSHEET_ID: '', // Dikosongkan agar otomatis menggunakan Active Spreadsheet jika bound script

    SHEET_NAME: {
        CONFIG: 'CONF_Sekolah',
        SISWA: 'DATA_Siswa',
        KELAS: 'DATA_Kelas',
        MAPEL: 'DATA_Mapel',
        NILAI_AKADEMIK: 'NILAI_Akademik',
        TK_MASTER_IKTP: 'TK_Master_IKTP',
        TK_OBSERVASI: 'TK_Observasi',
        TK_NARASI: 'TK_Narasi_Rapor',
        GURU: 'DATA_Guru',
        NILAI_EKSKUL: 'NILAI_Ekskul',
        NILAI_SIKAP: 'NILAI_Sikap',
        TK_NILAI_CHECKLIST: 'TK_Nilai_Checklist'
    },

    APP: {
        NAME: 'Rapor PG-TK Al-Imam',
        VERSION: '2.0.0',
        DEV_MODE: true
    }
};

function getSpreadsheet() {
    try {
        // 1. Coba ambil dari Script Properties (Environment Variable di GAS) agar tidak ter-overwrite saat copy-paste
        let id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
        
        // 2. Jika tidak ada di Script Properties, gunakan dari CONFIG.SPREADSHEET_ID
        if (!id) {
            id = CONFIG.SPREADSHEET_ID;
        }

        // 3. Jika ID kosong, coba ambil Active Spreadsheet (jika script bound/terikat ke Sheet)
        if (!id || id.trim() === '') {
            const activeSS = SpreadsheetApp.getActiveSpreadsheet();
            if (activeSS) return activeSS;
            throw "ID Spreadsheet belum diatur di Script Properties atau A_Config.gs, dan Script tidak terikat ke Spreadsheet.";
        }
        return SpreadsheetApp.openById(id);
    } catch (e) {
        throw "Error Spreadsheet: " + e.toString();
    }
}
