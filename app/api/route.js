export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= CONFIGURATION =================
const APP_VERSION = '2026.01.21';
const CURRENCY = { symbol: '$', code: 'USD' };

// ⬇️ IMPORTANT : on arrête de couper à 15s
const SHEETS_TIMEOUT_MS = 60000; // 60s
const CACHE_TTL_MS = 30000;      // cache 30s (énorme amélioration sur Vercel)

const PRODUCTS_CAT = {
  plats_principaux: [
    'Lasagne aux légumes', 'Saumon grillé', 'Crousti-Douce',
    'Paella Méditerranéenne', "Steak 'Potatoes", 'Ribs',
    'Filet Mignon', 'Poulet Rôti', 'Wings Epicé',
    'Effiloché de Mouton', 'Burger Gourmet au Foie Gras'
  ],
  desserts: [
    'Mousse au café', 'Tiramisu Fraise', 'Carpaccio Fruit Exotique',
    'Profiteroles au chocolat', 'Los Churros Caramel'
  ],
  boissons: [
    'Café', 'Jus de raisin Rouge', 'Berry Fizz',
    "Jus d'orange", 'Nectar Exotique', 'Kombucha Citron'
  ],
  menus: [
    'LA SIGNATURE VÉGÉTALE', 'LE PRESTIGE DE LA MER', 'LE RED WINGS',
    "LE SOLEIL D'OR", 'LE SIGNATURE "75"', "L'HÉRITAGE DU BERGER",
    'LA CROISIÈRE GOURMANDE'
  ],
  alcools: [
    'Verre de Cidre en Pression', 'Verre de Champagne', 'Verre de rosé',
    'Verre de Champomax', 'Verre de Bellini', 'Verre Vin Rouge',
    'Verre Vin Blanc', 'Verre de Cognac', 'Verre de Brandy',
    'Verre de Whisky', 'Shot de Tequila', 'Cocktail Citron-Myrtille',
    'Verre de Vodka', 'Verre de Rhum', 'Verre de Tequila Citron',
    'Verre de Gin', 'Verre de Gin Fizz Citron', 'Bouteille de Cidre',
    'Bouteille de Champagne'
  ]
};

const WEBHOOKS = {
  factures:   'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock:      'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage:     'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses:   'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support:    'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

const PRICE_LIST = {
  // Plats
  'Lasagne aux légumes': 50, 'Saumon grillé': 35, 'Crousti-Douce': 65,
  'Paella Méditerranéenne': 65, "Steak 'Potatoes": 40, 'Ribs': 45,
  'Filet Mignon': 50, 'Poulet Rôti': 60, 'Wings Epicé': 65,
  'Effiloché de Mouton': 65, 'Burger Gourmet au Foie Gras': 75,

  // Desserts
  'Mousse au café': 25, 'Tiramisu Fraise': 30, 'Carpaccio Fruit Exotique': 30,
  'Profiteroles au chocolat': 35, 'Los Churros Caramel': 35,

  // Boissons
  'Café': 15, 'Jus de raisin Rouge': 30, 'Berry Fizz': 30,
  "Jus d'orange": 35, 'Nectar Exotique': 50, 'Kombucha Citron': 40,

  // Menus
  'LA SIGNATURE VÉGÉTALE': 80, 'LE PRESTIGE DE LA MER': 90, 'LE RED WINGS': 110,
  "LE SOLEIL D'OR": 100, 'LE SIGNATURE "75"': 100, "L'HÉRITAGE DU BERGER": 120,
  'LA CROISIÈRE GOURMANDE': 120,

  // Alcools
  'Verre de Cidre en Pression': 10, 'Verre de Champagne': 15, 'Verre de rosé': 20,
  'Verre de Champomax': 25, 'Verre de Bellini': 25, 'Verre Vin Rouge': 25,
  'Verre Vin Blanc': 30, 'Verre de Cognac': 30, 'Verre de Brandy': 40,
  'Verre de Whisky': 40, 'Shot de Tequila': 40, 'Cocktail Citron-Myrtille': 40,
  'Verre de Vodka': 45, 'Verre de Rhum': 45, 'Verre de Tequila Citron': 50,
  'Verre de Gin': 65, 'Verre de Gin Fizz Citron': 70, 'Bouteille de Cidre': 50,
  'Bouteille de Champagne': 125,

  // Service
  'LIVRAISON NORD': 100, 'LIVRAISON SUD': 200, 'PRIVATISATION': 4500
};

const PARTNERS = {
  companies: {
    'Biogood': {
      beneficiaries: ['PDG - Hunt Aaron','CO-PDG - Hernández Andres','RH - Cohman Tiago','RH - Jefferson Patt','RH - DUGGAN Edward','RE - Gonzales Malya','C - Gilmore Jaden','C - Delgado Madison','C - Eider Aldana','C - Léon Dawson'],
      menus: [
        { name: 'Wings + Berry Fizz', catalog: 80 },
        { name: 'Ribbs + Agua Fresca Pastèque', catalog: 70 },
        { name: 'Saumon + Jus de raisin rouge + Churros Caramel', catalog: 65 },
        { name: 'Paella + Jus de raisin blanc', catalog: 65 }
      ],
      webhook: 'https://discord.com/api/webhooks/1424556848840704114/GO76yfiBv4UtJqxasHFIfiOXyDjOyf4lUjf4V4KywoS4J8skkYYiOW_I-9BS-Gw_lVcO'
    },
    'SASP Nord': {
      beneficiaries: [ 'Agent SASP NORD' ],
      menus: [
        { name: 'Steak Potatoes + Jus de raisin Blanc', catalog: 65 },
        { name: 'Ribs + Berry Fizz', catalog: 65 }
      ],
      webhook: 'https://discord.com/api/webhooks/1434640579806892216/kkDgXYVYQFHYo7iHjPqiE-sWgSRJA-qMxqmTh7Br-jzmQpNsGdBVLwzSQJ6Hm-5gz8UU'
    },
  },
};

// ================= CACHE (mémoire Vercel) =================
// Sur Vercel, le cache tient pendant la vie du même runtime (ça réduit énormément les appels Sheets)
globalThis.__HENHOUSE_CACHE__ = globalThis.__HENHOUSE_CACHE__ || { ts: 0, meta: null };

// ================= UTILS =================
async function getAuthSheets() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  if (!privateKey || !clientEmail) throw new Error("Variables Google manquantes (GOOGLE_PRIVATE_KEY / GOOGLE_CLIENT_EMAIL)");

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  // Important : options globales (timeout gaxios)
  google.options({
    timeout: SHEETS_TIMEOUT_MS,
    // pas besoin de retry long si ça bloque
    retry: false,
  });

  return google.sheets({ version: 'v4', auth });
}

const withTimeout = async (promise, ms, label) => {
  return await Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} after ${ms}ms`)), ms))
  ]);
};

async function sendDiscordWebhook(url, payload, fileBase64 = null) {
  if (!url) return;

  try {
    if (fileBase64) {
      const base64Part = (fileBase64.includes(',')) ? fileBase64.split(',')[1] : fileBase64;
      if (!base64Part) {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        return;
      }

      const buffer = Buffer.from(base64Part, 'base64');
      const blob = new Blob([buffer], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', blob, 'preuve.jpg');
      formData.append('payload_json', JSON.stringify(payload));
      await fetch(url, { method: 'POST', body: formData });
    } else {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (e) {
    console.error("Webhook error:", e);
  }
}

async function updateEmployeeStats(employeeName, amount, type) {
  try {
    if (!employeeName || !amount || Number(amount) <= 0) return;

    const sheets = await getAuthSheets();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) throw new Error("Variable manquante: GOOGLE_SHEET_ID");

    const resList = await withTimeout(
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "'Employés'!B2:B80",
        valueRenderOption: 'UNFORMATTED_VALUE'
      }),
      25000,
      "Sheets get employees list"
    );

    const rows = resList.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] && r[0].trim().toLowerCase() === employeeName.trim().toLowerCase());
    if (rowIndex === -1) return;

    const realRow = rowIndex + 2;
    const col = type === 'CA' ? 'G' : 'H';
    const targetRange = `'Employés'!${col}${realRow}`;

    const currentValRes = await withTimeout(
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: targetRange,
        valueRenderOption: 'UNFORMATTED_VALUE'
      }),
      25000,
      "Sheets get current stat"
    );

    const currentVal = Number(currentValRes.data.values?.[0]?.[0] || 0);

    await withTimeout(
      sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: targetRange,
        valueInputOption: 'RAW',
        requestBody: { values: [[currentVal + Number(amount)]] }
      }),
      25000,
      "Sheets update stat"
    );
  } catch (e) {
    console.error("Update Stats Error:", e);
  }
}

async function buildMetaFromSheets() {
  const sheets = await getAuthSheets();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("Variable manquante: GOOGLE_SHEET_ID");

  // ✅ BatchGet + plage réduite (80 lignes max)
  const res = await withTimeout(
    sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges: [
        "'Employés'!A2:D80", // id, nom, poste, tel
        "'Employés'!F2:I80"  // ancienneté, CA, stock, salaire
      ],
      valueRenderOption: 'UNFORMATTED_VALUE'
    }),
    SHEETS_TIMEOUT_MS,
    "Sheets get employeesFull"
  );

  const vr = res.data.valueRanges || [];
  const abcd = vr[0]?.values || [];
  const fghi = vr[1]?.values || [];

  const employeesFull = [];
  for (let i = 0; i < abcd.length; i++) {
    const r1 = abcd[i] || [];
    const r2 = fghi[i] || [];

    if (!r1[1]) continue;

    employeesFull.push({
      id: String(r1[0] ?? ''),
      name: String(r1[1] ?? '').trim(),
      role: String(r1[2] ?? ''),
      phone: String(r1[3] ?? ''),
      seniority: Number(r2[0] ?? 0),
      ca: Number(r2[1] ?? 0),
      stock: Number(r2[2] ?? 0),
      salary: Number(r2[3] ?? 0),
    });
  }

  return {
    success: true,
    version: APP_VERSION,
    employees: employeesFull.map(e => e.name),
    employeesFull,
    products: Object.values(PRODUCTS_CAT).flat(),
    productsByCategory: PRODUCTS_CAT,
    prices: PRICE_LIST,
    partners: PARTNERS,
    vehicles: ['Grotti Brioso Fulmin - 819435','Taco Van - 642602','Taco Van - 570587','Rumpobox - 34217'],
  };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, data } = body;

    // ✅ GET META avec cache
    if (!action || action === 'getMeta' || action === 'syncData') {
      const now = Date.now();
      const cache = globalThis.__HENHOUSE_CACHE__;

      if (cache?.meta && (now - cache.ts) < CACHE_TTL_MS) {
        return NextResponse.json(cache.meta);
      }

      const meta = await buildMetaFromSheets();
      globalThis.__HENHOUSE_CACHE__ = { ts: now, meta };

      return NextResponse.json(meta);
    }

    let embed = {
      timestamp: new Date().toISOString(),
      footer: { text: `Hen House Management v${APP_VERSION}` },
      color: 0xff9800
    };

    switch (action) {
      case 'sendFactures': {
        const totalFact = data.items?.reduce((a, i) => a + (Number(i.qty) * (PRICE_LIST[i.desc] || 0)), 0);
        embed.title = `📑 Vente de ${data.employee}`;
        embed.fields = [
          { name: '🧾 Facture n°', value: `\`${data.invoiceNumber}\``, inline: true },
          { name: '💰 Total', value: `**${totalFact}${CURRENCY.symbol}**`, inline: true },
          { name: '📋 Articles', value: data.items?.map(i => `🔸 x${i.qty} ${i.desc}`).join('\n') }
        ];
        await sendDiscordWebhook(WEBHOOKS.factures, { embeds: [embed] });
        await updateEmployeeStats(data.employee, totalFact, 'CA');
        // ✅ invalide cache pour forcer refresh prochain loadData
        globalThis.__HENHOUSE_CACHE__ = { ts: 0, meta: null };
        break;
      }

      case 'sendProduction': {
        const tProd = data.items?.reduce((s, i) => s + Number(i.qty), 0);
        embed.title = `📦 Production de ${data.employee}`;
        embed.fields = [
          { name: '📊 Total', value: `**${tProd}** unités`, inline: true },
          { name: '🍳 Liste', value: data.items?.map(i => `🍳 x${i.qty} ${i.product}`).join('\n') }
        ];
        await sendDiscordWebhook(WEBHOOKS.stock, { embeds: [embed] });
        await updateEmployeeStats(data.employee, tProd, 'STOCK');
        globalThis.__HENHOUSE_CACHE__ = { ts: 0, meta: null };
        break;
      }

      case 'sendEntreprise': {
        embed.title = `🚚 Livraison Pro de ${data.employee}`;
        embed.fields = [
          { name: '🏢 Client', value: `**${data.company}**`, inline: true },
          { name: '📋 Détails', value: data.items?.map(i => `🏢 x${i.qty} ${i.product}`).join('\n') }
        ];
        await sendDiscordWebhook(WEBHOOKS.entreprise, { embeds: [embed] });
        break;
      }

      case 'sendExpense': {
        embed.title = `💳 Frais déclaré par ${data.employee}`;
        embed.fields = [
          { name: '🛠️ Type', value: data.kind, inline: true },
          { name: '🚗 Véhicule', value: data.vehicle || 'N/A', inline: true },
          { name: '💵 Montant', value: `**${data.amount}${CURRENCY.symbol}**` }
        ];
        if (data.file) embed.image = { url: 'attachment://preuve.jpg' };
        await sendDiscordWebhook(WEBHOOKS.expenses, { embeds: [embed] }, data.file);
        break;
      }

      case 'sendGarage': {
        embed.title = data.action === 'Sortie' ? `🔑 Sortie par ${data.employee}` : `🅿️ Entrée par ${data.employee}`;
        embed.color = data.action === 'Sortie' ? 0x2ECC71 : 0xE74C3C;
        embed.fields = [
          { name: '🚗 Véhicule', value: `**${data.vehicle}**`, inline: true },
          { name: '⛽ Essence', value: `${data.fuel}%`, inline: true }
        ];
        await sendDiscordWebhook(WEBHOOKS.garage, { embeds: [embed] });
        break;
      }

      case 'sendPartnerOrder': {
        embed.title = `🤝 Contrat Partenaire par ${data.employee}`;
        embed.fields = [
          { name: '🏢 Entreprise', value: data.company, inline: true },
          { name: '🔑 Client', value: data.benef, inline: true },
          { name: '🧾 Facture', value: `\`${data.num}\`` },
          { name: '🍱 Détail', value: data.items?.map(i => `🍱 x${i.qty} ${i.menu}`).join('\n') }
        ];
        const pW = PARTNERS.companies[data.company]?.webhook || WEBHOOKS.factures;
        await sendDiscordWebhook(pW, { embeds: [embed] });
        break;
      }

      case 'sendSupport': {
        embed.title = `🆘 Ticket de ${data.employee}`;
        embed.fields = [{ name: '📌 Sujet', value: data.sub }];
        embed.description = `**Message :**\n${data.msg}`;
        await sendDiscordWebhook(WEBHOOKS.support, { embeds: [embed] });
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
