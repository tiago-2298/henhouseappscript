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

  // --- PERSISTANCE ---
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

  // --- LOGIQUE COMPRESSION IMAGE ---
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

  // --- GESTION DU CTRL+V (PASTE) ---
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

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  
  // NOUVEAU : CALCUL DU GAIN SALAIRE (45%)
  const salaryGain = useMemo(() => (total * 0.45), [total]);

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
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25); transform: translateX(5px); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.07); color: #fff; }
        
        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; background: radial-gradient(circle at 0% 0%, #1a1c23 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 18px; }
        
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 20px; cursor: pointer; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); text-align: center; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
        .card.sel { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .card-qty { position: absolute; top: 10px; right: 10px; background: var(--p); color: #fff; width: 24px; height: 24px; border-radius: 50%; font-size: 0.7rem; display: flex; alignItems: center; justifyContent: center; font-weight: 900; border: 2px solid var(--panel); }

        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { width: 100%; max-width: 550px; background: var(--glass); backdrop-filter: blur(20px); padding: 40px; border-radius: 32px; border: 1px solid var(--brd); box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
        
        .inp { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; transition: 0.2s; }
        .inp:focus { outline: none; border-color: var(--p); box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1); }
        
        .btn-p { background: var(--p); color: #fff; border:none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; letter-spacing: 0.5px; }
        .btn-p:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255, 152, 0, 0.3); }
        .btn-p:active { transform: scale(0.98); }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        
        .cart { width: 340px; border-left: 1px solid var(--brd); background: #000; display: flex; flex-direction: column; }
        .qty-inp { width: 55px; background: #0b0d11; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 8px; font-weight: 800; padding: 6px 0; font-size: 1rem; }
        
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 10px; scrollbar-width: none; }
        .chip { padding: 10px 20px; border-radius: 30px; background: var(--panel); border: 1px solid var(--brd); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 800; font-size: 0.8rem; transition: 0.3s; }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 5px 15px rgba(255, 152, 0, 0.2); }

        .perf-bar { height: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s cubic-bezier(0.17, 0.67, 0.83, 0.67); }

        @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .salary-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35}} />
            <h1 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:10}}>Authentification</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Connectez-vous à votre interface agent</p>
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
            
            <div style={{padding: '20px 0', borderTop: '1px solid var(--brd)'}}>
              <div className="tool-bar">
                <button className="icon-tool" title="Reload" onClick={() => window.location.reload()}>🔃</button>
                <button className="icon-tool" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="icon-tool" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              <div style={{background: 'rgba(255,152,0,0.05)', border:'1px solid rgba(255,152,0,0.1)', padding: 14, borderRadius: 16, marginBottom: 12}}>
                <div style={{fontSize: '0.85rem', fontWeight: 900, color: '#fff'}}>{user}</div>
                <div style={{fontSize: '0.65rem', color: 'var(--p)', fontWeight: 800, textTransform: 'uppercase', marginTop:2}}>ID #00{myProfile?.id || '...'} • {myProfile?.role || 'Agent'}</div>
              </div>
              <button className="nav-l" onClick={logout} style={{color:'#ef4444', justifyContent: 'center', background:'rgba(239, 68, 68, 0.05)'}}>🚪 DÉCONNEXION</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              
              {/* TABLEAU DE BORD */}
              {currentTab === 'home' && (
                <div className="fade-in">
                   <div style={{marginBottom:45}}>
                       <h1 style={{fontSize: '2.8rem', fontWeight: 900, marginBottom: 12, letterSpacing:'-1px'}}>Ravi de vous revoir, {user.split(' ')[0]} 👋</h1>
                       <div style={{display:'flex', alignItems:'center', gap:10}}>
                           <span style={{padding:'4px 12px', background:'var(--p)', borderRadius:20, fontSize:'0.7rem', fontWeight:900, color:'#fff'}}>EN LIGNE</span>
                           <p style={{color: 'var(--muted)', fontSize: '1.05rem'}}>Voici un aperçu de vos performances actuelles chez Hen House.</p>
                       </div>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 45}}>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #2a1b0a 100%)', border:'1px solid rgba(255,152,0,0.2)'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'}}>💰</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>CHIFFRE D'AFFAIRES</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: 'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #0d2e21 100%)', border:'1px solid rgba(16,185,129,0.2)'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'}}>📦</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>PRODUCTION TOTAL</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: '#10b981'}}>{myProfile?.stock.toLocaleString()} <span style={{fontSize:'1rem', opacity:0.6}}>u.</span></div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #1e1b4b 100%)', border:'1px solid rgba(99,102,241,0.2)'}}>
                         <div style={{fontSize: '3.5rem', filter:'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'}}>💶</div>
                         <div>
                            <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1, marginBottom:5}}>SALAIRE ESTIMÉ</div>
                            <div style={{fontSize: '2.4rem', fontWeight: 950, color: '#6366f1'}}>${myProfile?.salary.toLocaleString()}</div>
                         </div>
                      </div>
                   </div>

                   <div style={{background:'rgba(255,255,255,0.02)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: '#fff', fontSize: '1.1rem', display:'flex', alignItems:'center', gap:10}}>
                            <span style={{width:4, height:20, background:'var(--p)', borderRadius:10}}></span> ACCÈS RAPIDE AUX SERVICES
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

              {/* CAISSE */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', flexWrap:'wrap', gap:15, marginBottom:30, alignItems:'center'}}>
                    <div style={{position:'relative', flex:1, minWidth:250}}>
                        <span style={{position:'absolute', left:15, top:13, opacity:0.4}}>🔍</span>
                        <input className="inp" placeholder="Rechercher un plat ou une boisson..." style={{marginBottom:0, paddingLeft:45}} onChange={e=>setSearch(e.target.value)} />
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
                            <div style={{position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.8))', height:40}}></div>
                            </div>
                            <div style={{fontWeight:800, fontSize:'0.75rem', height:35, overflow:'hidden', color:'#fff'}}>{p}</div>
                            <div style={{color:'var(--p)', fontWeight:950, fontSize:'1.1rem', marginTop:8}}>${data.prices[p]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODULES CENTRÉS */}
              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'profile', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>📦 PRODUCTION CUISINE</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Déclarez les plats préparés pour mise en stock</p>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:12, marginBottom:12, animation:'fadeIn 0.3s ease'}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Sélectionner un produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                            {forms.stock.length > 1 && <button onClick={()=>{const n=[...forms.stock]; n.splice(i,1); setForms({...forms, stock:n});}} style={{background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', borderRadius:10, padding:'0 15px', fontWeight:900}}>×</button>}
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', margin:'10px 0 25px', padding:15, background:'transparent'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER UNE LIGNE</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>
                            {sending ? 'ENVOI EN COURS...' : 'VALIDER LA PRODUCTION'}
                        </button>
                      </div>
                    )}

                    {currentTab === 'enterprise' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🏢 COMMANDE PRO</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Facturation groupée pour entreprises</p>
                        <input className="inp" placeholder="🏢 Nom de l'entreprise client" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
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
                        <button className="btn-p" style={{marginTop:20}} disabled={sending || !forms.enterprise.name || forms.enterprise.items.some(s => !s.product)} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER LE BON DE COMMANDE</button>
                      </div>
                    )}

                    {currentTab === 'partners' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🤝 CONTRATS PARTENAIRES</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Validation des menus pour entreprises sous contrat</p>
                        <input className="inp" placeholder="🧾 N° Facture (Obligatoire)" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <div style={{display:'flex', gap:12, marginBottom:12}}>
                          <select className="inp" style={{flex:1, marginBottom:0}} value={forms.partner.company} onChange={e=>{
                             const c = e.target.value;
                             setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                          }}>
                            {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                          <select className="inp" style={{flex:1, marginBottom:0}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                            {data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        {forms.partner.items.map((item, idx) => (
                           <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                             <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }}>
                               {data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}
                             </select>
                             <input type="number" className="qty-inp" style={{height:52, width:70}} value={item.qty} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }} />
                           </div>
                        ))}
                        <button className="btn-p" style={{marginTop:15}} disabled={sending || !forms.partner.num} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LE MENU PARTENAIRE</button>
                      </div>
                    )}

                    {currentTab === 'expenses' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>💳 NOTES DE FRAIS</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Remboursement essence et réparations</p>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}><option>Essence</option><option>Réparation</option></select>
                        <input className="inp" type="number" placeholder="Montant exact ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        
                        <div 
                           className={`dropzone ${dragActive ? 'active' : ''}`}
                           onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                           onDragLeave={() => setDragActive(false)}
                           onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }}
                           onClick={() => document.getElementById('inpFile').click()}
                        >
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {forms.expense.file ? (
                             <div>
                               <div style={{color:'var(--p)', fontWeight:900, fontSize:'0.75rem', marginBottom:10}}>PREUVE ENREGISTRÉE ✅</div>
                               <img src={forms.expense.file} className="dz-preview" style={{border:'4px solid #fff', borderRadius:4, transform:'rotate(-1deg)', boxShadow:'0 10px 20px rgba(0,0,0,0.3)'}} />
                             </div>
                           ) : (
                             <div>
                               <div style={{fontSize:'2.5rem', marginBottom:10}}>📸</div>
                               <div style={{fontWeight:900, fontSize:'0.9rem'}}>DÉPOSEZ OU COLLEZ LA PREUVE</div>
                               <div style={{fontSize:'0.7rem', opacity:0.5, marginTop:5}}>Formats supportés : JPG, PNG (Auto-compressé)</div>
                             </div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>DÉPOSER LA DEMANDE</button>
                      </div>
                    )}

                    {currentTab === 'garage' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🚗 GESTION GARAGE</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Suivi de l'état de la flotte Hen House</p>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                        
                        <div style={{background:'rgba(0,0,0,0.2)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--brd)'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}>
                                <span>⛽ NIVEAU D'ESSENCE</span>
                                <span style={{color:'var(--p)', fontSize:'1.2rem'}}>{forms.garage.fuel}%</span>
                            </div>
                            <input type="range" style={{width:'100%', accentColor:'var(--p)', height:8, borderRadius:5}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                            <div style={{display:'flex', justifyContent:'space-between', marginTop:10, fontSize:'0.65rem', fontWeight:800, opacity:0.4}}><span>VIDE</span><span>RÉSERVOIR PLEIN</span></div>
                        </div>
                        
                        <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER L'ÉTAT DU VÉHICULE</button>
                      </div>
                    )}

                    {currentTab === 'profile' && myProfile && (
                      <div className="fade-in center-box" style={{width:'100%'}}>
                        <div className="form-ui" style={{maxWidth: 600, padding: 50, position:'relative', overflow:'hidden'}}>
                          <div style={{position:'absolute', top:-50, right:-50, fontSize:'15rem', opacity:0.03, fontWeight:900, pointerEvents:'none'}}>{user.charAt(0)}</div>
                          <div style={{textAlign:'center', marginBottom: 40, position:'relative'}}>
                            <div style={{width:140, height:140, borderRadius:45, background:'linear-gradient(45deg, var(--p), #ffb74d)', margin:'0 auto 25px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4.5rem', fontWeight:950, color:'#fff', boxShadow:'0 15px 40px rgba(255,152,0,0.3)'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.6rem', fontWeight:950, letterSpacing:'-1px'}}>{user}</h1>
                            <div style={{display:'inline-block', padding:'6px 20px', background:'rgba(255,152,0,0.1)', color:'var(--p)', borderRadius:30, fontWeight:900, fontSize:'0.8rem', marginTop:10}}>{myProfile.role}</div>
                          </div>

                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom: 20}}>
                              <div className="card" style={{background: 'rgba(255,255,255,0.03)', border:'1px solid var(--brd)'}}>
                                <p style={{fontSize:'0.75rem', color:'var(--muted)', fontWeight:800, marginBottom:5}}>C.A PERSONNEL</p>
                                <p style={{fontSize: '1.6rem', fontWeight: 950, color:'#fff'}}>${myProfile.ca.toLocaleString()}</p>
                              </div>
                              <div className="card" style={{background: 'rgba(255,255,255,0.03)', border:'1px solid var(--brd)'}}>
                                <p style={{fontSize:'0.75rem', color:'var(--muted)', fontWeight:800, marginBottom:5}}>UNITÉS PRODUITES</p>
                                <p style={{fontSize: '1.6rem', fontWeight: 950, color:'#fff'}}>{myProfile.stock.toLocaleString()}</p>
                              </div>
                          </div>

                          <div className="card" style={{background: 'linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(24,26,32,1) 100%)', border: '1px solid var(--p)', marginBottom: 25, padding:25}}>
                              <p style={{fontSize:'0.8rem', color:'var(--p)', fontWeight: 900, marginBottom:8}}>💵 RÉMUNÉRATION ESTIMÉE</p>
                              <p style={{fontSize: '2.4rem', fontWeight: 950}}>${myProfile.salary?.toLocaleString() || 0}</p>
                              <div style={{height:4, background:'rgba(255,152,0,0.2)', borderRadius:10, margin:'15px 0'}}>
                                  <div style={{width:'70%', height:'100%', background:'var(--p)', borderRadius:10}}></div>
                              </div>
                              <p style={{fontSize: '0.7rem', opacity: 0.6}}>Basé sur le barème contractuel de production et vente</p>
                          </div>

                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                                <div style={{padding:15, background:'rgba(0,0,0,0.2)', borderRadius:18, border:'1px solid var(--brd)'}}>
                                    <p style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight:800}}>ANCIENNETÉ</p>
                                    <p style={{fontWeight:900, fontSize:'1.1rem'}}>{myProfile.seniority} <span style={{fontSize:'0.8rem', opacity:0.5}}>jours</span></p>
                                </div>
                                <div style={{padding:15, background:'rgba(0,0,0,0.2)', borderRadius:18, border:'1px solid var(--brd)'}}>
                                    <p style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight:800}}>CONTACT</p>
                                    <p style={{fontWeight:900, fontSize:'1.1rem'}}>{myProfile.phone}</p>
                                </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentTab === 'support' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900}}>🆘 CENTRE D'ASSISTANCE</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.85rem', marginBottom:30}}>Contact direct avec la direction pour tout problème urgent</p>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock / Inventaire</option>
                          <option>Erreur Facturation</option>
                          <option>Demande d'absence / Congés</option>
                          <option>Autre demande urgente</option>
                        </select>
                        <textarea className="inp" style={{height:200, resize:'none', paddingTop:15}} placeholder="Décrivez votre demande avec le plus de détails possible..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" style={{marginTop:15}} disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>OUVRIR LE TICKET</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30, maxWidth:1200, margin:'0 auto'}}>
                  <div className="card" style={{padding:35, textAlign:'left', background:'rgba(24,26,32,0.5)'}}>
                    <h2 style={{marginBottom:30, fontWeight:950, fontSize:'1.4rem', display:'flex', alignItems:'center', gap:12}}>
                        <span style={{fontSize:'1.8rem'}}>🥇</span> TOP 10 CHIFFRE D'AFFAIRES
                    </h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20, position:'relative'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8, position:'relative', zIndex:2}}>
                           <span style={{fontWeight:800}}>{i === 0 ? '👑' : (i+1)+'.'} {e.name}</span>
                           <b style={{color: i===0 ? 'var(--p)' : '#fff', fontSize:'1.1rem'}}>${e.ca.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar" style={{height:6}}><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%', borderRadius:10}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:35, textAlign:'left', background:'rgba(24,26,32,0.5)'}}>
                    <h2 style={{marginBottom:30, fontWeight:950, fontSize:'1.4rem', display:'flex', alignItems:'center', gap:12}}>
                        <span style={{fontSize:'1.8rem'}}>👨‍🍳</span> TOP 10 PRODUCTION
                    </h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.95rem', marginBottom:8}}>
                           <span style={{fontWeight:800}}>{i === 0 ? '🔥' : (i+1)+'.'} {e.name}</span>
                           <b style={{color: i===0 ? '#10b981' : '#fff', fontSize:'1.1rem'}}>{e.stock.toLocaleString()} <span style={{fontSize:'0.7rem', opacity:0.5}}>u.</span></b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16, 185, 129, 0.1)', height:6}}><div className="perf-fill" style={{background:'#10b981', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%', borderRadius:10}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANNUAIRE */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <div style={{marginBottom:30}}>
                        <h2 style={{fontSize:'1.8rem', fontWeight:950}}>Annuaire du personnel</h2>
                        <p style={{color:'var(--muted)'}}>{data.employeesFull.length} agents répertoriés</p>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="card" style={{padding:25, textAlign:'left', display:'flex', gap:20, alignItems:'center', background:'rgba(255,255,255,0.02)'}}>
                        <div style={{width:65, height:65, borderRadius:20, background:'var(--panel)', border:'1px solid var(--brd)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:950, color:'var(--p)'}}>{e.name.charAt(0)}</div>
                        <div style={{flex:1}}>
                            <div style={{fontWeight:900, fontSize:'1.1rem', color:'#fff'}}>{e.name}</div>
                            <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:800, textTransform:'uppercase', marginTop:2}}>{e.role}</div>
                            <a href={`tel:${e.phone}`} style={{fontSize:'0.9rem', marginTop:10, color:'var(--muted)', display:'block', textDecoration:'none', fontWeight:700}}>📞 {e.phone}</a>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              )}
            </div>
          </main>

          {/* PANIER AVEC INDICATEUR DE SALAIRE */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:30, borderBottom:'1px solid var(--brd)'}}>
                  <h2 style={{fontSize:'1.2rem', fontWeight:950, display:'flex', alignItems:'center', gap:10}}>
                    <span style={{fontSize:'1.5rem'}}>🛒</span> VOTRE PANIER
                  </h2>
              </div>
              <div style={{padding:20, background:'rgba(255,152,0,0.03)'}}>
                  <input className="inp" placeholder="N° FACTURE OBLIGATOIRE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.3rem', letterSpacing:2, marginBottom:0, borderStyle:'dashed', borderWidth:2}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'10px 20px'}}>
                {cart.length === 0 ? (
                    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:0.2}}>
                        <span style={{fontSize:'4rem'}}>🛍️</span>
                        <p style={{fontWeight:900, marginTop:10}}>PANIER VIDE</p>
                    </div>
                ) : cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'18px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center', animation:'fadeIn 0.3s ease'}}>
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.9rem', color:'#fff'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.85rem', fontWeight:900}}>${i.pu} <span style={{color:'var(--muted)', fontWeight:500, fontSize:'0.7rem'}}>par unité</span></div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.03)', padding:6, borderRadius:12}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:30, height:30, borderRadius:8, cursor:'pointer', fontWeight:900}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} style={{border:'none', background:'transparent'}} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:30, height:30, borderRadius:8, cursor:'pointer', fontWeight:900}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background:'#0a0a0a', borderTop:'1px solid var(--brd)', boxShadow:'0 -10px 30px rgba(0,0,0,0.5)'}}>
                
                {/* NOUVEL INDICATEUR DE SALAIRE */}
                {total > 0 && (
                  <div style={{textAlign:'center'}}>
                    <div className="salary-badge">
                      <span>💸</span> Cette vente va ajouter <b>${salaryGain.toFixed(2)}</b> à votre salaire
                    </div>
                  </div>
                )}

                <div style={{display:'flex', justifyContent:'space-between', marginBottom:25, alignItems:'flex-end'}}>
                    <span style={{fontWeight:900, fontSize:'0.8rem', color:'var(--muted)', letterSpacing:1}}>TOTAL À PAYER</span>
                    <b style={{fontSize:'2.8rem', color:'var(--p)', fontWeight:950, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" style={{height:65, fontSize:'1.1rem'}} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "TRANSMISSION..." : "VALIDER LA VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 950, letterSpacing: '1px', marginBottom: '5px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.95 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
