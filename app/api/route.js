import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= DONNÉES HEN HOUSE =================
const APP_VERSION = '2025.12.30';
const CURRENCY = { symbol: '$', code: 'USD' };

const WEBHOOKS = {
  factures:   'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock:      'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage:     'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses:   'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support:    'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

const RECIPES = {
    "Boeuf bourguignon": "🥩 Boeuf, 🍷 Vin Rouge, 🥕 Carottes, 🧅 Oignons",
    "Saumon Grillé": "🐟 Saumon, 🍋 Citron, 🌿 Aneth",
    "Wings épicé": "🍗 Ailes de poulet, 🌶️ Épices, 🍯 Sauce BBQ",
    "Filet Mignon": "🥩 Filet, 🍄 Champignons, 🥛 Crème Fraîche",
    "Poulet Rôti": "🍗 Poulet entier, 🥔 Pommes de terre, 🌿 Herbes",
    "Paella Méditerranéenne": "🍚 Riz, 🦐 Fruits de mer, 🍗 Poulet, 🌶️ Safran",
    "Ribbs": "🍖 Travers de porc, Miel, Sauce fumée",
    "Steak 'Potatoes": "🥩 Steak, 🍟 Grosses frites, 🧂 Poivre",
    "Rougail Saucisse": "🌭 Saucisses, 🍅 Tomates, 🍚 Riz, 🌶️ Piment",
    "Tiramisu Fraise": "🍓 Fraises, 🧀 Mascarpone, 🍪 Biscuits",
    "Los Churros Caramel": "🍩 Pâte frite, 🍬 Caramel",
    "Tourte Myrtille": "🥧 Myrtilles, Pâte brisée"
};

const PRODUCTS = {
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
  'Cocktail Citron-Myrtille':40,'Verre de Bellini':25,'Verre de Vodka':45,'Verre de Rhum':45,'Verre de Cognac':45,'Verre de Brandy':50,'Verre de Whisky':40,'Verre de Gin':60,'Tequila Citron':50,'Verre Vin Blanc':35,'Verre Vin Rouge':35,'Shot de Tequila':40,'Verre de Champagne':15,'Bouteille de Champagne':100,'Bouteille de Cidre':40,'Gin Fizz Citron':80,'Verre de rosé':25,'Verre de Champomax':30
};

const VEHICLES = ['Grotti Brioso Fulmin - 819435','Taco Van - 642602','Taco Van - 570587','Rumpobox - 34217'];

const PARTNERS = {
  companies: {
    'Biogood': {
      beneficiaries: ['PDG - Hunt Aaron','CO-PDG - Hernández Andres','RH - Cohman Tiago','RH - Jefferson Patt','RE - Gonzales Malya','C - Gilmore Jaden','C - Delgado Madison','C - Mehdi Rousseau'],
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

// ================= FONCTIONS UTILES =================

function formatAmount(n) { return `${CURRENCY.symbol}${(Number(n)||0).toFixed(2)}`; }

async function sendWebhook(url, payload) {
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) { console.error("Erreur Webhook:", e); }
}

async function getAuthSheets() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const auth = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, null, privateKey, ['https://www.googleapis.com/auth/spreadsheets']);
    return google.sheets({ version: 'v4', auth });
}

async function updateEmployeeStats(employeeName, amountToAdd, type) {
    try {
        const sheets = await getAuthSheets();
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const listRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'B2:B100' });
        const rows = listRes.data.values || [];
        const rowIndex = rows.findIndex(r => r[0] && r[0].trim() === employeeName.trim());
        if (rowIndex === -1) return;
        const realRow = rowIndex + 2; 
        const targetCell = type === 'CA' ? `G${realRow}` : `H${realRow}`;
        const cellRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: targetCell, valueRenderOption: 'UNFORMATTED_VALUE' });
        let currentValue = Number(cellRes.data.values?.[0]?.[0] || 0);
        const newValue = currentValue + Number(amountToAdd);
        await sheets.spreadsheets.values.update({ spreadsheetId: sheetId, range: targetCell, valueInputOption: 'RAW', requestBody: { values: [[newValue]] } });
    } catch (e) { console.error("Erreur update Sheet:", e); }
}

export async function POST(request) {
  try {
    let body = {};
    try { body = await request.json(); } catch (e) {}
    const { action, data } = body;

    if (!action || action === 'getMeta') {
       const sheets = await getAuthSheets();
       const res = await sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: 'A2:H100', valueRenderOption: 'UNFORMATTED_VALUE' });
       const employees = (res.data.values || []).map(r => ({ nom: r[1], poste: r[2], tel: r[3], ca: Number(r[6]) || 0 })).filter(e => e.nom);
       return NextResponse.json({ success: true, employees, products: Object.values(PRODUCTS).flat(), productsByCategory: PRODUCTS, recipes: RECIPES, prices: PRICE_LIST, vehicles: VEHICLES, partners: PARTNERS });
    }

    if (action === 'sendFactures') {
      const items = data.items || [];
      const grandTotal = items.reduce((s, i) => s + (Math.floor(Number(i.qty)) * Number(PRICE_LIST[i.desc] || 0)), 0);
      const fields = items.map(i => ({ name: `${i.desc} ×${i.qty}`, value: `${formatAmount(PRICE_LIST[i.desc])} → **${formatAmount(i.qty * PRICE_LIST[i.desc])}**` }));
      const embed = { title: `🍽️ Facture N°${data.invoiceNumber}`, description: `Déclaration de ${data.employee}`, color: 0xd35400, fields: [{ name: '👤 Employé', value: data.employee, inline: true }, { name: '💰 Total', value: `**${formatAmount(grandTotal)}**`, inline: true }, ...fields], timestamp: new Date().toISOString() };
      await sendWebhook(WEBHOOKS.factures, { embeds: [embed] });
      await updateEmployeeStats(data.employee, grandTotal, 'CA');
      return NextResponse.json({ success: true });
    }

    if (action === 'sendProduction') {
      const totalQty = data.items.reduce((s, i) => s + Number(i.qty), 0);
      const fields = data.items.map(i => ({ name: `📦 ${i.product}`, value: `**${i.qty}** unités`, inline: true }));
      const embed = { title: '📦 Déclaration de Stock', description: `Production par ${data.employee}`, color: 0xe67e22, fields: [{ name: '👤 Employé', value: data.employee, inline: true }, { name: '📊 Total', value: `**${totalQty}**`, inline: true }, ...fields], timestamp: new Date().toISOString() };
      await sendWebhook(WEBHOOKS.stock, { embeds: [embed] });
      await updateEmployeeStats(data.employee, totalQty, 'STOCK');
      return NextResponse.json({ success: true });
    }

    if (action === 'sendEntreprise') {
        const totalQty = data.items.reduce((s, i) => s + Number(i.qty), 0);
        const embed = { title: '🏭 Déclaration Entreprise', description: `Commande ${data.company} par ${data.employee}`, color: 0xf39c12, fields: [{ name: '📊 Total', value: `${totalQty} unités` }], timestamp: new Date().toISOString() };
        await sendWebhook(WEBHOOKS.entreprise, { embeds: [embed] });
        return NextResponse.json({ success: true });
    }

    if (action === 'sendGarage') {
        const embed = { title: `🚗 Garage - ${data.action}`, color: 0x8e44ad, fields: [{ name: '🚗 Véhicule', value: data.vehicle }, { name: '⛽ Essence', value: `${data.fuel}%` }], timestamp: new Date().toISOString() };
        await sendWebhook(WEBHOOKS.garage, { embeds: [embed] });
        return NextResponse.json({ success: true });
    }

    if (action === 'sendExpense') {
        const embed = { title: `💳 Note de frais — ${data.kind}`, color: 0x10b981, fields: [{ name: '💵 Montant', value: formatAmount(data.amount) }], timestamp: new Date().toISOString() };
        await sendWebhook(WEBHOOKS.expenses, { embeds: [embed] });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Action inconnue' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
