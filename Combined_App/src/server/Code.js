/**
 * Code.gs
 * Entry point tunggal untuk 3 unit
 */
function doGet(e) {
    const template = HtmlService.createTemplateFromFile('index');
    return template.evaluate()
        .setTitle(CONFIG.APP.NAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * BRIDGE API (DIPANGGIL DARI CLIENT)
 */
function apiCall(method, payload) {
    try {
        const data = payload ? JSON.parse(payload) : null;

        // Router Sederhana
        switch (method) {
            case 'getDashboard': return Utils.createResponse(TK_Service.getDashboardData());
            case 'getIKTP': return Utils.createResponse(TK_Service.getIKTP(data ? data.elemen : null));
            case 'genAI': return Utils.createResponse(A_Service_AI.generate(data));
            case 'saveTK': return Utils.createResponse(TK_Service.saveNarasi(data));
            case 'saveTK_Obs': return Utils.createResponse(TK_Service.saveObservasi(data));
            case 'saveTK_Checklist': return Utils.createResponse(TK_Service.saveChecklist(data));
            case 'getTK_Checklist': return Utils.createResponse(TK_Service.getChecklist(data.nis, data.semester));

            case 'getReportTK': return Utils.createResponse(TK_Service.getReport(data.nis, data.semester));

            // ADMIN & AUTH
            case 'login': return Utils.createResponse(AuthService.login(data.username, data.password));
            case 'getGuru': return Utils.createResponse(AdminService.getAllGuru());
            case 'saveGuru': return Utils.createResponse(AdminService.saveGuru(data));
            case 'deleteGuru': return Utils.createResponse(AdminService.deleteGuru(data.email));
            case 'getSiswa': return Utils.createResponse(DB.getAllSiswa());
            case 'saveSiswa': return Utils.createResponse(AdminService.saveSiswa(data));
            case 'deleteSiswa': return Utils.createResponse(AdminService.deleteSiswa(data.nis));
            case 'bulkUpload': return Utils.createResponse(AdminService.processBulkCSV(data.type, data.csv));

            // EXPORT
            case 'exportDocx': return Utils.createResponse(ExportService.generateDocx(data));
            case 'uploadFile': return Utils.createResponse(TK_Service.uploadFile(data.base64, data.fileName));

            default: throw "Method NOT FOUND";
        }
    } catch (err) {
        return Utils.createResponse(null, false, err.toString());
    }
}
