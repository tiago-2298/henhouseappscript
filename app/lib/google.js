import { google } from 'googleapis';

export async function getSheetData() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Identifiants Google manquants dans .env.local");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId: process.env.SPREADSHEET_ID };
}

// Récupère la liste des employés depuis l'onglet "Employés" colonne B (Nom&Prénom)
export async function getEmployees() {
  try {
    const { sheets, spreadsheetId } = await getSheetData();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Employés'!B2:B", // On lit la colonne B à partir de la ligne 2
    });
    // On aplatit le tableau [[Nom1], [Nom2]] vers [Nom1, Nom2]
    return response.data.values ? response.data.values.flat().filter(Boolean) : [];
  } catch (e) {
    console.error("Erreur Google Sheets:", e);
    return []; // Retourne une liste vide si erreur (évite le crash)
  }
}