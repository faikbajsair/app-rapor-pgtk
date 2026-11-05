/**
 * A_Service_Export.gs
 * Ekspor Rapor ke Docx (Word)
 */
const ExportService = {

    /**
     * Menghasilkan file Docx dari template Google Doc
     * (Membutuhkan ID Template Google Doc)
     */
    generateDocx: function (data) {
        // 1. Ambil ID Template (Simulasi)
        // const TEMPLATE_ID = 'ID_TEMPLATE_GOOGLE_DOC';

        // 2. Buat Copy Template
        // const copy = DriveApp.getFileById(TEMPLATE_ID).makeCopy('Rapor_' + data.nama);
        // const doc = DocumentApp.openById(copy.getId());
        // const body = doc.getBody();

        // 3. Replace Placeholder {{nama}}, {{nis}}, dll
        // body.replaceText('{{nama}}', data.nama);
        // ...

        // 4. Save & Close
        // doc.saveAndClose();

        // 5. Kembalikan URL Download sebagai Docx
        // return copy.getDownloadUrl().replace('?format=pdf', '?format=docx');

        return "https://docs.google.com/document/d/EXAMPLE/export?format=docx";
    }
};
