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
            .sk-side { width: 260px; height: 95vh; margin: 2.5vh; border-radius: 24px; background: #000; border: 1px solid rgba(255,255,255,0.05); padding: 20px; }
            .sk-main { flex: 1; padding: 40px; background: #0f1115; }
            .sk-box { background: rgba(255,255,255,0.05); border-radius: 12px; animation: pulse 1.5s infinite; }
            .sk-row { display: flex; gap: 15px; margin-bottom: 20px; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
         `}</style>
         <div className="sk-side">
            <div className="sk-box" style={{height: 60, width: 60, borderRadius: '50%', margin: '0 auto 40px'}} />
            {[1,2,3,4,5,6].map(i => <div key={i} className="sk-box" style={{height: 40, width: '100%', marginBottom: 10}} />)}
         </div>
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
            --bg: #0b0d11; 
            --glass: rgba(24, 26, 32, 0.6); 
            --glass-h: rgba(255, 255, 255, 0.03);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --brd: rgba(255, 255, 255, 0.08); 
            --radius: 24px; 
            --success: #10b981; 
            --error: #ef4444; 
            --shadow: 0 20px 50px -10px rgba(0,0,0,0.5);
        }
        
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { 
            background: radial-gradient(circle at 10% 10%, #1a150e 0%, #050505 100%); 
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
            font-size: 14px;
        }

        .app { display: flex; height: 100vh; width: 100vw; position: relative; gap: 15px; padding: 15px; }

        /* --- SIDEBAR FLOATING DOCK --- */
        .side { 
            width: 260px; 
            background: rgba(10, 10, 10, 0.7); 
            backdrop-filter: blur(30px);
            border: 1px solid var(--brd); 
            border-radius: var(--radius); 
            padding: 25px; 
            display: flex; 
            flex-direction: column; 
            z-index: 100; 
            box-shadow: var(--shadow);
        }

        .nav-l { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            padding: 14px 16px; 
            border-radius: 14px; 
            border: 1px solid transparent; 
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            font-weight: 600; 
            width: 100%; 
            transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); 
            margin-bottom: 5px; 
            position: relative;
            overflow: hidden;
        }
        .nav-l:hover { background: var(--glass-h); color: #fff; transform: translateX(3px); }
        .nav-l.active { 
            background: rgba(255, 152, 0, 0.1); 
            color: var(--p); 
            border-color: rgba(255, 152, 0, 0.2); 
            font-weight: 800;
        }
        /* Glowing Indicator */
        .nav-l.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 50%;
            width: 3px;
            background: var(--p);
            border-radius: 0 4px 4px 0;
            box-shadow: 0 0 10px var(--p);
        }

        /* --- MAIN AREA --- */
        .main { 
            flex: 1; 
            overflow-y: auto; 
            position: relative; 
            border-radius: var(--radius);
            padding-right: 10px; /* Space for scrollbar */
        }

        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* --- CARDS & GRID --- */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; padding-bottom: 50px; }
        
        .card { 
            background: rgba(25, 27, 33, 0.6); 
            backdrop-filter: blur(10px);
            border: 1px solid var(--brd); 
            border-radius: 20px; 
            cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
            position: relative; 
            overflow: hidden; 
            height: 200px; /* Fixed height for cleaner grid */
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
        .card:hover { 
            border-color: rgba(255, 152, 0, 0.5); 
            box-shadow: 0 10px 30px -10px rgba(255, 152, 0, 0.15); 
            transform: translateY(-5px) scale(1.02);
            z-index: 10;
        }
        .card:active { transform: scale(0.98); }
        
        .card-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            object-fit: cover;
            opacity: 0.7;
            transition: 0.5s;
            z-index: 0;
            mask-image: linear-gradient(to bottom, black 50%, transparent 100%); /* Fade bottom for text */
        }
        .card:hover .card-bg { opacity: 1; transform: scale(1.1); }
        
        .card-content {
            position: relative;
            z-index: 2;
            padding: 15px;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), transparent);
            width: 100%;
        }

        .card-qty { 
            position: absolute; top: 10px; right: 10px; z-index: 5;
            background: var(--p); color: #fff; width: 28px; height: 28px; 
            border-radius: 50%; font-size: 0.75rem; 
            display: flex; align-items: center; justify-content: center; 
            font-weight: 900; box-shadow: 0 5px 15px rgba(0,0,0,0.5); 
            animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounceIn { from{transform:scale(0)} to{transform:scale(1)} }

        /* --- DASHBOARD WIDGETS --- */
        .dash-widget {
            position: relative; overflow: hidden;
            background: rgba(20, 20, 20, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--brd);
            border-radius: 24px;
            padding: 30px;
            display: flex; align-items: center; gap: 20px;
            transition: 0.3s;
        }
        .dash-widget:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .dash-icon { 
            width: 60px; height: 60px; 
            border-radius: 18px; 
            display: flex; align-items: center; justify-content: center; 
            font-size: 2rem; 
            background: rgba(255,255,255,0.03); 
            border: 1px solid rgba(255,255,255,0.05);
        }
        /* Sparkline fake */
        .sparkline { height: 40px; width: 100px; opacity: 0.5; mask-image: linear-gradient(to right, transparent, black); }

        /* --- FORMS --- */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90%; padding: 20px; }
        .form-ui { 
            width: 100%; max-width: 500px; 
            background: rgba(15, 15, 20, 0.85); 
            backdrop-filter: blur(40px); 
            padding: 40px; 
            border-radius: 32px; 
            border: 1px solid rgba(255,255,255,0.1); 
            box-shadow: 0 40px 80px rgba(0,0,0,0.6);
            animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .inp { 
            width: 100%; padding: 16px 20px; border-radius: 16px; 
            border: 1px solid var(--brd); background: rgba(0,0,0,0.3); 
            color: #fff; font-weight: 500; margin-bottom: 12px; 
            transition: 0.2s; font-size: 0.95rem; 
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.1); }
        
        .btn-p { 
            background: linear-gradient(135deg, #ffa726, #f57c00); 
            color: #fff; border:none; padding: 18px; 
            border-radius: 16px; font-weight: 800; cursor: pointer; width: 100%; 
            transition: 0.3s; letter-spacing: 0.5px;
            box-shadow: 0 10px 20px rgba(245, 124, 0, 0.3);
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(245, 124, 0, 0.4); }
        .btn-p:active { transform: scale(0.98); }
        .btn-p:disabled { background: #333; box-shadow: none; color: #666; cursor: not-allowed; transform: none; }

        /* --- RECEIPT CART (Style Ticket de Caisse) --- */
        .cart-panel { 
            width: 320px; 
            background: #fff; /* Paper color */
            color: #1a1a1a; /* Ink color */
            border-radius: 6px; 
            display: flex; flex-direction: column; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
            margin-right: 10px;
            font-family: 'Courier New', Courier, monospace; /* Mono font for receipt feel */
            position: relative;
            overflow: hidden;
        }
        .cart-panel::before {
             content: ''; position: absolute; top: -5px; left: 0; width: 100%; height: 10px;
             background: radial-gradient(circle, transparent 4px, #fff 5px) repeat-x;
             background-size: 10px 10px;
        }
        .cart-panel::after {
             content: ''; position: absolute; bottom: -5px; left: 0; width: 100%; height: 10px;
             background: radial-gradient(circle, transparent 4px, #fff 5px) repeat-x;
             background-size: 10px 10px;
        }
        .cart-header { padding: 25px 20px 15px; border-bottom: 2px dashed #ccc; text-align: center; }
        .cart-items { flex: 1; overflow-y: auto; padding: 10px 20px; }
        .cart-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; font-size: 0.9rem; }
        .cart-total-section { padding: 20px; background: #f3f4f6; border-top: 2px dashed #ccc; }
        
        .receipt-btn {
            background: #1a1a1a; color: #fff; width: 100%; padding: 15px;
            border: none; font-family: 'Plus Jakarta Sans', sans-serif; /* Back to sans for button */
            font-weight: 800; border-radius: 8px; cursor: pointer; margin-top: 10px;
            transition: 0.2s;
        }
        .receipt-btn:hover:not(:disabled) { transform: scale(1.02); background: #000; }

        /* --- CHIPS & TAGS --- */
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px; scrollbar-width: none; }
        .chip { 
            padding: 8px 18px; border-radius: 100px; 
            background: rgba(255,255,255,0.05); border: 1px solid var(--brd); 
            color: var(--muted); cursor: pointer; white-space: nowrap; 
            font-weight: 700; font-size: 0.8rem; transition: 0.3s; 
        }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 4px 15px rgba(255,152,0,0.3); }

        /* --- TOAST & MODAL --- */
        .toast { 
            position: fixed; top: 30px; right: 30px; padding: 18px 25px; 
            border-radius: 16px; z-index: 9999; animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            box-shadow: 0 20px 60px rgba(0,0,0,0.5); min-width: 300px; 
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
            display: flex; flex-direction: column; gap: 4px;
        }
        @keyframes slideIn { from { transform: translateX(120%) scale(0.9); } to { transform: translateX(0) scale(1); } }

        /* --- EXTRAS --- */
        .emp-badge { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 14px; border: 1px solid var(--brd); margin-bottom: 10px; }
        .avatar-mini { width: 35px; height: 35px; background: var(--p); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #fff; }
        
        .toolbar { display: flex; gap: 8px; margin-bottom: 15px; justify-content: center; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 100px; }
        .tool-btn { width: 36px; height: 36px; border-radius: 50%; background: transparent; border: 1px solid transparent; color: #fff; cursor: pointer; transition: 0.2s; display: flex; alignItems: center; justifyContent: center; }
        .tool-btn:hover { background: rgba(255,255,255,0.1); transform: rotate(15deg); }

        .dropzone { border: 2px dashed var(--brd); border-radius: 20px; padding: 30px; text-align: center; transition: 0.3s; cursor: pointer; background: rgba(0,0,0,0.2); margin-bottom: 20px; position: relative; }
        .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.05); }

        /* Utility for Text Overflow */
        .trunc { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <div style={{width:100, height:100, background:'#000', borderRadius:'50%', margin:'0 auto 30px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--brd)'}}>
                 <img src="https://i.goopics.net/dskmxi.png" height="60" />
            </div>
            <h1 style={{fontSize:'2.2rem', fontWeight:900, marginBottom:10, background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>HEN HOUSE</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Identification Biométrique Requise</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center', fontSize:'1rem'}}>
              <option value="">👤 Sélectionner Agent</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>OUVRIR SESSION</button>
          </div>
        </div>
      ) : (
        <>
          {/* SIDEBAR DOCK */}
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:30, paddingBottom: 20, borderBottom: '1px solid var(--brd)'}}>
                <img src="https://i.goopics.net/dskmxi.png" height="50" style={{filter: 'drop-shadow(0 0 10px rgba(255,152,0,0.3))'}} />
            </div>
            <div style={{flex:1, overflowY:'auto', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem', width: 25, textAlign:'center'}}>{t.e}</span> 
                  {t.l}
                </button>
              ))}
            </div>
            
            <div style={{paddingTop: '20px', borderTop: '1px solid var(--brd)'}}>
              <div className="toolbar">
                <button className="tool-btn" title="Rafraîchir" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" title="Sons" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button className="tool-btn" title="Déconnexion" onClick={requestLogout} style={{color:'var(--error)'}}>🚪</button>
              </div>
              <div className="emp-badge">
                <div className="avatar-mini">{user.charAt(0)}</div>
                <div style={{overflow:'hidden'}}>
                    <div className="emp-name trunc">{user}</div>
                    <div className="emp-role trunc" style={{fontSize:'0.7rem', color:'var(--p)'}}>{myProfile?.role || 'Agent'}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main">
            <div className="fade-in">
              {/* HOME DASHBOARD */}
              {currentTab === 'home' && (
                <div className="fade-in">
                    <div style={{marginBottom:40, display:'flex', justifyContent:'space-between', alignItems:'end'}}>
                        <div>
                            <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 5, letterSpacing:'-1px', lineHeight: 1}}>
                                Salut, <span style={{color:'var(--p)'}}>{user.split(' ')[0]}</span>
                            </h1>
                            <p style={{color: 'var(--muted)', fontSize: '1.1rem'}}>Prêt à faire tourner la boutique ?</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'2rem', fontWeight:900}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div style={{color:'var(--muted)', fontWeight:600}}>{new Date().toLocaleDateString(undefined, {weekday:'long', day:'numeric', month:'long'})}</div>
                        </div>
                    </div>
                    
                    <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40}}>
                       {/* WIDGET 1 */}
                      <div className="dash-widget">
                         <div className="dash-icon" style={{color:'#facc15', borderColor:'#facc15'}}>💰</div>
                         <div style={{flex:1}}>
                            <div className="stat-label">Chiffre d'Affaires</div>
                            <div className="stat-value" style={{fontSize:'2rem'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                         <svg className="sparkline" viewBox="0 0 100 40"><path d="M0 30 Q 25 35 50 20 T 100 10" fill="none" stroke="#facc15" strokeWidth="3"/></svg>
                      </div>
                      
                       {/* WIDGET 2 */}
                      <div className="dash-widget">
                         <div className="dash-icon" style={{color:'#10b981', borderColor:'#10b981'}}>📦</div>
                         <div style={{flex:1}}>
                            <div className="stat-label">Production</div>
                            <div className="stat-value" style={{fontSize:'2rem'}}>{myProfile?.stock.toLocaleString()}</div>
                         </div>
                         <svg className="sparkline" viewBox="0 0 100 40"><path d="M0 35 L 20 30 L 40 35 L 60 15 L 80 20 L 100 5" fill="none" stroke="#10b981" strokeWidth="3"/></svg>
                      </div>

                       {/* WIDGET 3 */}
                      <div className="dash-widget">
                         <div className="dash-icon" style={{color:'#818cf8', borderColor:'#818cf8'}}>💶</div>
                         <div style={{flex:1}}>
                            <div className="stat-label">Salaire Estimé</div>
                            <div className="stat-value" style={{fontSize:'2rem'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                    </div>

                    <h3 style={{marginBottom: 20, fontWeight: 900, color: 'var(--muted)', fontSize: '0.9rem', paddingLeft: 10, letterSpacing: '1px'}}>ACCÈS RAPIDE</h3>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:15}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{height:140, alignItems:'center', justifyContent:'center', background: 'rgba(255,255,255,0.02)'}}>
                                <span style={{fontSize:'2.5rem', display:'block', marginBottom:10}}>{m.e}</span>
                                <div style={{fontSize:'0.85rem', fontWeight:700, color: '#fff'}}>{m.l}</div>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {/* INVOICES (CAISSE) */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', gap:15, marginBottom:25, alignItems:'center'}}>
                       <div style={{flex:1, position:'relative'}}>
                            <span style={{position:'absolute', left:20, top:16, opacity:0.5, fontSize:'1.1rem'}}>🔍</span>
                            <input className="inp" placeholder="Rechercher un plat..." style={{paddingLeft:50, marginBottom:0, height:55, borderRadius: 100}} onChange={e=>setSearch(e.target.value)} />
                       </div>
                  </div>
                  
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>✨ Tous</div>
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
                            {IMAGES[p] ? <img src={IMAGES[p]} className="card-bg" /> : <div className="card-bg" style={{background:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem'}}>🍗</div>}
                            
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            
                            <div className="card-content">
                                <div className="trunc" style={{fontWeight:800, fontSize:'0.9rem', marginBottom:2, color:'#fff'}}>{p}</div>
                                <div style={{color:'var(--p)', fontWeight:900, fontSize:'1.1rem'}}>${data.prices[p]}</div>
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
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Déclarez vos dépenses pour remboursement.</p>
                        
                        <div style={{display:'flex', gap:10, marginBottom:5}}>
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
                               <div style={{fontSize:'3rem', marginBottom:10}}>📸</div>
                               <div style={{fontWeight:800, color:'var(--muted)'}}>Preuve (Reçu/Pompe)</div>
                               <div style={{fontSize:'0.75rem', color:'var(--muted)', marginTop:5}}>Glisser ou Coller (CTRL+V)</div>
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
                    <p style={{textAlign:'center', color:'var(--muted)', marginBottom:30}}>Déclaration de production</p>
                    {forms.stock.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                        </div>
                    ))}
                    <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', marginBottom: 25, color:'#fff'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER UNE LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🏢 Commande Pro</h2>
                    <input className="inp" placeholder="Nom de la Société" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    <div style={{height:1, background:'var(--brd)', margin:'20px 0'}}></div>
                    {forms.enterprise.items.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>TRANSMETTRE LA COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🤝 Partenaires</h2>
                    <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                    <div style={{display:'flex', gap:12, marginBottom:12}}>
                        <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.05)', padding:20, borderRadius:16, marginBottom:20}}>
                        {forms.partner.items.map((item, idx) => (
                            <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                                <input type="number" className="inp" style={{width:70, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                            </div>
                        ))}
                    </div>
                    <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER PARTENAIRE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🚗 Gestion Flotte</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(255,255,255,0.05)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--brd)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ NIVEAU ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER GARAGE</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:10}}>Annuaire</h2>
                    <p style={{color:'var(--muted)', marginBottom:35}}>Contacts des collègues et hiérarchie.</p>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:25}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card" style={{flexDirection:'row', alignItems:'center', padding:15, gap:15}}>
                            <div className="v-card-avatar" style={{width:60, height:60, marginBottom:0, fontSize:'1.5rem'}}>{e.name.charAt(0)}</div>
                            <div style={{flex:1, textAlign:'left'}}>
                                <div className="v-card-name" style={{textAlign:'left', fontSize:'1rem'}}>{e.name}</div>
                                <div className="v-card-role" style={{marginBottom:5}}>{e.role}</div>
                                <a href={`tel:${e.phone}`} style={{color:'var(--muted)', textDecoration:'none', fontSize:'0.85rem'}}>📞 {e.phone}</a>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in">
                     <h2 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:35}}>Classements</h2>
                     <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:30}}>
                      <div className="form-ui" style={{width:'100%', padding:30}}>
                        <h2 style={{marginBottom:30, fontWeight:950}}>🏆 TOP CHIFFRE D'AFFAIRE</h2>
                        {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                          <div key={i} style={{marginBottom: 15, display:'flex', alignItems:'center', gap:10}}>
                            <div style={{fontWeight:900, color: i<3?'var(--p)':'var(--muted)', width:20}}>{i+1}</div>
                            <div style={{flex:1}}>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom:5}}>
                                    <b>{e.name}</b>
                                    <span>${Math.round(e.ca).toLocaleString()}</span>
                                </div>
                                <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="form-ui" style={{width:'100%', padding:30}}>
                        <h2 style={{marginBottom:30, fontWeight:950}}>👨‍🍳 TOP CUISINIERS</h2>
                        {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                          <div key={i} style={{marginBottom: 15, display:'flex', alignItems:'center', gap:10}}>
                            <div style={{fontWeight:900, color: i<3?'var(--success)':'var(--muted)', width:20}}>{i+1}</div>
                            <div style={{flex:1}}>
                                <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom:5}}>
                                    <b>{e.name}</b>
                                    <span>{e.stock.toLocaleString()}</span>
                                </div>
                                <div className="perf-bar" style={{background:'rgba(255,255,255,0.05)'}}><div className="perf-fill" style={{background:'var(--success)', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                    <div className="form-ui" style={{maxWidth: 600, padding: 50, position:'relative', overflow:'hidden'}}>
                        <div style={{position:'absolute', top:-50, left:-50, width:200, height:200, background:'var(--p)', filter:'blur(100px)', opacity:0.2}}></div>
                        
                        <div style={{textAlign:'center', position:'relative', zIndex:2}}>
                            <div className="v-card-avatar" style={{width:120, height:120, margin:'0 auto 20px', fontSize:'3rem', border:'6px solid rgba(0,0,0,0.5)'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.8rem', fontWeight:950, marginBottom:5}}>{user}</h1>
                            <div style={{color:'var(--p)', fontWeight:800, letterSpacing:'2px', textTransform:'uppercase'}}>{myProfile.role}</div>
                        </div>
                        
                        <div className="profile-grid" style={{marginTop:40}}>
                            <div className="stat-box" style={{background:'rgba(255,255,255,0.03)'}}>
                                <div className="stat-label">Chiffre Global</div>
                                <div className="stat-value">${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box" style={{background:'rgba(255,255,255,0.03)'}}>
                                <div className="stat-label">Production</div>
                                <div className="stat-value">{myProfile.stock}</div>
                            </div>
                        </div>
                        <div style={{background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: 24, padding: 25, marginTop: 20, textAlign: 'center'}}>
                            <div className="stat-label" style={{color: 'var(--success)'}}>Salaire estimé</div>
                            <div style={{fontSize: '3rem', fontWeight: 950, color:'#fff'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🆘 Centre d'aide</h2>
                    <input className="inp" placeholder="Sujet de la demande" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none', fontFamily:'inherit'}} placeholder="Décrivez votre problème au patron..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER LE TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (RECEIPT STYLE) */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel">
               <div className="cart-header">
                  <h2 style={{fontSize:'1.4rem', fontWeight:900, textTransform:'uppercase'}}>Ticket</h2>
                  <div style={{fontSize:'0.8rem', opacity:0.6}}>{new Date().toLocaleDateString()}</div>
               </div>
               
               <div style={{padding:'15px 20px 0'}}>
                   <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', background:'#f0f0f0', color:'#000', border:'1px solid #ccc', fontWeight:700}} />
               </div>

               <div className="cart-items">
                  {cart.length === 0 ? (
                      <div style={{textAlign:'center', marginTop: 50, opacity: 0.4, fontStyle:'italic'}}>-- Vide --</div> 
                  ) : cart.map((i, idx)=>(
                    <div key={idx} className="cart-row">
                        <div>
                            <div style={{fontWeight:700}}>{i.name}</div>
                            <div style={{fontSize:'0.8rem', opacity:0.7}}>${i.pu} x {i.qty}</div>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:5}}>
                            <div style={{fontWeight:700}}>${i.pu * i.qty}</div>
                            <div style={{display:'flex', flexDirection:'column', gap:2}}>
                                <button style={{width:20, height:20, background:'#eee', border:'none', cursor:'pointer', borderRadius:3}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>▲</button>
                                <button style={{width:20, height:20, background:'#eee', border:'none', cursor:'pointer', borderRadius:3}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>▼</button>
                            </div>
                        </div>
                    </div>
                  ))}
               </div>
               
               <div className="cart-total-section">
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:15, fontSize:'1.2rem', fontWeight:900}}>
                      <span>TOTAL</span>
                      <span>${total.toLocaleString()}</span>
                  </div>
                  <button className="receipt-btn" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                    IMPRIMER / ENCAISSER
                  </button>
                  <button onClick={requestClearCart} style={{width:'100%', background:'transparent', border:'none', color:'var(--error)', fontSize:'0.75rem', marginTop:10, cursor:'pointer', textDecoration:'underline'}}>Annuler commande</button>
               </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : 'var(--p)'}}>
          <div style={{ fontSize: '0.8rem', fontWeight:900, color: toast.s === 'error' ? 'var(--error)' : 'var(--p)', letterSpacing:'1px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.95rem', color:'#fff' }}>{toast.m}</div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.5rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:25}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:10}}>
                      <button className="btn-p" style={{background:'rgba(255,255,255,0.1)', color:'#fff'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
