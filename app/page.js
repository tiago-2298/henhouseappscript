'use client';
import { useState, useEffect, useMemo } from 'react';

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
    notify("Sync...", "Récupération des données", "info");
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'syncData' })
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
        notify("OK", "Données synchronisées", "success");
      } else {
        notify("Erreur", json.message || "Sync impossible", "error");
      }
    } catch (e) {
      notify("Erreur", e.message, "error");
    }
  };

  const reloadApp = () => window.location.reload();

  const login = () => { if(user) { setView('app'); beep('click'); } };
  const logout = () => { setUser(''); setView('login'); setCurrentTab('home'); beep('click'); };

  // =========================
  // Helpers employees (full)
  // =========================
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
    notify("Ajouté", prod, "success");
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
        if(['sendFactures'].includes(action)) setCurrentTab('home');

        // Reset forms
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

        // Sync après actions importantes
        syncData();
      } else {
        notify("Erreur", json.message, "error");
      }
    } catch(e) { notify("Erreur", e.message, "error"); }
  };

  const handleSendInvoice = () => {
    if(!invNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    if(cart.length === 0) return notify("Erreur", "Le panier est vide", "error");
    sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
  };

  const handleSendEnterprise = () => {
    if(!entName.trim()) return notify("Erreur", "Le nom de l'entreprise est OBLIGATOIRE", "error");
    sendForm('sendEntreprise', {company:entName, items:entItems});
  };

  const handleSendPartner = () => {
    if(!parNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    sendForm('sendPartnerOrder', {company:parCompany, beneficiary:parBenef, invoiceNumber:parNum, items:parItems});
  };

  const handleSendExpense = () => {
    if(!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:expData.amt});
  };

  // =========================
  // Performance
  // =========================
  const topCA = useMemo(() => [...employeesFull].sort((a,b)=>b.ca-a.ca).slice(0,5), [employeesFull]);
  const topStock = useMemo(() => [...employeesFull].sort((a,b)=>b.stock-a.stock).slice(0,5), [employeesFull]);

  // =========================
  // Loading
  // =========================
  if(loading) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'white'}}>
      <div style={{textAlign:'center'}}>
        <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:18, borderRadius:12}} alt="Logo" />
        <div style={{opacity:0.9, fontWeight:800}}>Hen House</div>
        <div style={{opacity:0.65, marginTop:6}}>Connexion...</div>
        <div style={{marginTop:18, width:220, height:10, borderRadius:20, background:'rgba(255,255,255,0.08)', overflow:'hidden'}}>
          <div className="shimmer" style={{height:'100%', width:'45%'}} />
        </div>
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
          --bg-body: #0f1115;
          --bg-panel: #181a20;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: #2d313a;
          --primary-light: rgba(139, 92, 246, 0.18);
          color-scheme: dark;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; transition: background-color 0.3s ease; }

        select, option, input, textarea {
          color: var(--text-main);
          background: var(--bg-panel);
        }
        select {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding-right: 38px;
          appearance: none;
          -webkit-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
            linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) calc(50% - 3px),
            calc(100% - 12px) calc(50% - 3px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }
        option { background: var(--bg-panel) !important; color: var(--text-main) !important; }
        select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.18), rgba(255,255,255,0.02));
          animation: shimmer 1.1s infinite;
        }
        @keyframes shimmer { 0%{transform:translateX(-60%)} 100%{transform:translateX(240%)} }

        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: rgba(24,26,32,0.88); backdrop-filter: blur(14px);
          border-radius: var(--radius); display: flex; flex-direction: column; padding: 22px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
          z-index: 50; border: 1px solid rgba(255,255,255,0.06); }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 900; font-size: 1.2rem; margin-bottom: 26px; color: var(--text-main); }
        .brand img { height: 34px; border-radius: 12px; }
        .nav-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px; border: none; background: transparent;
          color: var(--text-muted); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.18s; font-family: inherit; }
        .nav-btn:hover { background: rgba(255,255,255,0.04); color: var(--text-main); }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 10px 26px -10px rgba(139, 92, 246, 0.7); }
        .nav-btn.active svg { stroke-width: 3px; }

        .me-card { margin-top: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 14px; }
        .me-top { display:flex; align-items:center; gap:12px; cursor:pointer; }
        .avatar { width: 38px; height: 38px; background: var(--primary); color: white; border-radius: 14px; display:flex; align-items:center; justify-content:center;
          font-weight: 900; }
        .me-name { font-weight: 900; line-height: 1.1; }
        .me-sub { font-size: 0.82rem; color: var(--text-muted); margin-top: 3px; }
        .me-actions { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .mini-btn { display:flex; align-items:center; justify-content:center; gap:8px; padding: 10px 12px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); color: var(--text-main); font-weight: 800; cursor:pointer; }
        .mini-btn:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }
        .mini-btn.danger { border-color: rgba(239,68,68,0.5); color: #fecaca; }
        .mini-btn.danger:hover { background: rgba(239,68,68,0.08); }

        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 10px; }
        .page-title { font-size: 1.8rem; font-weight: 900; display:flex; align-items:center; gap:10px; }
        .top-stats { display: flex; gap: 12px; align-items: center; }
        .mini-stat { background: rgba(255,255,255,0.04); padding: 8px 16px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.07);
          display:flex; gap:10px; align-items:center; font-weight: 800; font-size: 0.9rem; color: var(--text-muted); }
        .mini-stat strong { color: var(--text-main); }

        .chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          padding: 10px 14px; border-radius: 999px; display:flex; align-items:center; gap:10px; font-weight: 900; cursor:pointer; }
        .chip:hover { border-color: rgba(255,255,255,0.22); }
        .toggle { width: 44px; height: 26px; border-radius: 999px; background: rgba(255,255,255,0.12); position:relative; border: 1px solid rgba(255,255,255,0.08); }
        .dot { width: 22px; height: 22px; border-radius: 999px; background: white; position:absolute; top:1px; left:1px; transition: 0.18s; }
        .toggle.on { background: rgba(139,92,246,0.35); }
        .toggle.on .dot { left: 21px; }

        .icon-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          width: 42px; height: 42px; border-radius: 999px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .icon-btn:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }

        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .dash-card { background: rgba(255,255,255,0.04); border-radius: var(--radius); padding: 26px; border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; cursor: pointer; transition: 0.25s; display:flex; flex-direction:column; justify-content:space-between; height: 190px; }
        .dash-card:hover { transform: translateY(-4px); border-color: rgba(139,92,246,0.7); box-shadow: 0 18px 32px -18px rgba(0,0,0,0.5); }
        .dash-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.04); border-radius: 16px; display:flex; align-items:center; justify-content:center; margin-bottom: 14px; color: var(--primary); }
        .dash-title { font-size: 1.18rem; font-weight: 900; margin-bottom: 6px; }
        .dash-desc { font-size: 0.92rem; color: var(--text-muted); }

        .search-container { position: relative; margin-bottom: 18px; max-width: 520px; }
        .search-inp { width: 100%; padding: 14px 16px 14px 46px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); font-size: 1rem; color: var(--text-main); font-weight: 800; transition: 0.2s; }
        .search-inp:focus { border-color: rgba(139,92,246,0.7); box-shadow: 0 0 0 3px var(--primary-light); }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .cat-pills { display:flex; gap: 10px; overflow-x:auto; padding-bottom: 10px; margin-bottom: 16px; }
        .pill { padding: 8px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px; font-weight: 900; cursor:pointer; white-space:nowrap; transition: 0.2s; color: var(--text-muted); }
        .pill:hover, .pill.active { border-color: rgba(139,92,246,0.75); color: white; background: rgba(139,92,246,0.85); }
        .prod-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        .prod-card { background: rgba(255,255,255,0.04); border-radius: 20px; padding: 14px; text-align:center; border: 1px solid rgba(255,255,255,0.07);
          cursor:pointer; transition: 0.2s; }
        .prod-card:hover { border-color: rgba(139,92,246,0.7); transform: translateY(-3px); box-shadow: 0 18px 30px -18px rgba(0,0,0,0.55); }
        .prod-img { width:100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 12px; object-fit: cover; background: rgba(0,0,0,0.25);
          display:flex; align-items:center; justify-content:center; font-size: 2rem; color: var(--text-muted); }
        .prod-title { font-weight: 900; font-size: 0.92rem; margin-bottom: 6px; line-height:1.2; min-height: 36px; display:flex; align-items:center; justify-content:center; }
        .prod-price { color: var(--primary); font-weight: 1000; font-size: 1.08rem; }

        .cart-drawer { position: fixed; top: 0; right: 0; width: 420px; height: 100vh; background: rgba(24,26,32,0.92); backdrop-filter: blur(14px);
          box-shadow: -10px 0 40px rgba(0,0,0,0.35); z-index: 100; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display:flex; flex-direction:column; border-left: 1px solid rgba(255,255,255,0.06); }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 22px; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cart-body { flex: 1; overflow-y:auto; padding: 18px; }
        .cart-foot { padding: 22px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.06); }
        .cart-item { display:flex; align-items:center; gap: 12px; padding: 14px; background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 10px;
          border: 1px solid rgba(255,255,255,0.06); }
        .qty-ctrl { display:flex; align-items:center; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 2px; border: 1px solid rgba(255,255,255,0.06); }
        .qb { width: 34px; height: 34px; border:none; background: transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color: var(--text-main); font-weight: 1000; }
        .qi-inp { width: 58px; height: 34px; border:none; background: transparent; text-align:center; font-weight: 1000; color: var(--text-main); }
        .btn { width:100%; padding: 14px; border:none; border-radius: 16px; font-weight: 1000; font-size: 1rem; cursor:pointer; transition: 0.2s;
          display:flex; justify-content:center; align-items:center; gap: 10px; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 16px 30px -18px rgba(139,92,246,0.9); }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-text { background: transparent; border: 1px dashed rgba(255,255,255,0.14); color: var(--text-muted); }
        .btn-text:hover { border-color: rgba(139,92,246,0.65); color: var(--text-main); }

        .cart-btn-float { position: fixed; bottom: 26px; right: 26px; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
          color: var(--text-main); padding: 14px 18px; border-radius: 999px; font-weight: 1000; cursor:pointer;
          box-shadow: 0 20px 34px -22px rgba(0,0,0,0.7); display:flex; align-items:center; gap: 10px; transition: 0.2s; z-index: 90;
          border: 1px solid rgba(255,255,255,0.08); }
        .cart-btn-float:hover { transform: scale(1.03); border-color: rgba(139,92,246,0.5); }

        .form-wrap { background: rgba(255,255,255,0.04); padding: 34px; border-radius: 26px; max-width: 680px; margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.07); box-shadow: 0 22px 40px -26px rgba(0,0,0,0.7); }
        .inp-group { margin-bottom: 16px; }
        .inp-label { display:block; margin-bottom: 8px; font-weight: 900; font-size: 0.9rem; color: var(--text-muted); }
        .inp-field { width:100%; padding: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
          border-radius: 12px; font-size: 1rem; font-family: inherit; color: var(--text-main); transition: 0.2s; font-weight: 800; }
        .inp-field:focus { border-color: rgba(139,92,246,0.75); box-shadow: 0 0 0 3px var(--primary-light); }

        #gate { position: fixed; inset: 0; background: var(--bg-body); z-index: 2000; display:flex; align-items:center; justify-content:center; }
        .login-box { text-align:center; width: 420px; padding: 40px; border: 1px solid rgba(255,255,255,0.08); background: rgba(24,26,32,0.85);
          border-radius: 30px; backdrop-filter: blur(14px); box-shadow: 0 24px 40px -26px rgba(0,0,0,0.75); }

        .toast { position: fixed; top: 26px; right: 26px; z-index: 3000; background: rgba(24,26,32,0.9); padding: 14px 18px;
          border-radius: 16px; box-shadow: 0 18px 34px -22px rgba(0,0,0,0.75); border-left: 5px solid var(--primary); min-width: 280px;
          animation: slideIn 0.25s; color: var(--text-main); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); }
        @keyframes slideIn { from { transform: translateX(12%); opacity: 0; } }
        .t-title { font-weight: 1000; font-size: 0.95rem; margin-bottom: 4px; }
        .t-msg { font-size: 0.85rem; color: var(--text-muted); }

        .list-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 22px; padding: 18px; }
        .row { display:flex; justify-content:space-between; align-items:center; padding: 12px 12px; border-radius: 14px; cursor:pointer;
          border: 1px solid rgba(255,255,255,0.0); }
        .row:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06); }
        .badge { font-size: 0.78rem; font-weight: 1000; padding: 6px 10px; border-radius: 999px; background: rgba(139,92,246,0.16); border: 1px solid rgba(139,92,246,0.35); color: white; }
      `}</style>

      {view === 'login' ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{height:64, marginBottom:18, borderRadius:14}} alt="Logo" />
            <h2 style={{marginBottom:10, fontWeight:1000}}>Bienvenue</h2>
            <p style={{color:'var(--text-muted)', marginBottom:22}}>Connectez-vous pour commencer</p>

            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:16, textAlign:'center'}}>
              <option value="">Sélectionner un nom...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{marginTop:16, opacity:0.75, fontSize:'0.8rem'}}>v{data?.version}</div>
          </div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div className="brand">
              <img src="https://i.goopics.net/dskmxi.png" alt="Logo"/> HEN HOUSE
            </div>

            <nav className="nav-list">
              <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}>
                <Icon name="dashboard" /> Tableau de bord
              </button>
              <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}>
                <Icon name="receipt" /> Caisse
              </button>
              <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}>
                <Icon name="package" /> Stock
              </button>
              <button className={`nav-btn ${currentTab==='enterprise'?'active':''}`} onClick={()=>setCurrentTab('enterprise')}>
                <Icon name="building" /> Entreprise
              </button>
              <button className={`nav-btn ${currentTab==='partners'?'active':''}`} onClick={()=>setCurrentTab('partners')}>
                <Icon name="handshake" /> Partenaires
              </button>
              <button className={`nav-btn ${currentTab==='expenses'?'active':''}`} onClick={()=>setCurrentTab('expenses')}>
                <Icon name="creditCard" /> Frais
              </button>
              <button className={`nav-btn ${currentTab==='garage'?'active':''}`} onClick={()=>setCurrentTab('garage')}>
                <Icon name="car" /> Garage
              </button>
              <button className={`nav-btn ${currentTab==='directory'?'active':''}`} onClick={()=>setCurrentTab('directory')}>
                <Icon name="users" /> Annuaire
              </button>
              <button className={`nav-btn ${currentTab==='performance'?'active':''}`} onClick={()=>setCurrentTab('performance')}>
                <Icon name="trophy" /> Performance
              </button>
              <button className={`nav-btn ${currentTab==='support'?'active':''}`} onClick={()=>setCurrentTab('support')}>
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            <div className="me-card">
              <div className="me-top" onClick={()=>setCurrentTab('profile')}>
                <div className="avatar">{user?.charAt(0) || '?'}</div>
                <div style={{flex:1}}>
                  <div className="me-name">{user}</div>
                  <div className="me-sub">
                    {myProfile?.role ? myProfile.role : 'Employé'} {myProfile?.seniority ? `• ${myProfile.seniority} j` : ''}
                  </div>
                </div>
                <Icon name="user" size={18} style={{opacity:0.7}} />
              </div>
              <div className="me-actions">
                <button className="mini-btn" onClick={()=>{beep('click'); setCurrentTab('profile');}}>
                  <Icon name="user" size={16}/> Profil
                </button>
                <button className="mini-btn danger" onClick={logout}>
                  <Icon name="logout" size={16}/> Quitter
                </button>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="header-bar">
              <div className="page-title">
                {currentTab === 'home' && <><Icon name="dashboard" size={32} /> Tableau de bord</>}
                {currentTab === 'invoices' && <><Icon name="receipt" size={32} /> Caisse</>}
                {currentTab === 'stock' && <><Icon name="package" size={32} /> Stock</>}
                {currentTab === 'enterprise' && <><Icon name="building" size={32} /> Entreprise</>}
                {currentTab === 'partners' && <><Icon name="handshake" size={32} /> Partenaires</>}
                {currentTab === 'garage' && <><Icon name="car" size={32} /> Garage</>}
                {currentTab === 'expenses' && <><Icon name="creditCard" size={32} /> Frais</>}
                {currentTab === 'directory' && <><Icon name="users" size={32} /> Annuaire</>}
                {currentTab === 'performance' && <><Icon name="trophy" size={32} /> Performance</>}
                {currentTab === 'support' && <><Icon name="lifeBuoy" size={32} /> Support</>}
                {currentTab === 'profile' && <><Icon name="user" size={32} /> Mon profil</>}
              </div>

              <div className="top-stats">
                <div className="chip" onClick={()=>{beep('click'); toggleTheme();}} title="Mode sombre/clair">
                  {darkMode ? <Icon name="sun" size={18}/> : <Icon name="moon" size={18}/>}
                  <span style={{opacity:0.9}}>{darkMode ? 'Clair' : 'Sombre'}</span>
                </div>

                <div className="chip" onClick={()=>{beep('click'); setSoundOn(!soundOn);}} title="Sons">
                  {soundOn ? <Icon name="volume" size={18}/> : <Icon name="volumeOff" size={18}/>}
                  <span style={{opacity:0.9}}>{soundOn ? 'Son' : 'Muet'}</span>
                </div>

                <div className="mini-stat">Session: <strong>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</strong></div>

                <div className="chip" onClick={()=>{beep('click'); setQuickMode(!quickMode);}} title="Mode rapide">
                  <span style={{opacity:0.9}}>Mode rapide</span>
                  <div className={`toggle ${quickMode ? 'on' : ''}`}><div className="dot"/></div>
                </div>

                <button className="icon-btn" onClick={syncData} title="↻ Sync (refresh data)">
                  <Icon name="refresh" size={18} />
                </button>
                <button className="icon-btn" onClick={reloadApp} title="⟳ Reload (refresh complet)">
                  <Icon name="reload" size={18} />
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === 'home' && (
              <div className="dashboard-grid">
                <div className="dash-card" onClick={()=>setCurrentTab('invoices')}>
                  <div className="dash-icon"><Icon name="receipt" size={28} /></div>
                  <div><div className="dash-title">Caisse</div><div className="dash-desc">Nouvelle vente</div></div>
                </div>
                <div className="dash-card" onClick={()=>setCurrentTab('stock')}>
                  <div className="dash-icon"><Icon name="package" size={28} /></div>
                  <div><div className="dash-title">Stock</div><div className="dash-desc">Production cuisine</div></div>
                </div>
                <div className="dash-card" onClick={()=>setCurrentTab('enterprise')}>
                  <div className="dash-icon"><Icon name="building" size={28} /></div>
                  <div><div className="dash-title">Entreprise</div><div className="dash-desc">Commandes B2B</div></div>
                </div>
                <div className="dash-card" onClick={()=>setCurrentTab('performance')}>
                  <div className="dash-icon"><Icon name="trophy" size={28} /></div>
                  <div><div className="dash-title">Performance</div><div className="dash-desc">Top CA / Stock</div></div>
                </div>
              </div>
            )}

            {/* CAISSE */}
            {currentTab === 'invoices' && (
              <>
                <div className="search-container">
                  <div className="search-icon"><Icon name="search" size={20} /></div>
                  <input className="search-inp" placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} />
                </div>

                <div className="cat-pills">
                  <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                  {data?.productsByCategory ? Object.keys(data.productsByCategory).map(c => (
                    <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace(/_/g,' ')}</div>
                  )) : <div className="mini-stat">Chargement des catégories...</div>}
                </div>

                <div className="prod-grid" style={quickMode ? {gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))'} : {}}>
                  {data?.products?.filter(p => {
                    const cat = Object.keys(data?.productsByCategory || {}).find(k=>data.productsByCategory[k].includes(p));
                    return (catFilter==='Tous' || cat===catFilter) && p.toLowerCase().includes(search.toLowerCase());
                  }).map(p => (
                    <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                      {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" alt={p} /> : <div className="prod-img">{p.charAt(0)}</div>}
                      <div className="prod-title">{p}</div>
                      <div className="prod-price">${Number(data?.prices?.[p]||0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === 'stock' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="package" /> Déclaration Stock</h2>

                {stockItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:120}} value={item.qty}
                      onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                    <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}}>
                      <Icon name="x" size={18}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setStockItems([...stockItems, {product:(data?.products?.[0] || ''), qty:1}])}>+ Ajouter ligne</button>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Envoyer</button>
              </div>
            )}

            {/* ENTREPRISE */}
            {currentTab === 'enterprise' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="building" /> Commande Pro</h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={e=>setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...entItems];n[i].product=e.target.value;setEntItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:120}} value={item.qty}
                      onChange={e=>{const n=[...entItems];n[i].qty=e.target.value;setEntItems(n)}} />
                    <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...entItems];n.splice(i,1);setEntItems(n)}}>
                      <Icon name="x" size={18}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setEntItems([...entItems, {product:(data?.products?.[0] || ''), qty:1}])}>+ Ajouter ligne</button>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSendEnterprise}>Valider</button>
              </div>
            )}

            {/* PARTENAIRES */}
            {currentTab === 'partners' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="handshake" /> Partenaires</h2>

                <div className="inp-group">
                  <label className="inp-label">N° Facture</label>
                  <input className="inp-field" value={parNum} onChange={e=>setParNum(e.target.value)} />
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                  <div className="inp-group">
                    <label className="inp-label">Société</label>
                    <select className="inp-field" value={parCompany} onChange={e=>setParCompany(e.target.value)}>
                      {data?.partners?.companies ? Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>) : <option>Chargement...</option>}
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
                    <input type="number" className="inp-field" style={{width:120}} value={item.qty}
                      onChange={e=>{const n=[...parItems];n[i].qty=e.target.value;setParItems(n)}} />
                    <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...parItems];n.splice(i,1);setParItems(n)}}>
                      <Icon name="x" size={18}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setParItems([...parItems, {menu:(data?.partners?.companies?.[parCompany]?.menus?.[0]?.name || ''), qty:1}])}>+ Menu</button>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSendPartner}>Confirmer</button>
              </div>
            )}

            {/* FRAIS */}
            {currentTab === 'expenses' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="creditCard" /> Frais</h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={expData.veh} onChange={e=>setExpData({...expData, veh:e.target.value})}>
                    {data?.vehicles?.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Type</label>
                  <select className="inp-field" value={expData.kind} onChange={e=>setExpData({...expData, kind:e.target.value})}>
                    <option>Essence</option>
                    <option>Réparation</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Montant ($)</label>
                  <input type="number" className="inp-field" value={expData.amt} onChange={e=>setExpData({...expData, amt:e.target.value})} />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>Déclarer</button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === 'garage' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="car" /> Garage</h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={garData.veh} onChange={e=>setGarData({...garData, veh:e.target.value})}>
                    {data?.vehicles?.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Action</label>
                  <select className="inp-field" value={garData.action} onChange={e=>setGarData({...garData, action:e.target.value})}>
                    <option>Entrée</option>
                    <option>Sortie</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Essence (%)</label>
                  <input type="range" style={{width:'100%'}} value={garData.fuel} onChange={e=>setGarData({...garData, fuel:e.target.value})} />
                  <div style={{marginTop:6, color:'var(--text-muted)', fontWeight:900}}>{garData.fuel}%</div>
                </div>

                <button className="btn btn-primary" onClick={()=>sendForm('sendGarage', {vehicle:garData.veh, action:garData.action, fuel:garData.fuel})}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === 'support' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="lifeBuoy" /> Support</h2>

                <div className="inp-group">
                  <label className="inp-label">Sujet</label>
                  <select className="inp-field" value={supData.sub} onChange={e=>setSupData({...supData, sub:e.target.value})}>
                    <option>Problème Stock</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Message</label>
                  <textarea className="inp-field" style={{height:110}} value={supData.msg} onChange={e=>setSupData({...supData, msg:e.target.value})}></textarea>
                </div>

                <button className="btn btn-primary" onClick={()=>sendForm('sendSupport', {subject:supData.sub, message:supData.msg})}>Envoyer</button>
              </div>
            )}

            {/* ANNUAIRE */}
            {currentTab === 'directory' && (
              <div className="list-card" style={{maxWidth:900, margin:'0 auto'}}>
                <div style={{display:'flex', gap:12, marginBottom:14, flexWrap:'wrap'}}>
                  <input className="inp-field" style={{flex:1, minWidth:240}} placeholder="Rechercher un employé..."
                    value={dirSearch} onChange={e=>setDirSearch(e.target.value)} />
                  <select className="inp-field" style={{width:240}} value={dirRole} onChange={e=>setDirRole(e.target.value)}>
                    <option value="Tous">Tous les postes</option>
                    {employeesFull?.length ? [...new Set(employeesFull.map(e=>e.role).filter(Boolean))].map(r => <option key={r} value={r}>{r}</option>) : null}
                  </select>
                </div>

                {employeesFull
                  ?.filter(e => (dirRole==='Tous' || e.role===dirRole) && e.name.toLowerCase().includes(dirSearch.toLowerCase()))
                  .map(e => (
                    <div key={e.id + e.name} className="row" onClick={()=>setSelectedEmployee(e)}>
                      <div style={{display:'flex', gap:12, alignItems:'center'}}>
                        <div className="avatar" style={{width:34, height:34, borderRadius:12}}>{e.name.charAt(0)}</div>
                        <div>
                          <div style={{fontWeight:1000}}>{e.name}</div>
                          <div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>{e.phone || '—'} • {e.arrival || '—'}</div>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:10, alignItems:'center'}}>
                        <span className="badge">{e.role || '—'}</span>
                        <span style={{color:'var(--text-muted)', fontWeight:1000}}>{e.seniority}j</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {/* PERFORMANCE */}
            {currentTab === 'performance' && (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, maxWidth:1000, margin:'0 auto'}}>
                <div className="list-card">
                  <div style={{fontWeight:1000, marginBottom:10, display:'flex', alignItems:'center', gap:10}}>
                    <Icon name="trophy" /> Top CA
                  </div>
                  {topCA?.map((e, idx) => (
                    <div key={e.name} className="row" onClick={()=>setSelectedEmployee(e)}>
                      <div style={{display:'flex', gap:10, alignItems:'center'}}>
                        <div className="badge" style={{width:34, textAlign:'center'}}>{idx+1}</div>
                        <div style={{fontWeight:1000}}>{e.name}</div>
                      </div>
                      <div style={{fontWeight:1000, color:'var(--primary)'}}>${Number(e.ca || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="list-card">
                  <div style={{fontWeight:1000, marginBottom:10, display:'flex', alignItems:'center', gap:10}}>
                    <Icon name="package" /> Top Stock
                  </div>
                  {topStock?.map((e, idx) => (
                    <div key={e.name} className="row" onClick={()=>setSelectedEmployee(e)}>
                      <div style={{display:'flex', gap:10, alignItems:'center'}}>
                        <div className="badge" style={{width:34, textAlign:'center'}}>{idx+1}</div>
                        <div style={{fontWeight:1000}}>{e.name}</div>
                      </div>
                      <div style={{fontWeight:1000, color:'var(--primary)'}}>{e.stock || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFIL */}
            {currentTab === 'profile' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:14, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="user" /> {user}
                </h2>

                {!myProfile ? (
                  <div style={{color:'var(--text-muted)', fontWeight:900}}>Profil introuvable dans la sheet.</div>
                ) : (
                  <>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Poste</div>
                        <div style={{fontWeight:1000, marginTop:6}}>{myProfile.role || '—'}</div>
                      </div>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Téléphone</div>
                        <div style={{fontWeight:1000, marginTop:6}}>{myProfile.phone || '—'}</div>
                      </div>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Date d’arrivée</div>
                        <div style={{fontWeight:1000, marginTop:6}}>{myProfile.arrival || '—'}</div>
                      </div>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Ancienneté</div>
                        <div style={{fontWeight:1000, marginTop:6}}>{myProfile.seniority} jours</div>
                      </div>
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12}}>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>CA</div>
                        <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>${Number(myProfile.ca || 0).toFixed(2)}</div>
                      </div>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Stock</div>
                        <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>{myProfile.stock || 0}</div>
                      </div>
                      <div className="list-card" style={{padding:14}}>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>Salaire</div>
                        <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>${Number(myProfile.salary || 0).toFixed(2)}</div>
                      </div>
                    </div>

                    <div style={{marginTop:14, display:'flex', gap:10}}>
                      <button className="btn btn-text" onClick={()=>setCurrentTab('directory')}>
                        <Icon name="users" size={18}/> Annuaire
                      </button>
                      <button className="btn btn-primary" onClick={syncData}>
                        <Icon name="refresh" size={18}/> Sync
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>

          {/* CART DRAWER */}
          {currentTab === 'invoices' && (
            <>
              <div className="cart-btn-float" onClick={()=>{beep('click'); setCartOpen(true);}}>
                <Icon name="cart" size={22} /> <span>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                <span style={{opacity:0.65, fontWeight:900}}>• {cart.reduce((s,i)=>s+i.qty,0)}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-head">
                  <h2 style={{display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="cart" /> Panier</h2>
                  <button onClick={()=>{beep('click'); setCartOpen(false);}} style={{background:'none', border:'none', cursor:'pointer', color:'inherit'}}>
                    <Icon name="x" size={24} />
                  </button>
                </div>

                <div style={{padding:18}}>
                  <input className="inp-field" placeholder="N° Facture (Obligatoire)"
                    style={{textAlign:'center', fontWeight:1000}}
                    value={invNum} onChange={e=>setInvNum(e.target.value)} />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div style={{textAlign:'center', marginTop:50, color:'var(--text-muted)', fontWeight:900}}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{flex:1}}>
                        <b style={{fontWeight:1000}}>{c.name}</b><br/>
                        <small style={{color:'var(--text-muted)', fontWeight:900}}>${Number(c.pu || 0).toFixed(2)}</small>
                      </div>

                      <div className="qty-ctrl">
                        <button className="qb" onClick={()=>modQty(i,-1)}>-</button>
                        <input
                          className="qi-inp"
                          type="number"
                          value={c.qty}
                          onChange={(e)=>setQty(i, e.target.value)}
                        />
                        <button className="qb" onClick={()=>modQty(i,1)}>+</button>
                      </div>

                      <button className="qb" style={{color:'#ef4444'}} onClick={()=>setQty(i, 0)}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.25rem', fontWeight:1000, marginBottom:12}}>
                    <span>Total</span>
                    <span style={{color:'var(--primary)'}}>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>
                    Valider la vente
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* MODAL EMPLOYEE */}
          {selectedEmployee && (
            <div
              onClick={()=>setSelectedEmployee(null)}
              style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:4000, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}
            >
              <div onClick={(e)=>e.stopPropagation()} className="form-wrap" style={{maxWidth:720, width:'100%'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
                  <h2 style={{display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                    <Icon name="user" /> {selectedEmployee.name}
                  </h2>
                  <button className="icon-btn" onClick={()=>setSelectedEmployee(null)}><Icon name="x" size={18}/></button>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Poste</div>
                    <div style={{fontWeight:1000, marginTop:6}}>{selectedEmployee.role || '—'}</div>
                  </div>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Téléphone</div>
                    <div style={{fontWeight:1000, marginTop:6}}>{selectedEmployee.phone || '—'}</div>
                  </div>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Date d’arrivée</div>
                    <div style={{fontWeight:1000, marginTop:6}}>{selectedEmployee.arrival || '—'}</div>
                  </div>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Ancienneté</div>
                    <div style={{fontWeight:1000, marginTop:6}}>{selectedEmployee.seniority} jours</div>
                  </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12}}>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>CA</div>
                    <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>${Number(selectedEmployee.ca || 0).toFixed(2)}</div>
                  </div>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Stock</div>
                    <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>{selectedEmployee.stock || 0}</div>
                  </div>
                  <div className="list-card" style={{padding:14}}>
                    <div style={{color:'var(--text-muted)', fontWeight:900}}>Salaire</div>
                    <div style={{fontWeight:1000, marginTop:6, color:'var(--primary)'}}>${Number(selectedEmployee.salary || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div style={{display:'flex', gap:10, marginTop:14}}>
                  <button className="btn btn-text" onClick={()=>{
                    if (!selectedEmployee.phone) return notify("Info", "Pas de numéro", "info");
                    navigator.clipboard.writeText(selectedEmployee.phone);
                    notify("Copié", "Numéro copié", "success");
                  }}>
                    Copier le numéro
                  </button>
                  <button className="btn btn-primary" onClick={syncData}>
                    <Icon name="refresh" size={18}/> Sync
                  </button>
                </div>
              </div>
            </div>
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
