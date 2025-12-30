'use client';
import { useState, useEffect, useRef } from 'react';

// IMAGES
const IMAGES = {
    "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
    "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
    "Wings épicé": "https://files.catbox.moe/i17915.png",
    "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
    "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
    "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
    "Ribbs": "https://files.catbox.moe/ej5jok.png",
    "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
    "Rougail Saucisse": "https://files.catbox.moe/jqzox0.png",
    "Brochettes de fruits frais": "https://files.catbox.moe/cbmjou.png",
    "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
    "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
    "Tourte Myrtille": "https://files.catbox.moe/oxwlna.png",
    "Jus d'orange": "https://files.catbox.moe/u29syk.png",
    "Lait de poule": "https://files.catbox.moe/jxgida.png"
};

export default function Home() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home'); // home, invoices, stock, etc.
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [toast, setToast] = useState(null);
  
  // États pour les formulaires
  const [invNum, setInvNum] = useState('');
  const [stockItems, setStockItems] = useState([{product:'', qty:1}]);
  const [entName, setEntName] = useState('');
  const [entItems, setEntItems] = useState([{product:'', qty:1}]);
  const [parItems, setParItems] = useState([{menu:'', qty:1}]);
  const [parCompany, setParCompany] = useState('');
  const [parBenef, setParBenef] = useState('');
  const [parNum, setParNum] = useState('');
  
  // États simples
  const [expData, setExpData] = useState({veh:'', kind:'Essence', amt:''});
  const [garData, setGarData] = useState({veh:'', action:'Entrée', fuel:50});
  const [supData, setSupData] = useState({sub:'Autre', msg:''});

  // CHARGEMENT INITIAL
  useEffect(() => {
    fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
        // Init form values defaults
        if(res.vehicles?.length) {
            setExpData(p => ({...p, veh: res.vehicles[0]}));
            setGarData(p => ({...p, veh: res.vehicles[0]}));
        }
        if(res.partners && Object.keys(res.partners.companies).length) {
            setParCompany(Object.keys(res.partners.companies)[0]);
        }
      })
      .catch(err => { console.error(err); alert("Erreur chargement"); });
  }, []);

  // Update Partner Beneficiaries when company changes
  useEffect(() => {
    if(data && parCompany) {
        const comp = data.partners.companies[parCompany];
        if(comp && comp.beneficiaries.length) setParBenef(comp.beneficiaries[0]);
        // Reset menus
        if(comp && comp.menus.length) setParItems([{menu: comp.menus[0].name, qty:1}]);
    }
  }, [parCompany, data]);

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => { if(user) setView('app'); };
  const logout = () => { setUser(''); setView('login'); };

  const addToCart = (prod) => {
    const existing = cart.find(x => x.name === prod);
    if(existing) {
        setCart(cart.map(x => x.name === prod ? {...x, qty: x.qty + 1} : x));
    } else {
        setCart([...cart, {name: prod, qty: 1, pu: data.prices[prod] || 0}]);
    }
    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].qty += delta;
    if(newCart[idx].qty <= 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const sendForm = async (action, payload) => {
    notify("Envoi...", "Veuillez patienter", "info");
    try {
        const res = await fetch('/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action, data: { ...payload, employee: user } })
        });
        const json = await res.json();
        if(json.success) {
            notify("Succès", "Action validée !", "success");
            setCurrentTab('home');
            // Reset forms
            setCart([]); setInvNum('');
            setStockItems([{product:(data.products[0]), qty:1}]);
            setEntItems([{product:(data.products[0]), qty:1}]); setEntName('');
            setSupData({sub:'Autre', msg:''});
            setExpData({...expData, amt:''});
        } else {
            notify("Erreur", json.message, "error");
        }
    } catch(e) { notify("Erreur", e.message, "error"); }
  };

  if(loading) return <div style={{padding:50, textAlign:'center'}}>Chargement Hen House...</div>;

  return (
    <>
    <style jsx global>{`
        :root {
            --primary: #ff6a2b;
            --primary-light: #fff0eb;
            --bg-body: #f8f9fc;
            --bg-panel: #ffffff;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --radius: 24px;
            --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
            --sidebar-w: 260px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { font-family: 'Arial', sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; }
        
        /* SIDEBAR */
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: var(--bg-panel); border-radius: var(--radius); display: flex; flex-direction: column; padding: 25px; box-shadow: var(--shadow-lg); z-index: 50; }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; margin-bottom: 40px; color: var(--text-main); }
        .brand img { height: 32px; border-radius: 8px; }
        .nav-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; border: none; background: transparent; color: var(--text-muted); font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .nav-btn:hover { background: var(--bg-body); color: var(--text-main); }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 8px 20px -6px rgba(255, 106, 43, 0.4); }
        .user-profile { display: flex; align-items: center; gap: 10px; padding: 15px; background: var(--bg-body); border-radius: 16px; margin-top: auto; cursor: pointer; }
        .avatar { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        
        /* MAIN */
        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .page-title { font-size: 1.8rem; font-weight: 800; }
        .mini-stat { background: var(--bg-panel); padding: 10px 20px; border-radius: 50px; box-shadow: var(--shadow-sm); display: flex; gap: 10px; align-items: center; font-weight: 700; font-size: 0.9rem; color: var(--text-muted); }
        .mini-stat strong { color: var(--text-main); }
        
        /* DASHBOARD */
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .dash-card { background: var(--bg-panel); border-radius: var(--radius); padding: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; height: 200px; cursor: pointer; transition: 0.3s; }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--shadow-lg); }
        .dash-icon { width: 50px; height: 50px; background: var(--bg-body); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 15px; }
        .dash-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 5px; }
        .dash-desc { font-size: 0.9rem; color: var(--text-muted); }
        
        /* CATALOG */
        .search-container { position: relative; margin-bottom: 25px; max-width: 450px; }
        .search-inp { width: 100%; padding: 16px 20px 16px 50px; border-radius: 18px; border: none; background: var(--bg-panel); box-shadow: var(--shadow-sm); font-size: 1rem; color: var(--text-main); font-weight: 600; }
        .search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); opacity: 0.4; }
        .cat-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px; }
        .pill { padding: 8px 20px; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 50px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: 0.2s; }
        .pill:hover, .pill.active { border-color: var(--primary); color: var(--primary); }
        .pill.active { background: var(--text-main); color: #fff; border-color: var(--text-main); }
        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        .prod-card { background: var(--bg-panel); border-radius: 20px; padding: 15px; text-align: center; border: 1px solid var(--border); cursor: pointer; transition: 0.2s; }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-3px); }
        .prod-img { width: 100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 15px; object-fit: cover; background: var(--bg-body); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #cbd5e1; }
        .prod-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 5px; }
        .prod-price { color: var(--primary); font-weight: 800; font-size: 1.1rem; }
        
        /* CART */
        .cart-drawer { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: var(--bg-panel); box-shadow: -10px 0 40px rgba(0,0,0,0.05); z-index: 100; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .cart-body { flex: 1; overflow-y: auto; padding: 20px; }
        .cart-foot { padding: 30px; background: var(--bg-body); }
        .cart-item { display: flex; align-items: center; gap: 15px; padding: 15px; background: var(--bg-body); border-radius: 16px; margin-bottom: 10px; }
        .qty-ctrl { display: flex; align-items: center; background: var(--bg-panel); border-radius: 10px; padding: 2px; box-shadow: var(--shadow-sm); }
        .qb { width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; font-weight: bold; color: var(--text-main); }
        .qi { width: 40px; border: none; background: transparent; text-align: center; font-weight: 700; color: var(--text-main); }
        .btn { width: 100%; padding: 16px; border: none; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 20px -5px rgba(255, 106, 43, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(255, 106, 43, 0.4); }
        .cart-btn-float { position: fixed; bottom: 30px; right: 30px; background: var(--text-main); color: white; padding: 15px 30px; border-radius: 50px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 12px; transition: 0.2s; z-index: 90; }
        .cart-btn-float:hover { transform: scale(1.05); }

        /* FORMS */
        .form-wrap { background: var(--bg-panel); padding: 40px; border-radius: 30px; max-width: 600px; margin: 0 auto; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
        .inp-group { margin-bottom: 20px; }
        .inp-label { display: block; margin-bottom: 8px; font-weight: 700; font-size: 0.9rem; color: var(--text-muted); }
        .inp-field { width: 100%; padding: 14px; border: 2px solid var(--border); background: var(--bg-body); border-radius: 12px; font-size: 1rem; font-family: inherit; color: var(--text-main); transition: 0.2s; }
        .inp-field:focus { border-color: var(--primary); background: var(--bg-panel); }
        
        /* TOAST */
        .toast { position: fixed; top: 30px; right: 30px; z-index: 3000; background: var(--bg-panel); padding: 15px 25px; border-radius: 16px; box-shadow: var(--shadow-lg); border-left: 5px solid var(--primary); min-width: 280px; animation: slideIn 0.3s; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } }
        .t-title { font-weight: 800; font-size: 0.95rem; margin-bottom: 4px; }
        .t-msg { font-size: 0.85rem; color: var(--text-muted); }
        
        .hidden { display: none; }
        #gate { position: fixed; inset: 0; background: var(--bg-body); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .login-box { text-align: center; width: 400px; }
    `}</style>

    {view === 'login' ? (
        <div id="gate">
            <div className="form-wrap login-box">
                <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:20}} />
                <h2 style={{marginBottom:10}}>Bienvenue</h2>
                <p style={{color:'var(--text-muted)', marginBottom:30}}>Veuillez vous identifier pour continuer</p>
                <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:20, textAlign:'center'}}>
                    <option value="">Choisir...</option>
                    {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button className="btn btn-primary" onClick={login} disabled={!user}>Accéder</button>
            </div>
        </div>
    ) : (
        <>
            <aside className="sidebar">
                <div className="brand">
                    <img src="https://i.goopics.net/dskmxi.png" alt="Logo"/> HEN HOUSE
                </div>
                <nav className="nav-list">
                    <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}>📊 Tableau de bord</button>
                    <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}>🧾 Caisse</button>
                    <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}>📦 Stock</button>
                    <button className={`nav-btn ${currentTab==='enterprise'?'active':''}`} onClick={()=>setCurrentTab('enterprise')}>🏭 Entreprise</button>
                    <button className={`nav-btn ${currentTab==='partners'?'active':''}`} onClick={()=>setCurrentTab('partners')}>🤝 Partenaires</button>
                    <button className={`nav-btn ${currentTab==='expenses'?'active':''}`} onClick={()=>setCurrentTab('expenses')}>💳 Frais</button>
                    <button className={`nav-btn ${currentTab==='garage'?'active':''}`} onClick={()=>setCurrentTab('garage')}>🚗 Garage</button>
                    <button className={`nav-btn ${currentTab==='support'?'active':''}`} onClick={()=>setCurrentTab('support')}>🆘 Support</button>
                </nav>
                <div className="user-profile" onClick={logout}>
                    <div className="avatar">{user.charAt(0)}</div>
                    <div className="u-info">
                        <div className="u-name">{user}</div>
                        <div className="u-role">Déconnexion</div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="header-bar">
                    <div className="page-title">
                        {currentTab === 'home' && 'Tableau de bord'}
                        {currentTab === 'invoices' && 'Caisse'}
                        {currentTab === 'stock' && 'Stock'}
                        {currentTab === 'enterprise' && 'Entreprise'}
                        {currentTab === 'partners' && 'Partenaires'}
                        {currentTab === 'garage' && 'Garage'}
                        {currentTab === 'expenses' && 'Frais'}
                        {currentTab === 'support' && 'Support'}
                    </div>
                    <div className="top-stats">
                        <div className="mini-stat">Session: <strong>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</strong></div>
                    </div>
                </header>

                {currentTab === 'home' && (
                    <div className="dashboard-grid">
                        <div className="dash-card" onClick={()=>setCurrentTab('invoices')}>
                            <div className="dash-icon">🧾</div>
                            <div><div className="dash-title">Caisse</div><div className="dash-desc">Nouvelle vente</div></div>
                        </div>
                        <div className="dash-card" onClick={()=>setCurrentTab('stock')}>
                            <div className="dash-icon">📦</div>
                            <div><div className="dash-title">Stock</div><div className="dash-desc">Production cuisine</div></div>
                        </div>
                        <div className="dash-card" onClick={()=>setCurrentTab('enterprise')}>
                            <div className="dash-icon">🏭</div>
                            <div><div className="dash-title">Entreprise</div><div className="dash-desc">Commandes B2B</div></div>
                        </div>
                        <div className="dash-card" onClick={()=>setCurrentTab('partners')}>
                            <div className="dash-icon">🤝</div>
                            <div><div className="dash-title">Partenaires</div><div className="dash-desc">Offres spéciales</div></div>
                        </div>
                    </div>
                )}

                {currentTab === 'invoices' && (
                    <>
                    <div className="search-container">
                        <span className="search-icon">🔍</span>
                        <input className="search-inp" placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} />
                    </div>
                    <div className="cat-pills">
                        <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                        {Object.keys(data.productsByCategory).map(c => (
                            <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace(/_/g,' ')}</div>
                        ))}
                    </div>
                    <div className="prod-grid">
                        {data.products.filter(p => {
                             const cat = Object.keys(data.productsByCategory).find(k=>data.productsByCategory[k].includes(p));
                             return (catFilter==='Tous' || cat===catFilter) && p.toLowerCase().includes(search.toLowerCase());
                        }).map(p => (
                            <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                                {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img">{p.charAt(0)}</div>}
                                <div className="prod-title">{p}</div>
                                <div className="prod-price">${data.prices[p]}</div>
                            </div>
                        ))}
                    </div>
                    </>
                )}

                {currentTab === 'stock' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Déclaration Stock</h2>
                        {stockItems.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                                    <option value="" disabled>Produit...</option>
                                    {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                                </select>
                                <input type="number" className="inp-field" style={{width:80}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                                <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}}>✕</button>
                            </div>
                        ))}
                        <button className="btn btn-text" onClick={()=>setStockItems([...stockItems, {product:data.products[0], qty:1}])}>+ Ajouter ligne</button>
                        <button className="btn btn-primary" style={{marginTop:20}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Envoyer</button>
                    </div>
                )}

                {currentTab === 'enterprise' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Commande Pro</h2>
                        <div className="inp-group"><label className="inp-label">Nom Entreprise</label><input className="inp-field" value={entName} onChange={e=>setEntName(e.target.value)} /></div>
                        {entItems.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp-field" value={item.product} onChange={e=>{const n=[...entItems];n[i].product=e.target.value;setEntItems(n)}} style={{flex:1}}>
                                    <option value="" disabled>Produit...</option>
                                    {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                                </select>
                                <input type="number" className="inp-field" style={{width:80}} value={item.qty} onChange={e=>{const n=[...entItems];n[i].qty=e.target.value;setEntItems(n)}} />
                                <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...entItems];n.splice(i,1);setEntItems(n)}}>✕</button>
                            </div>
                        ))}
                        <button className="btn btn-text" onClick={()=>setEntItems([...entItems, {product:data.products[0], qty:1}])}>+ Ajouter ligne</button>
                        <button className="btn btn-primary" style={{marginTop:20}} onClick={()=>sendForm('sendEntreprise', {company:entName, items:entItems})}>Valider</button>
                    </div>
                )}

                {currentTab === 'partners' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Partenaires</h2>
                        <div className="inp-group"><label className="inp-label">N° Facture</label><input className="inp-field" value={parNum} onChange={e=>setParNum(e.target.value)} /></div>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                             <div className="inp-group"><label className="inp-label">Société</label>
                                <select className="inp-field" value={parCompany} onChange={e=>setParCompany(e.target.value)}>
                                    {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                             </div>
                             <div className="inp-group"><label className="inp-label">Bénéficiaire</label>
                                <select className="inp-field" value={parBenef} onChange={e=>setParBenef(e.target.value)}>
                                    {parCompany && data.partners.companies[parCompany].beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                                </select>
                             </div>
                        </div>
                        {parItems.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp-field" value={item.menu} onChange={e=>{const n=[...parItems];n[i].menu=e.target.value;setParItems(n)}} style={{flex:1}}>
                                    {parCompany && data.partners.companies[parCompany].menus.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
                                </select>
                                <input type="number" className="inp-field" style={{width:80}} value={item.qty} onChange={e=>{const n=[...parItems];n[i].qty=e.target.value;setParItems(n)}} />
                                <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...parItems];n.splice(i,1);setParItems(n)}}>✕</button>
                            </div>
                        ))}
                         <button className="btn btn-text" onClick={()=>setParItems([...parItems, {menu:data.partners.companies[parCompany].menus[0].name, qty:1}])}>+ Menu</button>
                         <button className="btn btn-primary" style={{marginTop:20}} onClick={()=>sendForm('sendPartnerOrder', {company:parCompany, beneficiary:parBenef, invoiceNumber:parNum, items:parItems})}>Confirmer</button>
                    </div>
                )}

                {currentTab === 'expenses' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Frais</h2>
                        <div className="inp-group"><label className="inp-label">Véhicule</label><select className="inp-field" value={expData.veh} onChange={e=>setExpData({...expData, veh:e.target.value})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select></div>
                        <div className="inp-group"><label className="inp-label">Type</label><select className="inp-field" value={expData.kind} onChange={e=>setExpData({...expData, kind:e.target.value})}><option>Essence</option><option>Réparation</option></select></div>
                        <div className="inp-group"><label className="inp-label">Montant ($)</label><input type="number" className="inp-field" value={expData.amt} onChange={e=>setExpData({...expData, amt:e.target.value})} /></div>
                        <button className="btn btn-primary" onClick={()=>sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:expData.amt})}>Déclarer</button>
                    </div>
                )}
                
                {currentTab === 'garage' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Garage</h2>
                        <div className="inp-group"><label className="inp-label">Véhicule</label><select className="inp-field" value={garData.veh} onChange={e=>setGarData({...garData, veh:e.target.value})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select></div>
                        <div className="inp-group"><label className="inp-label">Action</label><select className="inp-field" value={garData.action} onChange={e=>setGarData({...garData, action:e.target.value})}><option>Entrée</option><option>Sortie</option></select></div>
                        <div className="inp-group"><label className="inp-label">Essence (%)</label><input type="range" style={{width:'100%'}} value={garData.fuel} onChange={e=>setGarData({...garData, fuel:e.target.value})} /> {garData.fuel}%</div>
                        <button className="btn btn-primary" onClick={()=>sendForm('sendGarage', {vehicle:garData.veh, action:garData.action, fuel:garData.fuel})}>Mettre à jour</button>
                    </div>
                )}

                {currentTab === 'support' && (
                    <div className="form-wrap">
                        <h2 style={{marginBottom:20}}>Support</h2>
                        <div className="inp-group"><label className="inp-label">Sujet</label><select className="inp-field" value={supData.sub} onChange={e=>setSupData({...supData, sub:e.target.value})}><option>Problème Stock</option><option>Autre</option></select></div>
                        <div className="inp-group"><label className="inp-label">Message</label><textarea className="inp-field" style={{height:100}} value={supData.msg} onChange={e=>setSupData({...supData, msg:e.target.value})}></textarea></div>
                        <button className="btn btn-primary" onClick={()=>sendForm('sendSupport', {subject:supData.sub, message:supData.msg})}>Envoyer</button>
                    </div>
                )}

            </main>

            {/* CART DRAWER */}
            {currentTab === 'invoices' && (
                <>
                <div className="cart-btn-float" onClick={()=>setCartOpen(true)}>
                    <span style={{fontSize:'1.2rem'}}>🛒</span> <span>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                </div>
                <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                    <div className="cart-head">
                        <h2>Panier</h2>
                        <button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}}>✕</button>
                    </div>
                    <div style={{padding:20}}>
                        <input className="inp-field" placeholder="N° Facture (Obligatoire)" style={{textAlign:'center', fontWeight:700}} value={invNum} onChange={e=>setInvNum(e.target.value)} />
                    </div>
                    <div className="cart-body">
                        {cart.length === 0 && <div style={{textAlign:'center', marginTop:50, color:'var(--text-muted)'}}>Panier vide</div>}
                        {cart.map((c, i) => (
                            <div key={i} className="cart-item">
                                <div style={{flex:1}}><b>{c.name}</b><br/><small style={{color:'var(--text-muted)'}}>${c.pu}</small></div>
                                <div className="qty-ctrl">
                                    <button className="qb" onClick={()=>modQty(i,-1)}>-</button>
                                    <span className="qi">{c.qty}</span>
                                    <button className="qb" onClick={()=>modQty(i,1)}>+</button>
                                </div>
                                <button className="qb" style={{color:'#ef4444'}} onClick={()=>modQty(i, -999)}>✕</button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-foot">
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.4rem', fontWeight:800, marginBottom:15}}>
                            <span>Total</span><span style={{color:'var(--primary)'}}>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" onClick={()=>sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))})}>Valider la vente</button>
                    </div>
                </aside>
                </>
            )}

            {toast && (
                <div className="toast" style={{borderLeftColor: toast.type==='error'?'#ef4444':(toast.type==='success'?'#10b981':'var(--primary)')}}>
                    <div className="t-title">{toast.title}</div>
                    <div className="t-msg">{toast.msg}</div>
                </div>
            )}
        </>
    )}
    </>
  );
}
