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
        osc.frequency.setValueAtTime(600, now); gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(); osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(783, now + 0.2); gain.gain.setValueAtTime(0.1, now);
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
    // Autoriser le champ vide pour l'édition
    if (val === '') {
        n[idx].qty = ''; 
        setCart(n);
        return;
    }
    const v = parseInt(val);
    if (!isNaN(v) && v >= 0) {
        if(v === 0) n.splice(idx, 1);
        else n[idx].qty = v;
        setCart(n);
    }
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

  const removeFromCart = (idx) => {
     const n = [...cart];
     n.splice(idx, 1);
     setCart(n);
  };

  // --- SKELETON LOADER SCREEN ---
  if (loading && !data) return (
    <div className="app">
        <style jsx>{`
            .sk-side { width: 260px; height: 100vh; background: #000; border-right: 1px solid #2d333f; padding: 20px; }
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap');
        
        :root { 
            --p: #ff9800; 
            --bg: #050505; 
            --glass-base: rgba(18, 18, 20, 0.75);
            --glass-border: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --radius: 20px; 
            --success: #10b981; 
            --error: #ef4444; 
        }
        
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { 
            background: var(--bg); 
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
        }

        /* AMBIANT BACKGROUND */
        .bg-blobs { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; pointer-events: none; }
        .blob { position: absolute; filter: blur(80px); opacity: 0.3; animation: floatBlob 20s infinite alternate; }
        .blob-1 { top: -10%; left: -10%; width: 600px; height: 600px; background: purple; }
        .blob-2 { bottom: -10%; right: -10%; width: 500px; height: 500px; background: var(--p); animation-delay: -5s; }
        .blob-3 { top: 40%; left: 40%; width: 400px; height: 400px; background: #0044ff; animation-delay: -10s; opacity: 0.15; }

        @keyframes floatBlob {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(100px, 50px) scale(1.1); }
        }

        .app { display: flex; height: 100vh; width: 100vw; position: relative; }

        /* FLOATING SIDEBAR */
        .side { 
            width: 260px; 
            margin: 20px;
            margin-right: 0;
            border-radius: 24px;
            background: var(--glass-base); 
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            padding: 24px; 
            display: flex; 
            flex-direction: column; 
            z-index: 100; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .nav-l { 
            display: flex; align-items: center; gap: 12px; 
            padding: 14px 16px; 
            border-radius: 14px; 
            border: 1px solid transparent; 
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            font-weight: 700; 
            width: 100%; 
            transition: 0.3s; 
            font-size: 0.9rem; 
            margin-bottom: 4px; 
        }
        .nav-l.active { 
            background: rgba(255, 152, 0, 0.15); 
            color: #fff; 
            border-color: rgba(255, 152, 0, 0.3);
            box-shadow: 0 0 15px rgba(255, 152, 0, 0.1); 
        }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }
        
        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        
        /* MODERN CARDS */
        .card { 
            background: rgba(255, 255, 255, 0.03); 
            border: 1px solid var(--glass-border); 
            border-radius: 24px; 
            cursor: pointer; 
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            text-align: center; 
            position: relative; 
            overflow: hidden; 
            display: flex;
            flex-direction: column;
        }
        .card:hover { 
            border-color: rgba(255, 152, 0, 0.5); 
            transform: translateY(-6px); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255, 152, 0, 0.1);
        }
        .card:active { transform: scale(0.97); }
        
        .card.sel { 
            border-color: var(--p); 
            background: rgba(255,152,0,0.08); 
        }
        
        .card-img-box {
            height: 120px;
            width: 100%;
            background: #000;
            position: relative;
        }
        
        .card-img { width: 100%; height: 100%; object-fit: cover; mask-image: linear-gradient(to bottom, black 80%, transparent 100%); }
        
        .card-info { padding: 12px; text-align: left; }

        .card-qty { 
            position: absolute; top: 10px; right: 10px; 
            background: var(--p); color: #fff; 
            width: 28px; height: 28px; 
            border-radius: 50%; 
            font-size: 0.8rem; 
            display: flex; align-items: center; justify-content: center; 
            font-weight: 900; 
            border: 2px solid #000; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            z-index: 2;
        }

        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        
        .form-ui { 
            width: 100%; max-width: 550px; 
            background: var(--glass-base); 
            backdrop-filter: blur(40px); 
            padding: 40px; 
            border-radius: 32px; 
            border: 1px solid var(--glass-border); 
            box-shadow: 0 30px 80px rgba(0,0,0,0.6); 
        }
        
        .inp { 
            width: 100%; padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid var(--glass-border); 
            background: rgba(0,0,0,0.3); 
            color: #fff; 
            font-weight: 600; 
            margin-bottom: 12px; 
            transition: 0.2s; 
            font-size: 0.95rem;
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(255, 152, 0, 0.1); }
        
        .btn-p { 
            background: var(--p); 
            color: #fff; 
            border:none; 
            padding: 18px; 
            border-radius: 16px; 
            font-weight: 800; 
            cursor: pointer; 
            width: 100%; 
            transition: 0.3s; 
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }
        .btn-p:hover:not(:disabled) { box-shadow: 0 10px 25px rgba(255, 152, 0, 0.3); transform: translateY(-2px); filter: brightness(1.1); }
        .btn-p:active:not(:disabled) { transform: scale(0.98); }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        
        /* FLOATING CART PANEL */
        .cart { 
            width: 360px; 
            margin: 20px;
            margin-left: 0;
            border-radius: 24px;
            background: var(--glass-base);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            display: flex; flex-direction: column; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .qty-control { display: flex; align-items: center; background: rgba(0,0,0,0.4); border-radius: 10px; padding: 2px; border: 1px solid var(--glass-border); }
        .qty-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: #fff; cursor: pointer; border-radius: 8px; transition:0.2s; }
        .qty-btn:hover { background: rgba(255,255,255,0.1); }
        .qty-inp { width: 40px; background: transparent; border: none; color: #fff; text-align: center; font-weight: 800; font-size: 0.9rem; -moz-appearance: textfield; }
        .qty-inp::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .qty-inp:focus { outline: none; }
        
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 10px; scrollbar-width: none; }
        .chip { padding: 10px 20px; border-radius: 30px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 800; font-size: 0.8rem; transition: 0.3s; }
        .chip:hover { background: rgba(255,255,255,0.1); }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); }

        .perf-bar { height: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s; box-shadow: 0 0 10px var(--p); }

        .toolbar { display: flex; gap: 10px; margin-bottom: 15px; justify-content: center; }
        .tool-btn { background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff; width: 42px; height: 42px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: 0.2s; }
        .tool-btn:hover { border-color: var(--p); color: var(--p); background: rgba(255,152,0,0.1); }
        
        .emp-badge { background: linear-gradient(to right, rgba(255,255,255,0.03), transparent); padding: 15px; border-radius: 16px; border-left: 3px solid var(--p); margin-bottom: 10px; }
        .emp-name { font-weight: 900; color: #fff; font-size: 0.95rem; margin-bottom: 2px; }
        .emp-role { font-weight: 700; color: var(--p); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; }

        .dropzone { border: 2px dashed var(--glass-border); border-radius: 15px; padding: 20px; text-align: center; transition: 0.3s; cursor: pointer; background: rgba(0,0,0,0.2); margin-bottom: 20px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; }
        .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .dz-preview-container { position: relative; width: 100%; max-width: 250px; margin-top: 10px; }
        .dz-preview { width: 100%; max-height: 180px; object-fit: contain; border-radius: 10px; border: 2px solid var(--glass-border); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        .btn-del-file { position: absolute; top: -10px; right: -10px; background: var(--error); color: #fff; border: none; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-weight: 900; z-index: 5; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

        .v-card { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 24px; padding: 20px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; position: relative; overflow: hidden; }
        .v-card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .v-card-avatar { width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, var(--p), #ffb74d); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 950; color: #fff; margin-bottom: 15px; border: 4px solid #000; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .v-card-name { font-size: 1.1rem; font-weight: 900; color: #fff; text-align: center; }
        .v-card-role { color: var(--p); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 15px; }
        .v-card-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; text-decoration: none; color: #fff; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .v-card-btn:hover { background: var(--p); color: #fff; }

        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
        .stat-box { background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 18px; padding: 20px; }
        .stat-label { font-size: 0.65rem; color: var(--muted); font-weight: 800; text-transform: uppercase; margin-bottom: 5px; }
        .stat-value { font-size: 1.5rem; font-weight: 950; color: #fff; }

        .toast { position: fixed; top: 30px; right: 30px; padding: 18px 28px; border-radius: 16px; z-index: 9999; animation: slideIn 0.4s ease-out; box-shadow: 0 15px 40px rgba(0,0,0,0.6); min-width: 280px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }

        /* MODAL STYLES */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .modal-box { background: #121212; border: 1px solid var(--glass-border); padding: 35px; border-radius: 24px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.9); transform: scale(0.9); animation: popIn 0.3s forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { to { transform: scale(1); } }
      `}</style>
      
      <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
      </div>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35, filter:'drop-shadow(0 0 20px rgba(255,152,0,0.3))'}} />
            <h1 style={{fontSize:'2rem', fontWeight:900, marginBottom:10}}>Hen House</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Portail Agent Sécurisé</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Qui êtes-vous ?</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>DÉMARRER LA SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:35}}><img src="https://i.goopics.net/dskmxi.png" height="45" /></div>
            <div style={{flex:1, overflowY:'auto', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{paddingTop: '20px', borderTop: '1px solid var(--glass-border)'}}>
              <div className="toolbar">
                <button className="tool-btn" title="Rafraîchir" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" title="Sons" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
              <div className="emp-badge">
                <div className="emp-name">{user}</div>
                <div className="emp-role">{myProfile?.role || 'Agent de terrain'}</div>
              </div>
              <button className="nav-l" onClick={requestLogout} style={{color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center'}}>🚪 DÉCONNEXION</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                   <div style={{marginBottom:45}}>
                       <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 12, letterSpacing:'-1px', background:'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Bonjour, {user.split(' ')[0]} 👋</h1>
                       <p style={{color: 'var(--muted)', fontSize: '1.1rem'}}>Voici vos indicateurs clés pour aujourd'hui.</p>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 45}}>
                      <div className="card" style={{display:'flex', flexDirection:'row', alignItems:'center', gap:25, padding: 30, textAlign:'left', background: 'linear-gradient(135deg, rgba(255,152,0,0.1), rgba(0,0,0,0))'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 0 10px rgba(255,152,0,0.5))'}}>💰</div>
                         <div>
                            <div className="stat-label">Chiffre d'Affaires</div>
                            <div className="stat-value" style={{color:'var(--p)'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', flexDirection:'row', alignItems:'center', gap:25, padding: 30, textAlign:'left', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0))'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 0 10px rgba(16,185,129,0.5))'}}>📦</div>
                         <div>
                            <div className="stat-label">Plats Produits</div>
                            <div className="stat-value" style={{color:'var(--success)'}}>{myProfile?.stock.toLocaleString()} <span style={{fontSize:'1rem', opacity:0.6}}>u.</span></div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', flexDirection:'row', alignItems:'center', gap:25, padding: 30, textAlign:'left', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(0,0,0,0))'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 0 10px rgba(99,102,241,0.5))'}}>💶</div>
                         <div>
                            <div className="stat-label">Salaire Estimé</div>
                            <div className="stat-value" style={{color:'#818cf8'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                   </div>

                   <div style={{background:'rgba(255,255,255,0.02)', padding:30, borderRadius:30, border:'1px solid var(--glass-border)'}}>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: '#fff', fontSize: '1.1rem'}}>SERVICES RAPIDES</h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:15}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25, justifyContent:'center'}}>
                                <span style={{fontSize:'2.8rem', display:'block', marginBottom:12}}>{m.e}</span>
                                <div style={{fontSize:'0.9rem', fontWeight:800}}>{m.l}</div>
                            </div>
                        ))}
                        </div>
                   </div>
                </div>
              )}

              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{position:'relative', marginBottom:20}}>
                        <span style={{position:'absolute', left:18, top:16, opacity:0.4}}>🔍</span>
                        <input className="inp" placeholder="Rechercher un plat..." style={{paddingLeft:45, background:'rgba(255,255,255,0.05)'}} onChange={e=>setSearch(e.target.value)} />
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
                        <div key={p} className={`card ${cartItem?'sel':''}`} onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:parseInt(x.qty||0)+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            <div className="card-img-box">
                                {IMAGES[p] ? <img src={IMAGES[p]} className="card-img" /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', background:'#111', color: 'var(--p)'}}>{p.charAt(0)}</div>}
                            </div>
                            <div className="card-info">
                                <div style={{fontWeight:800, fontSize:'0.85rem', marginBottom:5, height:40, overflow:'hidden', lineHeight:'1.2'}}>{p}</div>
                                <div style={{color:'var(--p)', fontWeight:950, fontSize:'1.1rem'}}>${data.prices[p]}</div>
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
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>💳 FRAIS & ESSENCE</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Déclarez vos dépenses professionnelles ici.</p>
                        
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
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                           
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           
                           {!forms.expense.file ? (
                             <>
                               <div style={{fontSize:'3rem', marginBottom:10}}>📸</div>
                               <div style={{fontWeight:800, color:'var(--muted)'}}>CLIQUEZ OU COLLEZ (CTRL+V)</div>
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
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>📦 STOCK CUISINE</h2>
                    {forms.stock.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Sélectionner...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                        </div>
                    ))}
                    <button className="nav-l" style={{border:'2px dashed var(--glass-border)', justifyContent:'center', marginBottom: 20, color:'#fff'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🏢 COMMANDE ENTREPRISE</h2>
                    <input className="inp" placeholder="Nom Société" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    {forms.enterprise.items.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>TRANSMETTRE COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🤝 PARTENAIRES</h2>
                    <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                    <div style={{display:'flex', gap:12, marginBottom:12}}>
                        <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    {forms.partner.items.map((item, idx) => (
                        <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                            <input type="number" className="inp" style={{width:70}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER PARTENAIRE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🚗 ÉTAT VÉHICULE</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(0,0,0,0.2)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--glass-border)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER GARAGE</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.2rem', fontWeight:950, marginBottom:35}}>Annuaire Interne</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:25}}>
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
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="card" style={{padding:35, textAlign:'left', alignItems:'stretch'}}>
                    <h2 style={{marginBottom:30, fontWeight:950}}>🏆 TOP C.A</h2>
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
                  <div className="card" style={{padding:35, textAlign:'left', alignItems:'stretch'}}>
                    <h2 style={{marginBottom:30, fontWeight:950}}>📦 TOP PRODUCTEURS</h2>
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
                            <div className="v-card-avatar" style={{width:100, height:100, margin:'0 auto 20px'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.5rem', fontWeight:950}}>{user}</h1>
                            <div style={{color:'var(--p)', fontWeight:800}}>{myProfile.role}</div>
                        </div>
                        <div className="profile-grid">
                            <div className="stat-box">
                                <div className="stat-label">Chiffre</div>
                                <div className="stat-value">${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Production</div>
                                <div className="stat-value">{myProfile.stock}</div>
                            </div>
                        </div>
                        <div style={{background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,0,0,0.3))', border: '1px solid var(--success)', borderRadius: 24, padding: 25, marginTop: 20, textAlign: 'center'}}>
                            <div className="stat-label" style={{color: 'var(--success)'}}>Salaire estimé</div>
                            <div style={{fontSize: '3rem', fontWeight: 950}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                   </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🆘 ASSISTANCE</h2>
                    <input className="inp" placeholder="Objet de la demande" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Message au patron..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (DOCK DROIT) */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:25, borderBottom:'1px solid var(--glass-border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h2 style={{fontSize:'1.1rem', fontWeight:900}}>🛒 COMMANDE</h2>
                  <button onClick={requestClearCart} title="Tout vider" style={{background:'rgba(255,255,255,0.1)', border:'none', width:30, height:30, borderRadius:8, cursor:'pointer'}}>🗑️</button>
              </div>
              <div style={{padding:20}}>
                  <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', background:'rgba(0,0,0,0.4)', fontSize:'1.1rem'}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.length === 0 ? <div style={{textAlign:'center', marginTop: 50, opacity: 0.3, fontWeight:600}}>Panier vide</div> : cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1, paddingRight:10}}>
                        <div style={{fontWeight:700, fontSize:'0.9rem'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.75rem', marginTop:2}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:5}}>
                      <div className="qty-control">
                          <button className="qty-btn" onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                          <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                          <button className="qty-btn" onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                      </div>
                      <button className="qty-btn" style={{background:'rgba(239,68,68,0.2)', color:'#ef4444', marginLeft:5}} onClick={() => removeFromCart(idx)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'rgba(0,0,0,0.2)', borderTop:'1px solid var(--glass-border)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}><span style={{fontWeight:800, color:'var(--muted)'}}>TOTAL</span><b style={{fontSize:'2rem', color:'var(--p)', fontWeight:950}}>${total.toLocaleString()}</b></div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>ENCAISSER</button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)')}}>
          <div style={{ color: toast.s === 'error' ? 'var(--error)' : (toast.s === 'success' ? 'var(--success)' : 'var(--p)'), fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 4 }}>{toast.t}</div>
          <div style={{ fontSize: '0.9rem', fontWeight:600 }}>{toast.m}</div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.4rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:25, fontSize:'0.95rem'}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:12}}>
                      <button className="btn-p" style={{background:'rgba(255,255,255,0.1)', color:'#fff'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
