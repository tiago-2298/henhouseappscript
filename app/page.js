return <div style={{padding:20, color:"#fff"}}>TEST OK</div>;

'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION ---
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
  // --- PLATS ---
  "Lasagne aux légumes": "https://images.unsplash.com/photo-1514516348920-f5d92839957d?w=400", // Ajouté
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Effiloché de Mouton": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400", // Nouveau
  "Burger Gourmet au Foie Gras": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400", // Nouveau

  // --- BOISSONS ---
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Nectar Exotique": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400", // Nouveau
  "Kombucha Citron": "https://images.unsplash.com/photo-1594498653385-d5172b532c00?w=400", // Nouveau

  // --- LES MENUS ---
  "LA SIGNATURE VÉGÉTALE": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE PRESTIGE DE LA MER": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE RED WINGS": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE SOLEIL D'OR": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LE SIGNATURE \"75\"": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "L'HÉRITAGE DU BERGER": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "LA CROISIÈRE GOURMANDE": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",

  // --- DESSERTS ---
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Carpaccio Fruit Exotique": "https://files.catbox.moe/cbmjou.png", // Adapté
  "Profiteroles au chocolat": "https://images.unsplash.com/photo-1600431521340-491eca880813?w=400", // Nouveau
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",

  // --- ALCOOLS ---
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
  sendFactures: { title: "💰 FACTURE TRANSMISE", msg: "La vente a été enregistrée avec succès !" },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "La production cuisine a été déclarée." },
  sendEntreprise: { title: "🏢 COMMANDE PRO ENVOYÉE", msg: "Le bon de commande entreprise est parti." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "La commande partenaire est enregistrée." },
  sendGarage: { title: "🚗 VÉHICULE ACTUALISÉ", msg: "L'état du véhicule a été mis à jour." },
  sendExpense: { title: "💳 NOTE DE FRAIS", msg: "Vos frais et la preuve ont été transmis." },
  sendSupport: { title: "🆘 SUPPORT CONTACTÉ", msg: "Votre message a été envoyé au patron." },
  sync: { title: "☁️ CLOUD SYNCHRONISÉ", msg: "Les données sont maintenant à jour." }
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [cart, setCart] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const initialForms = {
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '', file: null },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  };

  const [forms, setForms] = useState(initialForms);

  // --- LOGIQUE COMPRESSION IMAGE ---
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
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      notify("ERREUR", "Fichier non supporté", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result);
      setForms(prev => ({ ...prev, expense: { ...prev.expense, file: compressed } }));
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  // --- GESTION DU CTRL+V (PASTE) ---
  useEffect(() => {
    const handlePaste = (event) => {
      if (currentTab !== 'expenses') return;
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          handleFileChange(blob);
          notify("📸 CAPTURE DÉTECTÉE", "L'image collée a été ajoutée.", "success");
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentTab, forms]);

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
    if(isSync) notify("SYNCHRONISATION", "Mise à jour en cours...", "info");
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) {
        setData(j);
        const firstComp = Object.keys(j.partners.companies)[0];
        setForms(f => ({...f,
          expense: {...f.expense, vehicle: j.vehicles[0]},
          garage: {...f.garage, vehicle: j.vehicles[0]},
          partner: { ...f.partner, company: firstComp, benef: j.partners.companies[firstComp].beneficiaries[0], items: [{ menu: j.partners.companies[firstComp].menus[0].name, qty: 1 }] }
        }));
        if(isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      } else {
        notify("ERREUR CLOUD", j.message || "Réponse invalide", "error");
      }
    } catch (e) {
      notify("ERREUR CLOUD", "Connexion perdue", "error");
    }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const v = parseInt(val) || 0;
    if (v <= 0) n.splice(idx, 1);
    else n[idx].qty = v;
    setCart(n);
  };

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) {
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success");

        if(action === 'sendFactures') {
          setCart([]);
          setForms(prev => ({...prev, invoiceNum: ''}));
        } else if (action === 'sendProduction') {
          setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]}));
        } else if (action === 'sendEntreprise') {
          setForms(prev => ({...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] }}));
        } else if (action === 'sendPartnerOrder') {
          setForms(prev => ({...prev, partner: { ...prev.partner, num: '' }}));
        } else if (action === 'sendExpense') {
          setForms(prev => ({...prev, expense: { ...prev.expense, amount: '', file: null }}));
        } else if (action === 'sendSupport') {
          setForms(prev => ({...prev, support: { ...prev.support, msg: '' }}));
        }

        loadData();
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  // ✅ Loader visible (anti page blanche)
  if (loading && !data) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'#fff', fontWeight:900}}>
        Chargement...
      </div>
    );
  }

  // ✅ écran erreur si data ne charge pas (API down / env manquantes)
  if (!data) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'#fff', padding:20}}>
        <div style={{maxWidth:520, width:'100%', background:'#181a20', border:'1px solid #2d333f', borderRadius:16, padding:24}}>
          <div style={{fontWeight:900, fontSize:22, marginBottom:8}}>Erreur de chargement</div>
          <div style={{opacity:0.8, marginBottom:16}}>
            Impossible de récupérer les données (API / Google Sheets / variables).
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{width:'100%', padding:14, borderRadius:12, border:'none', cursor:'pointer', fontWeight:900, background:'#ff9800', color:'#fff'}}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 16px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--brd); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 2px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .main { flex: 1; overflow-y: auto; padding: 30px; position: relative; background: radial-gradient(circle at 100% 100%, #2a1b0a 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 18px; cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }
        .form-ui { width: 100%; max-width: 550px; background: rgba(22, 25, 32, 0.6); backdrop-filter: blur(12px); padding: 40px; border-radius: 30px; border: 1px solid var(--brd); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .btn-p:disabled { background: #374151; color: #9ca3af; cursor: not-allowed; opacity: 0.6; }

        .cart { width: 320px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; }
        .qty-inp { width: 55px; background: #000; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 6px; font-weight: 800; padding: 5px 0; font-size: 1rem; }
        .tool-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 15px; }
        .icon-tool { background: var(--panel); border: 1px solid var(--brd); color: #fff; padding: 10px; border-radius: 10px; cursor: pointer; text-align: center; transition: 0.2s; }
        .icon-tool:hover { border-color: var(--p); color: var(--p); }
        .toast { position: fixed; top: 20px; right: 20px; padding: 15px 30px; border-radius: 12px; z-index: 3000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border-left: 6px solid rgba(255,255,255,0.2); font-weight: 800; }
        .perf-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s ease-out; }

        .dropzone {
          border: 2px dashed var(--brd);
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          background: rgba(0,0,0,0.2);
          transition: 0.3s;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .dropzone.active { border-color: var(--p); background: rgba(255,152,0,0.05); }
        .dz-preview { width: 100%; max-height: 180px; object-fit: contain; border-radius: 10px; margin-top: 10px; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30}} />
            <h1 style={{marginBottom:30}}>Mon Espace</h1>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisir un agent...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>

            {/* ✅ Désactivé si data pas prêt */}
            <button
              className="btn-p"
              onClick={()=>{playSound('success'); setView('app');}}
              disabled={!user || !data}
            >
              OUVRIR MA SESSION
            </button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:35}}><img src="https://i.goopics.net/dskmxi.png" height="50" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.2rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>

            <div style={{padding: '15px 0', borderTop: '1px solid var(--brd)'}}>
              <div className="tool-bar">
                <button className="icon-tool" title="Refresh Page" onClick={() => window.location.reload()}>🔃</button>
                <button className="icon-tool" title="Sync Data" onClick={() => loadData(true)}>☁️</button>
                <button className="icon-tool" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              <div style={{background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12, marginBottom: 10}}>
                <div style={{fontSize: '0.8rem', fontWeight: 800, color: '#fff'}}>{user}</div>
                <div style={{fontSize: '0.65rem', color: 'var(--p)', textTransform: 'uppercase'}}>{myProfile?.role || 'Agent'}</div>
              </div>
              <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', justifyContent: 'center'}}>🚪 DÉCONNEXION</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* TABLEAU DE BORD */}
              {currentTab === 'home' && (
                <div style={{animation: 'slideIn 0.5s ease'}}>
                  <h1 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: 10}}>Bonjour, {user.split(' ')[0]} 👋</h1>
                  <p style={{color: 'var(--muted)', fontSize: '1.1rem', marginBottom: 40}}>Bienvenue sur le portail Hen House. Gérez vos ventes et productions.</p>

                  <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 40}}>
                    <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, var(--panel) 0%, #2a1b0a 100%)'}}>
                      <div style={{fontSize: '3.5rem'}}>💰</div>
                      <div>
                        <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1}}>MON CA TOTAL</div>
                        <div style={{fontSize: '2.2rem', fontWeight: 900, color: 'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="card" style={{display:'flex', alignItems:'center', gap:25, padding: 35, textAlign:'left', background: 'linear-gradient(135deg, var(--panel) 0%, #1a1a1a 100%)'}}>
                      <div style={{fontSize: '3.5rem'}}>📦</div>
                      <div>
                        <div style={{fontSize: '0.75rem', color:'var(--muted)', fontWeight: 800, letterSpacing: 1}}>MA PRODUCTION</div>
                        <div style={{fontSize: '2.2rem', fontWeight: 900}}>{myProfile?.stock.toLocaleString()} u.</div>
                      </div>
                    </div>
                  </div>

                  <h3 style={{marginBottom: 20, fontWeight: 800, color: 'var(--muted)', fontSize: '0.9rem'}}>ACCÈS RAPIDE</h3>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:15}}>
                    {MODULES.filter(m => !['home', 'profile'].includes(m.id)).map(m => (
                      <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 25}}>
                        <span style={{fontSize:'2.8rem'}}>{m.e}</span>
                        <div style={{marginTop:15, fontSize:'0.9rem', fontWeight:800}}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAISSE */}
              {currentTab === 'invoices' && (
                <>
                  <div style={{display:'flex', gap:10, marginBottom:25}}>
                    <input className="inp" placeholder="🔍 Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                    <select className="inp" style={{width:180, marginBottom:0}} onChange={e=>setCatFilter(e.target.value)}>
                      <option>Tous</option>
                      {Object.keys(data.productsByCategory).map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                      <div key={p} className={`card ${cart.some(i=>i.name===p)?'sel':''}`} onClick={()=>{
                        playSound('click');
                        const ex = cart.find(x=>x.name===p);
                        if(ex) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                        else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                      }}>
                        <div style={{height:110, borderRadius:10, overflow:'hidden', background:'#000', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
                          {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'2rem', opacity:0.2}}>{p.charAt(0)}</span>}
                        </div>
                        <div style={{fontWeight:800, fontSize:'0.75rem', height:35}}>{p}</div>
                        <div style={{color:'var(--p)', fontWeight:900, marginTop:5}}>${data.prices[p]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* MODULES CENTRÉS */}
              {['stock', 'enterprise', 'partners', 'expenses', 'garage', 'profile', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>📦 STOCK CUISINE</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}>
                              <option value="">Produit...</option>
                              {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'1px dashed var(--brd)', justifyContent:'center', margin:'10px 0 20px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ligne</button>
                        <button className="btn-p" disabled={sending || forms.stock.some(s => !s.product)} onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                      </>
                    )}

                    {currentTab === 'enterprise' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🏢 COMMANDE PRO</h2>
                        <input className="inp" placeholder="Nom de l'entreprise client" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                        {forms.enterprise.items.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }}>
                              <option value="">Produit...</option>
                              {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.enterprise.name || forms.enterprise.items.some(s => !s.product)} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER</button>
                      </>
                    )}

                    {currentTab === 'partners' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🤝 PARTENAIRES</h2>
                        <input className="inp" placeholder="N° Facture Obligatoire" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                        <div style={{display:'flex', gap:10}}>
                          <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{
                            const c = e.target.value;
                            setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                          }}>
                            {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                          </select>
                          <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                            {data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>

                        {/* LISTE DES MENUS PARTENAIRES */}
                        {forms.partner.items.map((item, idx) => (
                          <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{
                              const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                            }}>
                              {data.partners.companies[forms.partner.company]?.menus.map(m => <option key={m.name}>{m.name}</option>)}
                            </select>
                            <input type="number" className="qty-inp" style={{height:45}} value={item.qty} onChange={e=>{
                              const n = [...forms.partner.items]; n[idx].qty = e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" disabled={sending || !forms.partner.num} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER PARTENAIRE</button>
                      </>
                    )}

                    {currentTab === 'expenses' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>💳 FRAIS</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                          {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                        <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                          <option>Essence</option><option>Réparation</option>
                        </select>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />

                        {/* DROPZONE INTERACTIVE */}
                        <div
                          className={`dropzone ${dragActive ? 'active' : ''}`}
                          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }}
                          onClick={() => document.getElementById('inpFile').click()}
                        >
                          <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                          {forms.expense.file ? (
                            <div>
                              <div style={{color:'var(--p)', fontWeight:800, fontSize:'0.7rem'}}>PREUVE CHARGÉE</div>
                              <img src={forms.expense.file} className="dz-preview" />
                              <div style={{fontSize:'0.6rem', marginTop:5, opacity:0.5}}>Ctrl+V pour coller une autre image</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{fontSize:'2rem'}}>📸</div>
                              <div style={{fontWeight:800, marginTop:10}}>DÉPOSER LA PREUVE ICI</div>
                              <div style={{fontSize:'0.7rem', opacity:0.6}}>Ctrl+V, Glisser ou Cliquez</div>
                            </div>
                          )}
                        </div>

                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>DÉCLARER AVEC PREUVE</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🚗 GARAGE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                          {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                          <option>Entrée</option><option>Sortie</option>
                        </select>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:20}}><span>⛽ Essence</span><span>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', marginTop:15}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:25}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>ENREGISTRER</button>
                      </>
                    )}

                    {currentTab === 'profile' && myProfile && (
                      <div className="center-box">
                        <div className="form-ui" style={{maxWidth: 600, padding: 50}}>
                          <div style={{textAlign:'center', marginBottom: 30}}>
                            <div style={{width:130, height:130, borderRadius:40, background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', fontWeight:900}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'2.5rem', fontWeight:900}}>{user}</h1>
                            <p style={{color:'var(--p)', fontSize:'1.2rem', fontWeight:800}}>{myProfile.role}</p>
                          </div>
                          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom: 20}}>
                            <div className="card" style={{background: 'rgba(0,0,0,0.3)'}}>
                              <p style={{fontSize:'0.8rem', color:'var(--muted)'}}>💰 CHIFFRE D'AFFAIRES</p>
                              <p style={{fontSize: '1.5rem', fontWeight: 900}}>${myProfile.ca.toLocaleString()}</p>
                            </div>
                            <div className="card" style={{background: 'rgba(0,0,0,0.3)'}}>
                              <p style={{fontSize:'0.8rem', color:'var(--muted)'}}>📦 PRODUCTION</p>
                              <p style={{fontSize: '1.5rem', fontWeight: 900}}>{myProfile.stock.toLocaleString()} u.</p>
                            </div>
                          </div>
                          <div className="card" style={{background: 'linear-gradient(135deg, rgba(255,152,0,0.2) 0%, rgba(18,26,32,1) 100%)', border: '1px solid var(--p)', marginBottom: 20}}>
                            <p style={{fontSize:'0.8rem', color:'var(--p)', fontWeight: 800}}>💵 SALAIRE ACTUEL ESTIMÉ</p>
                            <p style={{fontSize: '2rem', fontWeight: 900}}>${myProfile.salary?.toLocaleString() || 0}</p>
                            <p style={{fontSize: '0.7rem', opacity: 0.6, marginTop: 5}}>Basé sur tes ventes et ta production actuelle</p>
                          </div>
                          <div className="card" style={{textAlign: 'left', background: 'rgba(255,255,255,0.02)'}}>
                            <p style={{marginBottom: 10}}>📅 <b>Ancienneté :</b> {myProfile.seniority} jours</p>
                            <p style={{marginBottom: 10}}>🆔 <b>ID Employé :</b> #00{myProfile.id}</p>
                            <p>📞 <b>Numéro :</b> {myProfile.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🆘 SUPPORT</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur Facture</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:180, resize:'none'}} placeholder="Détails..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" disabled={sending || !forms.support.msg} onClick={()=>send('sendSupport', forms.support)}>ENVOYER</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30, maxWidth:1100, margin:'0 auto'}}>
                  <div className="card" style={{padding:25, textAlign:'left'}}>
                    <h2 style={{marginBottom:20}}>🏆 TOP 10 CHIFFRE D'AFFAIRES</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 15}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem'}}>
                          <span>{i < 3 ? ['🥇','🥈','🥉'][i] : (i+1)+'.'} <b>{e.name}</b></span>
                          <b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca/data.employeesFull[0].ca)*100+'%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:25, textAlign:'left'}}>
                    <h2 style={{marginBottom:20}}>📦 TOP 10 PRODUCTION STOCK</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 15}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.9rem'}}>
                          <span>{i < 3 ? ['🥇','🥈','🥉'][i] : (i+1)+'.'} <b>{e.name}</b></span>
                          <b style={{color:'var(--p)'}}>{e.stock.toLocaleString()} u.</b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16, 185, 129, 0.1)'}}><div className="perf-fill" style={{background:'#10b981', width: (e.stock/data.employeesFull[0].stock)*100+'%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANNUAIRE */}
              {currentTab === 'directory' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:15}}>
                  {data.employeesFull.map(e => (
                    <div key={e.id} className="card" style={{padding:20, textAlign:'left', display:'flex', gap:15, alignItems:'center'}}>
                      <div style={{width:50, height:50, borderRadius:15, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:900}}>{e.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800}}>{e.name}</div>
                        <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700}}>{e.role}</div>
                        <div style={{fontSize:'0.85rem', marginTop:5, color:'var(--muted)'}}>📞 {e.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* PANIER */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)'}}><h2 style={{fontSize:'1.1rem', fontWeight:900}}>🛒 PANIER</h2></div>
              <div style={{padding:15}}>
                <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem'}} />
              </div>
              <div style={{flex:1, overflowY:'auto', padding:'0 15px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div>
                      <div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'rgba(0,0,0,0.5)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
                  <span>TOTAL</span>
                  <b style={{fontSize:'2.2rem', color:'var(--p)', fontWeight:900}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                  {sending ? "ENVOI..." : "VALIDER VENTE"}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)'), color: '#fff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>{toast.t}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>{toast.m}</div>
        </div>
      )}
    </div>
  );
}

