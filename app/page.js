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
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(783, now + 0.2); gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4); osc.start(); osc.stop(now + 0.4);
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
    // Autoriser la chaîne vide pour pouvoir effacer le champ pendant la frappe
    if (val === '') {
        n[idx].qty = '';
        setCart(n);
        return;
    }
    const v = parseInt(val);
    if (!isNaN(v)) {
        n[idx].qty = v;
        setCart(n);
    }
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
            .sk-side { width: 260px; height: 95vh; margin: 2.5vh; border-radius: 24px; background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); padding: 20px; }
            .sk-main { flex: 1; padding: 40px; }
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
         </div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg: #050505; 
            --panel: rgba(20, 20, 25, 0.6); 
            --glass: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --radius: 24px; 
            --success: #10b981; 
            --error: #ef4444; 
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 0px; } /* Clean scroll */

        /* ANIMATED BACKGROUND */
        body { 
            background: #000; 
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
            position: relative;
        }
        body::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.08), transparent 40%),
                        radial-gradient(circle at 20% 80%, rgba(100, 50, 255, 0.05), transparent 30%);
            animation: moveBg 20s linear infinite;
            z-index: -1;
            pointer-events: none;
        }
        @keyframes moveBg { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .app { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

        /* SIDEBAR (GLASS DOCK) */
        .side { 
            width: 90px; 
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            height: 96vh; 
            margin: 2vh 0 2vh 2vh; 
            border: 1px solid var(--glass-border); 
            border-radius: var(--radius);
            padding: 20px 10px; 
            display: flex; 
            flex-direction: column; 
            background: rgba(15, 15, 20, 0.6); 
            backdrop-filter: blur(25px); 
            z-index: 100; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .side:hover { width: 260px; padding: 20px; }
        .side-logo { text-align: center; margin-bottom: 30px; transition: 0.3s; opacity: 0.8; }
        .side:hover .side-logo { transform: scale(1.1); opacity: 1; }

        .nav-l { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            padding: 14px; 
            border-radius: 16px; 
            border: none; 
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            font-weight: 600; 
            width: 100%; 
            transition: 0.2s; 
            font-size: 0.95rem; 
            margin-bottom: 6px; 
            position: relative;
            overflow: hidden;
            white-space: nowrap;
        }
        .nav-l span { font-size: 1.4rem; min-width: 30px; text-align: center; }
        .nav-text { opacity: 0; transition: 0.2s; transform: translateX(-10px); }
        .side:hover .nav-text { opacity: 1; transform: translateX(0); }
        
        .nav-l.active { 
            background: rgba(255, 152, 0, 0.15); 
            color: var(--p); 
            box-shadow: 0 0 20px rgba(255, 152, 0, 0.1); 
        }
        .nav-l.active::before {
            content: ''; position: absolute; left: 0; top: 15%; height: 70%; width: 3px; 
            background: var(--p); border-radius: 0 4px 4px 0; box-shadow: 0 0 10px var(--p);
        }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }
        
        /* MAIN CONTENT */
        .main { 
            flex: 1; 
            overflow-y: auto; 
            padding: 30px 40px; 
            position: relative; 
            scroll-behavior: smooth;
        }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* CARDS & GRID */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        
        .card { 
            background: var(--panel); 
            border: 1px solid var(--glass-border); 
            border-radius: 20px; 
            cursor: pointer; 
            transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
            text-align: center; 
            position: relative; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .card:hover { 
            border-color: rgba(255, 152, 0, 0.5); 
            transform: translateY(-8px) scale(1.02); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 152, 0, 0.1); 
        }
        .card.sel { border: 2px solid var(--p); box-shadow: 0 0 25px var(--p-glow); }

        .card-img-container {
            height: 140px; width: 100%; position: relative;
        }
        .card-img { width: 100%; height: 100%; object-fit: cover; }
        .card-content {
            position: absolute; bottom: 0; left: 0; width: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
            padding: 20px 10px 10px 10px;
            text-align: left;
        }

        .card-qty-badge {
            position: absolute; top: 10px; right: 10px;
            background: var(--p); color: #fff;
            width: 28px; height: 28px; border-radius: 50%;
            display: flex; alignItems: center; justifyContent: center;
            font-weight: 900; font-size: 0.8rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            z-index: 10;
        }

        /* FORMS UI */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { 
            width: 100%; max-width: 500px; 
            background: rgba(20, 20, 25, 0.7); 
            backdrop-filter: blur(30px); 
            padding: 40px; 
            border-radius: 32px; 
            border: 1px solid var(--glass-border); 
            box-shadow: 0 30px 80px rgba(0,0,0,0.6); 
            position: relative;
        }
        .form-ui::before {
            content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px;
            border-radius: 32px; padding: 1px; 
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
        }

        .inp { 
            width: 100%; 
            padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid var(--glass-border); 
            background: rgba(0,0,0,0.3); 
            color: #fff; 
            font-weight: 600; 
            font-size: 0.95rem;
            margin-bottom: 15px; 
            transition: 0.3s; 
        }
        .inp:focus { 
            outline: none; 
            border-color: var(--p); 
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.15); 
            background: rgba(0,0,0,0.5);
        }
        
        .btn-p { 
            background: var(--p); 
            color: #fff; 
            border: none; 
            padding: 18px; 
            border-radius: 16px; 
            font-weight: 800; 
            cursor: pointer; 
            width: 100%; 
            transition: 0.3s; 
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 25px rgba(255, 152, 0, 0.25);
        }
        .btn-p:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(255, 152, 0, 0.4); }
        .btn-p:active:not(:disabled) { transform: translateY(0); }
        .btn-p:disabled { background: #333; color: #666; cursor: not-allowed; box-shadow: none; }
        
        /* CART - CLEAN & MODERN */
        .cart-panel { 
            width: 380px; 
            background: rgba(10, 10, 12, 0.85); 
            backdrop-filter: blur(20px);
            border-left: 1px solid var(--glass-border); 
            display: flex; flex-direction: column; 
            box-shadow: -20px 0 50px rgba(0,0,0,0.5);
            z-index: 50;
        }
        .cart-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 15px 20px; 
            background: rgba(255,255,255,0.02);
            margin-bottom: 10px; border-radius: 16px;
            border: 1px solid transparent;
            transition: 0.2s;
        }
        .cart-item:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }

        .qty-control { display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 4px; border: 1px solid var(--glass-border); }
        .qty-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: transparent; color: #fff; cursor: pointer; font-weight: 900; transition: 0.2s; }
        .qty-btn:hover { background: rgba(255,255,255,0.1); }
        
        .qty-input { 
            width: 40px; background: transparent; border: none; 
            color: #fff; text-align: center; font-weight: 800; font-size: 1rem; 
        }
        .qty-input:focus { outline: none; color: var(--p); }

        .del-btn {
            background: rgba(239, 68, 68, 0.15); color: var(--error);
            width: 32px; height: 32px; border-radius: 10px; border: none;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: 0.2s; margin-left: 10px;
        }
        .del-btn:hover { background: var(--error); color: #fff; }

        /* CHIPS */
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding: 5px 5px 20px 5px; margin-bottom: 10px; }
        .chip { 
            padding: 10px 24px; border-radius: 100px; 
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); 
            color: var(--muted); cursor: pointer; white-space: nowrap; 
            font-weight: 700; font-size: 0.85rem; transition: 0.3s; 
        }
        .chip:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .chip.active { background: var(--p); color: #111; border-color: var(--p); box-shadow: 0 0 20px var(--p-glow); }

        /* PERFORMANCE BARS & BADGES */
        .perf-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px var(--p); }

        /* BOTTOM TOOLBAR */
        .toolbar-area {
            margin-top: auto; padding-top: 20px; border-top: 1px solid var(--glass-border);
        }
        .toolbar { display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap; }
        .tool-btn { 
            background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: #fff; 
            width: 38px; height: 38px; border-radius: 12px; cursor: pointer; 
            display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: 0.2s; 
        }
        .tool-btn:hover { border-color: var(--p); color: var(--p); background: rgba(255, 152, 0, 0.1); }
        
        .emp-badge { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 10px; text-align: center; }
        .emp-name { font-weight: 900; color: #fff; font-size: 0.95rem; }
        .emp-role { font-weight: 700; color: var(--p); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        /* DROPZONE */
        .dropzone { 
            border: 2px dashed var(--glass-border); border-radius: 20px; padding: 20px; 
            text-align: center; transition: 0.3s; cursor: pointer; 
            background: rgba(0,0,0,0.2); margin-bottom: 20px; 
            position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; 
        }
        .dropzone.active { border-color: var(--p); background: rgba(255, 152, 0, 0.05); }
        .dz-preview-container { position: relative; width: 100%; display: flex; justify-content: center; }
        .dz-preview { max-height: 150px; border-radius: 12px; border: 1px solid var(--glass-border); }

        /* TOAST */
        .toast { 
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%); 
            padding: 15px 30px; border-radius: 50px; z-index: 9999; 
            animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
            backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
            display: flex; flex-direction: column; align-items: center;
        }
        @keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

        /* MODAL */
        .modal-overlay { 
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
            background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); 
            z-index: 10000; display: flex; align-items: center; justify-content: center; 
            animation: fadeIn 0.3s; 
        }
        .modal-box { 
            background: #111; border: 1px solid var(--glass-border); padding: 40px; 
            border-radius: 30px; width: 90%; max-width: 420px; text-align: center; 
            box-shadow: 0 0 100px rgba(255, 152, 0, 0.15); 
            transform: scale(0.95); animation: popIn 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        @keyframes popIn { to { transform: scale(1); } }

        /* SVG SPARKLINES */
        .sparkline { width: 100%; height: 50px; opacity: 0.5; margin-top: 10px; stroke: var(--p); fill: none; stroke-width: 3px; stroke-linecap: round; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35, filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.3))'}} />
            <h1 style={{fontSize:'2.2rem', fontWeight:900, marginBottom:10, letterSpacing: '-1px'}}>Hen House</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Identification Biométrique Requise</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center', fontSize:'1.1rem'}}>
              <option value="">👤 SÉLECTIONNER IDENTITÉ</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>AUTHENTIFICATION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div className="side-logo"><img src="https://i.goopics.net/dskmxi.png" height="60" /></div>
            <div style={{flex:1, overflowY:'auto', overflowX:'hidden', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span>{t.e}</span> <div className="nav-text">{t.l}</div>
                </button>
              ))}
            </div>
            
            <div className="toolbar-area">
              <div className="toolbar">
                <button className="tool-btn" title="Rafraîchir" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" title="Sons" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button className="tool-btn" title="Déconnexion" onClick={requestLogout} style={{color:'var(--error)', borderColor:'rgba(239, 68, 68, 0.3)'}}>🛑</button>
              </div>
              <div className="emp-badge">
                <div className="emp-name">{user}</div>
                <div className="emp-role">{myProfile?.role || 'Agent'}</div>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* HOME DASHBOARD */}
              {currentTab === 'home' && (
                <div className="fade-in">
                   <div style={{marginBottom:45, display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                       <div>
                           <h1 style={{fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, letterSpacing:'-2px', background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Bonjour {user.split(' ')[0]}</h1>
                           <p style={{color: 'var(--p)', fontSize: '1.2rem', fontWeight: 700, marginTop: 10, textTransform: 'uppercase', letterSpacing: '2px'}}>Prêt pour le service ?</p>
                       </div>
                       <div className="v-card-avatar" style={{width:60, height:60, fontSize:'1.5rem'}}>{user.charAt(0)}</div>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 25, marginBottom: 50}}>
                      <div className="card" style={{padding: 30, textAlign:'left', background: 'linear-gradient(145deg, rgba(24, 26, 32, 0.8), rgba(0,0,0,0.8))'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <div className="stat-label">Chiffre d'Affaires</div>
                             <div style={{fontSize:'1.5rem'}}>💰</div>
                         </div>
                         <div className="stat-value" style={{fontSize: '2.5rem'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         <svg className="sparkline" viewBox="0 0 100 20"><path d="M0 20 Q 25 5 50 10 T 100 0" /></svg>
                      </div>

                      <div className="card" style={{padding: 30, textAlign:'left', background: 'linear-gradient(145deg, rgba(24, 26, 32, 0.8), rgba(0,0,0,0.8))'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <div className="stat-label">Production</div>
                             <div style={{fontSize:'1.5rem'}}>📦</div>
                         </div>
                         <div className="stat-value" style={{fontSize: '2.5rem', color: 'var(--success)'}}>{myProfile?.stock.toLocaleString()}</div>
                         <svg className="sparkline" style={{stroke: 'var(--success)'}} viewBox="0 0 100 20"><path d="M0 15 Q 25 18 50 5 T 100 10" /></svg>
                      </div>

                      <div className="card" style={{padding: 30, textAlign:'left', background: 'linear-gradient(145deg, rgba(24, 26, 32, 0.8), rgba(0,0,0,0.8))'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <div className="stat-label">Salaire Estimé</div>
                             <div style={{fontSize:'1.5rem'}}>💶</div>
                         </div>
                         <div className="stat-value" style={{fontSize: '2.5rem', color: '#a78bfa'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         <svg className="sparkline" style={{stroke: '#a78bfa'}} viewBox="0 0 100 20"><path d="M0 10 Q 40 20 60 5 T 100 0" /></svg>
                      </div>
                   </div>

                   <h3 style={{marginBottom: 20, fontWeight: 800, color: 'var(--muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing:'1px'}}>Accès Rapide</h3>
                   <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:15}}>
                   {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                       <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 20, display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                           <span style={{fontSize:'2.5rem'}}>{m.e}</span>
                           <div style={{fontSize:'0.85rem', fontWeight:700}}>{m.l}</div>
                       </div>
                   ))}
                   </div>
                </div>
              )}

              {/* INVOICES (POS) */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', gap:20, marginBottom:30}}>
                        <div style={{flex:1, position:'relative'}}>
                            <span style={{position:'absolute', left:20, top:18, opacity:0.5}}>🔍</span>
                            <input className="inp" placeholder="Rechercher un plat..." style={{paddingLeft:50, margin:0, background:'rgba(255,255,255,0.05)'}} onChange={e=>setSearch(e.target.value)} />
                        </div>
                  </div>
                  
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                    {Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                    ))}
                  </div>

                  <div className="grid" style={{paddingBottom: 100}}>
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const cartItem = cart.find(i=>i.name===p);
                      return (
                        <div key={p} className={`card ${cartItem?'sel':''}`} onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty: Number(x.qty)+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty-badge">{cartItem.qty}</div>}
                            <div className="card-img-container">
                                {IMAGES[p] ? <img src={IMAGES[p]} className="card-img" /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', background:'#111', color: 'var(--p)'}}>{p.charAt(0)}</div>}
                                <div className="card-content">
                                    <div style={{fontWeight:800, fontSize:'0.9rem', color:'#fff', lineHeight: 1.2, marginBottom: 4}}>{p}</div>
                                    <div style={{color:'var(--p)', fontWeight:900, fontSize:'1.1rem'}}>${data.prices[p]}</div>
                                </div>
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
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:30}}>Déclarez vos dépenses professionnelles.</p>
                        
                        <div style={{display:'flex', gap:15, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                            <select className="inp" style={{flex:1}} value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                                <option>Essence</option><option>Réparation</option><option>Autre</option>
                            </select>
                        </div>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} style={{fontSize:'1.2rem', fontWeight:900, color:'var(--p)'}} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} 
                             onDragOver={e => { e.preventDefault(); setDragActive(true); }} 
                             onDragLeave={() => setDragActive(false)} 
                             onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} 
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                           
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           
                           {!forms.expense.file ? (
                             <>
                               <div style={{fontSize:'3.5rem', marginBottom:15, opacity:0.8}}>📸</div>
                               <div style={{fontWeight:800, color:'var(--muted)'}}>GLISSER OU COLLER (CTRL+V)</div>
                             </>
                           ) : (
                             <div className="dz-preview-container">
                               <button className="del-btn" style={{position:'absolute', top:-10, right:-10, boxShadow:'0 5px 15px rgba(0,0,0,0.5)'}} onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
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
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>📦 Stock Cuisine</h2>
                    <div style={{maxHeight: '400px', overflowY:'auto', paddingRight:5}}>
                        {forms.stock.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, margin:0}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Sélectionner produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:90, margin:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                            </div>
                        ))}
                    </div>
                    <button className="nav-l" style={{border:'2px dashed var(--glass-border)', justifyContent:'center', margin: '20px 0', color: 'var(--p)'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🏢 Commande Pro</h2>
                    <input className="inp" placeholder="Nom de l'Entreprise" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    <div style={{height: 1, background: 'var(--glass-border)', margin: '20px 0'}}></div>
                    {forms.enterprise.items.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, margin:0}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, margin:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                        </div>
                    ))}
                    <button className="nav-l" style={{border:'2px dashed var(--glass-border)', justifyContent:'center', margin: '20px 0'}} onClick={()=>setForms(f=>({...f, enterprise: {...f.enterprise, items: [...f.enterprise.items, {product:'', qty:1}]}}))}>+ AJOUTER</button>
                    <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>TRANSMETTRE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🤝 Contrat Partenaire</h2>
                    <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} style={{textAlign:'center', letterSpacing:'2px'}} />
                    <div style={{display:'flex', gap:10, marginBottom:10}}>
                        <select className="inp" style={{flex:1, margin:0}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1, margin:0}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    <div style={{background:'rgba(0,0,0,0.3)', padding:15, borderRadius:16, marginBottom:20}}>
                        {forms.partner.items.map((item, idx) => (
                            <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, margin:0, fontSize:'0.85rem'}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                                <input type="number" className="inp" style={{width:70, margin:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                            </div>
                        ))}
                    </div>
                    <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER PARTENAIRE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🚗 GESTION FLOTTE</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(255,152,0,0.05)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--p)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ ESSENCE</span><span style={{color:'var(--p)', fontSize:'1.5rem'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:10}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER VÉHICULE</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:35, textAlign:'center'}}>Annuaire Hen House</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:25}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card">
                            <div className="v-card-avatar">{e.name.charAt(0)}</div>
                            <div className="v-card-name">{e.name}</div>
                            <div className="v-card-role">{e.role}</div>
                            <a href={`tel:${e.phone}`} className="v-card-btn" style={{background:'var(--p)'}}>📞 {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="card" style={{padding:35, textAlign:'left', background:'rgba(0,0,0,0.4)', cursor:'default'}}>
                    <h2 style={{marginBottom:30, fontWeight:950, color:'var(--p)'}}>🏆 CLASSEMENT VENTES</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b style={{color: i===0 ? 'var(--p)' : '#fff'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:35, textAlign:'left', background:'rgba(0,0,0,0.4)', cursor:'default'}}>
                    <h2 style={{marginBottom:30, fontWeight:950, color:'var(--success)'}}>📦 MEILLEURS PRODUCTEURS</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b>{e.stock.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16,185,129,0.1)'}}><div className="perf-fill" style={{background:'var(--success)', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                   <div className="form-ui" style={{maxWidth: 600, padding: 50}}>
                        <div style={{textAlign:'center'}}>
                            <div className="v-card-avatar" style={{width:120, height:120, margin:'0 auto 20px', fontSize:'3rem'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.5rem', fontWeight:950}}>{user}</h1>
                            <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.2rem'}}>{myProfile.role}</div>
                        </div>
                        <div className="profile-grid">
                            <div className="stat-box">
                                <div className="stat-label">Chiffre Personnel</div>
                                <div className="stat-value" style={{color:'var(--p)'}}>${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Plats Cuisinés</div>
                                <div className="stat-value" style={{color:'var(--success)'}}>{myProfile.stock}</div>
                            </div>
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 24, padding: 30, marginTop: 25, textAlign: 'center'}}>
                            <div className="stat-label" style={{marginBottom:10}}>Salaire à percevoir</div>
                            <div style={{fontSize: '3.5rem', fontWeight: 950, textShadow:'0 0 30px rgba(255,255,255,0.2)'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                   </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🆘 CENTRE D'AIDE</h2>
                    <input className="inp" placeholder="Objet de la demande" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Décrivez votre problème au patron..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (POS) */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel">
              <div style={{padding:30, borderBottom:'1px solid var(--glass-border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h2 style={{fontSize:'1.4rem', fontWeight:950, letterSpacing:'1px'}}>🛒 COMMANDE</h2>
                  <button onClick={requestClearCart} title="Tout vider" style={{background:'transparent', border:'none', fontSize:'1.2rem', cursor:'pointer', opacity:0.6}}>🗑️</button>
              </div>
              <div style={{padding:20}}>
                  <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.3rem', letterSpacing:'3px', background:'rgba(0,0,0,0.5)', margin:0}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.length === 0 ? (
                    <div style={{textAlign:'center', marginTop: 80, opacity: 0.3, display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <span style={{fontSize:'4rem', marginBottom:10}}>🧾</span>
                        <div>En attente d'articles...</div>
                    </div>
                ) : cart.map((i, idx)=>(
                  <div key={idx} className="cart-item">
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.95rem', marginBottom:2}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.85rem', fontWeight:700}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <div className="qty-control">
                          <button className="qty-btn" onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else removeFromCart(idx); setCart(n);}}>-</button>
                          <input className="qty-input" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                          <button className="qty-btn" onClick={()=>{const n=[...cart]; n[idx].qty = Number(n[idx].qty) + 1; setCart(n);}}>+</button>
                      </div>
                      <button className="del-btn" onClick={() => removeFromCart(idx)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background:'rgba(0,0,0,0.4)', borderTop:'1px solid var(--glass-border)', backdropFilter:'blur(10px)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'baseline'}}>
                    <span style={{fontWeight:700, color:'var(--muted)', letterSpacing:'1px'}}>TOTAL À PAYER</span>
                    <b style={{fontSize:'2.8rem', color:'var(--p)', fontWeight:950, textShadow:'0 0 20px rgba(255,152,0,0.3)'}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:Number(x.qty)}))})}>
                    VALIDER LA VENTE
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : 'var(--p)' }}>
          <div style={{ color: toast.s === 'error' ? 'var(--error)' : 'var(--p)', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 4, letterSpacing:'1px' }}>{toast.t}</div>
          <div style={{ fontSize: '1rem', fontWeight:600 }}>{toast.m}</div>
        </div>
      )}

      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:30, fontSize:'1.1rem'}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'transparent', border:'1px solid var(--glass-border)', color:'#fff'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
