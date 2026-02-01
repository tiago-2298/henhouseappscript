'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION ---
const MODULES = [
  { id: 'home', l: 'Tableau de bord', e: '🏠' },
  { id: 'invoices', l: 'Caisse Enregistreuse', e: '💰' }, // Renommé pour le RP
  { id: 'stock', l: 'Stock Cuisine', e: '📦' },
  { id: 'enterprise', l: 'Commande Pro', e: '🏢' },
  { id: 'partners', l: 'Partenaires', e: '🤝' },
  { id: 'expenses', l: 'Notes de Frais', e: '💳' },
  { id: 'garage', l: 'Garage', e: '🚗' },
  { id: 'directory', l: 'Annuaire', e: '👥' },
  { id: 'performance', l: 'Performance', e: '🏆' },
  { id: 'profile', l: 'Mon Profil', e: '👤' },
  { id: 'support', l: 'Support Patron', e: '🆘' }
];

// Images (Gardées telles quelles)
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
  sendFactures: { title: "💰 ENCAISSEMENT RÉUSSI", msg: "La vente a été enregistrée et transmise." },
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

  // --- LOGIQUE IMAGE & FICHIERS ---
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

  // --- AUDIO & NOTIFS ---
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now); 
        osc.frequency.linearRampToValueAtTime(659, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(); osc.stop(now + 0.4);
      }
    } catch (e) {}
  };

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); if(s==='success') playSound('success');
    setTimeout(() => setToast(null), 3500); 
  };

  // --- DATA ---
  const loadData = async (isSync = false) => {
    if(isSync) notify("SYNCHRONISATION", "Mise à jour en cours...", "info");
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) { 
        setData(j); 
        // Init default values if possible
        const firstComp = j.partners?.companies ? Object.keys(j.partners.companies)[0] : '';
        if(firstComp) {
            setForms(f => ({...f, 
            expense: {...f.expense, vehicle: j.vehicles[0]}, 
            garage: {...f.garage, vehicle: j.vehicles[0]},
            partner: { ...f.partner, company: firstComp, benef: j.partners.companies[firstComp].beneficiaries[0], items: [{ menu: j.partners.companies[firstComp].menus[0].name, qty: 1 }] }
            }));
        }
        if(isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a,b)=>a+b.qty*b.pu, 0)), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  // --- CART LOGIC ---
  const updateCartQty = (idx, val) => {
    const n = [...cart];
    // Autoriser le champ vide pendant la frappe, sinon 0
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
    if(sending) return; playSound('click'); setSending(true);
    try {
      // Nettoyage des quantités vides avant envoi
      if (action === 'sendFactures') {
          payload.items = payload.items.filter(i => i.qty > 0);
          if(payload.items.length === 0) { notify("ERREUR", "Panier vide ou quantités invalides", "error"); setSending(false); return; }
      }

      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success"); 
        
        // Reset specific forms
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
        msg: "Voulez-vous vraiment fermer votre session ?",
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
          title: "VIDER LE PANIER",
          msg: "Cette action supprimera tous les articles. Continuer ?",
          action: () => {
              setCart([]);
              setConfirmModal(null);
              playSound('click');
          }
      });
  };

  // --- SKELETON ---
  if (loading && !data) return (
    <div className="sk-container">
         <style jsx>{`
            .sk-container { width: 100vw; height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; }
            .loader { width: 48px; height: 48px; border: 5px solid #FFF; border-bottom-color: #ff9800; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; }
            @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
         `}</style>
         <span className="loader"></span>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        /* --- CORE THEME --- */
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg-dark: #0a0a0a;
            --glass: rgba(20, 20, 20, 0.65);
            --glass-border: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --success: #10b981; 
            --error: #ef4444; 
        }

        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        
        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        /* ANIMATED BACKGROUND */
        body { 
            background: radial-gradient(circle at top left, #1a1500, #000000, #050505);
            background-size: 100% 100%;
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
        }

        .app { display: flex; height: 100vh; width: 100vw; overflow: hidden; position: relative; }

        /* --- SIDEBAR (FLOATING DOCK) --- */
        .side-dock {
            width: 270px;
            margin: 20px;
            background: var(--glass);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            display: flex; 
            flex-direction: column; 
            z-index: 100;
            padding: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            transition: 0.3s;
        }

        .brand { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border); }
        .brand img { filter: drop-shadow(0 0 10px rgba(255, 152, 0, 0.3)); }

        .nav-btn { 
            display: flex; align-items: center; gap: 14px; 
            padding: 14px 16px; 
            border-radius: 14px; border: 1px solid transparent; 
            background: transparent; color: var(--muted); 
            cursor: pointer; font-weight: 700; font-size: 0.9rem; 
            width: 100%; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
            margin-bottom: 6px;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(3px); }
        .nav-btn.active { 
            background: rgba(255, 152, 0, 0.15); 
            color: var(--p); 
            border-color: rgba(255, 152, 0, 0.3);
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.1);
        }
        .nav-btn:active { transform: scale(0.97); }

        /* --- MAIN AREA --- */
        .main-container { 
            flex: 1; 
            margin: 20px 20px 20px 0; 
            background: var(--glass);
            backdrop-filter: blur(15px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .scroll-area { 
            flex: 1; 
            overflow-y: auto; 
            padding: 35px; 
        }

        .fade-in { animation: fade 0.4s ease-out; }
        @keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- CARDS (JUICY) --- */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        
        .card-item { 
            background: #141414; 
            border: 1px solid var(--glass-border); 
            border-radius: 20px; 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            position: relative; 
            overflow: hidden; 
            height: 220px;
            display: flex;
            flex-direction: column;
        }
        .card-item:hover { 
            border-color: var(--p); 
            transform: translateY(-6px); 
            box-shadow: 0 10px 30px -5px rgba(0,0,0,0.5);
        }
        .card-item:hover::after {
            content: ''; position: absolute; inset: 0;
            background: radial-gradient(circle at center, rgba(255,152,0,0.1), transparent 70%);
            z-index: 1; pointer-events: none;
        }
        .card-item.selected { border: 2px solid var(--p); box-shadow: 0 0 20px rgba(255,152,0,0.2); }

        .card-img { height: 65%; width: 100%; object-fit: cover; background: #222; mask-image: linear-gradient(to bottom, black 70%, transparent 100%); }
        .card-info { padding: 12px; position: relative; z-index: 2; margin-top: -30px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        .card-title { font-weight: 800; font-size: 0.9rem; line-height: 1.2; margin-bottom: 4px; }
        .card-price { color: var(--p); font-weight: 900; font-size: 1.1rem; }
        .card-badge { position: absolute; top: 10px; right: 10px; background: var(--p); color: #fff; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.4); z-index: 5; }

        /* --- CART (FLOATING PANEL) --- */
        .cart-panel {
            width: 350px;
            background: #000;
            border-left: 1px solid var(--glass-border);
            display: flex;
            flex-direction: column;
            z-index: 90;
        }
        .cart-header { padding: 25px; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: #080808; }
        .cart-items { flex: 1; overflow-y: auto; padding: 15px; }
        .cart-item { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 8px; border: 1px solid transparent; transition: 0.2s; }
        .cart-item:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
        
        /* INPUT QUANTITE CART */
        .qty-input { 
            width: 50px; text-align: center; background: rgba(0,0,0,0.3); 
            border: 1px solid var(--glass-border); color: #fff; 
            border-radius: 8px; padding: 6px; font-weight: 800; 
        }
        .qty-input:focus { border-color: var(--p); outline: none; background: rgba(255,152,0,0.1); }
        
        .btn-trash { background: none; border: none; color: #555; cursor: pointer; transition: 0.2s; padding: 5px; }
        .btn-trash:hover { color: var(--error); transform: scale(1.1); }

        /* --- FORMS & UI ELEMENTS --- */
        .center-stage { display: flex; align-items: center; justify-content: center; min-height: 100%; padding: 40px; }
        .glass-form { 
            width: 100%; max-width: 500px; 
            background: rgba(0,0,0,0.4); backdrop-filter: blur(30px);
            padding: 40px; border-radius: 30px; 
            border: 1px solid var(--glass-border); 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); 
        }

        .inp { 
            width: 100%; padding: 16px 20px; 
            border-radius: 16px; border: 1px solid var(--glass-border); 
            background: rgba(0,0,0,0.3); color: #fff; 
            font-weight: 600; font-size: 0.95rem; margin-bottom: 15px; 
            transition: 0.3s; 
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(255,152,0,0.1); }
        
        .btn-main { 
            width: 100%; padding: 18px; 
            border-radius: 16px; border: none; 
            background: var(--p); color: #fff; 
            font-weight: 800; font-size: 1rem; letter-spacing: 0.5px;
            cursor: pointer; transition: 0.3s; 
            box-shadow: 0 10px 20px -5px rgba(255,152,0,0.4);
            position: relative; overflow: hidden;
        }
        .btn-main::after {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
        }
        .btn-main:hover::after { left: 100%; }
        .btn-main:active { transform: scale(0.98); }
        .btn-main:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

        /* --- FILTERS --- */
        .chip-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 10px; scrollbar-width: none; }
        .chip { 
            padding: 8px 18px; border-radius: 100px; 
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); 
            color: var(--muted); cursor: pointer; white-space: nowrap; 
            font-weight: 700; font-size: 0.85rem; transition: 0.3s; 
        }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 4px 15px rgba(255,152,0,0.3); }

        /* --- PROFILE STATS --- */
        .stat-card { background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; text-align: center; }
        .stat-big { font-size: 2rem; font-weight: 900; color: #fff; margin: 5px 0; }
        .stat-lbl { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
        
        .sparkline { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 15px; position: relative; overflow: hidden; }
        .sparkline-fill { height: 100%; background: var(--p); border-radius: 10px; }

        /* TOAST */
        .toast { 
            position: fixed; top: 30px; right: 30px; 
            padding: 20px 30px; border-radius: 16px; 
            z-index: 10000; animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            box-shadow: 0 20px 50px rgba(0,0,0,0.5); 
            min-width: 300px; backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }

        /* UTILS */
        .dropzone { border: 2px dashed var(--glass-border); padding: 30px; border-radius: 20px; text-align: center; transition: 0.3s; background: rgba(0,0,0,0.2); cursor: pointer; }
        .dropzone:hover, .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.05); }

        /* PROFILE SPECIFIC */
        .avatar-xl { 
            width: 120px; height: 120px; border-radius: 30px; 
            background: linear-gradient(135deg, #ff9800, #ff5722); 
            display: flex; align-items: center; justify-content: center; 
            font-size: 3rem; font-weight: 900; color: #fff; 
            margin: 0 auto 20px; box-shadow: 0 20px 40px rgba(255,87,34,0.3); 
        }

      `}</style>

      {/* --- LOGIN SCREEN --- */}
      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
           <div className="glass-form" style={{textAlign: 'center', position:'relative', overflow:'hidden'}}>
               <div style={{position:'absolute', top:'-50%', left:'-50%', width:'200%', height:'200%', background:'radial-gradient(circle, rgba(255,152,0,0.15) 0%, transparent 60%)', pointerEvents:'none'}}></div>
               <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30, dropShadow: '0 10px 20px rgba(0,0,0,0.5)'}} />
               <h1 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:5}}>Hen House</h1>
               <p style={{color:'var(--muted)', marginBottom:40}}>Management System v2.0</p>
               
               <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center', textLastAlign:'center'}}>
                 <option value="">-- SÉLECTIONNER AGENT --</option>
                 {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
               </select>
               
               <button className="btn-main" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>
                 OUVRIR LA SESSION
               </button>
           </div>
        </div>
      ) : (
        /* --- APP LAYOUT --- */
        <>
          <nav className="side-dock">
             <div className="brand">
                 <img src="https://i.goopics.net/dskmxi.png" height="50" />
             </div>
             <div style={{flex:1, overflowY:'auto'}}>
                {MODULES.map(m => (
                    <button key={m.id} className={`nav-btn ${currentTab===m.id ? 'active' : ''}`} onClick={()=>{playSound('click'); setCurrentTab(m.id);}}>
                        <span style={{fontSize:'1.4rem'}}>{m.e}</span>
                        {m.l}
                    </button>
                ))}
             </div>
             
             {/* USER MINI PROFIL */}
             <div style={{background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '16px', marginTop: '20px', border:'1px solid var(--glass-border)'}}>
                 <div style={{fontSize:'0.9rem', fontWeight:800}}>{user}</div>
                 <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700, textTransform:'uppercase', marginBottom:'10px'}}>{myProfile?.role || 'Staff'}</div>
                 <div style={{display:'flex', gap:10}}>
                     <button className="nav-btn" style={{justifyContent:'center', padding:8, background:'rgba(255,255,255,0.1)'}} onClick={()=>setIsMuted(!isMuted)}>{isMuted ? '🔇' : '🔊'}</button>
                     <button className="nav-btn" style={{justifyContent:'center', padding:8, background:'rgba(239,68,68,0.2)', color:'#ef4444'}} onClick={requestLogout}>🚪</button>
                 </div>
             </div>
          </nav>

          <div className="main-container">
            <div className="scroll-area">
                
                {/* --- HEADER TITLE DYNAMIC --- */}
                {currentTab !== 'home' && (
                    <div className="fade-in" style={{marginBottom: 30, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                         <h1 style={{fontSize:'2rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'-1px'}}>
                             <span style={{marginRight:15}}>{MODULES.find(m=>m.id===currentTab)?.e}</span>
                             {MODULES.find(m=>m.id===currentTab)?.l}
                         </h1>
                         {currentTab === 'invoices' && (
                             <input className="inp" placeholder="🔍 Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:250, margin:0, borderRadius:100, padding:'10px 20px'}} />
                         )}
                    </div>
                )}

                <div className="fade-in">
                    {/* HOME */}
                    {currentTab === 'home' && (
                        <div>
                            <div style={{marginBottom: 50}}>
                                <h1 style={{fontSize:'3.5rem', fontWeight:900, background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Bonjour, {user.split(' ')[0]}</h1>
                                <p style={{color:'var(--muted)', fontSize:'1.1rem'}}>Prêt pour le service ? Voici tes stats du jour.</p>
                            </div>

                            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:25, marginBottom:50}}>
                                <div className="stat-card" style={{position:'relative', overflow:'hidden'}}>
                                    <div style={{position:'absolute', top:-20, right:-20, fontSize:'8rem', opacity:0.05}}>💰</div>
                                    <div className="stat-lbl">Chiffre d'Affaires</div>
                                    <div className="stat-big" style={{color:'var(--p)'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                                    <div className="sparkline"><div className="sparkline-fill" style={{width:'65%'}}></div></div>
                                </div>
                                <div className="stat-card" style={{position:'relative', overflow:'hidden'}}>
                                    <div style={{position:'absolute', top:-20, right:-20, fontSize:'8rem', opacity:0.05}}>📦</div>
                                    <div className="stat-lbl">Production</div>
                                    <div className="stat-big" style={{color:'var(--success)'}}>{myProfile?.stock || 0} <small style={{fontSize:'1rem'}}>u.</small></div>
                                    <div className="sparkline"><div className="sparkline-fill" style={{width:'40%', background:'var(--success)'}}></div></div>
                                </div>
                                <div className="stat-card" style={{position:'relative', overflow:'hidden'}}>
                                    <div style={{position:'absolute', top:-20, right:-20, fontSize:'8rem', opacity:0.05}}>💶</div>
                                    <div className="stat-lbl">Salaire Estimé</div>
                                    <div className="stat-big">${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                                    <div className="sparkline"><div className="sparkline-fill" style={{width:'80%', background:'#6366f1'}}></div></div>
                                </div>
                            </div>

                            <h3 style={{marginBottom:20, textTransform:'uppercase', color:'var(--muted)', fontSize:'0.8rem', fontWeight:800, letterSpacing:1}}>Accès Rapide</h3>
                            <div className="grid">
                                {MODULES.filter(m => !['home','profile','support','directory'].includes(m.id)).map(m => (
                                    <div key={m.id} className="card-item" onClick={()=>setCurrentTab(m.id)} style={{height:160, alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.02)'}}>
                                        <div style={{fontSize:'3rem', marginBottom:15}}>{m.e}</div>
                                        <div style={{fontWeight:800}}>{m.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CAISSE (INVOICES) */}
                    {currentTab === 'invoices' && (
                        <>
                           <div className="chip-row">
                                <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                                {Object.keys(data.productsByCategory).map(c => (
                                    <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                                ))}
                           </div>
                           <div className="grid">
                                {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                                    const inCart = cart.find(i=>i.name===p);
                                    return (
                                        <div key={p} className={`card-item ${inCart ? 'selected' : ''}`} onClick={()=>{
                                            playSound('click');
                                            if(inCart) updateCartQty(cart.findIndex(x=>x.name===p), (inCart.qty || 0) + 1);
                                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                                        }}>
                                            {inCart && <span className="card-badge">{inCart.qty}</span>}
                                            {IMAGES[p] ? <img src={IMAGES[p]} className="card-img" /> : <div className="card-img" style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem'}}>{p[0]}</div>}
                                            <div className="card-info">
                                                <div className="card-title">{p}</div>
                                                <div className="card-price">${data.prices[p]}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                           </div>
                        </>
                    )}

                    {/* FRAIS */}
                    {currentTab === 'expenses' && (
                        <div className="center-stage">
                            <div className="glass-form">
                                <h2 style={{textAlign:'center', marginBottom:30, fontWeight:900}}>Note de Frais</h2>
                                <div style={{display:'flex', gap:15}}>
                                    <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                        {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                                    </select>
                                    <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                                        <option>Essence</option><option>Réparation</option><option>Autre</option>
                                    </select>
                                </div>
                                <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                                
                                <div className={`dropzone ${dragActive ? 'active' : ''}`} 
                                     onDragOver={e => { e.preventDefault(); setDragActive(true); }} 
                                     onDragLeave={() => setDragActive(false)} 
                                     onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} 
                                     onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                                     
                                     <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                                     
                                     {forms.expense.file ? (
                                         <div style={{position:'relative'}}>
                                             <img src={forms.expense.file} style={{maxHeight:150, borderRadius:10, maxWidth:'100%'}} />
                                             <button style={{position:'absolute', top:-10, right:-10, background:'var(--error)', color:'#fff', border:'none', width:30, height:30, borderRadius:'50%', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}})}} >×</button>
                                         </div>
                                     ) : (
                                         <div style={{color:'var(--muted)'}}>
                                             <div style={{fontSize:'2rem', marginBottom:10}}>📸</div>
                                             <div>Glisser une preuve ou CTRL+V</div>
                                         </div>
                                     )}
                                </div>
                                <button className="btn-main" style={{marginTop:20}} disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>VALIDER LA NOTE</button>
                            </div>
                        </div>
                    )}

                    {/* STOCK */}
                    {currentTab === 'stock' && (
                        <div className="center-stage"><div className="glass-form">
                             <h2 style={{textAlign:'center', marginBottom:30}}>Production Cuisine</h2>
                             {forms.stock.map((item, i) => (
                                <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                    <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Choisir produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                    <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                                </div>
                             ))}
                             <div style={{display:'flex', gap:10, marginTop:20}}>
                                <button className="btn-main" style={{background:'rgba(255,255,255,0.1)'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+</button>
                                <button className="btn-main" onClick={()=>send('sendProduction', {items: forms.stock})}>ENVOYER STOCK</button>
                             </div>
                        </div></div>
                    )}

                    {/* ENTREPRISE */}
                    {currentTab === 'enterprise' && (
                        <div className="center-stage"><div className="glass-form">
                            <h2 style={{textAlign:'center', marginBottom:30}}>Commande Pro</h2>
                            <input className="inp" placeholder="Nom de l'entreprise" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                            <div style={{maxHeight:200, overflowY:'auto', marginBottom:20}}>
                                {forms.enterprise.items.map((item, i) => (
                                    <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                        <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                        <input type="number" className="inp" style={{width:80, marginBottom:0}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                                    </div>
                                ))}
                            </div>
                            <div style={{display:'flex', gap:10}}>
                                <button className="btn-main" style={{background:'rgba(255,255,255,0.1)', width:60}} onClick={()=>setForms({...forms, enterprise:{...forms.enterprise, items:[...forms.enterprise.items, {product:'', qty:1}]}})}>+</button>
                                <button className="btn-main" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>LIVRER</button>
                            </div>
                        </div></div>
                    )}
                    
                    {/* GARAGE */}
                    {currentTab === 'garage' && (
                        <div className="center-stage"><div className="glass-form">
                            <h2 style={{textAlign:'center', marginBottom:30}}>Garage & Véhicules</h2>
                            <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                            <div style={{display:'flex', gap:10, marginBottom:20}}>
                                <button className="btn-main" style={{background: forms.garage.action==='Entrée' ? 'var(--p)' : 'rgba(255,255,255,0.1)'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Entrée'}})}>ENTRÉE (P)</button>
                                <button className="btn-main" style={{background: forms.garage.action==='Sortie' ? 'var(--p)' : 'rgba(255,255,255,0.1)'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Sortie'}})}>SORTIE</button>
                            </div>
                            <div style={{background:'rgba(0,0,0,0.3)', padding:20, borderRadius:16, border:'1px solid var(--glass-border)'}}>
                                <div style={{display:'flex', justifyContent:'space-between', fontWeight:700, marginBottom:10}}><span>Niveau Essence</span><span>{forms.garage.fuel}%</span></div>
                                <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                            </div>
                            <button className="btn-main" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>VALIDER MOUVEMENT</button>
                        </div></div>
                    )}

                    {/* DIRECTORY */}
                    {currentTab === 'directory' && (
                        <div className="grid">
                            {data.employeesFull.map(e => (
                                <div key={e.id} style={{background:'rgba(255,255,255,0.03)', padding:25, borderRadius:20, display:'flex', flexDirection:'column', alignItems:'center', border:'1px solid var(--glass-border)'}}>
                                    <div style={{width:60, height:60, borderRadius:20, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:900, marginBottom:15}}>{e.name[0]}</div>
                                    <div style={{fontWeight:800, fontSize:'1.1rem'}}>{e.name}</div>
                                    <div style={{color:'var(--muted)', fontSize:'0.8rem', textTransform:'uppercase', marginBottom:15}}>{e.role}</div>
                                    <div style={{background:'rgba(255,255,255,0.1)', padding:'8px 15px', borderRadius:10, fontWeight:700, fontSize:'0.9rem'}}>📞 {e.phone}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* PROFILE */}
                    {currentTab === 'profile' && myProfile && (
                        <div className="center-stage">
                            <div className="glass-form" style={{maxWidth:600}}>
                                <div className="avatar-xl">{user[0]}</div>
                                <h1 style={{textAlign:'center', fontSize:'2.5rem', fontWeight:900, marginBottom:5}}>{user}</h1>
                                <div style={{textAlign:'center', color:'var(--p)', fontWeight:800, textTransform:'uppercase', letterSpacing:2, marginBottom:40}}>{myProfile.role}</div>
                                
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                                    <div className="stat-card">
                                        <div className="stat-lbl">Ventes Totales</div>
                                        <div className="stat-big">${Math.round(myProfile.ca).toLocaleString()}</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-lbl">Primes Estimées</div>
                                        <div className="stat-big" style={{color:'var(--success)'}}>${Math.round(myProfile.salary).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            
            {/* --- CART FLOATING PANEL --- */}
            {currentTab === 'invoices' && (
                <div className="cart-panel">
                    <div className="cart-header">
                        <div style={{fontWeight:900, fontSize:'1.2rem', display:'flex', alignItems:'center', gap:10}}>
                            🛒 COMMANDE <span style={{background:'var(--p)', color:'#fff', padding:'2px 8px', borderRadius:6, fontSize:'0.8rem'}}>{cart.length}</span>
                        </div>
                        <button onClick={requestClearCart} style={{background:'transparent', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'0.8rem', fontWeight:700}}>VIDER</button>
                    </div>

                    <div style={{padding:'15px 15px 0'}}>
                        <input className="inp" placeholder="N° FACTURE (Requis)" style={{marginBottom:0, textAlign:'center', border:'1px solid var(--p)'}} value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} />
                    </div>

                    <div className="cart-items">
                        {cart.length === 0 ? (
                            <div style={{textAlign:'center', marginTop:50, color:'var(--muted)', fontStyle:'italic'}}>Le panier est vide.<br/>Cliquez sur des produits.</div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="cart-item">
                                    <div style={{flex:1}}>
                                        <div style={{fontWeight:700, fontSize:'0.9rem'}}>{item.name}</div>
                                        <div style={{fontSize:'0.8rem', color:'var(--muted)'}}>${item.pu} / u</div>
                                    </div>
                                    {/* INPUT QUANTITE DIRECTE */}
                                    <input 
                                        className="qty-input" 
                                        type="text" 
                                        inputMode="numeric"
                                        value={item.qty} 
                                        onChange={(e) => updateCartQty(idx, e.target.value)}
                                        onClick={(e) => e.target.select()}
                                    />
                                    <button className="btn-trash" onClick={() => removeFromCart(idx)}>🗑️</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{background:'#111', padding:25, borderTop:'1px solid var(--glass-border)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20}}>
                            <span style={{color:'var(--muted)', fontWeight:700}}>TOTAL A PAYER</span>
                            <span style={{fontSize:'2.2rem', fontWeight:900, color:'var(--p)', lineHeight:1}}>${total.toLocaleString()}</span>
                        </div>
                        <button className="btn-main" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                             {sending ? 'ENVOI...' : 'ENCAISSER ➔'}
                        </button>
                    </div>
                </div>
            )}
          </div>
        </>
      )}

      {/* TOAST & MODAL */}
      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : 'var(--success)' }}>
          <div style={{fontWeight:900, color: toast.s === 'error' ? 'var(--error)' : 'var(--success)', marginBottom:4}}>{toast.t}</div>
          <div>{toast.m}</div>
        </div>
      )}
      
      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.5rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:25}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:10}}>
                      <button className="btn-main" style={{background:'rgba(255,255,255,0.1)'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-main" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
