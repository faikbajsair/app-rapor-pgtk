/**
 * A_Service_AI.gs
 * AI Narrative Generator for Student Reports
 */
const A_Service_AI = {
    generate: function (data) {
        // data: { nama, gender, elemen, list_iktp }
        // list_iktp: [ { indikator, nilai }, ... ]
        
        const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || '';
        
        if (apiKey) {
            try {
                const prompt = `Buatkan narasi laporan capaian perkembangan anak usia dini (PG-TK) dalam bahasa Indonesia sebanyak 1-2 paragraf.
Nama Anak: ${data.nama}
Gender: ${data.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
Elemen Kurikulum: ${data.elemen}
Capaian Indikator Ceklis:
${data.list_iktp.map(i => `- ${i.indikator}: ${i.nilai}`).join('\n')}

Gunakan panggilan 'Ananda ${data.nama}' atau kata ganti 'ia', 'dia', '-nya'. Buatlah kalimat yang memotivasi, hangat, ramah, dan profesional untuk orang tua murid. Deskripsikan apa saja perkembangan yang sudah dicapai dengan baik (skala BSB dan BSH) serta berikan saran perbaikan secara halus untuk indikator yang masih berada di skala BB atau MB.`;

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                const payload = {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                };
                const options = {
                    method: "POST",
                    contentType: "application/json",
                    payload: JSON.stringify(payload),
                    muteHttpExceptions: true
                };
                
                const response = UrlFetchApp.fetch(url, options);
                const json = JSON.parse(response.getContentText());
                if (json.candidates && json.candidates[0].content.parts[0].text) {
                    return json.candidates[0].content.parts[0].text.trim();
                }
            } catch (e) {
                console.error("Gemini API Error, falling back to local generator: " + e.toString());
            }
        }
        
        // Local Fallback Generator
        return this.localGenerate(data);
    },
    
    localGenerate: function (data) {
        const name = data.nama;
        const elemen = data.elemen;
        const list = data.list_iktp || [];
        
        if (list.length === 0) {
            return `Alhamdulillah, Ananda ${name} menunjukkan perkembangan yang baik pada elemen ${elemen}. Selengkapnya akan dibahas saat sesi konsultasi orang tua.`;
        }
        
        const bsb = list.filter(i => i.nilai === 'BSB' || i.nilai === 'E');
        const bsh = list.filter(i => i.nilai === 'BSH' || i.nilai === 'G');
        const mb = list.filter(i => i.nilai === 'MB' || i.nilai === 'NI');
        const bb = list.filter(i => i.nilai === 'BB');
        
        let p1 = `Alhamdulillah, perkembangan Ananda ${name} pada elemen ${elemen} berjalan dengan sangat baik. `;
        if (bsb.length > 0) {
            p1 += `Ananda menunjukkan kemampuan yang sangat matang dalam ${bsb.slice(0, 3).map(i => i.indikator.toLowerCase().replace(/\.$/, '')).join(', ')}. `;
        }
        if (bsh.length > 0) {
            p1 += `Selain itu, ia juga berkembang sesuai harapan dalam hal ${bsh.slice(0, 3).map(i => i.indikator.toLowerCase().replace(/\.$/, '')).join(', ')}. `;
        }
        
        let p2 = "";
        if (mb.length > 0 || bb.length > 0) {
            p2 = `Di beberapa aspek seperti ${[...mb, ...bb].slice(0, 2).map(i => i.indikator.toLowerCase().replace(/\.$/, '')).join(', ')}, Ananda masih memerlukan stimulasi dan bimbingan lebih lanjut baik di sekolah maupun di rumah agar dapat terus berkembang secara optimal.`;
        } else {
            p2 = `Guru sangat mengapresiasi kemandirian dan antusiasme Ananda selama berkegiatan di kelas. Pertahankan prestasimu ya, Ananda!`;
        }
        
        return `${p1}\n\n${p2}`;
    }
};
