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

// Petit composant Sparkline pour l'effet visuel
const Sparkline = ({ color }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{opacity:0.6}}>
    <path d="M0 35 Q 25 10 50 25 T 100 5" fill="none" stroke={color} strokeWidth="3" />
    <path d="M0 35 Q 25 10 50 25 T 100 5 V 40 H 0 Z" fill={color} fillOpacity="0.2" stroke="none" />
  </svg>
);

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

  const total = useMemo(() => Math.round(cart.reduce((a,b)=>a+(Number(b.qty)||0)*b.pu, 0)), [cart]);
  const salaryGain = useMemo(() => Math.round(total * 0.45), [total]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  // Nouvelle logique pour permettre de vider l'input sans que ça saute à 0
  const updateCartQty = (idx, val) => {
    const n = [...cart];
    // Si vide ou négatif, on garde la chaine vide ou on met 0, mais on supprime pas direct
    if (val === '') {
        n[idx].qty = ''; 
    } else {
        const v = parseInt(val);
        if(!isNaN(v)) n[idx].qty = v;
    }
    setCart(n);
  };

  // Suppression explicite
  const removeCartItem = (idx) => {
    const n = [...cart];
    n.splice(idx, 1);
    setCart(n);
  };

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      // Nettoyage des quantités vides avant envoi
      let cleanPayload = payload;
      if(action === 'sendFactures') {
          cleanPayload = {
              ...payload,
              items: payload.items.map(x => ({ ...x, qty: Number(x.qty) || 1 }))
          };
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
    <div className="app">
         <style jsx>{`
            .sk-side { width: 100px; height: 100vh; background: #000; padding: 20px; border-right: 1px solid #333; }
            .sk-main { flex: 1; padding: 40px; background: #050505; }
            .sk-box { background: rgba(255,255,255,0.05); border-radius: 12px; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
         `}</style>
         <div className="sk-side"></div>
         <div className="sk-main">
            <div className="sk-box" style={{height: 200, width: '100%', marginBottom: 30}} />
            <div className="sk-box" style={{height: 400, width: '100%'}} />
         </div>
    </div>
  );

  return (
    <div className="app">
      {/* --- ORBITAL BACKGROUND --- */}
      <div className="ambient-light">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
      </div>

      <style jsx global>{`
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg: #050505; 
            --panel: #121212; 
            --glass: rgba(20, 20, 20, 0.6);
            --glass-border: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --radius: 24px; 
            --success: #10b981; 
            --error: #ef4444; 
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        
        /* Ambient Animation */
        .ambient-light { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; z-index: -1; pointer-events: none; }
        .orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.3; animation: float 15s infinite alternate; }
        .orb-1 { width: 400px; height: 400px; background: var(--p); top: -100px; left: -100px; }
        .orb-2 { width: 500px; height: 500px; background: #6366f1; bottom: -100px; right: -100px; animation-delay: -5s; }
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }

        /* Layout */
        .app { display: flex; height: 100vh; width: 100vw; gap: 20px; padding: 20px; }
        
        /* Sidebar Dock */
        .side { 
            width: 90px; 
            background: var(--glass); 
            backdrop-filter: blur(40px);
            border: 1px solid var(--glass-border);
            border-radius: 30px; 
            display: flex; flex-direction: column; align-items: center; padding: 30px 0; 
            z-index: 100; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            transition: width 0.3s;
        }
        .side:hover { width: 240px; } 
        .side:hover .nav-label { opacity: 1; transform: translateX(0); display: block; }
        .side:hover .nav-icon { margin-right: 15px; }

        .nav-btn { 
            display: flex; align-items: center; justify-content: flex-start;
            width: 80%; padding: 12px; margin-bottom: 8px; border-radius: 16px; 
            background: transparent; border: none; color: var(--muted); 
            cursor: pointer; transition: 0.3s; position: relative; overflow: hidden;
        }
        .nav-icon { font-size: 1.5rem; transition: 0.3s; min-width: 30px; text-align: center; }
        .nav-label { font-size: 0.95rem; font-weight: 700; opacity: 0; display: none; white-space: nowrap; transition: 0.2s; }
        
        .nav-btn.active { background: rgba(255,152,0,0.15); color: #fff; box-shadow: 0 0 20px var(--p-glow); border: 1px solid var(--p-glow); }
        .nav-btn:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        /* Main Area */
        .main { 
            flex: 1; border-radius: 30px; background: rgba(10,10,10,0.4); 
            backdrop-filter: blur(20px); border: 1px solid var(--glass-border);
            overflow-y: auto; padding: 40px; position: relative; 
            box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
        }

        /* Modern Cards */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        
        .card { 
            background: rgba(30,30,30,0.6); border: 1px solid var(--glass-border);
            border-radius: 24px; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card:hover { transform: translateY(-8px) scale(1.02); border-color: var(--p); box-shadow: 0 20px 40px var(--p-glow); z-index: 10; }
        .card.sel { border-color: var(--p); box-shadow: 0 0 0 2px var(--p); }

        .card-img { height: 140px; width: 100%; object-fit: cover; mask-image: linear-gradient(to bottom, black 60%, transparent 100%); }
        .card-content { padding: 15px; position: relative; margin-top: -40px; }
        .card-title { font-weight: 800; font-size: 0.9rem; line-height: 1.2; margin-bottom: 5px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .card-price { color: var(--p); font-weight: 900; font-size: 1.1rem; text-shadow: 0 0 10px var(--p-glow); }

        .card-qty { 
            position: absolute; top: 10px; right: 10px; background: var(--p); color: #000; 
            width: 30px; height: 30px; border-radius: 50%; font-size: 0.8rem; 
            display: flex; align-items: center; justify-content: center; font-weight: 900; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 5;
        }

        /* Form UI */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80%; }
        .form-ui { 
            width: 100%; max-width: 550px; background: rgba(20,20,20,0.8); 
            backdrop-filter: blur(40px); padding: 40px; border-radius: 32px; 
            border: 1px solid var(--glass-border); box-shadow: 0 40px 80px rgba(0,0,0,0.6); 
            position: relative;
        }
        .inp { 
            width: 100%; padding: 16px 20px; border-radius: 16px; border: 1px solid var(--glass-border); 
            background: rgba(0,0,0,0.3); color: #fff; font-weight: 600; margin-bottom: 15px; 
            transition: 0.3s; font-size: 0.95rem;
        }
        .inp:focus { outline: none; border-color: var(--p); box-shadow: 0 0 20px var(--p-glow); background: rgba(0,0,0,0.6); }
        
        .btn-p { 
            background: var(--p); color: #000; border:none; padding: 20px; border-radius: 18px; 
            font-weight: 800; font-size: 1rem; cursor: pointer; width: 100%; transition: 0.3s; 
            box-shadow: 0 10px 30px var(--p-glow); text-transform: uppercase; letter-spacing: 1px;
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 40px var(--p-glow); filter: brightness(1.1); }
        .btn-p:active { transform: scale(0.98); }
        .btn-p:disabled { background: #333; color: #666; cursor: not-allowed; box-shadow: none; transform: none; }

        /* Cart */
        .cart { 
            width: 360px; background: var(--glass); backdrop-filter: blur(40px);
            border-radius: 30px; border: 1px solid var(--glass-border); 
            display: flex; flex-direction: column; overflow: hidden;
            margin-left: 0; box-shadow: -20px 0 50px rgba(0,0,0,0.5);
        }
        .cart-header { padding: 30px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--glass-border); }
        .cart-item { display: flex; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--glass-border); transition: 0.2s; }
        .cart-item:hover { background: rgba(255,255,255,0.03); }
        
        .qty-control { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.4); border-radius: 10px; padding: 4px; border: 1px solid var(--glass-border); }
        .qty-btn { width: 28px; height: 28px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-weight: 900; transition: 0.2s; }
        .qty-btn:hover { background: var(--p); color: #000; }
        .qty-input { width: 35px; background: transparent; border: none; color: #fff; text-align: center; font-weight: 800; font-size: 1rem; }
        .qty-input:focus { outline: none; }

        .btn-trash { background: rgba(239, 68, 68, 0.2); color: var(--error); border: none; width: 32px; height: 32px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; margin-left: 10px; }
        .btn-trash:hover { background: var(--error); color: #fff; }

        /* Chips */
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 10px; scrollbar-width: none; }
        .chip { padding: 10px 24px; border-radius: 50px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 700; font-size: 0.85rem; transition: 0.3s; backdrop-filter: blur(10px); }
        .chip.active { background: var(--p); color: #000; border-color: var(--p); box-shadow: 0 0 20px var(--p-glow); }
        .chip:hover:not(.active) { background: rgba(255,255,255,0.1); color: #fff; }

        /* Others */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .toast { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 15px 30px; border-radius: 50px; z-index: 9999; animation: dropIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 20px 60px rgba(0,0,0,0.8); min-width: 300px; text-align: center; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); }
        @keyframes dropIn { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <div style={{width: 120, height: 120, background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 0 50px var(--p-glow)', border: '2px solid var(--p)'}}>
                <span style={{fontSize: '3rem'}}>🐔</span>
            </div>
            <h1 style={{fontSize:'2.5rem', fontWeight:900, marginBottom:5, background: 'linear-gradient(to right, #fff, var(--muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>HEN HOUSE</h1>
            <p style={{color:'var(--p)', fontSize:'0.9rem', marginBottom:40, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800}}>Système de Gestion 2.0</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)} style={{textAlign:'center', fontSize: '1.1rem'}}>
              <option value="">👤 SÉLECTIONNER AGENT</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>ACCÉDER AU TERMINAL</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{marginBottom: 40, marginTop: 10}}>
                <div style={{width: 50, height: 50, background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--p)', boxShadow: '0 0 20px var(--p-glow)'}}>🐔</div>
            </div>
            
            <div style={{flex:1, width: '100%', display:'flex', flexDirection:'column', alignItems:'center', gap: 5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-btn ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span className="nav-icon">{t.e}</span> 
                  <span className="nav-label">{t.l}</span>
                </button>
              ))}
            </div>
            
            <div style={{paddingTop: 20, width: '100%', display:'flex', flexDirection:'column', alignItems:'center', gap: 10}}>
               <button className="nav-btn" onClick={() => {setIsMuted(!isMuted); playSound('click');}} style={{justifyContent: 'center', width: 50}}>
                  <span className="nav-icon">{isMuted ? '🔇' : '🔊'}</span>
               </button>
               <button className="nav-btn" onClick={requestLogout} style={{background: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)', justifyContent: 'center', width: 50, border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                  <span className="nav-icon">🚪</span>
               </button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* HOME */}
              {currentTab === 'home' && (
                <div>
                   <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 40}}>
                       <div>
                           <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 5, letterSpacing:'-1px', textShadow: '0 5px 20px rgba(0,0,0,0.5)'}}>Bonjour, {user.split(' ')[0]}</h1>
                           <div style={{display:'flex', gap:10, alignItems:'center'}}>
                               <span style={{width:10, height:10, background:'var(--success)', borderRadius:'50%', boxShadow: '0 0 10px var(--success)'}}></span>
                               <p style={{color: 'var(--muted)', fontSize: '1rem', fontWeight: 600}}>Système opérationnel • V.2026</p>
                           </div>
                       </div>
                       <div style={{textAlign:'right'}}>
                           <div style={{fontSize:'1.5rem', fontWeight:900}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                           <div style={{color:'var(--p)', fontWeight:800}}>{myProfile?.role || 'AGENT'}</div>
                       </div>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 25, marginBottom: 50}}>
                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(255,152,0,0.1), rgba(0,0,0,0.4))', border: '1px solid rgba(255,152,0,0.3)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <span style={{fontSize:'3rem'}}>💰</span>
                             <div style={{textAlign:'right'}}>
                                 <div style={{color:'var(--p)', fontWeight:800, fontSize:'0.8rem', textTransform:'uppercase'}}>Chiffre d'Affaires</div>
                                 <div style={{fontSize:'2rem', fontWeight:900}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                             </div>
                         </div>
                         <Sparkline color="#ff9800" />
                      </div>

                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,0,0,0.4))', border: '1px solid rgba(16,185,129,0.3)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <span style={{fontSize:'3rem'}}>📦</span>
                             <div style={{textAlign:'right'}}>
                                 <div style={{color:'var(--success)', fontWeight:800, fontSize:'0.8rem', textTransform:'uppercase'}}>Production</div>
                                 <div style={{fontSize:'2rem', fontWeight:900}}>{myProfile?.stock.toLocaleString()}</div>
                             </div>
                         </div>
                         <Sparkline color="#10b981" />
                      </div>

                      <div className="card" style={{padding: 30, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(0,0,0,0.4))', border: '1px solid rgba(99,102,241,0.3)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', marginBottom: 15}}>
                             <span style={{fontSize:'3rem'}}>💶</span>
                             <div style={{textAlign:'right'}}>
                                 <div style={{color:'#6366f1', fontWeight:800, fontSize:'0.8rem', textTransform:'uppercase'}}>Salaire Estimé</div>
                                 <div style={{fontSize:'2rem', fontWeight:900}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                             </div>
                         </div>
                         <Sparkline color="#6366f1" />
                      </div>
                   </div>

                   <h3 style={{marginBottom: 20, fontWeight: 900, color: '#fff', fontSize: '1.2rem', paddingLeft: 10, borderLeft: '4px solid var(--p)'}}>ACCÈS RAPIDE</h3>
                   <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:20}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25, display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                                <span style={{fontSize:'2.5rem'}}>{m.e}</span>
                                <div style={{fontSize:'0.9rem', fontWeight:800, color: 'var(--muted)'}}>{m.l}</div>
                            </div>
                        ))}
                   </div>
                </div>
              )}

              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div>
                  <div style={{display:'flex', gap: 15, marginBottom: 25}}>
                     <div style={{position:'relative', flex: 1}}>
                         <span style={{position:'absolute', left:18, top:16, opacity:0.5}}>🔍</span>
                         <input className="inp" placeholder="Rechercher un produit..." style={{paddingLeft:50, marginBottom:0, background: 'rgba(0,0,0,0.4)'}} onChange={e=>setSearch(e.target.value)} />
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
                        <div key={p} className={`card ${cartItem?'sel':''}`} onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:(Number(x.qty)||0)+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            {IMAGES[p] ? 
                                <img src={IMAGES[p]} className="card-img" /> : 
                                <div className="card-img" style={{background:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem'}}>{p.charAt(0)}</div>
                            }
                            <div className="card-content">
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
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>💳 FRAIS & ESSENCE</h2>
                        
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom:5}}>
                            <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                            <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                                <option>Essence</option><option>Réparation</option><option>Autre</option>
                            </select>
                        </div>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} style={{fontSize:'1.2rem', fontWeight:900}} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} 
                             onDragOver={e => { e.preventDefault(); setDragActive(true); }} 
                             onDragLeave={() => setDragActive(false)} 
                             onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} 
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                            
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           
                           {!forms.expense.file ? (
                             <div style={{opacity:0.6}}>
                               <div style={{fontSize:'3rem', marginBottom:10}}>📸</div>
                               <div style={{fontWeight:800}}>PREUVE REQUISE</div>
                               <div style={{fontSize:'0.8rem'}}>Glisser ou Coller (CTRL+V)</div>
                             </div>
                           ) : (
                             <div className="dz-preview-container">
                               <button className="btn-del-file" title="Supprimer" onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
                               <img src={forms.expense.file} className="dz-preview" alt="Reçu" />
                             </div>
                           )}
                        </div>
                        
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>VALIDER LA NOTE</button>
                    </div>
                </div>
              )}

              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>📦 STOCK CUISINE</h2>
                    <div style={{maxHeight: 400, overflowY: 'auto', paddingRight: 5}}>
                        {forms.stock.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Sélectionner...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                            </div>
                        ))}
                    </div>
                    <button className="nav-btn" style={{width:'100%', justifyContent:'center', border:'1px dashed var(--muted)', marginBottom:20}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🏢 COMMANDE PRO</h2>
                    <input className="inp" placeholder="Nom de l'entreprise" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    <div style={{background:'rgba(0,0,0,0.2)', padding:15, borderRadius:15, marginBottom:20}}>
                        {forms.enterprise.items.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                                <input type="number" className="inp" style={{width:80, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                            </div>
                        ))}
                        <div style={{textAlign:'center', fontSize:'0.8rem', opacity:0.6, cursor:'pointer'}} onClick={()=>setForms({...forms, enterprise:{...forms.enterprise, items:[...forms.enterprise.items, {product:'', qty:1}]}})}>+ Ajouter un produit</div>
                    </div>
                    <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER LA COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🤝 PARTENAIRES</h2>
                    <input className="inp" placeholder="Numéro Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} style={{textAlign:'center', fontSize:'1.1rem', letterSpacing:2}} />
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom:15}}>
                        <select className="inp" value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    <div style={{padding:15, background:'rgba(255,255,255,0.03)', borderRadius:15, marginBottom:20}}>
                        {forms.partner.items.map((item, idx) => (
                            <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                                <input type="number" className="inp" style={{width:70, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                            </div>
                        ))}
                    </div>
                    <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LE CONTRAT</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🚗 VÉHICULES</h2>
                    <div style={{background:'rgba(0,0,0,0.3)', padding:20, borderRadius:20, marginBottom:20}}>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})} style={{marginBottom:20}}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <div style={{display:'flex', gap:10}}>
                             <button className="inp" style={{flex:1, background: forms.garage.action==='Entrée'?'var(--p)':'rgba(0,0,0,0.5)', color: forms.garage.action==='Entrée'?'#000':'#fff', border: forms.garage.action==='Entrée'?'none':'1px solid var(--glass-border)', cursor:'pointer'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Entrée'}})}>🅿️ ENTRÉE</button>
                             <button className="inp" style={{flex:1, background: forms.garage.action==='Sortie'?'var(--p)':'rgba(0,0,0,0.5)', color: forms.garage.action==='Sortie'?'#000':'#fff', border: forms.garage.action==='Sortie'?'none':'1px solid var(--glass-border)', cursor:'pointer'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Sortie'}})}>🔑 SORTIE</button>
                        </div>
                    </div>
                    <div style={{marginBottom:30}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:10}}><span>NIVEAU ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:8}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER ÉTAT</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div>
                    <h2 style={{fontSize:'3rem', fontWeight:900, marginBottom:40, textShadow:'0 0 30px rgba(0,0,0,0.5)'}}>ANNUAIRE</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:30}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card" style={{alignItems:'flex-start', background: 'rgba(30,30,30,0.6)'}}>
                            <div style={{display:'flex', gap:15, alignItems:'center', marginBottom:15}}>
                                <div className="v-card-avatar" style={{width:50, height:50, fontSize:'1.5rem', margin:0, borderRadius:15}}>{e.name.charAt(0)}</div>
                                <div>
                                    <div className="v-card-name" style={{fontSize:'1rem', textAlign:'left'}}>{e.name}</div>
                                    <div className="v-card-role" style={{margin:0, textAlign:'left'}}>{e.role}</div>
                                </div>
                            </div>
                            <a href={`tel:${e.phone}`} className="v-card-btn" style={{width:'100%', background:'var(--p)', color:'#000', boxShadow: '0 5px 15px var(--p-glow)'}}>📞 {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="form-ui" style={{width:'100%', padding:30}}>
                    <h2 style={{marginBottom:30, fontWeight:900}}>🏆 MEILLEURS VENDEURS</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,8).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span><span style={{color:'var(--p)', fontWeight:900, marginRight:10}}>#{i+1}</span> {e.name}</span>
                           <b style={{color: i===0 ? 'var(--p)' : '#fff'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="form-ui" style={{width:'100%', padding:30}}>
                    <h2 style={{marginBottom:30, fontWeight:900}}>🍳 MEILLEURS CUISTOTS</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,8).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span><span style={{color:'var(--success)', fontWeight:900, marginRight:10}}>#{i+1}</span> {e.name}</span>
                           <b>{e.stock.toLocaleString()} u.</b>
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
                    <div className="form-ui" style={{maxWidth: 600, padding: 50, textAlign:'center'}}>
                         <div className="v-card-avatar" style={{width:120, height:120, margin:'0 auto 20px', fontSize:'3rem', boxShadow:'0 10px 30px var(--p-glow)'}}>{user.charAt(0)}</div>
                         <h1 style={{fontSize:'2.5rem', fontWeight:950}}>{user}</h1>
                         <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.2rem', marginBottom:40}}>{myProfile.role}</div>
                         
                         <div className="profile-grid">
                            <div className="stat-box" style={{background:'rgba(255,152,0,0.1)', borderColor:'var(--p)'}}>
                                <div className="stat-label" style={{color:'var(--p)'}}>TOTAL VENTES</div>
                                <div className="stat-value">${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">PRODUCTION</div>
                                <div className="stat-value">{myProfile.stock}</div>
                            </div>
                         </div>
                         <div style={{background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: 24, padding: 25, marginTop: 20}}>
                            <div className="stat-label" style={{color: 'var(--success)'}}>SALAIRE À PERCEVOIR</div>
                            <div style={{fontSize: '3.5rem', fontWeight: 950, color:'#fff'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                         </div>
                    </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🆘 SIGNALEMENT</h2>
                    <p style={{textAlign:'center', color:'var(--muted)', marginBottom:30}}>Un problème ? Contactez la direction directement.</p>
                    <input className="inp" placeholder="Sujet (ex: Manque de stock)" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Décrivez le problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER SIGNALEMENT</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER (DOCK DROIT) */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div className="cart-header">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h2 style={{fontSize:'1.5rem', fontWeight:950}}>PANIER</h2>
                      <button onClick={requestClearCart} title="Tout vider" style={{background:'transparent', border:'none', fontSize:'1.2rem', cursor:'pointer', opacity:0.6}}>🗑️</button>
                  </div>
                  <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', marginTop:20, marginBottom:0, fontSize:'1.1rem', letterSpacing:2, fontWeight:800}} />
              </div>
              <div style={{flex:1, overflowY:'auto'}}>
                {cart.length === 0 ? 
                    <div style={{textAlign:'center', marginTop: 100, opacity: 0.3, fontWeight:800}}>AUCUN ARTICLE</div> : 
                    cart.map((i, idx)=>(
                  <div key={idx} className="cart-item">
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.95rem'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.85rem', fontWeight:700}}>${i.pu * (Number(i.qty)||0)}</div>
                    </div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n[idx].qty=1; setCart(n);}}>-</button>
                      <input className="qty-input" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                      <button className="qty-btn" onClick={()=>{const n=[...cart]; n[idx].qty=(Number(n[idx].qty)||0)+1; setCart(n);}}>+</button>
                    </div>
                    <button className="btn-trash" onClick={() => removeCartItem(idx)}>×</button>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background: 'rgba(0,0,0,0.4)', borderTop:'1px solid var(--glass-border)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'flex-end'}}>
                    <span style={{fontWeight:800, color:'var(--muted)', fontSize:'0.9rem'}}>TOTAL À PAYER</span>
                    <b style={{fontSize:'2.5rem', color:'var(--p)', fontWeight:950, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>ENCAISSER</button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ borderColor: toast.s === 'error' ? 'var(--error)' : 'var(--p)' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: 5, color: toast.s === 'error' ? 'var(--error)' : 'var(--p)', letterSpacing:1, fontWeight:900 }}>{toast.t}</div>
          <div style={{ fontSize: '1.1rem' }}>{toast.m}</div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:10}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:30, fontSize:'1.1rem'}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'rgba(255,255,255,0.1)', color:'#fff', boxShadow:'none'}} onClick={()=>setConfirmModal(null)}>ANNULER</button>
                      <button className="btn-p" onClick={confirmModal.action}>CONFIRMER</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
