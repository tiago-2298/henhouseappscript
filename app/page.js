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
  "Lasagne aux légumes": "https://images.unsplash.com/photo-1514516348920-f5d92839957d?w=400",
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Effiloché de Mouton": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400",
  "Burger Gourmet au Foie Gras": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Nectar Exotique": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
  "Kombucha Citron": "https://images.unsplash.com/photo-1594498653385-d5172b532c00?w=400",
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
  const [confirmModal, setConfirmModal] = useState(null); 

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

  const compressImage = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
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
        notify("📸 CAPTURE DÉTECTÉE", "Le reçu a été ajouté avec succès.", "success");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handlePaste = (event) => {
      if (currentTab !== 'expenses') return;
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          handleFileChange(blob);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [currentTab]);

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
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => Math.round(cart.reduce((a,b)=>a+b.qty*b.pu, 0)), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    // Autorise la chaine vide pour l'édition mais sauvegarde 0 ou le chiffre
    if(val === '') {
        n[idx].qty = '';
        setCart(n);
        return;
    }
    const v = parseInt(val);
    if (!isNaN(v)) {
        n[idx].qty = v;
        setCart(n);
    }
  };
  
  // Fonction pour nettoyer les inputs vides (remettre à 1 ou supprimer) au blur si besoin
  const finalizeCartQty = (idx) => {
      const n = [...cart];
      if(n[idx].qty === '' || n[idx].qty <= 0) n[idx].qty = 1;
      setCart(n);
  };

  const removeFromCart = (idx) => {
      const n = [...cart];
      n.splice(idx, 1);
      setCart(n);
      playSound('click');
  };

  const send = async (action, payload) => {
    if(sending) return; playSound('click'); setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        const m = NOTIF_MESSAGES[action] || { title: "SUCCÈS", msg: "Action validée" };
        notify(m.title, m.msg, "success"); 
        if(action === 'sendFactures') { setCart([]); setForms(prev => ({...prev, invoiceNum: ''})); }
        else if (action === 'sendProduction') { setForms(prev => ({...prev, stock: [{ product: '', qty: 1 }]})); }
        else if (action === 'sendEntreprise') { setForms(prev => ({...prev, enterprise: { name: '', items: [{ product: '', qty: 1 }] }})); }
        else if (action === 'sendPartnerOrder') { setForms(prev => ({...prev, partner: { ...prev.partner, num: '' }})); }
        else if (action === 'sendExpense') { setForms(prev => ({...prev, expense: { ...prev.expense, amount: '', file: null }})); }
        else if (action === 'sendSupport') { setForms(prev => ({...prev, support: { ...prev.support, msg: '' }})); }
        loadData(); 
      } else notify("ÉCHEC ENVOI", j.message || "Erreur", "error");
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  const requestLogout = () => {
    setConfirmModal({
        title: "DÉCONNEXION",
        msg: "Voulez-vous vraiment fermer votre session ?",
        action: () => {
            localStorage.removeItem('hh_user');
            setView('login');
            setConfirmModal(null);
        }
    });
  };

  const requestClearCart = () => {
      if(cart.length === 0) return;
      setConfirmModal({
          title: "VIDER LE PANIER",
          msg: "Cette action supprimera tous les articles. Continuer ?",
          action: () => {
              setCart([]);
              setConfirmModal(null);
              playSound('click');
          }
      });
  };

  // --- SKELETON LOADER SCREEN ---
  if (loading && !data) return (
    <div className="app">
         <style jsx>{`
            .sk-side { width: 260px; height: 95vh; margin: 2.5vh; border-radius: 24px; background: #000; padding: 20px; opacity:0.5; }
            .sk-main { flex: 1; margin: 2.5vh 2.5vh 2.5vh 0; border-radius: 24px; padding: 40px; background: #0f1115; opacity:0.5; }
            .sk-box { background: rgba(255,255,255,0.05); border-radius: 12px; animation: pulse 1.5s infinite; }
            .sk-row { display: flex; gap: 15px; margin-bottom: 20px; }
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }
         `}</style>
         <div className="sk-side">
            <div className="sk-box" style={{height: 60, width: 60, borderRadius: '50%', margin: '0 auto 40px'}} />
            {[1,2,3,4,5,6].map(i => <div key={i} className="sk-box" style={{height: 40, width: '100%', marginBottom: 10}} />)}
         </div>
         <div className="sk-main">
            <div className="sk-box" style={{height: 50, width: 300, marginBottom: 10}} />
            <div className="sk-box" style={{height: 20, width: 200, marginBottom: 40}} />
            <div className="sk-row">
                <div className="sk-box" style={{height: 150, flex: 1}} />
                <div className="sk-box" style={{height: 150, flex: 1}} />
                <div className="sk-box" style={{height: 150, flex: 1}} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:20}}>
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="sk-box" style={{height: 180}} />)}
            </div>
         </div>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { 
            --p: #ff9800; 
            --p-glow: rgba(255, 152, 0, 0.4);
            --bg: #050505; 
            --glass: rgba(20, 20, 24, 0.7); 
            --glass-border: rgba(255, 255, 255, 0.08);
            --txt: #f1f5f9; 
            --muted: #94a3b8; 
            --danger: #ef4444;
            --success: #10b981;
        }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; user-select: none; }
        
        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--p); }

        body { 
            background: #000;
            color: var(--txt); 
            height: 100vh; 
            overflow: hidden; 
            font-size: 14px;
        }

        .app { 
            display: flex; 
            height: 100vh; 
            width: 100vw; 
            padding: 20px;
            gap: 20px;
            background: radial-gradient(circle at top left, #1a1000 0%, #000 40%);
        }

        /* FLOATING SIDEBAR */
        .side { 
            width: 260px; 
            background: var(--glass);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 24px; 
            display: flex; 
            flex-direction: column; 
            z-index: 100; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .nav-l { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            padding: 14px 16px; 
            border-radius: 14px; 
            border: 1px solid transparent; 
            background: transparent; 
            color: var(--muted); 
            cursor: pointer; 
            font-weight: 600; 
            width: 100%; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-size: 0.9rem; 
            margin-bottom: 6px; 
        }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(4px); }
        .nav-l.active { 
            background: rgba(255, 152, 0, 0.1); 
            border-color: rgba(255, 152, 0, 0.2);
            color: var(--p); 
            box-shadow: 0 0 20px rgba(255, 152, 0, 0.1);
            font-weight: 800;
        }
        
        /* MAIN CONTENT GLASS */
        .main { 
            flex: 1; 
            background: var(--glass);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            overflow-y: auto; 
            padding: 40px; 
            position: relative; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* GRID SYSTEM */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        
        /* PRODUCT CARD - MODERN */
        .card { 
            background: rgba(255,255,255,0.02); 
            border: 1px solid var(--glass-border); 
            border-radius: 20px; 
            cursor: pointer; 
            transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            position: relative; 
            overflow: hidden; 
            display: flex;
            flex-direction: column;
        }
        .card:hover { 
            border-color: var(--p); 
            transform: translateY(-8px) scale(1.02); 
            box-shadow: 0 15px 30px rgba(0,0,0,0.5); 
            z-index: 10;
        }
        .card:active { transform: scale(0.98); }
        
        .card-img-container {
            height: 140px;
            width: 100%;
            background: #000;
            position: relative;
        }
        .card-img-container img {
            width: 100%; height: 100%; object-fit: cover;
            transition: 0.5s;
        }
        .card:hover .card-img-container img { transform: scale(1.1); }
        
        .card-info {
            padding: 15px;
            background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        
        .card-qty { 
            position: absolute; top: 10px; right: 10px; 
            background: var(--p); color: #fff; 
            width: 28px; height: 28px; 
            border-radius: 50%; 
            font-size: 0.8rem; display: flex; 
            align-items: center; justify-content: center; 
            font-weight: 900; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            z-index: 5;
        }

        /* FORMS UI */
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; }
        .form-ui { 
            width: 100%; max-width: 500px; 
            background: rgba(0,0,0,0.3); 
            padding: 40px; border-radius: 32px; 
            border: 1px solid var(--glass-border); 
        }
        
        .inp { 
            width: 100%; padding: 16px 20px; 
            border-radius: 16px; 
            border: 1px solid var(--glass-border); 
            background: rgba(0,0,0,0.2); 
            color: #fff; font-weight: 600; 
            margin-bottom: 12px; transition: 0.2s; 
            font-size: 0.95rem;
        }
        .inp:focus { outline: none; border-color: var(--p); background: rgba(0,0,0,0.4); }
        textarea.inp { min-height: 120px; resize: none; }
        
        .btn-p { 
            background: var(--p); color: #fff; border:none; 
            padding: 18px; border-radius: 16px; 
            font-weight: 800; cursor: pointer; width: 100%; 
            transition: 0.3s; font-size: 1rem; letter-spacing: 0.5px;
            text-transform: uppercase;
            box-shadow: 0 10px 30px rgba(255, 152, 0, 0.15);
        }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(255, 152, 0, 0.3); }
        .btn-p:active { transform: scale(0.97); }
        .btn-p:disabled { background: #333; color: #666; cursor: not-allowed; box-shadow: none; transform: none; }
        
        /* CART SIDEBAR */
        .cart { 
            width: 380px; 
            background: var(--glass);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            display: flex; flex-direction: column; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            overflow: hidden;
        }
        
        .qty-inp-clean {
            background: transparent; border: none;
            color: #fff; font-size: 1.1rem; font-weight: 800;
            width: 40px; text-align: center;
        }
        .qty-inp-clean:focus { outline: none; border-bottom: 2px solid var(--p); }

        /* CHIPS */
        .chips-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px; scrollbar-width: none; }
        .chip { 
            padding: 10px 24px; border-radius: 100px; 
            background: rgba(255,255,255,0.03); 
            border: 1px solid var(--glass-border); 
            color: var(--muted); cursor: pointer; 
            white-space: nowrap; font-weight: 700; font-size: 0.8rem; transition: 0.3s; 
        }
        .chip:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .chip.active { background: var(--p); color: #fff; border-color: var(--p); box-shadow: 0 5px 15px rgba(255, 152, 0, 0.2); }

        /* PERF & MISC */
        .perf-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); transition: width 1s ease-out; box-shadow: 0 0 10px var(--p); }

        .toolbar { display: flex; gap: 10px; margin-bottom: 20px; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 16px; }
        .tool-btn { background: transparent; border: none; color: var(--muted); width: 40px; height: 40px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.2s; }
        .tool-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
        
        .emp-badge { display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 15px; }
        .emp-avatar { width: 45px; height: 45px; background: linear-gradient(135deg, var(--p), #d35400); border-radius: 12px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem; color:#fff; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }

        .v-card { background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 20px; padding: 25px; display: flex; flex-direction: column; align-items: center; transition: 0.3s; position: relative; overflow: hidden; }
        .v-card:hover { border-color: var(--p); transform: translateY(-5px); background: rgba(255,255,255,0.04); }
        
        .toast { position: fixed; top: 30px; right: 30px; padding: 20px 30px; border-radius: 20px; z-index: 9999; animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 20px 50px rgba(0,0,0,0.6); min-width: 300px; backdrop-filter: blur(10px); }
        @keyframes slideIn { from { transform: translateX(150%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
        .modal-box { background: #1a1a1a; border: 1px solid var(--glass-border); padding: 40px; border-radius: 30px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 30px 80px rgba(0,0,0,0.8); transform: scale(0.9); animation: popIn 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { to { transform: scale(1); } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:35, filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.4))'}} />
            <h1 style={{fontSize:'2.2rem', fontWeight:900, marginBottom:10, letterSpacing:'-1px'}}>HEN HOUSE</h1>
            <p style={{color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Secure Employee Access</p>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Identité requise</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); localStorage.setItem('hh_user', user); setView('app');}} disabled={!user}>AUTHENTIFICATION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:30}}>
                <img src="https://i.goopics.net/dskmxi.png" height="50" style={{filter: 'drop-shadow(0 0 10px rgba(255,152,0,0.3))'}} />
            </div>
            
            <div style={{flex:1, overflowY:'auto', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.3rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            
            <div style={{marginTop: '20px'}}>
              <div className="emp-badge">
                <div className="emp-avatar">{user.charAt(0)}</div>
                <div style={{flex:1}}>
                    <div className="emp-name" style={{fontSize:'0.95rem'}}>{user.split(' ')[0]}</div>
                    <div className="emp-role" style={{fontSize:'0.7rem', color:'var(--p)'}}>{myProfile?.role || 'Staff'}</div>
                </div>
              </div>

              <div className="toolbar">
                <button className="tool-btn" title="Rafraîchir" onClick={() => window.location.reload()}>🔃</button>
                <button className="tool-btn" title="Sync Cloud" onClick={() => loadData(true)}>☁️</button>
                <button className="tool-btn" title="Sons" onClick={() => {setIsMuted(!isMuted); playSound('click');}}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button className="tool-btn" title="Déconnexion" onClick={requestLogout} style={{color: 'var(--danger)'}}>🚪</button>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* HOME */}
              {currentTab === 'home' && (
                <div className="fade-in">
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40}}>
                        <div>
                            <h1 style={{fontSize: '3rem', fontWeight: 900, marginBottom: 5, letterSpacing:'-1px', color:'#fff'}}>Bonjour, {user.split(' ')[0]}</h1>
                            <p style={{color: 'var(--muted)', fontSize: '1.1rem'}}>Prêt pour le service ? Voici tes stats.</p>
                        </div>
                        <div style={{width: 60, height: 60, background:'var(--p)', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', boxShadow:'0 0 30px var(--p-glow)'}}>👋</div>
                    </div>
                    
                    <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 45}}>
                      <div className="card" style={{flexDirection:'row', alignItems:'center', gap:25, padding: 30, background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(0,0,0,0) 100%)', border:'1px solid rgba(255,152,0,0.3)'}}>
                         <div style={{fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.4))'}}>💰</div>
                         <div>
                            <div className="stat-label" style={{color:'var(--p)'}}>MON CHIFFRE</div>
                            <div className="stat-value" style={{fontSize:'2.2rem'}}>${Math.round(myProfile?.ca || 0).toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{flexDirection:'row', alignItems:'center', gap:25, padding: 30, background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 100%)', border:'1px solid rgba(16,185,129,0.3)'}}>
                         <div style={{fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.4))'}}>📦</div>
                         <div>
                            <div className="stat-label" style={{color:'var(--success)'}}>PRODUCTION</div>
                            <div className="stat-value" style={{fontSize:'2.2rem'}}>{myProfile?.stock.toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="card" style={{flexDirection:'row', alignItems:'center', gap:25, padding: 30, background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 100%)', border:'1px solid rgba(99,102,241,0.3)'}}>
                         <div style={{fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.4))'}}>💶</div>
                         <div>
                            <div className="stat-label" style={{color:'#6366f1'}}>SALAIRE EST.</div>
                            <div className="stat-value" style={{fontSize:'2.2rem'}}>${Math.round(myProfile?.salary || 0).toLocaleString()}</div>
                         </div>
                      </div>
                    </div>

                    <div style={{background:'rgba(255,255,255,0.02)', padding:35, borderRadius:30, border:'1px solid var(--glass-border)'}}>
                        <h3 style={{marginBottom: 25, fontWeight: 900, color: '#fff', fontSize: '1.2rem', textTransform:'uppercase', letterSpacing:'1px'}}>Accès Rapide</h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:15}}>
                        {MODULES.filter(m => !['home', 'profile', 'performance', 'directory'].includes(m.id)).map(m => (
                            <div key={m.id} className="card" onClick={()=>setCurrentTab(m.id)} style={{padding: 20, alignItems:'center', justifyContent:'center', height: 140}}>
                                <span style={{fontSize:'2.5rem', display:'block', marginBottom:10}}>{m.e}</span>
                                <div style={{fontSize:'0.85rem', fontWeight:800, color:'var(--muted)'}}>{m.l}</div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
              )}

              {/* INVOICES */}
              {currentTab === 'invoices' && (
                <div className="fade-in">
                  <div style={{position:'relative', marginBottom:25}}>
                        <span style={{position:'absolute', left:20, top:16, opacity:0.5, fontSize:'1.2rem'}}>🔍</span>
                        <input className="inp" placeholder="Rechercher un produit..." style={{paddingLeft:55, height: 55, fontSize:'1.1rem'}} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className="chips-container">
                    <div className={`chip ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tous</div>
                    {Object.keys(data.productsByCategory).map(c => (
                        <div key={c} className={`chip ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c}</div>
                    ))}
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>{
                      const cartItem = cart.find(i=>i.name===p);
                      return (
                        <div key={p} className={`card ${cartItem?'sel':''}`} onClick={()=>{
                            playSound('click'); 
                            if(cartItem) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                        }}>
                            {cartItem && <div className="card-qty">{cartItem.qty}</div>}
                            <div className="card-img-container">
                                {IMAGES[p] ? <img src={IMAGES[p]} /> : <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', background:'#111', color: 'var(--p)'}}>{p.charAt(0)}</div>}
                            </div>
                            <div style={{padding:'12px 15px'}}>
                                <div style={{fontWeight:800, fontSize:'0.9rem', marginBottom:5, height:20, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p}</div>
                                <div style={{color:'var(--p)', fontWeight:950, fontSize:'1.1rem'}}>${data.prices[p]}</div>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EXPENSES */}
              {currentTab === 'expenses' && (
                <div className="center-box">
                    <div className="form-ui">
                        <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>💳 NOTE DE FRAIS</h2>
                        <p style={{textAlign:'center', color:'var(--muted)', fontSize:'0.9rem', marginBottom:35}}>Justificatif obligatoire pour remboursement.</p>
                        
                        <div style={{display:'flex', gap:15, marginBottom:5}}>
                            <select className="inp" style={{flex:1}} value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                                {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                            </select>
                            <select className="inp" style={{flex:1}} value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                                <option>Essence</option><option>Réparation</option><option>Autre</option>
                            </select>
                        </div>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        
                        <div className={`dropzone ${dragActive ? 'active' : ''}`} 
                             onDragOver={e => { e.preventDefault(); setDragActive(true); }} 
                             onDragLeave={() => setDragActive(false)} 
                             onDrop={e => { e.preventDefault(); setDragActive(false); handleFileChange(e.dataTransfer.files[0]); }} 
                             onClick={() => !forms.expense.file && document.getElementById('inpFile').click()}>
                           
                           <input type="file" id="inpFile" hidden accept="image/*" onChange={e => handleFileChange(e.target.files[0])} />
                           
                           {!forms.expense.file ? (
                             <div style={{opacity: 0.6}}>
                               <div style={{fontSize:'3rem', marginBottom:15}}>📸</div>
                               <div style={{fontWeight:800, fontSize:'0.8rem'}}>GLISSER OU CLIQUER</div>
                             </div>
                           ) : (
                             <div className="dz-preview-container">
                               <button className="btn-del-file" title="Supprimer" onClick={(e) => { e.stopPropagation(); setForms({...forms, expense:{...forms.expense, file: null}}); }}>×</button>
                               <img src={forms.expense.file} className="dz-preview" alt="Reçu" />
                             </div>
                           )}
                        </div>
                        
                        <button className="btn-p" disabled={sending || !forms.expense.amount || !forms.expense.file} onClick={()=>send('sendExpense', forms.expense)}>ENVOYER LA NOTE</button>
                    </div>
                </div>
              )}

              {/* STOCK */}
              {currentTab === 'stock' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>📦 PRODUCTION</h2>
                    {forms.stock.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:12, marginBottom:12}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                        </div>
                    ))}
                    <button className="nav-l" style={{border:'2px dashed var(--glass-border)', justifyContent:'center', marginBottom: 25, color: '#fff'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ AJOUTER LIGNE</button>
                    <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>VALIDER PRODUCTION</button>
                </div></div>
              )}

              {/* ENTERPRISE */}
              {currentTab === 'enterprise' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🏢 B2B</h2>
                    <input className="inp" placeholder="Nom de l'entreprise cliente" value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                    <div style={{height: 1, background:'var(--glass-border)', margin:'20px 0'}}></div>
                    {forms.enterprise.items.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:90}} value={item.qty} onChange={e=>{const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>TRANSMETTRE COMMANDE</button>
                </div></div>
              )}

              {/* PARTNERS */}
              {currentTab === 'partners' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:25, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🤝 PARTENAIRES</h2>
                    <input className="inp" placeholder="Numéro de Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                    <div style={{display:'flex', gap:12, marginBottom:12}}>
                        <select className="inp" style={{flex:1}} value={forms.partner.company} onChange={e=>{const c=e.target.value; setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});}}>{Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}</select>
                        <select className="inp" style={{flex:1}} value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>{data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}</select>
                    </div>
                    {forms.partner.items.map((item, idx) => (
                        <div key={idx} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{const n=[...forms.partner.items]; n[idx].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}}>{data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name}>{m.name}</option>)}</select>
                            <input type="number" className="inp" style={{width:80, textAlign:'center'}} value={item.qty} onChange={e=>{const n=[...forms.partner.items]; n[idx].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});}} />
                        </div>
                    ))}
                    <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER LA COMMANDE</button>
                </div></div>
              )}

              {/* GARAGE */}
              {currentTab === 'garage' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:30, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🚗 VÉHICULE</h2>
                    <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                    <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                    <div style={{background:'rgba(255,255,255,0.05)', padding:25, borderRadius:20, marginTop:15, border:'1px solid var(--glass-border)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginBottom:20}}><span>⛽ NIVEAU ESSENCE</span><span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', height:8}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                    </div>
                    <button className="btn-p" style={{marginTop:30}} onClick={()=>send('sendGarage', forms.garage)}>METTRE À JOUR</button>
                </div></div>
              )}

              {/* DIRECTORY */}
              {currentTab === 'directory' && (
                <div className="fade-in">
                    <h2 style={{fontSize:'2.5rem', fontWeight:950, marginBottom:35, color:'#fff'}}>ANNUAIRE HEN HOUSE</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:25}}>
                    {data.employeesFull.map(e => (
                        <div key={e.id} className="v-card">
                            <div className="v-card-avatar" style={{width:90, height:90, fontSize:'2.5rem'}}>{e.name.charAt(0)}</div>
                            <div className="v-card-name" style={{fontSize:'1.2rem'}}>{e.name}</div>
                            <div className="v-card-role">{e.role}</div>
                            <div style={{marginTop: 15, width:'100%'}}>
                                <a href={`tel:${e.phone}`} className="v-card-btn" style={{background:'var(--p)', color:'#fff'}}>📞 {e.phone}</a>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {currentTab === 'performance' && (
                <div className="fade-in" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:30}}>
                  <div className="form-ui" style={{maxWidth:'100%', padding:35}}>
                    <h2 style={{marginBottom:30, fontWeight:950, fontSize:'1.5rem'}}>🏆 CLASSEMENT C.A</h2>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b style={{color: i===0 ? 'var(--p)' : '#fff'}}>${Math.round(e.ca).toLocaleString()}</b>
                        </div>
                        <div className="perf-bar"><div className="perf-fill" style={{width: (e.ca / Math.max(...data.employeesFull.map(x=>x.ca)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                  <div className="form-ui" style={{maxWidth:'100%', padding:35}}>
                    <h2 style={{marginBottom:30, fontWeight:950, fontSize:'1.5rem'}}>📦 TOP CUISTOTS</h2>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{marginBottom: 20}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize: '1rem', marginBottom:8}}>
                           <span>{i+1}. <b>{e.name}</b></span>
                           <b style={{color:'var(--success)'}}>{e.stock.toLocaleString()}</b>
                        </div>
                        <div className="perf-bar" style={{background:'rgba(16,185,129,0.1)'}}><div className="perf-fill" style={{background:'var(--success)', width: (e.stock / Math.max(...data.employeesFull.map(x=>x.stock)) * 100) + '%'}}></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                   <div className="form-ui" style={{maxWidth: 600, padding: 50}}>
                        <div style={{textAlign:'center'}}>
                            <div className="v-card-avatar" style={{width:120, height:120, margin:'0 auto 25px', fontSize:'3rem', borderRadius:'30px'}}>{user.charAt(0)}</div>
                            <h1 style={{fontSize:'3rem', fontWeight:950, marginBottom:5}}>{user}</h1>
                            <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.2rem', textTransform:'uppercase', letterSpacing:'2px'}}>{myProfile.role}</div>
                        </div>
                        <div className="profile-grid" style={{marginTop:40}}>
                            <div className="stat-box" style={{textAlign:'center'}}>
                                <div className="stat-label">Chiffre d'affaire</div>
                                <div className="stat-value" style={{color:'var(--p)'}}>${Math.round(myProfile.ca).toLocaleString()}</div>
                            </div>
                            <div className="stat-box" style={{textAlign:'center'}}>
                                <div className="stat-label">Production</div>
                                <div className="stat-value" style={{color:'var(--success)'}}>{myProfile.stock}</div>
                            </div>
                        </div>
                   </div>
                </div>
              )}

              {/* SUPPORT */}
              {currentTab === 'support' && (
                <div className="center-box"><div className="form-ui">
                    <h2 style={{marginBottom:10, textAlign:'center', fontWeight:900, fontSize:'1.8rem'}}>🆘 ASSISTANCE</h2>
                    <p style={{textAlign:'center', color:'var(--muted)', marginBottom:30}}>Un problème ? Contactez la direction.</p>
                    <input className="inp" placeholder="Sujet" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})} />
                    <textarea className="inp" style={{height:150}} placeholder="Expliquez votre problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER LE TICKET</button>
                </div></div>
              )}
            </div>
          </main>

          {/* PANIER MODERNE */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:'25px 30px', borderBottom:'1px solid var(--glass-border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,152,0,0.05)'}}>
                  <h2 style={{fontSize:'1.3rem', fontWeight:900, letterSpacing:'1px'}}>COMMANDE</h2>
                  <button onClick={requestClearCart} title="Vider" style={{background:'rgba(255,255,255,0.1)', border:'none', width:35, height:35, borderRadius:10, cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>🗑️</button>
              </div>
              
              <div style={{padding:'20px 30px 10px 30px'}}>
                 <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem', fontWeight:800, letterSpacing:'1px', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)'}} />
              </div>

              <div style={{flex:1, overflowY:'auto', padding:'0 30px'}}>
                {cart.length === 0 ? 
                    <div style={{textAlign:'center', marginTop: 100, opacity: 0.3, display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <div style={{fontSize:'3rem', marginBottom:10}}>🛒</div>
                        <div>Panier vide</div>
                    </div> 
                : cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px dashed rgba(255,255,255,0.1)', alignItems:'center'}}>
                    <div style={{flex:1}}>
                        <div style={{fontWeight:700, fontSize:'0.95rem'}}>{i.name}</div>
                        <div style={{color:'var(--muted)', fontSize:'0.8rem'}}>${i.pu} / unité</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.05)', borderRadius:10, padding:2}}>
                      <input 
                        className="qty-inp-clean" 
                        type="number" 
                        value={i.qty} 
                        onChange={(e) => updateCartQty(idx, e.target.value)}
                        onBlur={() => finalizeCartQty(idx)}
                      />
                    </div>
                    <button style={{marginLeft:10, background:'transparent', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:'1.2rem'}} onClick={() => removeFromCart(idx)}>×</button>
                  </div>
                ))}
              </div>

              <div style={{padding:30, background:'rgba(0,0,0,0.4)', borderTop:'1px solid var(--glass-border)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20}}>
                    <span style={{fontWeight:700, color:'var(--muted)', textTransform:'uppercase', fontSize:'0.9rem'}}>Total à payer</span>
                    <b style={{fontSize:'2.5rem', color:'var(--p)', fontWeight:900, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                    {sending ? 'ENVOI...' : 'ENCAISSER'}
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && (
        <div className="toast" style={{ background: toast.s === 'error' ? 'rgba(239, 68, 68, 0.9)' : (toast.s === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255, 152, 0, 0.9)'), color: '#fff' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 5, fontWeight:800, letterSpacing:'1px' }}>{toast.t}</div>
          <div style={{ fontSize: '1rem', fontWeight:500 }}>{toast.m}</div>
        </div>
      )}

      {confirmModal && (
          <div className="modal-overlay" onClick={()=>setConfirmModal(null)}>
              <div className="modal-box" onClick={e=>e.stopPropagation()}>
                  <h3 style={{fontSize:'1.8rem', fontWeight:900, marginBottom:15, color:'#fff'}}>{confirmModal.title}</h3>
                  <p style={{color:'var(--muted)', marginBottom:30, fontSize:'1.1rem'}}>{confirmModal.msg}</p>
                  <div style={{display:'flex', gap:15}}>
                      <button className="btn-p" style={{background:'transparent', border:'1px solid var(--glass-border)', color:'#fff'}} onClick={()=>setConfirmModal(null)}>Annuler</button>
                      <button className="btn-p" onClick={confirmModal.action}>Confirmer</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
