'use client';
import { useState, useEffect } from 'react';

// --- BIBLIOTHÈQUE D'ICÔNES (SVG Fragmentés pour build Vercel) ---
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: ( <> <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> <path d="M3.3 7l8.7 5 8.7-5M12 22v-9" /> </> ),
    building: ( <> <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /> <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /> <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /> <path d="M10 6h4M10 10h4M10 14h4M10 18h4" /> </> ),
    handshake: ( <> <path d="m11 17 2 2a1 1 0 1 0 3-3" /> <path d="M11 14l-3-3" /> <path d="m18 9-9 9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9-9a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0" /> </> ),
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    car: ( <> <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5" /> <path d="M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" /> </> ),
    lifeBuoy: ( <> <circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="4" /> <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.39-3.39M4.93 19.07l4.24-4.24" /> </> ),
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    sun: ( <> <circle cx="12" cy="12" r="4" /> <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /> </> ),
    search: ( <> <circle cx="11" cy="11" r="8" /> <path d="m21 21-4.3-4.3" /> </> ),
    cart: ( <> <circle cx="8" cy="21" r="1" /> <circle cx="19" cy="21" r="1" /> <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /> </> ),
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    users: ( <> <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /> <path d="M22 21v-2a4 4 0 0 0-3-3.87" /> <path d="M16 3.13a4 4 0 0 1 0 7.75" /> </> )
  };
  return ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg> );
};

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
  const [user, setUser] = useState(null); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [submitting, setSubmitting] = useState(false); 
  const [currentTab, setCurrentTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  const [invNum, setInvNum] = useState('');
  const [stockItems, setStockItems] = useState([{product:'', qty:1}]);
  const [entName, setEntName] = useState('');
  const [entItems, setEntItems] = useState([{product:'', qty:1}]);
  const [parItems, setParItems] = useState([{menu:'', qty:1}]);
  const [parCompany, setParCompany] = useState('');
  const [parBenef, setParBenef] = useState('');
  const [parNum, setParNum] = useState('');
  const [expData, setExpData] = useState({veh:'', kind:'Essence', amt:''});
  const [garData, setGarData] = useState({veh:'', action:'Entrée', fuel:50});
  const [supData, setSupData] = useState({sub:'Autre', msg:''});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) })
      .then(res => res.json())
      .then(res => {
        setData(res);
        if(res.vehicles?.length) {
            setExpData(p => ({...p, veh: res.vehicles[0]}));
            setGarData(p => ({...p, veh: res.vehicles[0]}));
        }
        if(res.partners && Object.keys(res.partners.companies).length) {
            setParCompany(Object.keys(res.partners.companies)[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if(data && parCompany) {
        const comp = data.partners.companies[parCompany];
        if(comp && comp.beneficiaries.length) setParBenef(comp.beneficiaries[0]);
        if(comp && comp.menus.length) setParItems([{menu: comp.menus[0].name, qty:1}]);
    }
  }, [parCompany, data]);

  const toggleTheme = () => {
      const newTheme = !darkMode ? 'dark' : 'light';
      setDarkMode(!darkMode);
      document.documentElement.setAttribute('data-theme', newTheme);
  };

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => { if(user) setView('app'); };
  const logout = () => { setUser(null); setView('login'); };

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
    if (submitting) return; 
    setSubmitting(true);
    notify("Envoi...", "Veuillez patienter", "info");
    try {
        const res = await fetch('/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action, data: { ...payload, employee: user.nom } })
        });
        const json = await res.json();
        if(json.success) {
            notify("Succès", "Action validée !", "success");
            if(['sendFactures'].includes(action)) setCurrentTab('home');
            setCart([]); setInvNum('');
            setStockItems([{product:(data.products[0]), qty:1}]);
            setEntItems([{product:(data.products[0]), qty:1}]); setEntName('');
            setParItems([{menu:(data.partners.companies[parCompany]?.menus[0].name), qty:1}]); setParNum('');
            setSupData({sub:'Autre', msg:''});
            setExpData({...expData, amt:''});
        } else {
            notify("Erreur", "Problème d'envoi", "error");
        }
    } catch(e) { notify("Erreur", "Connexion interrompue", "error"); }
    finally { setSubmitting(false); }
  };

  const handleSendInvoice = () => {
      if(!invNum.trim()) return notify("Erreur", "Le N° de facture est obligatoire", "error");
      if(cart.length === 0) return notify("Erreur", "Le panier est vide", "error");
      sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
  };

  const handleSendEnterprise = () => {
      if(!entName.trim()) return notify("Erreur", "Le nom d'entreprise est obligatoire", "error");
      sendForm('sendEntreprise', {company:entName, items:entItems});
  };

  const handleSendPartner = () => {
      if(!parNum.trim()) return notify("Erreur", "Le N° de facture est obligatoire", "error");
      sendForm('sendPartnerOrder', {company:parCompany, beneficiary:parBenef, invoiceNumber:parNum, items:parItems});
  };

  const handleSendExpense = () => {
      if(!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est obligatoire", "error");
      sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:expData.amt});
  };

  // CALCULS PODIUM ET PROFIL
  const topVendeurs = [...(data?.employees || [])].sort((a,b) => b.ca - a.ca).slice(0, 3);
  const percentPromotion = user ? Math.min((user.ca / 50000) * 100, 100).toFixed(0) : 0;

  if(loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'white'}}>Chargement Hen House...</div>;

  return (
    <>
    <style jsx global>{`
        :root { --primary: #ff6a2b; --bg-body: #f8f9fc; --bg-panel: #ffffff; --text-main: #1e293b; --text-muted: #64748b; --border: #e2e8f0; --radius: 24px; --sidebar-w: 260px; }
        [data-theme="dark"] { --bg-body: #0f1115; --bg-panel: #181a20; --text-main: #f8fafc; --text-muted: #94a3b8; --border: #2d313a; }
        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; transition: 0.3s ease; }
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: var(--bg-panel); border-radius: var(--radius); display: flex; flex-direction: column; padding: 25px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); z-index: 50; border: 1px solid var(--border); }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; margin-bottom: 40px; color: var(--text-main); }
        .nav-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; border: none; background: transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: 0.2s; width: 100%; text-align: left; }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 8px 20px -6px rgba(255, 106, 43, 0.4); }
        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .dash-card { background: var(--bg-panel); border-radius: var(--radius); padding: 30px; border: 1px solid var(--border); transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; height: 200px; cursor: pointer; }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        .prod-card { background: var(--bg-panel); border-radius: 20px; padding: 15px; text-align: center; border: 1px solid var(--border); cursor: pointer; transition: 0.2s; }
        .prod-img { width: 100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 15px; object-fit: cover; background: var(--bg-body); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #cbd5e1; }
        .form-wrap { background: var(--bg-panel); padding: 40px; border-radius: 30px; max-width: 600px; margin: 0 auto; border: 1px solid var(--border); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        .inp-field { width: 100%; padding: 14px; border: 2px solid var(--border); background: var(--bg-body); border-radius: 12px; font-size: 1rem; color: var(--text-main); margin-bottom: 20px; }
        .btn-primary { width: 100%; padding: 16px; background: var(--primary); color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-primary:disabled { opacity: 0.5; }
        .cart-drawer { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: var(--bg-panel); transform: translateX(100%); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 100; border-left: 1px solid var(--border); display: flex; flex-direction: column; }
        .cart-drawer.open { transform: translateX(0); }
        #gate { position: fixed; inset: 0; background: var(--bg-body); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .toast { position: fixed; top: 30px; right: 30px; z-index: 3000; background: var(--bg-panel); padding: 15px 25px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-left: 5px solid var(--primary); animation: slideIn 0.3s; }
        @keyframes slideIn { from { transform: translateX(100%); } }
        .progress-bar { width: 100%; background: #333; height: 10px; border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .progress-fill { background: var(--primary); height: 100%; transition: 0.5s; }
    `}</style>

    {view === 'login' ? (
        <div id="gate">
            <div className="sidebar" style={{width:400, height:'auto', textAlign:'center'}}>
                <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:20, margin:'0 auto'}} />
                <h2>Identification Lumina</h2>
                <select className="nav-btn" style={{marginTop:30, textAlign:'center'}} onChange={e => setUser(data.employees.find(x => x.nom === e.target.value))}>
                    <option value="">Sélectionner votre profil...</option>
                    {data?.employees?.map(e => <option key={e.nom} value={e.nom}>{e.nom}</option>)}
                </select>
                <button className="btn-primary" onClick={login} disabled={!user} style={{marginTop:20}}>Accéder</button>
            </div>
        </div>
    ) : (
        <>
            <aside className="sidebar">
                <div className="brand"><img src="https://i.goopics.net/dskmxi.png" height="32" /> HEN HOUSE</div>
                <nav className="nav-list">
                    <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}><Icon name="dashboard" /> Accueil</button>
                    <button className={`nav-btn ${currentTab==='profil'?'active':''}`} onClick={()=>setCurrentTab('profil')}><Icon name="users" /> Profil Personnel</button>
                    <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" /> Caisse</button>
                    <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}><Icon name="package" /> Stock</button>
                    <button className={`nav-btn ${currentTab==='team'?'active':''}`} onClick={()=>setCurrentTab('team')}><Icon name="handshake" /> Équipe</button>
                    <button className={`nav-btn ${currentTab==='support'?'active':''}`} onClick={()=>setCurrentTab('support')}><Icon name="lifeBuoy" /> Support</button>
                </nav>
                <div className="user-profile" style={{padding:15, background:'var(--bg-body)', borderRadius:16, cursor:'pointer'}} onClick={logout}>
                    <div style={{fontWeight:800}}>{user.nom}</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>{user.poste}</div>
                    <Icon name="logout" size={16} style={{marginLeft:'auto'}} />
                </div>
            </aside>

            <main className="main-content">
                <header className="header-bar">
                    <div style={{fontSize:'1.8rem', fontWeight:800}}>{currentTab.toUpperCase()}</div>
                    <div className="top-stats">
                        <div className="mini-stat">Session: <strong>${cart.reduce((s,i)=>s+i.qty*i.pu,0).toFixed(2)}</strong></div>
                        <button onClick={toggleTheme} style={{background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:50, width:40, height:40}}><Icon name={darkMode?'sun':'moon'} /></button>
                    </div>
                </header>

                {currentTab === 'home' && (
                    <>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40}}>
                        {topVendeurs.map((e,i)=>(
                            <div key={e.nom} className="dash-card" style={{height:'auto', borderLeft:`5px solid ${i===0?'#ffd700':i===1?'#c0c0c0':'#cd7f32'}`}}>
                                <div style={{fontSize:'1.5rem'}}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                                <strong>{e.nom}</strong><br/><span>${e.ca} CA</span>
                            </div>
                        ))}
                    </div>
                    <div className="dashboard-grid">
                        <div className="dash-card" onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" size={28} /><strong>Caisse</strong><p>Vente client</p></div>
                        <div className="dash-card" onClick={()=>setCurrentTab('stock')}><Icon name="package" size={28} /><strong>Stock</strong><p>Gérer la production</p></div>
                    </div>
                    </>
                )}

                {currentTab === 'profil' && (
                    <div className="form-wrap" style={{textAlign:'center'}}>
                        <h2 style={{color: 'var(--primary)', marginBottom:20}}>Mon Salaire : {user.salaire}$</h2>
                        <div style={{textAlign:'left', background:'var(--bg-body)', padding:20, borderRadius:20}}>
                            <strong>Objectif Promotion (50,000$)</strong>
                            <div className="progress-bar"><div className="progress-fill" style={{width: `${percentPromotion}%`}}></div></div>
                            <small>{user.ca}$ / 50,000$ ({percentPromotion}%)</small>
                        </div>
                        <div style={{marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                             <div className="dash-card" style={{height:'auto'}}>ID: {user.id}</div>
                             <div className="dash-card" style={{height:'auto'}}>Poste: {user.poste}</div>
                        </div>
                    </div>
                )}

                {currentTab === 'team' && (
                    <div className="dashboard-grid">
                        {data.employees.map(emp => (
                            <div key={emp.nom} className="dash-card" style={{height:'auto', flexDirection:'row', alignItems:'center', gap:15}}>
                                <div className="avatar">{emp.nom.charAt(0)}</div>
                                <div><strong>{emp.nom}</strong><br/><small>{emp.poste}</small><br/><strong>📞 {emp.tel}</strong></div>
                            </div>
                        ))}
                    </div>
                )}

                {currentTab === 'invoices' && (
                    <div className="prod-grid">
                        {data.products.map(p => (
                            <div key={p} className="dash-card" style={{textAlign:'center', height:'auto'}} onClick={()=>addToCart(p)}>
                                {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', borderRadius:12}} /> : <div className="prod-img">🍴</div>}
                                <strong>{p}</strong><br/><span style={{color:'var(--primary)'}}>${data.prices[p]}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div style={{padding:25, borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between'}}><h2>Panier</h2><button onClick={()=>setCartOpen(false)}>X</button></div>
                <div style={{flex:1, padding:25, overflowY:'auto'}}>
                    <input className="inp-field" placeholder="N° FACTURE OBLIGATOIRE" value={invNum} onChange={e=>setInvNum(e.target.value)} style={{textAlign:'center', fontWeight:800}} />
                    {cart.map((c, i) => (<div key={i} style={{marginBottom:15, display:'flex', justifyContent:'space-between'}}><span>{c.name} x{c.qty}</span><strong>${(c.qty*c.pu).toFixed(2)}</strong></div>))}
                </div>
                <div style={{padding:25}}>
                    <button className="btn-primary" disabled={submitting || !invNum.trim()} onClick={handleSendInvoice}>{submitting ? 'Traitement...' : 'Valider la Vente'}</button>
                </div>
            </aside>

            {currentTab === 'invoices' && <div style={{position:'fixed', bottom:30, right:30, background:'var(--text-main)', color:'white', padding:'15px 30px', borderRadius:50, cursor:'pointer', fontWeight:800}} onClick={()=>setCartOpen(true)}>🛒 Panier (${cart.reduce((s,i)=>s+i.qty*i.pu,0).toFixed(2)})</div>}
            {toast && <div className="toast"><strong>{toast.title}</strong><br/><small>{toast.msg}</small></div>}
        </>
    )}
    </>
  );
}
