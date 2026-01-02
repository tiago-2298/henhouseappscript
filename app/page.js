'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

// --- ICONS ---
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22v-9" />,
    building: <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4" />,
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    car: <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" />,
    lifeBuoy: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" />
      </>
    ),
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4zM5 4h2v3a7 7 0 0 1-2 0V4zM17 4h2v3a7 7 0 0 1-2 0V4z" />,
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
    copy: <path d="M8 8h12v12H8zM4 4h12v2H6v10H4z" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    spark: <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

// IMAGES PRODUITS (optionnel)
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

const palettes = {
  orange: { primary:'#ff6a2b', primaryLight:'rgba(255,106,43,0.15)' },
  mint:   { primary:'#10b981', primaryLight:'rgba(16,185,129,0.15)' },
  purple: { primary:'#8b5cf6', primaryLight:'rgba(139,92,246,0.15)' },
};

function money(n, symbol='$') {
  const v = Number(n) || 0;
  return `${symbol}${v.toFixed(2)}`;
}

function medal(i) {
  if (i === 0) return '🥇';
  if (i === 1) return '🥈';
  if (i === 2) return '🥉';
  return '🎖️';
}

const Skeleton = ({ h=16, w='100%', r=12, style={} }) => (
  <div style={{
    height:h, width:w, borderRadius:r,
    background:'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
    backgroundSize:'200% 100%',
    animation:'shimmer 1.2s infinite',
    ...style
  }} />
);

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
  const [palette, setPalette] = useState('orange');

  // Quick cash mode
  const [fastMode, setFastMode] = useState(false);

  // Employee Directory / Profile
  const [dirLoading, setDirLoading] = useState(false);
  const [employeesFull, setEmployeesFull] = useState([]);
  const [dirQuery, setDirQuery] = useState('');
  const [dirRole, setDirRole] = useState('Tous');
  const [profile, setProfile] = useState(null);

  // Leaderboard
  const [lbLoading, setLbLoading] = useState(false);
  const [topCA, setTopCA] = useState([]);
  const [topStock, setTopStock] = useState([]);

  // Forms
  const [invNum, setInvNum] = useState('');
  const [stockItems, setStockItems] = useState([{product:'', qty:1}]);
  const [entName, setEntName] = useState('');
  const [entItems, setEntItems] = useState([{product:'', qty:1}]);
  const [expData, setExpData] = useState({veh:'', kind:'Essence', amt:''});
  const [garData, setGarData] = useState({veh:'', action:'Entrée', fuel:50});
  const [supData, setSupData] = useState({sub:'Autre', msg:''});

  // micro-interaction add-to-cart
  const [pop, setPop] = useState(false);
  const popTimer = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('hh_theme');
    const savedPalette = localStorage.getItem('hh_palette');
    const savedFast = localStorage.getItem('hh_fast');

    document.documentElement.setAttribute('data-theme', savedTheme || 'dark');
    setDarkMode((savedTheme || 'dark') === 'dark');

    setPalette(savedPalette || 'orange');
    setFastMode(savedFast === '1');

    fetch('/api', { method:'POST', body: JSON.stringify({ action:'getMeta' }) })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
        if (res.vehicles?.length) {
          setExpData(p => ({...p, veh: res.vehicles[0]}));
          setGarData(p => ({...p, veh: res.vehicles[0]}));
        }
        setStockItems([{product:(res.products?.[0] || ''), qty:1}]);
        setEntItems([{product:(res.products?.[0] || ''), qty:1}]);
      })
      .catch(err => { console.error(err); alert("Erreur chargement"); });
  }, []);

  // Apply palette vars
  useEffect(() => {
    const p = palettes[palette] || palettes.orange;
    document.documentElement.style.setProperty('--primary', p.primary);
    document.documentElement.style.setProperty('--primary-light', p.primaryLight);
    localStorage.setItem('hh_palette', palette);
  }, [palette]);

  const toggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hh_theme', newTheme);
  };

  const notify = (title, msg, type='info') => {
    setToast({title, msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => { if (user) setView('app'); };
  const logout = () => { setUser(''); setView('login'); };

  const sessionTotal = useMemo(
    () => cart.reduce((a,b)=>a + (b.qty*b.pu), 0),
    [cart]
  );

  const addToCart = (prod) => {
    const existing = cart.find(x => x.name === prod);
    if (existing) setCart(cart.map(x => x.name === prod ? {...x, qty: x.qty + 1} : x));
    else setCart([...cart, {name: prod, qty: 1, pu: data.prices[prod] || 0}]);

    setPop(true);
    if (popTimer.current) clearTimeout(popTimer.current);
    popTimer.current = setTimeout(() => setPop(false), 180);

    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].qty += delta;
    if (newCart[idx].qty <= 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const sendForm = async (action, payload) => {
    notify("Envoi...", "Veuillez patienter", "info");
    try {
      const res = await fetch('/api', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action, data: { ...payload, employee: user } })
      });
      const json = await res.json();
      if (json.success) {
        notify("Succès", "Action validée !", "success");
        if (action === 'sendFactures') setCurrentTab('home');

        // reset
        setCart([]); setInvNum('');
        setStockItems([{product:(data.products[0]||''), qty:1}]);
        setEntItems([{product:(data.products[0]||''), qty:1}]); setEntName('');
        setSupData({sub:'Autre', msg:''});
        setExpData(p => ({...p, amt:''}));

        // refresh leaderboard quickly for Home/Performance
        refreshLeaderboard();
      } else notify("Erreur", json.message || "Erreur", "error");
    } catch (e) {
      notify("Erreur", e.message, "error");
    }
  };

  const handleSendInvoice = () => {
    if (!invNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    if (cart.length === 0) return notify("Erreur", "Le panier est vide", "error");
    sendForm('sendFactures', { invoiceNumber: invNum, items: cart.map(x=>({desc:x.name, qty:x.qty})) });
  };

  const handleSendEnterprise = () => {
    if (!entName.trim()) return notify("Erreur", "Le nom de l'entreprise est OBLIGATOIRE", "error");
    sendForm('sendEntreprise', { company: entName, items: entItems });
  };

  const handleSendExpense = () => {
    if (!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm('sendExpense', { vehicle: expData.veh, kind: expData.kind, amount: expData.amt });
  };

  const refreshDirectory = async () => {
    setDirLoading(true);
    try {
      const res = await fetch('/api', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'getDirectory' })
      });
      const json = await res.json();
      setEmployeesFull(json.employeesFull || []);
    } catch (e) {
      notify("Erreur", e.message, "error");
    } finally {
      setDirLoading(false);
    }
  };

  const refreshLeaderboard = async () => {
    setLbLoading(true);
    try {
      const res = await fetch('/api', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ action:'getLeaderboard' })
      });
      const json = await res.json();
      setTopCA(json.topCA || []);
      setTopStock(json.topStock || []);
    } catch (e) {
      // silent
    } finally {
      setLbLoading(false);
    }
  };

  // Auto load leaderboard for home
  useEffect(() => {
    if (!loading && data) refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  // When open directory/performance tabs -> refresh
  useEffect(() => {
    if (currentTab === 'directory' && employeesFull.length === 0 && !dirLoading) refreshDirectory();
    if (currentTab === 'performance' && (topCA.length === 0 && topStock.length === 0) && !lbLoading) refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const roles = useMemo(() => {
    const set = new Set(employeesFull.map(e=>e.role).filter(Boolean));
    return ['Tous', ...Array.from(set).sort((a,b)=>a.localeCompare(b,'fr'))];
  }, [employeesFull]);

  const filteredDirectory = useMemo(() => {
    const q = dirQuery.toLowerCase().trim();
    return employeesFull.filter(e => {
      const matchRole = (dirRole === 'Tous') || (String(e.role||'') === dirRole);
      const matchQ = !q
        || String(e.name||'').toLowerCase().includes(q)
        || String(e.phone||'').toLowerCase().includes(q)
        || String(e.id||'').toLowerCase().includes(q);
      return matchRole && matchQ;
    });
  }, [employeesFull, dirQuery, dirRole]);

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(String(phone||''));
      notify("Copié", "Numéro copié dans le presse-papier", "success");
    } catch {
      notify("Erreur", "Impossible de copier", "error");
    }
  };

  const toggleFast = () => {
    const nv = !fastMode;
    setFastMode(nv);
    localStorage.setItem('hh_fast', nv ? '1' : '0');
  };

  // ===== LOADING SCREEN =====
  if (loading) {
    return (
      <>
        <style jsx global>{`
          @keyframes shimmer { 0%{background-position:0% 0} 100%{background-position:200% 0} }
          body{margin:0;background:#0f1115;color:#fff;font-family:system-ui}
        `}</style>
        <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:420}}>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18}}>
              <img src="https://i.goopics.net/dskmxi.png" style={{height:48, borderRadius:12}} />
              <div style={{fontWeight:900, fontSize:18}}>HEN HOUSE</div>
            </div>
            <Skeleton h={18} w="55%" />
            <div style={{height:12}} />
            <Skeleton h={14} w="85%" />
            <div style={{height:24}} />
            <Skeleton h={120} r={22} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: ${palettes.orange.primary};
          --primary-light: ${palettes.orange.primaryLight};
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
        }
        @keyframes shimmer { 0%{background-position:0% 0} 100%{background-position:200% 0} }

        * { box-sizing:border-box; margin:0; padding:0; outline:none; -webkit-tap-highlight-color: transparent; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display:flex; transition: background-color 0.3s ease; }

        /* SIDEBAR */
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: var(--bg-panel); border-radius: var(--radius); display:flex; flex-direction:column; padding: 25px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); z-index:50; border: 1px solid var(--border); }
        .brand { display:flex; align-items:center; gap:12px; font-weight:900; font-size:1.15rem; margin-bottom:26px; }
        .brand img { height: 32px; border-radius: 10px; }
        .nav-list { display:flex; flex-direction:column; gap:8px; flex:1; }
        .nav-btn { display:flex; align-items:center; gap:12px; padding: 12px 16px; border-radius: 12px; border:none; background:transparent; color: var(--text-muted); font-weight:700; font-size: 0.95rem; cursor:pointer; transition:0.2s; font-family:inherit; }
        .nav-btn:hover { background: var(--bg-body); color: var(--text-main); }
        .nav-btn.active { background: var(--primary); color:white; box-shadow: 0 8px 20px -6px rgba(0,0,0,0.25); }
        .user-profile { display:flex; align-items:center; gap:10px; padding:12px; background: var(--bg-body); border-radius: 16px; margin-top:auto; cursor:pointer; border:1px solid var(--border); transition:0.2s; }
        .user-profile:hover { border-color: var(--primary); }
        .avatar { width:36px; height:36px; background: var(--primary); color:white; border-radius: 50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; }

        /* MAIN */
        .main-content { flex:1; padding: 2vh 2vh 2vh 0; overflow-y:auto; overflow-x:hidden; }
        .header-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom: 26px; padding: 0 10px; gap: 12px; }
        .page-title { font-size: 1.75rem; font-weight: 900; display:flex; align-items:center; gap:10px; }
        .top-stats { display:flex; gap:12px; align-items:center; flex-wrap: wrap; justify-content:flex-end; }
        .mini-stat { background: var(--bg-panel); padding: 8px 16px; border-radius: 999px; border: 1px solid var(--border); display:flex; gap:10px; align-items:center; font-weight:700; font-size:0.9rem; color: var(--text-muted); }
        .mini-stat strong { color: var(--text-main); }
        .theme-btn { background: var(--bg-panel); border: 1px solid var(--border); width: 40px; height: 40px; border-radius: 50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: 0.2s; color: var(--text-main); }
        .theme-btn:hover { background: var(--bg-body); transform: rotate(12deg); }
        .pill { padding: 8px 14px; background: var(--bg-panel); border:1px solid var(--border); border-radius: 999px; font-weight:800; cursor:pointer; white-space:nowrap; transition:0.2s; color: var(--text-muted); display:flex; align-items:center; gap:8px; }
        .pill:hover, .pill.active { border-color: var(--primary); color: white; background: var(--primary); }
        .select { padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border); background: var(--bg-panel); color: var(--text-main); font-weight: 800; }
        .toggle { display:flex; align-items:center; gap:10px; padding: 8px 14px; border:1px solid var(--border); border-radius: 999px; background: var(--bg-panel); cursor:pointer; font-weight:900; }
        .switch { width: 44px; height: 24px; border-radius: 999px; background: var(--bg-body); border:1px solid var(--border); position: relative; }
        .knob { width: 20px; height: 20px; border-radius: 50%; background: var(--text-main); position:absolute; top:1px; left:1px; transition:0.2s; }
        .switch.on .knob { transform: translateX(20px); background: var(--primary); }

        /* DASH */
        .dashboard-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .dash-card { background: var(--bg-panel); border-radius: var(--radius); padding: 28px; border:1px solid var(--border); cursor:pointer; transition:0.25s; height: 190px; display:flex; flex-direction:column; justify-content:space-between; }
        .dash-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.12); }
        .dash-icon { width: 50px; height: 50px; background: var(--bg-body); border-radius: 14px; display:flex; align-items:center; justify-content:center; color: var(--primary); }
        .dash-title { font-size: 1.18rem; font-weight: 900; margin-top:10px; }
        .dash-desc { font-size: 0.92rem; color: var(--text-muted); margin-top: 6px; }

        /* Home top widget */
        .widget { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 26px; padding: 22px; }
        .widget-head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 14px; }
        .widget-title { font-weight: 1000; display:flex; align-items:center; gap:10px; }
        .row { display:flex; align-items:center; justify-content:space-between; padding: 12px 14px; border-radius: 16px; background: var(--bg-body); border:1px solid var(--border); margin-bottom: 10px; }

        /* Catalog */
        .search-container { position: relative; margin-bottom: 18px; max-width: 520px; }
        .search-inp { width: 100%; padding: 16px 20px 16px 50px; border-radius: 18px; border:1px solid var(--border); background: var(--bg-panel); font-size: 1rem; color: var(--text-main); font-weight: 800; transition:0.2s; }
        .search-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .search-icon { position:absolute; left:18px; top:50%; transform: translateY(-50%); color: var(--text-muted); }
        .cat-pills { display:flex; gap:10px; overflow-x:auto; padding-bottom: 10px; margin-bottom: 18px; }
        .prod-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(${fastMode ? 210 : 160}px, 1fr)); gap: 16px; }
        .prod-card { background: var(--bg-panel); border-radius: 20px; padding: 15px; text-align:center; border:1px solid var(--border); cursor:pointer; transition:0.2s; position:relative; }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.10); }
        .prod-img { width:100%; aspect-ratio:1; border-radius: 16px; margin-bottom: 12px; object-fit: cover; background: var(--bg-body); display:flex; align-items:center; justify-content:center; font-size: 2rem; color: var(--text-muted); }
        .prod-title { font-weight: 900; font-size: ${fastMode ? 1.05 : 0.92}rem; margin-bottom: 6px; line-height: 1.2; }
        .prod-price { color: var(--primary); font-weight: 1000; font-size: 1.15rem; }

        /* CART */
        .cart-drawer { position:fixed; top:0; right:0; width: 400px; height:100vh; background: var(--bg-panel); box-shadow: -10px 0 40px rgba(0,0,0,0.2); z-index: 100; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); display:flex; flex-direction:column; border-left: 1px solid var(--border); }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 22px; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border); }
        .cart-body { flex:1; overflow-y:auto; padding: 18px; }
        .cart-foot { padding: 22px; background: var(--bg-body); border-top: 1px solid var(--border); }
        .cart-item { display:flex; align-items:center; gap: 12px; padding: 14px; background: var(--bg-body); border-radius: 16px; margin-bottom: 10px; border: 1px solid var(--border); }
        .qty-ctrl { display:flex; align-items:center; background: var(--bg-panel); border-radius: 10px; padding: 2px; border: 1px solid var(--border); }
        .qb { width: 30px; height: 30px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color: var(--text-main); }
        .qi { width: 34px; text-align:center; font-weight: 1000; }
        .btn { width:100%; padding: 16px; border:none; border-radius: 16px; font-weight: 1000; font-size: 1rem; cursor:pointer; transition:0.2s; display:flex; justify-content:center; align-items:center; gap: 10px; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 20px -5px rgba(0,0,0,0.25); }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-text { background: transparent; border: 1px dashed var(--border); color: var(--text-muted); }
        .btn-text:hover { border-color: var(--primary); color: var(--primary); }
        .cart-btn-float { position:fixed; bottom: 26px; right: 26px; background: var(--text-main); color: var(--bg-panel); padding: 14px 22px; border-radius: 999px; font-weight: 1000; cursor:pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display:flex; align-items:center; gap: 10px; transition:0.15s; z-index: 90; }
        .cart-btn-float:hover { transform: scale(1.03); }
        .cart-btn-float.pop { transform: scale(1.07); }

        /* FORMS */
        .form-wrap { background: var(--bg-panel); padding: 34px; border-radius: 30px; max-width: 650px; margin: 0 auto; border:1px solid var(--border); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        .inp-group { margin-bottom: 18px; }
        .inp-label { display:block; margin-bottom: 8px; font-weight: 900; font-size: 0.9rem; color: var(--text-muted); }
        .inp-field { width:100%; padding: 14px; border: 2px solid var(--border); background: var(--bg-body); border-radius: 12px; font-size: 1rem; font-family:inherit; color: var(--text-main); transition:0.2s; font-weight: 800; }
        .inp-field:focus { border-color: var(--primary); background: var(--bg-panel); box-shadow: 0 0 0 3px var(--primary-light); }

        /* LOGIN */
        #gate { position:fixed; inset:0; background: var(--bg-body); z-index: 2000; display:flex; align-items:center; justify-content:center; }
        .login-box { text-align:center; width: 420px; padding: 40px; border:1px solid var(--border); background: var(--bg-panel); border-radius: 30px; }

        /* DIRECTORY */
        .dir-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .emp-card { background: var(--bg-panel); border:1px solid var(--border); border-radius: 22px; padding: 18px; cursor:pointer; transition:0.2s; }
        .emp-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.12); }
        .badge { padding: 6px 10px; border-radius: 999px; background: var(--primary-light); color: var(--primary); font-weight: 1000; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.06); }

        /* MODAL */
        .overlay { position:fixed; inset:0; background: rgba(0,0,0,0.55); z-index: 4000; display:flex; align-items:center; justify-content:center; padding: 20px; }
        .modal { width: 760px; max-width: 100%; background: var(--bg-panel); border:1px solid var(--border); border-radius: 28px; overflow:hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.35); }
        .modal-head { padding: 18px 20px; display:flex; align-items:center; justify-content:space-between; border-bottom: 1px solid var(--border); }
        .modal-body { padding: 20px; display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px; }
        .card { background: var(--bg-body); border:1px solid var(--border); border-radius: 22px; padding: 16px; }
        .k { color: var(--text-muted); font-weight: 900; font-size: 0.85rem; }
        .v { font-weight: 1000; margin-top: 4px; }
        .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* TOAST */
        .toast { position:fixed; top: 26px; right: 26px; z-index: 6000; background: var(--bg-panel); padding: 14px 18px; border-radius: 16px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2); border-left: 5px solid var(--primary); min-width: 280px; animation: slideIn 0.22s; color: var(--text-main); }
        @keyframes slideIn { from { transform: translateX(100%); opacity:0; } }
        .t-title { font-weight: 1000; font-size: 0.95rem; margin-bottom: 3px; }
        .t-msg { font-size: 0.85rem; color: var(--text-muted); }

        @media (max-width: 900px) {
          .sidebar { display:none; }
          .main-content { padding: 2vh; }
          .modal-body { grid-template-columns: 1fr; }
          .cart-drawer { width: 100%; }
        }
      `}</style>

      {view === 'login' ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:18}} />
            <h2 style={{marginBottom:8, fontWeight:1000}}>Bienvenue</h2>
            <p style={{color:'var(--text-muted)', marginBottom:22, fontWeight:800}}>Connectez-vous pour commencer</p>

            <select className="inp-field" value={user} onChange={e => setUser(e.target.value)} style={{marginBottom:16, textAlign:'center'}}>
              <option value="">Sélectionner un nom...</option>
              {data?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{marginTop:18, display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap'}}>
              <div className={`pill ${palette==='orange'?'active':''}`} onClick={()=>setPalette('orange')}>Orange</div>
              <div className={`pill ${palette==='mint'?'active':''}`} onClick={()=>setPalette('mint')}>Mint</div>
              <div className={`pill ${palette==='purple'?'active':''}`} onClick={()=>setPalette('purple')}>Purple</div>
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

            <div style={{display:'grid', gap:10, marginTop:12}}>
              <div style={{display:'flex', gap:8}}>
                <div className={`pill ${palette==='orange'?'active':''}`} onClick={()=>setPalette('orange')}>Orange</div>
                <div className={`pill ${palette==='mint'?'active':''}`} onClick={()=>setPalette('mint')}>Mint</div>
                <div className={`pill ${palette==='purple'?'active':''}`} onClick={()=>setPalette('purple')}>Purple</div>
              </div>

              <div className="user-profile" onClick={logout}>
                <div className="avatar">{user.charAt(0)}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:1000, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{user}</div>
                  <div style={{fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:800}}>Déconnexion</div>
                </div>
                <Icon name="logout" size={16} style={{marginLeft:'auto', color:'var(--text-muted)'}} />
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
                {currentTab === 'garage' && <><Icon name="car" size={32} /> Garage</>}
                {currentTab === 'expenses' && <><Icon name="creditCard" size={32} /> Frais</>}
                {currentTab === 'directory' && <><Icon name="users" size={32} /> Annuaire</>}
                {currentTab === 'performance' && <><Icon name="trophy" size={32} /> Performance</>}
                {currentTab === 'support' && <><Icon name="lifeBuoy" size={32} /> Support</>}
              </div>

              <div className="top-stats">
                <div className="mini-stat">Session: <strong>{money(sessionTotal, data.currencySymbol || '$')}</strong></div>

                {currentTab === 'invoices' && (
                  <div className="toggle" onClick={toggleFast} title="Mode caisse rapide">
                    <span style={{fontWeight:1000}}>Mode rapide</span>
                    <div className={`switch ${fastMode ? 'on' : ''}`}>
                      <div className="knob" />
                    </div>
                  </div>
                )}

                <button className="theme-btn" onClick={toggleTheme}>
                  {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === 'home' && (
              <div style={{display:'grid', gap:20}}>
                <div className="dashboard-grid">
                  <div className="dash-card" onClick={()=>setCurrentTab('invoices')}>
                    <div className="dash-icon"><Icon name="receipt" size={28} /></div>
                    <div>
                      <div className="dash-title">Caisse</div>
                      <div className="dash-desc">Nouvelle vente</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={()=>setCurrentTab('stock')}>
                    <div className="dash-icon"><Icon name="package" size={28} /></div>
                    <div>
                      <div className="dash-title">Stock</div>
                      <div className="dash-desc">Production cuisine</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={()=>setCurrentTab('directory')}>
                    <div className="dash-icon"><Icon name="users" size={28} /></div>
                    <div>
                      <div className="dash-title">Annuaire</div>
                      <div className="dash-desc">Coordonnées & fiches staff</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={()=>setCurrentTab('performance')}>
                    <div className="dash-icon"><Icon name="trophy" size={28} /></div>
                    <div>
                      <div className="dash-title">Performance</div>
                      <div className="dash-desc">Top vendeur & production</div>
                    </div>
                  </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:20}}>
                  <div className="widget">
                    <div className="widget-head">
                      <div className="widget-title"><Icon name="spark" /> Classement du moment</div>
                      <button className="pill" onClick={refreshLeaderboard}>
                        Rafraîchir <Icon name="chevronRight" size={16} />
                      </button>
                    </div>

                    {lbLoading ? (
                      <>
                        <Skeleton h={52} r={16} style={{marginBottom:10}} />
                        <Skeleton h={52} r={16} style={{marginBottom:10}} />
                        <Skeleton h={52} r={16} />
                      </>
                    ) : (
                      <>
                        <div style={{fontWeight:1000, marginBottom:10, color:'var(--text-muted)'}}>Top CA</div>
                        {(topCA || []).slice(0,3).map((e,i)=>(
                          <div key={e.name+i} className="row" onClick={()=>{ setProfile(e); }}>
                            <div style={{display:'flex', alignItems:'center', gap:10}}>
                              <div style={{fontSize:18}}>{medal(i)}</div>
                              <div>
                                <div style={{fontWeight:1000}}>{e.name}</div>
                                <div style={{fontSize:12, color:'var(--text-muted)', fontWeight:900}}>{e.role}</div>
                              </div>
                            </div>
                            <div style={{fontWeight:1000, color:'var(--primary)'}}>{money(e.ca, data.currencySymbol || '$')}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="widget">
                    <div className="widget-title" style={{marginBottom:14}}><Icon name="package" /> Top Production</div>
                    {lbLoading ? (
                      <>
                        <Skeleton h={52} r={16} style={{marginBottom:10}} />
                        <Skeleton h={52} r={16} style={{marginBottom:10}} />
                        <Skeleton h={52} r={16} />
                      </>
                    ) : (
                      (topStock || []).slice(0,3).map((e,i)=>(
                        <div key={e.name+i} className="row" onClick={()=>{ setProfile(e); }}>
                          <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <div style={{fontSize:18}}>{medal(i)}</div>
                            <div>
                              <div style={{fontWeight:1000}}>{e.name}</div>
                              <div style={{fontSize:12, color:'var(--text-muted)', fontWeight:900}}>{e.role}</div>
                            </div>
                          </div>
                          <div style={{fontWeight:1000, color:'var(--primary)'}}>{Number(e.stock||0)} u</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CAISSE */}
            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap'}}>
                  <div className="search-container">
                    <div className="search-icon"><Icon name="search" size={20} /></div>
                    <input className="search-inp" placeholder="Rechercher..." onChange={e=>setSearch(e.target.value)} />
                  </div>

                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <div className="mini-stat">Panier: <strong>{cart.reduce((s,i)=>s+i.qty,0)}</strong></div>
                  </div>
                </div>

                <div className="cat-pills">
                  <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                  {Object.keys(data.productsByCategory).map(c => (
                    <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>
                      {c.replace(/_/g,' ')}
                    </div>
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
                      <div className="prod-price">{data.currencySymbol || '$'}{data.prices[p]}</div>

                      {fastMode && (
                        <div style={{display:'flex', gap:8, marginTop:10}}>
                          <button className="pill" onClick={(e)=>{ e.stopPropagation(); addToCart(p); }}>+1</button>
                          <button className="pill" onClick={(e)=>{ e.stopPropagation(); addToCart(p); addToCart(p); }}>+2</button>
                          <button className="pill" onClick={(e)=>{ e.stopPropagation(); addToCart(p); addToCart(p); addToCart(p); }}>+3</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === 'stock' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="package" /> Déclaration Stock
                </h2>

                {stockItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:90}} value={item.qty}
                      onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                    <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...stockItems];n.splice(i,1);setStockItems(n)}}>
                      <Icon name="x" size={18}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setStockItems([...stockItems, {product:data.products[0], qty:1}])}>+ Ajouter ligne</button>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>sendForm('sendProduction', {items:stockItems})}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ENTREPRISE */}
            {currentTab === 'enterprise' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="building" /> Commande Pro
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={e=>setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp-field" value={item.product} onChange={e=>{const n=[...entItems];n[i].product=e.target.value;setEntItems(n)}} style={{flex:1}}>
                      <option value="" disabled>Produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp-field" style={{width:90}} value={item.qty}
                      onChange={e=>{const n=[...entItems];n[i].qty=e.target.value;setEntItems(n)}} />
                    <button className="qb" style={{color:'#ef4444'}} onClick={()=>{const n=[...entItems];n.splice(i,1);setEntItems(n)}}>
                      <Icon name="x" size={18}/>
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={()=>setEntItems([...entItems, {product:data.products[0], qty:1}])}>+ Ajouter ligne</button>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={handleSendEnterprise}>Valider</button>
              </div>
            )}

            {/* FRAIS */}
            {currentTab === 'expenses' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="creditCard" /> Frais
                </h2>

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
                  <label className="inp-label">Montant ({data.currencySymbol || '$'})</label>
                  <input type="number" className="inp-field" value={expData.amt} onChange={e=>setExpData({...expData, amt:e.target.value})} />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>Déclarer</button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === 'garage' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="car" /> Garage
                </h2>

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
                  <input type="range" style={{width:'100%'}} value={garData.fuel} onChange={e=>setGarData({...garData, fuel:e.target.value})} />
                  <div style={{marginTop:8, fontWeight:1000}}>{garData.fuel}%</div>
                </div>

                <button className="btn btn-primary" onClick={()=>sendForm('sendGarage', {vehicle:garData.veh, action:garData.action, fuel:garData.fuel})}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === 'support' && (
              <div className="form-wrap">
                <h2 style={{marginBottom:16, display:'flex', alignItems:'center', gap:10, fontWeight:1000}}>
                  <Icon name="lifeBuoy" /> Support
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Sujet</label>
                  <select className="inp-field" value={supData.sub} onChange={e=>setSupData({...supData, sub:e.target.value})}>
                    <option>Problème Stock</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Message</label>
                  <textarea className="inp-field" style={{height:120}} value={supData.msg} onChange={e=>setSupData({...supData, msg:e.target.value})} />
                </div>

                <button className="btn btn-primary" onClick={()=>sendForm('sendSupport', {subject:supData.sub, message:supData.msg})}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ANNUAIRE */}
            {currentTab === 'directory' && (
              <div style={{display:'grid', gap:16}}>
                <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between'}}>
                  <div className="search-container" style={{maxWidth:520}}>
                    <div className="search-icon"><Icon name="search" size={20} /></div>
                    <input className="search-inp" placeholder="Rechercher nom / tel / id..."
                      value={dirQuery} onChange={e=>setDirQuery(e.target.value)} />
                  </div>

                  <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                    <select className="select" value={dirRole} onChange={e=>setDirRole(e.target.value)}>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button className="pill" onClick={refreshDirectory}>
                      Rafraîchir <Icon name="chevronRight" size={16} />
                    </button>
                  </div>
                </div>

                {dirLoading ? (
                  <div className="dir-grid">
                    {Array.from({length:6}).map((_,i)=>(
                      <div key={i} className="emp-card">
                        <Skeleton h={16} w="70%" />
                        <div style={{height:10}} />
                        <Skeleton h={12} w="45%" />
                        <div style={{height:14}} />
                        <Skeleton h={44} r={16} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dir-grid">
                    {filteredDirectory.map(e => (
                      <div key={e.id + e.name} className="emp-card" onClick={()=>setProfile(e)}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10}}>
                          <div style={{fontWeight:1000, fontSize:'1.05rem'}}>{e.name}</div>
                          <div className="badge">{e.role || '—'}</div>
                        </div>
                        <div style={{marginTop:10, color:'var(--text-muted)', fontWeight:900}}>
                          Tel: <span style={{color:'var(--text-main)'}}>{e.phone || '—'}</span>
                        </div>
                        <div style={{display:'flex', gap:10, marginTop:12}}>
                          <button className="pill" onClick={(ev)=>{ev.stopPropagation(); copyPhone(e.phone);}}>
                            Copier <Icon name="copy" size={16} />
                          </button>
                          <button className="pill" onClick={(ev)=>{ev.stopPropagation(); setProfile(e);}}>
                            Ouvrir <Icon name="chevronRight" size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!filteredDirectory.length && (
                      <div style={{color:'var(--text-muted)', fontWeight:900, padding:20}}>Aucun résultat.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PERFORMANCE */}
            {currentTab === 'performance' && (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
                <div className="widget">
                  <div className="widget-head">
                    <div className="widget-title"><Icon name="trophy" /> Top CA</div>
                    <button className="pill" onClick={refreshLeaderboard}>Rafraîchir <Icon name="chevronRight" size={16} /></button>
                  </div>

                  {lbLoading ? (
                    <>
                      <Skeleton h={52} r={16} style={{marginBottom:10}} />
                      <Skeleton h={52} r={16} style={{marginBottom:10}} />
                      <Skeleton h={52} r={16} />
                    </>
                  ) : (
                    (topCA || []).map((e,i)=>(
                      <div key={e.name+i} className="row" onClick={()=>setProfile(e)}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <div style={{fontSize:18}}>{medal(i)}</div>
                          <div>
                            <div style={{fontWeight:1000}}>{e.name}</div>
                            <div style={{fontSize:12, color:'var(--text-muted)', fontWeight:900}}>{e.role}</div>
                          </div>
                        </div>
                        <div style={{fontWeight:1000, color:'var(--primary)'}}>{money(e.ca, data.currencySymbol || '$')}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="widget">
                  <div className="widget-head">
                    <div className="widget-title"><Icon name="package" /> Top Stock</div>
                    <button className="pill" onClick={refreshLeaderboard}>Rafraîchir <Icon name="chevronRight" size={16} /></button>
                  </div>

                  {lbLoading ? (
                    <>
                      <Skeleton h={52} r={16} style={{marginBottom:10}} />
                      <Skeleton h={52} r={16} style={{marginBottom:10}} />
                      <Skeleton h={52} r={16} />
                    </>
                  ) : (
                    (topStock || []).map((e,i)=>(
                      <div key={e.name+i} className="row" onClick={()=>setProfile(e)}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <div style={{fontSize:18}}>{medal(i)}</div>
                          <div>
                            <div style={{fontWeight:1000}}>{e.name}</div>
                            <div style={{fontSize:12, color:'var(--text-muted)', fontWeight:900}}>{e.role}</div>
                          </div>
                        </div>
                        <div style={{fontWeight:1000, color:'var(--primary)'}}>{Number(e.stock||0)} u</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>

          {/* CART DRAWER */}
          {currentTab === 'invoices' && (
            <>
              <div className={`cart-btn-float ${pop ? 'pop' : ''}`} onClick={()=>setCartOpen(true)}>
                <Icon name="cart" size={22} /> <span>{money(sessionTotal, data.currencySymbol || '$')}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
                <div className="cart-head">
                  <h2 style={{display:'flex', alignItems:'center', gap:10, fontWeight:1000}}><Icon name="cart" /> Panier</h2>
                  <button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}>
                    <Icon name="x" size={24} />
                  </button>
                </div>

                <div style={{padding:18}}>
                  <input className="inp-field" placeholder="N° Facture (Obligatoire)" style={{textAlign:'center'}} value={invNum} onChange={e=>setInvNum(e.target.value)} />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div style={{textAlign:'center', marginTop:50, color:'var(--text-muted)', fontWeight:900}}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontWeight:1000, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.name}</div>
                        <small style={{color:'var(--text-muted)', fontWeight:900}}>{money(c.pu, data.currencySymbol || '$')}</small>

                        {fastMode && (
                          <div style={{display:'flex', gap:8, marginTop:10}}>
                            <button className="pill" onClick={()=>modQty(i, 1)}>+1</button>
                            <button className="pill" onClick={()=>modQty(i, 2)}>+2</button>
                            <button className="pill" onClick={()=>modQty(i, 5)}>+5</button>
                          </div>
                        )}
                      </div>

                      <div className="qty-ctrl">
                        <button className="qb" onClick={()=>modQty(i,-1)}>-</button>
                        <span className="qi">{c.qty}</span>
                        <button className="qb" onClick={()=>modQty(i,1)}>+</button>
                      </div>

                      <button className="qb" style={{color:'#ef4444'}} onClick={()=>modQty(i, -999)}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.35rem', fontWeight:1000, marginBottom:12}}>
                    <span>Total</span>
                    <span style={{color:'var(--primary)'}}>{money(sessionTotal, data.currencySymbol || '$')}</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>Valider la vente</button>
                </div>
              </aside>
            </>
          )}

          {/* PROFILE MODAL */}
          {profile && (
            <div className="overlay" onClick={()=>setProfile(null)}>
              <div className="modal" onClick={(e)=>e.stopPropagation()}>
                <div className="modal-head">
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div className="avatar" style={{width:44, height:44}}>{profile.name?.charAt(0) || '?'}</div>
                    <div>
                      <div style={{fontWeight:1000, fontSize:'1.1rem'}}>{profile.name}</div>
                      <div style={{color:'var(--text-muted)', fontWeight:900}}>{profile.role || '—'}</div>
                    </div>
                  </div>
                  <button className="pill" onClick={()=>setProfile(null)}>
                    Fermer <Icon name="x" size={16} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="card">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{fontWeight:1000}}>Coordonnées</div>
                      <button className="pill" onClick={()=>copyPhone(profile.phone)}>
                        Copier tel <Icon name="copy" size={16} />
                      </button>
                    </div>

                    <div className="grid2" style={{marginTop:12}}>
                      <div>
                        <div className="k">Téléphone</div>
                        <div className="v">{profile.phone || '—'}</div>
                      </div>
                      <div>
                        <div className="k">ID</div>
                        <div className="v">{profile.id || '—'}</div>
                      </div>
                      <div>
                        <div className="k">Date d’arrivée</div>
                        <div className="v">{profile.arrival || '—'}</div>
                      </div>
                      <div>
                        <div className="k">Ancienneté</div>
                        <div className="v">{Number(profile.seniority || 0)} jours</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div style={{fontWeight:1000, marginBottom:12}}>Stats</div>
                    <div className="grid2">
                      <div>
                        <div className="k">CA</div>
                        <div className="v" style={{color:'var(--primary)'}}>{money(profile.ca, data.currencySymbol || '$')}</div>
                      </div>
                      <div>
                        <div className="k">Stock</div>
                        <div className="v">{Number(profile.stock||0)} u</div>
                      </div>
                      <div>
                        <div className="k">Salaire</div>
                        <div className="v">{money(profile.salary, data.currencySymbol || '$')}</div>
                      </div>
                      <div>
                        <div className="k">Poste</div>
                        <div className="v">{profile.role || '—'}</div>
                      </div>
                    </div>

                    <div style={{marginTop:14, color:'var(--text-muted)', fontWeight:900, fontSize:13}}>
                      Astuce: tu peux mettre ce module visible à tous (Annuaire) + garder d’autres onglets pour managers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOAST */}
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
