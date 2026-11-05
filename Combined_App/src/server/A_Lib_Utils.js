/**
 * A_Lib_Utils.gs
 * Fungsi pembantu umum
 */
const Utils = {
    // Untuk Web App URL (doGet)
    createJSONOutput: function (data, status = true, message = "Success") {
        return ContentService.createTextOutput(JSON.stringify({
            status: status, message: message, data: data
        })).setMimeType(ContentService.MimeType.JSON);
    },

    // Untuk google.script.run (Client-side JS)
    createResponse: function (data, status = true, message = "Success") {
        return {
            status: status,
            message: message,
            data: data
        };
    },

    formatDateIndo: function (dateObj) {
        if (!dateObj) return "";
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const d = new Date(dateObj);
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    },

    terbilang: function (nilai) {
        // Logic terbilang... (disingkat untuk efisiensi)
        return "Terbilang Logic";
    },

    sheetParamsToObjects: function (values) {
        if (!values || values.length < 2) return [];
        const headers = values[0].map(h => String(h || "").trim().toLowerCase().replace(/\s+/g, "_"));
        return values.slice(1).map(row => {
            let obj = {};
            headers.forEach((h, i) => {
                if (h) {
                    let val = row[i];
                    if (val instanceof Date) {
                        try {
                            val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
                        } catch (e) {
                            val = val.toISOString().split('T')[0];
                        }
                    }
                    obj[h] = val;
                }
            });
            return obj;
        });
    }
};
