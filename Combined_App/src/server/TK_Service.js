const TK_Service = {
    getIKTP: function (elemen) {
        try {
            const ss = getSpreadsheet();
            const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.TK_MASTER_IKTP);
            if (!sheet) {
                console.warn("Sheet TK_Master_IKTP tidak ditemukan.");
                return [];
            }

            // Self-healing check for Kokurikuler / Dimensi Profil Lulusan
            const values = sheet.getDataRange().getValues();
            const hasKokurikuler = values.some(row => {
                const rowElemen = String(row[1] || "").trim().toLowerCase();
                return rowElemen === "kokurikuler / dimensi profil lulusan" || rowElemen === "kokurikuler" || rowElemen === "dimensi profil lulusan";
            });

            if (!hasKokurikuler) {
                const defaultKokurikuler = [
                    ["IKTP_KOKUR_001", "Kokurikuler / Dimensi Profil Lulusan", "", "Keimanan dan Ketaqwaan terhadap Tuhan yang Maha Esa"],
                    ["IKTP_KOKUR_002", "Kokurikuler / Dimensi Profil Lulusan", "", "Kewarganegaraan"],
                    ["IKTP_KOKUR_003", "Kokurikuler / Dimensi Profil Lulusan", "", "Penalaran Kritis"],
                    ["IKTP_KOKUR_004", "Kokurikuler / Dimensi Profil Lulusan", "", "Kreatifitas"],
                    ["IKTP_KOKUR_005", "Kokurikuler / Dimensi Profil Lulusan", "", "Kolaborasi"],
                    ["IKTP_KOKUR_006", "Kokurikuler / Dimensi Profil Lulusan", "", "Kemandirian"],
                    ["IKTP_KOKUR_007", "Kokurikuler / Dimensi Profil Lulusan", "", "Kesehatan"],
                    ["IKTP_KOKUR_008", "Kokurikuler / Dimensi Profil Lulusan", "", "Komunikasi"]
                ];
                defaultKokurikuler.forEach(row => {
                    sheet.appendRow(row);
                });
                console.log("Automatically added default Kokurikuler dimensions to TK_Master_IKTP sheet");
            }

            const data = Utils.sheetParamsToObjects(sheet.getDataRange().getValues());
            return elemen ? data.filter(i => {
                const itemElemen = String(i.elemen || i.kategori || i.category || "").trim().toLowerCase();
                const searchElemen = String(elemen).trim().toLowerCase();
                return itemElemen === searchElemen;
            }) : data;
        } catch (e) {
            console.error("Error getIKTP: " + e.toString());
            return [];
        }
    },

    saveObservasi: function (data) {
        // data: { nis, tanggal, list_iktp (JSON), catatan_anekdot }
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.TK_OBSERVASI);
        const idObs = `${data.nis}_${data.tanggal.replace(/\//g, '')}`;

        sheet.appendRow([idObs, data.nis, data.tanggal, JSON.stringify(data.list_iktp), data.catatan_anekdot]);
        return true;
    },

    saveNarasi: function (data) {
        // data: { nis, semester, elemen, teks_narasi, foto_url }
        const ss = getSpreadsheet();
        const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.TK_NARASI);
        const rows = sheet.getDataRange().getValues();
        const idNarasi = `${data.nis}_${data.semester}_${data.elemen.replace(/\s+/g, '_')}`;

        let targetRow = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === idNarasi) { targetRow = i + 1; break; }
        }

        const rowData = [idNarasi, data.nis, data.semester, data.elemen, data.teks_narasi, data.foto_url];
        if (targetRow !== -1) {
            sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
        } else {
            sheet.appendRow(rowData);
        }
        return true;
    },

    checkOrCreateChecklistSheet: function () {
        const ss = getSpreadsheet();
        let sheet = ss.getSheetByName(CONFIG.SHEET_NAME.TK_NILAI_CHECKLIST);
        if (!sheet) {
            sheet = ss.insertSheet(CONFIG.SHEET_NAME.TK_NILAI_CHECKLIST);
            sheet.appendRow(['id_nilai', 'nis', 'semester', 'category', 'id_iktp', 'nilai']);
        }
        return sheet;
    },

    saveChecklist: function (data) {
        const sheet = this.checkOrCreateChecklistSheet();
        const rows = sheet.getDataRange().getValues();
        const nis = data.nis;
        const semester = data.semester;
        const category = data.category;
        const ratings = data.ratings;

        const existingRows = {};
        for (let i = 1; i < rows.length; i++) {
            const idNilai = rows[i][0];
            existingRows[idNilai] = i + 1;
        }

        Object.keys(ratings).forEach(idIktp => {
            const val = ratings[idIktp];
            const idNilai = `${nis}_${semester}_${idIktp}`;
            const rowData = [idNilai, nis, semester, category, idIktp, val];
            
            if (existingRows[idNilai]) {
                sheet.getRange(existingRows[idNilai], 1, 1, rowData.length).setValues([rowData]);
            } else {
                sheet.appendRow(rowData);
            }
        });
        return true;
    },

    getChecklist: function (nis, semester) {
        const sheet = this.checkOrCreateChecklistSheet();
        const data = Utils.sheetParamsToObjects(sheet.getDataRange().getValues());
        return data.filter(d => String(d.nis).trim() === String(nis).trim() && String(d.semester).trim() === String(semester).trim());
    },

    getReport: function (nis, sem) {
        const ss = getSpreadsheet();

        // 1. Get Observasi
        const sheetO = ss.getSheetByName(CONFIG.SHEET_NAME.TK_OBSERVASI);
        const obs = Utils.sheetParamsToObjects(sheetO.getDataRange().getValues()).filter(o => String(o.nis).trim() === String(nis).trim());

        // 2. Get Narasi
        const sheetN = ss.getSheetByName(CONFIG.SHEET_NAME.TK_NARASI);
        const narasi = Utils.sheetParamsToObjects(sheetN.getDataRange().getValues()).filter(n => String(n.nis).trim() === String(nis).trim() && String(n.semester).trim() === String(sem).trim());

        // 3. Get IKTP info for lookup
        const iktp = this.getIKTP();

        // 4. Get Checklist
        const checklist = this.getChecklist(nis, sem);

        return {
            observasi: obs,
            narasi: narasi,
            iktp: iktp,
            checklist: checklist
        };
    },

    getDashboardData: function () {
        try {
            const allSiswa = DB.getAllSiswa() || [];
            let pgCount = 0;
            let tkaCount = 0;
            let tkbCount = 0;
            
            allSiswa.forEach(s => {
                const k = String(s.kelas_id || "").toUpperCase();
                if (k.includes("PLAYGROUP") || k.includes("PG")) {
                    pgCount++;
                } else if (k.includes("TK A") || k.includes("TKA")) {
                    tkaCount++;
                } else if (k.includes("TK B") || k.includes("TKB")) {
                    tkbCount++;
                }
            });
            
            let ratingCounts = { BB: 0, MB: 0, BSH: 0, BSB: 0, NI: 0, G: 0, E: 0 };
            const ss = getSpreadsheet();
            const sheet = ss.getSheetByName(CONFIG.SHEET_NAME.TK_NILAI_CHECKLIST);
            if (sheet) {
                const values = sheet.getDataRange().getValues();
                if (values.length > 1) {
                    const checklistData = Utils.sheetParamsToObjects(values);
                    checklistData.forEach(row => {
                        const val = String(row.nilai || "").toUpperCase().trim();
                        if (ratingCounts[val] !== undefined) {
                            ratingCounts[val]++;
                        }
                    });
                }
            }
            
            return {
                totalSiswa: allSiswa.length,
                levelCounts: {
                    "Playgroup": pgCount,
                    "TK A": tkaCount,
                    "TK B": tkbCount
                },
                ratingCounts: ratingCounts
            };
        } catch (e) {
            console.error("Error getDashboardData: " + e.toString());
            return {
                totalSiswa: 0,
                levelCounts: { "Playgroup": 0, "TK A": 0, "TK B": 0 },
                ratingCounts: { BB: 0, MB: 0, BSH: 0, BSB: 0, NI: 0, G: 0, E: 0 }
            };
        }
    },

    uploadFile: function (base64Data, fileName) {
        try {
            const folderName = "Rapor PG-TK Foto Kegiatan";
            let folder;
            const folders = DriveApp.getFoldersByName(folderName);
            if (folders.hasNext()) {
                folder = folders.next();
            } else {
                folder = DriveApp.createFolder(folderName);
            }
            
            const byteCharacters = Utilities.base64Decode(base64Data.split(",")[1]);
            const blob = Utilities.newBlob(byteCharacters, "image/png", fileName);
            const file = folder.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            
            const fileId = file.getId();
            const viewUrl = "https://lh3.googleusercontent.com/d/" + fileId;
            
            return { status: true, url: viewUrl };
        } catch (e) {
            console.error("Error uploadFile: " + e.toString());
            return { status: false, message: e.toString() };
        }
    }
};
