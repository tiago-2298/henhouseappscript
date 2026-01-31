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

  // --- SAUVEGARDE LOCALE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('hh_user');
    const savedCart = localStorage.getItem('hh_cart');
    if (savedUser) { setUser(savedUser); setView('app'); }
    if (savedCart) { setCart(JSON.parse(savedCart)); }
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
        
        if(action === 'sendFactures') { setCart([]); setForms(p => ({...p, invoiceNum: ''})); }
        else if (action === 'sendProduction') { setForms(p => ({...p, stock: [{ product: '', qty: 1 }]})); }
        else if (action === 'sendEntreprise') { setForms(p => ({...p, enterprise: { name: '', items: [{ product: '', qty: 1 }] }})); }
        else if (action === 'sendPartnerOrder') { setForms(p => ({...p, partner: { ...p.partner, num: '' }})); }
        else if (action === 'sendExpense') { setForms(p => ({...p, expense: { ...p.expense, amount: '', file: null }})); }
        else if (action === 'sendSupport') { setForms(p => ({...p, support: { ...p.support, msg: '' }})); }
        loadData(); 
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const login = (u) => {
    setUser(u);
    localStorage.setItem('hh_user', u);
    playSound('success');
    setView('app');
  };

  const logout = () => {
    localStorage.removeItem('hh_user');
    setUser('');
    setView('login');
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0b0d11; --panel: #161920; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 20px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; z-index: 100; }
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        .main { flex: 1; overflow-y: auto; padding: 40px; position: relative; background: radial-gradient(circle at 0% 0%, #1a1510 0%, #0b0d11 100%); }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 12px; border-radius: 22px; cursor: pointer; transition: 0.4s cubic-bezier(0.2, 1, 0.3, 1); text-align: center; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.4); }
        .card.in-cart { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .qty-badge { position: absolute; top: 8px; right: 8px; background: var(--p); color: #000; font-size: 0.7rem; font-weight: 900; padding: 2px 8px; border-radius: 20px; box-shadow: 0 4px 10px rgba(255,152,0,0.3); }

        .chip-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .chip { padding: 8px 20px; border-radius: 30px; background: var(--panel); border: 1px solid var(--brd); white-space: nowrap; font-size: 0.8rem; font-weight: 800; color: var(--muted); cursor: pointer; transition: 0.2s; }
        .chip.active { background: var(--p); color: #000; border-color: var(--p); }

        .form-ui { width: 100%; max-width: 580px; background: rgba(22, 25, 32, 0.7); backdrop-filter: blur(20px); padding: 45px; border-radius: 35px; border: 1px solid var(--brd); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        .inp { width: 100%; padding: 15px; border-radius: 14px; border: 1px solid var(--brd); background: rgba(0,0,0,0.3); color: #fff; font-weight: 600; margin-bottom: 15px; outline: none; transition: 0.2s; }
        .inp:focus { border-color: var(--p); box-shadow: 0 0 0 3px rgba(255,152,0,0.1); }
        
        .btn-p { background: var(--p); color: #000; border:none; padding: 18px; border-radius: 16px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; letter-spacing: 0.5px; }
        .btn-p:hover { transform: scale(1.02); filter: brightness(1.1); }
        .btn-p:disabled { background: #2d333f; color: #555; cursor: not-allowed; transform: none; }

        .cart { width: 340px; border-left: 1px solid var(--brd); background: #000; display: flex; flex-direction: column; }
        .cart-header { padding: 30px; border-bottom: 1px solid var(--brd); background: linear-gradient(to bottom, #111, #000); }
        .cart-item { display: flex; justify-content: space-between; padding: 15px; margin: 0 15px 8px; background: var(--panel); border-radius: 16px; border: 1px solid rgba(255,255,255,0.03); align-items: center; }

        .gauge-wrap { height: 10px; background: #222; border-radius: 20px; overflow: hidden; margin: 15px 0; }
        .gauge-fill { height: 100%; background: linear-gradient(90deg, #ff9800, #ff5722); transition: 0.5s ease-out; }

        .toast { position: fixed; top: 30px; right: 30px; padding: 20px 35px; border-radius: 18px; z-index: 9999; animation: slideInToast 0.4s ease; backdrop-filter: blur(10px); color: #fff; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        @keyframes slideInToast { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .sk-wrap { display: flex; align-items: center; justify-content: center; height: 100vh; gap: 8px; background: #000; }
        .sk { width: 12px; height: 12px; border-radius: 50%; background: var(--p); animation: pulse 0.6s infinite alternate; }
        @keyframes pulse { to { transform: scale(1.5); opacity: 0.3; } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', background: '#000'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:40}} />
            <h1 style={{fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: 10}}>Bonjour Agent</h1>
            <p style={{color: 'var(--muted)', marginBottom: 35}}>Sélectionnez votre profil pour continuer</p>
            <select className="inp" style={{fontSize: '1rem', textAlign: 'center'}} value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisir un agent...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>login(user)} disabled={!user}>OUVRIR LA SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:45}}><img src="https://i.goopics.net/dskmxi.png" height="55" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{padding: '20px 0', borderTop: '1px solid var(--brd)'}}>
              <div style={{background: 'linear-gradient(135deg, #181a20 0%, #000 100%)', padding: 18, borderRadius: 18, marginBottom: 15, border: '1px solid var(--brd)'}}>
                <div style={{fontSize: '0.9rem', fontWeight: 900, color: '#fff'}}>{user}</div>
                <div style={{fontSize: '0.65rem', color: 'var(--p)', fontWeight: 800, textTransform: 'uppercase', marginTop: 4}}>{myProfile?.role || 'Agent'}</div>
              </div>
              <div className="tool-bar">
                <button className="icon-tool" onClick={() => loadData(true)}>☁️</button>
                <button className="icon-tool" onClick={() => setIsMuted(!isMuted)}>{isMuted ? '🔇' : '🔊'}</button>
                <button className="icon-tool" onClick={logout} style={{color:'#ef4444'}}>🚪</button>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {currentTab === 'home' && (
                <div>
                   <h1 style={{fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 8}}>Salut, {user.split(' ')[0]}</h1>
                   <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:45}}>
                      <div style={{width:8, height:8, background:'#10b981', borderRadius:'50%'}}></div>
                      <span style={{color:'var(--muted)', fontWeight:700, fontSize:'0.9rem'}}>Système Cloud Connecté</span>
                   </div>
                   
                   <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 50}}>
                      <div className="card" style={{padding: 35, textAlign:'left', background: 'linear-gradient(145deg, #221c15, #161920)', border: '1px solid rgba(255,152,0,0.1)'}}>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <div>
                               <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 10}}>GAIN TOTAL (C.A)</div>
                               <div style={{fontSize: '2.8rem', fontWeight: 900, color: 'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                            </div>
                            <span style={{fontSize:'3rem'}}>💰</span>
                         </div>
                      </div>
                      <div className="card" style={{padding: 35, textAlign:'left', background: 'linear-gradient(145deg, #161920, #000)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <div>
                               <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 10}}>SALAIRE ESTIMÉ</div>
                               <div style={{fontSize: '2.8rem', fontWeight: 900, color: '#fff'}}>${myProfile?.salary.toLocaleString()}</div>
                            </div>
                            <span style={{fontSize:'3rem'}}>💵</span>
                         </div>
                      </div>
                   </div>

                   <div className="card" style={{padding: 30, textAlign: 'left', marginBottom: 50}}>
                      <div style={{display:'flex', justifyContent:'space-between', fontWeight: 900, fontSize: '0.9rem', marginBottom: 10}}>
                         <span>DÉVOUEMENT & ANCIENNETÉ</span>
                         <span style={{color:'var(--p)'}}>{myProfile?.seniority} JOURS</span>
                      </div>
                      <div className="gauge-wrap"><div className="gauge-fill" style={{width: Math.min((myProfile?.seniority / 365) * 100, 100) + '%'}}></div></div>
                      <p style={{fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600}}>Progression vers le bonus de fidélité annuel</p>
                   </div>

                   <h3 style={{marginBottom: 20, fontWeight: 900, color: '#fff', fontSize: '1rem', letterSpacing: '1px'}}>MODULES PRIORITAIRES</h3>
                   <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:15}}>
                      {MODULES.filter(m => ['invoices', 'stock', 'garage', 'expenses'].includes(m.id)).map(m => (
                        <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25}}>
                            <span style={{fontSize:'2.5rem'}}>{m.e}</span>
                            <div style={{marginTop:12, fontSize:'0.85rem', fontWeight:800}}>{m.l}</div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {currentTab === 'invoices' && (
                <>
                  <div className="chip-bar">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tout Voir</div>
                    {Object.keys(data.productsByCategory).map(c=>(
                      <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace('_',' ')}</div>
                    ))}
                  </div>
                  <div style={{marginBottom: 30}}>
                    <input className="inp" placeholder="🔍 Rechercher un plat ou une boisson..." value={search} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const inCart = cart.find(i=>i.name===p);
                      return (
                        <div key={p} className={`card ${inCart?'in-cart':''}`} onClick={()=>{
                          playSound('click'); 
                          if(inCart) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                          else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                          {inCart && <div className="qty-badge">{inCart.qty}</div>}
                          <div style={{height:100, borderRadius:16, overflow:'hidden', background:'#000', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'1.5rem', opacity:0.1}}>{p.charAt(0)}</span>}
                          </div>
                          <div style={{fontWeight:800, fontSize:'0.75rem', height:32, color: inCart ? '#fff' : 'var(--muted)'}}>{p}</div>
                          <div style={{color:'var(--p)', fontWeight:900, marginTop:5, fontSize:'1rem'}}>${data.prices[p]}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* MODULES FORMULAIRES */}
              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>📦 PRODUCTION CUISINE</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'2px dashed var(--brd)', justifyContent:'center', margin:'10px 0 25px', padding:15}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER UNE LIGNE</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER LA PRODUCTION</button>
                      </>
                    )}

                    {currentTab === 'enterprise' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>🏢 COMMANDE ENTREPRISE</h2>
                        <input className="inp" placeholder="Nom de la société cliente" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                        {forms.enterprise.items.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }}><option value="">Sélectionner...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0, textAlign:'center'}} value={item.qty} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" style={{marginTop: 20}} disabled={sending || !forms.enterprise.name || forms.enterprise.items.some(s => !s.product)} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER LE BON DE COMMANDE</button>
                      </>
                    )}

                    {currentTab === 'partners' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>🤝 CONTRAT PARTENAIRE</h2>
                        <input className="inp" placeholder="N° Facture Obligatoire" style={{textAlign:'center', fontSize: '1.2rem', color: 'var(--p)'}} value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <div style={{display:'flex', gap:10}}>
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
                           <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                             <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }}>
                               {data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}
                             </select>
                             <input type="number" className="inp" style={{width:80, textAlign:'center'}} value={item.qty} onChange={e=>{
                               const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                             }} />
                           </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.partner.num} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LA TRANSACTION</button>
                      </>
                    )}

                    {currentTab === 'expenses' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>💳 NOTES DE FRAIS</h2>
                        <div style={{display:'flex', gap:10}}>
                          <select className="inp" style={{flex:1}} value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                          <select className="inp" style={{flex:1}} value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}><option>Essence</option><option>Réparation</option></select>
                        </div>
                        <input className="inp" type="number" placeholder="Montant en $" style={{textAlign:'center', fontSize: '1.5rem'}} value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => document.getElementById('inpFile').click()}>
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           {forms.expense.file ? (
                             <div style={{animation: 'fadeIn 0.3s ease'}}>
                               <div style={{color:'var(--p)', fontWeight:800, fontSize:'0.7rem', marginBottom: 10}}>TICKET DE CAISSE CHARGÉ</div>
                               <img src={forms.expense.file} style={{maxWidth: '100%', maxHeight: 200, borderRadius: 12, border: '4px solid #fff'}} />
                             </div>
                           ) : (
                             <div>
                               <div style={{fontSize:'2.5rem', marginBottom: 10}}>📸</div>
                               <div style={{fontWeight:800}}>DÉPOSER LE TICKET ICI</div>
                               <div style={{fontSize:'0.7rem', opacity:0.5, marginTop: 5}}>Capture écran, Ctrl+V ou Fichier</div>
                             </div>
                           )}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>TRANSMETTRE LA NOTE DE FRAIS</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>🚗 GESTION GARAGE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <div style={{display:'flex', gap:10, marginBottom: 20}}>
                          <button style={{flex:1, padding:15, borderRadius:12, border:'2px solid', borderColor: forms.garage.action==='Entrée'?'var(--p)':'var(--brd)', background: forms.garage.action==='Entrée'?'rgba(255,152,0,0.1)':'transparent', fontWeight:800, color: forms.garage.action==='Entrée'?'#fff':'var(--muted)'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Entrée'}})}>🅿️ ENTRÉE</button>
                          <button style={{flex:1, padding:15, borderRadius:12, border:'2px solid', borderColor: forms.garage.action==='Sortie'?'var(--p)':'var(--brd)', background: forms.garage.action==='Sortie'?'rgba(255,152,0,0.1)':'transparent', fontWeight:800, color: forms.garage.action==='Sortie'?'#fff':'var(--muted)'}} onClick={()=>setForms({...forms, garage:{...forms.garage, action:'Sortie'}})}>🔑 SORTIE</button>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:10}}><span>NIVEAU CARBURANT</span><span style={{color: 'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:30, cursor:'pointer'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ENREGISTRER L'ÉTAT DU VÉHICULE</button>
                      </>
                    )}

                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900}}>🆘 CENTRE DE SUPPORT</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur Facture</option><option>Accès Portail</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:200, resize:'none', padding: 20}} placeholder="Expliquez votre problème en détails..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>OUVRIR UN TICKET</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                  <div className="form-ui" style={{maxWidth: 620}}>
                    <div style={{textAlign:'center', marginBottom: 40}}>
                      <div style={{width:140, height:140, borderRadius:50, background:'linear-gradient(135deg, var(--p), #ff5722)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4.5rem', fontWeight:900, color:'#000', border: '8px solid rgba(0,0,0,0.2)'}}>{user.charAt(0)}</div>
                      <h1 style={{fontSize:'2.8rem', fontWeight:900, letterSpacing:'-1px'}}>{user}</h1>
                      <div style={{background: 'rgba(255,152,0,0.1)', color: 'var(--p)', display:'inline-block', padding: '5px 20px', borderRadius: 30, fontSize: '0.8rem', fontWeight: 800, marginTop: 10}}>{myProfile.role}</div>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom: 15}}>
                        <div className="card" style={{padding: 25}}>
                          <p style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight: 800, marginBottom: 5}}>CA TOTAL</p>
                          <p style={{fontSize: '1.8rem', fontWeight: 900}}>${myProfile.ca.toLocaleString()}</p>
                        </div>
                        <div className="card" style={{padding: 25}}>
                          <p style={{fontSize:'0.65rem', color:'var(--muted)', fontWeight: 800, marginBottom: 5}}>PRODUCTION</p>
                          <p style={{fontSize: '1.8rem', fontWeight: 900}}>{myProfile.stock.toLocaleString()} u.</p>
                        </div>
                    </div>
                    <div className="card" style={{background: 'linear-gradient(135deg, #2a2010 0%, #161920 100%)', border: '2px solid var(--p)', padding: 30, marginBottom: 30, textAlign: 'center'}}>
                        <p style={{fontSize:'0.75rem', color:'var(--p)', fontWeight: 800, letterSpacing: 1}}>SALAIRE ESTIMÉ ACTUEL</p>
                        <p style={{fontSize: '3rem', fontWeight: 900, margin: '5px 0'}}>${myProfile.salary?.toLocaleString()}</p>
                        <p style={{fontSize: '0.65rem', opacity: 0.5, fontWeight: 600}}>Calculé automatiquement via Google Sheet</p>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15}}>
                       <div style={{fontSize: '0.85rem', color: 'var(--muted)'}}>🆔 ID Employé: <b>#00{myProfile.id}</b></div>
                       <div style={{fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'right'}}>📅 Arrivée: <b>{myProfile.seniority} j.</b></div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'performance' && (
                <div style={{maxWidth:1100, margin:'0 auto'}}>
                  <h1 style={{fontSize: '2rem', fontWeight: 900, marginBottom: 30, textAlign: 'center'}}>Classement Performance</h1>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30}}>
                    <div className="card" style={{padding:30, textAlign:'left'}}>
                      <h2 style={{fontSize: '1rem', fontWeight: 900, marginBottom: 25, borderBottom: '1px solid var(--brd)', paddingBottom: 15}}>🥇 TOP CHIFFRE D'AFFAIRES</h2>
                      {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                        <div key={i} style={{marginBottom: 20}}>
                          <div style={{display:'flex', justifyContent:'space-between', marginBottom: 6}}>
                             <span style={{fontWeight: 800, fontSize: '0.9rem'}}>{i+1}. {e.name}</span>
                             <b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                          </div>
                          <div className="gauge-wrap" style={{height: 6}}><div className="gauge-fill" style={{width: (e.ca/data.employeesFull[0].ca)*100+'%'}}></div></div>
                        </div>
                      ))}
                    </div>
                    <div className="card" style={{padding:30, textAlign:'left'}}>
                      <h2 style={{fontSize: '1rem', fontWeight: 900, marginBottom: 25, borderBottom: '1px solid var(--brd)', paddingBottom: 15}}>🍳 TOP PRODUCTION STOCK</h2>
                      {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                        <div key={i} style={{marginBottom: 20}}>
                          <div style={{display:'flex', justifyContent:'space-between', marginBottom: 6}}>
                             <span style={{fontWeight: 800, fontSize: '0.9rem'}}>{i+1}. {e.name}</span>
                             <b style={{color:'#10b981'}}>{e.stock.toLocaleString()} u.</b>
                          </div>
                          <div className="gauge-wrap" style={{height: 6}}><div className="gauge-fill" style={{background: '#10b981', width: (e.stock/data.employeesFull[0].stock)*100+'%'}}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'directory' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
                  {data.employeesFull.sort((a,b)=>a.name.localeCompare(b.name)).map(e => (
                    <div key={e.id} className="card" style={{padding:25, textAlign:'left', display:'flex', gap:20, alignItems:'center'}}>
                      <div style={{width:65, height:65, borderRadius:20, background: 'linear-gradient(135deg, #181a20, #000)', border: '2px solid var(--brd)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:900, color: 'var(--p)'}}>{e.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:900, fontSize: '1rem'}}>{e.name}</div>
                        <div style={{fontSize:'0.65rem', color:'var(--p)', fontWeight:800, textTransform: 'uppercase', marginBottom: 8}}>{e.role}</div>
                        <a href={`tel:${e.phone}`} style={{fontSize:'0.85rem', color:'var(--muted)', textDecoration:'none', display:'flex', alignItems:'center', gap:5, fontWeight: 700}}>📞 {e.phone}</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <div className="cart-header">
                <h2 style={{fontSize:'1.2rem', fontWeight:900, letterSpacing: '-0.5px'}}>Panier Client</h2>
                <p style={{fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600}}>Ajoutez les articles pour facturer</p>
              </div>
              <div style={{padding: 20}}>
                <input className="inp" placeholder="N° FACTURE OBLIGATOIRE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.1rem', borderColor: forms.invoiceNum ? 'var(--p)' : 'var(--brd)', borderStyle: 'dashed'}} />
              </div>
              <div style={{flex:1, overflowY:'auto'}}>
                {cart.length === 0 ? (
                  <div style={{textAlign:'center', padding:40, color: 'var(--muted)', fontSize:'0.8rem'}}>Le panier est vide</div>
                ) : cart.map((i, idx)=>(
                  <div key={idx} className="cart-item">
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800, fontSize:'0.8rem', color: '#fff'}}>{i.name}</div>
                      <div style={{color:'var(--p)', fontSize:'0.75rem', fontWeight: 700}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <button style={{background:'rgba(255,255,255,0.05)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <span style={{fontWeight: 900, fontSize: '1rem', width: 20, textAlign: 'center'}}>{i.qty}</span>
                      <button style={{background:'rgba(255,152,0,0.2)', border:'none', color:'var(--p)', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'#000', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems: 'flex-end'}}>
                  <span style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)'}}>SOUS-TOTAL</span>
                  <b style={{fontSize:'2.5rem', color:'var(--p)', fontWeight: 900, lineHeight: 1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "TRANSMISSION..." : "ENREGISTRER LA VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? 'rgba(239, 68, 68, 0.9)' : (toast.s === 'success' ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 152, 0, 0.9)') }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.95 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
