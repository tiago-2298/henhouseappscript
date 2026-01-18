'use client';
import { useState, useEffect, useMemo } from 'react';

// --- BIBLIOTHÈQUE D'ICÔNES (Stroke affiné à 1.5 pour le côté Pro) ---
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
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>
      {icons[name]}
    </svg>
  );
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
  const [dirSearch, setDirSearch] = useState('');
  const [dirRole, setDirRole] = useState('Tous');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // =========================
  // Logique Audio & Notify
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
      setTimeout(() => { o.stop(); ctx.close(); }, Math.floor(preset.dur * 1000));
    } catch {}
  };

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
    if (type === 'success') beep('success');
    if (type === 'error') beep('error');
  };

  // =========================
  // Chargement Données
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
            throw new Error("Erreur serveur");
        }
        return res.json();
    } catch (e) {
        return { success: false, employees: [], products: [], vehicles: [], partners: { companies: {} } };
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    loadMeta().then(res => {
        setData(res);
        setLoading(false);
        if(res?.vehicles?.length) {
          setExpData(p => ({...p, veh: res.vehicles[0]}));
          setGarData(p => ({...p, veh: res.vehicles[0]}));
        }
        if(res?.partners?.companies && Object.keys(res.partners.companies).length) {
          setParCompany(Object.keys(res.partners.companies)[0]);
        }
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

  const syncData = async () => {
    notify("Sync...", "Récupération des données", "info");
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'syncData' })
      });
      const json = await res.json();
      if (json.success) { setData(json); notify("OK", "Données à jour", "success"); }
    } catch (e) { notify("Erreur", "Serveur injoignable", "error"); }
  };

  const login = () => { if(user) { setView('app'); beep('click'); } };
  const logout = () => { setUser(''); setView('login'); setCurrentTab('home'); beep('click'); };

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

  const sendForm = async (action, payload) => {
    notify("Envoi...", "Patientez", "info");
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action, data: { ...payload, employee: user } })
      });
      const json = await res.json();
      if(json.success) {
        notify("Succès", "Validé !", "success");
        if(['sendFactures'].includes(action)) setCurrentTab('home');
        setCart([]); setInvNum('');
        syncData();
      } else { notify("Erreur", json.message, "error"); }
    } catch(e) { notify("Erreur", "Échec envoi", "error"); }
  };

  const topCA = useMemo(() => [...employeesFull].sort((a,b)=>b.ca-a.ca).slice(0,5), [employeesFull]);
  const topStock = useMemo(() => [...employeesFull].sort((a,b)=>b.stock-a.stock).slice(0,5), [employeesFull]);

  if(loading) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#09090b', color:'white'}}>
      <div style={{textAlign:'center'}}>
        <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:18, borderRadius:16}} alt="Logo" />
        <div style={{letterSpacing:'0.1em', fontWeight:800, fontSize:'1.2rem'}}>HEN HOUSE</div>
        <div style={{marginTop:20, width:200, height:4, borderRadius:10, background:'rgba(255,255,255,0.05)', overflow:'hidden', margin:'20px auto'}}>
          <div className="shimmer" style={{height:'100%', width:'50%'}} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6;
          --primary-light: rgba(139, 92, 246, 0.12);
          --bg-body: #f1f5f9;
          --bg-panel: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: rgba(0,0,0,0.06);
          --radius-lg: 24px;
          --radius-md: 16px;
          --sidebar-w: 280px;
          --shadow-sm: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] {
          --bg-body: #09090b;
          --bg-panel: #121215;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: rgba(255,255,255,0.08);
          --primary-light: rgba(139, 92, 246, 0.15);
          color-scheme: dark;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          background-color: var(--bg-body); 
          color: var(--text-main); 
          height: 100vh; 
          overflow: hidden; 
          display: flex;
          -webkit-font-smoothing: antialiased;
        }

        /* --- Scrollbar fine --- */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }

        .sidebar { 
          width: var(--sidebar-w); 
          height: 100vh;
          background: var(--bg-panel);
          display: flex; flex-direction: column; padding: 24px;
          border-right: 1px solid var(--border);
          z-index: 50;
        }

        .nav-btn { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border: none; background: transparent;
          color: var(--text-muted); font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: 0.2s; font-family: inherit;
        }
        .nav-btn:hover { background: var(--primary-light); color: var(--text-main); }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 8px 20px -6px var(--primary); }

        .main-content { flex: 1; padding: 32px; overflow-y: auto; position: relative; }
        
        .dash-card { 
          background: var(--bg-panel); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; display:flex; flex-direction:column; justify-content:space-between; height: 180px;
          box-shadow: var(--shadow-sm);
        }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }

        .inp-field { 
          width:100%; padding: 12px 16px; border: 1px solid var(--border); background: rgba(0,0,0,0.2);
          border-radius: 12px; font-size: 1rem; color: var(--text-main); transition: 0.2s; font-weight: 500;
        }
        .inp-field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); background: rgba(0,0,0,0.3); }

        .prod-card { 
          background: var(--bg-panel); border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--border);
          cursor:pointer; transition: 0.3s; text-align: center;
        }
        .prod-card:hover { transform: scale(1.02); border-color: var(--primary); }
        .prod-card img { width: 100%; border-radius: 12px; aspect-ratio: 1; object-fit: cover; transition: 0.3s; }
        .prod-card:hover img { transform: scale(1.05); }

        .btn { 
          padding: 12px 24px; border:none; border-radius: 12px; font-weight: 700; cursor:pointer; transition: 0.2s;
          display:flex; justify-content:center; align-items:center; gap: 8px; font-family: inherit;
        }
        .btn:active { transform: scale(0.96); }
        .btn-primary { background: var(--primary); color: white; }
        
        .badge { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; background: var(--primary-light); color: var(--primary); border: 1px solid rgba(139,92,246,0.2); }

        .cart-drawer { 
          position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: var(--bg-panel);
          border-left: 1px solid var(--border); box-shadow: -20px 0 50px rgba(0,0,0,0.3); z-index: 100;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column;
        }
        .cart-drawer.open { transform: translateX(0); }

        .form-wrap { background: var(--bg-panel); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border); max-width: 600px; margin: 0 auto; box-shadow: var(--shadow-sm); }
      `}</style>

      {view === 'login' ? (
        <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-body)'}}>
          <div className="form-wrap" style={{textAlign:'center', width: 380}}>
            <img src="https://i.goopics.net/dskmxi.png" style={{height:70, marginBottom:20, borderRadius:18}} alt="Logo" />
            <h2 style={{fontSize:'1.8rem', fontWeight:800, marginBottom:8}}>Bienvenue</h2>
            <p style={{color:'var(--text-muted)', marginBottom:24}}>Espace collaborateur Hen House</p>
            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:16}}>
              <option value="">Choisir un profil...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={login} disabled={!user}>Se connecter</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div style={{display:'flex', alignItems:'center', gap:12, fontWeight:900, fontSize:'1.1rem', marginBottom:32}}>
              <img src="https://i.goopics.net/dskmxi.png" style={{height:32, borderRadius:8}} alt="Logo"/> HEN HOUSE
            </div>

            <nav style={{display:'flex', flexDirection:'column', gap:6, flex:1}}>
              <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}><Icon name="dashboard" /> Dashboard</button>
              <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" /> Caisse</button>
              <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}><Icon name="package" /> Production</button>
              <button className={`nav-btn ${currentTab==='directory'?'active':''}`} onClick={()=>setCurrentTab('directory')}><Icon name="users" /> Équipe</button>
              <button className={`nav-btn ${currentTab==='performance'?'active':''}`} onClick={()=>setCurrentTab('performance')}><Icon name="trophy" /> Classement</button>
              <div style={{height:1, background:'var(--border)', margin:'10px 0'}} />
              <button className={`nav-btn ${currentTab==='garage'?'active':''}`} onClick={()=>setCurrentTab('garage')}><Icon name="car" /> Garage</button>
              <button className={`nav-btn ${currentTab==='expenses'?'active':''}`} onClick={()=>setCurrentTab('expenses')}><Icon name="creditCard" /> Frais</button>
            </nav>

            <div style={{paddingTop:20, borderTop:'1px solid var(--border)'}}>
              <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
                <div style={{width:40, height:40, borderRadius:12, background:'var(--primary)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800}}>
                  {user.charAt(0)}
                </div>
                <div>
                  <div style={{fontWeight:700, fontSize:'0.95rem'}}>{user}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{myProfile?.role || 'Employé'}</div>
                </div>
              </div>
              <button className="btn" style={{width:'100%', background:'rgba(239,68,68,0.1)', color:'#ef4444'}} onClick={logout}>Déconnexion</button>
            </div>
          </aside>

          <main className="main-content">
            <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32}}>
              <h1 style={{fontSize:'1.75rem', fontWeight:800, letterSpacing:'-0.02em'}}>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
              <div style={{display:'flex', gap:10}}>
                <div style={{background:'var(--bg-panel)', padding:'6px 14px', borderRadius:10, border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, fontSize:'0.9rem', fontWeight:600}}>
                  Total Session: <span style={{color:'var(--primary)'}}>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
                </div>
                <button className="btn" onClick={syncData} style={{background:'var(--bg-panel)', border:'1px solid var(--border)'}}><Icon name="refresh" size={18}/></button>
                <button className="btn" onClick={toggleTheme} style={{background:'var(--bg-panel)', border:'1px solid var(--border)'}}>{darkMode ? <Icon name="sun" size={18}/> : <Icon name="moon" size={18}/>}</button>
              </div>
            </header>

            {/* CONTENU HOME */}
            {currentTab === 'home' && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20}}>
                <div className="dash-card" onClick={()=>setCurrentTab('invoices')}>
                  <div style={{width:48, height:48, borderRadius:12, background:'var(--primary-light)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="receipt" size={24}/></div>
                  <div><div style={{fontWeight:800, fontSize:'1.1rem'}}>Caisse</div><div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>Enregistrer des ventes</div></div>
                </div>
                <div className="dash-card" onClick={()=>setCurrentTab('stock')}>
                  <div style={{width:48, height:48, borderRadius:12, background:'rgba(16,185,129,0.1)', color:'#10b981', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="package" size={24}/></div>
                  <div><div style={{fontWeight:800, fontSize:'1.1rem'}}>Production</div><div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>Déclarer le stock cuisiné</div></div>
                </div>
                <div className="dash-card" onClick={()=>setCurrentTab('directory')}>
                  <div style={{width:48, height:48, borderRadius:12, background:'rgba(59,130,246,0.1)', color:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="users" size={24}/></div>
                  <div><div style={{fontWeight:800, fontSize:'1.1rem'}}>Équipe</div><div style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>Annuaire des employés</div></div>
                </div>
              </div>
            )}

            {/* CONTENU CAISSE */}
            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:12, marginBottom:24}}>
                  <div style={{position:'relative', flex:1}}>
                    <Icon name="search" style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)'}} />
                    <input className="inp-field" style={{paddingLeft:44}} placeholder="Rechercher un plat..." onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <select className="inp-field" style={{width:200}} onChange={e=>setCatFilter(e.target.value)}>
                    <option value="Tous">Toutes catégories</option>
                    {data?.productsByCategory && Object.keys(data.productsByCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:16}}>
                  {data?.products?.filter(p => {
                    const cat = Object.keys(data?.productsByCategory || {}).find(k=>data.productsByCategory[k].includes(p));
                    return (catFilter==='Tous' || cat===catFilter) && p.toLowerCase().includes(search.toLowerCase());
                  }).map(p => (
                    <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                      <img src={IMAGES[p] || "https://placehold.co/200"} alt={p} />
                      <div style={{fontWeight:700, fontSize:'0.9rem', margin:'10px 0'}}>{p}</div>
                      <div className="badge">${Number(data?.prices?.[p]||0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* FORMULAIRE STOCK */}
            {currentTab === 'stock' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:20, fontWeight:800}}>📦 Production Cuisine</h2>
                {stockItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                      <option value="">Sélectionner...</option>
                      {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:100}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                    <button onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer'}}><Icon name="x" /></button>
                  </div>
                ))}
                <button className="btn" style={{width:'100%', background:'var(--bg-body)', marginBottom:12}} onClick={()=>setStockItems([...stockItems, {product:'', qty:1}])}>+ Ajouter un produit</button>
                <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Valider la production</button>
              </div>
            )}
          </main>

          {/* PANIER FLOTTANT */}
          {cart.length > 0 && currentTab === 'invoices' && (
            <button className="btn btn-primary" onClick={()=>setCartOpen(true)} style={{position:'fixed', bottom:32, right:32, height:60, padding:'0 24px', borderRadius:20, boxShadow:'0 10px 30px rgba(139,92,246,0.5)'}}>
              <Icon name="cart" /> Voir Panier ({cart.reduce((s,i)=>s+i.qty,0)})
            </button>
          )}

          {/* DRAWER PANIER */}
          <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
            <div style={{padding:24, borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{fontWeight:800}}>Votre Panier</h2>
              <button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none'}}><Icon name="x" size={24}/></button>
            </div>
            <div style={{padding:24, flex:1, overflowY:'auto'}}>
              <input className="inp-field" placeholder="N° Facture" value={invNum} onChange={e=>setInvNum(e.target.value)} style={{marginBottom:20}} />
              {cart.map((c, i) => (
                <div key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:16, background:'rgba(255,255,255,0.03)', padding:12, borderRadius:12}}>
                  <div>
                    <div style={{fontWeight:700}}>{c.name}</div>
                    <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>${c.pu} x {c.qty}</div>
                  </div>
                  <div style={{fontWeight:800}}>${(c.pu * c.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{padding:24, borderTop:'1px solid var(--border)'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:800, marginBottom:20}}>
                <span>Total</span>
                <span>${(cart.reduce((a,b)=>a+b.qty*b.pu, 0)).toFixed(2)}</span>
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} onClick={() => {
                if(!invNum) return notify("Attention", "N° Facture requis", "error");
                sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
                setCartOpen(false);
              }}>Encaisser</button>
            </div>
          </aside>

          {/* TOAST NOTIFICATION */}
          {toast && (
            <div style={{position:'fixed', top:24, right:24, background:'var(--bg-panel)', border:'1px solid var(--border)', padding:'16px 20px', borderRadius:16, boxShadow:'0 10px 25px rgba(0,0,0,0.3)', zIndex:9999, display:'flex', flexDirection:'column', gap:4, borderLeft:`4px solid ${toast.type === 'error' ? '#ef4444' : '#10b981'}`}}>
              <div style={{fontWeight:800, fontSize:'0.95rem'}}>{toast.title}</div>
              <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{toast.msg}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
