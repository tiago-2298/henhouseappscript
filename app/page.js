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
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 20px; --glass: rgba(24, 26, 32, 0.7); }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brd); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 280px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; z-index: 100; }
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 16px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25); transform: translateX(5px); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.07); color: #fff; }
        
        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; background: radial-gradient(circle at 0% 0%, #1a1c23 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 18px; }
        
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 20px; border-radius: 24px; cursor: pointer; transition: 0.4s; text-align: center; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .card.sel { border-color: var(--p); background: rgba(255,152,0,0.05); }

        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { width: 100%; max-width: 600px; background: var(--glass); backdrop-filter: blur(24px); padding: 40px; border-radius: 32px; border: 1px solid var(--brd); box-shadow: 0 25px 60px rgba(0,0,0,0.5); }
        
        .inp { width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; transition: 0.2s; }
        .inp:focus { outline: none; border-color: var(--p); }
        
        .btn-p { background: var(--p); color: #fff; border:none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        
        .cart { width: 340px; border-left: 1px solid var(--brd); background: #000; display: flex; flex-direction: column; }
        
        .toolbar { display: flex; gap: 10px; margin-bottom: 15px; justify-content: center; }
        .tool-btn { background: #1a1a1a; border: 1px solid var(--brd); color: #fff; width: 44px; height: 44px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.2s; }
        .tool-btn:hover { border-color: var(--p); color: var(--p); background: #222; }

        .emp-badge { background: linear-gradient(135deg, #181a20 0%, #000 100%); padding: 18px; border-radius: 20px; border: 1px solid var(--brd); margin-bottom: 10px; }
        
        /* Directory specific */
        .dir-card { text-align: left; display: flex; gap: 20px; align-items: center; background: rgba(255,255,255,0.02); }
        .dir-avatar { width: 60px; height: 60px; border-radius: 18px; background: var(--panel); border: 1px solid var(--brd); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 900; color: var(--p); flex-shrink: 0; }
        .dir-call { background: var(--p); color: #fff; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: 0.2s; }
        .dir-call:hover { transform: scale(1.1); }

        /* Profile specific */
        .profile-hero { display: flex; flex-direction: column; align-items: center; margin-bottom: 35px; }
        .profile-avatar { width: 120px; height: 120px; border-radius: 40px; background: linear-gradient(135deg, var(--p), #fb8c00); display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 950; color: #fff; box-shadow: 0 15px 35px rgba(255,152,0,0.3); margin-bottom: 20px; position: relative; }
        .profile-rank { position: absolute; bottom: -10px; background: #fff; color: #000; padding: 4px 12px; border-radius: 10px; font-size: 0.7rem; font-weight: 900; box-shadow: 0 5px 10px rgba(0,0,0,0.2); }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; width: 100%; }
        .stat-box { background: rgba(255,255,255,0.03); border: 1px solid var(--brd); padding: 20px; border-radius: 20px; text-align: left; }
        .stat-val { font-size: 1.8rem; font-weight: 900; display: block; margin-top: 5px; }
        .stat-label { font-size: 0.7rem; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        
        .toast { position: fixed; bottom: 30px; right: 30px; padding: 15px 25px; border-radius: 16px; z-index: 1000; display: flex; flex-direction: column; min-width: 250px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); animation: slideIn 0.3s ease-out; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="120" style={{marginBottom:35}} />
            <h1 style={{fontSize:'2rem', fontWeight:950, marginBottom:10}}>Bienvenue</h1>
            <p style={{color:'var(--muted)', fontSize:'0.95rem', marginBottom:35}}>Portail Sécurisé Hen House</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisissez votre compte...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>DÉMARRER LA SESSION</button>
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
                <button className="tool-btn" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
              <div className="emp-badge">
                <div style={{fontWeight:900, fontSize:'0.95rem'}}>{user}</div>
                <div style={{color: 'var(--p)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase'}}>{myProfile?.role || 'Agent'}</div>
              </div>
              <button className="nav-l" onClick={logout} style={{color:'#ef4444', justifyContent: 'center', background:'rgba(239, 68, 68, 0.05)', marginTop: '5px'}}>🚪 QUITTER</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                   <div style={{marginBottom:45}}>
                       <h1 style={{fontSize: '3rem', fontWeight: 950, marginBottom: 12}}>Salut, {user.split(' ')[0]} 🍗</h1>
                       <p style={{color: 'var(--muted)', fontSize: '1.1rem'}}>Résumé de votre activité Hen House.</p>
                   </div>
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 45}}>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #2a1b0a 100%)', border:'1px solid rgba(255,152,0,0.2)'}}>
                         <div style={{fontSize: '3.5rem'}}>💰</div>
                         <div>
                            <div style={{fontSize: '0.8rem', color:'var(--muted)', fontWeight: 800}}>C.A GLOBAL</div>
                            <div style={{fontSize: '2.5rem', fontWeight: 950, color: 'var(--p)'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, #181a20 0%, #1e1b4b 100%)', border:'1px solid rgba(99,102,241,0.2)'}}>
                         <div style={{fontSize: '3.5rem'}}>💶</div>
                         <div>
                            <div style={{fontSize: '0.8rem', color:'var(--muted)', fontWeight: 800}}>GAIN ESTIMÉ</div>
                            <div style={{fontSize: '2.5rem', fontWeight: 950, color: '#6366f1'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                   </div>
                   <div style={{background:'rgba(255,255,255,0.02)', padding:35, borderRadius:28, border:'1px solid var(--brd)'}}>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: '#fff', fontSize: '1.2rem'}}>RACCOURCIS</h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:15}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25, background:'var(--bg)'}}>
                                <span style={{fontSize:'3rem', display:'block', marginBottom:12}}>{m.e}</span>
                                <div style={{fontSize:'1rem', fontWeight:800}}>{m.l}</div>
                            </div>
                        ))}
                        </div>
                   </div>
                </div>
              )}

              {/* ANNUAIRE AMÉLIORÉ */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                  <div style={{marginBottom: 35}}>
                    <h2 style={{fontSize:'2.2rem', fontWeight:950}}>Annuaire</h2>
                    <p style={{color:'var(--muted)'}}>Contactez vos collègues Hen House</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20}}>
                    {data.employeesFull.map(e => (
                      <div key={e.id} className="card dir-card">
                        <div className="dir-avatar">{e.name.charAt(0)}</div>
                        <div style={{flex: 1}}>
                          <div style={{fontWeight: 900, fontSize: '1.1rem', color: '#fff'}}>{e.name}</div>
                          <div style={{fontSize: '0.75rem', color: 'var(--p)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12}}>{e.role}</div>
                          <div style={{display:'flex', alignItems:'center', gap: 10}}>
                             <a href={`tel:${e.phone}`} className="dir-call">📞</a>
                             <span style={{fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600}}>{e.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFIL AMÉLIORÉ */}
              {currentTab === 'profile' && myProfile && (
                <div className="fade-in center-box">
                  <div className="form-ui">
                    <div className="profile-hero">
                      <div className="profile-avatar">
                        {user.charAt(0)}
                        <div className="profile-rank">AGENT ACTIF</div>
                      </div>
                      <h1 style={{fontSize:'2.2rem', fontWeight:950, marginBottom: 5}}>{user}</h1>
                      <p style={{color:'var(--p)', fontWeight:800, fontSize:'1rem'}}>{myProfile.role}</p>
                    </div>

                    <div className="stat-grid" style={{marginBottom: 25}}>
                       <div className="stat-box">
                          <span className="stat-label">Chiffre d'Affaires</span>
                          <span className="stat-val" style={{color: 'var(--p)'}}>${Math.round(myProfile.ca).toLocaleString()}</span>
                       </div>
                       <div className="stat-box">
                          <span className="stat-label">Salaire Estimé</span>
                          <span className="stat-val" style={{color: '#6366f1'}}>${Math.round(myProfile.salary).toLocaleString()}</span>
                       </div>
                       <div className="stat-box">
                          <span className="stat-label">Unités Produites</span>
                          <span className="stat-val">{myProfile.stock.toLocaleString()}</span>
                       </div>
                       <div className="stat-box">
                          <span className="stat-label">Identifiant</span>
                          <span className="stat-val" style={{fontSize: '1.2rem', marginTop: '12px'}}>#HH-00{myProfile.id}</span>
                       </div>
                    </div>

                    <div style={{background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '24px', border: '1px solid var(--brd)'}}>
                      <div style={{display:'flex', justifyContent: 'space-between', marginBottom: 15}}>
                        <span style={{fontWeight: 800, fontSize: '0.85rem'}}>Numéro de téléphone</span>
                        <span style={{fontWeight: 900, color: 'var(--p)'}}>{myProfile.phone}</span>
                      </div>
                      <div style={{display:'flex', justifyContent: 'space-between'}}>
                        <span style={{fontWeight: 800, fontSize: '0.85rem'}}>Date d'entrée</span>
                        <span style={{fontWeight: 900}}>{myProfile.seniority} jours d'ancienneté</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUTRES MODULES */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{display:'flex', gap:15, marginBottom:30}}>
                    <div style={{position:'relative', flex:1}}>
                        <span style={{position:'absolute', left:15, top:13, opacity:0.4}}>🔍</span>
                        <input className="inp" placeholder="Rechercher..." style={{marginBottom:0, paddingLeft:45}} onChange={e=>setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
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
                            {cartItem && <div style={{position:'absolute', top:10, right:10, background:'var(--p)', color:'#fff', width:24, height:24, borderRadius:'50%', fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, border:'2px solid var(--panel)'}}>{cartItem.qty}</div>}
                            <div style={{height:120, borderRadius:15, overflow:'hidden', background:'#000', marginBottom:12}}>
                               {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'var(--p)', fontWeight:900}}>{p.charAt(0)}</div>}
                            </div>
                            <div style={{fontWeight:800, fontSize:'0.75rem', height:35, overflow:'hidden'}}>{p}</div>
                            <div style={{color:'var(--p)', fontWeight:950, fontSize:'1.1rem', marginTop:8}}>${data.prices[p]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FORMULAIRES STANDARD (STOCK, GARAGE, etc.) */}
              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900}}>📦 PRODUCTION</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Choisir...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', margin:'10px 0 25px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER</button>
                        <button className="btn-p" disabled={sending} onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER LA PRODUCTION</button>
                      </div>
                    )}
                    {currentTab === 'garage' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900}}>🚗 GARAGE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                        <div style={{background:'rgba(0,0,0,0.2)', padding:25, borderRadius:20, marginTop:10, border:'1px solid var(--brd)'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:15}}><span>⛽ ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                            <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        </div>
                        <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ACTUALISER LE VÉHICULE</button>
                      </div>
                    )}
                    {currentTab === 'expenses' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900}}>💳 FRAIS</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => document.getElementById('inpFile').click()}>
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {forms.expense.file ? (
                             <div><img src={forms.expense.file} className="dz-preview" /></div>
                           ) : (
                             <div><div style={{fontSize:'2rem'}}>📸</div><div style={{fontWeight:800}}>PHOTO / COLLEZ LE REÇU</div></div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>DÉPOSER LA DEMANDE</button>
                      </div>
                    )}
                    {currentTab === 'partners' && (
                      <div className="fade-in">
                        <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900}}>🤝 PARTENAIRES</h2>
                        <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <select className="inp" value={forms.partner.company} onChange={e=>{
                             const c = e.target.value;
                             setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                        }}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        {forms.partner.items.map((item, idx) => (
                           <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                             <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }}>{data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}</select>
                             <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }} />
                           </div>
                        ))}
                        <button className="btn-p" disabled={sending} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LE MENU</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="card" style={{padding:35, textAlign:'left'}}>
                    <h2 style={{marginBottom:30, fontWeight:950}}>🏆 CLASSEMENT C.A</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
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
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
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

          {/* CART */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:30, borderBottom:'1px solid var(--brd)'}}>
                  <h2 style={{fontSize:'1.3rem', fontWeight:950}}>VOTRE PANIER</h2>
              </div>
              <div style={{padding:20}}>
                  <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.4rem', letterSpacing:2}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'0.9rem'}}>{i.name}</div>
                        <div style={{color:'var(--p)', fontSize:'0.85rem', fontWeight:900}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <button style={{background:'var(--brd)', color:'#fff', width:30, height:30, borderRadius:8, border:'none'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <span style={{fontWeight:900, width:25, textAlign:'center'}}>{i.qty}</span>
                      <button style={{background:'var(--brd)', color:'#fff', width:30, height:30, borderRadius:8, border:'none'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background:'#0a0a0a', borderTop:'1px solid var(--brd)'}}>
                {total > 0 && (
                  <div style={{textAlign:'center'}}><div className="salary-badge">💸 GAIN : <b>+${salaryGain}</b></div></div>
                )}
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
                    <span style={{fontWeight:900, color:'var(--muted)'}}>TOTAL</span>
                    <b style={{fontSize:'2.8rem', color:'var(--p)', fontWeight:950}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" style={{height:65}} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "ENVOI..." : "VALIDER VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 950, marginBottom: '4px' }}>{toast.t}</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
