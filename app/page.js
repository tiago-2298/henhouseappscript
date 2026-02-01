'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION (INCHANGÉE) ---
const MODULES = [
  { id: 'home', l: 'Tableau de bord', e: '🏠' },
  { id: 'invoices', l: 'Caisse', e: '💰' },
  { id: 'stock', l: 'Stock Cuisine', e: '📦' },
  { id: 'enterprise', l: 'Commande Pro', e: '🏢' },
  { id: 'partners', l: 'Partenaires', e: '🤝' },
  { id: 'expenses', l: 'Frais', e: '💳' },
  { id: 'garage', l: 'Garage', e: '🚗' },
  { id: 'directory', l: 'Annuaire', e: '👥' },
  { id: 'performance', l: 'Performance', e: '🏆' },
  { id: 'profile', l: 'Mon Profil', e: '👤' },
  { id: 'support', l: 'Support', e: '🆘' }
];

const IMAGES = {
  "Lasagne aux légumes": "https://images.unsplash.com/photo-1514516348920-f5d92839957d?w=400",
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Effiloché de Mouton": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400",
  "Burger Gourmet au Foie Gras": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Nectar Exotique": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
  "Kombucha Citron": "https://images.unsplash.com/photo-1594498653385-d5172b532c00?w=400",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Carpaccio Fruit Exotique": "https://files.catbox.moe/cbmjou.png",
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",
};

const NOTIF_MESSAGES = {
  sendFactures: { title: "💰 VENTE ENREGISTRÉE", msg: "La facture a été transmise avec succès." },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "Production cuisine déclarée." },
  sendEntreprise: { title: "🏢 B2B ENVOYÉ", msg: "Bon de commande entreprise transmis." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "Commande partenaire enregistrée." },
  sendGarage: { title: "🚗 VÉHICULE ACTUALISÉ", msg: "État du véhicule mis à jour." },
  sendExpense: { title: "💳 FRAIS DÉCLARÉS", msg: "Note de frais et preuve envoyées." },
  sendSupport: { title: "🆘 TICKET OUVERT", msg: "Message transmis à la direction." },
  sync: { title: "☁️ CLOUD SYNCHRONISÉ", msg: "Données mises à jour." }
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
        notify("📸 PREUVE AJOUTÉE", "Le reçu a été joint au formulaire.", "success");
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
        osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5); osc.start(); osc.stop(now + 0.5);
      }
    } catch (e) {}
  };

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); if(s==='success') playSound('success');
    setTimeout(() => setToast(null), 3500); 
  };

  const loadData = async (isSync = false) => {
    if(isSync) notify("CONNEXION CLOUD", "Récupération des données...", "info");
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) { 
        setData(j); 
        const firstComp = Object.keys(j.partners.companies)[0];
        setForms(f => ({...f, 
          expense: {...f.expense, vehicle: j.vehicles[0]}, 
          garage: {...f.garage, vehicle: j.vehicles[0]},
          partner: { ...f.partner, company: firstComp, benef: j.partners.companies[firstComp].beneficiaries[0], items: [{ menu: j.partners.companies[firstComp].menus[0].name, qty: 1 }] }
        }));
        if(isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR RÉSEAU", "Impossible de joindre le serveur", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a,b)=>a+b.qty*b.pu, 0)), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const v = parseInt(val) || 0;
    if (v <= 0) {
        // Logique "suppression si 0" gérée ailleurs, ici on garde 1 min ou vide input
        n[idx].qty = v; 
    } else {
        n[idx].qty = v;
    }
    setCart(n);
  };

  const removeFromCart = (idx) => {
      const n = [...cart];
      n.splice(idx, 1);
      setCart(n);
      playSound('click');
  }

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success"); 
        if(action === 'sendFactures') { setCart([]); setForms(prev => ({...prev, invoiceNum: ''})); }
        else if (action === 'sendProduction') { setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]})); }
        else if (action === 'sendEntreprise') { setForms(prev => ({...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] }})); }
        else if (action === 'sendPartnerOrder') { setForms(prev => ({...prev, partner: { ...prev.partner, num: '' }})); }
        else if (action === 'sendExpense') { setForms(prev => ({...prev, expense: { ...prev.expense, amount: '', file: null }})); }
        else if (action === 'sendSupport') { setForms(prev => ({...prev, support: { ...prev.support, msg: '' }})); }
        loadData(); 
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const requestLogout = () => {
    setConfirmModal({
        title: "DÉCONNEXION",
        msg: "Terminer votre service et quitter ?",
        action: () => {
            localStorage.removeItem('hh_user');
            setView('login');
            setConfirmModal(null);
        }
    });
  };

  const requestClearCart = () => {
      if(cart.length === 0) return;
      setConfirmModal({
          title: "VIDER PANIER",
          msg: "Supprimer tous les articles ?",
          action: () => {
              setCart([]);
              setConfirmModal(null);
              playSound('click');
          }
      });
  };

  // --- SKELETON LOADER SCREEN ---
  if (loading && !data) return (
    <div className="app">
         <style jsx>{`
            .sk-main { flex: 1; padding: 40px; background: #000; display: flex; align-items: center; justify-content: center; }
            .loader { width: 48px; height: 48px; border: 5px solid #ff9800; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; }
            @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
         `}</style>
         <div className="sk-main"><span className="loader"></span></div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        /* --- MODERN VARIABLES --- */
        :root { 
            --p: #ff9800; 
            --bg-dark: #050505;
            --panel-bg: rgba(20, 20, 25, 0.65);
            --border-glass: rgba(255, 255, 255, 0.08);
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --success: #10b981; 
            --error: #ef4444; 
            --blur: blur(25px);
            --radius-lg: 24px;
            --radius-md: 16px;
            --glow: 0 0 20px rgba(255, 152, 0, 0.15);
        }
        
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; user-select: none; }
        
        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { 
            background: var(--bg-dark); 
            color: var(--text-main); 
            height: 100vh; 
            overflow: hidden; 
        }

        /* --- ANIMATED BACKGROUND --- */
        .app { 
            display: flex; 
            height: 100vh; 
            width: 100vw; 
            background: radial-gradient(circle at 10% 20%, rgba(255, 152, 0, 0.05) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%);
            position: relative;
        }

        /* --- SIDEBAR FLOATING DOCK --- */
        .side { 
            width: 90px; 
            height: 96vh;
            margin: 2vh 0 2vh 15px;
            background: rgba(10, 10, 12, 0.8);
            backdrop-filter: var(--blur);
            border: 1px solid var(--border-glass);
            border-radius: 20px;
            display: flex; 
            flex-direction: column; 
            align-items: center;
            padding: 20px 0;
            z-index: 100;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }
        .side:hover { width: 240px; padding: 20px 15px; }

        .logo-area { margin-bottom: 30px; display: flex; align-items: center; justify-content: center; width: 100%; }
        .logo-img { height: 45px; transition: 0.3s; }
        
        .nav-l { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            padding: 12px 14px; 
            border-radius: 12px; 
            border: 1px solid transparent; 
            background: transparent; 
            color: var(--text-muted); 
            cursor: pointer; 
            font-weight: 600; 
            width: 100%; 
            transition: 0.2s; 
            margin-bottom: 6px;
            white-space: nowrap;
        }
        .nav-l span { font-size: 1.4rem; min-width: 30px; text-align: center; }
        .nav-l div { opacity: 0; transition: 0.2s; transform: translateX(-10px); }
        .side:hover .nav-l div { opacity: 1; transform: translateX(0); }
        
        .nav-l.active { 
            background: rgba(255, 152, 0, 0.15); 
            color: var(--p); 
            border-color: rgba(255, 152, 0, 0.3);
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.1);
        }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        /* --- MAIN AREA --- */
        .main { 
            flex: 1; 
            overflow-y: auto; 
            padding: 30px 40px; 
            position: relative; 
        }

        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- CARDS (Modern Glass) --- */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        
        .card { 
            background: var(--panel-bg); 
            backdrop-filter: var(--blur);
            border: 1px solid var(--border-glass); 
            border-radius: var(--radius-md); 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            position: relative; 
            overflow: hidden; 
        }
        .card:hover { 
            border-color: rgba(255, 152, 0, 0.5); 
            transform: translateY(-6px) scale(1.02); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.4), var(--glow); 
        }
        .card:active { transform: scale(0.98); }
        
        .card.sel { border-color: var(--p); box-shadow: inset 0 0 0 1px var(--p); }
        
        .card-qty { 
            position: absolute; top: 10px; right: 10px; 
            background: var(--p); color: #000; 
            width: 28px; height: 28px; border-radius: 50%; 
            font-size: 0.8rem; display: flex; align-items: center; justify-content: center; 
            font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10;
        }

        .card-img-wrap { height: 120px; width: 100%; position: relative; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .card-img-empty { width: 100%; height: 100%; background: linear-gradient(45deg, #1a1a1a, #2a2a2a); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #333; }

        .card-info { padding: 12px; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0)); position: absolute; bottom: 0; left: 0; width: 100%; }
        .card-title { font-weight: 700; font-size: 0.85rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-price { color: var(--p); font-weight: 800; font-size: 0.95rem; text-shadow: 0 2px 4px rgba(0,0,0,1); }

        /* --- FORMS (Glassmorphism) --- */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { 
            width: 100%; max-width: 500px; 
            background: rgba(15, 15, 20, 0.75); 
            backdrop-filter: blur(40px); 
            padding: 40px; 
            border-radius: 30px; 
            border: 1px solid rgba(255,255,255,0.1); 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); 
        }
        
        .inp { 
            width: 100%; padding: 16px 20px; 
            border-radius: 14px; 
            border: 1px solid var(--border-glass); 
            background: rgba(0,0,0,0.3); 
            color: #fff; font-weight: 600; font-size: 0.95rem;
            margin-bottom: 15px; transition: 0.3s; 
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.1); }
        
        .btn-p { 
            background: linear-gradient(135deg, var(--p), #f57c00); 
            color: #fff; border:none; padding: 18px; 
            border-radius: 16px; font-weight: 800; letter-spacing: 0.5px;
            cursor: pointer; width: 100%; transition: 0.3s; 
            box-shadow: 0 10px 20px rgba(255, 152, 0, 0.2);
            text-transform: uppercase;
            font-size: 0.9rem;
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255, 152, 0, 0.3); }
        .btn-p:active { transform: translateY(1px); }
        .btn-p:disabled { background: #333; color: #666; cursor: not-allowed; box-shadow: none; transform: none; }
        
        /* --- CART SIDEBAR (New Design) --- */
        .cart { 
            width: 380px; 
            background: rgba(10, 10, 12, 0.85);
            backdrop-filter: blur(30px);
            border-left: 1px solid var(--border-glass); 
            display: flex; flex-direction: column; 
            padding: 0;
            z-index: 50;
        }
        
        .cart-header { padding: 30px 25px; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; }
        .cart-items { flex: 1; overflow-y: auto; padding: 20px; }
        
        .cart-row { 
            display: flex; align-items: center; justify-content: space-between; 
            background: rgba(255,255,255,0.03); 
            padding: 12px; border-radius: 12px; margin-bottom: 10px; 
            border: 1px solid transparent; transition: 0.2s;
            animation: slideInRight 0.3s ease-out;
        }
        @keyframes slideInRight { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        
        .cart-row:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
        
        .qty-controls { display: flex; align-items: center; gap: 8px; background: #000; padding: 4px; border-radius: 8px; border: 1px solid var(--border-glass); }
        .qty-btn { width: 24px; height: 24px; border-radius: 6px; background: #222; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; transition: 0.2s; }
        .qty-btn:hover { background: var(--p); color: #000; }
        .qty-inp-cart { width: 30px; background: transparent; border: none; color: #fff; text-align: center; font-weight: 700; font-size: 0.9rem; }
        .qty-inp-cart:focus { outline: none; }

        .del-btn { background: rgba(239, 68, 68, 0.15); color: var(--error); border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; margin-left: 10px;}
        .del-btn:hover { background: var(--error); color: #fff; }

        .cart-footer { padding: 30px; background: rgba(0,0,0,0.4); border-top: 1px solid var(--border-glass); }

        /* --- FILTERS & CHIPS --- */
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 10px; }
        .chip { 
            padding: 10px 20px; border-radius: 100px; 
            background: rgba(255,255,255,0.05); 
            border: 1px solid var(--border-glass); 
            color: var(--text-muted); cursor: pointer; 
            white-space: nowrap; font-weight: 700; font-size: 0.85rem; transition: 0.3s; 
        }
        .chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .chip.active { background: var(--p); color: #000; border-color: var(--p); box-shadow: 0 0 15px rgba(255, 152, 0, 0.3); }

        /* --- STATS & PERFORMANCE --- */
        .perf-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); box-shadow: 0 0 10px var(--p); transition: width 1s ease-out; }

        /* --- OTHERS --- */
        .dropzone { border: 2px dashed var(--border-glass); border-radius: 20px; padding: 30px; text-align: center; transition: 0.3s; cursor: pointer; background: rgba(0,0,0,0.2); margin-bottom: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dropzone:hover, .dropzone.active { border-color: var(--p); background: rgba(255, 152, 0, 0.05); }

        .v-card { background: var(--panel-bg); border: 1px solid var(--border-glass); border-radius: 24px; padding: 25px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; }
        .v-card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: var(--glow); }
        .v-card-avatar { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--p), #f57c00); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 15px; border: 3px solid rgba(255,255,255,0.1); }
        .v-card-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; text-decoration: none; color: #fff; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; border: 1px solid transparent; }
        .v-card-btn:hover { border-color: var(--p); color: var(--p); background: rgba(255,152,0,0.05); }

        /* --- TOAST & MODAL --- */
        .toast { position: fixed; top: 30px; right: 30px; padding: 18px 25px; border-radius: 16px; z-index: 9999; animation: slideIn 0.4s ease-out; box-shadow: 0 20px 50px rgba(0,0,0,0.5); background: rgba(20, 20, 25, 0.95); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); min-width: 300px; display: flex; flex-direction: column; }
        .toast-title { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; opacity: 0.8; }
        .toast-msg { font-size: 1rem; font-weight: 600; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .modal-box { background: #15151a; border: 1px solid var(--border-glass); padding: 40px; border-radius: 30px; width: 90%; max-width: 420px; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.8); transform: scale(0.9); animation: popIn 0.3s forwards; }
        @keyframes popIn { to { transform: scale(1); } }

        /* --- LOGIN SCREEN --- */
        .login-bg { 
            position: absolute; width: 100%; height: 100%; 
            background: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop') no-repeat center center/cover;
            opacity: 0.4; filter: blur(3px); z-index: -1;
        }

        /* --- RESPONSIVE FIX --- */
        @media (max-width: 1000px) {
            .app { flex-direction: column; }
            .side { width: 100%; height: auto; flex-direction: row; overflow-x: auto; padding: 10px; margin: 0; border-radius: 0; border-bottom: 1px solid var(--border-glass); }
            .side:hover { width: 100%; padding: 10px; }
            .nav-l { flex-direction: column; padding: 10px; min-width: 80px; }
            .nav-l span { font-size: 1.2rem; }
            .nav-l div { font-size: 0.7rem; opacity: 1; transform: none; }
            .cart { position: absolute; right: 0; height: 100%; transform: translateX(100%); transition: 0.3s; }
            .cart.open { transform: translateX(0); }
        }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
          <div className="login-bg"></div>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420, position:'relative', zIndex:10}}>
            <div style={{width: 80, height: 80, background: 'var(--p)', borderRadius: '50%', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px var(--p)'}}>
                <span style={{fontSize: '2.5rem'}}>🐔</span>
            </div>
            <h1 style={{fontSize:'2.2rem', fontWeight:900, marginBottom:5, letterSpacing:'-1px', textShadow: '0 0 20px rgba(255,255,255,0.2)'}}>HEN HOUSE</h1>
            <p style={{color:'var(--text-muted)', fontSize:'0.95rem', marginBottom:40, letterSpacing: '2px', textTransform:'uppercase'}}>Terminal de Gestion Sécurisé</p>
            
            <div style={{marginBottom: 20, textAlign: 'left'}}>
                <label style={{display: 'block', color: 'var(--text-muted)', marginBottom: 8, fontSize: '0.8rem', fontWeight: 700, paddingLeft: 10}}>IDENTITÉ AGENT</label>
                <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{fontSize: '1rem', padding: '18px'}}>
                <option value="">Sélectionner un profil...</option>
                {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>INITIER LA CONNEXION &rarr;</button>
          </div>
        </div>
      ) : (
        <>
          <nav className="side">
            <div className="logo-area">
                <img src="https://i.goopics.net/dskmxi.png" className="logo-img" alt="Logo" />
            </div>
            <div style={{width: '100%', padding: '0 10px'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span>{t.e}</span>
                  <div>{t.l}</div>
                </button>
              ))}
            </div>
            
            <div style={{marginTop: 'auto', width: '100%', padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 5}}>
                <button className={`nav-l`} onClick={() => window.location.reload()} title="Rafraîchir"><span>🔃</span><div>Reload</div></button>
                <button className={`nav-l`} onClick={() => loadData(true)} title="Sync Cloud"><span>☁️</span><div>Sync</div></button>
                <button className={`nav-l`} onClick={() => {setIsMuted(!isMuted); playSound('click');}}><span>{isMuted ? '🔇' : '🔊'}</span><div>Sons</div></button>
                <button className="nav-l" onClick={requestLogout} style={{color: 'var(--error)'}}><span>🚪</span><div>Quitter</div></button>
            </div>
          </nav>

          <main className="main">
            <div className="fade-in">
              {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                    <div style={{marginBottom:40, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div>
                            <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 5, letterSpacing:'-1px', background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Bonjour, {user.split(' ')[0]}</h1>
                            <p style={{color: 'var(--text-muted)', fontSize: '1.1rem'}}>Prêt pour le service ? Voici vos stats en direct.</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <div style={{fontWeight:900, fontSize:'1.2rem', color:'#fff'}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div style={{color:'var(--p)', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase'}}>{myProfile?.role || 'Agent'}</div>
                        </div>
                    </div>
                    
                    <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 25, marginBottom: 50}}>
                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(255,152,0,0.1), rgba(0,0,0,0))', border: '1px solid rgba(255,152,0,0.2)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
                             <div style={{fontSize: '2.5rem', background: 'rgba(255,152,0,0.2)', width:60, height:60, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center'}}>💰</div>
                             <div style={{textAlign:'right'}}>
                                 <div style={{color:'var(--p)', fontWeight:800}}>+12%</div>
                                 <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>vs hier</div>
                             </div>
                         </div>
                         <div style={{fontSize: '2.2rem', fontWeight:900, color:'#fff', marginBottom:5}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         <div style={{color: 'var(--text-muted)', fontSize:'0.9rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px'}}>Chiffre d'Affaires</div>
                      </div>
                      
                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0))', border: '1px solid rgba(16,185,129,0.2)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
                             <div style={{fontSize: '2.5rem', background: 'rgba(16,185,129,0.2)', width:60, height:60, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center'}}>📦</div>
                         </div>
                         <div style={{fontSize: '2.2rem', fontWeight:900, color:'#fff', marginBottom:5}}>{myProfile?.stock.toLocaleString()} <span style={{fontSize:'1.2rem', opacity:0.5}}>u.</span></div>
                         <div style={{color: 'var(--text-muted)', fontSize:'0.9rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px'}}>Production Totale</div>
                      </div>

                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0,0,0,0))', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
                             <div style={{fontSize: '2.5rem', background: 'rgba(59, 130, 246, 0.2)', width:60, height:60, borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center'}}>💶</div>
                         </div>
                         <div style={{fontSize: '2.2rem', fontWeight:900, color:'#fff', marginBottom:5}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         <div style={{color: 'var(--text-muted)', fontSize:'0.9rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px'}}>Salaire Estimé</div>
                      </div>
                    </div>

                    <h3 style={{marginBottom: 20, fontWeight: 900, color: '#fff', fontSize: '1.2rem', display:'flex', alignItems:'center', gap:10}}><span style={{width:20, height:4, background:'var(--p)', borderRadius:2}}></span> ACCÈS RAPIDE</h3>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:15}}>
                    {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                        <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 20, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight: 140}}>
                            <span style={{fontSize:'3rem', display:'block', marginBottom:15, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'}}>{m.e}</span>
                            <div style={{fontSize:'0.9rem', fontWeight:800, color:'#fff'}}>{m.l}</div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* INVOICES (POS) */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', gap:20, marginBottom:25}}>
                      <div style={{position:'relative', flex:1}}>
                            <span style={{position:'absolute', left:18, top:16, opacity:0.5, fontSize:'1.2rem'}}>🔍</span>
                            <input className="inp" placeholder="Rechercher un produit..." style={{paddingLeft:55, height:55, marginBottom:0, fontSize:'1.1rem'}} onChange={e=>setSearch(e.target.value)} />
                      </div>
                  </div>
                  
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tout</div>
                    {Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                    ))}
                  </div>

                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const cartItem = cart.find(i=>i.name===p);
                      return (
                        <div key={p} className={`card ${cartItem?'sel':''}`} onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            <div className="card-img-wrap">
                                {IMAGES[p] ? <img src={IMAGES[p]} loading="lazy" /> : <div className="card-img-empty">{p.charAt(0)}</div>}
                            </div>
                            <div className="card-info">
                                <div className="card-title">{p}</div>
                                <div className="card-price">${data.prices[p]}</div>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EXPENSES */}
              {currentTab === 'expenses' && (
                <div className="center-box">
                    <div className="form-ui">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>NOTE DE FRAIS</h2>
                        <p style={{textAlign:'center', color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:30}}>Remboursement carburant ou matériel.</p>
                        
                        <div style={{display:'flex', gap:15, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                            <select className="inp" style={{flex:1}} value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                                <option>Essence</option><option>Réparation</option><option>Autre</option>
                            </select>
                        </div>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} style={{fontSize:'1.2rem', fontWeight:800}} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} 
                             onDragOver={e => { e.preventDefault(); setDragActive(true); }} 
                             onDragLeave={() => setDragActive(false)} 
                             onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} 
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                           
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           
                           {!forms.expense.file ? (
                             <>
                               <div style={{fontSize:'2.5rem', marginBottom:15, color:'var(--p)'}}>📸</div>
                               <div style={{fontWeight:800, fontSize:'0.9rem'}}>CLIQUE OU GLISSE TA PREUVE</div>
                               <div style={{fontSize:'0.8rem', color:'var(--text-muted)', marginTop:5}}>Ou CTRL+V pour coller</div>
                             </>
                           ) : (
                             <div className="dz-preview-container">
                               <button className="btn-del-file" title="Retirer" onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
                               <img src={forms.expense.file} className="dz-preview" alt="Reçu" />
                             </div>
                           )}
                        </div>
                        
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>ENVOYER LA DEMANDE</button>
                    </div>
                </div>
              )}

              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>PRODUCTION</h2>
                    <p style={{textAlign:'center', color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:30}}>Déclaration de stock journalière.</p>
                    
                    <div style={{maxHeight: 300, overflowY:'auto', paddingRight:5, marginBottom: 20}}>
                        {forms.stock.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10, alignItems:'center'}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Choisir produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                            </div>
                        ))}
                    </div>
                    
                    <button className="nav-l" style={{border:'1px dashed var(--border-glass)', justifyContent:'center', marginBottom: 20, background:'rgba(255,255,255,0.02)'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>COMMANDE PRO</h2>
                    <input className="inp" placeholder="Nom de l'entreprise" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    
                    <div style={{maxHeight: 250, overflowY:'auto', paddingRight:5, marginBottom:20}}>
                        {forms.enterprise.items.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                            </div>
                        ))}
                    </div>
                    <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>PARTENARIAT</h2>
                    <input className="inp" placeholder="Numéro de Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                    <div style={{display:'flex', gap:12, marginBottom:12}}>
                        <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    {forms.partner.items.map((item, idx) => (
                        <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                            <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LA VENTE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>ÉTAT VÉHICULE</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(0,0,0,0.2)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--border-glass)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ NIVEAU ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:8}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER GARAGE</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:35, color:'#fff'}}>Annuaire Entreprise</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:25}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card">
                            <div className="v-card-avatar">{e.name.charAt(0)}</div>
                            <div className="v-card-name" style={{fontSize:'1.2rem'}}>{e.name}</div>
                            <div className="v-card-role" style={{marginBottom:20}}>{e.role}</div>
                            <a href={`tel:${e.phone}`} className="v-card-btn">📞 {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:30}}>
                  <div className="form-ui" style={{maxWidth:'100%', padding:35}}>
                    <h2 style={{marginBottom:30, fontWeight:950, display:'flex', alignItems:'center', gap:10}}><span style={{fontSize:'2rem'}}>💰</span> CLASSEMENT C.A</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
                           <span><span style={{color:'var(--p)', fontWeight:800, width:25, display:'inline-block'}}>#{i+1}</span> {e.name}</span>
                           <b style={{color: '#fff'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="form-ui" style={{maxWidth:'100%', padding:35}}>
                    <h2 style={{marginBottom:30, fontWeight:950, display:'flex', alignItems:'center', gap:10}}><span style={{fontSize:'2rem'}}>📦</span> CLASSEMENT CUISINE</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
                           <span><span style={{color:'var(--success)', fontWeight:800, width:25, display:'inline-block'}}>#{i+1}</span> {e.name}</span>
                           <b>{e.stock.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{background:'var(--success)', boxShadow:'0 0 10px var(--success)', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                    <div className="form-ui" style={{maxWidth: 550, padding: 50, textAlign:'center'}}>
                        <div className="v-card-avatar" style={{width:110, height:110, fontSize:'3rem', margin:'0 auto 20px', boxShadow:'0 0 25px rgba(255,152,0,0.3)'}}>{user.charAt(0)}</div>
                        <h1 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:5}}>{user}</h1>
                        <div style={{color:'var(--p)', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase', marginBottom:30}}>{myProfile.role}</div>
                        
                        <div className="profile-grid">
                            <div className="stat-box">
                                <div className="stat-label">Chiffre Personnel</div>
                                <div className="stat-value">${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Plats Cuisinés</div>
                                <div className="stat-value">{myProfile.stock}</div>
                            </div>
                        </div>
                        <div style={{background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,0,0,0.3))', border: '1px solid var(--success)', borderRadius: 24, padding: 25, marginTop: 25}}>
                            <div className="stat-label" style={{color: 'var(--success)'}}>Salaire estimé</div>
                            <div style={{fontSize: '3rem', fontWeight: 950, color:'#fff'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>SUPPORT RH</h2>
                    <input className="inp" placeholder="Objet de la demande" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Expliquez votre problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* NEW CART SIDEBAR */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div className="cart-header">
                  <h2 style={{fontSize:'1.3rem', fontWeight:900, color:'#fff'}}>🛒 COMMANDE</h2>
                  <button onClick={requestClearCart} title="Tout vider" style={{background:'rgba(255,255,255,0.05)', border:'none', width:35, height:35, borderRadius:10, cursor:'pointer', color:'var(--text-muted)'}}>🗑️</button>
              </div>
              
              <div style={{padding:'20px 25px 0'}}>
                <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.1rem', letterSpacing:'1px', marginBottom:10}} />
              </div>

              <div className="cart-items">
                {cart.length === 0 ? 
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', opacity: 0.3, gap:10}}>
                        <span style={{fontSize:'3rem'}}>🕸️</span>
                        <span>Panier vide</span>
                    </div> 
                : cart.map((i, idx)=>(
                  <div key={idx} className="cart-row">
                    <div style={{flex:1, paddingRight:10}}>
                        <div style={{fontWeight:700, fontSize:'0.9rem', color:'#fff', lineHeight:'1.2'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.8rem', fontWeight:600}}>${i.pu}</div>
                    </div>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else removeFromCart(idx); setCart(n);}}>-</button>
                      <input 
                        className="qty-inp-cart" 
                        type="number" 
                        value={i.qty} 
                        onChange={(e) => updateCartQty(idx, e.target.value)} 
                        onBlur={(e) => { if(e.target.value==='' || e.target.value==='0') removeFromCart(idx); }}
                      />
                      <button className="qty-btn" onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                    <button className="del-btn" onClick={()=>removeFromCart(idx)}>×</button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20}}>
                    <span style={{fontWeight:700, color:'var(--text-muted)', fontSize:'0.9rem'}}>TOTAL À PAYER</span>
                    <b style={{fontSize:'2.2rem', color:'var(--p)', fontWeight:900, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                    {sending ? 'ENVOI...' : 'VALIDER PAIEMENT'}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>
          <div className="toast-title" style={{ color: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>{toast.t}</div>
          <div className="toast-msg">{toast.m}</div>
        </div>
      )}

      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.6rem', fontWeight:900, marginBottom:10, color:'#fff'}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--text-muted)', marginBottom:30}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'transparent', border:'1px solid var(--border-glass)', color:'#fff', boxShadow:'none'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
