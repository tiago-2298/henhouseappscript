'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION ---
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
    } catch (e) {}
  };

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); if(s==='success') playSound('success');
    setTimeout(() => setToast(null), 3500); 
  };

  const loadData = async (isSync = false) => {
    if(isSync) notify("SYNCHRONISATION", "Mise à jour en cours...", "info");
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
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a,b)=>a+b.qty*b.pu, 0)), [cart]);
  const salaryGain = useMemo(() => Math.round(total * 0.45), [total]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const v = parseInt(val) || 0;
    if (v <= 0) n.splice(idx, 1);
    else n[idx].qty = v;
    setCart(n);
  };

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

  // --- SKELETON LOADER SCREEN ---
  if (loading && !data) return (
    <div className="app">
         <style jsx>{`
            .sk-side { width: 90px; height: 95vh; margin: 2.5vh 0 0 20px; background: rgba(0,0,0,0.5); border-radius: 24px; }
            .sk-main { flex: 1; padding: 40px; }
            .sk-box { background: rgba(255,255,255,0.05); border-radius: 12px; animation: pulse 1.5s infinite; }
            .sk-row { display: flex; gap: 15px; margin-bottom: 20px; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
         `}</style>
         <div className="sk-side"></div>
         <div className="sk-main">
            <div className="sk-box" style={{height: 50, width: 300, marginBottom: 10}} />
            <div className="sk-box" style={{height: 20, width: 200, marginBottom: 40}} />
            <div className="sk-row">
                <div className="sk-box" style={{height: 150, flex: 1}} />
                <div className="sk-box" style={{height: 150, flex: 1}} />
                <div className="sk-box" style={{height: 150, flex: 1}} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:20}}>
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="sk-box" style={{height: 180}} />)}
            </div>
         </div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg: #050507; 
            --panel: rgba(20, 20, 24, 0.7); 
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --brd: rgba(255,255,255,0.08); 
            --glass: rgba(255, 255, 255, 0.02);
            --glass-strong: rgba(18, 18, 20, 0.85);
            --radius: 24px; 
            --success: #10b981; 
            --error: #ef4444; 
            --ticket-bg: #e6e6e6;
            --ticket-txt: #1a1a1a;
        }

        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0px; height: 0px; }

        body { 
            background: var(--bg); 
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 152, 0, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%);
            animation: bg-move 20s infinite alternate ease-in-out;
        }
        @keyframes bg-move {
            0% { background-position: 0% 0%; }
            100% { background-position: 10% 10%; }
        }

        .app { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

        /* --- NEW FLOATING SIDEBAR --- */
        .side-container {
            width: 100px;
            padding: 20px 0 20px 20px;
            display: flex;
            flex-direction: column;
            z-index: 100;
        }
        .side { 
            flex: 1;
            background: var(--glass-strong);
            backdrop-filter: blur(20px);
            border: 1px solid var(--brd);
            border-radius: 30px;
            display: flex; 
            flex-direction: column; 
            align-items: center;
            padding: 25px 0;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            transition: width 0.3s;
        }
        
        .nav-l { 
            display: flex; 
            align-items: center; 
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 16px; 
            border: none; 
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            margin-bottom: 12px; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            position: relative;
        }
        .nav-l span { font-size: 1.5rem; }
        .nav-l.active { 
            background: linear-gradient(135deg, var(--p), #ffb74d); 
            color: #fff; 
            box-shadow: 0 5px 20px var(--p-glow); 
            transform: scale(1.1);
        }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.07); color: #fff; transform: scale(1.05); }
        .tooltip { display: none; } /* Tooltips handled by title usually, kept simple for icons */
        
        .main { 
            flex: 1; 
            overflow-y: auto; 
            padding: 30px 40px; 
            position: relative; 
            scroll-behavior: smooth;
        }

        /* --- NEW JUICY CARDS --- */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 24px; }
        
        .card { 
            background: var(--panel); 
            border: 1px solid var(--brd); 
            border-radius: 24px; 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            position: relative; 
            overflow: hidden;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
        }
        .card:hover { 
            border-color: var(--p); 
            transform: translateY(-8px) scale(1.02); 
            box-shadow: 0 15px 35px -5px var(--p-glow);
        }
        .card:active { transform: scale(0.98); }
        .card.sel { border-color: var(--p); box-shadow: 0 0 0 2px var(--p) inset; }
        
        .card-img-box {
            width: 100%;
            height: 120px;
            background: #000;
            position: relative;
            overflow: hidden;
        }
        .card-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
        }
        .card:hover .card-img-box img { transform: scale(1.1); }
        
        .card-content { padding: 15px; text-align: left; }
        
        .card-qty { 
            position: absolute; 
            top: 10px; right: 10px; 
            background: var(--p); 
            color: #fff; 
            width: 28px; height: 28px; 
            border-radius: 50%; 
            font-size: 0.8rem; 
            display: flex; align-items: center; justify-content: center; 
            font-weight: 900; 
            z-index: 10;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }

        /* --- FORMS GLASSMORPHISM --- */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; padding-bottom: 50px; }
        .form-ui { 
            width: 100%; 
            max-width: 550px; 
            background: rgba(20, 20, 25, 0.6); 
            backdrop-filter: blur(40px); 
            -webkit-backdrop-filter: blur(40px);
            padding: 45px; 
            border-radius: 36px; 
            border: 1px solid rgba(255,255,255,0.1); 
            box-shadow: 0 30px 80px rgba(0,0,0,0.6);
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .inp { 
            width: 100%; 
            padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid var(--brd); 
            background: rgba(0,0,0,0.3); 
            color: #fff; 
            font-weight: 600; 
            margin-bottom: 15px; 
            transition: 0.2s;
            font-size: 0.95rem;
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.5); box-shadow: 0 0 20px -5px var(--p-glow); }
        
        .btn-p { 
            background: linear-gradient(135deg, var(--p), #fb8c00); 
            color: #fff; 
            border:none; 
            padding: 18px; 
            border-radius: 16px; 
            font-weight: 800; 
            cursor: pointer; 
            width: 100%; 
            transition: 0.3s;
            font-size: 1rem;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 25px -5px var(--p-glow);
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px var(--p-glow); filter: brightness(1.1); }
        .btn-p:active { transform: scale(0.98); }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; box-shadow: none; transform: none; }
        
        /* --- RECEIPT STYLE CART --- */
        .cart-container { width: 360px; padding: 20px 20px 20px 0; display: flex; z-index: 50; }
        .cart { 
            width: 100%;
            background: var(--ticket-bg); 
            color: var(--ticket-txt);
            border-radius: 20px;
            display: flex; 
            flex-direction: column;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            /* Jagged Edge Effect */
            clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), 95% 100%, 90% calc(100% - 10px), 85% 100%, 80% calc(100% - 10px), 75% 100%, 70% calc(100% - 10px), 65% 100%, 60% calc(100% - 10px), 55% 100%, 50% calc(100% - 10px), 45% 100%, 40% calc(100% - 10px), 35% 100%, 30% calc(100% - 10px), 25% 100%, 20% calc(100% - 10px), 15% 100%, 10% calc(100% - 10px), 5% 100%, 0% calc(100% - 10px));
            animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .qty-inp { width: 40px; background: rgba(0,0,0,0.1); border: none; color: #000; text-align: center; border-radius: 6px; font-weight: 800; padding: 4px 0; font-size: 1rem; }
        
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 10px; scrollbar-width: none; mask-image: linear-gradient(to right, black 90%, transparent 100%); }
        .chip { padding: 10px 24px; border-radius: 100px; background: rgba(255,255,255,0.05); border: 1px solid var(--brd); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 700; font-size: 0.85rem; transition: 0.3s; backdrop-filter: blur(5px); }
        .chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 5px 20px var(--p-glow); }

        .perf-bar { height: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; box-shadow: inset 0 2px 5px rgba(0,0,0,0.3); }
        .perf-fill { height: 100%; background: linear-gradient(90deg, var(--p), #ffcc80); transition: width 1s; box-shadow: 0 0 10px var(--p-glow); }

        .toolbar { display: flex; flex-direction: column; gap: 15px; margin-top: auto; align-items: center; width: 100%; padding-top: 20px; border-top: 1px solid var(--brd); }
        .tool-btn { background: rgba(255,255,255,0.05); border: none; color: var(--muted); width: 45px; height: 45px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.2s; }
        .tool-btn:hover { background: #fff; color: #000; transform: scale(1.1); }
        
        .emp-badge { display:none; } /* Hidden in sidebar due to space, moved to top right absolute */

        .dropzone { border: 2px dashed rgba(255,255,255,0.2); border-radius: 20px; padding: 30px; text-align: center; transition: 0.3s; cursor: pointer; background: rgba(0,0,0,0.2); margin-bottom: 25px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; }
        .dropzone:hover { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.1); transform: scale(1.02); }
        
        .v-card { background: var(--panel); border: 1px solid var(--brd); border-radius: 30px; padding: 30px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; position: relative; overflow: hidden; backdrop-filter: blur(10px); }
        .v-card:hover { border-color: var(--p); transform: translateY(-8px); box-shadow: 0 15px 40px -10px rgba(0,0,0,0.5); }
        .v-card-avatar { width: 90px; height: 90px; border-radius: 26px; background: linear-gradient(135deg, var(--p), #ffb74d); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 950; color: #fff; margin-bottom: 20px; border: 4px solid rgba(255,255,255,0.1); box-shadow: 0 10px 25px var(--p-glow); }
        .v-card-name { font-size: 1.2rem; font-weight: 900; color: #fff; text-align: center; }
        .v-card-role { color: var(--p); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
        .v-card-btn { width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border-radius: 14px; text-decoration: none; color: #fff; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .v-card-btn:hover { background: #fff; color: #000; transform: scale(1.05); }

        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
        .stat-box { background: rgba(0,0,0,0.2); border: 1px solid var(--brd); border-radius: 20px; padding: 25px; text-align: center; }
        .stat-label { font-size: 0.7rem; color: var(--muted); font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
        .stat-value { font-size: 1.8rem; font-weight: 950; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.1); }

        .toast { position: fixed; top: 40px; right: 40px; padding: 20px 30px; border-radius: 16px; z-index: 9999; animation: slideIn 0.4s ease-out; box-shadow: 0 20px 50px rgba(0,0,0,0.5); min-width: 300px; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        @keyframes slideInRight { from { transform: translateX(50px); opacity:0; } to { transform: translateX(0); opacity:1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity:0; } to { transform: translateY(0); opacity:1; } }

        /* MODAL STYLES */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .modal-box { background: #1a1a1a; border: 1px solid var(--brd); padding: 40px; border-radius: 30px; width: 90%; max-width: 450px; text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.8); transform: scale(0.9); animation: popIn 0.3s forwards; }
        
        .sparkline { width: 100px; height: 40px; opacity: 0.3; }
        .sparkline path { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; }

      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:2}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <div style={{width: 120, height: 120, background: '#000', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--p)', boxShadow: '0 0 50px var(--p-glow)'}}>
                 <img src="https://i.goopics.net/dskmxi.png" height="70" />
            </div>
            <h1 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:5}}>Hen House</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:40, letterSpacing: '2px', textTransform:'uppercase', fontWeight:700}}>Management System</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center', fontSize:'1.1rem'}}>
              <option value="">👤 SÉLECTIONNER AGENT</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>OUVRIR SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <div className="side-container">
              <aside className="side">
                <div style={{textAlign:'center', marginBottom:30, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', width:'60%'}}>
                    <img src="https://i.goopics.net/dskmxi.png" height="40" />
                </div>
                <div style={{flex:1, display:'flex', flexDirection:'column', gap:10}}>
                  {MODULES.map(t => (
                    <button key={t.id} title={t.l} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                      <span>{t.e}</span>
                    </button>
                  ))}
                </div>
                
                <div className="toolbar">
                    <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                    <button className="tool-btn" title="Sons" onClick={() => {setIsMuted(!isMuted); playSound('click');}} style={{opacity: isMuted ? 0.5 : 1}}>
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                    <button className="tool-btn" title="Déconnexion" onClick={requestLogout} style={{color: 'var(--error)', marginTop: 10}}>🚪</button>
                </div>
              </aside>
          </div>

          <main className="main">
            {/* Header User Info - Absolute */}
            <div style={{position:'absolute', top: 30, right: 40, display:'flex', alignItems:'center', gap: 15, zIndex: 10}}>
                <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:900, fontSize:'1rem'}}>{user}</div>
                    <div style={{color:'var(--p)', fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase'}}>{myProfile?.role || 'Staff'}</div>
                </div>
                <div style={{width: 45, height: 45, background: 'linear-gradient(135deg, var(--p), #fff)', borderRadius: '14px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#000', fontSize:'1.2rem', boxShadow:'0 5px 15px var(--p-glow)'}}>
                    {user.charAt(0)}
                </div>
            </div>

            <div className="fade-in" style={{maxWidth: 1200, margin: '0 auto'}}>
              {/* HOME */}
              {currentTab === 'home' && (
                <div style={{animation: 'slideUp 0.6s ease'}}>
                   <div style={{marginBottom:50, marginTop: 20}}>
                       <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: 5, letterSpacing:'-2px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Bonjour, {user.split(' ')[0]}</h1>
                       <p style={{color: 'var(--muted)', fontSize: '1.2rem'}}>Prêt à faire tourner la boutique ?</p>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 25, marginBottom: 50}}>
                      {/* CA CARD */}
                      <div className="card" style={{padding: 30, flexDirection: 'row', alignItems:'center', gap: 20, borderLeft: '4px solid var(--p)'}}>
                         <div style={{width:60, height:60, borderRadius: 20, background: 'rgba(255, 152, 0, 0.1)', color:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem'}}>💰</div>
                         <div>
                            <div className="stat-label">Chiffre d'Affaires</div>
                            <div className="stat-value" style={{color: 'var(--p)'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                         <svg className="sparkline" style={{marginLeft:'auto', color:'var(--p)'}} viewBox="0 0 100 40"><path d="M0 30 Q 20 40, 40 20 T 100 10" /></svg>
                      </div>

                      {/* PROD CARD */}
                      <div className="card" style={{padding: 30, flexDirection: 'row', alignItems:'center', gap: 20, borderLeft: '4px solid #10b981'}}>
                         <div style={{width:60, height:60, borderRadius: 20, background: 'rgba(16, 185, 129, 0.1)', color:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem'}}>📦</div>
                         <div>
                            <div className="stat-label">Production</div>
                            <div className="stat-value" style={{color: '#10b981'}}>{myProfile?.stock.toLocaleString()} <span style={{fontSize:'1rem', opacity:0.6}}>u.</span></div>
                         </div>
                         <svg className="sparkline" style={{marginLeft:'auto', color:'#10b981'}} viewBox="0 0 100 40"><path d="M0 30 L 20 20 L 40 30 L 60 10 L 80 20 L 100 5" /></svg>
                      </div>

                      {/* SALARY CARD */}
                      <div className="card" style={{padding: 30, flexDirection: 'row', alignItems:'center', gap: 20, borderLeft: '4px solid #6366f1'}}>
                         <div style={{width:60, height:60, borderRadius: 20, background: 'rgba(99, 102, 241, 0.1)', color:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem'}}>💶</div>
                         <div>
                            <div className="stat-label">Salaire Estimé</div>
                            <div className="stat-value" style={{color: '#6366f1'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                   </div>

                   <div>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: 'var(--muted)', fontSize: '0.9rem', letterSpacing: '1px', textTransform:'uppercase'}}>ACCÈS RAPIDE</h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:20}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25, justifyContent:'center', alignItems:'center', gap: 10, background: 'rgba(255,255,255,0.03)'}}>
                                <span style={{fontSize:'2.5rem'}}>{m.e}</span>
                                <div style={{fontSize:'0.85rem', fontWeight:700, opacity:0.8}}>{m.l}</div>
                            </div>
                        ))}
                        </div>
                   </div>
                </div>
              )}

              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div style={{animation: 'slideUp 0.5s ease'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 25}}>
                       <div style={{position:'relative', width: '40%'}}>
                            <span style={{position:'absolute', left:18, top:16, opacity:0.5}}>🔍</span>
                            <input className="inp" placeholder="Chercher un plat..." style={{paddingLeft:50, margin:0, background:'rgba(0,0,0,0.4)', borderColor:'transparent'}} onChange={e=>setSearch(e.target.value)} />
                       </div>
                       <div className="chips-container" style={{maxWidth: '55%', margin:0, padding:0}}>
                            <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                            {Object.keys(data.productsByCategory).map(c => (
                                <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                            ))}
                       </div>
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
                            <div className="card-img-box">
                                {IMAGES[p] ? <img src={IMAGES[p]} /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', color: 'var(--p)'}}>{p.charAt(0)}</div>}
                            </div>
                            <div className="card-content">
                                <div style={{fontWeight:800, fontSize:'0.9rem', lineHeight:'1.2', marginBottom: 5, minHeight: 35}}>{p}</div>
                                <div style={{color:'var(--p)', fontWeight:900, fontSize:'1.2rem'}}>${data.prices[p]}</div>
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
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>💳 Frais & Essence</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Déclarez vos frais pour remboursement.</p>
                        
                        <div style={{display:'flex', gap:15, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                            <select className="inp" style={{flex:1}} value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
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
                           
                           {!forms.expense.file ? (
                             <>
                               <div style={{fontSize:'3.5rem', marginBottom:15, opacity:0.8}}>📸</div>
                               <div style={{fontWeight:800, fontSize:'0.9rem'}}>GLISSER OU COLLER (CTRL+V)</div>
                               <div style={{color:'var(--muted)', fontSize:'0.8rem'}}>Preuve obligatoire</div>
                             </>
                           ) : (
                             <div className="dz-preview-container">
                               <button className="btn-del-file" title="Supprimer" onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
                               <img src={forms.expense.file} className="dz-preview" alt="Reçu" />
                             </div>
                           )}
                        </div>
                        
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>ENVOYER LA NOTE</button>
                    </div>
                </div>
              )}

              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>📦 Stock Cuisine</h2>
                    <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Déclaration de production.</p>
                    {forms.stock.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:12, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Sélectionner produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                        </div>
                    ))}
                    <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', marginBottom: 25, width:'100%', borderRadius: 16}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🏢 Commande Pro</h2>
                    <input className="inp" placeholder="Nom Société" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    {forms.enterprise.items.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop: 15}} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>TRANSMETTRE COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🤝 Partenaires</h2>
                    <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                    <div style={{display:'flex', gap:12, marginBottom:10}}>
                        <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    {forms.partner.items.map((item, idx) => (
                        <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                            <input type="number" className="inp" style={{width:70, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop: 10}} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER PARTENAIRE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🚗 État Véhicule</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(0,0,0,0.3)', padding:25, borderRadius:20, marginTop:15, border:'1px solid var(--brd)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15, fontSize:'0.9rem'}}><span>⛽ NIVEAU D'ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height: 6}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER GARAGE</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:40, textAlign:'center'}}>Annuaire Interne</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:30}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card">
                            <div className="v-card-avatar">{e.name.charAt(0)}</div>
                            <div className="v-card-name">{e.name}</div>
                            <div className="v-card-role">{e.role}</div>
                            <a href={`tel:${e.phone}`} className="v-card-btn">📞 {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:40}}>
                  <div className="card" style={{padding:40, textAlign:'left', cursor:'default'}}>
                    <h2 style={{marginBottom:30, fontWeight:900, fontSize:'1.5rem'}}>🏆 Classement C.A</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 25}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:10}}>
                           <span><span style={{color: 'var(--muted)', width: 20, display:'inline-block'}}>{i+1}.</span> <b>{e.name}</b></span>
                           <b style={{color: i===0 ? 'var(--p)' : '#fff', textShadow: i===0 ? '0 0 10px var(--p-glow)' : 'none'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:40, textAlign:'left', cursor:'default'}}>
                    <h2 style={{marginBottom:30, fontWeight:900, fontSize:'1.5rem'}}>📦 Classement Producteurs</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 25}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:10}}>
                           <span><span style={{color: 'var(--muted)', width: 20, display:'inline-block'}}>{i+1}.</span> <b>{e.name}</b></span>
                           <b style={{color: i===0 ? 'var(--success)' : '#fff'}}>{e.stock.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(255,255,255,0.05)'}}><div className="perf-fill" style={{background:'#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.4)', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                   <div className="form-ui" style={{maxWidth: 650, padding: 60}}>
                        <div style={{textAlign:'center'}}>
                            <div className="v-card-avatar" style={{width:120, height:120, margin:'0 auto 25px', fontSize:'3rem'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.8rem', fontWeight:950}}>{user}</h1>
                            <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.1rem', letterSpacing:'1px', textTransform:'uppercase'}}>{myProfile.role}</div>
                        </div>
                        <div className="profile-grid">
                            <div className="stat-box">
                                <div className="stat-label">Chiffre Total</div>
                                <div className="stat-value" style={{color:'var(--p)'}}>${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Production</div>
                                <div className="stat-value" style={{color:'#10b981'}}>{myProfile.stock}</div>
                            </div>
                        </div>
                        <div style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 30, marginTop: 25, textAlign: 'center', boxShadow:'inset 0 0 20px rgba(0,0,0,0.5)'}}>
                            <div className="stat-label" style={{marginBottom:5}}>Salaire à percevoir</div>
                            <div style={{fontSize: '3.5rem', fontWeight: 950, color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.2)'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                   </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🆘 Assistance</h2>
                    <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Signalez un problème ou une suggestion.</p>
                    <input className="inp" placeholder="Objet de la demande" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Message au patron..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (Right Side) */}
          {currentTab === 'invoices' && (
            <div className="cart-container">
                <aside className="cart">
                  <div style={{padding:'25px 20px', borderBottom:'1px dashed #bbb', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h2 style={{fontSize:'1.4rem', fontWeight:950, letterSpacing:'-1px'}}>TICKET CAISSE</h2>
                      <button onClick={requestClearCart} title="Tout vider" style={{background:'transparent', border:'none', fontSize:'1.2rem', cursor:'pointer', opacity:0.6, color:'#000'}}>🗑️</button>
                  </div>
                  
                  <div style={{padding:'15px 20px'}}><input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', background:'#fff', color:'#000', border:'1px solid #ccc', borderRadius: 8, margin:0, fontWeight:800}} /></div>
                  
                  <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                    {cart.length === 0 ? <div style={{textAlign:'center', marginTop: 80, opacity: 0.4, fontWeight:600, fontSize:'1.1rem'}}>PANIER VIDE</div> : cart.map((i, idx)=>(
                      <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px dashed #ccc', alignItems:'center'}}>
                        <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.85rem', lineHeight:'1.1'}}>{i.name}</div><div style={{color:'#666', fontSize:'0.75rem', fontWeight:600}}>${i.pu} un.</div></div>
                        <div style={{display:'flex', alignItems:'center', gap:5}}>
                          <button style={{background:'#ddd', border:'none', color:'#000', width:24, height:24, borderRadius:6, cursor:'pointer', fontWeight:'bold'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                          <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                          <button style={{background:'#ddd', border:'none', color:'#000', width:24, height:24, borderRadius:6, cursor:'pointer', fontWeight:'bold'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{padding:'20px 20px 35px 20px', borderTop:'2px solid #000'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'flex-end'}}>
                        <span style={{fontWeight:800, color:'#444', fontSize:'0.9rem'}}>TOTAL À PAYER</span>
                        <b style={{fontSize:'2.2rem', color:'#000', fontWeight:950, lineHeight:'0.9'}}>${total.toLocaleString()}</b>
                    </div>
                    <button className="btn-p" style={{background:'#000', color:'#fff', boxShadow:'none', borderRadius: 12}} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>IMPRIMER & ENVOYER</button>
                    <div style={{textAlign:'center', marginTop:15, fontSize:'0.7rem', opacity:0.6, fontWeight:600}}>MERCI DE VOTRE VISITE</div>
                  </div>
                </aside>
            </div>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, color: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>{toast.t}</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{toast.m}</div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:15}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:35, fontSize:'1.1rem'}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'rgba(255,255,255,0.1)', color:'#fff', boxShadow:'none'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
