'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

// --- ICONS (SVG) ---
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
        <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
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
    refresh: <path d="M21 12a9 9 0 0 1-15.3 6.36L3 16m0 0v6m0-6h6M3 12a9 9 0 0 1 15.3-6.36L21 8m0 0V2m0 6h-6" />,
    user: <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />,
    volume2: <path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a4.5 4.5 0 0 1 0 7M19 7a7 7 0 0 1 0 10" />,
    volumeX: <path d="M11 5 6 9H2v6h4l5 4V5ZM22 9l-6 6M16 9l6 6" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4ZM5 6H3a2 2 0 0 0 2 2h0M19 6h2a2 2 0 0 1-2 2h0" />,
    phone: <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />,
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

function money(n) { return `$${(Number(n)||0).toFixed(2)}`; }
function clampNum(v, min=0, max=999999) {
  const n = Number(String(v).replace(',', '.'));
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

// Simple beep (WebAudio) - pas besoin de fichier son
function beep(freq = 740, durationMs = 60, volume = 0.05) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = volume;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, durationMs);
  } catch {}
}

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
  const [fastMode, setFastMode] = useState(false);

  // Forms
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

  const [directoryQuery, setDirectoryQuery] = useState('');
  const [directoryRole, setDirectoryRole] = useState('Tous');
  const [profileOpen, setProfileOpen] = useState(false);

  const sessionTotal = useMemo(
    () => cart.reduce((a,b)=>a + (b.qty*b.pu), 0),
    [cart]
  );

  const currentEmployee = useMemo(() => {
    const list = data?.employeeDirectory || [];
    return list.find(e => (e.name||'').trim() === (user||'').trim()) || null;
  }, [data, user]);

  const topCA = useMemo(() => {
    const list = (data?.employeeDirectory || []).slice();
    list.sort((a,b)=> (b.ca||0) - (a.ca||0));
    return list.slice(0,5);
  }, [data]);

  const topStock = useMemo(() => {
    const list = (data?.employeeDirectory || []).slice();
    list.sort((a,b)=> (b.stock||0) - (a.stock||0));
    return list.slice(0,5);
  }, [data]);

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3200);
  };

  const fetchMeta = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ action: 'getMeta' }) });
      const json = await res.json();
      setData(json);
      setLoading(false);

      if(json.vehicles?.length) {
        setExpData(p => ({...p, veh: p.veh || json.vehicles[0]}));
        setGarData(p => ({...p, veh: p.veh || json.vehicles[0]}));
      }

      if(json.partners && Object.keys(json.partners.companies || {}).length) {
        const firstCompany = Object.keys(json.partners.companies)[0];
        setParCompany(p => p || firstCompany);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Erreur chargement");
    }
  };

  // INIT
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    fetchMeta();
  }, []);

  // Update Partner Beneficiaries
  useEffect(() => {
    if(data && parCompany) {
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

  const login = () => { if(user) setView('app'); };
  const logout = () => { setUser(''); setView('login'); setCurrentTab('home'); setCart([]); setCartOpen(false); };

  const addToCart = (prod) => {
    const existing = cart.find(x => x.name === prod);
    if(existing) {
      setCart(cart.map(x => x.name === prod ? {...x, qty: x.qty + 1} : x));
    } else {
      setCart([...cart, {name: prod, qty: 1, pu: data.prices[prod] || 0}]);
    }
    if (soundOn) beep(840, 40, 0.05);
    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].qty = clampNum(newCart[idx].qty + delta, 0, 9999);
    if(newCart[idx].qty <= 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const setQtyDirect = (idx, value) => {
    const newCart = [...cart];
    newCart[idx].qty = clampNum(value, 0, 9999);
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
        if (soundOn) beep(520, 70, 0.06);
        notify("Succès", "Action validée !", "success");

        // Reset forms
        if(action === 'sendFactures') { setCart([]); setInvNum(''); setCartOpen(false); setCurrentTab('home'); }
        if(action === 'sendProduction') setStockItems([{product:(data.products[0]), qty:1}]);
        if(action === 'sendEntreprise') { setEntItems([{product:(data.products[0]), qty:1}]); setEntName(''); }
        if(action === 'sendPartnerOrder') { setParItems([{menu:(data.partners.companies[parCompany]?.menus?.[0]?.name || ''), qty:1}]); setParNum(''); }
        if(action === 'sendSupport') setSupData({sub:'Autre', msg:''});
        if(action === 'sendExpense') setExpData(p => ({...p, amt:''}));

        // ✅ soft refresh des stats (CA/Stock)
        fetchMeta();
      } else {
        notify("Erreur", json.message || "Erreur", "error");
      }
    } catch(e) {
      notify("Erreur", e.message, "error");
    }
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
    if(!expData.amt || Number(expData.amt) <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm('sendExpense', {vehicle:expData.veh, kind:expData.kind, amount:Number(expData.amt)});
  };

  const directoryList = useMemo(() => {
    let list = (data?.employeeDirectory || []).slice();
    if(directoryRole !== 'Tous') list = list.filter(e => (e.role||'') === directoryRole);
    if(directoryQuery.trim()) {
      const q = directoryQuery.toLowerCase();
      list = list.filter(e =>
        (e.name||'').toLowerCase().includes(q) ||
        (e.phone||'').toLowerCase().includes(q) ||
        (e.role||'').toLowerCase().includes(q)
      );
    }
    list.sort((a,b)=>a.name.localeCompare(b.name,'fr'));
    return list;
  }, [data, directoryQuery, directoryRole]);

  const allRoles = useMemo(() => {
    const set = new Set((data?.employeeDirectory || []).map(e => e.role).filter(Boolean));
    return ['Tous', ...Array.from(set)];
  }, [data]);

  const copyToClipboard = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      notify("Copié", txt, "success");
      if (soundOn) beep(920, 40, 0.04);
    } catch {
      notify("Erreur", "Impossible de copier", "error");
    }
  };

  if(loading) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'white'}}>
      <div style={{textAlign:'center', width:380}}>
        <img src="https://i.goopics.net/dskmxi.png" style={{height:62, marginBottom:18, borderRadius:14}} />
        <div style={{fontWeight:900, fontSize:'1.05rem', marginBottom:8}}>Chargement Hen House…</div>
        <div style={{opacity:0.7, fontSize:'0.9rem'}}>Connexion aux données • v{data?.version || '...'}</div>
        <div style={{marginTop:18}}>
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
          <div className="skeleton-bar" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6; /* violet par défaut */
          --primary-2: rgba(139, 92, 246, 0.16);
          --bg-body: #0f1115;
          --bg-panel: #171a21;
          --bg-panel-2: rgba(255,255,255,0.04);
          --text-main: #f8fafc;
          --text-muted: rgba(148,163,184,0.85);
          --border: rgba(148,163,184,0.16);
          --border-2: rgba(148,163,184,0.10);
          --radius: 22px;
          --sidebar-w: 280px;
          --shadow: 0 25px 60px rgba(0,0,0,0.35);
        }

        [data-theme="light"] {
          --bg-body: #f7f8fb;
          --bg-panel: #ffffff;
          --bg-panel-2: rgba(15,17,21,0.04);
          --text-main: #0f172a;
          --text-muted: rgba(71,85,105,0.85);
          --border: rgba(15,23,42,0.12);
          --border-2: rgba(15,23,42,0.08);
          --shadow: 0 25px 60px rgba(15,23,42,0.12);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; }

        /* ✅ SELECT FIX (dark / light) */
        select, option {
          color: var(--text-main);
          background: var(--bg-panel);
        }
        select {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 14px;
          font-weight: 800;
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
            linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) calc(1em + 4px),
            calc(100% - 13px) calc(1em + 4px);
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }
        select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-2);
        }
        option { padding: 10px; }
        /* (sur certains navigateurs option reste natif : au minimum c'est lisible) */

        input, textarea {
          color: var(--text-main);
        }

        /* Sidebar */
        .sidebar {
          width: var(--sidebar-w);
          height: 96vh;
          margin: 2vh;
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          padding: 22px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .sidebar:before {
          content:"";
          position:absolute;
          inset:-2px;
          background: radial-gradient(1200px 300px at 20% 0%, var(--primary-2), transparent 55%);
          pointer-events:none;
        }
        .brand { display:flex; align-items:center; gap:12px; font-weight: 950; font-size: 1.15rem; margin-bottom: 22px; }
        .brand img { height: 32px; width: 32px; border-radius: 10px; border: 1px solid var(--border); }
        .nav-list { display:flex; flex-direction:column; gap: 8px; padding: 10px 0; }
        .nav-btn {
          display:flex; align-items:center; gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-weight: 850;
          font-size: 0.95rem;
          cursor:pointer;
          transition: 0.18s;
        }
        .nav-btn:hover { background: var(--bg-panel-2); color: var(--text-main); border-color: var(--border-2); }
        .nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 14px 34px rgba(0,0,0,0.2);
        }

        /* Main */
        .main-content { flex:1; padding: 2vh 2vh 2vh 0; overflow-y:auto; overflow-x:hidden; }
        .header-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom: 22px; padding: 0 10px; }
        .page-title { font-size: 1.65rem; font-weight: 950; display:flex; align-items:center; gap: 10px; }

        .top-actions { display:flex; gap: 10px; align-items:center; }
        .chip {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          color: var(--text-muted);
          display:flex;
          align-items:center;
          gap: 10px;
        }
        .chip strong { color: var(--text-main); }
        .icon-btn {
          width: 42px; height: 42px;
          border-radius: 999px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition: 0.18s;
        }
        .icon-btn:hover { transform: translateY(-1px); border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }
        .toggle {
          display:flex; align-items:center; gap:10px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 900;
          color: var(--text-muted);
        }
        .switch {
          width: 46px; height: 26px;
          border-radius: 999px;
          background: var(--bg-panel-2);
          border: 1px solid var(--border);
          position: relative;
          cursor: pointer;
          flex-shrink:0;
        }
        .switch:after {
          content:"";
          position:absolute;
          top: 3px; left: 3px;
          width: 20px; height: 20px;
          border-radius: 999px;
          background: var(--text-main);
          opacity: 0.9;
          transition: 0.18s;
        }
        .switch.on {
          background: var(--primary);
          border-color: transparent;
        }
        .switch.on:after { left: 23px; background: white; }

        /* Dashboard cards */
        .dashboard-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .dash-card {
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border-radius: var(--radius);
          padding: 22px;
          border: 1px solid var(--border);
          cursor:pointer;
          transition: 0.22s;
          min-height: 170px;
          position: relative;
          overflow: hidden;
        }
        .dash-card:before {
          content:"";
          position:absolute; inset:-2px;
          background: radial-gradient(600px 220px at 0% 0%, var(--primary-2), transparent 60%);
          pointer-events:none;
          opacity: 0.9;
        }
        .dash-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: var(--shadow); }
        .dash-icon { width: 48px; height: 48px; border-radius: 16px; background: var(--bg-panel-2); border: 1px solid var(--border-2); display:flex; align-items:center; justify-content:center; color: var(--primary); margin-bottom: 14px; }
        .dash-title { font-size: 1.05rem; font-weight: 950; margin-bottom: 4px; }
        .dash-desc { color: var(--text-muted); font-weight: 700; font-size: 0.9rem; }

        /* Search / pills */
        .search-container { position: relative; margin-bottom: 14px; max-width: 520px; }
        .search-inp {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          font-size: 1rem;
          font-weight: 850;
        }
        .search-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }
        .search-icon { position:absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

        .cat-pills { display:flex; gap: 10px; overflow-x:auto; padding-bottom: 8px; margin-bottom: 14px; }
        .pill {
          padding: 9px 16px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-weight: 900;
          cursor:pointer;
          white-space: nowrap;
          transition: 0.18s;
          color: var(--text-muted);
        }
        .pill:hover { border-color: var(--primary); color: var(--text-main); }
        .pill.active { background: var(--primary); color: white; border-color: transparent; }

        /* Products */
        .prod-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 14px; }
        .prod-card {
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border-radius: 20px;
          border: 1px solid var(--border);
          cursor:pointer;
          transition: 0.18s;
          padding: 12px;
        }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow); }
        .prod-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          object-fit: cover;
          background: var(--bg-panel-2);
          border: 1px solid var(--border-2);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 2rem;
          color: var(--text-muted);
        }
        .prod-title { margin-top: 10px; font-weight: 950; font-size: 0.92rem; min-height: 38px; display:flex; align-items:center; justify-content:center; text-align:center; }
        .prod-price { margin-top: 6px; font-weight: 950; color: var(--primary); font-size: 1.05rem; text-align:center; }

        /* Forms */
        .form-wrap {
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          padding: 28px;
          border-radius: 26px;
          max-width: 680px;
          margin: 0 auto;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .inp-group { margin-bottom: 14px; }
        .inp-label { display:block; margin-bottom: 8px; font-weight: 900; color: var(--text-muted); }
        .inp-field {
          width: 100%;
          padding: 14px 14px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 850;
        }
        .inp-field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }

        .rowline { display:flex; gap: 10px; margin-bottom: 10px; align-items:center; }
        .mini-number {
          width: 110px;
          text-align: center;
          padding: 14px 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          font-weight: 950;
          font-size: 1rem;
        }

        .btn {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 16px;
          font-weight: 950;
          font-size: 1rem;
          cursor:pointer;
          transition: 0.18s;
          display:flex;
          justify-content:center;
          align-items:center;
          gap: 10px;
        }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 18px 40px rgba(0,0,0,0.25); }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
        .btn-ghost:hover { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }
        .btn-text { background: transparent; border: 1px dashed var(--border); color: var(--text-muted); }
        .btn-text:hover { border-color: var(--primary); color: var(--text-main); }

        .danger { border-color: rgba(239,68,68,0.5) !important; color: #ef4444 !important; }

        /* Cart drawer */
        .cart-drawer {
          position: fixed;
          top:0; right:0;
          width: 420px;
          height: 100vh;
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border-left: 1px solid var(--border);
          box-shadow: -30px 0 80px rgba(0,0,0,0.35);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
          display:flex;
          flex-direction:column;
        }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 18px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border); }
        .cart-body { flex:1; overflow-y:auto; padding: 14px 16px; }
        .cart-foot { padding: 18px; background: var(--bg-panel-2); border-top: 1px solid var(--border); }
        .cart-item {
          display:flex; align-items:center; gap: 12px;
          padding: 12px;
          border-radius: 18px;
          background: var(--bg-panel-2);
          border: 1px solid var(--border-2);
          margin-bottom: 10px;
        }
        .qty-ctrl { display:flex; gap: 8px; align-items:center; }
        .qb {
          width: 36px; height: 36px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          cursor:pointer;
          font-weight: 950;
          color: var(--text-main);
        }
        .qb:hover { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }
        .qty-input {
          width: 64px;
          text-align:center;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          padding: 10px 10px;
          font-weight: 950;
        }
        .cart-btn-float {
          position: fixed;
          bottom: 26px; right: 26px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          padding: 14px 18px;
          border-radius: 999px;
          font-weight: 950;
          cursor:pointer;
          box-shadow: var(--shadow);
          display:flex;
          align-items:center;
          gap: 10px;
          z-index: 90;
        }
        .cart-btn-float:hover { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2), var(--shadow); }

        /* Login */
        #gate { position:fixed; inset:0; background: var(--bg-body); display:flex; align-items:center; justify-content:center; z-index: 2000; }
        .login-box {
          width: 420px;
          padding: 28px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border-radius: 26px;
          box-shadow: var(--shadow);
          text-align:center;
        }

        /* Toast */
        .toast {
          position: fixed;
          top: 22px; right: 22px;
          z-index: 3000;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          padding: 14px 16px;
          border-radius: 18px;
          box-shadow: var(--shadow);
          min-width: 300px;
          animation: slideIn 0.22s;
          display:flex;
          gap: 12px;
          align-items:flex-start;
        }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } }
        .t-title { font-weight: 950; }
        .t-msg { font-weight: 800; color: var(--text-muted); margin-top: 2px; font-size: 0.9rem; }

        /* ✅ Bottom profile card */
        .user-card {
          margin-top: auto;
          padding-top: 14px;
        }
        .uc-wrap {
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 14px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
        }
        .uc-top {
          display:flex;
          align-items:center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .avatar {
          width: 44px; height: 44px;
          border-radius: 16px;
          background: var(--primary);
          color: white;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight: 950;
          border: 1px solid rgba(255,255,255,0.18);
          flex-shrink:0;
        }
        .uc-name { font-weight: 950; line-height: 1.1; }
        .uc-sub {
          display:flex;
          gap: 8px;
          align-items:center;
          margin-top: 4px;
          color: var(--text-muted);
          font-weight: 900;
          font-size: 0.85rem;
        }
        .badge {
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-panel-2);
          color: var(--text-main);
          font-weight: 950;
          font-size: 0.78rem;
        }
        .stats2 {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 12px;
        }
        .statbox {
          background: var(--bg-panel-2);
          border: 1px solid var(--border-2);
          border-radius: 16px;
          padding: 10px;
        }
        .statbox .k { color: var(--text-muted); font-weight: 950; font-size: 0.8rem; }
        .statbox .v { font-weight: 950; margin-top: 4px; }
        .uc-actions {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .uc-actions2 {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        .small-btn {
          width: 100%;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          color: var(--text-main);
          font-weight: 950;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          transition: 0.18s;
        }
        .small-btn:hover { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }
        .small-btn.danger:hover { box-shadow: 0 0 0 4px rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.55); }

        .mini-actions {
          display:flex;
          gap: 10px;
          justify-content:center;
          margin-top: 10px;
        }
        .mini-icon {
          width: 42px; height: 42px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition: 0.18s;
        }
        .mini-icon:hover { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-2); }

        /* Directory */
        .dir-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .dir-card {
          background: linear-gradient(180deg, var(--bg-panel), rgba(255,255,255,0.02));
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
        }
        .dir-card .row { display:flex; align-items:center; justify-content:space-between; gap: 10px; }
        .dir-card .nm { font-weight: 950; }
        .dir-card .ph { color: var(--text-muted); font-weight: 900; font-size: 0.92rem; margin-top: 6px; display:flex; align-items:center; gap: 8px; }
        .dir-card .meta { margin-top: 10px; display:flex; gap: 8px; flex-wrap:wrap; }
        .dir-card .meta .pill2 {
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-panel-2);
          font-weight: 950;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Skeleton for loading screen */
        .skeleton-bar {
          height: 12px;
          width: 100%;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.06);
          overflow:hidden;
          position:relative;
          margin: 10px auto;
        }
        .skeleton-bar:after {
          content:"";
          position:absolute;
          inset:0;
          transform: translateX(-60%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer { to { transform: translateX(60%); } }

        /* Responsive */
        @media (max-width: 980px) {
          .sidebar { width: 260px; }
          .cart-drawer { width: min(420px, 92vw); }
        }
      `}</style>

      {view === 'login' ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{height:64, marginBottom:14, borderRadius:14}} />
            <div style={{fontWeight:950, fontSize:'1.2rem'}}>Bienvenue</div>
            <div style={{color:'var(--text-muted)', fontWeight:850, marginTop:6, marginBottom:18}}>Connectez-vous pour commencer</div>

            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{textAlign:'center', marginBottom:12}}>
              <option value="">Sélectionner un nom...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{marginTop:14, color:'var(--text-muted)', fontWeight:900, fontSize:'0.85rem'}}>
              Hen House v{data?.version}
            </div>
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
                <Icon name="user" /> Annuaire
              </button>
              <button className={`nav-btn ${currentTab==='performance'?'active':''}`} onClick={()=>setCurrentTab('performance')}>
                <Icon name="trophy" /> Performance
              </button>
              <button className={`nav-btn ${currentTab==='support'?'active':''}`} onClick={()=>setCurrentTab('support')}>
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            {/* ✅ Bottom Card refaite */}
            <div className="user-card">
              <div className="uc-wrap">
                <div className="uc-top">
                  <div className="avatar">{(user||'?').charAt(0)}</div>
                  <div style={{flex:1}}>
                    <div className="uc-name">{user}</div>
                    <div className="uc-sub">
                      <span className="badge">{currentEmployee?.role || 'Employé'}</span>
                      <span style={{opacity:0.7}}>•</span>
                      <span>{currentEmployee?.seniorityDays ?? 0} j</span>
                    </div>
                  </div>
                </div>

                <div className="stats2">
                  <div className="statbox">
                    <div className="k">CA</div>
                    <div className="v">{money(currentEmployee?.ca || 0)}</div>
                  </div>
                  <div className="statbox">
                    <div className="k">Stock</div>
                    <div className="v">{Number(currentEmployee?.stock || 0)}</div>
                  </div>
                </div>

                <div className="uc-actions">
                  <button className="small-btn" onClick={()=>setCurrentTab('directory')}>
                    <Icon name="user" size={18} /> Annuaire
                  </button>
                  <button className="small-btn" onClick={()=>setProfileOpen(true)}>
                    <Icon name="user" size={18} /> Profil
                  </button>
                </div>

                <div className="uc-actions2">
                  <button className="small-btn" onClick={fetchMeta}>
                    <Icon name="refresh" size={18} /> Rafraîchir
                  </button>
                  <button className="small-btn danger" onClick={logout}>
                    <Icon name="logout" size={18} /> Quitter
                  </button>
                </div>

                <div className="mini-actions">
                  <button className="mini-icon" title="Son ON/OFF" onClick={()=>setSoundOn(v=>!v)}>
                    {soundOn ? <Icon name="volume2" size={18} /> : <Icon name="volumeX" size={18} />}
                  </button>
                  <button className="mini-icon" title="Rafraîchir le site" onClick={()=>window.location.reload()}>
                    <Icon name="refresh" size={18} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="header-bar">
              <div className="page-title">
                {currentTab === 'home' && <><Icon name="dashboard" size={30} /> Tableau de bord</>}
                {currentTab === 'invoices' && <><Icon name="receipt" size={30} /> Caisse</>}
                {currentTab === 'stock' && <><Icon name="package" size={30} /> Stock</>}
                {currentTab === 'enterprise' && <><Icon name="building" size={30} /> Entreprise</>}
                {currentTab === 'partners' && <><Icon name="handshake" size={30} /> Partenaires</>}
                {currentTab === 'garage' && <><Icon name="car" size={30} /> Garage</>}
                {currentTab === 'expenses' && <><Icon name="creditCard" size={30} /> Frais</>}
                {currentTab === 'support' && <><Icon name="lifeBuoy" size={30} /> Support</>}
                {currentTab === 'directory' && <><Icon name="user" size={30} /> Annuaire</>}
                {currentTab === 'performance' && <><Icon name="trophy" size={30} /> Performance</>}
              </div>

              <div className="top-actions">
                <div className="chip">Session: <strong>{money(sessionTotal)}</strong></div>

                {currentTab === 'invoices' && (
                  <div className="toggle">
                    Mode rapide
                    <div className={`switch ${fastMode ? 'on' : ''}`} onClick={()=>setFastMode(v=>!v)} />
                  </div>
                )}

                <button className="icon-btn" title="Rafraîchir" onClick={fetchMeta}>
                  <Icon name="refresh" size={18} />
                </button>

                <button className="icon-btn" title="Theme" onClick={toggleTheme}>
                  {darkMode ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === 'home' && (
              <>
                <div className="dashboard-grid" style={{marginBottom: 18}}>
                  <div className="dash-card" onClick={()=>setCurrentTab('invoices')}>
                    <div className="dash-icon"><Icon name="receipt" size={24} /></div>
                    <div>
                      <div className="dash-title">Caisse</div>
                      <div className="dash-desc">Nouvelle vente</div>
                    </div>
                  </div>
                  <div className="dash-card" onClick={()=>setCurrentTab('stock')}>
                    <div className="dash-icon"><Icon name="package" size={24} /></div>
                    <div>
                      <div className="dash-title">Stock</div>
                      <div className="dash-desc">Déclaration cuisine</div>
                    </div>
                  </div>
                  <div className="dash-card" onClick={()=>setCurrentTab('enterprise')}>
                    <div className="dash-icon"><Icon name="building" size={24} /></div>
                    <div>
                      <div className="dash-title">Entreprise</div>
                      <div className="dash-desc">Commandes B2B</div>
                    </div>
                  </div>
                  <div className="dash-card" onClick={()=>setCurrentTab('performance')}>
                    <div className="dash-icon"><Icon name="trophy" size={24} /></div>
                    <div>
                      <div className="dash-title">Performance</div>
                      <div className="dash-desc">Top vendeurs & production</div>
                    </div>
                  </div>
                </div>

                {/* Mini ranking */}
                <div className="dashboard-grid">
                  <div className="dash-card" style={{cursor:'default'}}>
                    <div className="dash-icon"><Icon name="trophy" size={24} /></div>
                    <div className="dash-title">Top CA</div>
                    <div className="dash-desc" style={{marginTop:10}}>
                      {topCA.map((e, i)=>(
                        <div key={e.name} style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:6}}>
                          <span>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'•'} {e.name}</span>
                          <span style={{color:'var(--primary)'}}>{money(e.ca)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dash-card" style={{cursor:'default'}}>
                    <div className="dash-icon"><Icon name="package" size={24} /></div>
                    <div className="dash-title">Top Stock</div>
                    <div className="dash-desc" style={{marginTop:10}}>
                      {topStock.map((e, i)=>(
                        <div key={e.name} style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:6}}>
                          <span>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'•'} {e.name}</span>
                          <span style={{color:'var(--primary)'}}>{Number(e.stock)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CAISSE */}
            {currentTab === 'invoices' && (
              <>
                <div className="search-container">
                  <div className="search-icon"><Icon name="search" size={18} /></div>
                  <input className="search-inp" placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} />
                </div>

                <div className="cat-pills">
                  <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                  {Object.keys(data.productsByCategory).map(c => (
                    <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>
                      {c.replace(/_/g,' ')}
                    </div>
                  ))}
                </div>

                <div className="prod-grid" style={{gridTemplateColumns: fastMode ? 'repeat(auto-fill, minmax(210px, 1fr))' : undefined}}>
                  {data.products
                    .filter(p => {
                      const cat = Object.keys(data.productsByCategory).find(k=>data.productsByCategory[k].includes(p));
                      return (catFilter==='Tous' || cat===catFilter) && p.toLowerCase().includes(search.toLowerCase());
                    })
                    .map(p => (
                      <div key={p} className="prod-card" onClick={()=>addToCart(p)}>
                        {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img">{p.charAt(0)}</div>}
                        <div className="prod-title">{p}</div>
                        <div className="prod-price">{money(data.prices[p])}</div>
                      </div>
                    ))
                  }
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === 'stock' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="package" /> Déclaration Stock</h2>

                {stockItems.map((item, i) => (
                  <div key={i} className="rowline">
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems]; n[i].product=e.target.value; setStockItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>

                    <input
                      type="number"
                      className="mini-number"
                      value={item.qty}
                      onChange={e=>{const n=[...stockItems]; n[i].qty = clampNum(e.target.value,0,99999); setStockItems(n)}}
                      inputMode="numeric"
                    />

                    <button className="qb danger" onClick={()=>{
                      const n=[...stockItems]; n.splice(i,1);
                      setStockItems(n.length ? n : [{product:data.products[0], qty:1}]);
                    }}>
                      <Icon name="x" size={16}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setStockItems([...stockItems, {product:data.products[0], qty:1}])}>
                  + Ajouter ligne
                </button>
                <button className="btn btn-primary" style={{marginTop:14}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ENTREPRISE */}
            {currentTab === 'enterprise' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="building" /> Commande Pro</h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={e=>setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} className="rowline">
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...entItems]; n[i].product=e.target.value; setEntItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>

                    <input
                      type="number"
                      className="mini-number"
                      value={item.qty}
                      onChange={e=>{const n=[...entItems]; n[i].qty = clampNum(e.target.value,0,99999); setEntItems(n)}}
                      inputMode="numeric"
                    />

                    <button className="qb danger" onClick={()=>{
                      const n=[...entItems]; n.splice(i,1);
                      setEntItems(n.length ? n : [{product:data.products[0], qty:1}]);
                    }}>
                      <Icon name="x" size={16}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setEntItems([...entItems, {product:data.products[0], qty:1}])}>
                  + Ajouter ligne
                </button>

                <button className="btn btn-primary" style={{marginTop:14}} onClick={handleSendEnterprise}>
                  Valider
                </button>
              </div>
            )}

            {/* PARTENAIRES */}
            {currentTab === 'partners' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="handshake" /> Partenaires</h2>

                <div className="inp-group">
                  <label className="inp-label">N° Facture</label>
                  <input className="inp-field" value={parNum} onChange={e=>setParNum(e.target.value)} />
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                  <div className="inp-group">
                    <label className="inp-label">Société</label>
                    <select className="inp-field" value={parCompany} onChange={e=>setParCompany(e.target.value)}>
                      {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Bénéficiaire</label>
                    <select className="inp-field" value={parBenef} onChange={e=>setParBenef(e.target.value)}>
                      {parCompany && data.partners.companies[parCompany].beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {parItems.map((item, i) => (
                  <div key={i} className="rowline">
                    <select className="inp-field" value={item.menu} onChange={e=>{const n=[...parItems]; n[i].menu=e.target.value; setParItems(n)}} style={{flex:1}}>
                      {parCompany && data.partners.companies[parCompany].menus.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>

                    <input
                      type="number"
                      className="mini-number"
                      value={item.qty}
                      onChange={e=>{const n=[...parItems]; n[i].qty = clampNum(e.target.value,0,99999); setParItems(n)}}
                      inputMode="numeric"
                    />

                    <button className="qb danger" onClick={()=>{
                      const n=[...parItems]; n.splice(i,1);
                      const first = data.partners.companies[parCompany]?.menus?.[0]?.name || '';
                      setParItems(n.length ? n : [{menu:first, qty:1}]);
                    }}>
                      <Icon name="x" size={16}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>{
                  const first = data.partners.companies[parCompany]?.menus?.[0]?.name || '';
                  setParItems([...parItems, {menu:first, qty:1}]);
                }}>
                  + Menu
                </button>

                <button className="btn btn-primary" style={{marginTop:14}} onClick={handleSendPartner}>
                  Confirmer
                </button>
              </div>
            )}

            {/* FRAIS */}
            {currentTab === 'expenses' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="creditCard" /> Frais</h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={expData.veh} onChange={e=>setExpData({...expData, veh:e.target.value})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
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
                  <input
                    type="number"
                    className="inp-field"
                    value={expData.amt}
                    onChange={e=>setExpData({...expData, amt:e.target.value})}
                    inputMode="decimal"
                  />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>
                  Déclarer
                </button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === 'garage' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="car" /> Garage</h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={garData.veh} onChange={e=>setGarData({...garData, veh:e.target.value})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
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
                  <input
                    type="number"
                    className="inp-field"
                    value={garData.fuel}
                    onChange={e=>setGarData({...garData, fuel: clampNum(e.target.value,0,100)})}
                    inputMode="numeric"
                  />
                </div>

                <button className="btn btn-primary" onClick={()=>sendForm('sendGarage', {vehicle:garData.veh, action:garData.action, fuel:garData.fuel})}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === 'support' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10}}><Icon name="lifeBuoy" /> Support</h2>

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

                <button className="btn btn-primary" onClick={()=>sendForm('sendSupport', {subject:supData.sub, message:supData.msg})}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ANNUAIRE */}
            {currentTab === 'directory' && (
              <>
                <div style={{display:'flex', gap: 12, marginBottom: 14, flexWrap:'wrap'}}>
                  <div style={{flex:'1 1 320px'}} className="search-container">
                    <div className="search-icon"><Icon name="search" size={18} /></div>
                    <input className="search-inp" placeholder="Rechercher (nom, tel, poste)..." value={directoryQuery} onChange={e=>setDirectoryQuery(e.target.value)} />
                  </div>

                  <div style={{width: 240}}>
                    <select className="inp-field" value={directoryRole} onChange={e=>setDirectoryRole(e.target.value)}>
                      {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <button className="btn btn-ghost" style={{width: 200, height: 52}} onClick={fetchMeta}>
                    <Icon name="refresh" size={18} /> Rafraîchir
                  </button>
                </div>

                <div className="dir-grid">
                  {directoryList.map(emp => (
                    <div key={emp.id + emp.name} className="dir-card">
                      <div className="row">
                        <div className="nm">{emp.name}</div>
                        <span className="badge">{emp.role || 'Employé'}</span>
                      </div>

                      <div className="ph">
                        <Icon name="phone" size={16} />
                        <span>{emp.phone || '—'}</span>
                        {emp.phone ? (
                          <button className="small-btn" style={{width:'auto', padding:'8px 10px', borderRadius:14}} onClick={()=>copyToClipboard(emp.phone)}>
                            Copier
                          </button>
                        ) : null}
                      </div>

                      <div className="meta">
                        <span className="pill2">Ancienneté: {emp.seniorityDays || 0} j</span>
                        <span className="pill2">CA: {money(emp.ca || 0)}</span>
                        <span className="pill2">Stock: {Number(emp.stock || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PERFORMANCE */}
            {currentTab === 'performance' && (
              <div className="form-wrap" style={{maxWidth: 920}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap: 10, flexWrap:'wrap'}}>
                  <h2 style={{display:'flex', alignItems:'center', gap:10}}><Icon name="trophy" /> Classements</h2>
                  <div style={{display:'flex', gap: 10}}>
                    <button className="btn btn-ghost" style={{width: 220}} onClick={fetchMeta}>
                      <Icon name="refresh" size={18} /> Rafraîchir (stats)
                    </button>
                    <button className="btn btn-primary" style={{width: 220}} onClick={()=>window.location.reload()}>
                      <Icon name="refresh" size={18} /> Rafraîchir le site
                    </button>
                  </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginTop: 14}}>
                  <div className="dir-card">
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <div style={{fontWeight:950, fontSize:'1.05rem'}}>Top CA</div>
                      <span className="badge">5</span>
                    </div>
                    <div style={{marginTop:10}}>
                      {topCA.map((e, i)=>(
                        <div key={e.name} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border-2)', fontWeight:900}}>
                          <span>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'•'} {e.name}</span>
                          <span style={{color:'var(--primary)'}}>{money(e.ca)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dir-card">
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <div style={{fontWeight:950, fontSize:'1.05rem'}}>Top Stock</div>
                      <span className="badge">5</span>
                    </div>
                    <div style={{marginTop:10}}>
                      {topStock.map((e, i)=>(
                        <div key={e.name} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border-2)', fontWeight:900}}>
                          <span>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'•'} {e.name}</span>
                          <span style={{color:'var(--primary)'}}>{Number(e.stock)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{marginTop: 14, color:'var(--text-muted)', fontWeight:900}}>
                  Astuce: clique “Rafraîchir (stats)” après une vente/stock pour actualiser le classement.
                </div>
              </div>
            )}
          </main>

          {/* CART DRAWER */}
          {currentTab === 'invoices' && (
            <>
              <div className="cart-btn-float" onClick={()=>setCartOpen(true)}>
                <Icon name="cart" size={20} />
                <span>Panier</span>
                <span style={{marginLeft:'auto', fontWeight:950, color:'var(--primary)'}}>{money(sessionTotal)}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-head">
                  <h2 style={{display:'flex', alignItems:'center', gap:10}}><Icon name="cart" /> Panier</h2>
                  <button className="icon-btn" onClick={()=>setCartOpen(false)}><Icon name="x" size={18} /></button>
                </div>

                <div style={{padding:16}}>
                  <input className="inp-field" placeholder="N° Facture (Obligatoire)" style={{textAlign:'center'}} value={invNum} onChange={e=>setInvNum(e.target.value)} />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div style={{textAlign:'center', marginTop:50, color:'var(--text-muted)', fontWeight:900}}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{flex:1}}>
                        <div style={{fontWeight:950}}>{c.name}</div>
                        <div style={{color:'var(--text-muted)', fontWeight:900}}>{money(c.pu)}</div>
                      </div>

                      <div className="qty-ctrl">
                        <button className="qb" onClick={()=>modQty(i,-1)}>-</button>

                        {/* ✅ quantité au clavier */}
                        <input
                          className="qty-input"
                          type="number"
                          value={c.qty}
                          onChange={(e)=>setQtyDirect(i, e.target.value)}
                          inputMode="numeric"
                        />

                        <button className="qb" onClick={()=>modQty(i,1)}>+</button>
                      </div>

                      <button className="qb danger" onClick={()=>setQtyDirect(i, 0)}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:950, marginBottom:12}}>
                    <span>Total</span>
                    <span style={{color:'var(--primary)'}}>{money(sessionTotal)}</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>
                    Valider la vente
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* PROFIL MODAL (simple) */}
          {profileOpen && (
            <div
              onClick={()=>setProfileOpen(false)}
              style={{
                position:'fixed', inset:0, background:'rgba(0,0,0,0.55)',
                display:'flex', alignItems:'center', justifyContent:'center', zIndex: 4000,
                padding: 18
              }}
            >
              <div
                onClick={(e)=>e.stopPropagation()}
                className="dir-card"
                style={{width:'min(520px, 92vw)', borderRadius: 24}}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontWeight:950, fontSize:'1.1rem', display:'flex', alignItems:'center', gap:10}}>
                    <Icon name="user" /> Profil
                  </div>
                  <button className="icon-btn" onClick={()=>setProfileOpen(false)}><Icon name="x" size={18} /></button>
                </div>

                <div style={{marginTop:14}}>
                  <div style={{fontWeight:950, fontSize:'1.15rem'}}>{user}</div>
                  <div style={{marginTop:6, color:'var(--text-muted)', fontWeight:900}}>
                    Poste: <span style={{color:'var(--text-main)'}}>{currentEmployee?.role || 'Employé'}</span> • Ancienneté: <span style={{color:'var(--text-main)'}}>{currentEmployee?.seniorityDays ?? 0} jours</span>
                  </div>

                  <div style={{marginTop:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
                    <div className="statbox">
                      <div className="k">Téléphone</div>
                      <div className="v">{currentEmployee?.phone || '—'}</div>
                    </div>
                    <div className="statbox">
                      <div className="k">Salaire</div>
                      <div className="v">{money(currentEmployee?.salary || 0)}</div>
                    </div>
                    <div className="statbox">
                      <div className="k">CA</div>
                      <div className="v">{money(currentEmployee?.ca || 0)}</div>
                    </div>
                    <div className="statbox">
                      <div className="k">Stock</div>
                      <div className="v">{Number(currentEmployee?.stock || 0)}</div>
                    </div>
                  </div>

                  <div style={{marginTop:14, display:'flex', gap: 10}}>
                    <button className="btn btn-ghost" onClick={()=>{ setProfileOpen(false); setCurrentTab('directory'); }}>
                      <Icon name="user" size={18} /> Ouvrir annuaire
                    </button>
                    <button className="btn btn-primary" onClick={()=>setProfileOpen(false)}>
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOAST */}
          {toast && (
            <div className="toast" style={{
              borderLeft: `6px solid ${
                toast.type==='error' ? '#ef4444' : (toast.type==='success' ? '#10b981' : 'var(--primary)')
              }`
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 12,
                background: toast.type==='error' ? 'rgba(239,68,68,0.15)' : toast.type==='success' ? 'rgba(16,185,129,0.15)' : 'var(--primary-2)',
                display:'flex', alignItems:'center', justifyContent:'center'
              }}>
                {toast.type==='error' ? <Icon name="x" size={18}/> : toast.type==='success' ? <Icon name="dashboard" size={18}/> : <Icon name="refresh" size={18}/>}
              </div>
              <div>
                <div className="t-title">{toast.title}</div>
                <div className="t-msg">{toast.msg}</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
