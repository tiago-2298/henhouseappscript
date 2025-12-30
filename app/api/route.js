import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= DONNÉES HEN HOUSE (On les garde pour plus tard) =================
const APP_VERSION = '2025.01.01';

// ================= ROUTEUR API =================
export async function POST(request) {
  try {
    // 1. On nettoie la Clé Privée (La correction critique)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    // 2. Authentification Google
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // 3. Récupération des employés depuis Google Sheets
    // On lit les colonnes A et B de la ligne 2 à 100
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'B1:B', 
    });

    const rows = response.data.values;

    // Si vide
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    // 4. Formatage des données
    const employees = rows.map((row) => ({
      nom: row[0] || '',      // Colonne A (Nom)
      prenom: row[1] || '',   // Colonne B (Prénom)
    }));

    // 5. On renvoie la liste au site
    return NextResponse.json(employees);

  } catch (error) {
    console.error('Erreur API Route:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des données', details: error.message },
      { status: 500 }
    );
  }
}

