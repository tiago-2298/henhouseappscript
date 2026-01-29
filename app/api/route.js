export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const APP_VERSION = '2026.01.29';
const CURRENCY = { symbol: '$', code: 'USD' };
const CACHE_TTL_MS = 30000; 

const PRODUCTS_CAT = {
  plats_principaux: ['Lasagne aux légumes', 'Saumon grillé', 'Crousti-Douce', 'Paella Méditerranéenne', "Steak 'Potatoes", 'Ribs', 'Filet Mignon', 'Poulet Rôti', 'Wings Epicé', 'Effiloché de Mouton', 'Burger Gourmet au Foie Gras'],
  desserts: ['Mousse au café', 'Tiramisu Fraise', 'Carpaccio Fruit Exotique', 'Profiteroles au chocolat', 'Los Churros Caramel'],
  boissons: ['Café', 'Jus de raisin Rouge', 'Berry Fizz', "Jus d'orange", 'Nectar Exotique', 'Kombucha Citron'],
  menus: ['LA SIGNATURE VÉGÉTALE', 'LE PRESTIGE DE LA MER', 'LE RED WINGS', "LE SOLEIL D'OR", 'LE SIGNATURE "75"', "L'HÉRITAGE DU BERGER", 'LA CROISIÈRE GOURMANDE'],
  alcools: ['Verre de Cidre en Pression', 'Verre de Champagne', 'Verre de rosé', 'Verre de Champomax', 'Verre de Bellini', 'Verre Vin Rouge', 'Verre Vin Blanc', 'Verre de Cognac', 'Verre de Brandy', 'Verre de Whisky', 'Shot de Tequila', 'Cocktail Citron-Myrtille', 'Verre de Vodka', 'Verre de Rhum', 'Verre de Tequila Citron', 'Verre de Gin', 'Verre de Gin Fizz Citron', 'Bouteille de Cidre', 'Bouteille de Champagne']
};

const PRICE_LIST = {
  'Lasagne aux légumes': 50, 'Saumon grillé': 35, 'Crousti-Douce': 65, 'Paella Méditerranéenne': 65, "Steak 'Potatoes": 40, 'Ribs': 45, 'Filet Mignon': 50, 'Poulet Rôti': 60, 'Wings Epicé': 65, 'Effiloché de Mouton': 65, 'Burger Gourmet au Foie Gras': 75,
  'Mousse au café': 25, 'Tiramisu Fraise': 30, 'Carpaccio Fruit Exotique': 30, 'Profiteroles au chocolat': 35, 'Los Churros Caramel': 35,
  'Café': 15, 'Jus de raisin Rouge': 30, 'Berry Fizz': 30, "Jus d'orange": 35, 'Nectar Exotique': 50, 'Kombucha Citron': 40,
  'LA SIGNATURE VÉGÉTALE': 80, 'LE PRESTIGE DE LA MER': 90, 'LE RED WINGS': 110, "LE SOLEIL D'OR": 100, 'LE SIGNATURE "75"': 100, "L'HÉRITAGE DU BERGER": 120, 'LA CROISIÈRE GOURMANDE': 120,
  'Verre de Cidre en Pression': 10, 'Verre de Champagne': 15, 'Verre de rosé': 20, 'Verre de Champomax': 25, 'Verre de Bellini': 25, 'Verre Vin Rouge': 25, 'Verre Vin Blanc': 30, 'Verre de Cognac': 30, 'Verre de Brandy': 40, 'Verre de Whisky': 40, 'Shot de Tequila': 40, 'Cocktail Citron-Myrtille': 40, 'Verre de Vodka': 45, 'Verre de Rhum': 45, 'Verre de Tequila Citron': 50, 'Verre de Gin': 65, 'Verre de Gin Fizz Citron': 70, 'Bouteille de Cidre': 50, 'Bouteille de Champagne': 125,
  'LIVRAISON NORD': 100, 'LIVRAISON SUD': 200, 'PRIVATISATION': 4500
};

const WEBHOOKS = {
  factures: 'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock: 'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage: 'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses: 'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support: 'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_'
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

globalThis.__HENHOUSE_CACHE__ = globalThis.__HENHOUSE_CACHE__ || { ts: 0, meta: null };

async function getAuthSheets() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  if (!privateKey || !clientEmail) throw new Error("Missing Google Credentials");
  return new google.auth.JWT(clientEmail, null, privateKey, ['https://www.googleapis.com/auth/spreadsheets']);
}

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout")), ms))]);

async function buildMetaFromSheets() {
  const auth = await getAuthSheets();
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const res = await withTimeout(sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "'Employés'!A2:I80",
    valueRenderOption: 'UNFORMATTED_VALUE'
  }), 15000);

  const rows = res.data.values || [];
  const employeesFull = rows.filter(r => r[1]).map((r, i) => ({
    id: String(r[0] || i),
    name: String(r[1]).trim(),
    role: String(r[2] || ''),
    phone: String(r[3] || ''),
    seniority: Number(r[5] || 0),
    ca: Number(r[6] || 0),
    stock: Number(r[7] || 0),
    salary: Number(r[8] || 0),
  }));

  return {
    success: true,
    employees: employeesFull.map(e => e.name),
    employeesFull,
    products: Object.values(PRODUCTS_CAT).flat(),
    productsByCategory: PRODUCTS_CAT,
    prices: PRICE_LIST,
    partners: PARTNERS,
    vehicles: ['Grotti Brioso Fulmin - 819435','Taco Van - 642602','Taco Van - 570587','Rumpobox - 34217'],
  };
}

async function sendDiscordWebhook(url, payload, fileBase64 = null) {
  if (!url) return;
  if (fileBase64) {
    const buffer = Buffer.from(fileBase64.split(',')[1], 'base64');
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'image/jpeg' }), 'preuve.jpg');
    formData.append('payload_json', JSON.stringify(payload));
    await fetch(url, { method: 'POST', body: formData });
  } else {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  }
}

async function updateStat(name, val, col) {
  const auth = await getAuthSheets();
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const list = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "'Employés'!B2:B80" });
  const idx = (list.data.values || []).findIndex(r => r[0]?.trim().toLowerCase() === name.toLowerCase());
  if (idx === -1) return;
  const cell = `'Employés'!${col}${idx + 2}`;
  const curr = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: cell });
  const next = Number(curr.data.values?.[0]?.[0] || 0) + Number(val);
  await sheets.spreadsheets.values.update({ spreadsheetId: sheetId, range: cell, valueInputOption: 'RAW', requestBody: { values: [[next]] } });
}

export async function POST(req) {
  try {
    const { action, data } = await req.json();
    if (action === 'getMeta') {
      const cache = globalThis.__HENHOUSE_CACHE__;
      if (cache.meta && Date.now() - cache.ts < CACHE_TTL_MS) return NextResponse.json(cache.meta);
      const meta = await buildMetaFromSheets();
      globalThis.__HENHOUSE_CACHE__ = { ts: Date.now(), meta };
      return NextResponse.json(meta);
    }

    let embed = { timestamp: new Date().toISOString(), color: 0xff9800, footer: { text: `Hen House v${APP_VERSION}` } };

    if (action === 'sendFactures') {
      const total = data.items.reduce((a, i) => a + (i.qty * (PRICE_LIST[i.desc] || 0)), 0);
      embed.title = `📑 Vente : ${data.employee}`;
      embed.fields = [{ name: 'Facture', value: data.invoiceNumber, inline: true }, { name: 'Total', value: `${total}$`, inline: true }, { name: 'Articles', value: data.items.map(i => `x${i.qty} ${i.desc}`).join('\n') }];
      await sendDiscordWebhook(WEBHOOKS.factures, { embeds: [embed] });
      await updateStat(data.employee, total, 'G');
    } 
    else if (action === 'sendProduction') {
      const total = data.items.reduce((a, i) => a + Number(i.qty), 0);
      embed.title = `📦 Stock : ${data.employee}`;
      embed.fields = [{ name: 'Total', value: `${total}u`, inline: true }, { name: 'Détail', value: data.items.map(i => `x${i.qty} ${i.product}`).join('\n') }];
      await sendDiscordWebhook(WEBHOOKS.stock, { embeds: [embed] });
      await updateStat(data.employee, total, 'H');
    }
    else if (action === 'sendExpense') {
      embed.title = `💳 Frais : ${data.employee}`;
      embed.fields = [{ name: 'Type', value: data.kind, inline: true }, { name: 'Montant', value: `${data.amount}$`, inline: true }];
      if (data.file) embed.image = { url: 'attachment://preuve.jpg' };
      await sendDiscordWebhook(WEBHOOKS.expenses, { embeds: [embed] }, data.file);
    }
    else if (action === 'sendGarage') {
      embed.title = `${data.action} : ${data.employee}`;
      embed.fields = [{ name: 'Véhicule', value: data.vehicle, inline: true }, { name: 'Fuel', value: `${data.fuel}%`, inline: true }];
      await sendDiscordWebhook(WEBHOOKS.garage, { embeds: [embed] });
    }
    else if (action === 'sendSupport') {
      embed.title = `🆘 Support : ${data.employee}`;
      embed.description = `**[${data.sub}]**\n${data.msg}`;
      await sendDiscordWebhook(WEBHOOKS.support, { embeds: [embed] });
    }

    globalThis.__HENHOUSE_CACHE__ = { ts: 0, meta: null };
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
