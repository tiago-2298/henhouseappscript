import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= DONNÉES HEN HOUSE =================
const APP_VERSION = '2025.11.14'; // J'ai monté la version pour être sûr que ça update
const CURRENCY = { symbol: '$', code: 'USD' };

// TES WEBHOOKS DISCORD
const WEBHOOKS = {
  factures:   'https://discord.com/api/webhooks/1412851967314759710/wkYvFM4ek4ZZHoVw_t5EPL9jUv7_mkqeLJzENHw6MiGjHvwRknAHhxPOET9y-fc1YDiG',
  stock:      'https://discord.com/api/webhooks/1389343371742412880/3OGNAmoMumN5zM2Waj8D2f05gSuilBi0blMMW02KXOGLNbkacJs2Ax6MYO4Menw19dJy',
  entreprise: 'https://discord.com/api/webhooks/1389356140957274112/6AcD2wMTkn9_1lnZNpm4fOsXxGk0sZR5us-rWSrbdTBScu6JYbMtWi31No6wbepeg607',
  garage:     'https://discord.com/api/webhooks/1392213573668962475/uAp9DZrX3prvwTk050bSImOSPXqI3jxxMXm2P8VIFQvC5Kwi5G2RGgG6wv1H5Hp0sGX9',
  expenses:   'https://discord.com/api/webhooks/1365865037755056210/9k15GPoBOPbSlktv3HH9wzcR3VMrrO128HIkGuDqCdzR8qKpdGbMf2sidbemUnAdxI-R',
  support:    'https://discord.com/api/webhooks/1424558367938183168/ehfzI0mB_aWYXz7raPsQQ8x6KaMRPe7mNzvtdbg73O6fb9DyR7HdFll1gpR7BNnbCDI_',
};

const PRODUCTS = {
  plats_principaux: ['Boeuf bourguignon','Saumon Grillé','Quiche aux légumes','Crousti-Douce','Wings épicé','Filet Mignon','Poulet Rôti','Paella Méditerranéenne','Ribbs',"Steak 'Potatoes",'Rougail Saucisse'],
  desserts: ['Brochettes de fruits frais','Mousse au café','Tiramisu Fraise','Los Churros Caramel','Tourte Myrtille'],
  boissons: ['Café','Jus de raisin rouge','Cidre Pression','Berry Fizz',"Jus d'orange",'Jus de raisin blanc','Agua Fresca Pasteque','Vin rouge chaud',"Lait de poule",'Cappuccino','Bière','Lutinade'],
  menus: ['Menu Le Nid Végé','Menu Grillé du Nord','Menu Fraîcheur Méditerranéenne',"Menu Flamme d OR",'Menu Voyage Sucré-Salé','Menu Happy Hen House'],
  menus_groupe: ['Menu Le Nid Végé 5+1','Menu Grillé du Nord 5+1','Menu Fraîcheur Méditerranéenne 5+1',"Menu Flamme d OR 5+1",'Menu Voyage Sucré-Salé 5+1','Menu Happy Hen House 5+1'],
  alcools: ['Cocktail Citron-Myrtille','Verre de Bellini','Verre de Vodka','Verre de Rhum','Verre de Cognac','Verre de Brandy','Verre de Whisky','Verre de Gin','Tequila Citron','Verre Vin Blanc','Verre Vin Rouge','Shot de Tequila','Verre de Champagne','Bouteille de Cidre','Gin Fizz Citron','Bouteille de Champagne','Verre de rosé','Verre de Champomax'],
  services: ['Livraison NORD','Livraison SUD']
};

const PRICE_LIST = {
  'Boeuf bourguignon':50,'Saumon Grillé':35,'Quiche aux légumes':30,'Crousti-Douce':50,'Wings épicé':60,'Filet Mignon':50,'Poulet Rôti':60,'Paella Méditerranéenne':50,'Ribbs':50,"Steak 'Potatoes":50,'Rougail Saucisse':50,
  'Brochettes de fruits frais':25,'Mousse au café':25,'Tiramisu Fraise':30,'Los Churros Caramel':35,'Tourte Myrtille':35,
  'Café':15,'Jus de raisin rouge':30,'Cidre Pression':10,'Berry Fizz':30,"Jus d'orange":35,'Jus de raisin blanc':30,'Agua Fresca Pasteque':30,"Vin rouge chaud":25,'Lait de poule':30,'Cappuccino':15,'Bière':20, 'Lutinade':20,
  'Menu Le Nid Végé':70,'Menu Grillé du Nord':80,'Menu Fraîcheur Méditerranéenne':95,'Menu Voyage Sucré-Salé':100,'Menu Flamme d OR':110,'Menu Happy Hen House':110,
  'Menu Le Nid Végé 5+1':350,'Menu Grillé du Nord 5+1':400,'Menu Fraîcheur Méditerranéenne 5+1':475,'Menu Voyage Sucré-Salé 5+1':500,'Menu Flamme d OR 5+1':550,'Menu Happy Hen House 5+1':550,
  'Cocktail Citron-Myrtille':40,'Verre de Bellini':25,'Verre de Vodka':45,'Verre de Rhum':45,'Verre de Cognac':45,'Verre de Brandy':50,'Verre de Whisky':40,'Verre de Gin':60,'Tequila Citron':50,'Verre Vin Blanc':35,'Verre Vin Rouge':35,'Shot de Tequila':40,'Verre de Champagne':15,'Bouteille de Champagne':100,'Bouteille de Cidre':40,'Gin Fizz Citron':80,'Verre de rosé':25,'Verre de Champomax':30,
  'Livraison NORD':100,'Livraison SUD':150
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
  if (!url) { console.error("Webhook manquant !"); return; }
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) { console.error("Erreur Webhook:", e); }
}

// --- GESTION GOOGLE SHEETS ---
async function getAuthSheets() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    return google.sheets({ version: 'v4', auth });
}

// ✅ CORRECTION MAJEURE ICI : Lecture brute des chiffres
async function updateEmployeeStats(employeeName, amountToAdd, type) {
    try {
        const sheets = await getAuthSheets();
        const sheetId = process.env.GOOGLE_SHEET_ID;

        // 1. Lire les noms (Col B) pour trouver la ligne
        const listRes = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'B2:B100',
        });
        
        const rows = listRes.data.values || [];
        // On cherche le nom EXACT (en retirant les espaces inutiles)
        const rowIndex = rows.findIndex(r => r[0] && r[0].trim() === employeeName.trim());

        if (rowIndex === -1) {
            console.error(`Employé introuvable: ${employeeName}`);
            return; 
        }

        const realRow = rowIndex + 2; // Conversion index -> numéro de ligne Excel

        // 2. Colonne à modifier : G pour CA, H pour Stock
        const targetCell = type === 'CA' ? `G${realRow}` : `H${realRow}`;

        // 3. Lire la valeur actuelle EN MODE BRUT (UNFORMATTED_VALUE)
        // Cela permet de récupérer "100" au lieu de "$100.00"
        const cellRes = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: targetCell,
            valueRenderOption: 'UNFORMATTED_VALUE' 
        });
        
        // On s'assure que c'est un nombre
        let currentValue = cellRes.data.values?.[0]?.[0];
        if (!currentValue || isNaN(Number(currentValue))) {
            currentValue = 0;
        }
        currentValue = Number(currentValue);

        const newValue = currentValue + Number(amountToAdd);

        // 4. Écrire la nouvelle valeur
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: targetCell,
            valueInputOption: 'RAW',
            requestBody: { values: [[newValue]] }
        });

        console.log(`Succès: ${employeeName} | ${type} | Ancien: ${currentValue} + Ajout: ${amountToAdd} = Nouveau: ${newValue}`);

    } catch (e) {
        console.error("Erreur CRITIQUE update Sheet:", e);
    }
}

async function getEmployeesFromGoogle() {
  try {
    const sheets = await getAuthSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'B2:B', 
    });
    const rows = response.data.values;
    if (!rows) return [];
    return rows.map(r => r[0]).filter(n => n && n.trim() !== '').sort((a,b)=>a.localeCompare(b,'fr'));
  } catch (error) {
    console.error("Erreur Google:", error);
    return [];
  }
}

// ================= ROUTEUR API PRINCIPAL =================
export async function POST(request) {
  try {
    let body = {};
    try { body = await request.json(); } catch (e) {}

    const { action, data } = body;

    // --- INITIALISATION ---
    if (!action || action === 'getMeta') {
       const employees = await getEmployeesFromGoogle();
       return NextResponse.json({
        success: true,
        version: APP_VERSION,
        employees,
        products: Object.values(PRODUCTS).flat(),
        productsByCategory: PRODUCTS,
        prices: PRICE_LIST,
        vehicles: VEHICLES,
        partners: PARTNERS,
        currencySymbol: CURRENCY.symbol
      });
    }

    // --- 2. FACTURES ---
    if (action === 'sendFactures') {
      const items = data.items || [];
      const invoiceNumber = data.invoiceNumber || '???';
      
      let grandTotal = 0;
      const fields = items.map(i => {
        const qty = Math.floor(Number(i.qty));
        const price = Number(PRICE_LIST[i.desc] || 0);
        const total = qty * price;
        grandTotal += total;
        return { name: `${i.desc} ×${qty}`, value: `${formatAmount(price)} → **${formatAmount(total)}**`, inline: false };
      });

      const embed = {
        title: `🍽️ Facture N°${invoiceNumber}`,
        description: `Déclaration de ${data.employee}`,
        color: 0xd35400,
        fields: [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '💰 Total', value: `**${formatAmount(grandTotal)}**`, inline: true },
          { name: '📊 Articles', value: `${items.length}`, inline: true },
          ...fields
        ],
        footer: { text: `Hen House v${APP_VERSION}`, icon_url:'https://i.goopics.net/dskmxi.png' },
        timestamp: new Date().toISOString()
      };

      // 1. Discord
      await sendWebhook(WEBHOOKS.factures, { username: 'Hen House - Factures', embeds: [embed] });
      
      // 2. Google Sheet (Mise à jour CA)
      // On le fait en arrière-plan (sans await bloquant strict) mais on attend quand même pour la réponse
      await updateEmployeeStats(data.employee, grandTotal, 'CA');

      return NextResponse.json({ success: true, message: 'Facture envoyée et CA mis à jour' });
    }

    // --- 3. STOCK ---
    if (action === 'sendProduction') {
      const items = data.items || [];
      const totalQuantity = items.reduce((s,i) => s + Number(i.qty), 0);
      const fields = items.map(i => ({ name: `📦 ${i.product}`, value: `**${i.qty}** unités`, inline: true }));

      const embed = {
        title: '📦 Déclaration de Stock',
        description: `Production par ${data.employee}`,
        color: 0xe67e22,
        fields: [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '📊 Total', value: `**${totalQuantity}**`, inline: true },
          ...fields
        ],
        timestamp: new Date().toISOString()
      };

      await sendWebhook(WEBHOOKS.stock, { username: 'Hen House - Production', embeds: [embed] });
      
      // Mise à jour STOCK sur Google Sheet
      await updateEmployeeStats(data.employee, totalQuantity, 'STOCK');

      return NextResponse.json({ success: true });
    }

    // --- 4. ENTREPRISE ---
    if (action === 'sendEntreprise') {
      const items = data.items || [];
      const totalQuantity = items.reduce((s,i) => s + Number(i.qty), 0);
      const fields = items.map(i => ({ name: `🏭 ${i.product}`, value: `**${i.qty}** unités`, inline: true }));

      const embed = {
        title: '🏭 Déclaration Entreprise',
        description: `Commande ${data.company}`,
        color: 0xf39c12,
        fields: [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🏢 Entreprise', value: data.company, inline: true },
          { name: '📊 Total', value: `**${totalQuantity}**`, inline: true },
          ...fields
        ],
        timestamp: new Date().toISOString()
      };
      await sendWebhook(WEBHOOKS.entreprise, { username: 'Hen House - Entreprise', embeds: [embed] });
      return NextResponse.json({ success: true });
    }

    // --- 5. GARAGE ---
    if (action === 'sendGarage') {
      const colors = {'Entrée':0x2ecc71,'Sortie':0xe74c3c,'Maintenance':0xf39c12,'Réparation':0x9b59b6};
      const embed = {
        title: `🚗 Garage - ${data.action}`,
        description: `Véhicule traité par ${data.employee}`,
        color: colors[data.action] || 0x8e44ad,
        fields: [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🚗 Véhicule', value: data.vehicle, inline: true },
          { name: '⚙️ Action', value: data.action, inline: true },
          { name: '⛽ Essence', value: `${data.fuel}%`, inline: true }
        ],
        timestamp: new Date().toISOString()
      };
      await sendWebhook(WEBHOOKS.garage, { username: 'Hen House - Garage', embeds: [embed] });
      return NextResponse.json({ success: true });
    }

    // --- 6. FRAIS ---
    if (action === 'sendExpense') {
      const embed = {
        title: `💳 Note de frais — ${data.kind}`,
        color: data.kind === 'Essence' ? 0x10b981 : 0x3b82f6,
        fields: [
          { name: '👤 Employé', value: data.employee, inline: true },
          { name: '🚗 Véhicule', value: data.vehicle, inline: true },
          { name: '💵 Montant', value: formatAmount(data.amount), inline: true }
        ],
        timestamp: new Date().toISOString()
      };
      await sendWebhook(WEBHOOKS.expenses, { username: 'Hen House - Dépenses', embeds: [embed] });
      return NextResponse.json({ success: true });
    }

    // --- 7. PARTENAIRES ---
    if (action === 'sendPartnerOrder') {
        const items = data.items || [];
        let total = 0;
        const fields = items.map(i => {
            total += i.qty;
            return { name: i.menu, value: `x${i.qty}`, inline: true };
        });

        const embed = {
            title: `🤝 Partenaires - ${data.company}`,
            description: `Bénéficiaire: **${data.beneficiary}**`,
            color: 0x10b981,
            fields: [
                { name: '👤 Employé', value: data.employee, inline: true },
                { name: '📦 Menus', value: String(total), inline: true },
                ...fields
            ],
            timestamp: new Date().toISOString()
        };
        
        const companyData = PARTNERS.companies[data.company];
        const targetWebhook = companyData ? companyData.webhook : WEBHOOKS.factures;
        
        await sendWebhook(targetWebhook, { username: 'Hen House - Partenaires', embeds: [embed] });
        return NextResponse.json({ success: true });
    }

    // --- 8. SUPPORT ---
    if (action === 'sendSupport') {
        const embed = {
            title: `🆘 Support — ${data.subject}`,
            color: 0xef4444,
            fields: [
                { name: '👤 Employé', value: data.employee, inline: true },
                { name: '📝 Message', value: data.message, inline: false }
            ],
            timestamp: new Date().toISOString()
        };
        await sendWebhook(WEBHOOKS.support, { username: 'Hen House - Support', embeds: [embed] });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Action inconnue' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
