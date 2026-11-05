/**
 * A_Lib_Database.gs
 * Wrapper database pusat untuk semua unit
 */
const DB = {
    // Ambil Master Siswa (Cached)
    getAllSiswa: function () {
        // Cache dinonaktifkan sementara untuk debugging
        // const cache = CacheService.getScriptCache();
        // const cachedData = cache.get("ALL_SISWA");
        // if (cachedData) return JSON.parse(cachedData);

        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.SISWA);
        if (!sheet) {
            console.error("Sheet " + CONFIG.SHEET_NAME.SISWA + " tidak ditemukan.");
            return [];
        }
        const data = sheet.getDataRange().getValues();
        console.log("DB.getAllSiswa - Raw Data Rows:", data.length);
        const result = Utils.sheetParamsToObjects(data);
        console.log("DB.getAllSiswa - Processed Object Count:", result.length);
        return result;
    },

    // Ambil Data Mapel
    getAllMapel: function () {
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.MAPEL);
        if (!sheet) return [];
        return Utils.sheetParamsToObjects(sheet.getDataRange().getValues());
    }
};
