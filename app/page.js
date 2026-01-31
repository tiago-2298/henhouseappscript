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
    const savedCart = localStorage.getItem('hh_cart');
    if (savedUser) { setUser(savedUser); setView('app'); }
    if (savedCart) { setCart(JSON.parse(savedCart)); }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('hh_user', user);
    localStorage.setItem('hh_cart', JSON.stringify(cart));
  }, [user, cart]);

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
        else if (action === 'sendProduction') setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]}));
        else if (action === 'sendEntreprise') setForms(prev => ({...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] }}));
        else if (action === 'sendPartnerOrder') setForms(prev => ({...prev, partner: { ...prev.partner, num: '' }}));
        else if (action === 'sendExpense') setForms(prev => ({...prev, expense: { ...prev.expense, amount: '', file: null }}));
        else if (action === 'sendSupport') setForms(prev => ({...prev, support: { ...prev.support, msg: '' }}));
        loadData(); 
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 16px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brd); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; z-index: 100; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }
        
        .main { flex: 1; overflow-y: auto; padding: 30px; position: relative; background: radial-gradient(circle at 100% 100%, #1e1408 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
        
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 20px; cursor: pointer; transition: 0.3s; text-align: center; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--p); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.6); }
        .card.sel { border-color: var(--p); background: rgba(255,152,0,0.05); }
        
        .badge-qty { position: absolute; top: 10px; right: 10px; background: var(--p); color: #000; font-weight: 900; width: 24px; height: 24px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center; font-size: 0.75rem; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { width: 100%; max-width: 550px; background: rgba(24, 26, 32, 0.7); backdrop-filter: blur(20px); padding: 40px; border-radius: 32px; border: 1px solid var(--brd); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        .inp { width: 100%; padding: 14px; border-radius: 14px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; transition: 0.2s; }
        .inp:focus { border-color: var(--p); outline: none; box-shadow: 0 0 0 3px rgba(255,152,0,0.1); }
        
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .btn-p:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.02); }
        .btn-p:disabled { background: #2d333f; color: #4b5563; cursor: not-allowed; opacity: 0.8; }
        
        .cart { width: 340px; border-left: 1px solid var(--brd); background: #000; display: flex; flex-direction: column; transition: 0.3s; }
        .qty-inp { width: 50px; background: #181a20; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 8px; font-weight: 800; padding: 6px 0; }
        
        .chip-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 20px; scrollbar-width: none; }
        .chip { padding: 8px 18px; border-radius: 100px; background: var(--panel); border: 1px solid var(--brd); color: var(--muted); cursor: pointer; white-space: nowrap; font-weight: 700; font-size: 0.8rem; transition: 0.2s; }
        .chip.active { background: var(--p); border-color: var(--p); color: #000; }

        .stat-card { background: var(--panel); padding: 25px; border-radius: 24px; border: 1px solid var(--brd); }
        .toast { position: fixed; bottom: 30px; right: 30px; padding: 18px 30px; border-radius: 16px; z-index: 5000; box-shadow: 0 20px 50px rgba(0,0,0,0.7); animation: slideUp 0.4s ease; font-weight: 800; }
        
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .sk-wrap { display: flex; flex-direction: column; gap: 10px; padding: 40px; height: 100vh; background: #000; }
        .sk { background: #111; border-radius: 10px; animation: pulse 1.5s infinite; }
        .sk-s { height: 50px; width: 200px; } .sk-m { height: 300px; width: 100%; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', background: '#000'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35, filter: 'drop-shadow(0 0 15px rgba(255,152,0,0.3))'}} />
            <h1 style={{marginBottom:10, fontSize: '1.8rem'}}>Accès Portail</h1>
            <p style={{color:'var(--muted)', marginBottom: 30, fontSize:'0.9rem'}}>Authentifiez-vous pour accéder au Hen House</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Sélectionner votre nom...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); setView('app');}} disabled={!user}>DÉMARRER LA SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:40, marginTop: 10}}><img src="https://i.goopics.net/dskmxi.png" height="60" /></div>
            <div style={{flex:1, overflowY:'auto', paddingRight: 5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{padding: '20px 0', borderTop: '1px solid var(--brd)'}}>
              <div className="tool-bar">
                <button className="icon-tool" onClick={() => window.location.reload()}>🔃</button>
                <button className="icon-tool" onClick={() => loadData(true)}>☁️</button>
                <button className="icon-tool" onClick={() => setIsMuted(!isMuted)}>{isMuted ? '🔇' : '🔊'}</button>
              </div>

              <div style={{background: 'linear-gradient(to right, #111, #000)', padding: 15, borderRadius: 16, marginBottom: 15, border: '1px solid #222'}}>
                <div style={{fontSize: '0.85rem', fontWeight: 900, color: '#fff'}}>{user}</div>
                <div style={{fontSize: '0.65rem', color: 'var(--p)', textTransform: 'uppercase', letterSpacing:1, marginTop:3}}>{myProfile?.role || 'Employé'}</div>
              </div>
              <button className="nav-l" onClick={()=>{localStorage.clear(); window.location.reload();}} style={{color:'#ef4444', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.05)'}}>🚪 DÉCONNEXION</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {currentTab === 'home' && (
                <div>
                   <h1 style={{fontSize: '2.8rem', fontWeight: 900, marginBottom: 8}}>Salut, {user.split(' ')[0]}!</h1>
                   <p style={{color: 'var(--muted)', fontSize: '1.1rem', marginBottom: 45}}>Tableau de bord opérationnel.</p>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 50}}>
                      <div className="stat-card" style={{background: 'linear-gradient(135deg, #1a1b20 0%, #2a1b0a 100%)', borderLeft: '5px solid var(--p)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>
                               <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 10}}>Ventes totales (C.A)</div>
                               <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                            </div>
                            <div style={{fontSize: '3rem'}}>💰</div>
                         </div>
                      </div>
                      <div className="stat-card" style={{background: 'linear-gradient(135deg, #1a1b20 0%, #0d1a15 100%)', borderLeft: '5px solid #10b981'}}>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>
                               <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 10}}>Production Cuisine</div>
                               <div style={{fontSize: '2.5rem', fontWeight: 900, color: '#10b981'}}>{myProfile?.stock.toLocaleString()} <small style={{fontSize:'1rem', opacity:0.6}}>u.</small></div>
                            </div>
                            <div style={{fontSize: '3rem'}}>📦</div>
                         </div>
                      </div>
                      <div className="stat-card" style={{background: 'linear-gradient(135deg, #1a1b20 0%, #1a102a 100%)', borderLeft: '5px solid #8b5cf6'}}>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>
                               <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 10}}>Salaire Estimé</div>
                               <div style={{fontSize: '2.5rem', fontWeight: 900, color: '#a78bfa'}}>${myProfile?.salary.toLocaleString()}</div>
                            </div>
                            <div style={{fontSize: '3rem'}}>💵</div>
                         </div>
                      </div>
                   </div>

                   <h3 style={{marginBottom: 20, fontWeight: 900, fontSize: '0.9rem', color: '#555', letterSpacing: 1}}>RACCOURCIS</h3>
                   <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:20}}>
                      {MODULES.filter(m => !['home', 'profile'].includes(m.id)).map(m => (
                        <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 30}}>
                            <div style={{fontSize:'3.2rem', marginBottom: 15}}>{m.e}</div>
                            <div style={{fontSize:'0.9rem', fontWeight:800}}>{m.l}</div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {currentTab === 'invoices' && (
                <>
                  <div className="chip-bar">
                    <button className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous les produits</button>
                    {Object.keys(data.productsByCategory).map(c => (
                      <button key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace('_', ' ')}</button>
                    ))}
                  </div>
                  <div style={{marginBottom: 25}}>
                    <input className="inp" placeholder="🔍 Rechercher un plat ou une boisson..." style={{marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const inCart = cart.find(x=>x.name===p);
                      return (
                        <div key={p} className={`card ${inCart?'sel':''}`} onClick={()=>{
                          playSound('click'); 
                          if(inCart) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                          else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                          {inCart && <div className="badge-qty">{inCart.qty}</div>}
                          <div style={{height:120, borderRadius:15, overflow:'hidden', background:'#000', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'2.5rem', opacity:0.1}}>{p.charAt(0)}</span>}
                          </div>
                          <div style={{fontWeight:800, fontSize:'0.75rem', height:35, lineHeight:1.2, padding: '0 5px'}}>{p}</div>
                          <div style={{color:'var(--p)', fontWeight:900, marginTop:8, fontSize: '1.1rem'}}>${data.prices[p]}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'profile', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>📦 Déclaration Stock</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'1px dashed #333', justifyContent:'center', margin:'10px 0 25px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER UNE LIGNE</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>TRANSMETTRE AU STOCK</button>
                      </>
                    )}

                    {currentTab === 'enterprise' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🏢 Commande Entreprise</h2>
                        <input className="inp" placeholder="Nom de l'entreprise cliente" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                        {forms.enterprise.items.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.enterprise.name || forms.enterprise.items.some(s => !s.product)} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>VALIDER LA COMMANDE</button>
                      </>
                    )}

                    {currentTab === 'partners' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🤝 Partenariats</h2>
                        <input className="inp" placeholder="N° Facture Obligatoire" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <div style={{display:'flex', gap:12}}>
                          <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{
                             const c = e.target.value;
                             setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                          }}>
                            {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                          <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                            {data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        {forms.partner.items.map((item, idx) => (
                           <div key={idx} style={{display:'flex', gap:10, marginBottom:15}}>
                             <select className="inp" style={{flex:1, marginBottom:0}} value={item.menu} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }}>
                               {data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}
                             </select>
                             <input type="number" className="qty-inp" style={{height:50}} value={item.qty} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }} />
                           </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.partner.num} onClick={()=>send('sendPartnerOrder', forms.partner)}>ENREGISTRER PARTENAIRE</button>
                      </>
                    )}

                    {currentTab === 'expenses' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>💳 Notes de Frais</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}><option>Essence</option><option>Réparation</option></select>
                        <input className="inp" type="number" placeholder="Montant déboursé ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => document.getElementById('inpFile').click()} >
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {forms.expense.file ? (
                             <div>
                               <div style={{color:'var(--p)', fontWeight:900, fontSize:'0.75rem', marginBottom:10}}>PHOTO CHARGÉE</div>
                               <img src={forms.expense.file} className="dz-preview" />
                             </div>
                           ) : (
                             <div>
                               <div style={{fontSize:'2.5rem', marginBottom:10}}>📸</div>
                               <div style={{fontWeight:800}}>PHOTO DU TICKET</div>
                               <div style={{fontSize:'0.75rem', opacity:0.5, marginTop:5}}>Coller (Ctrl+V) ou Déposer</div>
                             </div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>DÉCLARER LE REMBOURSEMENT</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🚗 Gestion Garage</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom: 20}}>
                            <button className={`nav-l ${forms.garage.action==='Entrée'?'active':''}`} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Entrée'}})} style={{justifyContent:'center'}}>🅿️ ENTRÉE</button>
                            <button className={`nav-l ${forms.garage.action==='Sortie'?'active':''}`} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Sortie'}})} style={{justifyContent:'center'}}>🔑 SORTIE</button>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:10, fontSize:'0.9rem'}}><span>Niveau d'essence</span><span>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', marginTop:15}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ENREGISTRER L'ÉTAT</button>
                      </>
                    )}

                    {currentTab === 'profile' && myProfile && (
                      <div style={{padding: 10}}>
                          <div style={{textAlign:'center', marginBottom: 35}}>
                            <div style={{width:120, height:120, borderRadius:45, background:'var(--p)', color:'#000', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', fontWeight:900, boxShadow:'0 15px 35px rgba(255,152,0,0.2)'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.2rem', fontWeight:900}}>{user}</h1>
                            <div style={{display:'inline-block', padding:'5px 15px', borderRadius:100, background:'rgba(255,152,0,0.1)', color:'var(--p)', fontWeight:800, fontSize:'0.8rem', marginTop:8}}>{myProfile.role}</div>
                          </div>
                          
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom: 15}}>
                              <div className="card" style={{padding:20}}>
                                <div style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight:800, marginBottom:5}}>C.A PERSONNEL</div>
                                <div style={{fontSize: '1.4rem', fontWeight: 900}}>${myProfile.ca.toLocaleString()}</div>
                              </div>
                              <div className="card" style={{padding:20}}>
                                <div style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight:800, marginBottom:5}}>UNITÉS PRODUITES</div>
                                <div style={{fontSize: '1.4rem', fontWeight: 900}}>{myProfile.stock.toLocaleString()}</div>
                              </div>
                          </div>

                          <div className="card" style={{background: 'linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(0,0,0,0) 100%)', border: '1px solid var(--p)', marginBottom: 15, padding: 25}}>
                              <div style={{fontSize:'0.75rem', color:'var(--p)', fontWeight: 800, marginBottom:8}}>RÉMUNÉRATION ACQUISE</div>
                              <div style={{fontSize: '2.5rem', fontWeight: 900, color:'#fff'}}>${myProfile.salary?.toLocaleString()}</div>
                              <div style={{fontSize: '0.65rem', opacity: 0.5, marginTop: 10}}>Calculé selon les barèmes en vigueur.</div>
                          </div>

                          <div className="card" style={{textAlign: 'left', background: '#0b0d11', padding: 20}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:'0.85rem'}}><span>📅 Ancienneté</span><b style={{color:'#fff'}}>{myProfile.seniority} jours</b></div>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:'0.85rem'}}><span>🆔 Matricule</span><b style={{color:'#fff'}}>#00{myProfile.id}</b></div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}><span>📞 Contact</span><b style={{color:'var(--p)'}}>{myProfile.phone}</b></div>
                          </div>
                      </div>
                    )}

                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🆘 Support Technique</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur Facture</option><option>Bugs App</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:180, resize:'none'}} placeholder="Décrivez votre problème ici..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>ENVOYER LE TICKET</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30, maxWidth:1200, margin:'0 auto'}}>
                  <div className="stat-card">
                    <h2 style={{marginBottom:25, fontSize:'1.2rem', display:'flex', alignItems:'center', gap:10}}>🏆 TOP Vendeurs <small style={{fontSize:'0.7rem', color:'var(--muted)'}}>(C.A)</small></h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 18}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom:6}}>
                           <span><span style={{opacity:0.5, marginRight:8}}>{i+1}.</span> <b>{e.name}</b></span>
                           <b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca/(data.employeesFull[0].ca || 1))*100+'%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="stat-card">
                    <h2 style={{marginBottom:25, fontSize:'1.2rem', display:'flex', alignItems:'center', gap:10}}>🍳 TOP Producteurs <small style={{fontSize:'0.7rem', color:'var(--muted)'}}>(Stock)</small></h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 18}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom:6}}>
                           <span><span style={{opacity:0.5, marginRight:8}}>{i+1}.</span> <b>{e.name}</b></span>
                           <b style={{color:'#10b981'}}>{e.stock.toLocaleString()} <small>u.</small></b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16, 185, 129, 0.1)'}}><div className="perf-fill" style={{background:'#10b981', width: (e.stock/(data.employeesFull[0].stock || 1))*100+'%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'directory' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:18}}>
                  {data.employeesFull.map(e => (
                    <div key={e.id} className="card" style={{padding:20, textAlign:'left', display:'flex', gap:15, alignItems:'center', background: '#111'}}>
                      <div style={{width:55, height:55, borderRadius:18, background: (e.name === user ? 'var(--p)' : '#222'), color: (e.name === user ? '#000' : '#fff'), display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:900}}>{e.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:'1rem'}}>{e.name}</div>
                        <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:800, textTransform:'uppercase', marginTop:2}}>{e.role}</div>
                        <a href={`tel:${e.phone}`} style={{fontSize:'0.85rem', marginTop:8, color:'var(--muted)', textDecoration:'none', display:'block'}}>📞 {e.phone}</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:30, borderBottom:'1px solid var(--brd)', background: '#080808'}}><h2 style={{fontSize:'1.2rem', fontWeight:900, letterSpacing:1}}>🛒 PANIER ACTIF</h2></div>
              <div style={{padding:20, background: '#000'}}>
                <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.3rem', letterSpacing:2, borderStyle:'dashed'}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.length === 0 ? (
                  <div style={{textAlign:'center', marginTop: 100, opacity: 0.2}}>
                    <div style={{fontSize:'4rem'}}>🛒</div>
                    <p style={{fontWeight:800}}>Panier vide</p>
                  </div>
                ) : (
                  cart.map((i, idx)=>(
                    <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid #111', alignItems:'center'}}>
                      <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.9rem', color:'#fff'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.75rem', marginTop:3}}>${i.pu} / unité</div></div>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <button style={{background:'#111', border:'1px solid #222', color:'#fff', width:30, height:30, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                        <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                        <button style={{background:'#111', border:'1px solid #222', color:'#fff', width:30, height:30, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{padding:30, background:'#080808', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:25, alignItems:'flex-end'}}>
                    <span style={{fontWeight:800, color: 'var(--muted)'}}>TOTAL</span>
                    <b style={{fontSize:'2.8rem', color:'var(--p)', fontWeight:900, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "TRANSMISSION..." : "VALIDER LA VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
