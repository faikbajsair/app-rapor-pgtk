/**
 * A_Service_Auth.gs
 * Manajemen Login
 */
const AuthService = {
    login: function (identifier, password) {
        const id = String(identifier || "").trim();
        const pass = String(password || "").trim();
        const isEmail = id.toLowerCase().includes('@alimamischool.com');

        if (isEmail) {
            // LOGIN GURU / ADMIN
            const allGuru = AdminService.getAllGuru() || [];
            const user = allGuru.find(u =>
                String(u.email_kantor || "").trim().toLowerCase() === id.toLowerCase() &&
                String(u.password || "").trim() === pass
            );

            if (user) {
                return {
                    status: true,
                    loginType: 'GURU_STAFF',
                    username: user.email_kantor,
                    nama: user.nama,
                    role: user.role, // 'Admin' / 'Guru'
                    unit: user.unit
                };
            }
        } else {
            // LOGIN WALI MURID (Identifier = NIS)
            const allSiswa = DB.getAllSiswa() || [];
            const student = allSiswa.find(s =>
                String(s.nis || "").trim() === id &&
                String(s.password_wali || "").trim() === pass
            );

            if (student) {
                return {
                    status: true,
                    loginType: 'WALI_MURID',
                    nis: student.nis,
                    nama: student.nama_lengkap,
                    role: 'WALI',
                    unit: 'TK'
                };
            }
        }

        return { status: false, message: "Kredensial atau Password salah (Cek Sheet DATA_Guru / DATA_Siswa)" };
    }
};
