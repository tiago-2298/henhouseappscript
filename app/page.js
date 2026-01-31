'use client';
import { useState, useEffect, useMemo, useRef } from 'react';

// --- CONFIGURATION (CONSERVÉE À 100%) ---
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

  // --- PERSISTANCE (LOCALSTORAGE) ---
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

  // --- UTILS ---
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
        gain.gain.setValueAtTime(0.05, now); osc.start(); osc.stop(now + 0.3);
      }
    } catch (e) {}
  };

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); if(s==='success') playSound('success');
    setTimeout(() => setToast(null), 3500); 
  };

  const loadData = async (isSync = false) => {
    if(isSync) notify("SYNCHRONISATION", "Mise à jour Cloud...", "info");
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
        if(isSync) notify("CLOUD SYNCHRONISÉ", "Données à jour", "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        notify("ACTION VALIDÉE", "Transmis avec succès !", "success"); 
        if(action === 'sendFactures') { setCart([]); setForms(prev => ({...prev, invoiceNum: ''})); }
        else if (action === 'sendProduction') setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]}));
        loadData(); 
      } else notify("ÉCHEC", j.message || "Erreur serveur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  if (loading && !data) return <div className="loader-full"><div className="spin"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --p-rgb: 255, 152, 0; --bg: #0b0d11; --panel: rgba(24, 26, 32, 0.8); --brd: rgba(255,255,255,0.08); --radius: 20px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        body { background: var(--bg); color: #fff; height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; background: radial-gradient(circle at 0% 0%, #1a140a 0%, #0b0d11 100%); }
        
        /* SIDEBAR */
        .side { width: 280px; border-right: 1px solid var(--brd); padding: 30px 20px; display: flex; flex-direction: column; backdrop-filter: blur(20px); background: rgba(0,0,0,0.4); }
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 14px; border:none; background:transparent; color: #94a3b8; cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; font-size: 0.9rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.25); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        /* MAIN */
        .main { flex: 1; overflow-y: auto; padding: 40px; }
        .glass-card { background: var(--panel); backdrop-filter: blur(12px); border: 1px solid var(--brd); border-radius: var(--radius); padding: 25px; }
        
        /* GRID CAISSE */
        .category-bar { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .category-bar::-webkit-scrollbar { display: none; }
        .chip { padding: 8px 20px; border-radius: 100px; background: rgba(255,255,255,0.05); border: 1px solid var(--brd); cursor: pointer; white-space: nowrap; font-size: 0.85rem; font-weight: 700; transition: 0.2s; }
        .chip.active { background: #fff; color: #000; border-color: #fff; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
        .item-card { background: rgba(255,255,255,0.03); border: 1px solid var(--brd); border-radius: 20px; padding: 12px; cursor: pointer; transition: 0.3s; position: relative; }
        .item-card:hover { transform: translateY(-5px); border-color: var(--p); background: rgba(255,152,0,0.05); }
        .item-card.in-cart { border-color: var(--p); background: rgba(255,152,0,0.08); }
        .qty-badge { position: absolute; top: 10px; right: 10px; background: var(--p); color: #fff; width: 24px; height: 24px; border-radius: 8px; display: flex; alignItems: center; justifyContent: center; font-size: 0.75rem; font-weight: 900; }

        /* DASHBOARD */
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { padding: 30px; border-radius: 24px; position: relative; overflow: hidden; }
        .stat-card b { font-size: 2rem; display: block; margin-top: 10px; }
        
        .inp { width: 100%; padding: 16px; border-radius: 14px; border: 1px solid var(--brd); background: rgba(0,0,0,0.3); color: #fff; font-weight: 600; margin-bottom: 15px; outline: none; }
        .inp:focus { border-color: var(--p); }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .btn-p:hover { opacity: 0.9; transform: scale(1.02); }
        .btn-p:disabled { background: #334155; opacity: 0.5; transform: none; }

        .cart-panel { width: 350px; background: rgba(0,0,0,0.3); border-left: 1px solid var(--brd); display: flex; flex-direction: column; backdrop-filter: blur(30px); }

        /* ANIMATIONS */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade { animation: fadeIn 0.4s ease-out; }
        
        .loader-full { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0b0d11; }
        .spin { width: 40px; height: 40px; border: 4px solid rgba(255,152,0,0.1); border-top-color: var(--p); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="glass-card" style={{width: 400, textAlign: 'center', padding: 50}}>
            <img src="https://i.goopics.net/dskmxi.png" height="80" style={{marginBottom:40}} />
            <h1 style={{fontSize: '1.8rem', fontWeight: 900, marginBottom: 10}}>Bienvenue</h1>
            <p style={{color: '#94a3b8', marginBottom: 40}}>Sélectionnez votre session pour continuer</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisir un agent...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); setView('app');}} disabled={!user}>Démarrer la session</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:40}}><img src="https://i.goopics.net/dskmxi.png" height="50" /></div>
            <div style={{flex:1, overflowY:'auto', paddingRight: 5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--brd)'}}>
               <div style={{display:'flex', gap: 10, marginBottom: 20}}>
                  <button className="chip" style={{flex:1}} onClick={() => loadData(true)}>☁️ Sync</button>
                  <button className="chip" style={{flex:1}} onClick={() => setIsMuted(!isMuted)}>{isMuted ? '🔇' : '🔊'}</button>
               </div>
               <div className="glass-card" style={{padding: 15, marginBottom: 15, background: 'rgba(255,255,255,0.03)'}}>
                  <div style={{fontSize: '0.85rem', fontWeight: 800}}>{user}</div>
                  <div style={{fontSize: '0.7rem', color: 'var(--p)', fontWeight: 700}}>{myProfile?.role || 'AGENT'}</div>
               </div>
               <button className="nav-l" onClick={()=>{localStorage.removeItem('hh_user'); setView('login');}} style={{color:'#ef4444'}}>🚪 Déconnexion</button>
            </div>
          </aside>

          <main className="main fade">
            {currentTab === 'home' && (
              <div>
                <h1 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: 10}}>Hello, {user.split(' ')[0]} 👋</h1>
                <p style={{color: '#94a3b8', fontSize: '1.1rem', marginBottom: 40}}>Voici l'état actuel de votre activité.</p>
                
                <div className="stat-grid">
                  <div className="stat-card" style={{background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', border: '1px solid #4338ca'}}>
                    <span style={{fontSize: '0.8rem', fontWeight: 800, opacity: 0.8}}>CHIFFRE D'AFFAIRES</span>
                    <b>${myProfile?.ca.toLocaleString()}</b>
                    <div style={{position:'absolute', bottom:-10, right:-10, fontSize:'5rem', opacity:0.1}}>💰</div>
                  </div>
                  <div className="stat-card" style={{background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', border: '1px solid #059669'}}>
                    <span style={{fontSize: '0.8rem', fontWeight: 800, opacity: 0.8}}>UNITÉS PRODUITES</span>
                    <b>{myProfile?.stock.toLocaleString()} u.</b>
                    <div style={{position:'absolute', bottom:-10, right:-10, fontSize:'5rem', opacity:0.1}}>📦</div>
                  </div>
                  <div className="stat-card" style={{background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)', border: '1px solid var(--p)'}}>
                    <span style={{fontSize: '0.8rem', fontWeight: 800, opacity: 0.8}}>SALAIRE ESTIMÉ</span>
                    <b>${myProfile?.salary.toLocaleString()}</b>
                    <div style={{position:'absolute', bottom:-10, right:-10, fontSize:'5rem', opacity:0.1}}>💵</div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{marginBottom: 20, fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8'}}>ANCIENNETÉ : {myProfile?.seniority} JOURS</h3>
                  <div style={{height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow:'hidden'}}>
                    <div style={{height:'100%', background:'var(--p)', width: Math.min((myProfile?.seniority/365)*100, 100)+'%', transition: '1s ease'}}></div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:15, marginBottom: 25, alignItems: 'center'}}>
                   <div style={{position:'relative', flex: 1}}>
                      <input className="inp" placeholder="Rechercher un produit..." style={{marginBottom:0, paddingLeft: 45}} onChange={e=>setSearch(e.target.value)} />
                      <span style={{position:'absolute', left: 18, top: 16, opacity: 0.4}}>🔍</span>
                   </div>
                </div>

                <div className="category-bar">
                   {['Tous', ...Object.keys(data.productsByCategory)].map(c => (
                     <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={() => setCatFilter(c)}>{c}</div>
                   ))}
                </div>

                <div className="grid">
                  {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                    const cartItem = cart.find(i => i.name === p);
                    return (
                      <div key={p} className={`item-card ${cartItem ? 'in-cart' : ''}`} onClick={()=>{
                        playSound('click'); 
                        if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                        else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                      }}>
                        {cartItem && <div className="qty-badge">{cartItem.qty}</div>}
                        <div style={{height:100, borderRadius:12, overflow:'hidden', background:'#000', marginBottom:10}}>
                          {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', opacity:0.2}}>{p.charAt(0)}</div>}
                        </div>
                        <div style={{fontWeight:800, fontSize:'0.75rem', height:35, lineHeight:1.2}}>{p}</div>
                        <div style={{color:'var(--p)', fontWeight:900, marginTop:5, fontSize: '0.9rem'}}>${data.prices[p]}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* FORMULAIRES GLASSMORPHISM */}
            {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'support'].includes(currentTab) && (
              <div style={{display:'flex', justifyContent:'center', paddingTop: 40}}>
                 <div className="glass-card" style={{width: '100%', maxWidth: 550, padding: 40}}>
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>📦 PRODUCTION CUISINE</h2>
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
                        <button className="chip" style={{width:'100%', marginBottom: 20}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter une ligne</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER PRODUCTION</button>
                      </>
                    )}
                    
                    {currentTab === 'expenses' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>💳 DÉCLARATION DE FRAIS</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}><option>Essence</option><option>Réparation</option></select>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        <div 
                           className={`glass-card`} 
                           style={{padding:30, textAlign:'center', border:'2px dashed var(--brd)', cursor:'pointer', marginBottom:20}}
                           onClick={() => document.getElementById('fileInp').click()}
                        >
                          <input type="file" id="fileInp" hidden accept="image/*" onChange={e => {
                            const reader = new FileReader();
                            reader.onload = (ev) => setForms(prev => ({...prev, expense: {...prev.expense, file: ev.target.result}}));
                            reader.readAsDataURL(e.target.files[0]);
                          }} />
                          {forms.expense.file ? <img src={forms.expense.file} style={{width:'100%', borderRadius:10}} /> : <div>📸 CLIQUEZ OU COLLEZ (CTRL+V) LE TICKET</div>}
                        </div>
                        <button className="btn-p" disabled={!forms.expense.file || !forms.expense.amount} onClick={() => send('sendExpense', forms.expense)}>TRANSMETTRE LA NOTE</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🚗 ÉTAT VÉHICULE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                        <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0'}}><span>⛽ Carburant</span><b>{forms.garage.fuel}%</b></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:30}} onClick={() => send('sendGarage', forms.garage)}>ENREGISTRER</button>
                      </>
                    )}
                    
                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🆘 SUPPORT</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur Facture</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:180, resize:'none'}} placeholder="Décrivez votre problème ici..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>ENVOYER AU PATRON</button>
                      </>
                    )}
                 </div>
              </div>
            )}

            {currentTab === 'performance' && (
               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30}}>
                  <div className="glass-card">
                    <h2 style={{marginBottom:25}}>🥇 TOP CHIFFRE D'AFFAIRES</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 18}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom: 8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                        </div>
                        <div style={{height:6, background:'rgba(255,255,255,0.05)', borderRadius:10}}>
                           <div style={{height:'100%', background:'var(--p)', width: (e.ca/data.employeesFull[0].ca)*100+'%'}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="glass-card">
                    <h2 style={{marginBottom:25}}>🍳 TOP PRODUCTION</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 18}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem', marginBottom: 8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b style={{color:'#10b981'}}>{e.stock.toLocaleString()} u.</b>
                        </div>
                        <div style={{height:6, background:'rgba(255,255,255,0.05)', borderRadius:10}}>
                           <div style={{height:'100%', background:'#10b981', width: (e.stock/data.employeesFull[0].stock)*100+'%'}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {currentTab === 'directory' && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
                {data.employeesFull.map(e => (
                  <div key={e.id} className="item-card" style={{padding:20, textAlign:'left', display:'flex', gap:20, alignItems:'center'}}>
                    <div style={{width:60, height:60, borderRadius:20, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:900, color:'#fff'}}>{e.name.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:900, fontSize:'1rem'}}>{e.name}</div>
                      <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:800, textTransform:'uppercase'}}>{e.role}</div>
                      <a href={`tel:${e.phone}`} style={{fontSize:'0.85rem', marginTop:8, color:'#94a3b8', display:'block', textDecoration:'none'}}>📞 {e.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {currentTab === 'profile' && myProfile && (
               <div style={{display:'flex', justifyContent:'center'}}>
                  <div className="glass-card" style={{width: 500, textAlign:'center'}}>
                      <div style={{width:120, height:120, borderRadius:40, background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:900}}>{user.charAt(0)}</div>
                      <h1 style={{fontSize:'2rem', fontWeight:900}}>{user}</h1>
                      <p style={{color:'var(--p)', fontWeight:800, marginBottom:30}}>{myProfile.role}</p>
                      
                      <div className="stat-card" style={{background:'rgba(255,152,0,0.1)', border:'1px solid var(--p)', marginBottom:20}}>
                         <span style={{fontSize:'0.75rem', fontWeight:800}}>SOLDE SALAIRE ACTUEL</span>
                         <b style={{fontSize:'2.5rem'}}>${myProfile.salary.toLocaleString()}</b>
                      </div>
                      
                      <div style={{textAlign:'left', fontSize:'0.9rem', color:'#94a3b8'}}>
                         <div style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--brd)'}}><span>ID Employé</span><b style={{color:'#fff'}}>#00{myProfile.id}</b></div>
                         <div style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--brd)'}}><span>Ancienneté</span><b style={{color:'#fff'}}>{myProfile.seniority} jours</b></div>
                         <div style={{display:'flex', justifyContent:'space-between', padding:'12px 0'}}><span>Téléphone</span><b style={{color:'#fff'}}>{myProfile.phone}</b></div>
                      </div>
                  </div>
               </div>
            )}
          </main>

          {/* PANIER (DESSINÉ UNIQUEMENT SI CAISSE) */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel fade">
              <div style={{padding:30, borderBottom:'1px solid var(--brd)'}}><h2 style={{fontSize:'1.1rem', fontWeight:900}}>🛒 VOTRE PANIER</h2></div>
              <div style={{padding:20}}>
                <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem', letterSpacing:2}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
                {cart.length === 0 && <div style={{textAlign:'center', opacity:0.3, marginTop:50}}>Panier vide</div>}
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid var(--brd)', alignItems:'center'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div><div style={{color:'var(--p)', fontSize:'0.8rem', fontWeight:800}}>${i.pu * i.qty}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <button style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--brd)', color:'#fff', width:30, height:30, borderRadius:10, cursor:'pointer'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <b style={{width: 20, textAlign:'center'}}>{i.qty}</b>
                      <button style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--brd)', color:'#fff', width:30, height:30, borderRadius:10, cursor:'pointer'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:30, background:'rgba(0,0,0,0.2)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:25}}><span>TOTAL</span><b style={{fontSize:'2rem', color:'var(--p)', fontWeight:900}}>${total.toLocaleString()}</b></div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "TRANSMISSION..." : "VALIDER LA VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast fade" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#10b981' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform:'uppercase', marginBottom: '4px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}
