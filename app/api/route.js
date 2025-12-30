import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// ================= 1. DONNÉES HEN HOUSE =================
const APP_VERSION = '2025.11.13';
const CURRENCY = { symbol: '$', code: 'USD' };
const ENTERPRISES = { 'Hen House': { discount: 0 } };

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
      menus: [{ name: 'Wings + Berry Fizz', catalog: 80 }, { name: 'Ribbs + Agua Fresca Pastèque', catalog: 70 }, { name: 'Saumon + Jus de raisin rouge + Churros Caramel', catalog: 65 }, { name: 'Paella + Jus de raisin blanc', catalog: 65 }]
    },
    'SASP Nord': {
      beneficiaries: [ 'Agent SASP NORD' ],
      menus: [{ name: 'Steak Potatoes + Jus de raisin Blanc', catalog: 65 }, { name: 'Ribs + Berry Fizz', catalog: 65 }]
    },
  },
};

// ================= 2. FONCTIONS UTILES =================

function formatAmount(n) { return `${CURRENCY.symbol}${(Number(n)||0).toFixed(2)}`; }

async function sendWebhook(url, payload) {
  if (!url) { console.error("Webhook manquant !"); return; }
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) { console.error("Erreur Webhook:", e); }
}

// ✅ FONCTION MODIFIÉE : Lecture Colonne B uniquement
async function getEmployeesFromGoogle() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    
    // CHANGEMENT ICI : On lit 'B2:B' (Toute la colonne B à partir de la ligne 2)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'B2:B', 
    });

    const rows = response.data.values;
    if (!rows) return [];

    // On mappe uniquement la première colonne trouvée (qui est B)
    return rows.map((row) => ({
      nom: row[0] || '',     // La colonne B
      prenom: '',            // Pas de prénom séparé
    }))
    .filter(emp => emp.nom.trim() !== '') // On retire les lignes vides
    .sort((a, b) => a.nom.localeCompare(b.nom));

  } catch (error) {
    console.error("Erreur Google:", error);
    return [];
  }
}

// ================= 3. ROUTEUR API PRINCIPAL =================
export async function POST(request) {
  try {
    let body = {};
    try { body = await request.json(); } catch (e) {}

    const { action, data } = body;

    // --- INITIALISATION (Liste des employés) ---
    if (!action) {
       const employees = await getEmployeesFromGoogle();
       return NextResponse.json(employees);
    }

    // --- 1. METADATA ---
    if (action === 'getMeta') {
      const employees = await getEmployeesFromGoogle();
      return NextResponse.json({
        success: true,
        version: APP_VERSION,
        employees,
        products: Object.values(PRODUCTS).flat(),
        productsByCategory: PRODUCTS,
        prices: PRICE_LIST,
        vehicles: VEHICLES,
        partners: PARTNERS
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
        footer: { text: `Hen House v${APP_VERSION}` },
        timestamp: new Date().toISOString()
      };

      await sendWebhook(process.env.WEBHOOK_FACTURES, { username: 'Hen House - Factures', embeds: [embed] });
      return NextResponse.json({ success: true, message: 'Facture envoyée' });
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

      await sendWebhook(process.env.WEBHOOK_STOCK, { username: 'Hen House - Production', embeds: [embed] });
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
      await sendWebhook(process.env.WEBHOOK_ENTREPRISE, { username: 'Hen House - Entreprise', embeds: [embed] });
      return NextResponse.json({ success: true });
    }

    // --- 5. GARAGE ---
    if (action === 'sendGarage') {
      const colors = {'Entrée':0x2ecc71,'Sortie':0xe74c3c,'Maintenance':0xf39c12,'Réparation':0x9b59b6};
      const embed = {
        title: `🚗 Garage - ${data.action}`,
        description: `Véhicule
