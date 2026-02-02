function doGet(e) {
  const CURRICULUM_SS_ID = "1nbaaeUrlCb_BUJwdVKovwNy0RGmkspYOfzK9CZLy7cM";
  const TEACHER_SS_ID = "1RrV7WjI6ksrZXYHMU6AN8ZduLM161E9p3MZ5H6BcxJA"; // Sheet Kakak Pengajar

  const action = e.parameter.action;

  try {
    // === 1. LOGIN ACTION ===
    if (action === "login") {
      const email = e.parameter.email;
      if (!email) throw new Error("Email is required");

      // 0. Hardcoded Admin Bypass
      if (email === "kalananti-admin") {
        return responseJSON({ success: true, name: "Acops Team" });
      }

      const ss = SpreadsheetApp.openById(TEACHER_SS_ID);
      const sheet = ss.getSheetByName("Form Responses 1");
      const data = sheet.getDataRange().getValues();

      // Cari email di Kolom D (Index 3), Ambil nama di Kolom C (Index 2)
      // Skip header (row 0)
      let teacherName = null;
      for (let i = 1; i < data.length; i++) {
        const rowName = data[i][2]; // Column C
        const rowEmail = data[i][3]; // Column D

        if (
          rowEmail &&
          rowEmail.toString().trim().toLowerCase() ===
            email.toString().trim().toLowerCase()
        ) {
          teacherName = rowName;
          break;
        }
      }

      if (teacherName) {
        return responseJSON({ success: true, name: teacherName });
      } else {
        return responseJSON({
          success: false,
          message: "Email tidak ditemukan. Silahkan hubungi Team Academic.",
        });
      }
    }

    // === 2. DEFAULT: FETCH CURRICULUM DATA ===
    const ss = SpreadsheetApp.openById(CURRICULUM_SS_ID);
    const sheet = ss.getSheetByName("Master_Web_Data");
    const fullData = sheet.getDataRange().getValues();

    // AMBIL BARIS KE-2 SEBAGAI HEADER (Index 1)
    const headers = fullData[1];

    // AMBIL DATA MULAI BARIS KE-3 (Index 2)
    const rows = fullData.slice(2);

    const jsonOutput = rows.map((row) => {
      let obj = {};
      headers.forEach((header, i) => {
        if (!header) return; // Lewati jika header kosong

        let value = row[i];
        let key = header.toString().trim().toLowerCase();

        // Otomatis ubah link Google ke /preview
        if (typeof value === "string" && value.includes("docs.google.com")) {
          value = value.replace(/\/edit.*$/, "/preview");
        }
        obj[key] = value;
      });
      return obj;
    });

    return responseJSON(jsonOutput);
  } catch (err) {
    return responseJSON({ error: err.message });
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
