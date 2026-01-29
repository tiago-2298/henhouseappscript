export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const APP_VERSION = '2026.01.29';
const CURRENCY = { symbol: '$', code: 'USD' };

const PRODUCTS_CAT = {
    plats_principaux: ['Boeuf bourguignon','Saumon Grillé','Quiche aux légumes','Crousti-Douce','Wings épicé','Filet Mignon','Poulet Rôti','Paella Méditerranéenne','Ribbs',"Steak 'Potatoes",'Rougail Saucisse'],
    desserts: ['Brochettes de fruits frais','Mousse au café','Tiramisu Fraise','Los Churros Caramel','Tourte Myrtille'],
    boissons: ['Café','Jus de raisin rouge','Cidre Pression','Berry Fizz',"Jus d'orange",'Jus de raisin blanc','Agua Fresca Pasteque','Vin rouge chaud',"Lait de poule",'Cappuccino','Bière','Lutinade'],
    menus: ['Menu Le Nid Végé','Menu Grillé du Nord','Menu Fraîcheur Méditerranéenne',"Menu Flamme d OR",'Menu Voyage Sucré-Salé','Menu Happy Hen House'],
    alcools: ['Cocktail Citron-Myrtille','Verre de Bellini','Verre de Vodka','Verre de Rhum','Verre de Cognac','Verre de Brandy','Verre de Whisky','Verre de Gin','Tequila Citron','Verre Vin Blanc','Verre Vin Rouge','Shot de Tequila','Verre de Champagne','Bouteille de Cidre','Gin Fizz Citron','Bouteille de Champagne','Verre de rosé','Verre de Champomax']
};

const PRICE_LIST = {
    'Boeuf bourguignon':50,'Saumon Grillé':35,'Quiche aux légumes':30,'Crousti-Douce':50,'Wings épicé':60,'Filet Mignon':50,'Poulet Rôti':60,'Paella Méditerranéenne':50,'Ribbs':50,"Steak 'Potatoes":50,'Rougail Saucisse':50,
    'Brochettes de fruits frais':25,'Mousse au café':25,'Tiramisu Fraise':30,'Los Churros Caramel':35,'Tourte Myrtille':35,
    'Café':15,'Jus de raisin rouge':30,'Cidre Pression':10,'Berry Fizz':30,"Jus d'orange":35,'Jus de raisin blanc':30,'Agua Fresca Pasteque':30,"Vin rouge chaud":25,'Lait de poule':30,'Cappuccino':15,'Bière':20, 'Lutinade':20,
    'Menu Le Nid Végé':70,'Menu Grillé du Nord':80,'Menu Fraîcheur Méditerranéenne':95,'Menu Voyage Sucré-Salé':100,'Menu Flamme d OR':110,'Menu Happy Hen House':110,
    'Cocktail Citron-Myrtille':40,'Verre de Bellini':25,'Verre de Vodka':45,'Verre de Rhum':45,'Verre de Cognac':45,'Verre de Brandy':50,'Verre de Whisky':40,'Verre de Gin':60,'Tequila Citron':50,'Verre Vin Blanc':35,'Verre Vin Rouge':35,'Shot de Tequila':40,'Verre de Champagne':15,'Bouteille de Champagne':100,'Bouteille de Cidre':40,'Gin Fizz Citron':80,'Verre de rosé':25,'Verre de Champomax':30,
    'Livraison NORD':100,'Livraison SUD':150
};

const WEBHOOKS = {
    factures: 'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
    stock: 'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
    entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
    garage: 'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
    expenses: 'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
    support: 'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

const PARTNERS = {
    companies: {
        'Biogood': {
            beneficiaries: ['PDG - Hunt Aaron','CO-PDG - Hernández Andres','RH - Cohman Tiago','RH - Jefferson Patt','RH - DUGGAN Edward','RE - Gonzales Malya','C - Gilmore Jaden','C - Delgado Madison','C - Eider Aldana','C - Léon Dawson'],
            menus: [{ name: 'Wings + Berry Fizz', catalog: 80 }, { name: 'Ribbs + Agua Fresca Pastèque', catalog: 70 }, { name: 'Saumon + Jus de raisin rouge + Churros Caramel', catalog: 65 }, { name: 'Paella + Jus de raisin blanc', catalog: 65 }],
            webhook: 'https://discord.com/api/webhooks/1424556848840704114/GO76yfiBv4UtJqxasHFIfiOXyDjOyf4lUjf4V4KywoS4J8skkYYiOW_I-9BS-Gw_lVcO'
        },
        'SASP Nord': {
            beneficiaries: [ 'Agent SASP NORD' ],
            menus: [{ name: 'Steak Potatoes + Jus de raisin Blanc', catalog: 65 }, { name: 'Ribs + Berry Fizz', catalog: 65 }],
            webhook: 'https://discord.com/api/webhooks/1434640579806892216/kkDgXYVYQFHYo7iHjPqiE-sWgSRJA-qMxqmTh7Br-jzmQpNsGdBVLwzSQJ6Hm-5gz8UU'
        },
    },
};

async function getAuthSheets() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    if (!privateKey || !clientEmail) throw new Error("Variables d'environnement Google manquantes");
    return new google.auth.JWT(clientEmail, null, privateKey, ['https://www.googleapis.com/auth/spreadsheets']);
}

async function updateEmployeeStats(employeeName, amount, type) {
    try {
        const auth = await getAuthSheets();
        const sheets = google.sheets({ version: 'v4', auth });
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const listRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "'Employés'!B2:B100" });
        const rows = listRes.data.values || [];
        const rowIndex = rows.findIndex(r => r[0] && r[0].trim().toLowerCase() === employeeName.trim().toLowerCase());
        if (rowIndex === -1) return;
        const realRow = rowIndex + 2;
        const col = type === 'CA' ? 'G' : 'H';
        const targetRange = `'Employés'!${col}${realRow}`;
        const cellRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: targetRange });
        const currentVal = Number(cellRes.data.values?.[0]?.[0] || 0);
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId, range: targetRange, valueInputOption: 'RAW',
            requestBody: { values: [[currentVal + Number(amount)]] }
        });
    } catch (e) { console.error("Sheets Error:", e); }
}

async function sendWebhook(url, payload) {
    if (!url) return;
    try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (e) { console.error("Webhook Error:", e); }
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { action, data } = body;

        if (!action || action === 'getMeta' || action === 'syncData') {
            const auth = await getAuthSheets();
            const sheets = google.sheets({ version: 'v4', auth });
            const res = await sheets.spreadsheets.values.get({ 
                spreadsheetId: process.env.GOOGLE_SHEET_ID, 
                range: "'Employés'!A2:I100",
                valueRenderOption: 'UNFORMATTED_VALUE'
            });
            const employeesFull = (res.data.values || []).filter(r => r[1]).map(r => ({
                id: String(r[0] ?? ''), name: String(r[1]).trim(), role: String(r[2] ?? ''),
                phone: String(r[3] ?? ''), seniority: Number(r[5] ?? 0),
                ca: Number(r[6] ?? 0), stock: Number(r[7] ?? 0), salary: Number(r[8] ?? 0),
            }));

            return NextResponse.json({
                success: true,
                employees: employeesFull.map(e => e.name),
                employeesFull,
                products: Object.values(PRODUCTS_CAT).flat(),
                productsByCategory: PRODUCTS_CAT,
                prices: PRICE_LIST,
                partners: PARTNERS,
                vehicles: ['Grotti Brioso Fulmin - 819435','Taco Van - 642602','Taco Van - 570587','Rumpobox - 34217'],
            });
        }

        let embed = { timestamp: new Date().toISOString(), footer: { text: `Hen House Management v${APP_VERSION}` }, color: 0xff9800 };

        switch (action) {
            case 'sendFactures':
                const grandTotal = data.items?.reduce((acc, i) => acc + (Number(i.qty) * (PRICE_LIST[i.desc] || 0)), 0) || 0;
                embed.title = `📑 Facture Client n°${data.invoiceNumber}`;
                embed.fields = [
                    { name: '👤 Agent', value: `\`${data.employee}\``, inline: true },
                    { name: '💰 Total', value: `**${grandTotal}${CURRENCY.symbol}**`, inline: true },
                    { name: '🧾 Détails', value: data.items.map(i => `🔸 x${i.qty} ${i.desc}`).join('\n') }
                ];
                await sendWebhook(WEBHOOKS.factures, { embeds: [embed] });
                await updateEmployeeStats(data.employee, grandTotal, 'CA');
                break;

            case 'sendProduction':
                const totalProd = data.items?.reduce((s, i) => s + Number(i.qty), 0) || 0;
                embed.title = '📦 Production Cuisine';
                embed.fields = [
                    { name: '👤 Cuisinier', value: `\`${data.employee}\``, inline: true },
                    { name: '📊 Unités', value: `**${totalProd}**`, inline: true },
                    { name: '📝 Liste', value: data.items.map(i => `🍳 x${i.qty} ${i.product}`).join('\n') }
                ];
                await sendWebhook(WEBHOOKS.stock, { embeds: [embed] });
                await updateEmployeeStats(data.employee, totalProd, 'STOCK');
                break;

            case 'sendGarage':
                embed.title = data.action === 'Sortie' ? '🔑 Sortie' : '🅿️ Rangement';
                embed.color = data.action === 'Sortie' ? 0x2ECC71 : 0xE74C3C;
                embed.fields = [{ name: '🚗 Véhicule', value: data.vehicle }, { name: '⛽ Essence', value: `${data.fuel}%` }];
                await sendWebhook(WEBHOOKS.garage, { embeds: [embed] });
                break;
            
            case 'sendPartnerOrder':
                embed.title = `🤝 Partenaire : ${data.company}`;
                embed.fields = [{ name: '🔑 Client', value: data.benef }, { name: '🍱 Menus', value: data.items.map(i => `🍱 x${i.qty} ${i.menu}`).join('\n') }];
                await sendWebhook(PARTNERS.companies[data.company]?.webhook || WEBHOOKS.factures, { embeds: [embed] });
                break;
            
            case 'sendExpense':
                embed.title = `💳 Frais : ${data.kind}`;
                embed.fields = [{ name: '🚗 Véhicule', value: data.vehicle }, { name: '💵 Montant', value: `${data.amount}$` }];
                await sendWebhook(WEBHOOKS.expenses, { embeds: [embed] });
                break;

            case 'sendSupport':
                embed.title = `🆘 Ticket Support : ${data.sub}`;
                embed.description = data.msg;
                await sendWebhook(WEBHOOKS.support, { embeds: [embed] });
                break;
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
