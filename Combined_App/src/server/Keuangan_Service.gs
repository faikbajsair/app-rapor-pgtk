/**
 * Keuangan_Service.gs
 * Menangani pengambilan data tunggakan dari Spreadsheet Eksternal
 */
const Keuangan_Service = {
  EXTERNAL_SS_ID: '18cGngVX-Ur0pgd97bQ3cPuJIu4fjPack_F1A-Cy7mHI',
  
  /**
   * Mengambil data tagihan/tunggakan berdasarkan NIS
   * @param {string} nis
   * @return {Object} Data tagihan
   */
  getBillingData: function(nis) {
    try {
      const ss = SpreadsheetApp.openById(this.EXTERNAL_SS_ID);
      const sheet = ss.getSheetByName('Siswa'); // Menggunakan sheet 'Siswa' sesuai permintaan
      if (!sheet) throw new Error("Sheet 'Siswa' tidak ditemukan di spreadsheet eksternal.");
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return { hasData: false, summary: "Sheet 'Siswa' kosong atau hanya header.", details: [] };
      }
      const headers = data[0];
      const rows = data.slice(1);
      
      // Cari index kolom berdasarkan header
      const idx = {
        nis: headers.indexOf('NIS'),
        sppTerakhir: headers.indexOf('SPP_Terakhir_Dibayar'),
        sisaUP: headers.indexOf('Sisa_UP'),
        sisaDU: headers.indexOf('Sisa_DU')
      };

      if (idx.nis === -1) {
        return { hasData: false, error: "Kolom 'NIS' tidak ditemukan di spreadsheet eksternal.", summary: "Struktur data tidak sesuai" };
      }

      const billingRow = rows.find(r => r[idx.nis] && r[idx.nis].toString() === nis.toString());
      
      if (!billingRow) {
        return { hasData: false, summary: "Data keuangan siswa tidak ditemukan.", details: [] };
      }

      let details = [];
      let totalAmount = 0;

      // 1. Tagihan SPP
      if (idx.sppTerakhir !== -1) {
        const terakhir = billingRow[idx.sppTerakhir];
        let blnNext = "Belum terdata";
        if (terakhir) {
          const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
          const currIdx = months.indexOf(terakhir);
          blnNext = (currIdx !== -1) ? months[(currIdx + 1) % 12] : "Cek Manual";
        }
        details.push({ item: `Tagihan SPP (Next: ${blnNext})`, amount: 0, status: "Pending" });
      }

      // 2. Tagihan UP
      if (idx.sisaUP !== -1 && !isNaN(billingRow[idx.sisaUP]) && billingRow[idx.sisaUP] > 0) {
        const val = Number(billingRow[idx.sisaUP]);
        details.push({ item: "Sisa Tagihan UP", amount: val });
        totalAmount += val;
      }

      // 3. Tagihan DU
      if (idx.sisaDU !== -1 && !isNaN(billingRow[idx.sisaDU]) && billingRow[idx.sisaDU] > 0) {
        const val = Number(billingRow[idx.sisaDU]);
        details.push({ item: "Sisa Tagihan DU", amount: val });
        totalAmount += val;
      }

      return {
        hasData: details.length > 0,
        summary: totalAmount > 0 ? `Total Tunggakan: Rp ${totalAmount.toLocaleString('id-ID')}` : "Tidak ada tunggakan pembayaran",
        total: totalAmount,
        details: details
      };
      
    } catch (e) {
      const msg = e.message.toLowerCase();
      let friendlyMsg = "Gagal memuat data keuangan";
      if (msg.includes("permission") || msg.includes("izin")) {
          friendlyMsg = "Akses Ditolak: Pastikan email Anda sudah diberikan izin akses 'Viewer' ke Spreadsheet Keuangan.";
      }
      return { hasData: false, error: e.message, summary: friendlyMsg };
    }
  }
};
