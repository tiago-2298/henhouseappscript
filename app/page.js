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
  { id: 'profile', l: 'Profil', e: '👤' },
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
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    // Permettre de vider le champ pour taper
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
  }

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const cleanPayload = {...payload};
      // Nettoyage des qty si string vide
      if(action === 'sendFactures') {
          cleanPayload.items = payload.items.map(x => ({...x, qty: Number(x.qty) || 0})).filter(x => x.qty > 0);
      }
      
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...cleanPayload, employee: user} }) });
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
    <div className="app bg-mesh">
        <style jsx global>{`
            body { background: #050505; color: #fff; margin:0; font-family: 'Plus Jakarta Sans', sans-serif; overflow:hidden;}
            .bg-mesh { background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%); }
            .sk-dock { width: 90px; height: 95vh; background: rgba(255,255,255,0.05); border-radius: 30px; margin: 2.5vh; }
            .pulse { animation: pulse 1.5s infinite; background: rgba(255,255,255,0.05); border-radius: 12px; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.5; } 100% { opacity: 0.3; } }
        `}</style>
        <div style={{display:'flex', width:'100vw', height:'100vh'}}>
            <div className="sk-dock pulse"></div>
            <div style={{flex:1, padding:'40px'}}>
                <div className="pulse" style={{width: 300, height: 60, marginBottom: 30}}></div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
                    <div className="pulse" style={{height: 150}}></div>
                    <div className="pulse" style={{height: 150}}></div>
                    <div className="pulse" style={{height: 150}}></div>
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
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', position:'relative', zIndex:10}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <div style={{marginBottom:30, filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.5))'}}>
                <img src="https://i.goopics.net/dskmxi.png" height="120" />
            </div>
            <h1 style={{fontSize:'2rem', fontWeight:900, marginBottom:5}}>HEN HOUSE</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:40, letterSpacing:'2px', textTransform:'uppercase'}}>Secure Employee Terminal</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center'}}>
              <option value="">SELECTIONNER IDENTITÉ</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>CONNEXION</button>
          </div>
        </div>
      ) : (
        <>
          <div className="dock-container">
              <aside className="dock">
                <div className="logo-box"><img src="https://i.goopics.net/dskmxi.png" className="logo-img" /></div>
                
                <div style={{flex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', overflowY:'auto', overflowX:'hidden'}}>
                  {MODULES.map(t => (
                    <button key={t.id} className={`nav-btn ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                      <span className="nav-icon">{t.e}</span>
                      <span className="nav-label">{t.l}</span>
                    </button>
                  ))}
                </div>
                
                <div className="dock-footer">
                    <div className="tool-row">
                        <button className="tool-btn" title="Reload" onClick={() => window.location.reload()}>↻</button>
                        <button className="tool-btn" title="Sync" onClick={() => loadData(true)}>☁️</button>
                        <button className="tool-btn" title="Mute" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>{isMuted ? '🔇' : '🔊'}</button>
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
            <div className="fade-in" style={{maxWidth: 1200, margin: '0 auto'}}>
              {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                    <div style={{marginBottom:40, display:'flex', justifyContent:'space-between', alignItems:'end'}}>
                        <div>
                            <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing:'-2px', lineHeight:1}}>Hello, {user.split(' ')[0]}</h1>
                            <p style={{color: 'var(--muted)', fontSize: '1.2rem', marginTop: 10}}>Prêt pour le service ? Voici tes stats.</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'3rem', fontWeight:900, color:'rgba(255,255,255,0.1)'}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    </div>
                    
                    <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 50}}>
                      <div className="stat-card">
                          <div className="stat-icon" style={{color: 'var(--p)'}}>💰</div>
                          <div><div className="stat-label">Chiffre d'Affaires</div><div className="stat-val">${Math.round(myProfile?.ca || 0).toLocaleString()}</div></div>
                      </div>
                      <div className="stat-card">
                          <div className="stat-icon" style={{color: '#10b981'}}>📦</div>
                          <div><div className="stat-label">Production</div><div className="stat-val">{myProfile?.stock.toLocaleString()}</div></div>
                      </div>
                      <div className="stat-card">
                          <div className="stat-icon" style={{color: '#6366f1'}}>💶</div>
                          <div><div className="stat-label">Salaire Estimé</div><div className="stat-val">${Math.round(myProfile?.salary || 0).toLocaleString()}</div></div>
                      </div>
                    </div>

                    <h3 style={{marginBottom: 20, fontWeight: 900, color: '#fff', fontSize: '1.2rem', paddingLeft: 10, borderLeft:'4px solid var(--p)'}}>ACCÈS RAPIDE</h3>
                    <div className="grid">
                    {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                        <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{height: 160, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background: 'var(--glass)'}}>
                            <span style={{fontSize:'3rem', marginBottom:15}}>{m.e}</span>
                            <div style={{fontSize:'1rem', fontWeight:800}}>{m.l}</div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', gap:20, marginBottom:30}}>
                        <div style={{position:'relative', flex:1}}>
                            <input className="inp" placeholder="Rechercher un plat..." style={{paddingLeft:50, marginBottom:0, background:'rgba(255,255,255,0.05)'}} onChange={e=>setSearch(e.target.value)} />
                            <span style={{position:'absolute', left:20, top:16, opacity:0.5, fontSize:'1.2rem'}}>🔍</span>
                        </div>
                  </div>
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                    {Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                    ))}
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const cartItem = cart.find(i=>i.name===p);
                      return (
                        <div key={p} className="card" onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            {IMAGES[p] ? <img src={IMAGES[p]} className="card-img-bg" /> : <div className="card-img-bg" style={{background:'#222'}}></div>}
                            <div className="card-overlay">
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
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>Frais & Essence</h2>
                        <div style={{display:'flex', gap:10, marginBottom:10}}>
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
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}
                             style={{border:'2px dashed var(--glass-b)', borderRadius:20, padding:30, textAlign:'center', cursor:'pointer', marginBottom:20, background: dragActive?'rgba(255,152,0,0.1)':'transparent'}}>
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {!forms.expense.file ? (
                             <>
                               <div style={{fontSize:'2.5rem', marginBottom:10, opacity:0.7}}>📸</div>
                               <div style={{fontWeight:700, fontSize:'0.9rem', color:'var(--muted)'}}>Preuve (Click ou Ctrl+V)</div>
                             </>
                           ) : (
                             <div style={{position:'relative'}}>
                               <button style={{position:'absolute', top:-10, right:-10, background:'var(--error)', border:'none', color:'#fff', borderRadius:'50%', width:30, height:30, cursor:'pointer', zIndex:10}} onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
                               <img src={forms.expense.file} style={{maxHeight:200, borderRadius:10, border:'2px solid #fff'}} />
                             </div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>Envoyer Note</button>
                    </div>
                </div>
              )}

              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>Stock Cuisine</h2>
                    {forms.stock.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Sélectionner...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                        </div>
                    ))}
                    <button className="inp" style={{background:'transparent', border:'1px dashed var(--glass-b)', color:'var(--muted)', cursor:'pointer'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter Ligne</button>
                    <button className="btn-p" style={{marginTop:10}} onClick={()=>send('sendProduction', {items: forms.stock})}>Valider Production</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>Commande Pro</h2>
                    <input className="inp" placeholder="Nom Société" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    <div style={{maxHeight: 300, overflowY:'auto', paddingRight:5, marginBottom:15}}>
                        {forms.enterprise.items.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                                {i>0 && <button className="del-btn" onClick={()=>{const n=[...forms.enterprise.items]; n.splice(i,1); setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}>×</button>}
                            </div>
                        ))}
                    </div>
                    <button className="inp" style={{background:'transparent', border:'1px dashed var(--glass-b)', color:'var(--muted)', cursor:'pointer', padding:10}} onClick={()=>setForms({...forms, enterprise:{...forms.enterprise, items:[...forms.enterprise.items, {product:'', qty:1}]}})}>+ Ligne</button>
                    <button className="btn-p" style={{marginTop:15}} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>Transmettre</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>Partenaires</h2>
                    <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
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
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendPartnerOrder', forms.partner)}>Valider</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>Gestion Flotte</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <div style={{display:'flex', gap:10, marginBottom:20}}>
                        <button className="inp" style={{flex:1, background: forms.garage.action==='Entrée'? 'var(--success)' : '#222', color: forms.garage.action==='Entrée'?'#000':'#fff', border: 'none', cursor:'pointer'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Entrée'}})}>Entrée 🅿️</button>
                        <button className="inp" style={{flex:1, background: forms.garage.action==='Sortie'? 'var(--p)' : '#222', color: forms.garage.action==='Sortie'?'#000':'#fff', border: 'none', cursor:'pointer'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Sortie'}})}>Sortie 🔑</button>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.05)', padding:25, borderRadius:20, border:'1px solid var(--glass-b)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>Niveau Essence</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:8}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>Valider Mouvement</button>
                </div></div>
              )}
              
              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:30}}>Annuaire</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:20}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="card" style={{height:'auto', padding:20, background: 'rgba(20,20,20,0.8)', alignItems:'center', display:'flex', flexDirection:'column', textAlign:'center'}}>
                            <div style={{width:80, height:80, borderRadius:'50%', background:'linear-gradient(45deg, #333, #000)', border:'2px solid var(--glass-b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:900, marginBottom:15}}>{e.name.charAt(0)}</div>
                            <div style={{fontWeight:800, fontSize:'1.1rem'}}>{e.name}</div>
                            <div style={{color:'var(--p)', fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', marginBottom:15}}>{e.role}</div>
                            <a href={`tel:${e.phone}`} className="btn-p" style={{padding:'10px', fontSize:'0.9rem', width:'100%'}}>📞 {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="form-ui" style={{maxWidth:'100%', padding:30}}>
                    <h2 style={{marginBottom:30, fontWeight:900}}>🏆 TOP VENDEURS</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span style={{display:'flex', gap:10}}>
                               <b style={{color: i===0?'var(--p)':'#555'}}>#{i+1}</b> {e.name}
                           </span>
                           <b style={{color: '#fff'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div style={{height:6, background:'#333', borderRadius:10, overflow:'hidden'}}><div style={{height:'100%', background: i===0?'var(--p)':'#555', width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="form-ui" style={{maxWidth:'100%', padding:30}}>
                    <h2 style={{marginBottom:30, fontWeight:900}}>🍳 TOP CUISTOS</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span style={{display:'flex', gap:10}}>
                               <b style={{color: i===0?'var(--success)':'#555'}}>#{i+1}</b> {e.name}
                           </span>
                           <b>{e.stock.toLocaleString()}</b>
                        </div>
                        <div style={{height:6, background:'#333', borderRadius:10, overflow:'hidden'}}><div style={{height:'100%', background: i===0?'var(--success)':'#555', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                    <div className="form-ui" style={{maxWidth: 500, padding: 50, textAlign:'center'}}>
                         <div style={{width:120, height:120, borderRadius:'50%', border:'4px solid var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:900, background:'#000', color:'#fff'}}>{user.charAt(0)}</div>
                         <h1 style={{fontSize:'2.2rem', fontWeight:950, lineHeight:1}}>{user}</h1>
                         <div style={{color:'var(--p)', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginBottom:30}}>{myProfile.role}</div>
                         
                         <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom:30}}>
                             <div style={{background:'rgba(255,255,255,0.05)', padding:20, borderRadius:20}}>
                                 <div style={{fontSize:'0.7rem', color:'var(--muted)', textTransform:'uppercase'}}>Chiffre</div>
                                 <div style={{fontSize:'1.5rem', fontWeight:900}}>${Math.round(myProfile.ca).toLocaleString()}</div>
                             </div>
                             <div style={{background:'rgba(255,255,255,0.05)', padding:20, borderRadius:20}}>
                                 <div style={{fontSize:'0.7rem', color:'var(--muted)', textTransform:'uppercase'}}>Stock</div>
                                 <div style={{fontSize:'1.5rem', fontWeight:900}}>{myProfile.stock}</div>
                             </div>
                         </div>
                         <div style={{background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: 24, padding: 20}}>
                             <div style={{color: 'var(--success)', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase'}}>Salaire Estimé</div>
                             <div style={{fontSize: '2.5rem', fontWeight: 950}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                         </div>
                    </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>Ticket Support</h2>
                    <p style={{textAlign:'center', color:'var(--muted)', marginBottom:30}}>Un problème technique ou besoin de stock ?</p>
                    <input className="inp" placeholder="Sujet" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Expliquez le problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>Envoyer au Patron</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (CAISSE) */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel">
              <div className="cart-header">
                  <h2 className="cart-title">Ticket Client</h2>
                  <div style={{fontSize:'0.8rem', color:'#555'}}>#{forms.invoiceNum || '----'}</div>
              </div>
              
              <div style={{padding:'20px 20px 0 20px'}}>
                  <input className="inp" placeholder="N° FACTURE (Requis)" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', background:'#000', borderColor:'#333', marginBottom:0}} />
              </div>

              <div className="cart-items">
                {cart.length === 0 ? 
                    <div style={{textAlign:'center', marginTop: 50, opacity: 0.2, fontWeight:700, fontStyle:'italic'}}>Panier Vide</div> 
                : cart.map((i, idx)=>(
                  <div key={idx} className="cart-item">
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.9rem', color:'#eee'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.75rem', fontWeight:700}}>${i.pu} / u.</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <div className="qty-control">
                            <button className="qty-btn" onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else removeFromCart(idx); setCart(n);}}>-</button>
                            <input className="qty-input" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                            <button className="qty-btn" onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                        </div>
                        <button className="del-btn" onClick={()=>removeFromCart(idx)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'baseline'}}>
                    <span style={{fontWeight:700, color:'#555', textTransform:'uppercase'}}>Total à payer</span>
                    <span className="cart-total-display">${total.toLocaleString()}</span>
                </div>
                <div style={{display:'flex', gap:10}}>
                    <button className="btn-p" style={{background:'#222', color:'#fff', flex:1}} onClick={requestClearCart}>Vider</button>
                    <button className="btn-p" style={{flex:3}} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>ENCAISSER 💵</button>
                </div>
              </div>
            </aside>
          )}
        </>
      )}

      {/* TOASTS & MODALS */}
      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)') }}>
          <div style={{width:10, height:10, borderRadius:'50%', background: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)')}}></div>
          <div>{toast.m}</div>
        </div>
      )}

      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.5rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:30}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'var(--glass-b)', color:'#fff'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
