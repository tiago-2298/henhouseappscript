'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';

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
    lifeBuoy: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.39-3.39M4.93 19.07l4.24-4.24" /></>),
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>),
    search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
    cart: (<><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>),
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Zm-2 0h2v3a7 7 0 0 0 2 5H6a4 4 0 0 1-4-4V4h3Zm14 0h2v4a4 4 0 0 1-4 4h-3a7 7 0 0 0 2-5V4Z" />,
    refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
    reload: <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />,
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
    music: <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
    pause: <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>{icons[name]}</svg>
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
  const [quickMode, setQuickMode] = useState(false);

  // --- MUSIQUE YOUTUBE ---
  const [musicUrl, setMusicUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);

  // --- ÉTATS FORMULAIRES ---
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

  const formatMoney = (val) => `$${Number(val || 0).toFixed(2)}`;

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  const syncData = async () => {
    notify("Synchronisation...", "Mise à jour des stocks", "info");
    try {
      const res = await fetch('/api', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'syncData' }) });
      const json = await res.json();
      if (json.success) { setData(json); notify("Succès", "Données à jour", "success"); }
    } catch (e) { notify("Erreur", "Connexion perdue", "error"); }
  };

  const sendForm = async (action, payload) => {
    notify("Envoi...", "Patientez...", "info");
    try {
      const res = await fetch('/api', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action, data: { ...payload, employee: user } }) });
      const json = await res.json();
      if(json.success) {
        notify("Succès", "Validé !", "success");
        if(['sendFactures'].includes(action)) setCurrentTab('home');
        setCart([]); setInvNum('');
        syncData();
      } else notify("Erreur", json.message, "error");
    } catch(e) { notify("Erreur", "Serveur injoignable", "error"); }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const load = async () => {
      try {
        const res = await fetch('/api', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'getMeta' }) });
        const json = await res.json();
        setData(json);
        if(json?.vehicles?.length) { setExpData(p => ({...p, veh: json.vehicles[0]})); setGarData(p => ({...p, veh: json.vehicles[0]})); }
        if(json?.partners?.companies) setParCompany(Object.keys(json.partners.companies)[0]);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const login = () => { if(user) setView('app'); };
  const logout = () => { setUser(''); setView('login'); setCurrentTab('home'); };

  const employeesFull = data?.employeesFull || [];
  const myProfile = useMemo(() => employeesFull.find(e => e.name === user) || null, [employeesFull, user]);

  const addToCart = (prod) => {
    const existing = cart.find(x => x.name === prod);
    if(existing) setCart(cart.map(x => x.name === prod ? {...x, qty: x.qty + 1} : x));
    else setCart([...cart, {name: prod, qty: 1, pu: data?.prices?.[prod] || 0}]);
    if(!quickMode) notify("Added", prod, "success");
  };

  const topCA = useMemo(() => [...employeesFull].sort((a,b)=>b.ca-a.ca).slice(0,5), [employeesFull]);

  if(loading) return <div className="loader-screen"><img src="https://i.goopics.net/dskmxi.png" alt="logo" /><div className="pulse">Hen House</div></div>;

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #6366f1;
          --bg-dark: #09090b;
          --bg-panel: rgba(22, 22, 26, 0.75);
          --border: rgba(255, 255, 255, 0.08);
          --radius: 24px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); color: #f8fafc; height: 100vh; overflow: hidden; display: flex; }

        .loader-screen { position: fixed; inset: 0; background: var(--bg-dark); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; }
        .loader-screen img { height: 80px; border-radius: 20px; margin-bottom: 20px; }
        .pulse { font-weight: 900; font-size: 1.5rem; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .sidebar { 
          width: 280px; height: calc(100vh - 32px); margin: 16px; background: var(--bg-panel); 
          backdrop-filter: blur(24px); border-radius: var(--radius); border: 1px solid var(--border);
          display: flex; flex-direction: column; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); z-index: 50;
        }
        .nav-btn { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border: none; background: transparent;
          color: #94a3b8; font-weight: 600; cursor: pointer; transition: 0.2s; margin-bottom: 4px; font-size: 0.9rem;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.03); color: white; }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }

        .main-content { flex: 1; padding: 32px 32px 32px 16px; overflow-y: auto; position: relative; scrollbar-width: none; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .title { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.05em; }

        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; padding-bottom: 100px; }
        .prod-card { background: var(--bg-panel); border-radius: var(--radius); padding: 12px; border: 1px solid var(--border); transition: 0.3s; text-align: center; cursor: pointer; }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        .prod-img { width: 100%; aspect-ratio: 1; border-radius: 16px; object-fit: cover; margin-bottom: 12px; background: #000; }

        .inp-field { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 14px; color: white; font-size: 1rem; transition: 0.2s; font-family: inherit; }
        .inp-field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

        .btn { padding: 14px 24px; border-radius: 14px; border: none; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }

        .cart-float { position: fixed; bottom: 40px; right: 40px; background: var(--primary); color: white; padding: 16px 28px; border-radius: 50px; font-weight: 900; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); display: flex; gap: 12px; cursor: pointer; z-index: 99; transition: 0.2s; }
        .cart-float:hover { transform: scale(1.05); }

        .drawer { position: fixed; top: 16px; right: 16px; bottom: 16px; width: 420px; background: rgba(18,18,22,0.95); backdrop-filter: blur(30px); border-radius: 24px; border: 1px solid var(--border); box-shadow: -20px 0 60px rgba(0,0,0,0.6); z-index: 1000; transform: translateX(115%); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
        .drawer.open { transform: translateX(0); }

        .toast { position: fixed; bottom: 32px; right: 32px; z-index: 9999; background: var(--bg-panel); backdrop-filter: blur(20px); border: 1px solid var(--border); border-left: 5px solid var(--primary); padding: 16px 24px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } }

        .music-player { margin-top: auto; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 18px; border: 1px solid var(--border); }
        .play-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--primary); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .play-btn:hover { transform: scale(1.1); }

        .cat-pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .pill { padding: 8px 22px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 50px; white-space: nowrap; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: 0.2s; color: #94a3b8; }
        .pill.active { background: var(--primary); border-color: var(--primary); color: white; }

        .form-card { max-width: 650px; margin: 0 auto; background: var(--bg-panel); padding: 32px; border-radius: 24px; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .mini-card { background: var(--bg-panel); padding: 24px; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; transition: 0.3s; }
        .mini-card:hover { border-color: var(--primary); transform: translateY(-5px); }
      `}</style>

      {/* LECTEUR YOUTUBE INVISIBLE */}
      <div style={{ display: 'none' }}>
        <ReactPlayer url={musicUrl} playing={playing} volume={volume} loop={true} width="0" height="0" />
      </div>

      {view === 'login' ? (
        <div style={{position:'fixed', inset:0, background:'var(--bg-dark)', display:'flex', alignItems:'center', justify:'center', zIndex:10000}}>
          <div style={{width:400, padding:48, background:'var(--bg-panel)', borderRadius:32, border:'1px solid var(--border)', textAlign:'center', backdropFilter:'blur(30px)', boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
            <img src="https://i.goopics.net/dskmxi.png" style={{height:70, borderRadius:16, marginBottom:24}} alt="Logo" />
            <h2 style={{fontWeight:900, marginBottom:8, fontSize:'1.8rem', letterSpacing:'-0.05em'}}>Hen House</h2>
            <p style={{color:'#94a3b8', marginBottom:32, fontSize:'0.9rem'}}>Sélectionnez votre profil</p>
            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:24, textAlign:'center'}}>
              <option value="">Nom de l'employé...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={login}>Se connecter</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:40}}>
              <img src="https://i.goopics.net/dskmxi.png" style={{height:32, borderRadius:8}} alt="Logo" />
              <span style={{fontWeight:900, letterSpacing:'-0.05em', fontSize:'1.1rem'}}>HEN HOUSE</span>
            </div>

            <nav className="nav-list">
              <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}><Icon name="dashboard" /> Dashboard</button>
              <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" /> Caisse</button>
              <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}><Icon name="package" /> Stock</button>
              <button className={`nav-btn ${currentTab==='enterprise'?'active':''}`} onClick={()=>setCurrentTab('enterprise')}><Icon name="building" /> Entreprise</button>
              <button className={`nav-btn ${currentTab==='partners'?'active':''}`} onClick={()=>setCurrentTab('partners')}><Icon name="handshake" /> Partenaires</button>
              <button className={`nav-btn ${currentTab==='expenses'?'active':''}`} onClick={()=>setCurrentTab('expenses')}><Icon name="creditCard" /> Frais</button>
              <button className={`nav-btn ${currentTab==='garage'?'active':''}`} onClick={()=>setCurrentTab('garage')}><Icon name="car" /> Garage</button>
              <button className={`nav-btn ${currentTab==='directory'?'active':''}`} onClick={()=>setCurrentTab('directory')}><Icon name="users" /> Annuaire</button>
              <button className={`nav-btn ${currentTab==='performance'?'active':''}`} onClick={()=>setCurrentTab('performance')}><Icon name="trophy" /> Performance</button>
            </nav>

            <div className="music-player">
                <div style={{display:'flex', alignItems:'center', justify:'space-between', marginBottom:12}}>
                    <div><div style={{fontSize:'0.65rem', fontWeight:800}}>MUSIQUE</div><div style={{fontSize:'0.55rem', opacity:0.5}}>{playing ? 'Lecture...' : 'Pause'}</div></div>
                    <button className="play-btn" onClick={()=>setPlaying(!playing)}><Icon name={playing ? "pause" : "music"} size={14}/></button>
                </div>
                <select className="inp-field" style={{fontSize:'0.65rem', padding:'8px'}} onChange={(e)=>setMusicUrl(e.target.value)}>
                    <option value="https://www.youtube.com/watch?v=jfKfPfyJRdk">Lo-Fi Radio</option>
                    <option value="https://www.youtube.com/watch?v=5yx6BWlEVcY">Chill Jazz</option>
                    <option value="https://www.youtube.com/watch?v=S0uS8I_E7q0">Ambiance Chef</option>
                </select>
            </div>

            <div style={{marginTop:'20px', padding:'16px', background:'rgba(255,255,255,0.02)', borderRadius:16, border:'1px solid var(--border)'}}>
              <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:12}}>
                <div style={{width:36, height:36, background:'var(--primary)', borderRadius:10, display:'flex', alignItems:'center', justify:'center', fontWeight:800}}>{user[0]}</div>
                <div style={{fontSize:'0.8rem'}}><b>{user}</b></div>
              </div>
              <button onClick={logout} style={{background:'none', border:'none', color:'#ef4444', fontSize:'0.75rem', cursor:'pointer', fontWeight:700}}>Déconnexion</button>
            </div>
          </aside>

          <main className="main-content">
            <header className="header">
              <div className="title">{currentTab.toUpperCase()}</div>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{background:'var(--bg-panel)', padding:'8px 20px', borderRadius:50, border:'1px solid var(--border)', fontWeight:800, fontSize:'0.9rem', backdropFilter:'blur(10px)'}}>
                  Session: <span style={{color:'var(--primary)'}}>{formatMoney(cart.reduce((a,b)=>a+b.qty*b.pu, 0))}</span>
                </div>
                <button className="btn" style={{background:'var(--bg-panel)', border:'1px solid var(--border)', padding:10}} onClick={syncData}><Icon name="refresh" size={18}/></button>
              </div>
            </header>

            {/* VUES --- */}
            {currentTab === 'home' && (
              <div className="stat-grid">
                <div className="mini-card" onClick={()=>setCurrentTab('invoices')}>
                  <Icon name="receipt" size={32} style={{color:'var(--primary)', marginBottom:16}}/>
                  <div><div style={{fontWeight:800}}>Caisse</div><div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Vendre des produits</div></div>
                </div>
                <div className="mini-card" onClick={()=>setCurrentTab('stock')}>
                  <Icon name="package" size={32} style={{color:'var(--primary)', marginBottom:16}}/>
                  <div><div style={{fontWeight:800}}>Cuisine</div><div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Déclarer la production</div></div>
                </div>
                <div className="mini-card" onClick={()=>setCurrentTab('performance')}>
                  <Icon name="trophy" size={32} style={{color:'var(--primary)', marginBottom:16}}/>
                  <div><div style={{fontWeight:800}}>Top Employés</div><div style={{fontSize:'0.8rem', color:'#94a3b8'}}>Classement CA</div></div>
                </div>
              </div>
            )}

            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:12, marginBottom:16}}>
                    <div style={{position:'relative', flex:1}}>
                        <Icon name="search" style={{position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', opacity:0.3}} />
                        <input className="inp-field" style={{paddingLeft:48}} placeholder="Rechercher parmi +1000 produits..." onChange={e=>setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="cat-pills">
                  <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                  {data?.productsByCategory && Object.keys(data.productsByCategory).map(c=>(<div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace(/_/g,' ')}</div>))}
                </div>
                <div className="prod-grid">
                  {data?.products?.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p => (
                    <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                      <img src={IMAGES[p] || "https://via.placeholder.com/150"} className="prod-img" alt={p} />
                      <div style={{fontWeight:700, fontSize:'0.85rem', marginBottom:4}}>{p}</div>
                      <div style={{color:'var(--primary)', fontWeight:900}}>{formatMoney(data?.prices?.[p])}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'stock' && (
              <div className="form-card">
                <h2 style={{marginBottom:24, fontWeight:900, letterSpacing:'-0.04em'}}>Production Cuisine</h2>
                {stockItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                      {data?.products?.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:100}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                    <button onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}} style={{background:'none', border:'none', color:'#ef4444'}}><Icon name="x"/></button>
                  </div>
                ))}
                <button className="btn" style={{width:'100%', border:'1px dashed var(--border)', marginBottom:16}} onClick={()=>setStockItems([...stockItems, {product:data?.products[0], qty:1}])}>+ Ajouter ligne</button>
                <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Enregistrer la production</button>
              </div>
            )}

            {currentTab === 'garage' && (
              <div className="form-card">
                <h2 style={{marginBottom:24, fontWeight:900}}>Garage & Véhicules</h2>
                <div style={{marginBottom:16}}>
                   <label style={{fontSize:'0.7rem', fontWeight:800, color:'#94a3b8'}}>VÉHICULE</label>
                   <select className="inp-field" value={garData.veh} onChange={e=>setGarData({...garData, veh:e.target.value})}>{data?.vehicles?.map(v=><option key={v} value={v}>{v}</option>)}</select>
                </div>
                <div style={{marginBottom:16}}>
                   <label style={{fontSize:'0.7rem', fontWeight:800, color:'#94a3b8'}}>ACTION</label>
                   <select className="inp-field" value={garData.action} onChange={e=>setGarData({...garData, action:e.target.value})}><option>Entrée</option><option>Sortie</option></select>
                </div>
                <div style={{marginBottom:24}}>
                    <label style={{fontSize:'0.7rem', fontWeight:800, color:'#94a3b8'}}>ESSENCE ({garData.fuel}%)</label>
                    <input type="range" style={{width:'100%', accentColor:'var(--primary)'}} value={garData.fuel} onChange={e=>setGarData({...garData, fuel:e.target.value})} />
                </div>
                <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>sendForm('sendGarage', garData)}>Valider l'état</button>
              </div>
            )}

            {currentTab === 'performance' && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:24}}>
                <div style={{background:'var(--bg-panel)', padding:32, borderRadius:24, border:'1px solid var(--border)'}}>
                  <h3 style={{marginBottom:20, fontWeight:900}}>Top Revenu Mensuel</h3>
                  {topCA.map((e, i) => (
                    <div key={e.name} style={{display:'flex', justify:'space-between', padding:'16px 0', borderBottom:'1px solid var(--border)'}}>
                      <span style={{fontWeight:600}}>{i+1}. {e.name}</span>
                      <b style={{color:'var(--primary)'}}>{formatMoney(e.ca)}</b>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* PANIER DRAWER */}
          {currentTab === 'invoices' && cart.length > 0 && (
            <>
              <div className="cart-float" onClick={()=>setCartOpen(true)}>
                <Icon name="cart" /> <span>{formatMoney(cart.reduce((a,b)=>a+b.qty*b.pu, 0))}</span>
              </div>
              <aside className={`drawer ${cartOpen ? 'open' : ''}`}>
                <div style={{padding:24, borderBottom:'1px solid var(--border)', display:'flex', justify:'space-between', alignItems:'center'}}>
                  <h2 style={{fontWeight:900}}>Panier en cours</h2>
                  <button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}><Icon name="x" size={24}/></button>
                </div>
                <div style={{padding:24}}>
                  <label style={{fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', display:'block', marginBottom:8}}>N° FACTURE</label>
                  <input className="inp-field" style={{textAlign:'center', fontSize:'1.2rem', fontWeight:900}} placeholder="Ex: 8842" value={invNum} onChange={e=>setInvNum(e.target.value)} />
                </div>
                <div style={{flex:1, overflowY:'auto', padding:'0 24px'}}>
                  {cart.map((c, i) => (
                    <div key={i} style={{display:'flex', justify:'space-between', padding:'16px 0', borderBottom:'1px solid var(--border)'}}>
                      <div><div style={{fontWeight:700, fontSize:'0.9rem'}}>{c.name}</div><div style={{fontSize:'0.7rem', opacity:0.5}}>{formatMoney(c.pu)} x {c.qty}</div></div>
                      <b style={{color:'var(--primary)'}}>{formatMoney(c.pu * c.qty)}</b>
                    </div>
                  ))}
                </div>
                <div style={{padding:32, background:'rgba(0,0,0,0.2)', borderTop:'1px solid var(--border)'}}>
                  <div style={{display:'flex', justify:'space-between', fontSize:'1.5rem', fontWeight:900, marginBottom:24}}>
                    <span>Total</span>
                    <span style={{color:'var(--primary)'}}>{formatMoney(cart.reduce((a,b)=>a+b.qty*b.pu, 0))}</span>
                  </div>
                  <button className="btn btn-primary" style={{width:'100%', height:56}} onClick={()=>{
                    if(!invNum.trim()) return notify("Erreur", "ID Facture manquant", "error");
                    sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))});
                  }}>Enregistrer la vente</button>
                </div>
              </aside>
            </>
          )}

          {toast && <div className="toast"><div style={{fontWeight:900, fontSize:'0.9rem'}}>{toast.title}</div><div style={{fontSize:'0.8rem', opacity:0.6}}>{toast.msg}</div></div>}
        </>
      )}
    </>
  );
}
