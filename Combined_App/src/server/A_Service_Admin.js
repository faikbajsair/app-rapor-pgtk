/**
 * A_Service_Admin.gs
 * Manajemen data Guru dan Siswa (CRUD + Bulk)
 */
const AdminService = {

    // --- GURU ---

    saveGuru: function (data) {
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.GURU);
        if (!sheet) throw "Sheet DATA_Guru tidak ditemukan.";
        const rows = sheet.getDataRange().getValues();
        const id = String(data.email_kantor || "").trim().toLowerCase();

        let targetRow = -1;
        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][0] || "").trim().toLowerCase() === id) { targetRow = i + 1; break; }
        }

        const rowData = [
            String(data.email_kantor || "").trim(),
            String(data.password || "").trim(),
            String(data.nama || "").trim(),
            String(data.role || "").trim(),
            String(data.unit || "").trim()
        ];
        if (targetRow !== -1) {
            sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
        } else {
            sheet.appendRow(rowData);
        }
        return true;
    },

    deleteGuru: function (email) {
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.GURU);
        if (!sheet) throw "Sheet DATA_Guru tidak ditemukan.";
        const rows = sheet.getDataRange().getValues();
        const id = String(email || "").trim().toLowerCase();

        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][0] || "").trim().toLowerCase() === id) {
                sheet.deleteRow(i + 1);
                return true;
            }
        }
        throw "Guru dengan email " + id + " tidak ditemukan.";
    },

    getAllGuru: function () {
        const sheet = getSpreadsheet().getSheetByName(CONFIG.SHEET_NAME.GURU);
        if (!sheet) return [];
        return Utils.sheetParamsToObjects(sheet.getDataRange().getValues());
    },

    // --- SISWA ---

    saveSiswa: function (data) {
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.SISWA);
        if (!sheet) throw "Sheet DATA_Siswa tidak ditemukan.";
        const rows = sheet.getDataRange().getValues();
        const id = String(data.nis || "").trim();

        let targetRow = -1;
        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][0] || "").trim() === id) { targetRow = i + 1; break; }
        }

        const rowData = [
            String(data.nis || "").trim(),
            String(data.nisn || "").trim(),
            String(data.nama_lengkap || "").trim(),
            String(data.kelas_id || "").trim(),
            String(data.jenis_kelamin || "").trim(),
            String(data.tempat_lahir || "").trim(),
            String(data.tanggal_lahir || "").trim(),
            String(data.nama_ayah || "").trim(),
            String(data.password_wali || "").trim(),
            String(data.wali_kelas || "").trim()
        ];
        if (targetRow !== -1) {
            sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
        } else {
            sheet.appendRow(rowData);
        }
        return true;
    },

    deleteSiswa: function (nis) {
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.SISWA);
        if (!sheet) throw "Sheet DATA_Siswa tidak ditemukan.";
        const rows = sheet.getDataRange().getValues();
        const id = String(nis || "").trim();

        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][0] || "").trim() === id) {
                sheet.deleteRow(i + 1);
                return true;
            }
        }
        throw "Siswa dengan NIS " + id + " tidak ditemukan.";
    },

    // --- BULK UPLOAD ---

    processBulkCSV: function (type, csvString) {
        if (!csvString || !csvString.trim()) throw "Data CSV kosong.";

        // Detect delimiter (comma vs semicolon)
        let delimiter = ',';
        const lines = csvString.split('\n');
        const firstLine = lines[0] || '';
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semiCount = (firstLine.match(/;/g) || []).length;
        if (semiCount > commaCount) {
            delimiter = ';';
        }

        const data = Utilities.parseCsv(csvString, delimiter);
        if (data.length < 1) throw "CSV tidak memiliki data.";

        // Normalisasi header baris pertama
        const firstRow = data[0].map(h => String(h || "").trim().toLowerCase().replace(/\s+/g, "_"));
        let hasHeader = false;
        let mapping = {};

        if (type === 'GURU') {
            const requiredHeaders = ['email_kantor', 'password', 'nama', 'role', 'unit'];
            hasHeader = requiredHeaders.some(h => firstRow.includes(h));

            if (hasHeader) {
                requiredHeaders.forEach(h => {
                    mapping[h] = firstRow.indexOf(h);
                });
            } else {
                mapping = { email_kantor: 0, password: 1, nama: 2, role: 3, unit: 4 };
            }

            const rowsToProcess = hasHeader ? data.slice(1) : data;
            let successCount = 0;
            rowsToProcess.forEach(row => {
                const email = mapping.email_kantor !== -1 && row[mapping.email_kantor] !== undefined ? row[mapping.email_kantor] : "";
                if (email && String(email).trim()) {
                    this.saveGuru({
                        email_kantor: String(email).trim(),
                        password: mapping.password !== -1 && row[mapping.password] !== undefined ? String(row[mapping.password]).trim() : "",
                        nama: mapping.nama !== -1 && row[mapping.nama] !== undefined ? String(row[mapping.nama]).trim() : "",
                        role: mapping.role !== -1 && row[mapping.role] !== undefined ? String(row[mapping.role]).trim() : "",
                        unit: mapping.unit !== -1 && row[mapping.unit] !== undefined ? String(row[mapping.unit]).trim() : ""
                    });
                    successCount++;
                }
            });
            return `Berhasil mengunggah ${successCount} Guru.`;

        } else if (type === 'SISWA') {
            const columnAliases = {
                nis: ['nis', 'nomor_induk_siswa', 'no_induk', 'nis_siswa'],
                nisn: ['nisn', 'nomor_induk_siswa_nasional'],
                nama_lengkap: ['nama_lengkap', 'nama', 'nama_siswa', 'nama_lengkap_siswa'],
                kelas_id: ['kelas_id', 'kelas', 'kelas_id_(contoh:_tka)', 'id_kelas'],
                jenis_kelamin: ['jenis_kelamin', 'l/p', 'jenis_kelamin_(l/p)', 'jk', 'gender'],
                tempat_lahir: ['tempat_lahir', 'tempat_lahir_siswa', 'tempat', 'tempatlahir'],
                tanggal_lahir: ['tanggal_lahir', 'tgl_lahir', 'tanggal_lahir_siswa', 'tanggal', 'tgllahir'],
                nama_ayah: ['nama_ayah', 'ayah', 'nama_orang_tua', 'nama_ibu'],
                password_wali: ['password_wali', 'pass_wali', 'password_orang_tua', 'password', 'pass', 'password_wali_murid', 'passwali'],
                wali_kelas: ['wali_kelas', 'wali', 'guru', 'guru_wali', 'nama_guru', 'homeroom_teacher', 'guru_kelas', 'wali_murid_kelas']
            };

            // Harus ada minimal 3 kolom yang cocok agar dianggap sebagai header (menghindari salah deteksi data sebagai header)
            let matchCount = 0;
            firstRow.forEach(col => {
                const normalized = String(col || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
                const matched = Object.values(columnAliases).some(aliases => 
                    aliases.some(alias => alias.replace(/[^a-z0-9]/g, "") === normalized)
                );
                if (matched) matchCount++;
            });
            hasHeader = matchCount >= 3;

            if (hasHeader) {
                Object.keys(columnAliases).forEach(field => {
                    const aliases = columnAliases[field];
                    mapping[field] = firstRow.findIndex(col => {
                        const normalized = String(col || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
                        return aliases.some(alias => alias.replace(/[^a-z0-9]/g, "") === normalized);
                    });
                });
            } else {
                mapping = {
                    nis: 0,
                    nisn: 1,
                    nama_lengkap: 2,
                    kelas_id: 3,
                    jenis_kelamin: 4,
                    tempat_lahir: 5,
                    tanggal_lahir: 6,
                    nama_ayah: 7,
                    password_wali: 8,
                    wali_kelas: 9
                };
            }

            const rowsToProcess = hasHeader ? data.slice(1) : data;
            let successCount = 0;
            rowsToProcess.forEach(row => {
                const nisVal = mapping.nis !== -1 && row[mapping.nis] !== undefined ? String(row[mapping.nis]).trim() : "";
                if (nisVal) {
                    this.saveSiswa({
                        nis: nisVal,
                        nisn: mapping.nisn !== -1 && row[mapping.nisn] !== undefined ? String(row[mapping.nisn]).trim() : "",
                        nama_lengkap: mapping.nama_lengkap !== -1 && row[mapping.nama_lengkap] !== undefined ? String(row[mapping.nama_lengkap]).trim() : "",
                        kelas_id: mapping.kelas_id !== -1 && row[mapping.kelas_id] !== undefined ? String(row[mapping.kelas_id]).trim() : "",
                        jenis_kelamin: mapping.jenis_kelamin !== -1 && row[mapping.jenis_kelamin] !== undefined ? String(row[mapping.jenis_kelamin]).trim() : "",
                        tempat_lahir: mapping.tempat_lahir !== -1 && row[mapping.tempat_lahir] !== undefined ? String(row[mapping.tempat_lahir]).trim() : "",
                        tanggal_lahir: mapping.tanggal_lahir !== -1 && row[mapping.tanggal_lahir] !== undefined ? String(row[mapping.tanggal_lahir]).trim() : "",
                        nama_ayah: mapping.nama_ayah !== -1 && row[mapping.nama_ayah] !== undefined ? String(row[mapping.nama_ayah]).trim() : "",
                        password_wali: mapping.password_wali !== -1 && row[mapping.password_wali] !== undefined ? String(row[mapping.password_wali]).trim() : "",
                        wali_kelas: mapping.wali_kelas !== -1 && row[mapping.wali_kelas] !== undefined ? String(row[mapping.wali_kelas]).trim() : ""
                    });
                    successCount++;
                }
            });
            return `Berhasil mengunggah ${successCount} Siswa.`;
        }
        throw "Tipe upload tidak dikenal.";
    }
};
