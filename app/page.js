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
  "LA SIGNATURE VÉGÉTALE": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE PRESTIGE DE LA MER": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE RED WINGS": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE SOLEIL D'OR": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE SIGNATURE \"75\"": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "L'HÉRITAGE DU BERGER": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LA CROISIÈRE GOURMANDE": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Carpaccio Fruit Exotique": "https://files.catbox.moe/cbmjou.png",
  "Profiteroles au chocolat": "https://images.unsplash.com/photo-1600431521340-491eca880813?w=400",
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",
  "Verre de Cidre en Pression": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
  "Verre de Champagne": "https://images.unsplash.com/photo-1596464522923-018600d8692a?w=400",
  "Verre de rosé": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
  "Verre de Champomax": "https://images.unsplash.com/photo-1596464522923-018600d8692a?w=400",
  "Verre de Bellini": "https://images.unsplash.com/photo-1596464522923-018600d8692a?w=400",
  "Verre Vin Rouge": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
  "Verre Vin Blanc": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
  "Verre de Cognac": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Brandy": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Whisky": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Shot de Tequila": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Cocktail Citron-Myrtille": "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=400",
  "Verre de Vodka": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Rhum": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Tequila Citron": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Gin": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  "Verre de Gin Fizz Citron": "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=400",
  "Bouteille de Cidre": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
  "Bouteille de Champagne": "https://images.unsplash.com/photo-1596464522923-018600d8692a?w=400",
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
  const [dirSearch, setDirSearch] = useState('');

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
    if (savedUser) {
        setUser(savedUser);
        setView('app');
    }
    const savedCart = localStorage.getItem('hh_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('hh_cart', JSON.stringify(cart));
  }, [cart]);

  const compressImage = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
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
        playSound('success');
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
          notify("📸 CAPTURE DÉTECTÉE", "L'image collée a été ajoutée.", "success");
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentTab, forms]);

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
        
        if(action === 'sendFactures') {
          setCart([]);
          setForms(prev => ({...prev, invoiceNum: ''}));
        } else if (action === 'sendProduction') {
          setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]}));
        } else if (action === 'sendEntreprise') {
          setForms(prev => ({...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] }}));
        } else if (action === 'sendPartnerOrder') {
          setForms(prev => ({...prev, partner: { ...prev.partner, num: '' }}));
        } else if (action === 'sendExpense') {
          setForms(prev => ({...prev, expense: { ...prev.expense, amount: '', file: null }}));
        } else if (action === 'sendSupport') {
          setForms(prev => ({...prev, support: { ...prev.support, msg: '' }}));
        }
        loadData(); 
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const logout = () => {
    localStorage.removeItem('hh_user');
    setView('login');
  };

  if (loading && !data) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000'}}>
        <div style={{textAlign:'center'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="80" style={{marginBottom:20, opacity:0.5}} />
            <div className="perf-bar" style={{width:200}}><div className="perf-fill" style={{width:'50%', animation:'pulse 1.5s infinite'}}></div></div>
        </div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 16px; --glass: rgba(24, 26, 32, 0.7); }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brd); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; z-index: 100; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25); transform: translateX(5px); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.07); color: #fff; }
        
        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; background: radial-gradient(circle at 0% 0%, #1a1c23 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 18px; }
        
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 20px; cursor: pointer; transition: 0.4s; text-align: center; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--p); transform: translateY(-5px); }
        .card.sel { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .card-qty { position: absolute; top: 10px; right: 10px; background: var(--p); color: #fff; width: 24px; height: 24px; border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: 900; border: 2px solid var(--panel); }

        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { width: 100%; max-width: 550px; background: var(--glass); backdrop-filter: blur(20px); padding: 40px; border-radius: 32px; border: 1px solid var(--brd); box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
        
        .inp { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; transition: 0.2s; }
        .inp:focus { outline: none; border-color: var(--p); }
        
        .btn-p { background: var(--p); color: #fff; border:none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        
        .cart { width: 340px; border-left: 1px solid var(--brd); background: #000; display: flex; flex-direction: column; }
        .qty-inp { width: 55px; background: #0b0d11; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 8px; font-weight: 800; padding: 6px 0; font-size: 1rem; }
        
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 10px; scrollbar-width: none; }
        .chip { padding: 10px 20px; border-radius: 30px; background: var(--panel); border: 1px solid var(--brd); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 800; font-size: 0.8rem; transition: 0.3s; }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); }

        .perf-bar { height: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s; }

        .salary-badge { background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 8px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 900; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 15px; border: 1px solid rgba(16, 185, 129, 0.2); animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        
        .toolbar { display: flex; gap: 10px; margin-bottom: 15px; justify-content: center; }
        .tool-btn { background: #1a1a1a; border: 1px solid var(--brd); color: #fff; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: 0.2s; }
        .tool-btn:hover { border-color: var(--p); color: var(--p); background: #222; }
        
        .emp-badge { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 16px; border: 1px solid var(--brd); margin-bottom: 10px; }
        .emp-name { font-weight: 900; color: #fff; font-size: 0.9rem; margin-bottom: 2px; }
        .emp-role { font-weight: 700; color: var(--p); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .dropzone { border: 2px dashed var(--brd); border-radius: 15px; padding: 25px; text-align: center; transition: 0.3s; cursor: pointer; background: rgba(0,0,0,0.2); margin-bottom: 20px; }
        .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .dz-preview { width: 100%; max-height: 150px; object-fit: contain; margin-top: 15px; border-radius: 8px; border: 2px solid #fff; }

        /* NOUVEAUX STYLES ANNUAIRE & PROFIL */
        .dir-card { background: var(--panel); border: 1px solid var(--brd); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; }
        .dir-card:hover { border-color: var(--p); transform: translateY(-3px); }
        .dir-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(45deg, var(--p), #ffb74d); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900; color: #fff; margin-bottom: 15px; box-shadow: 0 10px 20px rgba(255,152,0,0.2); }
        .dir-call { margin-top: 15px; padding: 10px 20px; background: rgba(255,255,255,0.05); border-radius: 12px; color: var(--txt); text-decoration: none; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .dir-call:hover { background: var(--p); color: #fff; }

        .stat-box { background: rgba(0,0,0,0.3); border: 1px solid var(--brd); padding: 20px; border-radius: 20px; text-align: center; }
        .stat-val { font-size: 1.8rem; font-weight: 950; color: #fff; margin-bottom: 5px; }
        .stat-lbl { font-size: 0.65rem; color: var(--muted); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35}} />
            <h1 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:10}}>Authentification</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Interface Agent Hen House</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Sélectionner votre profil...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>OUVRIR LA SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:45}}><img src="https://i.goopics.net/dskmxi.png" height="55" /></div>
            <div style={{flex:1, overflowY:'auto', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{paddingTop: '20px', borderTop: '1px solid var(--brd)'}}>
              <div className="toolbar">
                <button className="tool-btn" title="Rafraîchir" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" title="Son" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              <div className="emp-badge">
                <div className="emp-name">{user}</div>
                <div className="emp-role">{myProfile?.role || 'Agent'}</div>
              </div>
              <button className="nav-l" onClick={logout} style={{color:'#ef4444', justifyContent: 'center', background:'rgba(239, 68, 68, 0.05)', marginTop: '5px'}}>🚪 DÉCONNEXION</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {currentTab === 'home' && (
                <div className="fade-in">
                   <div style={{marginBottom:45}}>
                       <h1 style={{fontSize: '2.8rem', fontWeight: 900, marginBottom: 12, letterSpacing:'-1px'}}>Ravi de vous revoir, {user.split(' ')[0]} 👋</h1>
                       <div style={{display:'flex', alignItems:'center', gap:10}}>
                           <span style={{padding:'4px 12px', background:'var(--p)', borderRadius:20, fontSize:'0.7rem', fontWeight:900, color:'#fff'}}>EN LIGNE</span>
                           <p style={{color: 'var(--muted)', fontSize: '1.05rem'}}>Performances Hen House en temps réel.</p>
                       </div>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 45}}>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #2a1b0a 100%)', border:'1px solid rgba(255,152,0,0.2)'}}>
                         <div style={{fontSize: '3.5rem'}}>💰</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>CHIFFRE D'AFFAIRES</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: 'var(--p)'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #0d2e21 100%)', border:'1px solid rgba(16,185,129,0.2)'}}>
                         <div style={{fontSize: '3.5rem'}}>📦</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>PRODUCTION TOTAL</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: '#10b981'}}>{myProfile?.stock.toLocaleString()} <span style={{fontSize:'1rem', opacity:0.6}}>u.</span></div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #1e1b4b 100%)', border:'1px solid rgba(99,102,241,0.2)'}}>
                         <div style={{fontSize: '3.5rem'}}>💶</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>SALAIRE ESTIMÉ</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: '#6366f1'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                   </div>

                   <div style={{background:'rgba(255,255,255,0.02)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: '#fff', fontSize: '1.1rem', display:'flex', alignItems:'center', gap:10}}>
                            <span style={{width:4, height:20, background:'var(--p)', borderRadius:10}}></span> SERVICES HEN HOUSE
                        </h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:15}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25, background:'var(--bg)'}}>
                                <span style={{fontSize:'2.8rem', display:'block', marginBottom:12}}>{m.e}</span>
                                <div style={{fontSize:'0.9rem', fontWeight:800}}>{m.l}</div>
                            </div>
                        ))}
                        </div>
                   </div>
                </div>
              )}

              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', flexWrap:'wrap', gap:15, marginBottom:30, alignItems:'center'}}>
                    <div style={{position:'relative', flex:1, minWidth:250}}>
                        <span style={{position:'absolute', left:15, top:13, opacity:0.4}}>🔍</span>
                        <input className="inp" placeholder="Rechercher..." style={{marginBottom:0, paddingLeft:45}} onChange={e=>setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tout le menu</div>
                    {Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace('_', ' ')}</div>
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
                            <div style={{height:120, borderRadius:15, overflow:'hidden', background:'#000', marginBottom:12, position:'relative'}}>
                            {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', background:'#111', color:'var(--p)', fontWeight:900}}>{p.charAt(0)}</div>}
                            </div>
                            <div style={{fontWeight:800, fontSize:'0.75rem', height:35, overflow:'hidden', color:'#fff'}}>{p}</div>
                            <div style={{color:'var(--p)', fontWeight:950, fontSize:'1.1rem', marginTop:8}}>${data.prices[p]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AUTRES MODULES STANDARDS */}
              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>📦 PRODUCTION</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Mise en stock cuisine</p>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', margin:'10px 0 25px', padding:15}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ LIGNE</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER</button>
                      </div>
                    )}

                    {currentTab === 'enterprise' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🏢 COMMANDE PRO</h2>
                        <input className="inp" placeholder="Nom Entreprise" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                        {forms.enterprise.items.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.enterprise.name || forms.enterprise.items.some(s => !s.product)} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER</button>
                      </div>
                    )}

                    {currentTab === 'partners' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🤝 PARTENAIRES</h2>
                        <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <div style={{display:'flex', gap:12, marginBottom:12}}>
                          <select className="inp" style={{flex:1, marginBottom:0}} value={forms.partner.company} onChange={e=>{
                             const c = e.target.value;
                             setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                          }}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                          <select className="inp" style={{flex:1, marginBottom:0}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                        </div>
                        {forms.partner.items.map((item, idx) => (
                           <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                             <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }}>{data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}</select>
                             <input type="number" className="qty-inp" style={{height:52, width:70}} value={item.qty} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }} />
                           </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.partner.num} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER</button>
                      </div>
                    )}

                    {currentTab === 'expenses' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>💳 FRAIS</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:Math.round(e.target.value)}})} />
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => document.getElementById('inpFile').click()}>
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {forms.expense.file ? (
                             <div><div style={{color:'var(--p)', fontWeight:900}}>✅ PHOTO CHARGÉE</div><img src={forms.expense.file} className="dz-preview" /></div>
                           ) : (
                             <div><div style={{fontSize:'2rem'}}>📸</div><div style={{fontWeight:800}}>PHOTO DU REÇU</div></div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>ENVOYER</button>
                      </div>
                    )}

                    {currentTab === 'garage' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🚗 GARAGE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                        <div style={{background:'rgba(0,0,0,0.2)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--brd)'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                            <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        </div>
                        <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER</button>
                      </div>
                    )}

                    {currentTab === 'support' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🆘 SUPPORT</h2>
                        <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Message..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>ENVOYER</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AMÉLIORATION : PROFIL */}
              {currentTab === 'profile' && myProfile && (
                <div className="fade-in" style={{maxWidth:900, margin:'0 auto'}}>
                    <div style={{background:'var(--panel)', border:'1px solid var(--brd)', borderRadius:30, padding:50, position:'relative', overflow:'hidden', marginBottom:30}}>
                        <div style={{position:'absolute', top:0, right:0, width:300, height:300, background:'radial-gradient(circle, rgba(255,152,0,0.05) 0%, transparent 70%)', pointerEvents:'none'}}></div>
                        
                        <div style={{display:'flex', alignItems:'center', gap:40, marginBottom:50}}>
                            <div className="dir-avatar" style={{width:160, height:160, fontSize:'4.5rem', marginBottom:0}}>{user.charAt(0)}</div>
                            <div>
                                <h1 style={{fontSize:'3.5rem', fontWeight:950, marginBottom:5}}>{user}</h1>
                                <div style={{display:'flex', gap:10, alignItems:'center'}}>
                                    <span style={{padding:'6px 15px', background:'rgba(255,152,0,0.1)', color:'var(--p)', borderRadius:30, fontSize:'0.8rem', fontWeight:900, textTransform:'uppercase'}}>{myProfile.role}</span>
                                    <span style={{color:'var(--muted)', fontSize:'0.9rem', fontWeight:600}}>Agent depuis {myProfile.seniority || 0} jours</span>
                                </div>
                            </div>
                        </div>

                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20}}>
                            <div className="stat-box">
                                <div className="stat-val">${Math.round(myProfile.ca || 0).toLocaleString()}</div>
                                <div className="stat-lbl">Chiffre d'Affaires</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-val">{myProfile.stock || 0}</div>
                                <div className="stat-lbl">Unités Produites</div>
                            </div>
                            <div className="stat-box" style={{borderColor:'var(--p)', background:'rgba(255,152,0,0.05)'}}>
                                <div className="stat-val" style={{color:'var(--p)'}}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                                <div className="stat-lbl">Salaire Actuel</div>
                            </div>
                        </div>
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30}}>
                        <div className="card" style={{textAlign:'left', padding:30}}>
                            <h3 style={{fontSize:'1.1rem', fontWeight:900, marginBottom:20, display:'flex', alignItems:'center', gap:10}}>📌 Informations de contact</h3>
                            <div style={{display:'flex', flexDirection:'column', gap:15}}>
                                <div><div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800}}>TÉLÉPHONE</div><div style={{fontWeight:700}}>{myProfile.phone}</div></div>
                                <div><div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800}}>IDENTIFIANT</div><div style={{fontWeight:700}}>HH-{myProfile.id || 'XXXX'}</div></div>
                            </div>
                        </div>
                        <div className="card" style={{textAlign:'left', padding:30}}>
                            <h3 style={{fontSize:'1.1rem', fontWeight:900, marginBottom:20}}>🛡️ Sécurité de session</h3>
                            <p style={{fontSize:'0.85rem', color:'var(--muted)', marginBottom:20}}>Votre session est active. Pensez à vous déconnecter en fin de service.</p>
                            <button className="btn-p" style={{background:'rgba(239, 68, 68, 0.1)', color:'#ef4444'}} onClick={logout}>DÉCONNEXION IMMÉDIATE</button>
                        </div>
                    </div>
                </div>
              )}

              {/* AMÉLIORATION : ANNUAIRE */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40}}>
                        <div>
                            <h2 style={{fontSize:'2.5rem', fontWeight:950}}>Annuaire</h2>
                            <p style={{color:'var(--muted)', fontWeight:600}}>{data.employeesFull.length} collaborateurs actifs chez Hen House</p>
                        </div>
                        <div style={{width:400}}>
                            <input className="inp" placeholder="Rechercher un collègue..." value={dirSearch} onChange={e=>setDirSearch(e.target.value)} style={{marginBottom:0}} />
                        </div>
                    </div>

                    <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))'}}>
                    {data.employeesFull.filter(e => e.name.toLowerCase().includes(dirSearch.toLowerCase()) || e.role.toLowerCase().includes(dirSearch.toLowerCase())).map(e => (
                        <div key={e.id} className="dir-card">
                            <div className="dir-avatar">{e.name.charAt(0)}</div>
                            <div style={{fontSize:'1.2rem', fontWeight:900, color:'#fff'}}>{e.name}</div>
                            <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:800, textTransform:'uppercase', marginTop:4}}>{e.role}</div>
                            <a href={`tel:${e.phone}`} className="dir-call"><span>📞</span> {e.phone}</a>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="card" style={{padding:35, textAlign:'left'}}>
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
                  <div className="card" style={{padding:35, textAlign:'left'}}>
                    <h2 style={{marginBottom:30, fontWeight:950}}>📦 TOP PRODUCTION</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b>{e.stock.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16,185,129,0.1)'}}><div className="perf-fill" style={{background:'#10b981', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* PANIER */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:30, borderBottom:'1px solid var(--brd)'}}>
                  <h2 style={{fontSize:'1.2rem', fontWeight:950}}>🛒 PANIER</h2>
              </div>
              <div style={{padding:20}}>
                  <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.3rem', letterSpacing:2}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.9rem'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.8rem'}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background:'#0a0a0a', borderTop:'1px solid var(--brd)'}}>
                {total > 0 && (
                  <div style={{textAlign:'center'}}><div className="salary-badge">💸 Gain Salaire : <b>+${salaryGain}</b></div></div>
                )}
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
                    <span style={{fontWeight:900, color:'var(--muted)'}}>TOTAL</span>
                    <b style={{fontSize:'2.5rem', color:'var(--p)', fontWeight:950}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" style={{height:60}} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "ENVOI..." : "VALIDER VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 950 }}>{toast.t}</div>
          <div style={{ fontSize: '0.95rem' }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
