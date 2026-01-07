import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= CONFIGURATION & CONSTANTES =================
const APP_VERSION = '2026.01.02';
const CURRENCY_SYMBOL = '$';

// Tes Webhooks Discord
const WEBHOOKS = {
  factures: 'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock: 'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage: 'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses: 'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support: 'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

// Liste des prix pour calcul automatique du CA
const PRICE_LIST = {
  'Boeuf bourguignon':50,'Saumon Grillé':35,'Quiche aux légumes':30,'Crousti-Douce':50,'Wings épicé':60,'Filet Mignon':50,'Poulet Rôti':60,'Paella Méditerranéenne':50,'Ribbs':50,"Steak 'Potatoes":50,'Rougail Saucisse':50,
  'Brochettes de fruits frais':25,'Mousse au café':25,'Tiramisu Fraise':30,'Los Churros Caramel':35,'Tourte Myrtille':35,
  'Café':15,'Jus de raisin rouge':30,'Cidre Pression':10,'Berry Fizz':30,"Jus d'orange":35,'Jus de raisin blanc':30,'Agua Fresca Pasteque':30,"Vin rouge chaud":25,'Lait de poule':30,'Cappuccino':15,'Bière':20, 'Lutinade':20,
  'Menu Le Nid Végé':70,'Menu Grillé du Nord':80,'Menu Fraîcheur Méditerranéenne':95,'Menu Voyage Sucré-Salé':100,'Menu Flamme d OR':110,'Menu Happy Hen House':110,
  'Menu Le Nid Végé 5+1':350,'Menu Grillé du Nord 5+1':400,'Menu Fraîcheur Méditerranéenne 5+1':475,'Menu Voyage Sucré-Salé 5+1':500,'Menu Flamme d OR 5+1':550,'Menu Happy Hen House 5+1':550,
  'Cocktail Citron-Myrtille':40,'Verre de Bellini':25,'Verre de Vodka':45,'Verre de Rhum':45,'Verre de Cognac':45,'Verre de Brandy':50,'Verre de Whisky':40,'Verre de Gin':60,'Tequila Citron':50,'Verre Vin Blanc':35,'Verre Vin Rouge':35,'Shot de Tequila':40,'Verre de Champagne':15,'Bouteille de Champagne':100,'Bouteille de Cidre':40,'Gin Fizz Citron':80,'Verre de rosé':25,'Verre de Champomax':30,
  'Livraison NORD':100,'Livraison SUD':150
};

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

// ================= UTILS =================
const formatAmount = (n) => `${CURRENCY_SYMBOL}${(Number(n)||0).toFixed(2)}`;

async function getAuthSheets() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  return google.sheets({ version: 'v4', auth });
}

async function updateEmployeeStats(employeeName, amountToAdd, type) {
  try {
    const sheets = await getAuthSheets();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    // On récupère les noms en colonne B
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "'Employés'!B2:B200" });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] && r[0].trim() === employeeName.trim());
    
    if (rowIndex === -1) return;

    const realRow = rowIndex + 2;
    // G = CA (7ème col), H = Stock (8ème col)
    const targetCell = type === 'CA' ? `G${realRow}` : `H${realRow}`;
    
    const cellRes = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: targetCell });
    let currentVal = Number(cellRes.data.values?.[0]?.[0] || 0);
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: targetCell,
      valueInputOption: 'RAW',
      requestBody: { values: [[currentVal + Number(amountToAdd)]] }
    });
  } catch (e) {
    console.error("Erreur mise à jour Sheets:", e);
  }
}

async function sendWebhook(url, payload) {
  try {
    await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
  } catch (e) {
    console.error("Erreur Webhook Discord:", e);
  }
}

// ================= ROUTEUR POST =================
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // --- INITIALISATION & SYNC ---
    if (!action || action === 'getMeta' || action === 'syncData') {
      const sheets = await getAuthSheets();
      const resFull = await sheets.spreadsheets.values.get({ 
        spreadsheetId: process.env.GOOGLE_SHEET_ID, 
        range: "'Employés'!A2:I200", 
        valueRenderOption: 'UNFORMATTED_VALUE' 
      });
      
      const rows = resFull.data.values || [];
      const employeesFull = rows.filter(r => r[1]).map(r => ({
        id: String(r[0] || ''),
        name: String(r[1] || '').trim(),
        role: String(r[2] || ''),
        phone: String(r[3] || ''),
        arrival: String(r[4] || ''),
        seniority: Number(r[5] || 0),
        ca: Number(r[6] || 0),
        stock: Number(r[7] || 0),
        salary: Number(r[8] || 0),
      }));

      return NextResponse.json({
        success: true,
        version: APP_VERSION,
        employees: employeesFull.map(e => e.name),
        employeesFull,
        partners: PARTNERS,
        vehicles: ['Grotti Brioso Fulmin - 819435','Taco Van - 642602','Taco Van - 570587','Rumpobox - 34217']
      });
    }

    // --- TRAITEMENT DES ACTIONS ---
    let embed = { 
      timestamp: new Date().toISOString(), 
      footer: { text: `Hen House v${APP_VERSION}`, icon_url: 'https://i.goopics.net/dskmxi.png' } 
    };

    switch (action) {
      case 'sendFactures':
        let grandTotal = data.items.reduce((acc, i) => acc + (i.qty * (PRICE_LIST[i.desc] || 0)), 0);
        embed.title = `🍽️ Facture N°${data.invoiceNumber}`;
        embed.color = 0xd35400;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '💰 Total', value: `**${formatAmount(grandTotal)}**`, inline: true },
          { name: '📦 Détails', value: data.items.map(i => `• ${i.desc} x${i.qty}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.factures, { embeds: [embed] });
        await updateEmployeeStats(data.employee, grandTotal, 'CA');
        break;

      case 'sendProduction':
        let totalProd = data.items.reduce((s, i) => s + Number(i.qty), 0);
        embed.title = '📦 Déclaration de Stock';
        embed.color = 0xe67e22;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '📊 Total Unités', value: `**${totalProd}**`, inline: true },
          { name: '📝 Produits', value: data.items.map(i => `• ${i.product} : ${i.qty}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.stock, { embeds: [embed] });
        await updateEmployeeStats(data.employee, totalProd, 'STOCK');
        break;

      case 'sendEntreprise':
        embed.title = '🏭 Commande Entreprise';
        embed.color = 0xf39c12;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🏢 Entreprise', value: data.company, inline: true },
          { name: '📋 Commande', value: data.items.map(i => `• ${i.product} x${i.qty}`).join('\n') }
        ];
        await sendWebhook(WEBHOOKS.entreprise, { embeds: [embed] });
        break;

      case 'sendGarage':
        embed.title = `🚗 Garage - ${data.action}`;
        embed.color = data.action === 'Entrée' ? 0x2ecc71 : 0xe74c3c;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🚗 Véhicule', value: data.vehicle, inline: true },
          { name: '⛽ Essence', value: `${data.fuel}%`, inline: true }
        ];
        await sendWebhook(WEBHOOKS.garage, { embeds: [embed] });
        break;

      case 'sendExpense':
        embed.title = `💳 Note de frais - ${data.kind}`;
        embed.color = 0x3498db;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '💵 Montant', value: formatAmount(data.amount), inline: true },
          { name: '🚗 Véhicule', value: data.vehicle, inline: true }
        ];
        await sendWebhook(WEBHOOKS.expenses, { embeds: [embed] });
        break;

      case 'sendPartnerOrder':
        const partnerCompany = PARTNERS.companies[data.company];
        const partnerWebhook = partnerCompany?.webhook || WEBHOOKS.factures;
        embed.title = `🤝 Partenaire - ${data.company}`;
        embed.color = 0x10b981;
        embed.fields = [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🔑 Bénéficiaire', value: data.beneficiary, inline: true },
          { name: '🧾 Facture N°', value: data.invoiceNumber, inline: true },
          { name: '🍱 Menus', value: data.items.map(i => `• ${i.menu} x${i.qty}`).join('\n') }
        ];
        await sendWebhook(partnerWebhook, { embeds: [embed] });
        break;

      case 'sendSupport':
        embed.title = `🆘 Support - ${data.subject}`;
        embed.color = 0xef4444;
        embed.description = `**Message :**\n${data.message}`;
        embed.fields = [{ name: '👤 De', value: data.employee, inline: true }];
        await sendWebhook(WEBHOOKS.support, { embeds: [embed] });
        break;

      default:
        return NextResponse.json({ success: false, message: 'Action inconnue' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CRITICAL API ERROR:", err);
    // On renvoie toujours du JSON pour éviter l'erreur "Unexpected token <"
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Erreur interne du serveur" 
    }, { status: 500 });
  }
}

