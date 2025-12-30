'use client';
import { useState, useEffect } from 'react';

// --- BIBLIOTHÈQUE D'ICÔNES (SVG intégrés et corrigés) ---
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: (
      <>
        <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.3 7l8.7 5 8.7-5M12 22v-9" />
      </>
    ),
    building: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </>
    ),
    handshake: (
      <>
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="M11 14l-3-3" />
        <path d="m18 9-9 9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9-9a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0" />
      </>
    ),
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    car: (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <path d="M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" />
      </>
    ),
    lifeBuoy: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.39-3.39M4.93 19.07l4.24-4.24" />
      </>
    ),
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    cart: (
      <>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </>
    ),
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    trophy: (
      <>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </>
    ),
    chef: (
      <>
        <path d="M6 18h12" />
        <path d="M12 10V4" />
        <path d="M7 10a5 5 0 0 1 10 0v2H7z" />
        <path d="M7 14h10v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      </>
    )
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

// IMAGES PRODUITS
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
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [submitting, setSubmitting] = useState(false); 

  // États formulaires
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
        setLoading(false);
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
    notify("Envoi...", "Traitement en cours", "info");
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
            notify("Erreur", "Problème serveur", "error");
        }
    } catch(e) { notify("Erreur", "Connexion interrompue", "error"); }
    finally { setSubmitting(false); }
  };

  const handleSendInvoice = () => {
      if(!invNum.trim()) return notify("Erreur", "Le N° de facture est OBLIGATOIRE", "error");
      if(cart.length === 0) return notify("Erreur", "Le panier est vide", "error");
      sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
  };

  const handleSendEnterprise = () => {
      if(!entName.trim()) return notify("Erreur", "Le nom d'entreprise est OBLIGATOIRE", "error");
      sendForm('sendEntreprise', {company:entName, items:entItems});
  };

  const handleSendPartner = () => {
      if(!parNum.trim()) return notify("Erreur", "Le N° de facture est OBLIGATOIRE", "error");
      sendForm('sendPartnerOrder', {company:parCompany, beneficiary:parBenef, invoiceNumber:parNum, items:parItems});
  };

  const handleSendExpense = () => {
      if(!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
      sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:expData.amt});
  };

  const isManagement = user && ['PDG', 'Co-PDG', 'Manager'].includes(user.poste);
  const topEmployees = data?.employees ? [...data.employees].sort((a,b) => b.ca - a.ca).slice(0, 3) : [];

  if(loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'white'}}>Chargement Hen House...</div>;

  return (
    <>
    <style jsx global>{`
        :root { --primary: #ff6a2b; --bg-body: #f8f9fc; --bg-panel: #ffffff; --text-main: #1e293b; --text-muted: #64748b; --border: #e2e8f0; --radius: 24px; --sidebar-w: 260px; }
        [data-theme="dark"] { --bg-body: #0f1115; --bg-panel: #181a20; --text-main: #f8fafc; --text-muted: #94a3b8; --border: #2d313a; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; transition: background-color 0.3s ease; }
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: var(--bg-panel); border-radius: var(--radius); display: flex; flex-direction: column; padding: 25px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); z-index: 50; border: 1px solid var(--border); }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; margin-bottom: 40px; color: var(--text-main); }
        .brand img { height: 32px; border-radius: 8px; }
        .nav-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border: none; background: transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: 0.2s; width: 100%; text-align: left; }
        .nav-btn:hover { background: var(--bg-body); }
        .nav-btn.active { background: var(--primary); color: white; }
        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .page-title { font-size: 1.8rem; font-weight: 800; display:flex; align-items:center; gap:10px; }
        .top-stats { display: flex; gap: 15px; align-items: center; }
        .mini-stat { background: var(--bg-panel); padding: 8px 20px; border-radius: 50px; border: 1px solid var(--border); display: flex; gap: 10px; align-items: center; font-weight: 600; font-size: 0.9rem; color: var(--text-muted); }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .dash-card { background: var(--bg-panel); border-radius: var(--radius); padding: 30px; border: 1px solid var(--border); position: relative; overflow: hidden; cursor: pointer; transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; justify-content: space-between; height: 200px; }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1); }
        .dash-icon { width: 50px; height: 50px; background: var(--bg-body); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; color: var(--primary); }
        .dash-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 5px; }
        .dash-desc { font-size: 0.9rem; color: var(--text-muted); }
        .search-container { position: relative; margin-bottom: 25px; max-width: 450px; }
        .search-inp { width: 100%; padding: 16px 20px 16px 50px; border-radius: 18px; border: 1px solid var(--border); background: var(--bg-panel); font-size: 1rem; color: var(--text-main); font-weight: 600; transition: 0.2s; }
        .search-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .cat-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px; }
        .pill { padding: 8px 20px; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 50px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: 0.2s; color: var(--text-muted); }
        .pill:hover, .pill.active { border-color: var(--primary); color: white; background: var(--primary); }
        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
        .prod-card { background: var(--bg-panel); border-radius: 20px; padding: 15px; text-align: center; border: 1px solid var(--border); cursor: pointer; transition: 0.2s; position: relative; }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1); }
        .prod-img { width: 100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 15px; object-fit: cover; background: var(--bg-body); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--text-muted); }
        .prod-title { font-weight: 700; font-size: 0.9rem; margin-bottom: 5px; line-height: 1.3; }
        .prod-price { color: var(--primary); font-weight: 800; font-size: 1.1rem; }
        .cart-drawer { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: var(--bg-panel); box-shadow: -10px 0 40px rgba(0,0,0,0.2); z-index: 100; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; border-left: 1px solid var(--border); }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .cart-body { flex: 1; overflow-y: auto; padding: 20px; }
        .cart-foot { padding: 30px; background: var(--bg-body); border-top: 1px solid var(--border); }
        .cart-item { display: flex; align-items: center; gap: 15px; padding: 15px; background: var(--bg-body); border-radius: 16px; margin-bottom: 10px; border: 1px solid var(--border); }
        .qty-ctrl { display: flex; align-items: center; background: var(--bg-panel); border-radius: 10px; padding: 2px; border: 1px solid var(--border); }
        .qb { width: 30px; height: 30px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-main); }
        .qi { width: 30px; border: none; background: transparent; text-align: center; font-weight: 700; color: var(--text-main); }
        .btn { width: 100%; padding: 16px; border: none; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 20px -5px rgba(255, 106, 43, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(255, 106, 43, 0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-wrap { background: var(--bg-panel); padding: 40px; border-radius: 30px; max-width: 600px; margin: 0 auto; border: 1px solid var(--border); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        .inp-field { width: 100%; padding: 14px; border: 2px solid var(--border); background: var(--bg-body); border-radius: 12px; font-size: 1rem; color: var(--text-main); margin-bottom: 20px; }
        #gate { position: fixed; inset: 0; background: var(--bg-body); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .login-box { text-align: center; width: 400px; padding: 40px; border: 1px solid var(--border); background: var(--bg-panel); border-radius: 30px; }
        .toast { position: fixed; top: 30px; right: 30px; z-index: 3000; background: var(--bg-panel); padding: 15px 25px; border-radius: 16px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2); border-left: 5px solid var(--primary); min-width: 280px; animation: slideIn 0.3s; color: var(--text-main); }
        @keyframes slideIn { from { transform: translateX(100%); } }
        .avatar { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    `}</style>

    {view === 'login' ? (
        <div id="gate" style={{width:'100vw', display:'flex', justifyContent:'center', alignItems:'center', background:'var(--bg-body)'}}>
            <div className="form-wrap" style={{textAlign:'center', width:400}}>
                <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:20}} />
                <h2>Identification</h2>
                <select className="inp-field" style={{marginTop:30}} onChange={e => {
                    const emp = data.employees.find(x => x.nom === e.target.value);
                    setUser(emp);
                }}>
                    <option value="">Sélectionner votre nom...</option>
                    {data?.employees?.map(e => <option key={e.nom} value={e.nom}>{e.nom}</option>)}
                </select>
                <button className="btn-primary" onClick={login} disabled={!user}>Accéder</button>
            </div>
        </div>
    ) : (
        <>
            <aside className="sidebar">
                <div className="brand" style={{display:'flex', alignItems:'center', gap:12, fontWeight:800, marginBottom:40}}><img src="https://i.goopics.net/dskmxi.png" height="32" /> HEN HOUSE</div>
                <nav className="nav-list">
                    <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}><Icon name="dashboard" /> Accueil</button>
                    <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" /> Caisse</button>
                    <button className={`nav-btn ${currentTab==='recipes'?'active':''}`} onClick={()=>setCurrentTab('recipes')}><Icon name="chef" /> Cuisine</button>
                    <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}><Icon name="package" /> Stock</button>
                    {isManagement && (
                        <>
                        <button className={`nav-btn ${currentTab==='enterprise'?'active':''}`} onClick={()=>setCurrentTab('enterprise')}><Icon name="building" /> Entreprise</button>
                        <button className={`nav-btn ${currentTab==='partners'?'active':''}`} onClick={()=>setCurrentTab('partners')}><Icon name="handshake" /> Partenaires</button>
                        </>
                    )}
                    <button className={`nav-btn ${currentTab==='expenses'?'active':''}`} onClick={()=>setCurrentTab('expenses')}><Icon name="creditCard" /> Frais</button>
                    <button className={`nav-btn ${currentTab==='garage'?'active':''}`} onClick={()=>setCurrentTab('garage')}><Icon name="car" /> Garage</button>
                    <button className={`nav-btn ${currentTab==='team'?'active':''}`} onClick={()=>setCurrentTab('team')}><Icon name="users" /> Équipe</button>
                    <button className={`nav-btn ${currentTab==='support'?'active':''}`} onClick={()=>setCurrentTab('support')}><Icon name="lifeBuoy" /> Support</button>
                </nav>
                <div className="user-profile" style={{marginTop:'auto', padding:15, background:'var(--bg-body)', borderRadius:16, cursor:'pointer'}} onClick={logout}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <div className="avatar">{user.nom.charAt(0)}</div>
                        <div><strong>{user.nom}</strong><br/><small>{user.poste}</small></div>
                        <Icon name="logout" size={16} style={{marginLeft:'auto'}} />
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="header-bar">
                    <div className="page-title" style={{fontSize:'1.8rem', fontWeight:800}}>{currentTab.toUpperCase()}</div>
                    <div className="top-stats">
                        <div className="mini-stat">Session: <strong>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</strong></div>
                        <button onClick={toggleTheme} style={{background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:50, width:40, height:40, cursor:'pointer'}}><Icon name={darkMode?'sun':'moon'} /></button>
                    </div>
                </header>

                {currentTab === 'home' && (
                    <>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:40}}>
                        {topEmployees.map((e,i)=>(
                            <div key={e.nom} className="dash-card" style={{display:'flex', alignItems:'center', gap:15, borderLeft:`5px solid ${i===0?'#ffd700':i===1?'#c0c0c0':'#cd7f32'}`}}>
                                <div style={{fontSize:'2rem'}}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                                <div><strong>{e.nom}</strong><br/><span style={{color:'var(--primary)', fontWeight:700}}>${e.ca}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className="dashboard-grid">
                        <div className="dash-card" onClick={()=>setCurrentTab('invoices')}><div className="dash-icon"><Icon name="receipt" size={28} /></div><div><strong>Caisse</strong><p>Nouvelle vente</p></div></div>
                        <div className="dash-card" onClick={()=>setCurrentTab('recipes')}><div className="dash-icon"><Icon name="chef" size={28} /></div><div><strong>Cuisine</strong><p>Livre de recettes</p></div></div>
                    </div>
                    </>
                )}

                {currentTab === 'recipes' && (
                    <div className="dashboard-grid">
                        {Object.entries(data.recipes).map(([name, desc]) => (
                            <div key={name} className="dash-card">
                                <strong style={{color:'var(--primary)'}}>{name}</strong>
                                <p style={{marginTop:10, fontSize:'0.9rem', lineHeight:1.5}}>{desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {currentTab === 'team' && (
                    <div className="dashboard-grid">
                        {data.employees.map(emp => (
                            <div key={emp.nom} className="dash-card" style={{display:'flex', alignItems:'center', gap:15, height:'auto'}}>
                                <div className="avatar">{emp.nom.charAt(0)}</div>
                                <div><strong>{emp.nom}</strong><br/><small>{emp.poste}</small><br/><span style={{color:'var(--primary)', fontWeight:800}}>📞 {emp.tel}</span></div>
                            </div>
                        ))}
                    </div>
                )}

                {currentTab === 'invoices' && (
                    <>
                    <div className="search-container"><div className="search-icon"><Icon name="search" size={20} /></div><input className="search-inp" placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} /></div>
                    <div className="prod-grid">
                        {data.products.filter(p=>p.toLowerCase().includes(search.toLowerCase())).map(p => (
                            <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                                {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img">{p.charAt(0)}</div>}
                                <strong>{p}</strong><br/><span style={{color:'var(--primary)', fontWeight:800}}>${data.prices[p]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart-btn-float" onClick={()=>setCartOpen(true)}><Icon name="cart" size={24} color="white" /> <span>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span></div>
                    </>
                )}

                {currentTab === 'stock' && (
                    <div className="form-wrap">
                        <h2>📦 Déclaration Stock</h2>
                        {stockItems.map((item, i) => (
                            <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                <select className="inp-field" style={{flex:1}} value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}}>
                                    <option value="">Produit...</option>{data.products.map(p=><option key={p}>{p}</option>)}
                                </select>
                                <input type="number" className="inp-field" style={{width:80}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                            </div>
                        ))}
                        <button className="btn btn-primary" onClick={()=>sendForm('sendProduction', {items:stockItems})} disabled={submitting}>Envoyer</button>
                    </div>
                )}

                {currentTab === 'enterprise' && (
                    <div className="form-wrap"><h2>Entreprise</h2><input className="inp-field" placeholder="Nom..." value={entName} onChange={e=>setEntName(e.target.value)}/><button className="btn btn-primary" onClick={handleSendEnterprise} disabled={submitting}>Valider</button></div>
                )}
                
                {currentTab === 'partners' && (
                    <div className="form-wrap"><h2>Partenaires</h2><input className="inp-field" placeholder="N° Facture..." value={parNum} onChange={e=>setParNum(e.target.value)}/><button className="btn btn-primary" onClick={handleSendPartner} disabled={submitting}>Confirmer</button></div>
                )}

                {currentTab === 'expenses' && (
                    <div className="form-wrap"><h2>Frais</h2><input type="number" className="inp-field" placeholder="Montant..." value={expData.amt} onChange={e=>setExpData({...expData, amt:e.target.value})}/><button className="btn btn-primary" onClick={handleSendExpense} disabled={submitting}>Déclarer</button></div>
                )}

                {currentTab === 'garage' && (
                    <div className="form-wrap"><h2>Garage</h2><select className="inp-field" onChange={e=>setGarData({...garData, veh:e.target.value})}>{data.vehicles.map(v=><option key={v}>{v}</option>)}</select><button className="btn btn-primary" onClick={()=>sendForm('sendGarage', garData)} disabled={submitting}>Mettre à jour</button></div>
                )}

                {currentTab === 'support' && (
                    <div className="form-wrap"><h2>Support</h2><textarea className="inp-field" placeholder="Message..." onChange={e=>setSupData({...supData, msg:e.target.value})}></textarea><button className="btn btn-primary" onClick={()=>sendForm('sendSupport', supData)} disabled={submitting}>Envoyer</button></div>
                )}
            </main>

            <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-head"><h2>Votre Panier</h2><button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none'}}><Icon name="x" size={24}/></button></div>
                <div style={{flex:1, padding:25, overflowY:'auto'}}>
                    <input className="inp-field" placeholder="N° FACTURE OBLIGATOIRE" value={invNum} onChange={e=>setInvNum(e.target.value)} style={{textAlign:'center', fontWeight:800}} />
                    {cart.map((c, i) => (<div key={i} style={{marginBottom:15, display:'flex', justifyContent:'space-between'}}><span>{c.name} x{c.qty}</span><strong>${(c.qty*c.pu).toFixed(2)}</strong></div>))}
                </div>
                <div style={{padding:25, background:'var(--bg-body)'}}>
                    <button className="btn btn-primary" disabled={submitting || !invNum.trim()} onClick={handleSendInvoice}>Valider la Vente</button>
                </div>
            </aside>

            {toast && <div className="toast"><strong>{toast.title}</strong><br/><small>{toast.msg}</small></div>}
        </>
    )}
    </>
  );
}
