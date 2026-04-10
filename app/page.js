'use client';
import { useState, useEffect, useMemo } from 'react';

const MODULES = [
  { id: 'home', l: 'Dashboard', e: '🏠' },
  { id: 'invoices', l: 'Caisse', e: '💰' },
  { id: 'stock', l: 'Stock', e: '📦' },
  { id: 'enterprise', l: 'Entreprise', e: '🏢' },
  { id: 'partners', l: 'Partenaires', e: '🤝' },
  { id: 'expenses', l: 'Frais', e: '💳' },
  { id: 'garage', l: 'Garage', e: '🚗' },
  { id: 'directory', l: 'Annuaire', e: '👥' },
  { id: 'performance', l: 'Perf', e: '🏆' },
  { id: 'rules', l: 'Règlement', e: '📜' },
  { id: 'profile', l: 'Profil', e: '👤' },
  { id: 'support', l: 'Support', e: '🆘' }
];

const IMAGES = {
  "Lasagne aux légumes": "https://files.catbox.moe/u8u4be.png",
  "Effiloché de Mouton": "https://files.catbox.moe/56m75j.png",
  "Burger Gourmet au Foie Gras": "https://files.catbox.moe/7p4873.png",
  "Nectar Exotique": "https://files.catbox.moe/8p59qf.png",
  "Kombucha Citron": "https://files.catbox.moe/7m45v2.png",
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Carpaccio Fruit Exotique": "https://files.catbox.moe/cbmjou.png",
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",
};

const NOTIF_MESSAGES = {
  sendFactures: { title: "💰 FACTURE TRANSMISE", msg: "La vente a été enregistrée avec succès !" },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "La production cuisine a été déclarée." },
  sendEntreprise: { title: "🏢 COMMANDE PRO ENVOYÉE", msg: "Le bon de commande entreprise est parti." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "La commande partenaire est enregistrée." },
  sendGarage: { title: "🚗 VÉHICULE ACTUALISÉ", msg: "L'état du véhicule a été mis à jour." },
  sendExpense: { title: "💳 NOTE DE FRAIS", msg: "Vos frais et la preuve ont été transmis." },
  sendSupport: { title: "🆘 SUPPORT CONTACTÉ", msg: "Votre message a été envoyé au patron." },
  sync: { title: "☁️ SYNCHRONISÉ", msg: "Les données sont maintenant à jour." }
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
  const [confirmModal, setConfirmModal] = useState(null);
  const [profileWeek, setProfileWeek] = useState('Toutes');
  const [expandedInv, setExpandedInv] = useState(null);
  const [expenseWeek, setExpenseWeek] = useState('Toutes');
  const [activeCat, setActiveCat] = useState('plats_principaux');
  const [activeStockCat, setActiveStockCat] = useState('plats_principaux');
  const [loginRole, setLoginRole] = useState('');

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

  useEffect(() => {
    const savedUser = localStorage.getItem('hh_user');
    if (savedUser) { setUser(savedUser); setView('app'); }
    const savedCart = localStorage.getItem('hh_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => { localStorage.setItem('hh_cart', JSON.stringify(cart)); }, [cart]);

  const compressImage = (base64) => new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
  });

  const handleFileChange = async (file) => {
    if (!file || !file.type.startsWith('image/')) { notify("ERREUR", "Fichier non supporté", "error"); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result);
      setForms(prev => ({ ...prev, expense: { ...prev.expense, file: compressed } }));
      notify("📸 REÇU AJOUTÉ", "La preuve a été chargée.", "success");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handlePaste = (event) => {
      if (currentTab !== 'expenses') return;
      for (let i = 0; i < event.clipboardData.items.length; i++) {
        if (event.clipboardData.items[i].type.indexOf('image') !== -1)
          handleFileChange(event.clipboardData.items[i].getAsFile());
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentTab]);

  const playSound = (type) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05); }
      else if (type === 'success') { osc.type = 'sine'; osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.1); osc.frequency.setValueAtTime(783, now + 0.2); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4); }
      else if (type === 'error') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.setValueAtTime(100, now + 0.15); gain.gain.setValueAtTime(0.08, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
      else if (type === 'cash') { osc.type = 'square'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(2500, now + 0.1); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2); osc.start(now); osc.stop(now + 0.2); const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.setValueAtTime(3000, now); osc2.connect(gain); osc2.start(now); osc2.stop(now + 0.3); }
    } catch (e) { console.warn("Audio bloqué", e); }
  };

  const notify = (t, m, s = 'info') => {
    setToast({ t, m, s });
    if (s === 'success') playSound('success');
    else if (s === 'error') playSound('error');
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async (isSync = false) => {
    if (isSync) notify("SYNCHRONISATION", "Mise à jour en cours...", "info");
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if (j.success) {
        setData(j);
        setForms(f => ({ ...f, expense: { ...f.expense, vehicle: j.vehicles[0] }, garage: { ...f.garage, vehicle: j.vehicles[0] } }));
        if (isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a, b) => a + b.qty * b.pu, 0)), [cart]);
  const gainEstime = useMemo(() => Math.round(total * 0.45), [total]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    if (val === '') n[idx].qty = '';
    else { const v = parseInt(val); if (!isNaN(v) && v >= 0) n[idx].qty = v; }
    setCart(n);
  };

  const removeFromCart = (idx) => { const n = [...cart]; n.splice(idx, 1); setCart(n); playSound('click'); };

  const send = async (action, payload) => {
    if (sending) return; playSound('click'); setSending(true);
    try {
      const cleanPayload = { ...payload };
      if (action === 'sendFactures') cleanPayload.items = payload.items.map(x => ({ ...x, qty: Number(x.qty) || 0 })).filter(x => x.qty > 0);
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: { ...cleanPayload, employee: user } }) });
      const j = await r.json();
      if (j.success) {
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success");
        if (action === 'sendFactures') { playSound('cash'); setCart([]); setForms(prev => ({ ...prev, invoiceNum: '' })); }
        else if (action === 'sendProduction') setForms(prev => ({ ...prev, stock: [{ product: '', qty: 1 }] }));
        else if (action === 'sendEntreprise') setForms(prev => ({ ...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] } }));
        else if (action === 'sendPartnerOrder') setForms(prev => ({ ...prev, partner: { ...prev.partner, num: '' } }));
        else if (action === 'sendExpense') setForms(prev => ({ ...prev, expense: { ...prev.expense, amount: '', file: null } }));
        else if (action === 'sendSupport') setForms(prev => ({ ...prev, support: { ...prev.support, msg: '' } }));
        loadData();
      } else notify("ÉCHEC", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); notify("📋 COPIÉ", `Numéro copié : ${text}`, "success"); }
    catch (e) { try { const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); notify("📋 COPIÉ", `Numéro copié : ${text}`, "success"); } catch { notify("ERREUR", "Impossible de copier", "error"); } }
  };

  const requestLogout = () => setConfirmModal({ title: "DÉCONNEXION", msg: "Fermer votre session ?", action: () => { localStorage.removeItem('hh_user'); setView('login'); setConfirmModal(null); } });
  const requestClearCart = () => { if (cart.length === 0) return; setConfirmModal({ title: "VIDER LE PANIER", msg: "Supprimer tous les articles ?", action: () => { setCart([]); setConfirmModal(null); playSound('click'); } }); };

  if (loading && !data) return (
    <div style={{ background: 'var(--bg)', display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`body{background:#080608;margin:0;} @keyframes shimmer{0%,100%{opacity:.15}50%{opacity:.35}}`}</style>
      <div style={{ display: 'flex', gap: 30, width: '100vw', height: '100vh', padding: 20 }}>
        <div style={{ width: 80, borderRadius: 40, background: 'rgba(212,175,55,0.08)', animation: 'shimmer 1.8s infinite' }}></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
          <div style={{ height: 70, borderRadius: 20, background: 'rgba(212,175,55,0.08)', animation: 'shimmer 1.8s .2s infinite', maxWidth: 400 }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 20 }}>
            {[0,1,2].map(i => <div key={i} style={{ height: 160, borderRadius: 24, background: 'rgba(212,175,55,0.08)', animation: `shimmer 1.8s ${i*0.2}s infinite` }}></div>)}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── LUXURY GLOBAL CSS ─── */
  const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --gold: #D4AF37;
      --gold-light: #E8C96A;
      --gold-dim: rgba(212,175,55,0.18);
      --gold-glow: rgba(212,175,55,0.25);
      --bg: #07060A;
      --bg2: #0E0C14;
      --bg3: #141020;
      --glass: rgba(255,255,255,0.03);
      --glass2: rgba(255,255,255,0.055);
      --border: rgba(212,175,55,0.14);
      --border2: rgba(212,175,55,0.28);
      --txt: #F0EDE6;
      --txt2: #9C9490;
      --txt3: #6A6460;
      --success: #4ADE80;
      --error: #F87171;
      --radius: 20px;
      --serif: 'Cormorant Garamond', Georgia, serif;
      --sans: 'DM Sans', sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 80% 60% at 50% -20%, rgba(212,175,55,0.06) 0%, transparent 70%),
        radial-gradient(ellipse 40% 40% at 90% 80%, rgba(120,80,200,0.04) 0%, transparent 60%);
      color: var(--txt);
      font-family: var(--sans);
      font-size: 15px;
      height: 100vh;
      overflow: hidden;
    }

    .app { display: flex; height: 100vh; width: 100vw; }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    /* ── DOCK ── */
    .dock-wrap { padding: 16px; display: flex; align-items: center; }
    .dock {
      width: 72px;
      height: 96vh;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0 20px;
      transition: width .35s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
      position: relative;
    }
    .dock::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 32px;
      background: linear-gradient(160deg, rgba(212,175,55,0.05) 0%, transparent 50%);
      pointer-events: none;
    }
    .dock:hover { width: 220px; }
    .dock:hover .nav-label { opacity: 1; transform: translateX(0); display: block; }
    .dock:hover .nav-btn { justify-content: flex-start; padding-left: 18px; }
    .dock:hover .dock-logo { width: 110px; }
    .dock:hover .user-pill { width: 85%; padding: 8px 14px; border-radius: 18px; height: auto; }
    .dock:hover .user-info { display: block; }
    .dock:hover .tool-row { opacity: 1; }

    .dock-logo { height: 38px; width: 52px; overflow: hidden; transition: .35s; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
    .dock-logo img { height: 38px; filter: drop-shadow(0 0 12px rgba(212,175,55,.4)); }

    .nav-scroll { flex: 1; width: 100%; display: flex; flex-direction: column; align-items: center; overflow-y: auto; overflow-x: hidden; gap: 2px; }

    .nav-btn {
      display: flex; align-items: center; justify-content: center;
      width: 82%; padding: 11px 12px;
      border-radius: 14px; border: 1px solid transparent;
      background: transparent; color: var(--txt3);
      cursor: pointer; transition: all .2s; font-family: var(--sans);
    }
    .nav-btn:hover { background: var(--glass2); color: var(--txt); border-color: var(--border); }
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08));
      color: var(--gold-light);
      border-color: var(--border2);
      box-shadow: inset 0 0 20px rgba(212,175,55,0.06);
    }
    .nav-btn:active { transform: scale(.96); }

    .nav-icon { font-size: 1.15rem; flex-shrink: 0; }
    .nav-label { font-size: .82rem; font-weight: 500; opacity: 0; transform: translateX(-8px); transition: .3s; white-space: nowrap; margin-left: 12px; display: none; }

    .dock-footer { margin-top: auto; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 8px; }
    .tool-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; opacity: .35; transition: .3s; }
    .tool-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--glass); border: 1px solid var(--border); color: var(--txt2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .8rem; transition: .2s; }
    .tool-btn:hover { background: var(--gold-dim); border-color: var(--border2); color: var(--gold-light); }

    .user-pill { background: var(--bg3); border: 1px solid var(--border); padding: 8px; border-radius: 50%; display: flex; align-items: center; gap: 10px; width: 46px; height: 46px; overflow: hidden; transition: .35s; cursor: pointer; }
    .user-avatar { width: 28px; height: 28px; min-width: 28px; background: linear-gradient(135deg, var(--gold), #A8852A); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .85rem; color: #1a1200; font-family: var(--serif); }
    .user-info { display: none; white-space: nowrap; }
    .u-name { font-size: .78rem; font-weight: 600; display: block; color: var(--txt); }
    .u-role { font-size: .62rem; color: var(--txt3); text-transform: uppercase; letter-spacing: .5px; }

    /* ── MAIN ── */
    .main { flex: 1; overflow-y: auto; padding: 36px 40px; }
    .fade-in { animation: fadeIn .4s cubic-bezier(.2,.8,.2,1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    /* ── INPUTS ── */
    .inp {
      width: 100%; padding: 14px 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: rgba(0,0,0,0.35);
      color: var(--txt); font-weight: 400; font-size: .9rem;
      font-family: var(--sans);
      margin-bottom: 14px; transition: .25s;
    }
    .inp:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,175,55,0.08); background: rgba(0,0,0,0.5); }
    .inp::placeholder { color: var(--txt3); }
    select.inp { background-color: #080608 !important; color: var(--txt); cursor: pointer; }
    option { background: #0e0c14; color: var(--txt); }

    /* ── BUTTONS ── */
    .btn-p {
      background: linear-gradient(135deg, var(--gold), #A8852A);
      color: #0e0a00; border: none;
      padding: 16px; border-radius: 14px;
      font-weight: 600; font-size: .9rem;
      font-family: var(--sans); letter-spacing: .3px;
      cursor: pointer; width: 100%; transition: .25s;
      box-shadow: 0 8px 24px rgba(212,175,55,0.2);
      text-transform: uppercase;
    }
    .btn-p:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,175,55,0.3); filter: brightness(1.08); }
    .btn-p:active { transform: scale(.97); }
    .btn-p:disabled { background: rgba(255,255,255,0.06); color: var(--txt3); box-shadow: none; transform: none; cursor: not-allowed; filter: none; }

    /* ── CARDS ── */
    .lux-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      transition: all .3s cubic-bezier(.25,.8,.25,1);
    }
    .lux-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
    }
    .lux-card:hover { border-color: var(--border2); box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1); transform: translateY(-4px); }

    .product-card {
      height: 160px;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 20px;
      cursor: pointer;
      position: relative; overflow: hidden;
      transition: all .2s ease;
    }
    .product-card:hover { border-color: var(--gold); box-shadow: 0 0 24px rgba(212,175,55,0.12); transform: translateY(-3px); }
    .product-card:active { transform: scale(.97); }

    /* ── STAT CARDS ── */
    .stat-card {
      padding: 28px; border-radius: 22px;
      background: var(--bg2);
      border: 1px solid var(--border);
      transition: .3s; position: relative; overflow: hidden;
    }
    .stat-card::after {
      content: '';
      position: absolute; bottom: 0; right: 0;
      width: 100px; height: 100px;
      background: radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%);
      pointer-events: none;
    }
    .stat-card:hover { border-color: var(--border2); transform: translateY(-3px); }

    /* ── CHIPS ── */
    .chip {
      padding: 8px 20px; border-radius: 100px;
      background: var(--glass); border: 1px solid var(--border);
      color: var(--txt2); font-weight: 500; font-size: .8rem;
      cursor: pointer; transition: .2s; white-space: nowrap;
      font-family: var(--sans);
    }
    .chip:hover { background: var(--glass2); color: var(--txt); }
    .chip.active { background: var(--gold-dim); color: var(--gold-light); border-color: var(--border2); }

    /* ── CART ── */
    .cart-panel {
      width: 340px;
      background: var(--bg2);
      border-left: 1px solid var(--border);
      display: flex; flex-direction: column;
      position: relative;
    }
    .cart-panel::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
    }
    .cart-header { padding: 28px 24px; text-align: center; border-bottom: 1px solid var(--border); }
    .cart-title { font-family: var(--serif); font-size: 1.2rem; font-weight: 600; letter-spacing: 2px; color: var(--txt2); text-transform: uppercase; margin-bottom: 6px; }
    .cart-total-display { font-family: var(--serif); font-size: 2.6rem; color: var(--gold-light); font-weight: 700; }

    .cart-items { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .cart-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--glass); border-radius: 14px; border: 1px solid var(--border); transition: .2s; }
    .cart-item:hover { border-color: var(--border2); }

    .qty-control { display: flex; align-items: center; background: rgba(0,0,0,0.4); border-radius: 10px; padding: 2px; border: 1px solid var(--border); }
    .qty-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--txt2); font-weight: 700; background: transparent; border: none; transition: .15s; border-radius: 8px; }
    .qty-btn:hover { color: var(--gold-light); background: var(--gold-dim); }
    .qty-input { width: 32px; background: transparent; border: none; color: var(--txt); text-align: center; font-weight: 600; font-size: .85rem; -moz-appearance: textfield; font-family: var(--sans); }
    .qty-input::-webkit-outer-spin-button, .qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }
    .del-btn { color: var(--error); background: rgba(248,113,113,0.08); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: .2s; font-size: .9rem; }
    .del-btn:hover { background: var(--error); color: #fff; }

    .cart-footer { padding: 20px 24px; background: var(--bg3); border-top: 1px solid var(--border); }

    /* ── FORM UI ── */
    .form-ui {
      width: 100%; max-width: 500px;
      background: var(--bg2);
      border: 1px solid var(--border);
      padding: 36px; border-radius: 28px;
      position: relative; overflow: hidden;
    }
    .form-ui::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent);
    }

    .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; }

    /* ── MODAL ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(12px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn .25s; }
    .modal-box { background: var(--bg2); border: 1px solid var(--border2); padding: 40px; border-radius: 28px; width: 90%; max-width: 420px; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,0.7); animation: scaleIn .3s forwards; }
    @keyframes scaleIn { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    /* ── TOAST ── */
    .toast { position: fixed; top: 28px; left: 50%; z-index: 9999; padding: 14px 28px; border-radius: 100px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: .85rem; backdrop-filter: blur(20px); animation: toastIn .45s cubic-bezier(.175,.885,.32,1.275) forwards; }
    @keyframes toastIn { from { transform: translate(-50%,-120%); opacity: 0; } 70% { transform: translate(-50%, 4px); } to { transform: translate(-50%,0); opacity: 1; } }

    /* ── SECTION TITLES ── */
    .section-title {
      font-family: var(--serif);
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: .5px;
      color: var(--txt);
      margin-bottom: 16px;
    }
    .section-line { height: 1px; flex: 1; background: linear-gradient(90deg, var(--border), transparent); }

    /* ── GOLD DIVIDER ── */
    .gold-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim), transparent); margin: 24px 0; }

    /* ── LABEL FLOAT ── */
    .float-label { font-size: .68rem; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; position: absolute; top: -9px; left: 14px; background: var(--bg2); padding: 0 7px; z-index: 2; border-radius: 4px; }

    @keyframes pulseGold { 0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,.25); border-color: var(--border2); } 50% { box-shadow: 0 0 20px 6px rgba(212,175,55,.12); } }
  `;

  return (
    <div className="app">
      <style jsx global>{GLOBAL_CSS}</style>

      {/* ════════════════════════════════ LOGIN ════════════════════════════════ */}
      {view === 'login' ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Marble texture overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 100%, rgba(100,60,180,0.05) 0%, transparent 50%)', pointerEvents: 'none' }}></div>

          <div className="fade-in" style={{ width: '100%', maxWidth: 420, padding: '0 24px', zIndex: 10 }}>

            {/* Logo area */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: '28px', background: 'rgba(212,175,55,0.07)', border: '1px solid var(--border2)', marginBottom: 24, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -1, borderRadius: '28px', background: 'linear-gradient(135deg, rgba(212,175,55,0.3), transparent, rgba(212,175,55,0.1))', borderRadius: '28px' }}></div>
                <img src="https://i.goopics.net/dskmxi.png" height="52" style={{ filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.5))', position: 'relative', zIndex: 1 }} />
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 700, letterSpacing: '3px', color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>Hen House</h1>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 1, background: 'var(--gold-dim)' }}></div>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '1rem', letterSpacing: '1px' }}>San Andreas</span>
                <div style={{ width: 32, height: 1, background: 'var(--gold-dim)' }}></div>
              </div>
            </div>

            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '28px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)' }}></div>

              <div style={{ position: 'relative', marginBottom: 18 }}>
                <span className="float-label">Habilitation</span>
                <select className="inp" value={loginRole} onChange={e => { playSound('click'); setLoginRole(e.target.value); setUser(''); }} style={{ marginBottom: 0, height: 54, fontSize: '.9rem', fontWeight: 500, cursor: 'pointer', paddingLeft: 18 }}>
                  <option value="" disabled>— Sélectionner votre poste —</option>
                  {data?.employeesFull && [...new Set(data.employeesFull.map(e => e.role || 'Food Service Associate'))].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ position: 'relative', marginBottom: 28, opacity: loginRole ? 1 : .35, pointerEvents: loginRole ? 'auto' : 'none', transition: '.3s' }}>
                <span className="float-label">Identité</span>
                <select className="inp" value={user} onChange={e => { playSound('click'); setUser(e.target.value); }} style={{ marginBottom: 0, height: 54, fontSize: '.95rem', fontWeight: 500, cursor: 'pointer', paddingLeft: 18 }}>
                  <option value="" disabled>— Choisir votre badge —</option>
                  {data?.employeesFull?.filter(e => (e.role || 'Food Service Associate') === loginRole).map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
                </select>
              </div>

              <button className="btn-p" onClick={() => { playSound('success'); localStorage.setItem('hh_user', user); setView('app'); }} disabled={!user} style={{ height: 56, fontSize: '1rem', letterSpacing: '2px', borderRadius: '14px' }}>
                {user ? 'Accéder au terminal' : 'Accès restreint'}
              </button>

              <div style={{ marginTop: 22, textAlign: 'center', fontSize: '.65rem', color: 'var(--txt3)', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--sans)' }}>
                Terminal sécurisé · Réseau privé HH
              </div>
            </div>
          </div>
        </div>

      ) : (
        <>
          {/* ════════════════════════════ DOCK ════════════════════════════ */}
          <div className="dock-wrap">
            <aside className="dock">
              <div className="dock-logo"><img src="https://i.goopics.net/dskmxi.png" /></div>
              <nav className="nav-scroll">
                {MODULES.map(t => (
                  <button key={t.id} className={`nav-btn ${currentTab === t.id ? 'active' : ''}`} onClick={() => { playSound('click'); setCurrentTab(t.id); setSearch(''); }}>
                    <span className="nav-icon">{t.e}</span>
                    <span className="nav-label">{t.l}</span>
                  </button>
                ))}
              </nav>
              <div className="dock-footer">
                <div className="tool-row">
                  <button className="tool-btn" title="Reload" onClick={() => window.location.reload()}>↻</button>
                  <button className="tool-btn" title="Sync" onClick={() => loadData(true)}>☁</button>
                  <button className="tool-btn" title="Mute" onClick={() => { setIsMuted(!isMuted); playSound('click'); }}>{isMuted ? '🔇' : '🔊'}</button>
                </div>
                <div className="user-pill" onClick={requestLogout}>
                  <div className="user-avatar">{user.charAt(0)}</div>
                  <div className="user-info">
                    <span className="u-name">{user.split(' ')[0]}</span>
                    <span className="u-role">{myProfile?.role || 'Staff'}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* ════════════════════════════ MAIN ════════════════════════════ */}
          <main className="main">
            <div className="fade-in" style={{ maxWidth: 1200, margin: '0 auto' }}>

              {/* ─── HOME ─── */}
              {currentTab === 'home' && (
                <div className="fade-in">
                  {/* Header */}
                  <div style={{ marginBottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border)', paddingBottom: 28 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }}></div>
                        <span style={{ color: 'var(--success)', fontWeight: 500, letterSpacing: '2px', fontSize: '.7rem', textTransform: 'uppercase' }}>Connexion sécurisée</span>
                      </div>
                      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1, color: '#fff' }}>
                        {new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'}, <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>{user.split(' ')[0]}</span>.
                      </h1>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                        <span style={{ background: 'var(--gold-dim)', color: 'var(--gold-light)', border: '1px solid var(--border2)', padding: '4px 12px', borderRadius: '8px', fontWeight: 500, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{myProfile?.role || 'Employé'}</span>
                        <span style={{ color: 'var(--txt2)', fontSize: '.85rem' }}>Vos indicateurs sont à jour.</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '2.8rem', fontWeight: 600, color: 'var(--txt)', lineHeight: 1 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ color: 'var(--gold)', fontSize: '.9rem', fontWeight: 400, textTransform: 'capitalize', marginTop: 6, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    </div>
                  </div>

                  {/* Annonces */}
                  <div style={{ marginBottom: 44 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '1px' }}>Bureau de la Direction</h3>
                      <div className="section-line"></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)', border: '1px solid var(--border2)', padding: '20px 24px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }}></div>
                        <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>🏆</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--gold-light)', fontSize: '1.05rem', letterSpacing: '.5px' }}>Le Podium des Primes</span>
                            <span style={{ fontSize: '.62rem', color: '#0e0a00', background: 'var(--gold)', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Épinglé</span>
                          </div>
                          <div style={{ color: 'var(--txt2)', fontSize: '.88rem', lineHeight: 1.7 }}>
                            Les primes sont versées aux <strong style={{ color: 'var(--txt)' }}>3 meilleurs du classement</strong>, sous conditions : <span style={{ color: 'var(--success)' }}>✓ Assiduité complète</span> · <span style={{ color: 'var(--success)' }}>✓ Minimum 25 factures validées</span>.
                          </div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.2)', padding: '20px 24px', borderRadius: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>📜</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: '#F87171', fontSize: '1.05rem' }}>Consultation du Règlement</span>
                            <span style={{ fontSize: '.62rem', color: '#fff', background: 'rgba(248,113,113,0.7)', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>Important</span>
                          </div>
                          <div style={{ color: 'var(--txt2)', fontSize: '.88rem', lineHeight: 1.6 }}>
                            Consultez le <strong style={{ color: '#fff', cursor: 'pointer', borderBottom: '1px solid rgba(248,113,113,0.4)' }} onClick={() => setCurrentTab('rules')}>Règlement Intérieur</strong> dans votre terminal. La Clause XIV (TacoVans) est obligatoire.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ marginBottom: 44 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vos Indicateurs</h3>
                      <div className="section-line"></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                      {[
                        { icon: '💰', label: 'Chiffre d\'affaires', val: `$${Math.round(myProfile?.ca || 0).toLocaleString()}`, color: 'var(--gold-light)', tag: 'Ventes' },
                        { icon: '📦', label: 'Articles préparés', val: myProfile?.stock?.toLocaleString?.() ?? myProfile?.stock, color: 'var(--success)', tag: 'Cuisine' },
                        { icon: '💶', label: 'Salaire prévisionnel', val: `$${Math.round(myProfile?.salary || 0).toLocaleString()}`, color: '#A78BFA', tag: 'Projection' }
                      ].map((s, i) => (
                        <div key={i} className="stat-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
                            <span style={{ fontSize: '.65rem', color: s.color, fontWeight: 600, background: `${s.color}18`, border: `1px solid ${s.color}35`, padding: '3px 9px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.tag}</span>
                          </div>
                          <div style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                          <div style={{ marginTop: 6, fontSize: '.75rem', color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apps */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '1px' }}>Applications Métier</h3>
                    <div className="section-line"></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 14 }}>
                    {MODULES.filter(m => !['home', 'profile', 'performance', 'directory', 'rules'].includes(m.id)).map(m => (
                      <div key={m.id} className="lux-card" onClick={() => setCurrentTab(m.id)} style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 10 }}>
                        <span style={{ fontSize: '1.6rem' }}>{m.e}</span>
                        <div style={{ fontSize: '.75rem', fontWeight: 500, color: 'var(--txt2)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── CAISSE ─── */}
              {currentTab === 'invoices' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexShrink: 0 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input className="inp" placeholder="Rechercher un produit..." style={{ paddingLeft: 44, marginBottom: 0, height: 48, borderRadius: '14px' }} value={search} onChange={e => setSearch(e.target.value)} />
                      <span style={{ position: 'absolute', left: 16, top: 14, opacity: .4 }}>🔍</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 8, flexShrink: 0 }}>
                    <button className={`chip ${catFilter === 'Tous' ? 'active' : ''}`} onClick={() => setCatFilter('Tous')}>Tout</button>
                    {data && Object.keys(data.productsByCategory).map(c => (
                      <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c.replace('_', ' ')}</button>
                    ))}
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, alignContent: 'start', paddingRight: 8, paddingBottom: 24 }}>
                    {data && (() => {
                      const filtered = data.products.filter(p => (catFilter === 'Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase()));
                      if (filtered.length === 0) return <div style={{ textAlign: 'center', padding: '60px 20px', opacity: .3, gridColumn: '1 / -1' }}><div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍽</div><div style={{ fontWeight: 500 }}>Aucun produit</div></div>;
                      return filtered.map(p => {
                        const cartItem = cart.find(i => i.name === p);
                        return (
                          <div key={p} className="product-card" onClick={() => { playSound('click'); cartItem ? setCart(cart.map(x => x.name === p ? { ...x, qty: x.qty + 1 } : x)) : setCart([...cart, { name: p, qty: 1, pu: data.prices[p] || 0 }]); }}>
                            {cartItem && <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg, var(--gold), #A8852A)', color: '#0e0a00', width: 24, height: 24, borderRadius: '8px', fontSize: '.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>{cartItem.qty}</div>}
                            <div style={{ width: '100%', height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
                              {IMAGES[p] ? <img src={IMAGES[p]} style={{ maxHeight: '58px', maxWidth: '85%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} /> : <div style={{ fontSize: '1.8rem' }}>🍔</div>}
                            </div>
                            <div style={{ padding: '8px 10px' }}>
                              <div style={{ fontWeight: 500, fontSize: '.72rem', color: 'var(--txt)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 2 }}>{p}</div>
                              <div style={{ color: 'var(--gold-light)', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.05rem' }}>${data.prices[p]}</div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* ─── STOCK ─── */}
              {currentTab === 'stock' && (() => {
                const stockItems = (forms.stock || []).filter(i => i.product && i.product.trim() !== '');
                const setStockForm = (items) => setForms({ ...forms, stock: items });
                const handleAddStock = (n) => { const ex = stockItems.find(i => i.product === n); if (ex) setStockForm(stockItems.map(i => i.product === n ? { ...i, qty: Number(i.qty) + 1 } : i)); else setStockForm([...stockItems, { product: n, qty: 1 }]); playSound('click'); };
                const handleUpdateStockQty = (n, q) => setStockForm(stockItems.map(i => i.product === n ? { ...i, qty: Math.max(1, Number(q)) } : i));
                const handleRemoveStock = (n) => setStockForm(stockItems.filter(i => i.product !== n));
                const totalStock = stockItems.reduce((a, c) => a + Number(c.qty), 0);
                const allowed = ['plats_principaux', 'desserts', 'boissons', 'alcools'].filter(c => data?.productsByCategory?.[c]);
                const catDisplay = allowed.includes(activeStockCat) ? activeStockCat : allowed[0];
                const catLabel = c => c === 'plats_principaux' ? 'Plats' : c.charAt(0).toUpperCase() + c.slice(1);
                const catIcon = c => ({ plats_principaux: '🍔', desserts: '🍰', boissons: '🥤', alcools: '🍷' }[c] || '🍳');
                return (
                  <div className="fade-in" style={{ display: 'flex', gap: 28, height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
                    <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
                      <div style={{ flexShrink: 0 }}>
                        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Terminal <span style={{ color: 'var(--success)', fontStyle: 'italic' }}>Cuisine</span></h1>
                        <p style={{ color: 'var(--txt3)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>Déclaration de production</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, flexShrink: 0 }}>
                        {allowed.map(c => <button key={c} onClick={() => { setActiveStockCat(c); playSound('click'); }} style={{ padding: '10px 22px', borderRadius: '12px', fontWeight: 500, fontSize: '.82rem', cursor: 'pointer', transition: '.2s', textTransform: 'uppercase', whiteSpace: 'nowrap', background: catDisplay === c ? 'rgba(74,222,128,0.15)' : 'var(--glass)', color: catDisplay === c ? '#4ADE80' : 'var(--txt2)', border: `1px solid ${catDisplay === c ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`, fontFamily: 'var(--sans)' }}>{catLabel(c)}</button>)}
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, alignContent: 'start', paddingRight: 8, paddingBottom: 16 }}>
                        {(data?.productsByCategory?.[catDisplay] || []).map(prod => (
                          <button key={prod} onClick={() => handleAddStock(prod)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all .15s', minHeight: '120px', fontFamily: 'var(--sans)' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)'; }} onMouseDown={e => e.currentTarget.style.transform = 'scale(.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <div style={{ fontSize: '2rem' }}>{catIcon(catDisplay)}</div>
                            <div style={{ fontSize: '.78rem', fontWeight: 500, color: 'var(--txt)', textAlign: 'center', lineHeight: 1.3 }}>{prod}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lux-card" style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '28px' }}>
                      <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontSize: '1.8rem' }}>🍳</div>
                        <div><h2 style={{ fontFamily: 'var(--serif)', margin: 0, color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>La Fournée</h2><div style={{ color: 'var(--success)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>Prête à déclarer</div></div>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stockItems.length === 0 ? <div style={{ textAlign: 'center', padding: '50px 0', opacity: .2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍽</div><div style={{ fontWeight: 500 }}>Aucun produit</div></div> :
                          stockItems.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass)', padding: '10px 14px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                              <input type="number" value={item.qty} onChange={e => handleUpdateStockQty(item.product, e.target.value)} style={{ width: 60, height: 40, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--success)', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', outline: 'none', fontFamily: 'var(--sans)' }} min="1" />
                              <div style={{ flex: 1, fontSize: '.85rem', fontWeight: 500, color: 'var(--txt)' }}>{item.product}</div>
                              <button onClick={() => { playSound('error'); handleRemoveStock(item.product); }} style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(248,113,113,0.08)', color: 'var(--error)', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✖</button>
                            </div>
                          ))}
                      </div>
                      <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                          <span style={{ fontSize: '.72rem', color: 'var(--txt3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Total unités</span>
                          <span style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{totalStock}</span>
                        </div>
                        <button disabled={sending || stockItems.length === 0} onClick={() => send('sendProduction', { items: stockItems })} style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: (sending || stockItems.length === 0) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #4ADE80, #16A34A)', color: (sending || stockItems.length === 0) ? 'var(--txt3)' : '#0a1f0a', fontSize: '.9rem', fontWeight: 700, cursor: (sending || stockItems.length === 0) ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: (sending || stockItems.length === 0) ? 'none' : '0 8px 24px rgba(74,222,128,0.2)', transition: '.25s' }}>
                          {sending ? 'Déclaration...' : '✓ Valider la production'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ─── ENTERPRISE ─── */}
              {currentTab === 'enterprise' && (() => {
                const entForm = forms.enterprise || { items: [], company: '' };
                const itemsList = (entForm.items || []).filter(i => i.product && i.product.trim() !== '');
                const setEntForm = (d) => setForms({ ...forms, enterprise: d });
                const handleAddProduct = (n) => { const ex = itemsList.find(i => i.product === n); if (ex) setEntForm({ ...entForm, items: itemsList.map(i => i.product === n ? { ...i, qty: Number(i.qty) + 1 } : i) }); else setEntForm({ ...entForm, items: [...itemsList, { product: n, qty: 1 }] }); playSound('click'); };
                const handleUpdateQty = (n, q) => setEntForm({ ...entForm, items: itemsList.map(i => i.product === n ? { ...i, qty: Math.max(1, Number(q)) } : i) });
                const handleRemoveProduct = (n) => setEntForm({ ...entForm, items: itemsList.filter(i => i.product !== n) });
                const totalItems = itemsList.reduce((a, c) => a + Number(c.qty), 0);
                const allowed = ['plats_principaux', 'boissons', 'desserts', 'alcools'].filter(c => data?.productsByCategory?.[c]);
                const catDisplay = allowed.includes(activeCat) ? activeCat : allowed[0];
                const catLabel = c => c === 'plats_principaux' ? 'Plats' : c.charAt(0).toUpperCase() + c.slice(1);
                const catIcon = c => ({ plats_principaux: '🍔', desserts: '🍰', boissons: '🥤', alcools: '🍷' }[c] || '📦');
                return (
                  <div className="fade-in" style={{ display: 'flex', gap: 28, height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
                    <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
                      <div style={{ flexShrink: 0 }}>
                        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Préparation <span style={{ color: '#F59E0B', fontStyle: 'italic' }}>Pro</span></h1>
                        <p style={{ color: 'var(--txt3)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>Terminal logistique entreprise</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, flexShrink: 0 }}>
                        {allowed.map(c => <button key={c} onClick={() => { setActiveCat(c); playSound('click'); }} style={{ padding: '10px 22px', borderRadius: '12px', fontWeight: 500, fontSize: '.82rem', cursor: 'pointer', transition: '.2s', textTransform: 'uppercase', whiteSpace: 'nowrap', background: catDisplay === c ? 'rgba(245,158,11,0.12)' : 'var(--glass)', color: catDisplay === c ? '#F59E0B' : 'var(--txt2)', border: `1px solid ${catDisplay === c ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`, fontFamily: 'var(--sans)' }}>{catLabel(c)}</button>)}
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, alignContent: 'start', paddingRight: 8, paddingBottom: 16 }}>
                        {(data?.productsByCategory?.[catDisplay] || []).map(prod => (
                          <button key={prod} onClick={() => handleAddProduct(prod)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all .15s', minHeight: '120px', fontFamily: 'var(--sans)' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)'; }} onMouseDown={e => e.currentTarget.style.transform = 'scale(.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <div style={{ fontSize: '2rem' }}>{catIcon(catDisplay)}</div>
                            <div style={{ fontSize: '.78rem', fontWeight: 500, color: 'var(--txt)', textAlign: 'center', lineHeight: 1.3 }}>{prod}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lux-card" style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '28px' }}>
                      <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                        <label style={{ fontSize: '.7rem', color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, display: 'block' }}>Entreprise cliente</label>
                        <input type="text" className="inp" placeholder="Nom de l'entreprise" value={entForm.company || entForm.name || ''} onChange={e => setEntForm({ ...entForm, company: e.target.value })} style={{ marginBottom: 0, height: 50 }} />
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {itemsList.length === 0 ? <div style={{ textAlign: 'center', padding: '50px 0', opacity: .2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛒</div><div style={{ fontWeight: 500 }}>Chariot vide</div></div> :
                          itemsList.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass)', padding: '10px 14px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                              <input type="number" value={item.qty} onChange={e => handleUpdateQty(item.product, e.target.value)} style={{ width: 60, height: 40, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '10px', color: '#F59E0B', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', outline: 'none', fontFamily: 'var(--sans)' }} min="1" />
                              <div style={{ flex: 1, fontSize: '.85rem', fontWeight: 500, color: 'var(--txt)' }}>{item.product}</div>
                              <button onClick={() => { playSound('error'); handleRemoveProduct(item.product); }} style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(248,113,113,0.08)', color: 'var(--error)', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✖</button>
                            </div>
                          ))}
                      </div>
                      <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                          <span style={{ fontSize: '.72rem', color: 'var(--txt3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Total unités</span>
                          <span style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{totalItems}</span>
                        </div>
                        <button disabled={sending || itemsList.length === 0 || (!entForm.company && !entForm.name)} onClick={() => send('sendEntreprise', entForm)} style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: (sending || itemsList.length === 0 || (!entForm.company && !entForm.name)) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #F59E0B, #B45309)', color: (sending || itemsList.length === 0 || (!entForm.company && !entForm.name)) ? 'var(--txt3)' : '#0e0a00', fontSize: '.9rem', fontWeight: 700, cursor: (sending || itemsList.length === 0 || (!entForm.company && !entForm.name)) ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '1px', transition: '.25s', boxShadow: (sending || itemsList.length === 0 || (!entForm.company && !entForm.name)) ? 'none' : '0 8px 24px rgba(245,158,11,0.2)' }}>
                          {sending ? 'Expédition...' : '✓ Valider la commande'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ─── PARTNERS ─── */}
              {currentTab === 'partners' && (() => {
                const selectedCompany = forms.partner.company;
                const selectedBenef = forms.partner.benef;
                const limits = selectedCompany ? data.partners?.companies?.[selectedCompany]?.limits : null;
                const isVIP = selectedCompany && !limits;
                const logs = data.partnerLogs || [];
                const now = new Date();
                const parisTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
                const todayStr = parisTime.toISOString().split('T')[0];
                const currentDayIndex = parisTime.getDay() || 7;
                const d = new Date(parisTime); d.setHours(-24 * (currentDayIndex - 1));
                const startOfWeekStr = d.toISOString().split('T')[0];
                let takenDay = 0, takenWeek = 0;
                const userLogsThisWeek = logs.filter(row => row[1] === selectedCompany && row[2] === selectedBenef && row[0] >= startOfWeekStr).reverse();
                userLogsThisWeek.forEach(row => { const qty = parseInt(row[4]) || 0; if (row[0] === todayStr) takenDay += qty; takenWeek += qty; });
                let maxDay = null, maxWeek = null, availableQty = 9999;
                if (selectedCompany && limits) {
                  maxDay = limits.day; maxWeek = limits.week;
                  if (limits.dynamicRule) { if (currentDayIndex === 1 || currentDayIndex === 2) maxDay = 5; else { const taken = takenWeek - takenDay; maxDay = maxWeek ? Math.max(0, maxWeek - taken) : 9999; } }
                  const rDay = maxDay !== null ? Math.max(0, maxDay - takenDay) : 9999;
                  const rWeek = maxWeek !== null ? Math.max(0, maxWeek - takenWeek) : 9999;
                  availableQty = Math.min(rDay, rWeek);
                }
                const currentQty = forms.partner.items.reduce((s, i) => s + Number(i.qty), 0);
                const isOverLimit = selectedCompany && !isVIP && currentQty > availableQty;

                const Gauge = ({ label, taken, max }) => {
                  if (!max) return null;
                  const pct = Math.min(100, (taken / max) * 100);
                  const color = pct >= 100 ? 'var(--error)' : pct >= 75 ? '#F59E0B' : 'var(--success)';
                  const remaining = Math.max(0, max - taken);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.04) ${pct}%)`, border: `1px solid var(--border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <div style={{ width: 78, height: 78, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{remaining}</span>
                          <span style={{ fontSize: '.6rem', color: 'var(--txt3)', fontWeight: 500, textTransform: 'uppercase', marginTop: 2 }}>reste</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
                      <div style={{ fontSize: '.7rem', color, marginTop: 4, fontWeight: 500 }}>{taken} / {max}</div>
                    </div>
                  );
                };

                return (
                  <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, maxWidth: 1100, margin: '0 auto', alignItems: 'stretch' }}>
                    <div className="lux-card" style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', padding: '32px', animation: isOverLimit ? 'pulseGold 2s infinite' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🛂</div>
                        <div><h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, margin: 0, fontSize: '1.1rem', color: '#fff' }}>Contrôle d'accès</h2><div style={{ fontSize: '.65rem', color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 500 }}>Base partenaires</div></div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                        <div style={{ position: 'relative' }}>
                          <span style={{ fontSize: '.65rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2 }}>Société</span>
                          <select className="inp" style={{ marginBottom: 0, height: 52 }} value={forms.partner.company} onChange={e => { const c = e.target.value; setForms({ ...forms, partner: { ...forms.partner, company: c, benef: '', items: [{ menu: data.partners.companies[c].menus[0].name, qty: 1 }] } }); }}>
                            <option value="" disabled>— Choisir une entreprise —</option>
                            {data.partners && Object.keys(data.partners.companies).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div style={{ position: 'relative', opacity: forms.partner.company ? 1 : .35, pointerEvents: forms.partner.company ? 'auto' : 'none', transition: '.3s' }}>
                          <span style={{ fontSize: '.65rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2 }}>Bénéficiaire</span>
                          <select className="inp" style={{ marginBottom: 0, height: 52 }} value={forms.partner.benef} onChange={e => setForms({ ...forms, partner: { ...forms.partner, benef: e.target.value } })}>
                            <option value="" disabled>— Choisir —</option>
                            {forms.partner.company && data.partners?.companies?.[forms.partner.company]?.beneficiaries?.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '18px', padding: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                        {(!selectedCompany || !selectedBenef) ? <div style={{ textAlign: 'center', color: 'var(--txt3)', margin: 'auto', fontSize: '.85rem', fontWeight: 500 }}>En attente d'identification…</div> : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                              <span style={{ fontSize: '.7rem', color: 'var(--txt3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Statut</span>
                              {isVIP ? <span style={{ color: '#0e0a00', background: 'linear-gradient(135deg, var(--gold), #A8852A)', padding: '3px 10px', borderRadius: '8px', fontSize: '.7rem', fontWeight: 700 }}>VIP</span> : <span style={{ color: isOverLimit ? 'var(--error)' : 'var(--success)', background: isOverLimit ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', border: `1px solid ${isOverLimit ? 'var(--error)' : 'var(--success)'}`, padding: '3px 10px', borderRadius: '8px', fontSize: '.7rem', fontWeight: 600 }}>{isOverLimit ? 'Bloqué' : 'Actif'}</span>}
                            </div>
                            {isVIP ? <div style={{ textAlign: 'center', margin: 'auto' }}><div style={{ fontSize: '2.5rem', marginBottom: 10 }}>⚖️</div><div style={{ fontFamily: 'var(--serif)', color: 'var(--gold-light)', fontSize: '1.2rem', fontWeight: 700 }}>Contrat État</div></div> : (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 0' }}>
                                  <Gauge label={limits?.dynamicRule && currentDayIndex > 2 ? "Semaine" : "Jour"} taken={takenDay} max={maxDay} />
                                  {(!limits?.dynamicRule || currentDayIndex <= 2) && maxWeek && <><div style={{ width: 1, height: 60, background: 'var(--border)' }}></div><Gauge label="Semaine" taken={takenWeek} max={maxWeek} /></>}
                                </div>
                                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                                  <div style={{ fontSize: '.65rem', color: 'var(--txt3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Historique semaine</div>
                                  <div style={{ maxHeight: 80, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {userLogsThisWeek.length === 0 ? <div style={{ fontSize: '.72rem', color: 'var(--txt3)', fontStyle: 'italic' }}>Aucun passage.</div> :
                                      userLogsThisWeek.map((log, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', background: 'var(--glass)', padding: '5px 10px', borderRadius: '8px' }}><span style={{ color: 'var(--txt2)' }}>{log[0]}</span><span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>{log[4]}× menus</span></div>)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="lux-card" style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px', opacity: (!selectedCompany || !selectedBenef) ? .35 : 1, pointerEvents: (!selectedCompany || !selectedBenef) ? 'none' : 'auto', transition: '.3s' }}>
                      <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <div><h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, margin: 0, fontSize: '1.1rem', color: '#fff' }}>Terminal commande</h2><div style={{ fontSize: '.7rem', color: 'var(--gold)', fontWeight: 500, marginTop: 3 }}>{currentQty} menu(s)</div></div>
                        <input className="inp" placeholder="N° FACTURE" value={forms.partner.num} onChange={e => setForms({ ...forms, partner: { ...forms.partner, num: e.target.value } })} style={{ marginBottom: 0, width: 140, height: 42, textAlign: 'center', fontSize: '.85rem', fontWeight: 600 }} />
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {forms.partner.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--glass)', padding: '12px 14px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ flex: 1 }}>
                              <select className="inp" style={{ width: '100%', marginBottom: 0, background: 'transparent', border: 'none', padding: 0, fontSize: '.9rem', fontWeight: 500, color: 'var(--txt)', cursor: 'pointer' }} value={item.menu} onChange={e => { const n = [...forms.partner.items]; n[idx].menu = e.target.value; setForms({ ...forms, partner: { ...forms.partner, items: n } }); }}>
                                {selectedCompany && data.partners?.companies?.[selectedCompany]?.menus?.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                              </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid var(--border)', padding: '2px 4px', gap: 6 }}>
                              <button style={{ width: 26, height: 26, borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--txt2)', cursor: 'pointer', fontWeight: 700 }} onClick={() => { const n = [...forms.partner.items]; if (n[idx].qty > 1) { n[idx].qty--; setForms({ ...forms, partner: { ...forms.partner, items: n } }); } }}>-</button>
                              <div style={{ width: 22, textAlign: 'center', fontWeight: 700, color: 'var(--gold-light)', fontSize: '.9rem' }}>{item.qty}</div>
                              <button style={{ width: 26, height: 26, borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--txt2)', cursor: 'pointer', fontWeight: 700, opacity: (!isVIP && currentQty >= availableQty) ? .3 : 1 }} disabled={!isVIP && currentQty >= availableQty} onClick={() => { if (isVIP || currentQty < availableQty) { const n = [...forms.partner.items]; n[idx].qty++; setForms({ ...forms, partner: { ...forms.partner, items: n } }); } }}>+</button>
                            </div>
                            {forms.partner.items.length > 1 && <button style={{ width: 32, height: 32, borderRadius: '10px', background: 'rgba(248,113,113,0.08)', color: 'var(--error)', border: 'none', cursor: 'pointer', fontSize: '1rem' }} onClick={() => { const n = [...forms.partner.items]; n.splice(idx, 1); setForms({ ...forms, partner: { ...forms.partner, items: n } }); }}>×</button>}
                          </div>
                        ))}
                        <button style={{ background: 'transparent', border: '1px dashed var(--border)', color: (!isVIP && currentQty >= availableQty) ? 'var(--txt3)' : 'var(--txt2)', borderRadius: '16px', padding: 14, fontSize: '.85rem', fontWeight: 500, cursor: 'pointer', transition: '.2s', fontFamily: 'var(--sans)' }} disabled={!isVIP && currentQty >= availableQty} onClick={() => { if (isVIP || currentQty < availableQty) { const def = data.partners?.companies?.[selectedCompany]?.menus?.[0]?.name || ''; setForms({ ...forms, partner: { ...forms.partner, items: [...forms.partner.items, { menu: def, qty: 1 }] } }); } }}>+ Ajouter une ligne</button>
                      </div>
                      <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                        <button className="btn-p" style={{ borderRadius: '16px', padding: '18px', fontSize: '.9rem', letterSpacing: '1px', background: isOverLimit ? 'rgba(255,255,255,0.05)' : undefined, color: isOverLimit ? 'var(--txt3)' : undefined, boxShadow: isOverLimit ? 'none' : undefined }} disabled={isOverLimit || !forms.partner.num || !selectedCompany || !selectedBenef || currentQty <= 0 || sending} onClick={() => { playSound('click'); const total = forms.partner.items.reduce((a, c) => a + Number(c.qty), 0); setConfirmModal({ title: "Validation partenaire", msg: `${forms.partner.company} · ${forms.partner.benef} · ${total} menus · Facture #${forms.partner.num}`, action: () => { setConfirmModal(null); send('sendPartnerOrder', forms.partner); } }); }}>
                          {isOverLimit ? '⛔ Quota dépassé' : (!forms.partner.num ? 'Saisir le n° de facture' : 'Valider la commande')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ─── EXPENSES ─── */}
              {currentTab === 'expenses' && (() => {
                const myExpenses = (data.expensesHistory || []).filter(row => row[1] === user).map(row => ({ date: row[0], type: row[2], vehicle: row[3], amount: Number(row[4] || 0), status: row[5] || '⏳ En attente' })).sort((a, b) => new Date(b.date) - new Date(a.date));
                const getWN = (d) => { const date = new Date(d); date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7)); const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1)); return `S${Math.ceil(((date - ys) / 86400000 + 1) / 7)}`; };
                const availableWeeks = [...new Set(myExpenses.map(e => getWN(e.date)))];
                const displayed = expenseWeek === 'Toutes' ? myExpenses : myExpenses.filter(e => getWN(e.date) === expenseWeek);
                let tv = 0, ta = 0, tr = 0;
                displayed.forEach(e => { if (e.status.includes('Validé') || e.status.includes('✅')) tv += e.amount; else if (e.status.includes('Refusé') || e.status.includes('❌')) tr += e.amount; else ta += e.amount; });
                return (
                  <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 28, height: 'calc(100vh - 120px)', overflow: 'hidden', alignItems: 'stretch' }}>
                    <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 18, height: '100%', overflowY: 'auto', paddingRight: 8 }}>
                      <div style={{ flexShrink: 0 }}>
                        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Notes de <span style={{ color: '#60A5FA', fontStyle: 'italic' }}>Frais</span></h1>
                        <p style={{ color: 'var(--txt3)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>Portail de remboursement interne</p>
                      </div>
                      <div className="lux-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px', flexShrink: 0 }}>
                        <div>
                          <label style={{ fontSize: '.7rem', color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, display: 'block' }}>Type d'intervention</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {[{ id: 'Essence', icon: '⛽' }, { id: 'Réparation', icon: '🔧' }, { id: 'Autre', icon: '📄' }].map(k => (
                              <button key={k.id} style={{ flex: 1, padding: '12px 5px', borderRadius: '14px', border: '1px solid', background: forms.expense.kind === k.id ? 'rgba(96,165,250,0.1)' : 'var(--glass)', borderColor: forms.expense.kind === k.id ? '#60A5FA' : 'var(--border)', color: forms.expense.kind === k.id ? '#fff' : 'var(--txt2)', fontWeight: 500, fontSize: '.8rem', cursor: 'pointer', transition: '.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'var(--sans)' }} onClick={() => setForms({ ...forms, expense: { ...forms.expense, kind: k.id } })}>
                                <span style={{ fontSize: '1.3rem' }}>{k.icon}</span>{k.id}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ fontSize: '.65rem', color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2 }}>Véhicule</span>
                          <select className="inp" value={forms.expense.vehicle} onChange={e => setForms({ ...forms, expense: { ...forms.expense, vehicle: e.target.value } })} style={{ marginBottom: 0, height: 52 }}>
                            {data.vehicles?.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <span style={{ fontSize: '.65rem', color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2 }}>Montant</span>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 18, top: 14, fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>$</span>
                            <input className="inp" type="number" placeholder="0.00" value={forms.expense.amount} onChange={e => setForms({ ...forms, expense: { ...forms.expense, amount: e.target.value } })} style={{ height: 52, fontSize: '1.1rem', fontWeight: 600, paddingLeft: 40, color: 'var(--success)', borderColor: forms.expense.amount ? 'var(--success)' : 'var(--border)', marginBottom: 0 }} />
                          </div>
                        </div>
                      </div>
                      <div className="lux-card" style={{ padding: '28px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                          <h3 style={{ margin: 0, fontSize: '.88rem', color: '#fff', fontWeight: 600 }}>📸 Scanner de reçu</h3>
                          <span style={{ fontSize: '.62rem', color: forms.expense.file ? 'var(--success)' : 'var(--error)', background: forms.expense.file ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', padding: '3px 9px', borderRadius: '8px', fontWeight: 600 }}>{forms.expense.file ? 'CHARGÉ' : 'REQUIS'}</span>
                        </div>
                        <div onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => !forms.expense.file && document.getElementById('inpFile').click()} style={{ minHeight: 150, border: `1px dashed ${dragActive ? '#60A5FA' : 'var(--border)'}`, borderRadius: '16px', padding: 18, textAlign: 'center', cursor: forms.expense.file ? 'default' : 'pointer', background: dragActive ? 'rgba(96,165,250,0.04)' : 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '.3s', position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
                          <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                          {!forms.expense.file ? <div><div style={{ fontSize: '2rem', opacity: .4, marginBottom: 8 }}>📄</div><div style={{ fontWeight: 500, color: 'var(--txt)', fontSize: '.88rem' }}>Déposez le ticket ici</div><div style={{ marginTop: 10, fontSize: '.72rem', color: 'var(--txt3)' }}>ou Ctrl + V</div></div> :
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><button style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(248,113,113,0.85)', border: 'none', color: '#fff', borderRadius: '8px', padding: '4px 8px', fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', zIndex: 10 }} onClick={e => { e.stopPropagation(); setForms({ ...forms, expense: { ...forms.expense, file: null } }); }}>✖ Supprimer</button><img src={forms.expense.file} style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} /></div>}
                        </div>
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={() => send('sendExpense', forms.expense)} style={{ background: (!forms.expense.amount || !forms.expense.file) ? undefined : 'linear-gradient(135deg, #60A5FA, #2563EB)', boxShadow: (!forms.expense.amount || !forms.expense.file) ? undefined : '0 8px 24px rgba(96,165,250,0.2)', color: (!forms.expense.amount || !forms.expense.file) ? undefined : '#fff' }}>
                          {sending ? 'Transmission...' : 'Soumettre la demande'}
                        </button>
                      </div>
                    </div>

                    <div className="lux-card" style={{ flex: '1 1 440px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '28px' }}>
                      <div style={{ padding: '24px 28px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', margin: 0 }}>Suivi des remboursements</h2>
                        {availableWeeks.length > 0 && <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 12, paddingBottom: 4 }}>
                          <button style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '.72rem', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', background: expenseWeek === 'Toutes' ? 'var(--gold-dim)' : 'transparent', color: expenseWeek === 'Toutes' ? 'var(--gold-light)' : 'var(--txt2)', fontFamily: 'var(--sans)' }} onClick={() => setExpenseWeek('Toutes')}>Toutes</button>
                          {availableWeeks.map(w => <button key={w} style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '.72rem', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', background: expenseWeek === w ? 'var(--gold-dim)' : 'transparent', color: expenseWeek === w ? 'var(--gold-light)' : 'var(--txt2)', fontFamily: 'var(--sans)' }} onClick={() => setExpenseWeek(w)}>Sem. {w.replace('S', '')}</button>)}
                        </div>}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '16px 24px', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
                        {[{ label: '✅ Validé', val: tv, color: 'var(--success)' }, { label: '⏳ Attente', val: ta, color: '#F59E0B' }, { label: '❌ Refusé', val: tr, color: 'var(--error)' }].map((s, i) => (
                          <div key={i} style={{ background: `${s.color}0d`, border: `1px solid ${s.color}30`, borderRadius: '14px', padding: '12px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '.62rem', color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>${s.val.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {displayed.length === 0 ? <div style={{ textAlign: 'center', opacity: .2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div><div style={{ fontWeight: 500 }}>Aucune demande</div></div> :
                          displayed.map((exp, idx) => {
                            let sc = '#F59E0B'; let sb = 'rgba(245,158,11,0.1)';
                            if (exp.status.includes('Validé') || exp.status.includes('✅')) { sc = 'var(--success)'; sb = 'rgba(74,222,128,0.08)'; }
                            if (exp.status.includes('Refusé') || exp.status.includes('❌')) { sc = 'var(--error)'; sb = 'rgba(248,113,113,0.08)'; }
                            return (
                              <div key={idx} style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border2)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: `1px solid ${sb}` }}>{exp.type === 'Essence' ? '⛽' : exp.type === 'Réparation' ? '🔧' : '📄'}</div>
                                  <div><div style={{ fontWeight: 600, color: '#fff', fontSize: '.88rem' }}>{exp.type}</div><div style={{ fontSize: '.7rem', color: 'var(--txt3)', marginTop: 2 }}>{new Date(exp.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</div></div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>${exp.amount.toLocaleString()}</div>
                                  <div style={{ fontSize: '.62rem', color: sc, background: sb, padding: '3px 8px', borderRadius: '6px', fontWeight: 600, marginTop: 4, display: 'inline-block' }}>{exp.status}</div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ─── GARAGE ─── */}
              {currentTab === 'garage' && (
                <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div><h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Gestion <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Flotte</span></h1><p style={{ color: 'var(--txt3)', fontWeight: 500, fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>Terminal de maintenance</p></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
                    <div className="lux-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{ fontSize: '.65rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2 }}>Véhicule</span>
                        <select className="inp" value={forms.garage.vehicle} onChange={e => setForms({ ...forms, garage: { ...forms.garage, vehicle: e.target.value } })} style={{ height: 56, marginBottom: 0 }}>
                          {data.vehicles?.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {[{ id: 'Entrée', icon: '🅿️', label: 'Ranger', color: 'var(--success)', colorBg: 'rgba(74,222,128,0.12)', colorBorder: 'rgba(74,222,128,0.3)' }, { id: 'Sortie', icon: '🔑', label: 'Sortir', color: 'var(--gold-light)', colorBg: 'var(--gold-dim)', colorBorder: 'var(--border2)' }].map(a => (
                          <button key={a.id} style={{ flex: 1, height: 66, borderRadius: '16px', border: '1px solid', cursor: 'pointer', transition: '.25s', fontSize: '.85rem', fontWeight: 600, background: forms.garage.action === a.id ? a.colorBg : 'var(--glass)', borderColor: forms.garage.action === a.id ? a.colorBorder : 'var(--border)', color: forms.garage.action === a.id ? a.color : 'var(--txt2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--sans)' }} onClick={() => setForms({ ...forms, garage: { ...forms.garage, action: a.id } })}>
                            <span style={{ fontSize: '1.3rem' }}>{a.icon}</span>{a.label} ({a.id})
                          </button>
                        ))}
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 600, fontSize: '.82rem', color: 'var(--txt)' }}>Niveau carburant</span>
                          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 700, color: forms.garage.fuel < 20 ? 'var(--error)' : 'var(--gold-light)' }}>{forms.garage.fuel}%</span>
                        </div>
                        <div style={{ display: 'flex', gap: '3px', height: '40px', marginBottom: 16 }}>
                          {[...Array(20)].map((_, i) => { const isActive = i * 5 < forms.garage.fuel; const color = forms.garage.fuel < 20 ? 'var(--error)' : forms.garage.fuel < 50 ? '#F59E0B' : '#60A5FA'; return <div key={i} style={{ flex: 1, borderRadius: '3px', background: isActive ? color : 'rgba(255,255,255,0.04)', transition: 'all .3s' }} />; })}
                        </div>
                        <input type="range" style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} value={forms.garage.fuel} onChange={e => setForms({ ...forms, garage: { ...forms.garage, fuel: e.target.value } })} />
                      </div>
                      <button className="btn-p" style={{ marginTop: 'auto', padding: '18px', fontSize: '.9rem' }} disabled={sending} onClick={() => send('sendGarage', forms.garage)}>{sending ? 'Transmission...' : 'Valider le mouvement'}</button>
                    </div>
                    <div className="lux-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--txt)', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }}></span>Dernières actions
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
                        {(data.garageHistory || []).length === 0 ? <div style={{ opacity: .2, fontWeight: 500, textAlign: 'center', marginTop: 40 }}>Aucune donnée</div> :
                          data.garageHistory.map((act, i) => (
                            <div key={i} style={{ padding: '14px', borderRadius: '16px', background: 'var(--glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ fontSize: '1.2rem', width: 42, height: 42, borderRadius: '12px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${act[3] === 'Entrée' ? 'rgba(74,222,128,0.2)' : 'var(--border2)'}` }}>{act[3] === 'Entrée' ? '🅿️' : '🔑'}</div>
                              <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act[2]}</div>
                                <div style={{ fontSize: '.7rem', color: 'var(--txt3)' }}>{act[1].split(' ')[0]} · <span style={{ color: act[3] === 'Entrée' ? 'var(--success)' : 'var(--gold-light)' }}>{act[3]}</span></div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--serif)', fontSize: '.95rem', fontWeight: 700, color: '#fff' }}>{act[4]}%</div>
                                <div style={{ fontSize: '.6rem', color: 'var(--txt3)', fontWeight: 500 }}>essence</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── DIRECTORY ─── */}
              {currentTab === 'directory' && (() => {
                const getRoleStyle = (role) => {
                  const r = (role || '').toLowerCase();
                  if (r.includes('pdg')) return { color: '#FBBF24', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.08)' };
                  if (r.includes('cceo')) return { color: '#A78BFA', border: 'rgba(167,139,250,0.25)', glow: 'rgba(167,139,250,0.08)' };
                  if (r.includes('general manager')) return { color: '#60A5FA', border: 'rgba(96,165,250,0.25)', glow: 'rgba(96,165,250,0.08)' };
                  if (r.includes('shift leader')) return { color: '#4ADE80', border: 'rgba(74,222,128,0.25)', glow: 'rgba(74,222,128,0.08)' };
                  return { color: 'var(--gold-light)', border: 'var(--border)', glow: 'rgba(212,175,55,0.05)' };
                };
                return (
                  <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 22 }}>
                      <div><h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, margin: 0 }}>Annuaire</h2><p style={{ color: 'var(--txt3)', fontWeight: 500, textTransform: 'uppercase', fontSize: '.7rem', letterSpacing: '2px', marginTop: 6 }}>{data.employeesFull.length} employés actifs</p></div>
                      <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '320px' }}>
                        <input className="inp" placeholder="Rechercher…" style={{ paddingLeft: 44, marginBottom: 0, height: 46, borderRadius: '14px' }} value={search} onChange={e => setSearch(e.target.value)} />
                        <span style={{ position: 'absolute', left: 16, top: 13, opacity: .4 }}>🔍</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                      {data.employeesFull.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || (e.role && e.role.toLowerCase().includes(search.toLowerCase()))).map(e => {
                        const s = getRoleStyle(e.role);
                        return (
                          <div key={e.id} style={{ background: `linear-gradient(135deg, var(--bg2), var(--bg3))`, border: `1px solid ${s.border}`, borderRadius: '22px', padding: '24px', position: 'relative', overflow: 'hidden', transition: 'all .3s', cursor: 'default' }} onMouseOver={ev => ev.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={ev => ev.currentTarget.style.transform = 'none'}>
                            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: s.glow, filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
                              <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'rgba(0,0,0,0.4)', border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{e.name.charAt(0)}</div>
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                                <div style={{ color: s.color, fontSize: '.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>{e.role || 'Food Service'}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '10px 14px', borderRadius: '12px', marginBottom: 16, border: '1px solid var(--border)' }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '.62rem', color: 'var(--txt3)', textTransform: 'uppercase', fontWeight: 500 }}>Ventes</div>
                                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--success)', fontSize: '.95rem', marginTop: 2 }}>${Math.round(e.ca || 0).toLocaleString()}</div>
                              </div>
                              <div style={{ width: 1, background: 'var(--border)' }}></div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '.62rem', color: 'var(--txt3)', textTransform: 'uppercase', fontWeight: 500 }}>Factures</div>
                                <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: '#fff', fontSize: '.95rem', marginTop: 2 }}>{e.invoiceCount || 0}</div>
                              </div>
                            </div>
                            <button style={{ width: '100%', background: 'var(--glass)', border: '1px solid var(--border)', color: 'var(--txt)', borderRadius: '12px', padding: '10px', fontSize: '.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: '.2s', fontFamily: 'var(--sans)' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--gold-light)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--txt)'; }} onClick={() => copyToClipboard(e.phone)}>
                              📱 {e.phone || 'Aucun numéro'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ─── PERFORMANCE ─── */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                  {[
                    { title: '🏆 Top vendeurs', key: 'ca', fmt: v => `$${Math.round(v).toLocaleString()}`, color: 'var(--gold-light)', label: 'Chiffre d\'affaires' },
                    { title: '🍳 Top cuistos', key: 'stock', fmt: v => v?.toLocaleString?.() ?? v, color: 'var(--success)', label: 'Articles préparés' },
                    { title: '🧾 Top factures', key: 'invoiceCount', fmt: v => `${v || 0} factures`, color: '#60A5FA', label: 'Factures validées' }
                  ].map((cat, ci) => (
                    <div key={ci} className="lux-card" style={{ padding: '28px' }}>
                      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: 28, fontWeight: 700, fontSize: '1.2rem' }}>{cat.title}</h2>
                      {[...data.employeesFull].sort((a, b) => (b[cat.key] || 0) - (a[cat.key] || 0)).slice(0, 10).map((e, i) => {
                        const maxVal = Math.max(...data.employeesFull.map(x => x[cat.key] || 0), 1);
                        const val = e[cat.key] || 0;
                        return (
                          <div key={i} style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: 6 }}>
                              <span style={{ display: 'flex', gap: 10, color: 'var(--txt)' }}>
                                <b style={{ color: i === 0 ? cat.color : 'var(--txt3)', fontFamily: 'var(--serif)', fontSize: '1rem' }}>#{i + 1}</b>{e.name}
                              </span>
                              <b style={{ color: i === 0 ? cat.color : 'var(--txt2)', fontFamily: 'var(--serif)' }}>{cat.fmt(val)}</b>
                            </div>
                            <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: i === 0 ? `linear-gradient(90deg, ${cat.color}, transparent)` : 'rgba(255,255,255,0.1)', width: (val / maxVal * 100) + '%', borderRadius: 4, transition: 'width .6s' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* ─── RULES ─── */}
              {currentTab === 'rules' && (
                <div className="center-box fade-in">
                  <div className="form-ui" style={{ maxWidth: 820, width: '100%', padding: '40px 48px', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '2.2rem', letterSpacing: '.5px', color: '#fff', lineHeight: 1.2 }}>Règlement Intérieur</h2>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 }}>
                        <div style={{ width: 40, height: 1, background: 'var(--gold-dim)' }}></div>
                        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '.95rem' }}>Hen House · San Andreas</span>
                        <div style={{ width: 40, height: 1, background: 'var(--gold-dim)' }}></div>
                      </div>
                    </div>
                    <div style={{ overflowY: 'auto', paddingRight: 16, flex: 1, color: 'var(--txt2)', lineHeight: 1.75, fontSize: '.9rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid var(--border2)', padding: '18px 22px', borderRadius: '0 14px 14px 0', marginBottom: 28 }}>
                        <h4 style={{ fontFamily: 'var(--serif)', color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: '1.05rem' }}>Préambule</h4>
                        <p>Le présent règlement définit les règles applicables à l'ensemble des employés du Hen House, garantissant un environnement professionnel, sécurisé et conforme aux normes en vigueur à San Andreas. Toute personne employée reconnaît l'avoir lu et s'engage à le respecter.</p>
                      </div>
                      {[
                        { title: 'I. Temps de travail', content: 'Les employés respectent les horaires établis. Un minimum de 8h/semaine est requis. Tout retard ou absence doit être signalé 1h avant le service. Absence injustifiée >2 jours = sanction.' },
                        { title: 'II. Tenue professionnelle', content: 'Port de la tenue officielle obligatoire. Cheveux propres et attachés, ongles courts, bijoux limités. La présentation soignée représente l\'image de l\'établissement.' },
                        { title: 'III. Hygiène & sanitaire', content: 'Lavage des mains obligatoire avant service, après pause, argent, ou contact non-alimentaire. Port de gants alimentaires lors de toute préparation. Interdiction de travailler malade, de fumer en cuisine, ou de consommer des denrées personnelles en zone de préparation.' },
                        { title: 'IV. Comportement & conduite', content: 'Attitude respectueuse envers clients, collègues et hiérarchie. Interdiction formelle : insultes, discriminations, alcool ou drogue, activités illégales, téléphone personnel pendant le service. Le coffre est réservé à l\'usage professionnel. 10 menus/semaine par employé, déposés le dimanche soir.' },
                        { title: 'V–IX. Confidentialité, sécurité, matériel, congés, rémunération', content: 'Les données clients et internes sont strictement confidentielles. Respectez les consignes de sécurité. Le matériel est réservé à l\'usage professionnel. Demandes de congés à l\'avance. Salaires versés selon les règles HH.' },
                        { title: 'X–XIII. Discipline, hiérarchie, image, modifications', content: 'Sanctions proportionnelles : avertissement verbal/écrit, mise à pied, rétrogradation, licenciement. Les décisions hiérarchiques sont immédiatement applicables. La direction se réserve le droit de modifier ce règlement à tout moment.' },
                      ].map((sec, i) => (
                        <div key={i}>
                          <h3 style={{ fontFamily: 'var(--serif)', color: 'var(--gold-light)', fontWeight: 700, fontSize: '1rem', marginTop: 24, marginBottom: 10, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{sec.title}</h3>
                          <p style={{ marginBottom: 8 }}>{sec.content}</p>
                        </div>
                      ))}
                      <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', padding: '28px', borderRadius: '18px', marginTop: 28, marginBottom: 28 }}>
                        <h3 style={{ fontFamily: 'var(--serif)', color: '#F87171', fontWeight: 700, fontSize: '1.3rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>⚠️ XIV. Clause exceptionnelle – TacoVans</h3>
                        <p style={{ color: '#fff', fontWeight: 500, marginBottom: 16, fontSize: '.88rem' }}>Clause spécifique à tout employé utilisant un TacoVan Hen House.</p>
                        <p style={{ marginBottom: 10 }}><strong style={{ color: '#F87171' }}>Lieux interdits :</strong> devant les restaurants, supérettes LTD, boîtes de nuit et bars.</p>
                        <p style={{ marginBottom: 10 }}><strong style={{ color: '#F87171' }}>Autorisations :</strong> toute installation nécessite l'accord préalable du responsable du lieu. Refus = départ immédiat.</p>
                        <p><strong style={{ color: '#F87171' }}>Sanctions :</strong> retrait du véhicule, suspension immédiate, jusqu'au licenciement.</p>
                        <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'var(--serif)', color: '#F87171', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid rgba(248,113,113,0.2)', paddingTop: 16 }}>Aucune tolérance.</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border)', color: 'var(--txt3)' }}>
                        <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--txt)', fontSize: '1.1rem', marginBottom: 6 }}>Fait à San Andreas</div>
                        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '1rem' }}>La Direction du Hen House</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── PROFILE ─── */}
              {currentTab === 'profile' && myProfile && (() => {
                const getRoleStyle = (role) => {
                  const r = (role || '').toLowerCase();
                  if (r.includes('pdg')) return { color: '#FBBF24', border: '#FBBF24' };
                  if (r.includes('cceo')) return { color: '#A78BFA', border: '#A78BFA' };
                  if (r.includes('general manager')) return { color: '#60A5FA', border: '#60A5FA' };
                  if (r.includes('shift leader')) return { color: '#4ADE80', border: '#4ADE80' };
                  return { color: 'var(--gold-light)', border: 'var(--gold)' };
                };
                const rStyle = getRoleStyle(myProfile.role);
                const myInvoices = (data.invoicesHistory || []).filter(row => row[1] === user).map(row => ({ date: row[0], num: row[2], amount: row[3], details: row[4] })).sort((a, b) => new Date(b.date) - new Date(a.date));
                const getWN = (d) => { const date = new Date(d); date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7)); const ys = new Date(Date.UTC(date.getUTCFullYear(), 0, 1)); return `S${Math.ceil(((date - ys) / 86400000 + 1) / 7)}`; };
                const availableWeeks = [...new Set(myInvoices.map(inv => getWN(inv.date)))];
                const grouped = myInvoices.reduce((acc, inv) => { const w = getWN(inv.date); if (!acc[w]) acc[w] = []; acc[w].push(inv); return acc; }, {});
                const weeksToDisplay = profileWeek === 'Toutes' ? Object.keys(grouped).sort((a, b) => b.localeCompare(a)) : [profileWeek];
                return (
                  <div className="fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 28, height: 'calc(100vh - 120px)', alignItems: 'stretch' }}>
                    <div className="lux-card" style={{ flex: '1 1 320px', maxWidth: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ height: 4, background: `linear-gradient(90deg, transparent, ${rStyle.color}, transparent)`, flexShrink: 0 }}></div>
                      <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 26, flex: 1, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: 96, height: 96, borderRadius: '30px', background: 'rgba(0,0,0,0.5)', border: `1.5px solid ${rStyle.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 700, color: '#fff', marginBottom: 18 }}>{user.charAt(0)}</div>
                          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0 }}>{user}</h1>
                          <div style={{ marginTop: 12, background: `${rStyle.color}18`, border: `1px solid ${rStyle.color}40`, color: rStyle.color, padding: '5px 14px', borderRadius: '100px', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>{myProfile.role || 'Employé'}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '14px', textAlign: 'center', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '.62rem', color: 'var(--txt3)', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>Ventes</div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>${Math.round(myProfile.ca).toLocaleString()}</div>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '14px', textAlign: 'center', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '.62rem', color: 'var(--txt3)', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>Factures</div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{myProfile.invoiceCount || 0}</div>
                          </div>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))', border: '1px solid var(--border2)', borderRadius: '20px', padding: '24px', textAlign: 'center', marginTop: 'auto' }}>
                          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '.85rem', marginBottom: 8 }}>Salaire estimé</div>
                          <div style={{ fontFamily: 'var(--serif)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--gold-light)' }}>${Math.round(myProfile.salary || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="lux-card" style={{ flex: '2 1 480px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ padding: '26px 32px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.3rem', color: '#fff', margin: 0 }}>Relevé des ventes</h2>
                        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 12, paddingBottom: 4 }}>
                          <button style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '.72rem', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', background: profileWeek === 'Toutes' ? 'var(--gold-dim)' : 'transparent', color: profileWeek === 'Toutes' ? 'var(--gold-light)' : 'var(--txt2)', fontFamily: 'var(--sans)' }} onClick={() => setProfileWeek('Toutes')}>Toutes</button>
                          {availableWeeks.map(w => <button key={w} style={{ padding: '5px 12px', borderRadius: '10px', fontSize: '.72rem', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer', background: profileWeek === w ? 'var(--gold-dim)' : 'transparent', color: profileWeek === w ? 'var(--gold-light)' : 'var(--txt2)', fontFamily: 'var(--sans)' }} onClick={() => setProfileWeek(w)}>Sem. {w.replace('S', '')}</button>)}
                        </div>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 32px 32px' }}>
                        {weeksToDisplay.map(week => (
                          <div key={week} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: '.68rem', fontWeight: 600, color: 'var(--txt3)', margin: '18px 0 8px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Semaine {week.replace('S', '')}</div>
                            {grouped[week]?.map((inv, idx) => (
                              <div key={idx} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: '.2s' }} onClick={() => { playSound('click'); setExpandedInv(inv); }} onMouseOver={e => e.currentTarget.style.background = 'var(--glass)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }}></div>
                                  <div style={{ width: 72, fontSize: '.78rem', color: 'var(--txt3)', fontWeight: 500 }}>{new Date(inv.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</div>
                                  <div style={{ fontWeight: 600, color: 'var(--txt)', fontSize: '.88rem' }}>{inv.num}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)' }}>+${Number(inv.amount).toLocaleString()}</div>
                                  <div style={{ fontSize: '.65rem', color: 'var(--txt3)', background: 'var(--glass)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>ticket</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    {expandedInv && typeof expandedInv === 'object' && (
                      <div className="modal-overlay" onClick={() => setExpandedInv(null)}>
                        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', width: 300, borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                          <div style={{ padding: '28px 24px 20px', borderBottom: '1px dashed var(--border)', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '2px' }}>HEN HOUSE</div>
                            <div style={{ fontSize: '.72rem', color: 'var(--txt3)', fontFamily: 'monospace', marginTop: 4 }}>#{expandedInv.num} · {user}</div>
                          </div>
                          <div style={{ padding: '20px 24px', fontFamily: 'monospace', color: 'var(--txt2)', fontSize: '.82rem', maxHeight: 250, overflowY: 'auto' }}>
                            {expandedInv.details ? expandedInv.details.split(',').map((item, i) => { const [qty, ...nameParts] = item.trim().split('x '); return <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>{qty}× {nameParts.join('x ').substring(0, 20)}</span><span style={{ color: 'var(--success)' }}>✓</span></div>; }) : 'Détails indisponibles.'}
                          </div>
                          <div style={{ padding: '18px 24px', borderTop: '1px dashed var(--border)', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>${Number(expandedInv.amount).toLocaleString()}</div>
                          </div>
                          <button style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--gold), #A8852A)', border: 'none', fontWeight: 700, cursor: 'pointer', color: '#0e0a00', fontFamily: 'var(--sans)', fontSize: '.85rem', letterSpacing: '1px', textTransform: 'uppercase' }} onClick={() => setExpandedInv(null)}>Fermer</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ─── SUPPORT ─── */}
              {currentTab === 'support' && (() => {
                const CATS = [
                  { id: 'stock', icon: '📦', label: 'Problème de stock', color: 'var(--success)', hint: 'Quel produit manque ?' },
                  { id: 'materiel', icon: '🛠️', label: 'Panne matériel', color: '#F59E0B', hint: 'Quel équipement ? Décrivez la panne.' },
                  { id: 'rh', icon: '👥', label: 'Problème RH', color: '#A78BFA', hint: 'Rapport confidentiel.' },
                  { id: 'urgence', icon: '🚨', label: 'Urgence absolue', color: 'var(--error)', hint: 'PRIORITÉ MAXIMALE. Décrivez immédiatement.' }
                ];
                const activeSupportCat = CATS.find(c => c.label === forms.support.sub) || CATS[0];
                return (
                  <div className="center-box fade-in">
                    <div className="form-ui" style={{ maxWidth: 700, padding: '40px 48px', borderTop: `3px solid ${activeSupportCat.color}`, transition: 'border-color .3s' }}>
                      <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '2rem', color: '#fff', marginBottom: 6 }}>Centre de communication</h2>
                        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '.9rem' }}>Ligne directe · Direction Hen House</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
                        {CATS.map(cat => {
                          const isActive = activeSupportCat.id === cat.id;
                          return (
                            <div key={cat.id} onClick={() => { playSound('click'); setForms({ ...forms, support: { ...forms.support, sub: cat.label } }); }} style={{ background: isActive ? `${cat.color}10` : 'var(--glass)', border: `1px solid ${isActive ? cat.color + '50' : 'var(--border)'}`, borderRadius: '16px', padding: '18px 10px', cursor: 'pointer', transition: 'all .25s', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
                              <span style={{ fontSize: '1.6rem', filter: isActive ? 'none' : 'grayscale(.7) opacity(.5)', transition: '.3s' }}>{cat.icon}</span>
                              <div style={{ fontSize: '.78rem', fontWeight: 600, color: isActive ? '#fff' : 'var(--txt3)', lineHeight: 1.3 }}>{cat.label}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ position: 'relative', marginBottom: 24 }}>
                        <span style={{ fontSize: '.65rem', color: activeSupportCat.color, fontWeight: 600, textTransform: 'uppercase', position: 'absolute', top: -8, left: 12, background: 'var(--bg2)', padding: '0 6px', zIndex: 2, transition: 'color .3s' }}>Détails du rapport</span>
                        <textarea className="inp" style={{ height: 160, resize: 'none', padding: '22px 18px', fontSize: '.88rem', lineHeight: 1.7, borderColor: forms.support.msg ? activeSupportCat.color : 'var(--border)', transition: 'border-color .3s' }} placeholder={activeSupportCat.hint} value={forms.support.msg} onChange={e => setForms({ ...forms, support: { ...forms.support, msg: e.target.value } })}></textarea>
                      </div>
                      <button className="btn-p" disabled={sending || !forms.support.msg.trim()} onClick={() => send('sendSupport', forms.support)} style={{ background: (!forms.support.msg.trim()) ? undefined : `linear-gradient(135deg, ${activeSupportCat.color}, ${activeSupportCat.color}aa)`, color: (!forms.support.msg.trim()) ? undefined : '#fff', boxShadow: (!forms.support.msg.trim()) ? undefined : `0 8px 24px ${activeSupportCat.color}30`, padding: '18px', fontSize: '.9rem' }}>
                        {sending ? 'Transmission sécurisée...' : `${activeSupportCat.icon} Envoyer le rapport`}
                      </button>
                    </div>
                  </div>
                );
              })()}

            </div>
          </main>

          {/* ─── CART ─── */}
          {currentTab === 'invoices' && (
            <aside className="cart-panel">
              <div className="cart-header">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }}></div>
                <h2 className="cart-title">Ticket client</h2>
                <div style={{ fontSize: '.75rem', color: 'var(--txt3)', fontFamily: 'monospace', marginBottom: 10 }}>#{forms.invoiceNum || '——'}</div>
                <div className="cart-total-display">${total.toLocaleString()}</div>
              </div>

              <div style={{ padding: '14px 16px 0' }}>
                <input className="inp" placeholder="N° FACTURE (requis)" value={forms.invoiceNum} onChange={e => setForms({ ...forms, invoiceNum: e.target.value })} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', borderColor: forms.invoiceNum ? 'var(--border2)' : 'var(--border)', marginBottom: 0, height: 44, fontSize: '.85rem' }} />
              </div>

              <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6 }}>
                {['LIVRAISON SUD', 'LIVRAISON NORD', 'PRIVATISATION'].map(srv => (
                  <button key={srv} onClick={() => { playSound('click'); const ci = cart.find(i => i.name === srv); if (ci) setCart(cart.map(x => x.name === srv ? { ...x, qty: x.qty + 1 } : x)); else setCart([...cart, { name: srv, qty: 1, pu: data.prices[srv] || 0 }]); }} style={{ flex: 1, padding: '7px 2px', fontSize: '.62rem', fontWeight: 600, background: 'var(--glass)', color: 'var(--txt2)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', transition: '.2s', textTransform: 'uppercase', fontFamily: 'var(--sans)' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold-light)'; e.currentTarget.style.borderColor = 'var(--border2)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.color = 'var(--txt2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    {srv === 'PRIVATISATION' ? '🍾' : srv.includes('SUD') ? '🚚 Sud' : '✈️ Nord'}
                  </button>
                ))}
              </div>

              <div className="cart-items">
                {cart.length === 0 ? <div style={{ textAlign: 'center', marginTop: 50, opacity: .2, fontStyle: 'italic', fontSize: '.88rem' }}>Panier vide</div> :
                  cart.map((i, idx) => (
                    <div key={idx} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '.82rem', color: 'var(--txt)', lineHeight: 1.3 }}>{i.name}</div>
                        <div style={{ color: 'var(--gold-light)', fontSize: '.7rem', fontFamily: 'var(--serif)', fontWeight: 600, marginTop: 2 }}>${i.pu} / u.</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => { const n = [...cart]; if (n[idx].qty > 1) n[idx].qty--; else removeFromCart(idx); setCart(n); }}>−</button>
                          <input className="qty-input" type="number" value={i.qty} onChange={e => updateCartQty(idx, e.target.value)} />
                          <button className="qty-btn" onClick={() => { const n = [...cart]; n[idx].qty++; setCart(n); }}>+</button>
                        </div>
                        <button className="del-btn" onClick={() => removeFromCart(idx)}>🗑</button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 500, color: 'var(--txt3)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold-light)' }}>${total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '10px 14px', borderRadius: '12px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', opacity: cart.length === 0 ? .3 : 1 }}>
                  <span style={{ fontWeight: 500, color: 'var(--success)', fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Gain estimé</span>
                  <span style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem' }}>${gainEstime.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-p" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--txt)', boxShadow: 'none', flex: 1, fontSize: '.8rem' }} onClick={requestClearCart}>Vider</button>
                  <button className="btn-p" style={{ flex: 3, fontSize: '.85rem' }} disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={() => send('sendFactures', { invoiceNumber: forms.invoiceNum, items: cart.map(x => ({ desc: x.name, qty: x.qty })) })}>
                    Encaisser 💰
                  </button>
                </div>
              </div>
            </aside>
          )}
        </>
      )}

      {/* ─── TOAST ─── */}
      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? 'rgba(30,5,5,0.95)' : toast.s === 'success' ? 'rgba(5,25,10,0.95)' : 'rgba(20,15,5,0.95)', border: `1px solid ${toast.s === 'error' ? 'rgba(248,113,113,0.35)' : toast.s === 'success' ? 'rgba(74,222,128,0.35)' : 'var(--border2)'}` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: toast.s === 'error' ? 'var(--error)' : toast.s === 'success' ? 'var(--success)' : 'var(--gold)', boxShadow: `0 0 8px ${toast.s === 'error' ? 'var(--error)' : toast.s === 'success' ? 'var(--success)' : 'var(--gold)'}` }}></div>
          <div style={{ fontSize: '.85rem', fontWeight: 500 }}>{toast.m}</div>
        </div>
      )}

      {/* ─── MODAL ─── */}
      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '18px', background: 'var(--gold-dim)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem' }}>⚡</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: '#fff' }}>{confirmModal.title}</h3>
            <p style={{ color: 'var(--txt2)', marginBottom: 28, fontSize: '.88rem', lineHeight: 1.6 }}>{confirmModal.msg}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-p" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--txt)', boxShadow: 'none' }} onClick={() => setConfirmModal(null)}>Annuler</button>
              <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
