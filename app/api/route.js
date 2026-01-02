import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const APP_VERSION = '2026.01.02';

const WEBHOOKS = {
  factures: 'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock: 'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage: 'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses: 'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support: 'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

// --- FONCTIONS SYSTÈME ---
async function getAuthSheets() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const auth = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
    );
    return auth;
}

async function updateEmployeeStats(employeeName, amount, type) {
    const auth = await getAuthSheets();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'B2:B100' });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(r => r[0]?.trim() === employeeName.trim());

    if (rowIndex === -1) return;
    const cell = type === 'CA' ? `G${rowIndex + 2}` : `H${rowIndex + 2}`;
    
    const currentRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: cell });
    const currentVal = Number(currentRes.data.values?.[0]?.[0] || 0);

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: cell,
        valueInputOption: 'RAW',
        requestBody: { values: [[currentVal + Number(amount)]] }
    });
}

export async function POST(request) {
    try {
        const { action, data } = await request.json();
        const auth = await getAuthSheets();
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // 1. MODULE MÉTADONNÉES (Leaderboard / Annuaire)
        if (action === 'getMeta') {
            const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'A2:J100' });
            const rows = res.data.values || [];
            const employees = rows.map(r => ({
                id: r[0], name: r[1], role: r[2], phone: r[3], ca: Number(r[6] || 0), stock: Number(r[7] || 0), salary: Number(r[9] || 0)
            })).filter(e => e.name);

            return NextResponse.json({
                success: true,
                employees,
                leaderboard: [...employees].sort((a,b) => b.ca - a.ca).slice(0,3),
                totalCA: employees.reduce((s, e) => s + e.ca, 0),
                dailyGoal: 50000,
                version: APP_VERSION
            });
        }

        // 2. ACTION : FACTURES (Update CA + Webhook)
        if (action === 'sendFactures') {
            await updateEmployeeStats(data.employee, data.total, 'CA');
            await fetch(WEBHOOKS.factures, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    embeds: [{
                        title: "🛒 Nouvelle Vente",
                        color: 0xff6a2b,
                        fields: [
                            { name: "Vendeur", value: data.employee, inline: true },
                            { name: "Client", value: data.client, inline: true },
                            { name: "Montant", value: `${data.total}$`, inline: true },
                            { name: "Détails", value: data.details }
                        ],
                        timestamp: new Date()
                    }]
                })
            });
        }

        // 3. ACTION : PRODUCTION (Update Stock + Webhook)
        if (action === 'sendProduction') {
            await updateEmployeeStats(data.employee, data.totalItems, 'STOCK');
            await fetch(WEBHOOKS.stock, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    embeds: [{
                        title: "📦 Production Stock",
                        color: 0x3b82f6,
                        fields: [
                            { name: "Employé", value: data.employee },
                            { name: "Items produits", value: data.details }
                        ]
                    }]
                })
            });
        }

        // 4. ACTION : GARAGE
        if (action === 'sendGarage') {
            await fetch(WEBHOOKS.garage, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    embeds: [{
                        title: "🚗 Mouvement Véhicule",
                        fields: [
                            { name: "Employé", value: data.employee },
                            { name: "Véhicule", value: data.vehicle },
                            { name: "Action", value: data.type }
                        ]
                    }]
                })
            });
        }

        // 5. ACTION : ENTREPRISE (Commandes/Partenariats)
        if (action === 'sendEntreprise') {
            const webhookUrl = data.isPartner ? data.partnerWebhook : WEBHOOKS.entreprise;
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    content: data.isPartner ? "🔔 Commande Partenaire" : "🏢 Commande Entreprise",
                    embeds: [{ title: data.title, description: data.details, color: 0x10b981 }]
                })
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
