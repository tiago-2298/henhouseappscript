'use client';
import { useState, useEffect, useMemo } from 'react';

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
  sendFactures: { title: "💰 FACTURE TRANSMISE", msg: "La vente a été enregistrée !" },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "Production cuisine déclarée." },
  sendEntreprise: { title: "🏢 COMMANDE PRO", msg: "Bon de commande envoyé." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "Commande enregistrée." },
  sendGarage: { title: "🚗 GARAGE", msg: "Véhicule mis à jour." },
  sendExpense: { title: "💳 NOTE DE FRAIS", msg: "Frais transmis." },
  sendSupport: { title: "🆘 SUPPORT", msg: "Message envoyé au patron." },
  sync: { title: "☁️ SYNC", msg: "Données à jour." }
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  // État initial structuré pour éviter les erreurs de lecture
  const [data, setData] = useState({ 
    employees: [], employeesFull: [], products: [], 
    productsByCategory: {}, prices: {}, partners: { companies: {} }, vehicles: [] 
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [cart, setCart] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [forms, setForms] = useState({
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '', file: null },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  });

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
    if(isSync) notify("SYNCHRONISATION", "Mise à jour...", "info");
    try {
      const r = await fetch('/api', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getMeta' }) 
      });
      if (!r.ok) throw new Error("Erreur Serveur");
      const j = await r.json();
      if(j.success) {
        setData(j);
        const compKeys = Object.keys(j.partners?.companies || {});
        const firstComp = compKeys[0] || '';
        setForms(f => ({...f,
          expense: {...f.expense, vehicle: j.vehicles[0] || ''},
          garage: {...f.garage, vehicle: j.vehicles[0] || ''},
          partner: firstComp ? { 
            ...f.partner, 
            company: firstComp, 
            benef: j.partners.companies[firstComp].beneficiaries[0], 
            items: [{ menu: j.partners.companies[firstComp].menus[0].name, qty: 1 }] 
          } : f.partner
        }));
        if(isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Timeout ou erreur serveur", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const r = await fetch('/api', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: {...payload, employee: user} }) 
      });
      const j = await r.json();
      if(j.success) {
        notify(NOTIF_MESSAGES[action]?.title || "SUCCÈS", NOTIF_MESSAGES[action]?.msg || "Validé", "success");
        if(action === 'sendFactures') { setCart([]); setForms(p => ({...p, invoiceNum:''})); }
        loadData();
      } else notify("ÉCHEC", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

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
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleFileChange = async (file) => {
    if (!file?.type.startsWith('image/')) return notify("ERREUR", "Image requise", "error");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result);
      setForms(prev => ({ ...prev, expense: { ...prev.expense, file: compressed } }));
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  if (loading && !data.employees.length) return (
    <div className="sk-wrap">
       <div className="loader"></div>
       <p style={{marginTop:20, color:'#ff9800', fontWeight:800}}>CONNEXION HEN HOUSE...</p>
       <style>{`.sk-wrap{display:flex;flex-direction:column;height:100vh;align-items:center;justify-content:center;background:#0f1115}.loader{border:5px solid #181a20;border-top:5px solid #ff9800;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .main { flex: 1; overflow-y: auto; padding: 30px; background: radial-gradient(circle at 100% 100%, #2a1b0a 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 18px; cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); }
        .form-ui { width: 100%; max-width: 550px; background: rgba(22, 25, 32, 0.8); backdrop-filter: blur(10px); padding: 40px; border-radius: 30px; border: 1px solid var(--brd); margin: 0 auto; }
        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; }
        .btn-p:disabled { opacity: 0.5; cursor: not-allowed; }
        .cart { width: 320px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; }
        .qty-inp { width: 45px; background: #000; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 6px; padding: 4px; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 12px; z-index: 9999; font-weight: 800; animation: slideIn 0.3s ease; }
        .perf-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; }
        .perf-fill { height: 100%; background: var(--p); border-radius: 10px; }
        .dropzone { border: 2px dashed var(--brd); border-radius: 15px; padding: 20px; text-align: center; cursor: pointer; margin-bottom: 15px; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{maxWidth: 400, textAlign: 'center'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="80" style={{marginBottom:20}} />
            <h1 style={{marginBottom:20}}>Connexion</h1>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisir un agent...</option>
              {data.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); setView('app');}} disabled={!user}>ENTRER</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:30}}><img src="https://i.goopics.net/dskmxi.png" height="40" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', marginTop:20}}>🚪 DÉCONNEXION</button>
          </aside>

          <main className="main">
            {currentTab === 'home' && (
              <div>
                <h1 style={{fontSize: '2rem', marginBottom: 20}}>Hello, {user} 👋</h1>
                <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30}}>
                   <div className="card" style={{textAlign:'left', padding:30}}>
                      <div style={{color:'var(--muted)', fontSize:'0.8rem'}}>CHIFFRE D'AFFAIRES</div>
                      <div style={{fontSize:'2rem', fontWeight:900, color:'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                   </div>
                   <div className="card" style={{textAlign:'left', padding:30}}>
                      <div style={{color:'var(--muted)', fontSize:'0.8rem'}}>PRODUCTION</div>
                      <div style={{fontSize:'2rem', fontWeight:900}}>{myProfile?.stock.toLocaleString()} u.</div>
                   </div>
                </div>
              </div>
            )}

            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:10, marginBottom:20}}>
                  <input className="inp" placeholder="Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                  <select className="inp" style={{width:150, marginBottom:0}} onChange={e=>setCatFilter(e.target.value)}>
                    <option>Tous</option>
                    {Object.keys(data.productsByCategory).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid">
                  {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                    <div key={p} className="card" onClick={()=>{
                      const ex = cart.find(x=>x.name===p);
                      if(ex) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                      else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                    }}>
                      <div style={{height:100, background:'#000', borderRadius:10, marginBottom:10, overflow:'hidden'}}>
                        {IMAGES[p] && <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                      </div>
                      <div style={{fontSize:'0.8rem', fontWeight:800}}>{p}</div>
                      <div style={{color:'var(--p)', fontWeight:900}}>${data.prices[p]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'support'].includes(currentTab) && (
              <div className="form-ui">
                {currentTab === 'stock' && (
                  <>
                    <h2>📦 PRODUCTION</h2>
                    {forms.stock.map((item, i) => (
                      <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                        <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                          const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                        }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                        <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{
                          const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                        }} />
                      </div>
                    ))}
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER</button>
                  </>
                )}
                {currentTab === 'garage' && (
                  <>
                    <h2>🚗 GARAGE</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <input type="range" style={{width:'100%'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendGarage', forms.garage)}>ENREGISTRER</button>
                  </>
                )}
                {currentTab === 'expenses' && (
                  <>
                    <h2>💳 FRAIS</h2>
                    <input className="inp" type="number" placeholder="Montant" onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                    <div className="dropzone" onClick={()=>document.getElementById('f').click()}>
                       <input type="file" id="f" hidden onChange={e=>handleFileChange(e.target.files[0])} />
                       {forms.expense.file ? "✅ IMAGE CHARGÉE" : "📸 CLIQUEZ POUR PHOTO"}
                    </div>
                    <button className="btn-p" disabled={!forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>ENVOYER</button>
                  </>
                )}
              </div>
            )}
            
            {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                    <div className="card" style={{textAlign:'left'}}>
                        <h3>🏆 Top CA</h3>
                        {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,5).map((e,i)=>(
                            <div key={i} style={{marginTop:10}}>
                                <div style={{display:'flex', justifyContent:'space-between'}}>{e.name} <b>${e.ca}</b></div>
                                <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca/data.employeesFull[0]?.ca*100)+'%'}}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:20, borderBottom:'1px solid var(--brd)'}}><h2>🛒 PANIER</h2></div>
              <div style={{padding:15}}><input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} /></div>
              <div style={{flex:1, overflowY:'auto', padding:15}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                    <div>{i.name}</div>
                    <div style={{display:'flex', gap:5}}>
                       <button onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                       <span>{i.qty}</span>
                       <button onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:20, borderTop:'1px solid var(--brd)'}}>
                <div style={{fontSize:'1.5rem', fontWeight:900, marginBottom:10}}>${total}</div>
                <button className="btn-p" disabled={!forms.invoiceNum || !cart.length} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>VALIDER VENTE</button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : '#16a34a', color: '#fff' }}>
          {toast.m}
        </div>
      )}
    </div>
  );
}
