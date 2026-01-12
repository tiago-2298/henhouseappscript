export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= CONFIGURATION & WEBHOOKS =================
const APP_VERSION = '2026.01.12';
const CURRENCY = { symbol: '$', code: 'USD' };

const WEBHOOKS = {
  factures:   'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock:      'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage:     'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses:   'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support:    'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

// Émojis pour le rendu Discord
const EMOJIS = {
  vendeur: '👨‍🍳', caisse: '💰', ticket: '🧾', produit: '🍴', 
  stock: '📦', usine: '🏭', voiture: '🚗', essence: '⛽',
  money: '💸', alerte: '🚨', succes: '✅', info: 'ℹ️'
};

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

const PARTNERS = {
  companies: {
    'Biogood': {
      webhook: 'https://discord.com/api/webhooks/1424556848840704114/GO76yfiBv4UtJqxasHFIfiOXyDjOyf4lUjf4V4KywoS4J8skkYYiOW_I-9BS-Gw_lVcO'
    },
    'SASP Nord': {
      webhook: 'https://discord.com/api/webhooks/1434640579806892216/kkDgXYVYQFHYo7iHjPqiE-sWgSRJA-qMxqmTh7Br-jzmQpNsGdBVLwzSQJ6Hm-5gz8UU'
    },
  },
};

// ================= UTILS =================
function formatAmount(n) { return `**${(Number(n)||0).toFixed(2)} ${CURRENCY.symbol}**`; }

async function sendWebhook(url, payload) {
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) { console.error("Erreur Webhook:", e); }
}

async function getAuthSheets() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  if (!privateKey || !clientEmail) throw new Error("Variables Google manquantes");
  const auth = new google.auth.JWT(clientEmail, null, privateKey, ['https://www.googleapis.com/auth/spreadsheets']);
  return google.sheets({ version: 'v4', auth });
}

async function updateEmployeeStats(employeeName, amountToAdd, type) {
  try {
    const sheets = await getAuthSheets();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const listRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "'Employés'!B2:B200" });
    const rows = listRes.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] && r[0].trim() === employeeName.trim());
    if (rowIndex === -1) return;
    const realRow = rowIndex + 2;
    const targetCell = type === 'CA' ? `'Employés'!G${realRow}` : `'Employés'!H${realRow}`;
    const cellRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: targetCell, valueRenderOption: 'UNFORMATTED_VALUE' });
    let currentVal = Number(cellRes.data.values?.[0]?.[0] || 0);
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId, range: targetCell, valueInputOption: 'RAW',
      requestBody: { values: [[currentVal + Number(amountToAdd)]] }
    });
  } catch (e) { console.error("Erreur Sheets:", e); }
}

// ================= ROUTEUR API =================
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, data } = body;

    // --- SYNC ---
    if (!action || action === 'getMeta' || action === 'syncData') {
      let employeesFull = [];
      try {
        const sheets = await getAuthSheets();
        const resFull = await sheets.spreadsheets.values.get({ 
          spreadsheetId: process.env.GOOGLE_SHEET_ID, range: "'Employés'!A2:I200", valueRenderOption: 'UNFORMATTED_VALUE' 
        });
        const rows = resFull.data.values || [];
        employeesFull = rows.filter(r => r[1]).map(r => ({
          id: String(r[0] ?? ''), name: String(r[1] ?? '').trim(), role: String(r[2] ?? ''),
          seniority: Number(r[5] ?? 0), ca: Number(r[6] ?? 0), stock: Number(r[7] ?? 0),
        }));
      } catch (err) {}

      return NextResponse.json({
        success: true, version: APP_VERSION, employees: employeesFull.map(e => e.name), employeesFull,
        products: Object.values(PRODUCTS_CAT).flat(), productsByCategory: PRODUCTS_CAT,
        prices: PRICE_LIST, currencySymbol: CURRENCY.symbol
      });
    }

    let embed = { 
        timestamp: new Date().toISOString(), 
        footer: { text: `Hen House Management • v${APP_VERSION}`, icon_url: 'https://i.goopics.net/dskmxi.png' } 
    };

    switch (action) {
      case 'sendFactures':
        const grandTotal = data.items.reduce((acc, i) => acc + (Number(i.qty) * (PRICE_LIST[i.desc] || 0)), 0);
        embed.title = `${EMOJIS.ticket} Facture Client n°${data.invoiceNumber || 'Inconnu'}`;
        embed.color = 0xF1C40F; // Jaune Or
        embed.fields = [
          { name: `${EMOJIS.vendeur} Employé`, value: `\`${data.employee}\``, inline: true },
          { name: `${EMOJIS.caisse} Total Encaissé`, value: formatAmount(grandTotal), inline: true },
          { name: `${EMOJIS.produit} Détail de la commande`, value: data.items.map(i => `▫️ **${i.qty}x** ${i.desc}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.factures, { embeds: [embed] });
        await updateEmployeeStats(data.employee, grandTotal, 'CA');
        break;

      case 'sendProduction':
        const totalProd = data.items.reduce((s, i) => s + Number(i.qty), 0);
        embed.title = `${EMOJIS.stock} Nouvelle Production Cuisine`;
        embed.color = 0xE67E22; // Orange
        embed.fields = [
          { name: `${EMOJIS.vendeur} Cuisinier`, value: `\`${data.employee}\``, inline: true },
          { name: `📊 Total`, value: `**${totalProd}** unités`, inline: true },
          { name: `📝 Inventaire déposé`, value: data.items.map(i => `📦 **${i.qty}** ${i.product}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.stock, { embeds: [embed] });
        await updateEmployeeStats(data.employee, totalProd, 'STOCK');
        break;

      case 'sendEntreprise':
        embed.title = `${EMOJIS.usine} Livraison Entreprise`;
        embed.color = 0x3498DB; // Bleu
        embed.fields = [
          { name: `${EMOJIS.vendeur} Livreur`, value: `\`${data.employee}\``, inline: true },
          { name: `🏢 Client Pro`, value: `**${data.company}**`, inline: true },
          { name: `📦 Contenu`, value: data.items.map(i => `🔹 **${i.qty}x** ${i.product}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.entreprise, { embeds: [embed] });
        break;

      case 'sendGarage':
        const isEntry = data.action === 'Entrée';
        embed.title = `${EMOJIS.voiture} Véhicule : ${data.action}`;
        embed.color = isEntry ? 0x2ECC71 : 0xE74C3C; // Vert ou Rouge
        embed.fields = [
          { name: `👤 Employé`, value: `\`${data.employee}\``, inline: true },
          { name: `🚗 Modèle`, value: `*${data.vehicle}*`, inline: true },
          { name: `${EMOJIS.essence} Niveau Carburant`, value: `**${data.fuel}%**`, inline: false }
        ];
        await sendWebhook(WEBHOOKS.garage, { embeds: [embed] });
        break;

      case 'sendExpense':
        embed.title = `${EMOJIS.money} Note de Frais`;
        embed.color = 0x9B59B6; // Violet
        embed.fields = [
          { name: `👤 Employé`, value: `\`${data.employee}\``, inline: true },
          { name: `💰 Montant`, value: formatAmount(data.amount), inline: true },
          { name: `ℹ️ Type`, value: `**${data.kind}**`, inline: true },
          { name: `🚗 Véhicule lié`, value: data.vehicle, inline: false }
        ];
        await sendWebhook(WEBHOOKS.expenses, { embeds: [embed] });
        break;

      case 'sendPartnerOrder':
        const pWb = PARTNERS.companies[data.company]?.webhook || WEBHOOKS.factures;
        embed.title = `🤝 Commande Partenaire : ${data.company}`;
        embed.color = 0x1ABC9C; // Turquoise
        embed.fields = [
          { name: `👤 Traité par`, value: `\`${data.employee}\``, inline: true },
          { name: `🔑 Bénéficiaire`, value: `**${data.beneficiary}**`, inline: true },
          { name: `🧾 Menus`, value: data.items.map(i => `✅ **${i.qty}x** ${i.menu}`).join('\n') }
        ];
        await sendWebhook(pWb, { embeds: [embed] });
        break;

      case 'sendSupport':
        embed.title = `${EMOJIS.alerte} Nouveau Message Support`;
        embed.color = 0xC0392B; // Rouge sombre
        embed.description = `**Message :**\n> ${data.message}`;
        embed.fields = [{ name: `👤 Expéditeur`, value: `\`${data.employee}\``, inline: true }, { name: `📌 Sujet`, value: data.subject, inline: true }];
        await sendWebhook(WEBHOOKS.support, { embeds: [embed] });
        break;

      default:
        return NextResponse.json({ success: false, message: 'Action inconnue' });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
