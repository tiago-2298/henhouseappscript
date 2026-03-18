'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION ---
const MODULES = [
  { id: 'home', l: 'Dashboard', e: '🏠' },
  { id: 'invoices', l: 'Caisse', e: '💰' },
  { id: 'stock', l: 'Stock', e: '📦' },
  { id: 'enterprise', l: 'Entreprise', e: '🏢' },
  { id: 'partners', l: 'Partenaires', e: '🤝' },
  { id: 'expenses', l: 'Frais', e: '💳' },
  { id: 'garage', l: 'Garage', e: '🚗' },
  { id: 'directory', l: 'Annuaire', e: '👥' },
  { id: 'performance', l: 'Perf', e: '🏆' },
  { id: 'rules', l: 'Règlement', e: '📜' }, // <-- LE VOICI
  { id: 'profile', l: 'Profil', e: '👤' },
  { id: 'support', l: 'Support', e: '🆘' }
];

const IMAGES = {
  // --- IMAGES GÉNÉRÉES SÉDUCTRICES (Remplacement Unsplash) ---
  "Lasagne aux légumes": "https://files.catbox.moe/u8u4be.png", // Nouvelle image premium, sombre et fondante
  "Effiloché de Mouton": "https://files.catbox.moe/56m75j.png", // Nouvelle image, viande juteuse sur fond noir
  "Burger Gourmet au Foie Gras": "https://files.catbox.moe/7p4873.png", // Nouvelle image, gros plan sexy et sombre
  "Nectar Exotique": "https://files.catbox.moe/8p59qf.png", // Nouvelle image, couleurs vibrantes sur fond sombre
  "Kombucha Citron": "https://files.catbox.moe/7m45v2.png", // Nouvelle image, fraîche et ténébreuse

  // --- TES IMAGES CATBOX ORIGINALES (Conservées) ---
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Carpaccio Fruit Exotique": "https://files.catbox.moe/cbmjou.png",
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",
};

const NOTIF_MESSAGES = {
  sendFactures: { title: "💰 FACTURE TRANSMISE", msg: "La vente a été enregistrée avec succès !" },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "La production cuisine a été déclarée." },
  sendEntreprise: { title: "🏢 COMMANDE PRO ENVOYÉE", msg: "Le bon de commande entreprise est parti." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "La commande partenaire est enregistrée." },
  sendGarage: { title: "🚗 VÉHICULE ACTUALISÉ", msg: "L'état du véhicule a été mis à jour." },
  sendExpense: { title: "💳 NOTE DE FRAIS", msg: "Vos frais et la preuve ont été transmis." },
  sendSupport: { title: "🆘 SUPPORT CONTACTÉ", msg: "Votre message a été envoyé au patron." },
  sync: { title: "☁️ CLOUD SYNCHRONISÉ", msg: "Les données sont maintenant à jour." }
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [cart, setCart] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [profileWeek, setProfileWeek] = useState('Toutes');
  const [expandedInv, setExpandedInv] = useState(null);
  const [expenseWeek, setExpenseWeek] = useState('Toutes');

  const initialForms = {
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '', file: null },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  };

  const [forms, setForms] = useState(initialForms);

  useEffect(() => {
    const savedUser = localStorage.getItem('hh_user');
    if (savedUser) { setUser(savedUser); setView('app'); }
    const savedCart = localStorage.getItem('hh_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => { localStorage.setItem('hh_cart', JSON.stringify(cart)); }, [cart]);

  const compressImage = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleFileChange = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      notify("ERREUR", "Fichier non supporté", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result);
      setForms(prev => ({ ...prev, expense: { ...prev.expense, file: compressed } }));
      notify("📸 CAPTURE DÉTECTÉE", "Le reçu a été ajouté avec succès.", "success");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handlePaste = (event) => {
      if (currentTab !== 'expenses') return;
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          handleFileChange(blob);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentTab]);

  const playSound = (type) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(); osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(783, now + 0.2); gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(); osc.stop(now + 0.4);
      }
    } catch (e) { }
  };

  const notify = (t, m, s = 'info') => {
    setToast({ t, m, s }); if (s === 'success') playSound('success');
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async (isSync = false) => {
    if (isSync) notify("SYNCHRONISATION", "Mise à jour en cours...", "info");
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if (j.success) {
        setData(j);
        const firstComp = Object.keys(j.partners.companies)[0];
        setForms(f => ({
          ...f,
          expense: { ...f.expense, vehicle: j.vehicles[0] },
          garage: { ...f.garage, vehicle: j.vehicles[0] },
          partner: { ...f.partner, company: firstComp, benef: j.partners.companies[firstComp].beneficiaries[0], items: [{ menu: j.partners.companies[firstComp].menus[0].name, qty: 1 }] }
        }));
        if (isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a, b) => a + b.qty * b.pu, 0)), [cart]);
  // ✅ Gain estimé: 45% du CA (total du ticket)
  const gainEstime = useMemo(() => Math.round(total * 0.45), [total]);

  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    if (val === '') {
      n[idx].qty = '';
    } else {
      const v = parseInt(val);
      if (!isNaN(v) && v >= 0) n[idx].qty = v;
    }
    setCart(n);
  };

  const removeFromCart = (idx) => {
    const n = [...cart];
    n.splice(idx, 1);
    setCart(n);
    playSound('click');
  };

  const send = async (action, payload) => {
    if (sending) return; playSound('click'); setSending(true);
    try {
      const cleanPayload = { ...payload };
      if (action === 'sendFactures') {
        cleanPayload.items = payload.items.map(x => ({ ...x, qty: Number(x.qty) || 0 })).filter(x => x.qty > 0);
      }

      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: { ...cleanPayload, employee: user } }) });
      const j = await r.json();
      if (j.success) {
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success");
        if (action === 'sendFactures') { setCart([]); setForms(prev => ({ ...prev, invoiceNum: '' })); }
        else if (action === 'sendProduction') { setForms(prev => ({ ...prev, stock: [{ product: '', qty: 1 }] })); }
        else if (action === 'sendEntreprise') { setForms(prev => ({ ...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] } })); }
        else if (action === 'sendPartnerOrder') { setForms(prev => ({ ...prev, partner: { ...prev.partner, num: '' } })); }
        else if (action === 'sendExpense') { setForms(prev => ({ ...prev, expense: { ...prev.expense, amount: '', file: null } })); }
        else if (action === 'sendSupport') { setForms(prev => ({ ...prev, support: { ...prev.support, msg: '' } })); }
        loadData();
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("📋 COPIÉ", `Numéro copié : ${text}`, "success");
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        notify("📋 COPIÉ", `Numéro copié : ${text}`, "success");
      } catch {
        notify("ERREUR", "Impossible de copier", "error");
      }
    }
  };

  const requestLogout = () => {
    setConfirmModal({
      title: "DÉCONNEXION",
      msg: "Voulez-vous vraiment fermer votre session ?",
      action: () => {
        localStorage.removeItem('hh_user');
        setView('login');
        setConfirmModal(null);
      }
    });
  };

  const requestClearCart = () => {
    if (cart.length === 0) return;
    setConfirmModal({
      title: "VIDER LE PANIER",
      msg: "Cette action supprimera tous les articles. Continuer ?",
      action: () => {
        setCart([]);
        setConfirmModal(null);
        playSound('click');
      }
    });
  };

  // --- SKELETON LOADER SCREEN ---
  if (loading && !data) return (
    <div className="app bg-mesh">
      <style jsx global>{`
            body { background: #050505; color: #fff; margin:0; font-family: 'Plus Jakarta Sans', sans-serif; overflow:hidden;}
            .bg-mesh { background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%); }
            .sk-dock { width: 90px; height: 95vh; background: rgba(255,255,255,0.05); border-radius: 30px; margin: 2.5vh; }
            .pulse { animation: pulse 1.5s infinite; background: rgba(255,255,255,0.05); border-radius: 12px; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.5; } 100% { opacity: 0.3; } }
        `}</style>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <div className="sk-dock pulse"></div>
        <div style={{ flex: 1, padding: '40px' }}>
          <div className="pulse" style={{ width: 300, height: 60, marginBottom: 30 }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div className="pulse" style={{ height: 150 }}></div>
            <div className="pulse" style={{ height: 150 }}></div>
            <div className="pulse" style={{ height: 150 }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap');
        
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg: #050505; 
            --panel: rgba(20, 20, 20, 0.6); 
            --glass: rgba(255, 255, 255, 0.03);
            --glass-b: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --radius: 24px; 
            --success: #10b981; 
            --error: #ef4444; 
        }
        
        * { box-sizing: border-box; margin:0; padding:0; outline: none; -webkit-tap-highlight-color: transparent; }
        
        /* Background Mesh Animation */
        body { 
            background-color: var(--bg);
            background-image: 
                radial-gradient(at 0% 0%, rgba(255,152,0,0.08) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(100,50,255,0.08) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(0,255,150,0.05) 0px, transparent 50%);
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .app { display: flex; height: 100vh; width: 100vw; position: relative; }
        
        /* --- DOCK SIDEBAR --- */
        .dock-container {
            padding: 20px;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .dock { 
            width: 90px; 
            height: 96vh;
            background: rgba(10, 10, 10, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-b);
            border-radius: 40px; 
            display: flex; 
            flex-direction: column; 
            align-items: center;
            padding: 30px 0;
            transition: width 0.3s;
            z-index: 100;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        
        .dock:hover { width: 240px; }
        .dock:hover .nav-label { opacity: 1; transform: translateX(0); display: block; }
        .dock:hover .nav-icon { margin-right: 15px; }
        .dock:hover .logo-img { height: 60px; margin-bottom: 30px; }
        
        .logo-box { margin-bottom: 20px; transition: 0.3s; }
        .logo-img { height: 40px; transition: 0.3s; filter: drop-shadow(0 0 10px rgba(255,152,0,0.3)); }

        .nav-btn { 
            display: flex; 
            align-items: center; 
            justify-content: center; /* Centered by default for icon */
            width: 80%; 
            padding: 14px; 
            margin-bottom: 8px; 
            border-radius: 18px; 
            border: 1px solid transparent;
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            transition: 0.3s; 
            position: relative;
            overflow: hidden;
        }
        .dock:hover .nav-btn { justify-content: flex-start; padding-left: 20px; } /* Align left on expand */

        .nav-icon { font-size: 1.5rem; transition: 0.3s; z-index: 2; }
        .nav-label { font-size: 0.95rem; font-weight: 700; opacity: 0; transform: translateX(-10px); transition: 0.3s; white-space: nowrap; z-index: 2; display: none; }
        
        .nav-btn:hover { background: var(--glass); color: #fff; }
        .nav-btn.active { 
            background: linear-gradient(135deg, var(--p), #ffb74d); 
            color: #000; 
            box-shadow: 0 10px 25px var(--p-glow);
            border: none;
        }
        .nav-btn:active { transform: scale(0.95); }

        .dock-footer { margin-top: auto; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .tool-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; opacity: 0.5; transition: 0.3s; }
        .dock:hover .tool-row { opacity: 1; }
        .tool-btn { width: 35px; height: 35px; border-radius: 50%; background: var(--glass); border: 1px solid var(--glass-b); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .tool-btn:hover { background: var(--p); color: #000; transform: scale(1.1); }

        .user-pill {
            background: rgba(0,0,0,0.4); border: 1px solid var(--glass-b);
            padding: 8px; border-radius: 50px; display: flex; align-items: center; gap: 10px;
            width: 50px; height: 50px; overflow: hidden; transition: 0.3s; cursor: pointer;
        }
        .dock:hover .user-pill { width: 90%; padding: 8px 15px; border-radius: 20px; height: auto; }
        .user-avatar { width: 32px; height: 32px; background: var(--p); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000; flex-shrink: 0; }
        .user-info { display: none; white-space: nowrap; }
        .dock:hover .user-info { display: block; }
        .u-name { font-size: 0.8rem; font-weight: 800; display: block; }
        .u-role { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; }

        /* --- MAIN AREA --- */
        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; scroll-behavior: smooth; }
        .fade-in { animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- CARDS & GRID --- */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        
        .card { 
            height: 220px;
            background: var(--panel); 
            border: 1px solid var(--glass-b); 
            border-radius: 24px; 
            cursor: pointer; 
            position: relative; 
            overflow: hidden; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card:hover { transform: translateY(-8px) scale(1.02); border-color: var(--p); box-shadow: 0 20px 40px var(--p-glow); }
        .card:active { transform: scale(0.98); }
        
        .card-img-bg { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .card:hover .card-img-bg { transform: scale(1.1); }
        
        .card-overlay {
            position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.5) 50%, transparent 100%);
            display: flex; flex-direction: column; justify-content: flex-end; padding: 15px;
        }
        
        .card-title { font-weight: 800; font-size: 0.95rem; line-height: 1.2; margin-bottom: 5px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .card-price { color: var(--p); font-weight: 900; font-size: 1.2rem; text-shadow: 0 0 15px var(--p); }
        
        .card-qty { 
            position: absolute; top: 10px; right: 10px; 
            background: var(--p); color: #000; 
            width: 28px; height: 28px; border-radius: 50%; 
            font-size: 0.8rem; font-weight: 900; 
            display: flex; align-items: center; justify-content: center; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 10;
        }

        /* --- FORMS --- */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { 
            width: 100%; max-width: 500px; 
            background: rgba(15, 15, 15, 0.6); 
            backdrop-filter: blur(30px); 
            padding: 40px; 
            border-radius: 40px; 
            border: 1px solid var(--glass-b); 
            box-shadow: 0 30px 80px rgba(0,0,0,0.6); 
            position: relative; overflow: hidden;
        }
        .form-ui::before {
            content:''; position: absolute; top:0; left:0; right:0; height: 4px;
            background: linear-gradient(90deg, transparent, var(--p), transparent);
        }

        .inp { 
            width: 100%; padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid var(--glass-b); 
            background: rgba(0,0,0,0.3); 
            color: #fff; font-weight: 600; font-size: 0.95rem;
            margin-bottom: 15px; transition: 0.3s; 
        }
        .inp:focus { border-color: var(--p); box-shadow: 0 0 20px rgba(255, 152, 0, 0.15); background: rgba(0,0,0,0.5); }
        
        /* STYLE POUR LES SELECT EN NOIR */
        select.inp { background-color: #000 !important; color: #fff; }
        option { background-color: #000; color: #fff; }

        .btn-p { 
            background: var(--p); color: #000; border:none; 
            padding: 18px; border-radius: 18px; 
            font-weight: 900; font-size: 1rem; letter-spacing: 0.5px;
            cursor: pointer; width: 100%; transition: 0.3s; 
            box-shadow: 0 10px 25px var(--p-glow); text-transform: uppercase;
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 35px var(--p-glow); }
        .btn-p:active { transform: scale(0.97); }
        .btn-p:disabled { background: #333; color: #666; box-shadow: none; transform: none; cursor: not-allowed; }

        /* --- CART (Digital Ticket) --- */
        .cart-panel { 
            width: 360px; 
            background: #111; 
            border-left: 1px solid var(--glass-b); 
            display: flex; flex-direction: column; 
            box-shadow: -10px 0 50px rgba(0,0,0,0.5);
            z-index: 50;
        }
        .cart-header { padding: 30px; background: #0a0a0a; border-bottom: 1px dashed #333; text-align: center; }
        .cart-title { font-weight: 900; font-size: 1.2rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 5px; }
        .cart-total-display { font-size: 2.5rem; color: var(--p); font-weight: 900; text-shadow: 0 0 20px rgba(255, 152, 0, 0.3); }

        .cart-items { flex: 1; overflow-y: auto; padding: 20px; }
        .cart-item { 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 15px; margin-bottom: 10px; 
            background: #181818; border-radius: 16px; border: 1px solid #252525;
            transition: 0.2s;
        }
        .cart-item:hover { border-color: #444; }
        
        .qty-control { display: flex; align-items: center; background: #000; border-radius: 10px; padding: 2px; border: 1px solid #333; }
        .qty-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); font-weight: 900; background: transparent; border: none; }
        .qty-btn:hover { color: #fff; }
        
        .qty-input { 
            width: 40px; background: transparent; border: none; color: #fff; 
            text-align: center; font-weight: 700; font-size: 0.9rem;
            -moz-appearance: textfield;
        }
        .qty-input::-webkit-outer-spin-button, .qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        
        .del-btn { color: var(--error); background: rgba(239, 68, 68, 0.1); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: 0.2s; margin-left: 10px;}
        .del-btn:hover { background: var(--error); color: #fff; }

        .cart-footer { padding: 30px; background: #0a0a0a; border-top: 1px dashed #333; }
        
        /* --- CHIPS --- */
        .chips-container { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 10px; }
        .chip { 
            padding: 10px 24px; border-radius: 100px; 
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-b); 
            color: var(--muted); font-weight: 700; font-size: 0.85rem; 
            cursor: pointer; transition: 0.3s; white-space: nowrap; 
        }
        .chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .chip.active { background: var(--p); color: #000; border-color: var(--p); box-shadow: 0 5px 20px var(--p-glow); }

        /* --- DASHBOARD WIDGETS --- */
        .stat-card {
            padding: 30px; border-radius: 30px; 
            background: rgba(20,20,20,0.5); border: 1px solid var(--glass-b);
            display: flex; align-items: center; gap: 20px;
            transition: 0.3s;
        }
        .stat-card:hover { background: rgba(30,30,30,0.8); transform: translateY(-5px); border-color: rgba(255,255,255,0.1); }
        .stat-icon { width: 60px; height: 60px; border-radius: 20px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--muted); letter-spacing: 1px; font-weight: 700; margin-bottom: 5px; }
        .stat-val { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1; }
        
        /* --- TOAST & MODAL --- */
        .toast { 
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%); 
            padding: 15px 30px; border-radius: 50px; 
            z-index: 9999; animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            box-shadow: 0 20px 50px rgba(0,0,0,0.6); 
            display: flex; align-items: center; gap: 15px;
            font-weight: 700; border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        @keyframes slideDown { from { transform: translate(-50%, -100%); } to { transform: translate(-50%, 0); } }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .modal-box { background: #151515; border: 1px solid var(--glass-b); padding: 40px; border-radius: 30px; width: 90%; max-width: 420px; text-align: center; box-shadow: 0 50px 100px rgba(0,0,0,0.8); transform: scale(0.9); animation: popIn 0.3s forwards; }
        @keyframes popIn { to { transform: scale(1); } }
      `}</style>

      {view === 'login' ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          <div className="form-ui" style={{ textAlign: 'center', maxWidth: 420 }}>
            <div style={{ marginBottom: 30, filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.5))' }}>
              <img src="https://i.goopics.net/dskmxi.png" height="120" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 5 }}>HEN HOUSE</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 40, letterSpacing: '2px', textTransform: 'uppercase' }}>Secure Employee Terminal</p>
            <select className="inp" value={user} onChange={e => setUser(e.target.value)} style={{ textAlign: 'center' }}>
              <option value="">SELECTIONNER IDENTITÉ</option>
              {data?.employees.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={() => { playSound('success'); localStorage.setItem('hh_user', user); setView('app'); }} disabled={!user}>CONNEXION</button>
          </div>
        </div>
      ) : (
        <>
          <div className="dock-container">
            <aside className="dock">
              <div className="logo-box"><img src="https://i.goopics.net/dskmxi.png" className="logo-img" /></div>

              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', overflowX: 'hidden' }}>
                {MODULES.map(t => (
                  <button key={t.id} className={`nav-btn ${currentTab === t.id ? 'active' : ''}`} onClick={() => { playSound('click'); setCurrentTab(t.id); setSearch(''); }}>
                    <span className="nav-icon">{t.e}</span>
                    <span className="nav-label">{t.l}</span>
                  </button>
                ))}
              </div>

              <div className="dock-footer">
                <div className="tool-row">
                  <button className="tool-btn" title="Reload" onClick={() => window.location.reload()}>↻</button>
                  <button className="tool-btn" title="Sync" onClick={() => loadData(true)}>☁️</button>
                  <button className="tool-btn" title="Mute" onClick={() => { setIsMuted(!isMuted); playSound('click'); }}>{isMuted ? '🔇' : '🔊'}</button>
                </div>
                <div className="user-pill" onClick={requestLogout}>
                  <div className="user-avatar">{user.charAt(0)}</div>
                  <div className="user-info">
                    <span className="u-name">{user.split(' ')[0]}</span>
                    <span className="u-role">{myProfile?.role || 'Staff'}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <main className="main">
            <div className="fade-in" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                  
                  {/* HEADER IMMERSIF */}
                  <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'end', borderBottom: '1px solid var(--glass-b)', paddingBottom: 25 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                        <span style={{ color: 'var(--success)', fontWeight: 800, letterSpacing: '2px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Connexion Sécurisée • Réseau Hen House
                        </span>
                      </div>
                      <h1 style={{ fontSize: '3.2rem', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1, color: '#fff' }}>
                        {new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'}, {user.split(' ')[0]}.
                      </h1>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 12 }}>
                        <span style={{ background: 'var(--p)', color: '#000', padding: '4px 12px', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                          {myProfile?.role || 'Employé'}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                          Vos indicateurs de performance sont à jour.
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ color: 'var(--p)', fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize', marginTop: 5 }}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </div>

                  {/* 1. BUREAU DE LA DIRECTION (ANNONCES EN HAUT) */}
                  <div style={{ marginBottom: 45 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase' }}>BUREAU DE LA DIRECTION</h3>
                      <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, var(--glass-b), transparent)' }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                      {/* Annonce Primes */}
                      <div style={{ background: 'rgba(255, 152, 0, 0.08)', border: '1px solid rgba(255, 152, 0, 0.3)', padding: '20px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(255, 152, 0, 0.5))' }}>🏆</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontWeight: 900, color: 'var(--p)', letterSpacing: '1px', fontSize: '1.1rem' }}>LE PODIUM DES PRIMES</span>
                            <span style={{ fontSize: '0.7rem', color: '#000', background: 'var(--p)', fontWeight: 800, padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>Épinglé</span>
                          </div>
                          <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Pour rappel, les primes seront versées aux <strong>3 meilleurs du classement</strong>, à condition de respecter les critères suivants :<br/>
                            <span style={{ color: '#10b981', fontWeight: 900 }}>✅ Assiduité :</span> Vos heures de service doivent être complètes.<br/>
                            <span style={{ color: '#10b981', fontWeight: 900 }}>✅ Performance :</span> Un quota minimum de 25 factures validées est requis.
                          </div>
                        </div>
                      </div>

                      {/* Alerte Règlement */}
                      <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '20px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))' }}>📜</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontWeight: 900, color: '#ef4444', letterSpacing: '1px', fontSize: '1.1rem' }}>CONSULTATION DU RÈGLEMENT</span>
                            <span style={{ fontSize: '0.7rem', color: '#fff', background: '#ef4444', fontWeight: 800, padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>Important</span>
                          </div>
                          <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            N'oubliez pas d'aller lire le <strong style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setCurrentTab('rules')}>Règlement Intérieur</strong> dans la section dédiée de votre terminal. Le respect de ces règles (notamment la Clause XIV sur les TacoVans) est <strong>obligatoire</strong>.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. STATISTIQUES (INDICATEURS) */}
                  <div style={{ marginBottom: 45 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                      <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase' }}>VOS INDICATEURS</h3>
                      <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, var(--glass-b), transparent)' }}></div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div className="stat-icon" style={{ color: 'var(--p)', width: 45, height: 45, fontSize: '1.5rem' }}>💰</div>
                          <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: 8 }}>Ventes</div>
                        </div>
                        <div>
                          <div className="stat-val" style={{ fontSize: '2.2rem' }}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                          <div className="stat-label" style={{ marginTop: 5 }}>Chiffre d'Affaires Généré</div>
                        </div>
                      </div>

                      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div className="stat-icon" style={{ color: '#10b981', width: 45, height: 45, fontSize: '1.5rem' }}>📦</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 800, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 8 }}>Cuisine</div>
                        </div>
                        <div>
                          <div className="stat-val" style={{ fontSize: '2.2rem', color: '#10b981' }}>{myProfile?.stock?.toLocaleString?.() ?? myProfile?.stock}</div>
                          <div className="stat-label" style={{ marginTop: 5 }}>Articles Préparés</div>
                        </div>
                      </div>

                      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div className="stat-icon" style={{ color: '#6366f1', width: 45, height: 45, fontSize: '1.5rem' }}>💶</div>
                          <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800, background: 'rgba(99,102,241,0.1)', padding: '4px 8px', borderRadius: 8 }}>Projection</div>
                        </div>
                        <div>
                          <div className="stat-val" style={{ fontSize: '2.2rem' }}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                          <div className="stat-label" style={{ marginTop: 5 }}>Salaire Prévisionnel Brut</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. APPLICATIONS MÉTIER (PLUS PETITES) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase' }}>APPLICATIONS MÉTIER</h3>
                    <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, var(--glass-b), transparent)' }}></div>
                  </div>
                  
                  {/* J'ai forcé ici une grille plus petite pour les tuiles */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 15 }}>
                    {MODULES.filter(m => !['home', 'profile', 'performance', 'directory', 'rules'].includes(m.id)).map(m => (
                      <div key={m.id} className="card" onClick={() => setCurrentTab(m.id)} style={{ height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass)', borderRadius: '20px' }}>
                        <span style={{ fontSize: '2rem', marginBottom: 10 }}>{m.e}</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input className="inp" placeholder="Rechercher un plat..." style={{ paddingLeft: 50, marginBottom: 0, background: 'rgba(255,255,255,0.05)' }} onChange={e => setSearch(e.target.value)} />
                      <span style={{ position: 'absolute', left: 20, top: 16, opacity: 0.5, fontSize: '1.2rem' }}>🔍</span>
                    </div>
                  </div>
                  <div className="chips-container">
                    <div className={`chip ${catFilter === 'Tous' ? 'active' : ''}`} onClick={() => setCatFilter('Tous')}>Tous</div>
                    {Object.keys(data.productsByCategory).map(c => (
                      <div key={c} className={`chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</div>
                    ))}
                  </div>
                 <div className="grid">
                    {(() => {
                      const filteredProducts = data.products.filter(p => 
                        (catFilter === 'Tous' || data.productsByCategory[catFilter]?.includes(p)) && 
                        p.toLowerCase().includes(search.toLowerCase())
                      );

                      if (filteredProducts.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px dashed var(--glass-b)', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: '3.5rem', opacity: 0.5, marginBottom: 15 }}>🍽️</div>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', marginBottom: 5 }}>Aucun produit trouvé</h3>
                            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Essayez un autre mot-clé ou changez de catégorie.</p>
                          </div>
                        );
                      }

                      return filteredProducts.map(p => {
                        const cartItem = cart.find(i => i.name === p);
                        return (
                          <div key={p} className="card" onClick={() => {
                            playSound('click');
                            if (cartItem) setCart(cart.map(x => x.name === p ? { ...x, qty: x.qty + 1 } : x));
                            else setCart([...cart, { name: p, qty: 1, pu: data.prices[p] || 0 }]);
                          }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            {IMAGES[p] ? <img src={IMAGES[p]} className="card-img-bg" /> : <div className="card-img-bg" style={{ background: '#222' }}></div>}
                            <div className="card-overlay">
                              <div className="card-title">{p}</div>
                              <div className="card-price">${data.prices[p]}</div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

            {/* ========================================== */}
              {/* EXPENSES (NOTE DE FRAIS & HISTORIQUE FIXÉ)   */}
              {/* ========================================== */}
              {currentTab === 'expenses' && (() => {

                  // --- LOGIQUE DES FRAIS ---
                  const myExpenses = (data.expensesHistory || [])
                      .filter(row => row[1] === user)
                      .map(row => ({
                          date: row[0], type: row[2], vehicle: row[3],
                          amount: Number(row[4] || 0), status: row[5] || '⏳ En attente'
                      }))
                      .sort((a, b) => new Date(b.date) - new Date(a.date));

                  const getWeekNumber = (d) => {
                      const date = new Date(d);
                      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
                      const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
                      const weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
                      return `S${weekNo}`;
                  };

                  const availableExpenseWeeks = [...new Set(myExpenses.map(exp => getWeekNumber(exp.date)))];

                  const displayedExpenses = expenseWeek === 'Toutes' 
                      ? myExpenses 
                      : myExpenses.filter(exp => getWeekNumber(exp.date) === expenseWeek);

                  let totalValide = 0, totalAttente = 0, totalRefuse = 0;
                  displayedExpenses.forEach(exp => {
                      if (exp.status.includes('Validé') || exp.status.includes('✅')) totalValide += exp.amount;
                      else if (exp.status.includes('Refusé') || exp.status.includes('❌')) totalRefuse += exp.amount;
                      else totalAttente += exp.amount;
                  });

                  return (
                    // CONTENEUR GLOBAL VERROUILLÉ EN HAUTEUR
                    <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', maxWidth: '1300px', margin: '0 auto', height: 'calc(100vh - 120px)', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden', alignItems: 'stretch' }}>
                      
                      {/* ========================================== */}
                      {/* COLONNE GAUCHE : FORMULAIRE & SCANNER (SANS SCROLL) */}
                      {/* ========================================== */}
                      <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
                          
                          <div style={{ flexShrink: 0 }}>
                              <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', margin: 0, letterSpacing: '-1px' }}>NOTES DE <span style={{ color: '#3b82f6' }}>FRAIS</span></h1>
                              <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Portail de remboursement interne</p>
                          </div>

                          <div style={{ background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                              <div>
                                  <label style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, display: 'block' }}>Type d'intervention</label>
                                  <div style={{ display: 'flex', gap: 10 }}>
                                      {[{ id: 'Essence', icon: '⛽' }, { id: 'Réparation', icon: '🔧' }, { id: 'Autre', icon: '📄' }].map(k => (
                                          <button key={k.id} style={{ flex: 1, padding: '12px 5px', borderRadius: '16px', border: '1px solid', background: forms.expense.kind === k.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', borderColor: forms.expense.kind === k.id ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: forms.expense.kind === k.id ? '#fff' : 'var(--muted)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }} onClick={() => setForms({ ...forms, expense: { ...forms.expense, kind: k.id } })}>
                                              <span style={{ fontSize: '1.4rem', filter: forms.expense.kind === k.id ? 'drop-shadow(0 0 10px rgba(59,130,246,0.5))' : 'grayscale(1)' }}>{k.icon}</span>
                                              {k.id}
                                          </button>
                                      ))}
                                  </div>
                              </div>

                              <div style={{ position: 'relative' }}>
                                  <label style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase', position: 'absolute', top: -10, left: 15, background: '#111', padding: '0 8px', zIndex: 2, borderRadius: 4 }}>Véhicule concerné</label>
                                  <select className="inp" value={forms.expense.vehicle} onChange={e => setForms({ ...forms, expense: { ...forms.expense, vehicle: e.target.value } })} style={{ height: 55, fontSize: '0.9rem', fontWeight: 800, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 0 }}>
                                      {data.vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                                  </select>
                              </div>

                              <div style={{ position: 'relative' }}>
                                  <label style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase', position: 'absolute', top: -10, left: 15, background: '#111', padding: '0 8px', zIndex: 2, borderRadius: 4 }}>Montant de la facture</label>
                                  <div style={{ position: 'relative' }}>
                                      <span style={{ position: 'absolute', left: 20, top: 13, fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>$</span>
                                      <input className="inp" type="number" placeholder="0.00" value={forms.expense.amount} onChange={e => setForms({ ...forms, expense: { ...forms.expense, amount: e.target.value } })} style={{ height: 55, fontSize: '1.2rem', fontWeight: 900, paddingLeft: 45, color: '#10b981', borderColor: forms.expense.amount ? '#10b981' : 'rgba(255,255,255,0.1)', marginBottom: 0 }} />
                                  </div>
                              </div>
                          </div>

                          <div style={{ background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '30px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, flexShrink: 0 }}>
                                  <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}><span>📸</span> SCANNER DE REÇU</h3>
                                  <span style={{ fontSize: '0.65rem', color: forms.expense.file ? '#10b981' : 'var(--error)', background: forms.expense.file ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: 8, fontWeight: 900 }}>{forms.expense.file ? 'PREUVE CHARGÉE' : 'REQUIS'}</span>
                              </div>

                              <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => !forms.expense.file && document.getElementById('inpFile').click()} style={{ flex: 1, minHeight: '120px', border: `2px dashed ${dragActive ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: 20, textAlign: 'center', cursor: forms.expense.file ? 'default' : 'pointer', background: dragActive ? 'rgba(59,130,246,0.05)' : 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                                  <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                                  {!forms.expense.file ? (
                                      <div style={{ pointerEvents: 'none' }}>
                                          <div style={{ fontSize: '2.5rem', marginBottom: 10, opacity: 0.5, filter: dragActive ? 'drop-shadow(0 0 15px #3b82f6)' : 'none' }}>📄</div>
                                          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff' }}>Déposez le ticket ici</div>
                                          <div style={{ marginTop: 10, display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 800, color: '#aaa' }}>⌨️ Astuce : Ctrl + V</div>
                                      </div>
                                  ) : (
                                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                          <button style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: '#fff', borderRadius: '10px', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); setForms({ ...forms, expense: { ...forms.expense, file: null } }); }}>✖ SUPPRIMER</button>
                                          <img src={forms.expense.file} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
                                      </div>
                                  )}
                              </div>

                              <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={() => send('sendExpense', forms.expense)} style={{ padding: '20px', fontSize: '1rem', borderRadius: 16, background: (!forms.expense.amount || !forms.expense.file) ? '#222' : 'linear-gradient(90deg, #3b82f6, #2563eb)', color: (!forms.expense.amount || !forms.expense.file) ? '#555' : '#fff', boxShadow: (!forms.expense.amount || !forms.expense.file) ? 'none' : '0 10px 25px rgba(59,130,246,0.4)', border: 'none', cursor: (!forms.expense.amount || !forms.expense.file) ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                                  {sending ? 'TRANSMISSION...' : 'SOUMETTRE LA DEMANDE'}
                              </button>
                          </div>
                      </div>

                      {/* ========================================== */}
                      {/* COLONNE DROITE : HISTORIQUE BLINDÉ         */}
                      {/* ========================================== */}
                      <div style={{ flex: '1 1 500px', height: '100%', background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: `1px solid rgba(255,255,255,0.05)`, boxShadow: `0 30px 80px rgba(0,0,0,0.8)`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          
                          {/* EN-TÊTE FIXE */}
                          <div style={{ padding: '30px 30px 15px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
                              <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span>📊</span> SUIVI DES REMBOURSEMENTS
                              </h2>
                              
                              {availableExpenseWeeks.length > 0 && (
                                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '15px', paddingBottom: '5px' }}>
                                      <button style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--glass-b)', cursor: 'pointer', transition: '0.2s', background: expenseWeek === 'Toutes' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: expenseWeek === 'Toutes' ? '#fff' : 'var(--muted)' }} onClick={() => setExpenseWeek('Toutes')}>
                                          Toutes
                                      </button>
                                      {availableExpenseWeeks.map(w => (
                                          <button key={w} style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--glass-b)', cursor: 'pointer', transition: '0.2s', background: expenseWeek === w ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: expenseWeek === w ? '#fff' : 'var(--muted)' }} onClick={() => setExpenseWeek(w)}>
                                              Semaine {w.replace('S', '')}
                                          </button>
                                      ))}
                                  </div>
                              )}
                          </div>

                          {/* RÉSUMÉ FINANCIER FIXE */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '20px 30px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '15px 10px', textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>✅ Validé</div>
                                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: 5 }}>${totalValide.toLocaleString()}</div>
                              </div>
                              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '15px 10px', textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>⏳ Attente</div>
                                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: 5 }}>${totalAttente.toLocaleString()}</div>
                              </div>
                              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '15px 10px', textAlign: 'center' }}>
                                  <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>❌ Refusé</div>
                                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: 5 }}>${totalRefuse.toLocaleString()}</div>
                              </div>
                          </div>

                          {/* ZONE SCROLLABLE INTERNE (Ne bouge pas le reste de la page) */}
                          <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '20px 30px 30px 30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {displayedExpenses.length === 0 ? (
                                  <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                      <div style={{ fontSize: '3rem', marginBottom: 15 }}>📝</div>
                                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Aucune demande trouvée</div>
                                  </div>
                              ) : (
                                  displayedExpenses.map((exp, idx) => {
                                      const d = new Date(exp.date);
                                      const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                                      
                                      let statusColor = '#f59e0b';
                                      let statusBg = 'rgba(245,158,11,0.1)';
                                      if (exp.status.includes('Validé') || exp.status.includes('✅')) { statusColor = '#10b981'; statusBg = 'rgba(16,185,129,0.1)'; }
                                      if (exp.status.includes('Refusé') || exp.status.includes('❌')) { statusColor = '#ef4444'; statusBg = 'rgba(239,68,68,0.1)'; }

                                      return (
                                          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.2s', flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                                  <div style={{ width: 45, height: 45, borderRadius: '12px', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: `1px solid ${statusBg}` }}>
                                                      {exp.type === 'Essence' ? '⛽' : exp.type === 'Réparation' ? '🔧' : '📄'}
                                                  </div>
                                                  <div>
                                                      <div style={{ fontWeight: 900, color: '#fff', fontSize: '0.95rem' }}>{exp.type}</div>
                                                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, marginTop: 3 }}>Le {dateStr}</div>
                                                  </div>
                                              </div>
                                              
                                              <div style={{ textAlign: 'right' }}>
                                                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>${exp.amount.toLocaleString()}</div>
                                                  <div style={{ fontSize: '0.65rem', color: statusColor, background: statusBg, padding: '4px 8px', borderRadius: '6px', fontWeight: 900, marginTop: 4, display: 'inline-block' }}>
                                                      {exp.status}
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })
                              )}
                          </div>
                      </div>
                    </div>
                  );
              })()}
              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                  <h2 style={{ marginBottom: 30, textAlign: 'center', fontWeight: 900 }}>Stock Cuisine</h2>
                  {forms.stock.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <select className="inp" style={{ flex: 1, marginBottom: 0 }} value={item.product} onChange={e => { const n = [...forms.stock]; n[i].product = e.target.value; setForms({ ...forms, stock: n }); }}><option value="">Sélectionner...</option>{data.products.map(p => <option key={p} value={p}>{p}</option>)}</select>
                      <input type="number" className="inp" style={{ width: 90, marginBottom: 0, textAlign: 'center' }} value={item.qty} onChange={e => { const n = [...forms.stock]; n[i].qty = e.target.value; setForms({ ...forms, stock: n }); }} />
                      {forms.stock.length > 1 && (
                        <button className="del-btn" onClick={() => { const n = [...forms.stock]; n.splice(i, 1); setForms({ ...forms, stock: n }); }}>×</button>
                      )}
                    </div>
                  ))}
                  <button className="inp" style={{ background: 'transparent', border: '1px dashed var(--glass-b)', color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setForms({ ...forms, stock: [...forms.stock, { product: '', qty: 1 }] })}>+ Ajouter Ligne</button>
                  <button className="btn-p" style={{ marginTop: 10 }} onClick={() => send('sendProduction', { items: forms.stock })}>Valider Production</button>
                </div></div>
              )}

            {/* ========================================== */}
              {/* ENTREPRISE (POS TACTILE - PRÉPARATION RAPIDE)*/}
              {/* ========================================== */}
              {currentTab === 'entreprise' && (() => {
                  
                  // On crée une mémoire locale pour retenir la catégorie active (Plats, Desserts...)
                  const [activeCat, setActiveCat] = useState(Object.keys(data.productsByCategory || {})[0] || 'plats_principaux');

                  // Fonction pour ajouter un produit au panier
                  const handleAddProduct = (productName) => {
                      const existing = forms.entreprise.items.find(i => i.product === productName);
                      if (existing) {
                          // S'il y est déjà, on ajoute +1 par défaut
                          const newItems = forms.entreprise.items.map(i => i.product === productName ? { ...i, qty: Number(i.qty) + 1 } : i);
                          setForms({ ...forms, entreprise: { ...forms.entreprise, items: newItems } });
                      } else {
                          // Sinon on le crée avec quantité 1
                          setForms({ ...forms, entreprise: { ...forms.entreprise, items: [...forms.entreprise.items, { product: productName, qty: 1 }] } });
                      }
                      playSound('click');
                  };

                  // Fonction pour modifier la quantité au CLAVIER
                  const handleUpdateQty = (productName, newQty) => {
                      const val = Math.max(1, Number(newQty)); // Empêche de mettre 0 ou négatif
                      const newItems = forms.entreprise.items.map(i => i.product === productName ? { ...i, qty: val } : i);
                      setForms({ ...forms, entreprise: { ...forms.entreprise, items: newItems } });
                  };

                  // Fonction pour supprimer une ligne
                  const handleRemoveProduct = (productName) => {
                      const newItems = forms.entreprise.items.filter(i => i.product !== productName);
                      setForms({ ...forms, entreprise: { ...forms.entreprise, items: newItems } });
                  };

                  const totalItems = forms.entreprise.items.reduce((acc, curr) => acc + Number(curr.qty), 0);
                  const categories = Object.keys(data.productsByCategory || {});

                  // Petite fonction pour mettre des icônes sympas
                  const getIcon = (cat) => {
                      if(cat.includes('plats')) return '🍔';
                      if(cat.includes('desserts')) return '🍰';
                      if(cat.includes('boissons')) return '🥤';
                      if(cat.includes('menus')) return '🍱';
                      if(cat.includes('alcools')) return '🍷';
                      return '📦';
                  };

                  return (
                      <div className="fade-in" style={{ display: 'flex', gap: '30px', height: 'calc(100vh - 120px)', maxHeight: 'calc(100vh - 120px)', maxWidth: '1400px', margin: '0 auto', overflow: 'hidden' }}>

                          {/* ========================================== */}
                          {/* PANNEAU GAUCHE : LE PAVÉ TACTILE (70%)     */}
                          {/* ========================================== */}
                          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                              
                              <div style={{ flexShrink: 0 }}>
                                  <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', margin: 0, letterSpacing: '-1px' }}>PRÉPARATION <span style={{ color: '#f59e0b' }}>PRO</span></h1>
                                  <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Terminal logistique des commandes de gros</p>
                              </div>

                              {/* ONGLET DES CATÉGORIES */}
                              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', flexShrink: 0 }} className="custom-scroll">
                                  {categories.map(cat => (
                                      <button key={cat} onClick={() => { setActiveCat(cat); playSound('click'); }} style={{ padding: '12px 24px', borderRadius: '16px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s', textTransform: 'uppercase', whiteSpace: 'nowrap', background: activeCat === cat ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: activeCat === cat ? '#000' : '#fff', border: 'none', boxShadow: activeCat === cat ? '0 10px 20px rgba(245,158,11,0.3)' : 'none' }}>
                                          {cat.replace('_', ' ')}
                                      </button>
                                  ))}
                              </div>

                              {/* GRILLE DES PRODUITS */}
                              <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', alignContent: 'start', paddingRight: '10px', paddingBottom: '20px' }}>
                                  {(data.productsByCategory[activeCat] || []).map(prod => (
                                      <button key={prod} onClick={() => handleAddProduct(prod)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '25px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.1s', minHeight: '130px' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                                          <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))' }}>{getIcon(activeCat)}</div>
                                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: '1.2' }}>{prod}</div>
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* ========================================== */}
                          {/* PANNEAU DROIT : LE BON DE COMMANDE (30%)   */}
                          {/* ========================================== */}
                          <div style={{ flex: '0 0 450px', background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              
                              {/* CHOIX DU CLIENT */}
                              <div style={{ padding: '30px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                                  <label style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, display: 'block' }}>Entreprise Cliente</label>
                                  <input type="text" className="inp" placeholder="Nom de l'entreprise (ex: Benny's)" value={forms.entreprise.company} onChange={e => setForms({ ...forms, entreprise: { ...forms.entreprise, company: e.target.value } })} style={{ width: '100%', height: '55px', fontSize: '1rem', fontWeight: 800, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '16px', padding: '0 20px', marginBottom: 0 }} />
                              </div>

                              {/* LISTE DES ARTICLES AVEC QUANTITÉ AU CLAVIER */}
                              <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                  {forms.entreprise.items.length === 0 ? (
                                      <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                          <div style={{ fontSize: '3.5rem', marginBottom: 15 }}>🛒</div>
                                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Le chariot est vide</div>
                                          <div style={{ fontSize: '0.8rem', marginTop: 5, fontWeight: 600 }}>Touchez les produits pour les ajouter</div>
                                      </div>
                                  ) : (
                                      forms.entreprise.items.map((item, idx) => (
                                          <div key={idx} className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                              
                                              {/* CHAMP DE QUANTITÉ (CLAVIER) */}
                                              <div style={{ display: 'flex', alignItems: 'center', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, width: '70px', height: '45px' }}>
                                                  <input type="number" value={item.qty} onChange={e => handleUpdateQty(item.product, e.target.value)} style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', outline: 'none' }} min="1" />
                                              </div>

                                              {/* NOM DU PRODUIT */}
                                              <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 800, color: '#fff', lineHeight: '1.2' }}>{item.product}</div>

                                              {/* BOUTON SUPPRIMER */}
                                              <button onClick={() => { playSound('error'); handleRemoveProduct(item.product); }} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', transition: '0.2s', flexShrink: 0 }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>🗑️</button>
                                          </div>
                                      ))
                                  )}
                              </div>

                              {/* PIED DE PAGE & VALIDATION */}
                              <div style={{ padding: '30px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Unités Préparées</span>
                                      <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{totalItems}</span>
                                  </div>
                                  
                                  <button disabled={sending || forms.entreprise.items.length === 0 || !forms.entreprise.company} onClick={() => send('sendEntreprise', forms.entreprise)} style={{ width: '100%', padding: '22px', borderRadius: '24px', border: 'none', background: (sending || forms.entreprise.items.length === 0 || !forms.entreprise.company) ? '#222' : 'linear-gradient(90deg, #f59e0b, #ea580c)', color: (sending || forms.entreprise.items.length === 0 || !forms.entreprise.company) ? '#555' : '#fff', fontSize: '1.1rem', fontWeight: 900, cursor: (sending || forms.entreprise.items.length === 0 || !forms.entreprise.company) ? 'not-allowed' : 'pointer', boxShadow: (sending || forms.entreprise.items.length === 0 || !forms.entreprise.company) ? 'none' : '0 10px 30px rgba(245,158,11,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.3s' }}>
                                      <span>{sending ? 'EXPÉDITION EN COURS...' : '📦 VALIDER LA COMMANDE'}</span>
                                      <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 700 }}>Préparé et certifié par {user.split(' ')[0]}</span>
                                  </button>
                              </div>

                          </div>
                      </div>
                  );
              })()}
             {/* PARTNERS SECTION (ULTRA PREMIUM SPLIT-PANE + JAUGE NEON) */}
              {currentTab === 'partners' && (() => {
                // --- LOGIQUE DE CALCUL DES QUOTAS ---
                const selectedCompany = forms.partner.company;
                const selectedBenef = forms.partner.benef;
                const limits = data.partners.companies[selectedCompany]?.limits;
                const isVIP = !limits;

                let takenDay = 0;
                let takenWeek = 0;
                let maxDay = limits?.day;
                const maxWeek = limits?.week;
                
                const now = new Date();
                const parisTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
                const todayStr = parisTime.toISOString().split('T')[0];
                const currentDayIndex = parisTime.getDay();

                const isSameWeek = (dateStr) => {
                    const dateLog = new Date(dateStr);
                    const tempNow = new Date(parisTime);
                    const dayOfWeek = tempNow.getDay() || 7; 
                    if(dayOfWeek !== 1) tempNow.setHours(-24 * (dayOfWeek - 1)); 
                    const startOfWeek = new Date(tempNow.toISOString().split('T')[0]);
                    return dateLog >= startOfWeek;
                };

                const logs = data.partnerLogs || [];
                logs.forEach(row => {
                    if (row[1] === selectedCompany && row[2] === selectedBenef) {
                        const qty = parseInt(row[4]) || 0; 
                        if (row[0] === todayStr) takenDay += qty;
                        if (isSameWeek(row[0])) takenWeek += qty;
                    }
                });

                const currentQtyInForm = forms.partner.items.reduce((s, i) => s + Number(i.qty), 0);

                if (!isVIP && limits.dynamicRule) {
                    if (currentDayIndex === 1 || currentDayIndex === 2) {
                        maxDay = 5;
                    } else {
                        const takenDaysBeforeToday = takenWeek - takenDay;
                        maxDay = maxWeek ? Math.max(0, maxWeek - takenDaysBeforeToday) : 9999;
                    }
                }

                const isBlockedDay = maxDay && (takenDay + currentQtyInForm > maxDay);
                const isBlockedWeek = maxWeek && (takenWeek + currentQtyInForm > maxWeek);
                const isOverLimit = !isVIP && (isBlockedDay || isBlockedWeek);

                // --- COMPOSANT JAUGE CIRCULAIRE PREMIUM 2.0 (NÉON XXL) ---
                const Gauge = ({ label, taken, max }) => {
                    if (!max) return null;
                    const pct = Math.min(100, (taken / max) * 100);
                    
                    // Couleurs et lueurs dynamiques
                    let color = '#10b981'; // Vert par défaut
                    let glow = 'rgba(16, 185, 129, 0.4)';
                    if (pct >= 100) {
                        color = '#ef4444'; // Rouge
                        glow = 'rgba(239, 68, 68, 0.6)';
                    } else if (pct >= 75) {
                        color = '#f59e0b'; // Orange
                        glow = 'rgba(245, 158, 11, 0.5)';
                    }

                    const remaining = Math.max(0, max - taken);

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                            {/* Cercle principal avec effet Néon */}
                            <div style={{ 
                                position: 'relative', width: 130, height: 130, marginBottom: 15, borderRadius: '50%', 
                                background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.05) ${pct}%)`,
                                boxShadow: `0 0 30px ${glow}, inset 0 0 20px rgba(0,0,0,0.8)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {/* Découpe centrale (Trou noir avec bordure glass) */}
                                <div style={{ 
                                    width: 106, height: 106, borderRadius: '50%', background: '#111', 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.8)'
                                }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: `0 0 15px ${glow}` }}>
                                        {remaining}
                                    </span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginTop: 4 }}>
                                        Reste
                                    </span>
                                </div>
                            </div>
                            
                            {/* Labels stylisés sous la jauge */}
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</div>
                            <div style={{ fontSize: '0.8rem', color: color, marginTop: 6, fontWeight: 800, background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 12, border: `1px solid ${glow}` }}>
                                {taken} / {max}
                            </div>
                        </div>
                    );
                };

                return (
                  <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', maxWidth: '1200px', margin: '0 auto', alignItems: 'stretch' }}>
                    
                    {/* ANIMATION CSS POUR LE GLOW */}
                    <style>{`
                      .glass-card {
                        background: rgba(20, 20, 20, 0.7);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 30px;
                        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                      }
                      .menu-row {
                        transition: all 0.2s;
                        border: 1px solid transparent;
                      }
                      .menu-row:hover {
                        background: rgba(255, 152, 0, 0.05) !important;
                        border-color: rgba(255, 152, 0, 0.2);
                        transform: translateX(5px);
                      }
                      .qty-btn-custom {
                        width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; font-weight: 900; cursor: pointer; transition: 0.2s; display:flex; align-items:center; justify-content:center;
                      }
                      .qty-btn-custom:hover { background: var(--p); color: #000; }
                      .hazard-bg {
                        background: repeating-linear-gradient( 45deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.05) 10px, rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.2) 20px );
                        border: 1px solid rgba(239, 68, 68, 0.3);
                      }
                      .vip-bg {
                        background: radial-gradient(circle at top right, rgba(255, 215, 0, 0.15), transparent 60%), rgba(20,20,20,0.8);
                        border: 1px solid rgba(255, 215, 0, 0.3);
                      }
                      @keyframes pulseError { 
                        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); border-color: rgba(239, 68, 68, 0.8); } 
                        70% { box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.3); } 
                        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.8); } 
                      }
                    `}</style>

                    {/* COLONNE GAUCHE : IDENTIFICATION CLIENT */}
                    <div className="glass-card" style={{ 
                        flex: '1 1 350px', display: 'flex', flexDirection: 'column', padding: '35px', position: 'relative', overflow: 'hidden',
                        animation: isOverLimit ? 'pulseError 2s infinite' : 'none',
                        transition: 'all 0.3s'
                    }}>
                      
                      {/* Liseré supérieur coloré dynamique */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: isVIP ? 'gold' : (isOverLimit ? 'var(--error)' : 'var(--p)') }}></div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛂</div>
                        <div>
                            <h2 style={{ fontWeight: 900, margin: 0, fontSize: '1.2rem', letterSpacing: '1px', color: '#fff' }}>CONTRÔLE D'ACCÈS</h2>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>Base de données Partenaires</div>
                        </div>
                      </div>
                      
                      {/* Sélecteurs stylisés */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>
                        <div style={{ position: 'relative' }}>
                          <label style={{ fontSize: '0.7rem', color: 'var(--p)', fontWeight: 900, textTransform: 'uppercase', position: 'absolute', top: -8, left: 15, background: '#181818', padding: '0 8px', zIndex: 2, borderRadius: 4 }}>Société</label>
                          <select className="inp" style={{ marginBottom: 0, paddingTop: 20, height: 60, fontSize: '1.05rem', fontWeight: 800 }} value={forms.partner.company} onChange={e => { const c = e.target.value; setForms({ ...forms, partner: { ...forms.partner, company: c, benef: data.partners.companies[c].beneficiaries[0], items: [{ menu: data.partners.companies[c].menus[0].name, qty: 1 }] } }); }}>
                            {Object.keys(data.partners.companies).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <label style={{ fontSize: '0.7rem', color: 'var(--p)', fontWeight: 900, textTransform: 'uppercase', position: 'absolute', top: -8, left: 15, background: '#181818', padding: '0 8px', zIndex: 2, borderRadius: 4 }}>Bénéficiaire</label>
                          <select className="inp" style={{ marginBottom: 0, paddingTop: 20, height: 60, fontSize: '1.05rem', fontWeight: 800 }} value={forms.partner.benef} onChange={e => setForms({ ...forms, partner: { ...forms.partner, benef: e.target.value } })}>
                            {data.partners.companies[forms.partner.company]?.beneficiaries.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Carte ID / Quota */}
                      <div className={isVIP ? "vip-bg" : (isOverLimit ? "hazard-bg" : "")} style={{ flex: 1, borderRadius: 24, padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', background: (!isVIP && !isOverLimit) ? 'rgba(0,0,0,0.4)' : undefined, border: (!isVIP && !isOverLimit) ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 }}>
                          <span style={{ fontWeight: 900, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Statut Autorisation</span>
                          {isVIP ? (
                            <span style={{ color: '#000', background: 'gold', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 0 15px rgba(255,215,0,0.4)' }}>VIP</span>
                          ) : (
                            <span style={{ color: isOverLimit ? '#ef4444' : '#10b981', background: isOverLimit ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 900, border: `1px solid ${isOverLimit ? '#ef4444' : '#10b981'}` }}>
                                {isOverLimit ? 'BLOQUÉ' : 'ACTIF'}
                            </span>
                          )}
                        </div>

                        {isVIP ? (
                          <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 10, filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.5))' }}>👑</div>
                            <div style={{ fontWeight: 900, color: 'gold', fontSize: '1.3rem', letterSpacing: '1px' }}>ACCÈS VIP ILLIMITÉ</div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Service Corporate Premium</div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                            {/* Alignement centré avec un beau gap entre les jauges XXL */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
                                <Gauge label={limits.dynamicRule && currentDayIndex > 2 ? "Semaine" : "Jour"} taken={takenDay} max={maxDay} />
                                
                                {(!limits.dynamicRule || currentDayIndex <= 2) && maxWeek && (
                                    <div style={{ width: 1, height: 80, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)' }}></div>
                                )}
                                
                                {(!limits.dynamicRule || currentDayIndex <= 2) && (
                                    <Gauge label="Semaine" taken={takenWeek} max={maxWeek} />
                                )}
                            </div>

                            {isOverLimit && (
                              <div style={{ marginTop: 25, background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: 12, color: '#ff8888', fontWeight: 900, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <span style={{ fontSize: '1.2rem' }}>⚠️</span> LIMITE ATTEINTE
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COLONNE DROITE : LE TERMINAL DE COMMANDE */}
                    <div className="glass-card" style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                      
                      {/* En-tête de la commande */}
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: '25px 35px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontWeight: 900, margin: 0, fontSize: '1.2rem', letterSpacing: '1px', color: '#fff' }}>TERMINAL COMMANDE</h2>
                            <div style={{ fontSize: '0.75rem', color: 'var(--p)', fontWeight: 800, marginTop: 4 }}>Total: {currentQtyInForm} Menu(s)</div>
                        </div>
                        <div style={{ width: 150 }}>
                            <input className="inp" placeholder="N° FACTURE" value={forms.partner.num} onChange={e => setForms({ ...forms, partner: { ...forms.partner, num: e.target.value } })} style={{ marginBottom: 0, textAlign: 'center', padding: '10px', height: 45, borderRadius: 12, borderColor: forms.partner.num ? 'var(--p)' : 'var(--glass-b)', background: '#000', fontSize: '0.9rem', fontWeight: 900 }} />
                        </div>
                      </div>

                      {/* Liste des Menus */}
                      <div style={{ flex: 1, overflowY: 'auto', padding: '25px 35px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {forms.partner.items.map((item, idx) => (
                          <div key={idx} className="menu-row" style={{ display: 'flex', gap: 15, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 15px', borderRadius: 20 }}>
                            
                            <div style={{ flex: 1 }}>
                                <select className="inp" style={{ width: '100%', marginBottom: 0, background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', cursor: 'pointer' }} value={item.menu} onChange={e => { const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({ ...forms, partner: { ...forms.partner, items: n } }); }}>
                                    {data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                </select>
                            </div>
                            
                            {/* Contrôle de quantité en mode Pilule */}
                            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', borderRadius: 12, border: '1px solid #333', padding: 4, gap: 5 }}>
                                <button className="qty-btn-custom" onClick={() => { const n = [...forms.partner.items]; if (n[idx].qty > 1) { n[idx].qty--; setForms({ ...forms, partner: { ...forms.partner, items: n } }); } }}>-</button>
                                <div style={{ width: 30, textAlign: 'center', fontWeight: 900, fontSize: '1rem', color: 'var(--p)' }}>{item.qty}</div>
                                <button className="qty-btn-custom" onClick={() => { const n = [...forms.partner.items]; n[idx].qty++; setForms({ ...forms, partner: { ...forms.partner, items: n } }); }}>+</button>
                            </div>

                            {forms.partner.items.length > 1 && (
                              <button style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: '0.2s' }} onMouseOver={e => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }} onMouseOut={e => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; e.target.style.color = '#ef4444'; }} onClick={() => { const n = [...forms.partner.items]; n.splice(idx, 1); setForms({ ...forms, partner: { ...forms.partner, items: n } }); }}>×</button>
                            )}
                          </div>
                        ))}
                        
                        <button style={{ background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', color: 'var(--muted)', borderRadius: 20, padding: 15, fontSize:'0.9rem', fontWeight: 800, cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} 
                            onMouseOver={(e) => { e.target.style.borderColor = 'var(--p)'; e.target.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'var(--muted)'; }}
                            onClick={() => {
                            const currentMenus = data.partners.companies[forms.partner.company]?.menus;
                            const defaultMenu = currentMenus && currentMenus.length > 0 ? currentMenus[0].name : '';
                            setForms({ ...forms, partner: { ...forms.partner, items: [...forms.partner.items, { menu: defaultMenu, qty: 1 }] } });
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>+</span> AJOUTER UNE LIGNE
                        </button>
                      </div>

                      {/* Footer et Bouton Validation */}
                      <div style={{ padding: '25px 35px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <button 
                            className="btn-p" 
                            style={{ 
                                padding: '22px', fontSize: '1.1rem', letterSpacing: '2px', width: '100%', borderRadius: 20,
                                background: isOverLimit ? '#222' : 'var(--p)',
                                color: isOverLimit ? '#555' : '#000',
                                boxShadow: isOverLimit ? 'none' : '0 15px 35px rgba(255, 152, 0, 0.3)',
                                cursor: isOverLimit ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }} 
                            disabled={isOverLimit || !forms.partner.num || currentQtyInForm <= 0 || sending}
                            onClick={() => send('sendPartnerOrder', forms.partner)}
                          >
                            {isOverLimit ? '⛔ QUOTA DÉPASSÉ' : (!forms.partner.num ? 'SAISIR N° DE FACTURE' : 'ENVOYER LA COMMANDE (1$)')}
                          </button>
                      </div>
                    </div>

                  </div>
                );
              })()}
             {/* GARAGE (DASHBOARD SPORT) */}
{currentTab === 'garage' && (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', height: '100%', maxHeight: '85vh' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#fff', margin: 0, letterSpacing: '-1.5px' }}>GESTION <span style={{ color: 'var(--p)' }}>FLOTTE</span></h1>
                <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Terminal de maintenance Hen House</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{forms.garage.vehicle}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--p)', fontWeight: 800 }}>VÉHICULE SÉLECTIONNÉ</div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', flex: 1, overflow: 'hidden' }}>
            
            {/* CONTRÔLES DU VÉHICULE */}
            <div style={{ background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '35px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* SELECTOR */}
                <div style={{ position: 'relative' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--p)', fontWeight: 900, textTransform: 'uppercase', position: 'absolute', top: -8, left: 15, background: '#181818', padding: '0 8px', zIndex: 2 }}>Véhicule</label>
                    <select className="inp" value={forms.garage.vehicle} onChange={e => setForms({ ...forms, garage: { ...forms.garage, vehicle: e.target.value } })} style={{ height: 60, fontSize: '1rem', fontWeight: 800 }}>
                        {data.vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: 15 }}>
                    <button 
                        style={{ flex: 1, height: 70, borderRadius: 20, border: 'none', cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem', fontWeight: 900, background: forms.garage.action === 'Entrée' ? '#10b981' : 'rgba(255,255,255,0.05)', color: forms.garage.action === 'Entrée' ? '#000' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                        onClick={() => setForms({ ...forms, garage: { ...forms.garage, action: 'Entrée' } })}
                    >
                        <span style={{ fontSize: '1.4rem' }}>🅿️</span> RANGER (ENTRÉE)
                    </button>
                    <button 
                        style={{ flex: 1, height: 70, borderRadius: 20, border: 'none', cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem', fontWeight: 900, background: forms.garage.action === 'Sortie' ? 'var(--p)' : 'rgba(255,255,255,0.05)', color: forms.garage.action === 'Sortie' ? '#000' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                        onClick={() => setForms({ ...forms, garage: { ...forms.garage, action: 'Sortie' } })}
                    >
                        <span style={{ fontSize: '1.4rem' }}>🔑</span> SORTIR (SERVICE)
                    </button>
                </div>

                {/* JAUGE D'ESSENCE INTERACTIVE */}
                <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, alignItems: 'end' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#fff' }}>NIVEAU DE CARBURANT</span>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: forms.garage.fuel < 20 ? '#ef4444' : 'var(--p)', textShadow: forms.garage.fuel < 20 ? '0 0 15px #ef444450' : 'none' }}>{forms.garage.fuel}%</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px', height: '45px', marginBottom: 20 }}>
                        {[...Array(20)].map((_, i) => {
                            const isActive = (i * 5) < forms.garage.fuel;
                            const color = forms.garage.fuel < 20 ? '#ef4444' : forms.garage.fuel < 50 ? '#f59e0b' : '#3b82f6';
                            return (
                                <div key={i} style={{
                                    flex: 1, borderRadius: '4px',
                                    background: isActive ? color : 'rgba(255,255,255,0.03)',
                                    boxShadow: isActive ? `0 0 15px ${color}40` : 'none',
                                    transition: 'all 0.3s'
                                }} />
                            );
                        })}
                    </div>
                    <input type="range" style={{ width: '100%', accentColor: 'var(--p)', cursor: 'pointer' }} value={forms.garage.fuel} onChange={e => setForms({ ...forms, garage: { ...forms.garage, fuel: e.target.value } })} />
                </div>

                <button className="btn-p" style={{ marginTop: 'auto', padding: '22px', fontSize: '1.1rem' }} disabled={sending} onClick={() => send('sendGarage', forms.garage)}>
                    {sending ? 'TRANSMISSION...' : 'VALIDER LE MOUVEMENT'}
                </button>
            </div>

            {/* HISTORIQUE (BLOCK DROITE) */}
            <div style={{ background: 'rgba(15, 15, 15, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p)' }}></span>
                    Dernières Actions
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {(data.garageHistory || []).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.2, fontWeight: 800 }}>Aucune donnée</div>
                    ) : data.garageHistory.map((act, i) => (
                        <div key={i} style={{ padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '1.4rem', background: 'rgba(0,0,0,0.4)', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${act[3] === 'Entrée' ? '#10b98130' : '#ff980030'}` }}>
                                {act[3] === 'Entrée' ? '🅿️' : '🔑'}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act[2]}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>{act[1].split(' ')[0]} • <span style={{ color: act[3] === 'Entrée' ? '#10b981' : 'var(--p)' }}>{act[3]}</span></div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>{act[4]}%</div>
                                <div style={{ fontSize: '0.6rem', color: '#555', fontWeight: 800 }}>ESSENCE</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.7rem', fontWeight: 700 }}>
                    Système de télémétrie Hen House v2.4
                </div>
            </div>
        </div>
    </div>
)}
            {/* DIRECTORY (PREMIUM ID CARDS) */}
              {currentTab === 'directory' && (() => {
                
                // Fonction pour définir la couleur de la carte selon ta hiérarchie officielle
                const getRoleStyle = (role) => {
                    const r = (role || '').toLowerCase();
                    
                    if (r.includes('pdg')) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.05)', border: 'rgba(251, 191, 36, 0.3)', shadow: 'rgba(251, 191, 36, 0.15)' }; // Or
                    if (r.includes('cceo')) return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.05)', border: 'rgba(168, 85, 247, 0.3)', shadow: 'rgba(168, 85, 247, 0.15)' }; // Violet
                    if (r.includes('general manager')) return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.3)', shadow: 'rgba(59, 130, 246, 0.15)' }; // Bleu
                    if (r.includes('shift leader')) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.3)', shadow: 'rgba(16, 185, 129, 0.15)' }; // Vert
                    
                    // Food Service Associate (par défaut)
                    return { color: 'var(--p)', bg: 'rgba(255, 152, 0, 0.05)', border: 'rgba(255, 152, 0, 0.2)', shadow: 'var(--p-glow)' }; // Orange Hen House
                };

                return (
                  <div className="fade-in">
                    
                    {/* EN-TÊTE AVEC BARRE DE RECHERCHE */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--glass-b)', paddingBottom: 20 }}>
                      <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Annuaire</h2>
                        <p style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginTop: 5 }}>
                            {data.employeesFull.length} Employés Actifs
                        </p>
                      </div>
                      
                      <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '350px' }}>
                        <input 
                          className="inp" 
                          placeholder="Rechercher nom ou poste..." 
                          style={{ paddingLeft: 50, marginBottom: 0, background: 'rgba(0,0,0,0.5)', borderColor: search ? 'var(--p)' : 'var(--glass-b)', borderRadius: 20, height: 50 }} 
                          value={search}
                          onChange={e => setSearch(e.target.value)} 
                        />
                        <span style={{ position: 'absolute', left: 20, top: 15, opacity: search ? 1 : 0.5, fontSize: '1.2rem', transition: '0.3s' }}>🔍</span>
                      </div>
                    </div>

                    <style>{`
                        .dir-card {
                            background: rgba(15, 15, 15, 0.6);
                            backdrop-filter: blur(20px);
                            border-radius: 24px;
                            padding: 25px;
                            position: relative;
                            overflow: hidden;
                            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                            display: flex;
                            flex-direction: column;
                        }
                        .dir-card:hover {
                            transform: translateY(-5px);
                        }
                        .copy-btn {
                            background: rgba(255,255,255,0.03);
                            border: 1px solid rgba(255,255,255,0.08);
                            color: #fff;
                            border-radius: 16px;
                            padding: 12px;
                            font-size: 0.9rem;
                            font-weight: 800;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            cursor: pointer;
                            transition: 0.2s;
                        }
                        .copy-btn:hover {
                            background: var(--p);
                            color: #000;
                            border-color: var(--p);
                        }
                    `}</style>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 25 }}>
                      {(() => {
                        const filteredEmployees = data.employeesFull.filter(e => 
                          e.name.toLowerCase().includes(search.toLowerCase()) || 
                          (e.role && e.role.toLowerCase().includes(search.toLowerCase()))
                        );

                        if (filteredEmployees.length === 0) {
                          return (
                            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px dashed var(--glass-b)', gridColumn: '1 / -1' }}>
                              <div style={{ fontSize: '3.5rem', opacity: 0.5, marginBottom: 15 }}>🕵️‍♂️</div>
                              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', marginBottom: 5 }}>Aucun collègue trouvé</h3>
                              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Personne ne correspond à la recherche "{search}".</p>
                            </div>
                          );
                        }

                        return filteredEmployees.map(e => {
                          const style = getRoleStyle(e.role);
                          
                          return (
                            <div key={e.id} className="dir-card" style={{ border: `1px solid ${style.border}` }}>
                              
                              {/* Halo de lumière (Glow effect) coloré selon le grade */}
                              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: style.shadow, filter: 'blur(40px)', borderRadius: '50%', zIndex: 0 }}></div>
                              
                              <div style={{ position: 'relative', zIndex: 1 }}>
                                  {/* Avatar & Nom */}
                                  <div style={{ display: 'flex', gap: 15, alignItems: 'center', marginBottom: 25 }}>
                                    <div style={{ 
                                        width: 60, height: 60, borderRadius: 16, flexShrink: 0,
                                        background: 'linear-gradient(135deg, #222, #050505)', 
                                        border: `2px solid ${style.color}`, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: '1.5rem', fontWeight: 900, color: '#fff',
                                        boxShadow: `0 10px 20px ${style.bg}`
                                    }}>
                                        {e.name.charAt(0)}
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {e.name}
                                        </div>
                                        <div style={{ color: style.color, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>
                                            {e.role || 'Food Service'}
                                        </div>
                                    </div>
                                  </div>

                                  {/* Zone des statistiques (pour le RP et la compétition) */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.4)', padding: '12px 15px', borderRadius: 16, marginBottom: 20, border: '1px solid rgba(255,255,255,0.03)' }}>
                                      <div style={{ textAlign: 'center' }}>
                                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Ventes</div>
                                          <div style={{ fontWeight: 900, color: '#10b981', fontSize: '1rem', marginTop: 2 }}>
                                              ${Math.round(e.ca || 0).toLocaleString()}
                                          </div>
                                      </div>
                                      <div style={{ width: 1, background: 'rgba(255,255,255,0.05)' }}></div>
                                      <div style={{ textAlign: 'center' }}>
                                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Factures</div>
                                          <div style={{ fontWeight: 900, color: '#fff', fontSize: '1rem', marginTop: 2 }}>
                                              {e.invoiceCount || 0}
                                          </div>
                                      </div>
                                  </div>

                                  {/* Bouton Copier Numéro */}
                                  <button 
                                    className="copy-btn" 
                                    onClick={() => copyToClipboard(e.phone)}
                                  >
                                    <span style={{ fontSize: '1.2rem' }}>📱</span> 
                                    {e.phone || 'Aucun numéro'}
                                  </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })()}
             {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                // J'ai passé le minmax de 400px à 320px pour que les 3 classements rentrent bien côte à côte sur écran
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
                  
                  {/* 1. TOP VENDEURS (CA) */}
                  <div className="form-ui" style={{ maxWidth: '100%', padding: 30 }}>
                    <h2 style={{ marginBottom: 30, fontWeight: 900 }}>🏆 TOP VENDEURS</h2>
                    {data.employeesFull.sort((a, b) => b.ca - a.ca).slice(0, 10).map((e, i) => (
                      <div key={i} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: 8 }}>
                          <span style={{ display: 'flex', gap: 10 }}>
                            <b style={{ color: i === 0 ? 'var(--p)' : '#555' }}>#{i + 1}</b> {e.name}
                          </span>
                          <b style={{ color: '#fff' }}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div style={{ height: 6, background: '#333', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: i === 0 ? 'var(--p)' : '#555', width: (e.ca / Math.max(...data.employeesFull.map(x => x.ca)) * 100) + '%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2. TOP CUISTOS (STOCK) */}
                  <div className="form-ui" style={{ maxWidth: '100%', padding: 30 }}>
                    <h2 style={{ marginBottom: 30, fontWeight: 900 }}>🍳 TOP CUISTOS</h2>
                    {data.employeesFull.sort((a, b) => b.stock - a.stock).slice(0, 10).map((e, i) => (
                      <div key={i} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: 8 }}>
                          <span style={{ display: 'flex', gap: 10 }}>
                            <b style={{ color: i === 0 ? 'var(--success)' : '#555' }}>#{i + 1}</b> {e.name}
                          </span>
                          <b>{e.stock.toLocaleString()}</b>
                        </div>
                        <div style={{ height: 6, background: '#333', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: i === 0 ? 'var(--success)' : '#555', width: (e.stock / Math.max(...data.employeesFull.map(x => x.stock)) * 100) + '%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3. TOP FACTURES (NOUVEAU) */}
                  <div className="form-ui" style={{ maxWidth: '100%', padding: 30 }}>
                    <h2 style={{ marginBottom: 30, fontWeight: 900 }}>🧾 TOP FACTURES</h2>
                    {data.employeesFull.sort((a, b) => (b.invoiceCount || 0) - (a.invoiceCount || 0)).slice(0, 10).map((e, i) => {
                      // On évite la division par zéro si personne n'a de facture
                      const maxFactures = Math.max(...data.employeesFull.map(x => x.invoiceCount || 0), 1);
                      const count = e.invoiceCount || 0;
                      
                      return (
                        <div key={i} style={{ marginBottom: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: 8 }}>
                            <span style={{ display: 'flex', gap: 10 }}>
                              {/* On utilise du bleu (#3b82f6) pour différencier ce classement */}
                              <b style={{ color: i === 0 ? '#3b82f6' : '#555' }}>#{i + 1}</b> {e.name}
                            </span>
                            <b>{count} factures</b>
                          </div>
                          <div style={{ height: 6, background: '#333', borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: i === 0 ? '#3b82f6' : '#555', width: (count / maxFactures * 100) + '%' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
             {/* RULES (RÈGLEMENT INTÉRIEUR) */}
              {currentTab === 'rules' && (
                <div className="center-box fade-in">
                  <div className="form-ui" style={{ maxWidth: 850, width: '100%', padding: '40px', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                      <h2 style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-1px', color: '#fff', lineHeight: 1.2 }}>📜 RÈGLEMENT INTÉRIEUR</h2>
                      <p style={{ color: 'var(--p)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginTop: 5 }}>Hen House – San Andreas</p>
                    </div>

                    <div style={{ overflowY: 'auto', paddingRight: 20, flex: 1, color: '#ccc', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      
                      {/* PRÉAMBULE */}
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderLeft: '4px solid var(--muted)', padding: 20, borderRadius: '0 16px 16px 0', marginBottom: 30 }}>
                        <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: 10, fontSize: '1.1rem' }}>PRÉAMBULE</h4>
                        <p>Le présent règlement intérieur a pour objectif de définir les règles applicables à l’ensemble des employés du Hen House, afin de garantir un environnement de travail professionnel, sécurisé, respectueux et conforme aux normes sanitaires en vigueur à San Andreas.</p>
                        <p style={{ marginTop: 10 }}>Toute personne employée au sein de l’établissement reconnaît avoir pris connaissance du présent règlement et s’engage à le respecter sans réserve.</p>
                      </div>

                      {/* I. TEMPS DE TRAVAIL */}
                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>I. TEMPS DE TRAVAIL</h3>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>I.I Horaires</h4>
                      <p style={{ marginBottom: 15 }}>Les employés doivent respecter les horaires établis par la direction ou les managers. Un minimum de 8 heures de service par semaine est requis.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>I.II Retards et absences</h4>
                      <p style={{ marginBottom: 10 }}>Tout retard ou absence doit être signalé au moins 1 heure avant le début du service, sauf cas de force majeure. Toute absence injustifiée supérieure à 2 jours pourra entraîner une sanction disciplinaire.</p>

                      {/* II. TENUE PROFESSIONNELLE */}
                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>II. TENUE PROFESSIONNELLE</h3>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>II.I Uniforme</h4>
                      <p style={{ marginBottom: 15 }}>Le port de la tenue professionnelle officielle du Hen House est obligatoire durant le service. La tenue doit être propre, soignée et conforme à l’image de l’établissement.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>II.II Présentation</h4>
                      <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
                        <li>Cheveux propres et attachés si nécessaire</li>
                        <li>Ongles courts et propres</li>
                        <li>Bijoux limités pour des raisons d’hygiène et de sécurité</li>
                        <li>Aucun parfum excessif</li>
                      </ul>

                      {/* III. HYGIÈNE ET NORMES SANITAIRES */}
                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>III. HYGIÈNE ET NORMES SANITAIRES</h3>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>III.I Lavage des mains</h4>
                      <p>Le lavage des mains est obligatoire :</p>
                      <ul style={{ paddingLeft: 20, marginBottom: 15 }}>
                        <li>Avant la prise de service et après chaque pause</li>
                        <li>Après manipulation d’argent ou passage aux toilettes</li>
                        <li>Après tout contact non alimentaire</li>
                      </ul>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>III.II Port de gants</h4>
                      <p style={{ marginBottom: 15 }}>Le port de gants alimentaires est obligatoire lors de toute préparation ou manipulation de nourriture. Ils doivent être changés régulièrement et ne remplacent en aucun cas le lavage des mains.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>III.III Manipulation des aliments</h4>
                      <ul style={{ paddingLeft: 20, marginBottom: 15 }}>
                        <li>Les aliments doivent être conservés aux températures réglementaires.</li>
                        <li>Aucun produit périmé ne doit être utilisé.</li>
                        <li>Les surfaces de travail doivent être nettoyées et désinfectées régulièrement.</li>
                      </ul>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>III.IV Interdictions sanitaires</h4>
                      <p>Il est strictement interdit :</p>
                      <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
                        <li>De travailler en cas de maladie contagieuse.</li>
                        <li>De fumer dans les zones de préparation.</li>
                        <li>De consommer des aliments personnels en zone de cuisine.</li>
                      </ul>
                      <p style={{ color: 'var(--error)', fontWeight: 700, fontSize: '0.85rem' }}>Tout manquement aux règles d’hygiène pourra entraîner une exclusion immédiate du service.</p>

                      {/* IV. COMPORTEMENT ET CONDUITE */}
                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>IV. COMPORTEMENT ET CONDUITE</h3>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>IV.I Respect</h4>
                      <p style={{ marginBottom: 15 }}>Les employés doivent adopter une attitude respectueuse envers les clients, les collègues et la hiérarchie.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>IV.II Comportements interdits</h4>
                      <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
                        <li>Insultes, menaces ou violences</li>
                        <li>Discriminations ou harcèlement</li>
                        <li>Consommation ou possession d’alcool ou de drogue</li>
                        <li>Discussions ou activités illégales au sein de l’entreprise</li>
                      </ul>
                      <p style={{ color: 'var(--error)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 15 }}>Toute infraction grave pourra entraîner un licenciement immédiat.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>IV.III Téléphones portables</h4>
                      <p style={{ marginBottom: 15 }}>L’utilisation du téléphone personnel est interdite pendant le service, sauf urgence ou autorisation hiérarchique.</p>
                      <h4 style={{ color: '#fff', fontWeight: 700 }}>IV.IV Coffre et ressources</h4>
                      <p style={{ marginBottom: 10 }}>Le coffre est strictement réservé à un usage professionnel. Chaque employé dispose de 10 menus par semaine, déposés le dimanche soir. Tout prélèvement non autorisé sera sanctionné.</p>

                      {/* V to IX : Grid display for better readability */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginTop: 30 }}>
                        <div style={{ background: 'rgba(20,20,20,0.5)', padding: 20, borderRadius: 16, border: '1px solid var(--glass-b)' }}>
                          <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1rem', marginBottom: 10 }}>V. CONFIDENTIALITÉ</h3>
                          <p style={{ fontSize: '0.85rem' }}>Les informations relatives aux clients, aux employés et à l’entreprise sont strictement confidentielles. Toute divulgation non autorisée est formellement interdite.</p>
                        </div>
                        <div style={{ background: 'rgba(20,20,20,0.5)', padding: 20, borderRadius: 16, border: '1px solid var(--glass-b)' }}>
                          <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1rem', marginBottom: 10 }}>VI. SÉCURITÉ</h3>
                          <p style={{ fontSize: '0.85rem' }}>Les employés doivent respecter les consignes de sécurité, utiliser correctement les équipements et signaler immédiatement tout incident ou blessure.</p>
                        </div>
                        <div style={{ background: 'rgba(20,20,20,0.5)', padding: 20, borderRadius: 16, border: '1px solid var(--glass-b)' }}>
                          <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1rem', marginBottom: 10 }}>VII. UTILISATION DU MATÉRIEL</h3>
                          <p style={{ fontSize: '0.85rem' }}>Le matériel de l’entreprise doit être utilisé uniquement à des fins professionnelles. Les casiers personnels ne doivent contenir aucun objet illégal. Toute dégradation volontaire sera sanctionnée.</p>
                        </div>
                        <div style={{ background: 'rgba(20,20,20,0.5)', padding: 20, borderRadius: 16, border: '1px solid var(--glass-b)' }}>
                          <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1rem', marginBottom: 10 }}>VIII. CONGÉS ET MALADIE</h3>
                          <p style={{ fontSize: '0.85rem' }}>Les demandes de congés doivent être effectuées à l’avance et validées par la direction. En cas de maladie, prévenir immédiatement (un justificatif médical peut être exigé).</p>
                        </div>
                      </div>

                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>IX. RÉMUNÉRATION</h3>
                      <p style={{ marginBottom: 20 }}>Les salaires sont versés conformément aux règles internes du Hen House et aux lois en vigueur à San Andreas.</p>

                      {/* X to XIII */}
                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>X. DISCIPLINE ET SANCTIONS</h3>
                      <p>Tout manquement au présent règlement pourra entraîner : Avertissement verbal, Avertissement écrit, Mise à pied temporaire, Rétrogradation, Licenciement. La sanction sera proportionnelle à la gravité des faits.</p>

                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>XI. HIÉRARCHIE & XII. IMAGE</h3>
                      <p style={{ marginBottom: 10 }}>Les employés doivent respecter la hiérarchie interne. Les décisions de la direction et des managers sont applicables immédiatement. Toute contestation publique est interdite.</p>
                      <p style={{ marginBottom: 10 }}>Chaque employé représente l’image du Hen House. Tout comportement portant atteinte à la réputation de l’établissement est strictement interdit.</p>

                      <h3 style={{ color: 'var(--p)', fontWeight: 800, fontSize: '1.2rem', marginTop: 30, marginBottom: 15, borderBottom: '1px solid var(--glass-b)', paddingBottom: 5 }}>XIII. MODIFICATIONS DU RÈGLEMENT</h3>
                      <p style={{ marginBottom: 40 }}>La direction se réserve le droit de modifier le présent règlement à tout moment. Toute modification sera communiquée par écrit.</p>

                      {/* XIV CLAUSE EXCEPTIONNELLE - TACOVANS */}
                      <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '2px solid var(--error)', padding: 30, borderRadius: 20, marginBottom: 30, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)' }}>
                        <h3 style={{ color: 'var(--error)', fontWeight: 900, fontSize: '1.4rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span>⚠️</span> XIV. CLAUSE EXCEPTIONNELLE – TACOVANS
                        </h3>
                        <p style={{ color: '#fff', fontWeight: 700, marginBottom: 20, fontSize: '0.9rem' }}><i>(Clause spécifique – À prendre au sérieux)</i><br/>Cette clause s’applique à tout employé utilisant un TacoVan appartenant au Hen House.</p>
                        
                        <h4 style={{ color: '#ff8888', fontWeight: 800 }}>XIV.I Lieux strictement interdits</h4>
                        <p>Il est formellement interdit de stationner, vendre ou exercer une activité commerciale avec un TacoVan :</p>
                        <ul style={{ paddingLeft: 20, marginBottom: 15, color: '#fff', fontWeight: 600 }}>
                          <li>Devant les restaurants</li>
                          <li>Devant les supérettes et stations-service de type LTD</li>
                          <li>Devant les boîtes de nuit</li>
                          <li>Devant les bars</li>
                        </ul>
                        <p style={{ marginBottom: 20, fontStyle: 'italic', color: '#ccc' }}>Ces interdictions visent à éviter les conflits commerciaux et préserver l’image de l’entreprise.</p>

                        <h4 style={{ color: '#ff8888', fontWeight: 800 }}>XIV.II Autorisations obligatoires</h4>
                        <p style={{ marginBottom: 20 }}>Toute installation ou arrêt prolongé nécessite une autorisation préalable du responsable ou propriétaire du lieu. Cela concerne toutes les entreprises et établissements privés. En cas de refus, l’employé doit quitter les lieux immédiatement.</p>

                        <h4 style={{ color: '#ff8888', fontWeight: 800 }}>XIV.III Sanctions</h4>
                        <p>Tout non-respect de cette clause pourra entraîner :</p>
                        <ul style={{ paddingLeft: 20, marginBottom: 15, color: '#fff', fontWeight: 700 }}>
                          <li>Retrait du TacoVan</li>
                          <li>Suspension immédiate</li>
                          <li>Sanction disciplinaire pouvant aller jusqu’au licenciement</li>
                        </ul>
                        <p style={{ color: 'var(--error)', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem', textAlign: 'center', marginTop: 20, borderTop: '1px solid rgba(239,68,68,0.3)', paddingTop: 15 }}>Aucune tolérance ne sera accordée.</p>
                      </div>

                      {/* FOOTER */}
                      <div style={{ textAlign: 'center', marginTop: 40, padding: 30, borderTop: '1px dashed #444', color: 'var(--muted)', background: 'rgba(0,0,0,0.4)', borderRadius: 20 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: 5 }}>Fait à San Andreas</div>
                        <div style={{ marginBottom: 15 }}>Entrée en vigueur immédiate</div>
                        <div style={{ color: 'var(--p)', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1.1rem' }}>La Direction du Hen House</div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            {/* PROFILE (ULTRA PREMIUM SPLIT-PANE + HISTORIQUE) */}
              {currentTab === 'profile' && myProfile && (() => {
                  
                const getRoleStyle = (role) => {
                    const r = (role || '').toLowerCase();
                    if (r.includes('pdg')) return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.05)', border: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.4)' };
                    if (r.includes('cceo')) return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.05)', border: '#a855f7', shadow: 'rgba(168, 85, 247, 0.4)' };
                    if (r.includes('general manager')) return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.4)' };
                    if (r.includes('shift leader')) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)', border: '#10b981', shadow: 'rgba(16, 185, 129, 0.4)' };
                    return { color: 'var(--p)', bg: 'rgba(255, 152, 0, 0.05)', border: 'var(--p)', shadow: 'rgba(255, 152, 0, 0.4)' }; 
                };

                const rStyle = getRoleStyle(myProfile.role);

                // --- LOGIQUE DE L'HISTORIQUE ---
                const myInvoices = (data.invoicesHistory || [])
                    .filter(row => row[1] === user)
                    .map(row => ({ date: row[0], num: row[2], amount: row[3], details: row[4] }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                const getWeekNumber = (d) => {
                    const date = new Date(d);
                    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
                    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
                    const weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
                    return `S${weekNo}`;
                };

                const availableWeeks = [...new Set(myInvoices.map(inv => getWeekNumber(inv.date)))];

                const groupedInvoices = myInvoices.reduce((acc, inv) => {
                    const week = getWeekNumber(inv.date);
                    if (!acc[week]) acc[week] = [];
                    acc[week].push(inv);
                    return acc;
                }, {});

                const weeksToDisplay = profileWeek === 'Toutes' 
                    ? Object.keys(groupedInvoices).sort((a, b) => b.localeCompare(a)) 
                    : [profileWeek];

                return (
                    <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', maxWidth: '1300px', margin: '0 auto', height: 'calc(100vh - 120px)', alignItems: 'stretch' }}>
                        
                        {/* COLONNE GAUCHE : IDENTITÉ */}
                        <div style={{ 
                            flex: '1 1 350px', maxWidth: '420px', background: 'rgba(15, 15, 15, 0.7)', 
                            backdropFilter: 'blur(20px)', borderRadius: '40px', border: `1px solid rgba(255,255,255,0.05)`, 
                            boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 50px ${rStyle.shadow}`,
                            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ height: '6px', background: `linear-gradient(90deg, transparent, ${rStyle.color}, transparent)`, flexShrink: 0 }}></div>
                            
                            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', flex: 1, overflowY: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: 110, height: 110, borderRadius: '35%', 
                                        background: 'linear-gradient(135deg, #222, #050505)', border: `2px solid ${rStyle.color}`, 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: '3rem', fontWeight: 900, color: '#fff',
                                        boxShadow: `0 10px 25px ${rStyle.bg}, inset 0 0 15px rgba(255,255,255,0.05)`,
                                        position: 'relative', marginBottom: '20px', transform: 'rotate(4deg)'
                                    }}>
                                        <div style={{ transform: 'rotate(-4deg)' }}>{user.charAt(0)}</div>
                                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, background: '#10b981', border: '4px solid #111', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                                    </div>
                                    <h1 style={{ fontSize: '2.2rem', fontWeight: 950, color: '#fff', textAlign: 'center', margin: 0 }}>{user}</h1>
                                    <div style={{ marginTop: 12, background: rStyle.bg, border: `1px solid ${rStyle.border}50`, color: rStyle.color, padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        {myProfile.role || 'Employé'}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Ventes</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>${Math.round(myProfile.ca).toLocaleString()}</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Factures</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{myProfile.invoiceCount || 0}</div>
                                    </div>
                                </div>

                                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '24px', padding: '25px', textAlign: 'center', marginTop: 'auto' }}>
                                    <div style={{ color: '#10b981', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 10 }}>Salaire Estimé</div>
                                    <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#10b981', textShadow: '0 0 25px rgba(16,185,129,0.4)' }}>
                                        ${Math.round(myProfile.salary || 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLONNE DROITE : REGISTRE SCROLLABLE */}
                        <div style={{ 
                            flex: '2 1 500px', height: '100%', background: 'rgba(15, 15, 15, 0.7)', 
                            backdropFilter: 'blur(20px)', borderRadius: '40px', border: `1px solid rgba(255,255,255,0.05)`, 
                            display: 'flex', flexDirection: 'column', overflow: 'hidden'
                        }}>
                            <div style={{ padding: '30px 40px 15px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
                                <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#fff', margin: 0 }}>🧾 RELEVÉ DES VENTES</h2>
                                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginTop: '15px', paddingBottom: '5px' }}>
                                    <button style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', background: profileWeek === 'Toutes' ? 'var(--p)' : 'rgba(255,255,255,0.05)', color: profileWeek === 'Toutes' ? '#000' : '#fff', border: 'none' }} onClick={() => setProfileWeek('Toutes')}>Toutes</button>
                                    {availableWeeks.map(w => (
                                        <button key={w} style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', background: profileWeek === w ? 'var(--p)' : 'rgba(255,255,255,0.05)', color: profileWeek === w ? '#000' : '#fff', border: 'none' }} onClick={() => setProfileWeek(w)}>Semaine {w.replace('S', '')}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 40px 40px 40px' }}>
                                {weeksToDisplay.map(week => (
                                    <div key={week} style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--muted)', margin: '20px 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 5 }}>SEMAINE {week.replace('S', '')}</div>
                                        {groupedInvoices[week].map((inv, idx) => (
                                            <div key={idx} 
                                                style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)', transition: '0.2s' }} 
                                                onClick={() => { playSound('click'); setExpandedInv(inv); }}
                                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} 
                                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
                                                    <div style={{ width: 80, fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>{new Date(inv.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</div>
                                                    <div style={{ fontWeight: 900, color: '#fff' }}>{inv.num}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>+${Number(inv.amount).toLocaleString()}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>TICKET</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MODAL TICKET (SCROLLABLE & FIXÉ) */}
                        {expandedInv && typeof expandedInv === 'object' && (
                            <div className="modal-overlay" onClick={() => setExpandedInv(null)} style={{ zIndex: 10000 }}>
                                <div className="modal-box fade-in" style={{ 
                                    background: '#111', width: '320px', padding: '0', borderRadius: '0', 
                                    display: 'flex', flexDirection: 'column', maxHeight: '85vh', position: 'relative'
                                }} onClick={e => e.stopPropagation()}>
                                    <div style={{ height: '10px', background: 'radial-gradient(circle, transparent 4px, #111 5px) repeat-x', backgroundSize: '12px 20px', position: 'absolute', top: '-10px', left: 0, width: '100%' }}></div>
                                    <div style={{ padding: '30px 20px 20px', borderBottom: '2px dashed #333', textAlign: 'center', flexShrink: 0 }}>
                                        <h2 style={{ margin: 0, fontFamily: 'monospace', color: '#fff', fontSize: '1.5rem' }}>HEN HOUSE</h2>
                                        <div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>#{expandedInv.num} | {user}</div>
                                    </div>
                                    <div style={{ padding: '20px', fontFamily: 'monospace', color: '#ddd', fontSize: '0.85rem', flex: 1, overflowY: 'auto' }}>
                                        {expandedInv.details ? expandedInv.details.split(',').map((item, i) => {
                                            const [qty, ...nameParts] = item.trim().split('x ');
                                            return (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span>{qty}x {nameParts.join('x ').substring(0, 18)}</span>
                                                    <span>OK</span>
                                                </div>
                                            )
                                        }) : "Détails non dispo."}
                                    </div>
                                    <div style={{ padding: '20px', borderTop: '2px dashed #333', textAlign: 'center', background: '#0a0a0a', flexShrink: 0 }}>
                                        <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 900, fontFamily: 'monospace' }}>${Number(expandedInv.amount).toLocaleString()}</div>
                                    </div>
                                    <button style={{ width: '100%', padding: '15px', background: 'var(--p)', border: 'none', fontWeight: 900, cursor: 'pointer' }} onClick={() => setExpandedInv(null)}>FERMER LE TICKET</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
              })()}
              {/* SUPPORT (SMART HELPDESK & SECURE PAGER) */}
              {currentTab === 'support' && (() => {
                  
                const SUPPORT_CATEGORIES = [
                    { id: 'stock', icon: '📦', label: 'Problème de Stock', color: '#10b981', hint: 'Précisez quel produit ou ingrédient est manquant dans les frigos ou réserves...' },
                    { id: 'materiel', icon: '🛠️', label: 'Panne Matériel / Véhicule', color: '#f59e0b', hint: 'Quel équipement ou véhicule (indiquez la plaque) pose problème ? Décrivez la panne...' },
                    { id: 'rh', icon: '👥', label: 'Problème avec un collègue', color: '#6366f1', hint: 'Expliquez la situation de manière factuelle. Ce rapport restera strictement confidentiel.' },
                    { id: 'urgence', icon: '🚨', label: 'Urgence Absolue', color: '#ef4444', hint: 'DÉCRIVEZ L\'URGENCE IMMÉDIATEMENT. PRIORITÉ MAXIMALE. LE PDG SERA ALERTÉ.' }
                ];

                // Trouver la catégorie active (par défaut la première si non trouvée)
                const activeCat = SUPPORT_CATEGORIES.find(c => c.label === forms.support.sub) || SUPPORT_CATEGORIES[0];

                return (
                  <div className="center-box fade-in">
                    
                    {/* Styles dynamiques pour le Support */}
                    <style>{`
                        .support-cat {
                            background: rgba(255,255,255,0.03);
                            border: 1px solid rgba(255,255,255,0.08);
                            border-radius: 20px;
                            padding: 20px 10px;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                            gap: 12px;
                        }
                        .support-cat:hover {
                            background: rgba(255,255,255,0.08);
                            transform: translateY(-5px);
                        }
                        .textarea-support:focus {
                            border-color: ${activeCat.color} !important;
                            box-shadow: 0 0 20px ${activeCat.color}30 !important;
                        }
                        .btn-support {
                            background: ${activeCat.color} !important;
                            color: ${activeCat.id === 'stock' || activeCat.id === 'materiel' ? '#000' : '#fff'} !important;
                            box-shadow: 0 10px 25px ${activeCat.color}40 !important;
                            border: none;
                        }
                        .btn-support:hover {
                            box-shadow: 0 15px 35px ${activeCat.color}70 !important;
                            transform: translateY(-2px);
                        }
                        .btn-support:disabled {
                            background: #222 !important;
                            color: #555 !important;
                            box-shadow: none !important;
                            transform: none;
                        }
                    `}</style>

                    <div className="form-ui" style={{ 
                        maxWidth: 800, padding: '40px 50px', background: 'rgba(15,15,15,0.85)', 
                        borderTop: `4px solid ${activeCat.color}`, transition: 'border-color 0.3s' 
                    }}>
                      
                      <div style={{ textAlign: 'center', marginBottom: 35 }}>
                          <h2 style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '1px', color: '#fff', marginBottom: 5 }}>CENTRE DE COMMUNICATION</h2>
                          <p style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px' }}>Ligne directe & cryptée — Direction Hen House</p>
                      </div>

                      {/* Grille des Catégories (Chips XXL) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 15, marginBottom: 35 }}>
                          {SUPPORT_CATEGORIES.map(cat => {
                              const isActive = activeCat.id === cat.id;
                              return (
                                  <div 
                                      key={cat.id} 
                                      className="support-cat"
                                      style={{
                                          background: isActive ? `${cat.color}15` : '',
                                          borderColor: isActive ? cat.color : '',
                                          boxShadow: isActive ? `0 0 20px ${cat.color}20, inset 0 0 10px ${cat.color}10` : ''
                                      }}
                                      onClick={() => {
                                          playSound('click');
                                          setForms({ ...forms, support: { ...forms.support, sub: cat.label } });
                                      }}
                                  >
                                      <div style={{ 
                                          fontSize: '2.2rem', 
                                          filter: isActive ? `drop-shadow(0 0 15px ${cat.color}90)` : 'grayscale(0.8) opacity(0.5)',
                                          transition: '0.3s'
                                      }}>
                                          {cat.icon}
                                      </div>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 900, color: isActive ? '#fff' : 'var(--muted)', lineHeight: 1.3 }}>
                                          {cat.label}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* Zone de saisie du message */}
                      <div style={{ position: 'relative', marginBottom: 30 }}>
                          <div style={{ 
                              position: 'absolute', top: -10, left: 15, background: '#111', padding: '0 10px', 
                              fontSize: '0.75rem', fontWeight: 900, color: activeCat.color, 
                              textTransform: 'uppercase', letterSpacing: '1px', zIndex: 2, borderRadius: 4,
                              transition: 'color 0.3s'
                          }}>
                              Détails du rapport
                          </div>
                          <textarea 
                              className="inp textarea-support" 
                              style={{ 
                                  height: 180, resize: 'none', background: 'rgba(0,0,0,0.6)', 
                                  padding: '25px 20px', fontSize: '0.95rem', lineHeight: 1.6,
                                  fontWeight: 600, color: '#e2e8f0',
                                  transition: 'all 0.3s'
                              }} 
                              placeholder={activeCat.hint} 
                              value={forms.support.msg} 
                              onChange={e => setForms({ ...forms, support: { ...forms.support, msg: e.target.value } })}
                          ></textarea>
                      </div>

                      {/* Bouton d'envoi dynamique */}
                      <button 
                          className="btn-p btn-support" 
                          disabled={sending || !forms.support.msg.trim()} 
                          onClick={() => send('sendSupport', forms.support)}
                          style={{ width: '100%', padding: '20px', fontSize: '1.1rem', letterSpacing: '2px', borderRadius: 20, transition: 'all 0.3s', fontWeight: 900 }}
                      >
                          {sending ? (
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                  <span className="pulse" style={{ fontSize: '1.2rem' }}>🔒</span> CRYPTAGE & TRANSMISSION...
                              </span>
                          ) : (
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                  <span style={{ fontSize: '1.3rem' }}>{activeCat.icon}</span> ENVOYER LE RAPPORT
                              </span>
                          )}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </main>

          {/* PANIER (CAISSE) */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel">
              <div className="cart-header">
                <h2 className="cart-title">Ticket Client</h2>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>#{forms.invoiceNum || '----'}</div>
              </div>

              <div style={{ padding: '20px 20px 0 20px' }}>
                <input className="inp" placeholder="N° FACTURE (Requis)" value={forms.invoiceNum} onChange={e => setForms({ ...forms, invoiceNum: e.target.value })} style={{ textAlign: 'center', background: '#000', borderColor: '#333', marginBottom: 0 }} />
              </div>

              <div className="cart-items">
                {cart.length === 0 ?
                  <div style={{ textAlign: 'center', marginTop: 50, opacity: 0.2, fontWeight: 700, fontStyle: 'italic' }}>Panier Vide</div>
                  : cart.map((i, idx) => (
                    <div key={idx} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#eee' }}>{i.name}</div>
                        <div style={{ color: 'var(--p)', fontSize: '0.75rem', fontWeight: 700 }}>${i.pu} / u.</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => { const n = [...cart]; if (n[idx].qty > 1) n[idx].qty--; else removeFromCart(idx); setCart(n); }}>-</button>
                          <input className="qty-input" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                          <button className="qty-btn" onClick={() => { const n = [...cart]; n[idx].qty++; setCart(n); }}>+</button>
                        </div>
                        <button className="del-btn" onClick={() => removeFromCart(idx)}>🗑️</button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Total à payer</span>
                  <span className="cart-total-display">${total.toLocaleString()}</span>
                </div>

                {/* ✅ GAIN ESTIMÉ (45% du CA) */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 14,
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  opacity: cart.length === 0 ? 0.35 : 1
                }}>
                  <span style={{
                    fontWeight: 800,
                    color: 'rgba(16,185,129,0.95)',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '1px'
                  }}>
                    Gain estimé 
                  </span>
                  <span style={{ fontWeight: 950, color: '#10b981', fontSize: '1.2rem' }}>
                    ${gainEstime.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-p" style={{ background: '#222', color: '#fff', flex: 1 }} onClick={requestClearCart}>Vider</button>
                  <button
                    className="btn-p"
                    style={{ flex: 3 }}
                    disabled={sending || !forms.invoiceNum || cart.length === 0}
                    onClick={() => send('sendFactures', { invoiceNumber: forms.invoiceNum, items: cart.map(x => ({ desc: x.name, qty: x.qty })) })}
                  >
                    ENCAISSER 💵
                  </button>
                </div>
              </div>
            </aside>
          )}
        </>
      )}

      {/* TOASTS & MODALS */}
      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}></div>
          <div>{toast.m}</div>
        </div>
      )}

      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 10 }}>{confirmModal.title}</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 30 }}>{confirmModal.msg}</p>
            <div style={{ display: 'flex', gap: 15 }}>
              <button className="btn-p" style={{ background: 'var(--glass-b)', color: '#fff' }} onClick={() => setConfirmModal(null)}>Annuler</button>
              <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
