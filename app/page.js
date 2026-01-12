'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- BIBLIOTHÈQUE D'ICÔNES (SVG intégrés) ---
const Icon = ({ name, size = 20, className = "", style }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22v-9" />,
    building: <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4" />,
    handshake: <path d="m11 17 2 2a1 1 0 1 0 3-3M11 14l-3-3m8-2-9 9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9-9a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0" />,
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    car: <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" />,
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
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Zm-2 0h2v3a7 7 0 0 0 2 5H6a4 4 0 0 1-4-4V4h3Zm14 0h2v4a4 4 0 0 1-4 4h-3a7 7 0 0 0 2-5V4Z" />,
    refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
    reload: <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />,
    volume: <path d="M11 5 6 9H2v6h4l5 4V5Zm7.07 2.93a10 10 0 0 1 0 8.14M15.54 10.46a4 4 0 0 1 0 3.08" />,
    volumeOff: <path d="M11 5 6 9H2v6h4l5 4V5ZM22 9l-6 6M16 9l6 6" />,
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
    fuel: <path d="M3 22V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v17M14 3h.4a2 2 0 0 1 2 2V10M18 5v13a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V8l-3-3" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>
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
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState('home');

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');

  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [quickMode, setQuickMode] = useState(false);

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

  // Annuaire / Profil
  const [dirSearch, setDirSearch] = useState('');
  const [dirRole, setDirRole] = useState('Tous');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // =========================
  // Sons (WebAudio, sans fichiers)
  // =========================
  const beep = (type='click') => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);

      const preset = {
        click:   { freq: 520, dur: 0.05, gain: 0.05 },
        success: { freq: 740, dur: 0.09, gain: 0.06 },
        error:   { freq: 220, dur: 0.12, gain: 0.07 },
      }[type] || { freq: 520, dur: 0.05, gain: 0.05 };

      o.type = 'sine';
      o.frequency.value = preset.freq;
      g.gain.value = preset.gain;

      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, Math.floor(preset.dur * 1000));
    } catch {}
  };

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
    if (type === 'success') beep('success');
    if (type === 'error') beep('error');
  };

  // =========================
  // INIT
  // =========================
  const loadMeta = async () => {
    try {
        const res = await fetch('/api', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ action: 'getMeta' })
        });
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Erreur serveur (HTML reçu au lieu de JSON)");
        }
        return res.json();
    } catch (e) {
        console.error("Erreur meta:", e);
        return { success: false, employees: [], products: [], vehicles: [], partners: { companies: {} } };
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    setDarkMode(true);

    loadMeta()
      .then(res => {
        setData(res);
        setLoading(false);

        if(res?.vehicles?.length) {
          setExpData(p => ({...p, veh: res.vehicles[0]}));
          setGarData(p => ({...p, veh: res.vehicles[0]}));
        }
        if(res?.partners?.companies && Object.keys(res.partners.companies).length) {
          setParCompany(Object.keys(res.partners.companies)[0]);
        }
      })
      .catch(err => { 
        console.error(err); 
        setLoading(false);
        notify("Erreur", "Chargement des données impossible", "error");
      });
  }, []);

  useEffect(() => {
    if(data?.partners?.companies && parCompany) {
      const comp = data.partners.companies[parCompany];
      if(comp && comp.beneficiaries?.length) setParBenef(comp.beneficiaries[0]);
      if(comp && comp.menus?.length) setParItems([{menu: comp.menus[0].name, qty:1}]);
    }
  }, [parCompany, data]);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sync data (refresh sans reload)
  const syncData = async () => {
    notify("🔄 Synchronisation", "Récupération des données en cours...", "info");
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'syncData' })
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
        notify("✅ Succès", "Données synchronisées avec succès", "success");
      } else {
        notify("❌ Erreur", json.message || "Impossible de synchroniser", "error");
      }
    } catch (e) {
      notify("❌ Erreur", e.message, "error");
    }
  };

  const reloadApp = () => window.location.reload();

  const login = () => { if(user) { setView('app'); beep('click'); } };
  const logout = () => { setUser(''); setView('login'); setCurrentTab('home'); beep('click'); };

  // Helpers
  const employeesFull = data?.employeesFull || [];
  const myProfile = useMemo(() => employeesFull.find(e => e.name === user) || null, [employeesFull, user]);

  const addToCart = (prod) => {
    beep('click');
    const existing = cart.find(x => x.name === prod);
    if(existing) {
      setCart(cart.map(x => x.name === prod ? {...x, qty: x.qty + 1} : x));
    } else {
      setCart([...cart, {name: prod, qty: 1, pu: data?.prices?.[prod] || 0}]);
    }
    notify("🍕 Ajouté", prod, "success");
  };

  const modQty = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].qty += delta;
    if(newCart[idx].qty <= 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const setQty = (idx, value) => {
    const v = Math.max(0, Math.floor(Number(value || 0)));
    const newCart = [...cart];
    if (v <= 0) newCart.splice(idx, 1);
    else newCart[idx].qty = v;
    setCart(newCart);
  };

  const sendForm = async (action, payload) => {
    notify("📤 Envoi", "Veuillez patienter...", "info");
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action, data: { ...payload, employee: user } })
      });
      const json = await res.json();
      if(json.success) {
        notify("✅ Succès", "Action validée et transmise !", "success");
        if(['sendFactures'].includes(action)) setCurrentTab('home');

        setCart([]); setInvNum('');
        if(data?.products?.length) {
            setStockItems([{product:(data.products[0]), qty:1}]);
            setEntItems([{product:(data.products[0]), qty:1}]);
        }
        setEntName('');
        if(data?.partners?.companies?.[parCompany]?.menus?.length) {
            setParItems([{menu:(data.partners.companies[parCompany].menus[0].name), qty:1}]);
        }
        setParNum('');
        setSupData({sub:'Autre', msg:''});
        setExpData(p => ({...p, amt:''}));
        syncData();
      } else {
        notify("❌ Erreur", json.message, "error");
      }
    } catch(e) { notify("❌ Erreur", e.message, "error"); }
  };

  const handleSendInvoice = () => {
    if(!invNum.trim()) return notify("⚠️ Erreur", "Numéro de facture obligatoire", "error");
    if(cart.length === 0) return notify("⚠️ Erreur", "Le panier est vide", "error");
    sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
  };

  const handleSendEnterprise = () => {
    if(!entName.trim()) return notify("⚠️ Erreur", "Nom d'entreprise obligatoire", "error");
    sendForm('sendEntreprise', {company:entName, items:entItems});
  };

  const handleSendPartner = () => {
    if(!parNum.trim()) return notify("⚠️ Erreur", "Numéro de facture obligatoire", "error");
    sendForm('sendPartnerOrder', {company:parCompany, beneficiary:parBenef, invoiceNumber:parNum, items:parItems});
  };

  const handleSendExpense = () => {
    if(!expData.amt || expData.amt <= 0) return notify("⚠️ Erreur", "Montant obligatoire", "error");
    sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:expData.amt});
  };

  const topCA = useMemo(() => [...employeesFull].sort((a,b)=>b.ca-a.ca).slice(0,5), [employeesFull]);
  const topStock = useMemo(() => [...employeesFull].sort((a,b)=>b.stock-a.stock).slice(0,5), [employeesFull]);

  if(loading) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'white'}}>
      <div style={{textAlign:'center'}}>
        <motion.img 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          src="https://i.goopics.net/dskmxi.png" 
          style={{height:80, marginBottom:18, borderRadius:20}} alt="Logo" 
        />
        <div style={{opacity:0.9, fontWeight:900, fontSize:'1.5rem'}}>Hen House</div>
        <div style={{opacity:0.65, marginTop:6}}>Initialisation du système...</div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6;
          --primary-light: rgba(139, 92, 246, 0.16);
          --bg-body: #f8f9fc;
          --bg-panel: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --radius: 24px;
          --sidebar-w: 260px;
        }

        [data-theme="dark"] {
          --bg-body: #0a0b0e;
          --bg-panel: rgba(24, 26, 32, 0.7);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: rgba(255,255,255,0.08);
          --primary-light: rgba(139, 92, 246, 0.25);
          color-scheme: dark;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        
        body { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          background-color: var(--bg-body);
          background-image: 
            radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%);
          background-attachment: fixed;
          color: var(--text-main); 
          height: 100vh; 
          overflow: hidden; 
          display: flex; 
          transition: background-color 0.5s ease; 
        }

        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .sidebar { 
          width: var(--sidebar-w); 
          height: 96vh; 
          margin: 2vh; 
          background: rgba(15, 17, 21, 0.6); 
          backdrop-filter: blur(20px);
          border-radius: var(--radius); 
          display: flex; 
          flex-direction: column; 
          padding: 22px; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          z-index: 50; 
          border: 1px solid rgba(255,255,255,0.06); 
        }

        .nav-btn { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px; border: none; background: transparent;
          color: var(--text-muted); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-main); transform: translateX(5px); }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.5); }

        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        
        .prod-card { 
          background: rgba(255, 255, 255, 0.03); border-radius: 20px; padding: 14px; text-align:center; border: 1px solid rgba(255,255,255,0.05);
          cursor:pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .prod-card:hover { border-color: var(--primary); background: rgba(139, 92, 246, 0.05); }

        /* Vehicle Fuel Coloring */
        .fuel-safe { color: #2ecc71; }
        .fuel-warning { color: #f39c12; }
        .fuel-danger { color: #e74c3c; }

        .toast { 
          position: fixed; top: 26px; right: 26px; z-index: 3000; padding: 16px 20px;
          border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
          color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(15px);
        }
      `}</style>

      {view === 'login' ? (
        <div id="gate">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="login-box glass"
          >
            <img src="https://i.goopics.net/dskmxi.png" style={{height:80, marginBottom:18, borderRadius:20}} alt="Logo" />
            <h2 style={{marginBottom:10, fontWeight:1000, fontSize: '1.8rem'}}>Hen House</h2>
            <p style={{color:'var(--text-muted)', marginBottom:22}}>Système de Gestion Centralisé</p>

            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:16, textAlign:'center'}}>
              <option value="">Sélectionner votre matricule...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary" onClick={login} disabled={!user}
            >
              Initialiser la session <Icon name="dashboard" size={18} />
            </motion.button>

            <div style={{marginTop:16, opacity:0.5, fontSize:'0.75rem'}}>Version {data?.version}</div>
          </motion.div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div className="brand">
              <img src="https://i.goopics.net/dskmxi.png" alt="Logo"/> HEN HOUSE
            </div>

            <nav className="nav-list">
              {[
                {id: 'home', label: 'Dashboard', icon: 'dashboard'},
                {id: 'invoices', label: 'Caisse', icon: 'receipt'},
                {id: 'stock', label: 'Stock', icon: 'package'},
                {id: 'enterprise', label: 'Entreprise', icon: 'building'},
                {id: 'partners', label: 'Partenaires', icon: 'handshake'},
                {id: 'expenses', label: 'Frais', icon: 'creditCard'},
                {id: 'garage', label: 'Garage', icon: 'car'},
                {id: 'directory', label: 'Annuaire', icon: 'users'},
                {id: 'performance', label: 'Trophées', icon: 'trophy'},
                {id: 'support', label: 'Support', icon: 'lifeBuoy'},
              ].map(item => (
                <button 
                  key={item.id}
                  className={`nav-btn ${currentTab===item.id?'active':''}`} 
                  onClick={()=>setCurrentTab(item.id)}
                >
                  <Icon name={item.icon} /> {item.label}
                </button>
              ))}
            </nav>

            <div className="me-card glass">
              <div className="me-top" onClick={()=>setCurrentTab('profile')}>
                <div className="avatar">{user?.charAt(0) || '?'}</div>
                <div style={{flex:1}}>
                  <div className="me-name">{user}</div>
                  <div className="me-sub">{myProfile?.role || 'Employé'}</div>
                </div>
              </div>
              <div className="me-actions">
                <button className="mini-btn" onClick={()=>{beep('click'); setCurrentTab('profile');}}>Profil</button>
                <button className="mini-btn danger" onClick={logout}>Quitter</button>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="header-bar">
              <div className="page-title">
                {currentTab.toUpperCase()}
              </div>

              <div className="top-stats">
                <motion.div whileHover={{ scale: 1.05 }} className="chip glass" onClick={toggleTheme}>
                  {darkMode ? <Icon name="sun" size={18}/> : <Icon name="moon" size={18}/>}
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="chip glass" onClick={()=>setSoundOn(!soundOn)}>
                  {soundOn ? <Icon name="volume" size={18}/> : <Icon name="volumeOff" size={18}/>}
                </motion.div>

                <div className="mini-stat glass">Session: <strong>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</strong></div>

                <div className="icon-btn glass" onClick={syncData}><Icon name="refresh" size={18} /></div>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* DASHBOARD */}
                {currentTab === 'home' && (
                  <div className="dashboard-grid">
                    {[
                      {id: 'invoices', title: 'Caisse', desc: 'Ventes en direct', icon: 'receipt'},
                      {id: 'stock', title: 'Production', desc: 'Gestion stocks', icon: 'package'},
                      {id: 'enterprise', title: 'B2B', desc: 'Commandes pro', icon: 'building'},
                      {id: 'performance', title: 'Stats', desc: 'Performances', icon: 'trophy'}
                    ].map(card => (
                      <motion.div 
                        whileHover={{ y: -5 }}
                        key={card.id} className="dash-card glass" onClick={()=>setCurrentTab(card.id)}
                      >
                        <div className="dash-icon"><Icon name={card.icon} size={28} /></div>
                        <div><div className="dash-title">{card.title}</div><div className="dash-desc">{card.desc}</div></div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* CAISSE */}
                {currentTab === 'invoices' && (
                  <>
                    <div className="search-container">
                      <div className="search-icon"><Icon name="search" size={20} /></div>
                      <input className="search-inp" placeholder="Chercher un délice..." onChange={e=>setSearch(e.target.value)} />
                    </div>

                    <div className="cat-pills">
                      <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                      {data?.productsByCategory && Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace(/_/g,' ')}</div>
                      ))}
                    </div>

                    <div className="prod-grid" style={{ gridTemplateColumns: quickMode ? 'repeat(auto-fill, minmax(180px, 1fr))' : 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                      {data?.products?.filter(p => {
                        const cat = Object.keys(data?.productsByCategory || {}).find(k=>data.productsByCategory[k].includes(p));
                        return (catFilter==='Tous' || cat===catFilter) && p.toLowerCase().includes(search.toLowerCase());
                      }).map(p => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          key={p} className="prod-card glass" onClick={()=>addToCart(p)}
                        >
                          {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" alt={p} /> : <div className="prod-img">{p.charAt(0)}</div>}
                          <div className="prod-title">{p}</div>
                          <div className="prod-price">${Number(data?.prices?.[p]||0).toFixed(2)}</div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {/* GARAGE (Amélioration État Visuel) */}
                {currentTab === 'garage' && (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
                    {data?.vehicles?.map(v => {
                      const fuelLevel = v === garData.veh ? garData.fuel : 75; // Simulation
                      const fuelColor = fuelLevel > 75 ? '#2ecc71' : fuelLevel < 40 ? '#e74c3c' : '#f39c12';
                      
                      return (
                        <motion.div key={v} whileHover={{scale: 1.02}} className="dash-card glass" style={{height:'auto', padding:20}}>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:15}}>
                            <div className="dash-icon" style={{color: fuelColor}}><Icon name="car" size={28}/></div>
                            <div className="badge glass" style={{borderColor: fuelColor}}>{fuelLevel}%</div>
                          </div>
                          <div style={{fontWeight:900, marginBottom:5}}>{v.split(' - ')[0]}</div>
                          <div style={{fontSize:'0.8rem', opacity:0.6, marginBottom:15}}>Plaque: {v.split(' - ')[1]}</div>
                          <div style={{height:6, background:'rgba(255,255,255,0.05)', borderRadius:10, overflow:'hidden'}}>
                            <motion.div initial={{width:0}} animate={{width:`${fuelLevel}%`}} style={{height:'100%', background:fuelColor}} />
                          </div>
                          <button className="btn btn-text" style={{marginTop:15, fontSize:'0.8rem'}} onClick={()=>setGarData({...garData, veh: v})}>
                            Sélectionner
                          </button>
                        </motion.div>
                      );
                    })}
                    
                    {/* Formulaire Garage */}
                    <div className="form-wrap glass" style={{gridColumn: '1 / -1', marginTop: 20}}>
                       <div className="inp-group">
                        <label className="inp-label">Action sur {garData.veh.split(' - ')[0] || '...'}</label>
                        <select className="inp-field" value={garData.action} onChange={e=>setGarData({...garData, action:e.target.value})}>
                          <option>Entrée</option><option>Sortie</option>
                        </select>
                      </div>
                      <div className="inp-group">
                        <label className="inp-label">Niveau Carburant : {garData.fuel}%</label>
                        <input type="range" style={{width:'100%'}} value={garData.fuel} onChange={e=>setGarData({...garData, fuel:e.target.value})} />
                      </div>
                      <button className="btn btn-primary" onClick={()=>sendForm('sendGarage', garData)}>Mettre à jour l'état</button>
                    </div>
                  </div>
                )}

                {/* STOCK */}
                {currentTab === 'stock' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="package" /> Stock Cuisine</h2>
                    {stockItems.map((item, i) => (
                      <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                        <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                          <option value="" disabled>Produit...</option>
                          {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="number" className="inp-field" style={{width:120}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                        <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}}><Icon name="x" size={18}/></button>
                      </div>
                    ))}
                    <button className="btn btn-text" onClick={()=>setStockItems([...stockItems, {product:(data?.products?.[0] || ''), qty:1}])}>+ Ajouter</button>
                    <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Déclarer la production</button>
                  </div>
                )}

                {/* ENTREPRISE */}
                {currentTab === 'enterprise' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:16}}><Icon name="building" /> Commande Entreprise</h2>
                    <div className="inp-group">
                      <label className="inp-label">Nom Entreprise</label>
                      <input className="inp-field" value={entName} onChange={e=>setEntName(e.target.value)} placeholder="Ex: SASP, Biogood..." />
                    </div>
                    {entItems.map((item, i) => (
                      <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                        <select className="inp-field" value={item.product} onChange={e=>{const n=[...entItems];n[i].product=e.target.value;setEntItems(n)}} style={{flex:1}}>
                          {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="number" className="inp-field" style={{width:100}} value={item.qty} onChange={e=>{const n=[...entItems];n[i].qty=e.target.value;setEntItems(n)}} />
                        <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...entItems];n.splice(i,1);setEntItems(n)}}><Icon name="x" size={18}/></button>
                      </div>
                    ))}
                    <button className="btn btn-text" onClick={()=>setEntItems([...entItems, {product:(data?.products?.[0] || ''), qty:1}])}>+ Ligne</button>
                    <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSendEnterprise}>Valider la commande B2B</button>
                  </div>
                )}

                {/* PARTENAIRES */}
                {currentTab === 'partners' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:16}}><Icon name="handshake" /> Partenaires</h2>
                    <div className="inp-group">
                      <label className="inp-label">N° Facture</label>
                      <input className="inp-field" value={parNum} onChange={e=>setParNum(e.target.value)} />
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                      <div className="inp-group">
                        <label className="inp-label">Société</label>
                        <select className="inp-field" value={parCompany} onChange={e=>setParCompany(e.target.value)}>
                          {data?.partners?.companies && Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="inp-group">
                        <label className="inp-label">Bénéficiaire</label>
                        <select className="inp-field" value={parBenef} onChange={e=>setParBenef(e.target.value)}>
                          {parCompany && data?.partners?.companies?.[parCompany]?.beneficiaries?.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    {parItems.map((item, i) => (
                      <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                        <select className="inp-field" value={item.menu} onChange={e=>{const n=[...parItems];n[i].menu=e.target.value;setParItems(n)}} style={{flex:1}}>
                          {parCompany && data?.partners?.companies?.[parCompany]?.menus?.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
                        </select>
                        <input type="number" className="inp-field" style={{width:100}} value={item.qty} onChange={e=>{const n=[...parItems];n[i].qty=e.target.value;setParItems(n)}} />
                        <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...parItems];n.splice(i,1);setParItems(n)}}><Icon name="x" size={18}/></button>
                      </div>
                    ))}
                    <button className="btn btn-text" onClick={()=>setParItems([...parItems, {menu:(data?.partners?.companies?.[parCompany]?.menus?.[0]?.name || ''), qty:1}])}>+ Menu</button>
                    <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSendPartner}>Confirmer la livraison</button>
                  </div>
                )}

                {/* FRAIS */}
                {currentTab === 'expenses' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:16}}><Icon name="creditCard" /> Déclaration de Frais</h2>
                    <div className="inp-group">
                      <label className="inp-label">Véhicule</label>
                      <select className="inp-field" value={expData.veh} onChange={e=>setExpData({...expData, veh:e.target.value})}>
                        {data?.vehicles?.map(v=><option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="inp-group">
                      <label className="inp-label">Nature du frais</label>
                      <select className="inp-field" value={expData.kind} onChange={e=>setExpData({...expData, kind:e.target.value})}>
                        <option>Essence</option><option>Réparation</option><option>Amende</option>
                      </select>
                    </div>
                    <div className="inp-group">
                      <label className="inp-label">Montant déboursé ($)</label>
                      <input type="number" className="inp-field" value={expData.amt} onChange={e=>setExpData({...expData, amt:e.target.value})} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSendExpense}>Transmettre la note</button>
                  </div>
                )}

                {/* SUPPORT */}
                {currentTab === 'support' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:16}}><Icon name="lifeBuoy" /> Support & Aide</h2>
                    <div className="inp-group">
                      <label className="inp-label">Sujet de l'alerte</label>
                      <select className="inp-field" value={supData.sub} onChange={e=>setSupData({...supData, sub:e.target.value})}>
                        <option>Problème Stock</option><option>Urgence Client</option><option>Autre</option>
                      </select>
                    </div>
                    <div className="inp-group">
                      <label className="inp-label">Message</label>
                      <textarea className="inp-field" style={{height:150}} value={supData.msg} onChange={e=>setSupData({...supData, msg:e.target.value})} placeholder="Décrivez votre problème ici..."></textarea>
                    </div>
                    <button className="btn btn-primary" onClick={()=>sendForm('sendSupport', supData)}>Envoyer le message</button>
                  </div>
                )}

                {/* DIRECTORY */}
                {currentTab === 'directory' && (
                  <div className="list-card glass" style={{maxWidth:900, margin:'0 auto'}}>
                    <div style={{display:'flex', gap:12, marginBottom:14, flexWrap:'wrap'}}>
                      <input className="search-inp" style={{flex:1}} placeholder="Rechercher un collègue..." value={dirSearch} onChange={e=>setDirSearch(e.target.value)} />
                      <select className="inp-field" style={{width:200}} value={dirRole} onChange={e=>setDirRole(e.target.value)}>
                        <option value="Tous">Tous les rôles</option>
                        {employeesFull?.length ? [...new Set(employeesFull.map(e=>e.role).filter(Boolean))].map(r => <option key={r} value={r}>{r}</option>) : null}
                      </select>
                    </div>
                    {employeesFull?.filter(e => (dirRole==='Tous' || e.role===dirRole) && e.name.toLowerCase().includes(dirSearch.toLowerCase())).map(e => (
                      <div key={e.name} className="row" onClick={()=>setSelectedEmployee(e)}>
                        <div style={{display:'flex', gap:12, alignItems:'center'}}>
                          <div className="avatar glass" style={{width:40, height:40}}>{e.name.charAt(0)}</div>
                          <div><div style={{fontWeight:900}}>{e.name}</div><div style={{fontSize:'0.8rem', opacity:0.6}}>{e.phone || 'Pas de numéro'}</div></div>
                        </div>
                        <div className="badge glass">{e.role || 'Employé'}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PERFORMANCE */}
                {currentTab === 'performance' && (
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:1000, margin:'0 auto'}}>
                    <div className="list-card glass">
                      <div style={{fontWeight:900, marginBottom:15, color: 'var(--primary)'}}>🏆 TOP CHIFFRE D'AFFAIRES</div>
                      {topCA?.map((e, idx) => (
                        <div key={e.name} className="row">
                          <div style={{display:'flex', gap:10, alignItems:'center'}}>
                            <div className="badge glass" style={{width:30, textAlign:'center'}}>{idx+1}</div>
                            <div style={{fontWeight:900}}>{e.name}</div>
                          </div>
                          <div style={{fontWeight:900}}>${Number(e.ca || 0).toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="list-card glass">
                      <div style={{fontWeight:900, marginBottom:15, color: '#f39c12'}}>🥘 TOP PRODUCTION STOCK</div>
                      {topStock?.map((e, idx) => (
                        <div key={e.name} className="row">
                          <div style={{display:'flex', gap:10, alignItems:'center'}}>
                            <div className="badge glass" style={{width:30, textAlign:'center'}}>{idx+1}</div>
                            <div style={{fontWeight:900}}>{e.name}</div>
                          </div>
                          <div style={{fontWeight:900}}>{e.stock || 0}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROFIL */}
                {currentTab === 'profile' && (
                  <div className="form-wrap glass">
                    <h2 style={{marginBottom:20, display:'flex', alignItems:'center', gap:15}}><div className="avatar" style={{width:50, height:50}}>{user.charAt(0)}</div> {user}</h2>
                    {!myProfile ? <div>Données de profil introuvables.</div> : (
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                        <div className="mini-stat glass" style={{flexDirection:'column', alignItems:'flex-start', padding:20}}>
                          <div style={{opacity:0.6, fontSize:'0.8rem'}}>POSTE</div><div style={{fontWeight:900, fontSize:'1.2rem'}}>{myProfile.role}</div>
                        </div>
                        <div className="mini-stat glass" style={{flexDirection:'column', alignItems:'flex-start', padding:20}}>
                          <div style={{opacity:0.6, fontSize:'0.8rem'}}>ANCIENNETÉ</div><div style={{fontWeight:900, fontSize:'1.2rem'}}>{myProfile.seniority} jours</div>
                        </div>
                        <div className="mini-stat glass" style={{flexDirection:'column', alignItems:'flex-start', padding:20, gridColumn:'1 / -1'}}>
                          <div style={{opacity:0.6, fontSize:'0.8rem'}}>CA TOTAL GÉNÉRÉ</div><div style={{fontWeight:900, fontSize:'1.8rem', color:'var(--primary)'}}>${Number(myProfile.ca || 0).toFixed(2)}</div>
                        </div>
                        <button className="btn btn-primary" style={{gridColumn:'1 / -1'}} onClick={syncData}>Rafraîchir mes stats</button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* PANIER FLOTTANT */}
          {currentTab === 'invoices' && (
            <>
              <motion.div 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="cart-btn-float glass" onClick={()=>setCartOpen(true)}
              >
                <Icon name="cart" size={22} /> <span>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                <span style={{opacity:0.6}}>• {cart.reduce((s,i)=>s+i.qty,0)}</span>
              </motion.div>

              <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-head">
                  <h2 style={{fontWeight:900}}>Panier Client</h2>
                  <button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none', cursor:'pointer', color:'inherit'}}><Icon name="x" size={24} /></button>
                </div>
                <div style={{padding:18}}><input className="inp-field glass" placeholder="N° Facture" style={{textAlign:'center', fontWeight:900}} value={invNum} onChange={e=>setInvNum(e.target.value)} /></div>
                <div className="cart-body">
                  {cart.length === 0 && <div style={{textAlign:'center', marginTop:100, opacity:0.3}}>Votre panier est vide</div>}
                  {cart.map((c, i) => (
                    <motion.div initial={{ x: 20 }} animate={{ x: 0 }} key={i} className="cart-item glass">
                      <div style={{flex:1}}><b style={{fontWeight:900}}>{c.name}</b><br/><small style={{opacity:0.6}}>${c.pu.toFixed(2)} / u</small></div>
                      <div className="qty-ctrl glass">
                        <button className="qb" onClick={()=>modQty(i,-1)}>-</button>
                        <input className="qi-inp" type="number" value={c.qty} onChange={(e)=>setQty(i, e.target.value)} />
                        <button className="qb" onClick={()=>modQty(i,1)}>+</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="cart-foot">
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.3rem', fontWeight:900, marginBottom:15}}><span>Total</span><span style={{color:'var(--primary)'}}>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span></div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>Enregistrer la vente</button>
                </div>
              </aside>
            </>
          )}

          {/* NOTIFICATIONS (Améliorées) */}
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="toast" 
                style={{
                  borderLeft: `6px solid ${toast.type==='error'?'#ef4444':(toast.type==='success'?'#10b981':'#3b82f6')}`,
                  background: toast.type==='error'?'rgba(239, 68, 68, 0.1)':'rgba(16, 185, 129, 0.1)'
                }}
              >
                <div style={{fontWeight:900}}>{toast.title}</div>
                <div style={{fontSize:'0.85rem', opacity:0.8}}>{toast.msg}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
