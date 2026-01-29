export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log("--- DÉBUT DU TEST DE CONNEXION ---");
    
    try {
        // 1. Vérification des variables d'environnement
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        console.log("1. Variables récupérées :");
        console.log("- Email :", clientEmail ? "OK" : "MANQUANT");
        console.log("- ID du Sheet :", sheetId ? "OK" : "MANQUANT");
        console.log("- Clé Privée :", privateKey ? "PRÉSENTE" : "MANQUANTE");

        if (!privateKey || !clientEmail || !sheetId) {
            throw new Error("Une ou plusieurs variables d'environnement sont manquantes sur Vercel.");
        }

        // 2. Tentative d'initialisation du jeton JWT
        console.log("2. Tentative de création du jeton JWT...");
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT(
            clientEmail,
            null,
            formattedKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        console.log("   -> Jeton JWT créé.");

        // 3. Appel à l'API Google Sheets
        console.log("3. Connexion à Google Sheets (Appel API)...");
        const sheets = google.sheets({ version: 'v4', auth });
        
        // On demande juste les propriétés du document pour tester l'accès
        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId
        });

        const title = response.data.properties.title;
        console.log("4. SUCCÈS TOTAL ! Connecté au document :", title);

        return NextResponse.json({ 
            success: true, 
            step: "Final",
            message: "La connexion fonctionne parfaitement avec le document : " + title 
        });

    } catch (err) {
        console.error("--- ERREUR DÉTECTÉE ---");
        console.error("Message :", err.message);
        
        // Analyse spécifique de l'erreur
        let diagnostic = "Erreur inconnue";
        if (err.message.includes("invalid_grant")) diagnostic = "La clé privée est incorrecte ou le compte de service est désactivé.";
        if (err.message.includes("ENOTFOUND")) diagnostic = "Problème de réseau (DNS) - Le serveur ne peut pas contacter Google.";
        if (err.message.includes("403")) diagnostic = "Le compte de service n'a pas l'autorisation. AS-TU PARTAGÉ LE SHEET AVEC L'EMAIL DU COMPTE DE SERVICE ?";
        if (err.message.includes("404")) diagnostic = "L'ID du Sheet est incorrect.";

        return NextResponse.json({ 
            success: false, 
            error: err.message,
            diagnostic: diagnostic
        }, { status: 500 });
    }
}
