"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// --- BIBLIOTHÈQUE D'ICÔNES (SVG intégrés) ---
const Icon = ({ name, size = 20, className = "" }) => {
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
    refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
    reload: <path d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 0 0-14-3M4 16a8 8 0 0 0 14 3" />,
    sound: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="M15.5 8.5a4 4 0 0 1 0 7" />
        <path d="M17.5 6.5a7 7 0 0 1 0 11" />
      </>
    ),
    mute: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="M23 9 17 15" />
        <path d="M17 9 23 15" />
      </>
    ),
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
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
  Ribbs: "https://files.catbox.moe/ej5jok.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Rougail Saucisse": "https://files.catbox.moe/jqzox0.png",
  "Brochettes de fruits frais": "https://files.catbox.moe/cbmjou.png",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Tourte Myrtille": "https://files.catbox.moe/oxwlna.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Lait de poule": "https://files.catbox.moe/jxgida.png",
};

export default function Home() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tous");
  const [toast, setToast] = useState(null);

  const [quickMode, setQuickMode] = useState(false);

  // 🔊 Sons (toggle en haut à gauche)
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef(null);

  // Form states
  const [invNum, setInvNum] = useState("");
  const [stockItems, setStockItems] = useState([{ product: "", qty: 1 }]);
  const [entName, setEntName] = useState("");
  const [entItems, setEntItems] = useState([{ product: "", qty: 1 }]);
  const [parItems, setParItems] = useState([{ menu: "", qty: 1 }]);
  const [parCompany, setParCompany] = useState("");
  const [parBenef, setParBenef] = useState("");
  const [parNum, setParNum] = useState("");
  const [expData, setExpData] = useState({ veh: "", kind: "Essence", amt: "" });
  const [garData, setGarData] = useState({ veh: "", action: "Entrée", fuel: 50 });
  const [supData, setSupData] = useState({ sub: "Autre", msg: "" });

  // Profil modal
  const [profileOpen, setProfileOpen] = useState(false);

  const formatMoney = (n) => `$${(Number(n) || 0).toFixed(2)}`;

  const me = useMemo(() => {
    if (!data?.directory || !user) return null;
    return data.directory.find((x) => x.name.trim() === user.trim()) || null;
  }, [data, user]);

  const sessionTotal = useMemo(
    () => cart.reduce((a, b) => a + b.qty * b.pu, 0),
    [cart]
  );

  // -------------------- SON (WebAudio) --------------------
  const beep = (type = "click") => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      const now = ctx.currentTime;

      let freq = 520;
      let dur = 0.07;
      if (type === "success") { freq = 740; dur = 0.09; }
      if (type === "error") { freq = 220; dur = 0.12; }
      if (type === "add") { freq = 600; dur = 0.06; }

      o.frequency.setValueAtTime(freq, now);
      o.type = "sine";

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      o.connect(g);
      g.connect(ctx.destination);
      o.start(now);
      o.stop(now + dur + 0.02);
    } catch {}
  };

  // -------------------- TOAST --------------------
  const notify = (title, msg, type = "info") => {
    setToast({ title, msg, type });
    setTimeout(() => setToast(null), 2800);
    if (type === "success") beep("success");
    if (type === "error") beep("error");
  };

  // -------------------- FETCH META / SYNC --------------------
  const fetchMeta = async () => {
    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getMeta" }),
    });
    return await res.json();
  };

  const syncData = async () => {
    notify("Sync", "Mise à jour des données...", "info");
    try {
      const res = await fetchMeta();
      setData(res);
      notify("OK", "Données mises à jour ✅", "success");
    } catch (e) {
      notify("Erreur", e.message, "error");
    }
  };

  const reloadAll = () => {
    window.location.reload();
  };

  // -------------------- INIT --------------------
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");

    (async () => {
      try {
        const res = await fetchMeta();
        setData(res);
        setLoading(false);

        if (res.vehicles?.length) {
          setExpData((p) => ({ ...p, veh: res.vehicles[0] }));
          setGarData((p) => ({ ...p, veh: res.vehicles[0] }));
        }
        if (res.partners && Object.keys(res.partners.companies).length) {
          setParCompany(Object.keys(res.partners.companies)[0]);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur chargement");
      }
    })();
  }, []);

  useEffect(() => {
    if (data && parCompany) {
      const comp = data.partners.companies[parCompany];
      if (comp && comp.beneficiaries.length) setParBenef(comp.beneficiaries[0]);
      if (comp && comp.menus.length) setParItems([{ menu: comp.menus[0].name, qty: 1 }]);
    }
  }, [parCompany, data]);

  // -------------------- AUTH --------------------
  const login = () => {
    if (user) {
      setView("app");
      beep("click");
    }
  };
  const logout = () => {
    setUser("");
    setView("login");
    setCart([]);
    setCartOpen(false);
    setCurrentTab("home");
  };

  // -------------------- CART --------------------
  const addToCart = (prod) => {
    beep("add");
    const existing = cart.find((x) => x.name === prod);
    if (existing) {
      setCart(cart.map((x) => (x.name === prod ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { name: prod, qty: 1, pu: data.prices[prod] || 0 }]);
    }
    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, delta) => {
    const newCart = [...cart];
    newCart[idx].qty = Number(newCart[idx].qty || 0) + Number(delta);
    if (newCart[idx].qty <= 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const setQtyDirect = (idx, value) => {
    const n = [...cart];
    const v = Math.max(0, Math.floor(Number(value || 0)));
    n[idx].qty = v;
    if (v === 0) n.splice(idx, 1);
    setCart(n);
  };

  // -------------------- SEND FORM --------------------
  const sendForm = async (action, payload) => {
    notify("Envoi...", "Veuillez patienter", "info");
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: { ...payload, employee: user } }),
      });
      const json = await res.json();
      if (json.success) {
        notify("Succès", "Action validée !", "success");

        // Reset forms
        if (action === "sendFactures") {
          setCart([]);
          setInvNum("");
          setCartOpen(false);
          setCurrentTab("home");
        }
        setStockItems([{ product: data.products[0], qty: 1 }]);
        setEntItems([{ product: data.products[0], qty: 1 }]);
        setEntName("");
        setParItems([{ menu: data.partners.companies[parCompany]?.menus[0]?.name, qty: 1 }]);
        setParNum("");
        setSupData({ sub: "Autre", msg: "" });
        setExpData((p) => ({ ...p, amt: "" }));

        // ✅ Sync direct après action pour voir CA/Stock à jour dans profil
        syncData();
      } else {
        notify("Erreur", json.message || "Erreur", "error");
      }
    } catch (e) {
      notify("Erreur", e.message, "error");
    }
  };

  const handleSendInvoice = () => {
    if (!invNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    if (cart.length === 0) return notify("Erreur", "Le panier est vide", "error");
    sendForm("sendFactures", {
      invoiceNumber: invNum,
      items: cart.map((x) => ({ desc: x.name, qty: x.qty })),
    });
  };

  const handleSendEnterprise = () => {
    if (!entName.trim()) return notify("Erreur", "Le nom de l'entreprise est OBLIGATOIRE", "error");
    sendForm("sendEntreprise", { company: entName, items: entItems });
  };

  const handleSendPartner = () => {
    if (!parNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    sendForm("sendPartnerOrder", {
      company: parCompany,
      beneficiary: parBenef,
      invoiceNumber: parNum,
      items: parItems,
    });
  };

  const handleSendExpense = () => {
    if (!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm("sendExpense", { vehicle: expData.veh, kind: expData.kind, amount: expData.amt });
  };

  if (loading)
    return (
      <div className="loading">
        <div className="loadBox">
          <img src="https://i.goopics.net/dskmxi.png" alt="logo" />
          <div className="loaderLine" />
          <div className="loadTxt">Chargement Hen House…</div>
          <div className="loadSub">Connexion & synchronisation…</div>
        </div>
      </div>
    );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6;
          --primary-light: rgba(139, 92, 246, 0.16);
          --bg-body: #0f1115;
          --bg-panel: #14161c;
          --bg-panel-2: #191c24;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: rgba(255,255,255,0.08);
          --radius: 24px;
          --sidebar-w: 280px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; background: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; }

        /* ✅ SELECT DARK (GLOBAL) */
        select, option {
          color: var(--text-main);
          background: var(--bg-panel);
        }
        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding-right: 40px !important;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
            linear-gradient(135deg, var(--text-muted) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) calc(50% - 2px),
            calc(100% - 12px) calc(50% - 2px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }
        option {
          background: var(--bg-panel) !important;
          color: var(--text-main) !important;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
        ::-webkit-scrollbar-track { background: transparent; }

        /* LOADING */
        .loading { height: 100vh; width: 100vw; display:flex; align-items:center; justify-content:center; background: radial-gradient(1200px 700px at 50% 20%, rgba(139,92,246,0.12), transparent 60%); }
        .loadBox { text-align:center; padding: 28px 30px; border: 1px solid var(--border); border-radius: 26px; background: rgba(20,22,28,0.75); backdrop-filter: blur(10px); box-shadow: 0 30px 60px rgba(0,0,0,0.35); width: 360px; }
        .loadBox img { height: 56px; border-radius: 14px; margin-bottom: 16px; }
        .loaderLine { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow:hidden; margin: 12px auto 14px; }
        .loaderLine:before { content:""; display:block; height:100%; width: 45%; background: var(--primary); border-radius: 999px; animation: shimmer 1.1s infinite; }
        @keyframes shimmer { 0%{ transform: translateX(-30%);} 100%{ transform: translateX(160%);} }
        .loadTxt { font-weight: 900; letter-spacing: 0.2px; }
        .loadSub { margin-top: 6px; color: var(--text-muted); font-size: 0.9rem; }

        /* LAYOUT */
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: rgba(20,22,28,0.72); backdrop-filter: blur(10px); border-radius: var(--radius); display:flex; flex-direction:column; padding: 22px; border: 1px solid var(--border); box-shadow: 0 25px 60px rgba(0,0,0,0.35); }
        .brand { display:flex; align-items:center; gap: 12px; font-weight: 900; letter-spacing: 0.2px; font-size: 1.15rem; margin-bottom: 20px; }
        .brand img { height: 34px; border-radius: 12px; }
        .nav-list { display:flex; flex-direction:column; gap: 8px; flex: 1; padding-top: 8px; }
        .nav-btn { display:flex; align-items:center; gap: 12px; padding: 12px 14px; border-radius: 14px; border: 1px solid transparent; background: transparent; color: var(--text-muted); font-weight: 800; cursor:pointer; transition: 0.18s; }
        .nav-btn:hover { background: rgba(255,255,255,0.04); color: var(--text-main); border-color: rgba(255,255,255,0.06); }
        .nav-btn.active { background: var(--primary); color: white; box-shadow: 0 14px 32px rgba(139,92,246,0.32); }

        /* ✅ Bas gauche : simple, propre */
        .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px; margin-top: 12px; }
        .miniMe { display:flex; align-items:center; gap: 12px; padding: 12px; border-radius: 18px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.06); }
        .miniAvatar { width: 40px; height: 40px; border-radius: 14px; background: rgba(139,92,246,0.22); display:flex; align-items:center; justify-content:center; font-weight: 1000; }
        .miniMeName { font-weight: 950; line-height: 1.1; }
        .miniMeSub { color: var(--text-muted); font-size: 0.85rem; margin-top: 2px; }
        .miniActions { display:flex; gap: 10px; margin-top: 12px; }
        .miniBtn { flex:1; display:flex; align-items:center; justify-content:center; gap: 8px; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: var(--text-main); font-weight: 900; cursor:pointer; transition: .16s; }
        .miniBtn:hover { transform: translateY(-1px); border-color: rgba(139,92,246,0.35); }
        .miniBtn.danger { border-color: rgba(239,68,68,0.32); color: #fecaca; }
        .miniBtn.danger:hover { border-color: rgba(239,68,68,0.55); }

        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x:hidden; position: relative; }

        /* HEADER */
        .header-bar { display:flex; justify-content:space-between; align-items:center; margin: 10px 10px 26px; }
        .page-title { font-size: 1.8rem; font-weight: 1000; display:flex; align-items:center; gap: 10px; }
        .header-left-tools { display:flex; gap: 10px; align-items:center; margin-left: 14px; }
        .chipBtn { display:flex; align-items:center; gap: 10px; padding: 10px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: var(--text-main); cursor:pointer; font-weight: 900; }
        .chipBtn:hover { border-color: rgba(139,92,246,0.35); }

        .top-stats { display:flex; gap: 10px; align-items:center; }
        .mini-stat { background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); display:flex; gap: 10px; align-items:center; font-weight: 900; color: var(--text-muted); }
        .mini-stat strong { color: var(--text-main); }

        /* Toggle */
        .toggleWrap { display:flex; align-items:center; gap: 10px; padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
        .toggleLabel { font-weight: 900; color: var(--text-muted); }
        .switch { width: 44px; height: 24px; border-radius: 999px; background: rgba(255,255,255,0.10); position: relative; cursor:pointer; }
        .knob { width: 20px; height: 20px; border-radius: 999px; background: white; position:absolute; top:2px; left:2px; transition: .18s; }
        .switch.on { background: rgba(139,92,246,0.6); }
        .switch.on .knob { left: 22px; }

        /* DASH */
        .dashboard-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .dash-card { background: rgba(255,255,255,0.03); border-radius: 22px; padding: 24px; border: 1px solid rgba(255,255,255,0.08); cursor:pointer; transition: .18s; height: 190px; display:flex; flex-direction:column; justify-content:space-between; }
        .dash-card:hover { transform: translateY(-3px); border-color: rgba(139,92,246,0.35); box-shadow: 0 20px 40px rgba(0,0,0,0.25); }
        .dash-icon { width: 52px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; color: var(--primary); }
        .dash-title { font-size: 1.15rem; font-weight: 1000; }
        .dash-desc { color: var(--text-muted); font-weight: 700; }

        /* CATALOG */
        .search-container { position: relative; margin-bottom: 18px; max-width: 520px; }
        .search-inp { width: 100%; padding: 16px 18px 16px 50px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); font-size: 1rem; color: var(--text-main); font-weight: 900; }
        .search-inp:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.15); }
        .search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .cat-pills { display:flex; gap: 10px; overflow-x:auto; padding-bottom: 10px; margin-bottom: 16px; }
        .pill { padding: 8px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; font-weight: 900; cursor:pointer; white-space:nowrap; color: var(--text-muted); }
        .pill:hover, .pill.active { background: var(--primary); border-color: rgba(139,92,246,0.5); color: white; }

        .prod-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(${quickMode ? "190px" : "170px"}, 1fr)); gap: 16px; }
        .prod-card { background: rgba(255,255,255,0.03); border-radius: 20px; padding: 14px; text-align:center; border: 1px solid rgba(255,255,255,0.08); cursor:pointer; transition: .16s; }
        .prod-card:hover { border-color: rgba(139,92,246,0.35); transform: translateY(-2px); }
        .prod-img { width: 100%; aspect-ratio: 1; border-radius: 16px; margin-bottom: 12px; object-fit: cover; background: rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center; font-size: 2rem; color: var(--text-muted); }
        .prod-title { font-weight: 950; font-size: 0.92rem; line-height: 1.25; min-height: 42px; display:flex; align-items:center; justify-content:center; }
        .prod-price { color: var(--primary); font-weight: 1000; font-size: 1.05rem; margin-top: 6px; }

        /* CART DRAWER */
        .cart-drawer { position: fixed; top: 0; right: 0; width: 420px; height: 100vh; background: rgba(20,22,28,0.92); backdrop-filter: blur(10px); box-shadow: -18px 0 60px rgba(0,0,0,0.45); z-index: 100; transform: translateX(100%); transition: transform .28s; display:flex; flex-direction:column; border-left: 1px solid rgba(255,255,255,0.08); }
        .cart-drawer.open { transform: translateX(0); }
        .cart-head { padding: 18px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .cart-body { flex:1; overflow-y:auto; padding: 16px 16px 6px; }
        .cart-foot { padding: 18px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.08); }
        .cart-item { display:flex; align-items:center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.08); }
        .qty-ctrl { display:flex; align-items:center; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 4px; border: 1px solid rgba(255,255,255,0.08); }
        .qb { width: 34px; height: 34px; border:none; background: transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color: var(--text-main); font-weight: 1000; border-radius: 10px; }
        .qb:hover { background: rgba(255,255,255,0.06); }
        .qiInput { width: 56px; height: 34px; border:none; background: transparent; text-align:center; font-weight: 1000; color: var(--text-main); }
        .btn { width: 100%; padding: 14px; border:none; border-radius: 16px; font-weight: 1000; font-size: 1rem; cursor:pointer; transition: .16s; display:flex; justify-content:center; align-items:center; gap: 10px; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 18px 40px rgba(139,92,246,0.25); }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-text { background: transparent; border: 1px dashed rgba(255,255,255,0.14); color: var(--text-muted); }
        .btn-text:hover { border-color: rgba(139,92,246,0.35); color: var(--text-main); }

        .cart-btn-float { position: fixed; bottom: 26px; right: 26px; background: rgba(255,255,255,0.94); color: #0b0d12; padding: 12px 18px; border-radius: 999px; font-weight: 1000; cursor:pointer; box-shadow: 0 22px 45px rgba(0,0,0,0.35); display:flex; align-items:center; gap: 10px; z-index: 90; }
        .cart-btn-float:hover { transform: translateY(-1px); }

        /* FORMS */
        .form-wrap { background: rgba(255,255,255,0.03); padding: 30px; border-radius: 26px; max-width: 640px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 28px 60px rgba(0,0,0,0.35); }
        .inp-group { margin-bottom: 16px; }
        .inp-label { display:block; margin-bottom: 8px; font-weight: 1000; font-size: 0.9rem; color: var(--text-muted); }
        .inp-field { width:100%; padding: 13px 14px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); border-radius: 14px; font-size: 1rem; color: var(--text-main); font-weight: 900; }
        .inp-field:focus { border-color: rgba(139,92,246,0.55); box-shadow: 0 0 0 4px rgba(139,92,246,0.14); }

        /* LOGIN */
        #gate { position: fixed; inset: 0; background: radial-gradient(1200px 700px at 50% 20%, rgba(139,92,246,0.12), transparent 60%); z-index: 2000; display:flex; align-items:center; justify-content:center; }
        .login-box { text-align:center; width: 420px; padding: 34px; border: 1px solid rgba(255,255,255,0.10); background: rgba(20,22,28,0.78); backdrop-filter: blur(10px); border-radius: 30px; box-shadow: 0 30px 70px rgba(0,0,0,0.45); }

        /* TOAST */
        .toast { position: fixed; top: 24px; right: 24px; z-index: 3000; background: rgba(20,22,28,0.9); backdrop-filter: blur(10px); padding: 12px 16px; border-radius: 16px; box-shadow: 0 18px 45px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.10); min-width: 280px; animation: slideIn .22s; }
        @keyframes slideIn { from { transform: translateX(18px); opacity: 0; } }
        .t-title { font-weight: 1000; }
        .t-msg { font-size: 0.9rem; color: var(--text-muted); margin-top: 2px; }

        /* MODAL */
        .modalOverlay { position: fixed; inset:0; background: rgba(0,0,0,0.55); z-index: 5000; display:flex; align-items:center; justify-content:center; padding: 18px; }
        .modal { width: 560px; max-width: 96vw; background: rgba(20,22,28,0.94); border: 1px solid rgba(255,255,255,0.10); border-radius: 26px; backdrop-filter: blur(10px); box-shadow: 0 35px 90px rgba(0,0,0,0.55); overflow:hidden; }
        .modalHead { padding: 18px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .modalBody { padding: 18px; }
        .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .infoCard { padding: 12px 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); border-radius: 16px; }
        .k { color: var(--text-muted); font-weight: 900; font-size: 0.85rem; }
        .v { font-weight: 1000; margin-top: 4px; }
      `}</style>

      {view === "login" ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" alt="logo" style={{ height: 60, borderRadius: 16, marginBottom: 14 }} />
            <h2 style={{ marginBottom: 8, fontWeight: 1000 }}>Bienvenue</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 18, fontWeight: 800 }}>
              Sélectionne ton nom pour commencer
            </p>

            <select
              className="inp-field"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{ marginBottom: 14, textAlign: "center" }}
            >
              <option value="">Sélectionner un nom…</option>
              {data?.employees?.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{ marginTop: 14, color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>
              v{data?.version || "—"}
            </div>
          </div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div className="brand">
              <img src="https://i.goopics.net/dskmxi.png" alt="Logo" />
              HEN HOUSE
            </div>

            <nav className="nav-list">
              <button className={`nav-btn ${currentTab === "home" ? "active" : ""}`} onClick={() => setCurrentTab("home")}>
                <Icon name="dashboard" /> Tableau de bord
              </button>
              <button className={`nav-btn ${currentTab === "invoices" ? "active" : ""}`} onClick={() => setCurrentTab("invoices")}>
                <Icon name="receipt" /> Caisse
              </button>
              <button className={`nav-btn ${currentTab === "stock" ? "active" : ""}`} onClick={() => setCurrentTab("stock")}>
                <Icon name="package" /> Stock
              </button>
              <button className={`nav-btn ${currentTab === "enterprise" ? "active" : ""}`} onClick={() => setCurrentTab("enterprise")}>
                <Icon name="building" /> Entreprise
              </button>
              <button className={`nav-btn ${currentTab === "partners" ? "active" : ""}`} onClick={() => setCurrentTab("partners")}>
                <Icon name="handshake" /> Partenaires
              </button>
              <button className={`nav-btn ${currentTab === "expenses" ? "active" : ""}`} onClick={() => setCurrentTab("expenses")}>
                <Icon name="creditCard" /> Frais
              </button>
              <button className={`nav-btn ${currentTab === "garage" ? "active" : ""}`} onClick={() => setCurrentTab("garage")}>
                <Icon name="car" /> Garage
              </button>
              <button className={`nav-btn ${currentTab === "support" ? "active" : ""}`} onClick={() => setCurrentTab("support")}>
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            {/* ✅ Bas gauche CLEAN : Nom + Profil + Déconnexion */}
            <div className="sidebar-footer">
              <div className="miniMe">
                <div className="miniAvatar">{user?.charAt(0) || "?"}</div>
                <div style={{ flex: 1 }}>
                  <div className="miniMeName">{user}</div>
                  <div className="miniMeSub">{me?.role ? me.role : "Employé"}</div>
                </div>
              </div>

              <div className="miniActions">
                <button className="miniBtn" onClick={() => setProfileOpen(true)}>
                  <Icon name="user" size={16} /> Profil
                </button>
                <button className="miniBtn danger" onClick={logout}>
                  <Icon name="logout" size={16} /> Déconnexion
                </button>
              </div>

              <div style={{ marginTop: 10, color: "var(--text-muted)", fontWeight: 900, fontSize: 12 }}>
                v{data?.version || "—"}
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="header-bar">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="page-title">
                  {currentTab === "home" && (
                    <>
                      <Icon name="dashboard" size={32} /> Tableau de bord
                    </>
                  )}
                  {currentTab === "invoices" && (
                    <>
                      <Icon name="receipt" size={32} /> Caisse
                    </>
                  )}
                  {currentTab === "stock" && (
                    <>
                      <Icon name="package" size={32} /> Stock
                    </>
                  )}
                  {currentTab === "enterprise" && (
                    <>
                      <Icon name="building" size={32} /> Entreprise
                    </>
                  )}
                  {currentTab === "partners" && (
                    <>
                      <Icon name="handshake" size={32} /> Partenaires
                    </>
                  )}
                  {currentTab === "garage" && (
                    <>
                      <Icon name="car" size={32} /> Garage
                    </>
                  )}
                  {currentTab === "expenses" && (
                    <>
                      <Icon name="creditCard" size={32} /> Frais
                    </>
                  )}
                  {currentTab === "support" && (
                    <>
                      <Icon name="lifeBuoy" size={32} /> Support
                    </>
                  )}
                </div>

                {/* ✅ EN HAUT À GAUCHE : toggle SON (comme demandé) */}
                <div className="header-left-tools">
                  <button
                    className="chipBtn"
                    onClick={() => {
                      setSoundOn((v) => !v);
                      beep("click");
                    }}
                    title="Sons"
                  >
                    <Icon name={soundOn ? "sound" : "mute"} size={18} />
                    {soundOn ? "Son ON" : "Son OFF"}
                  </button>
                </div>
              </div>

              {/* ✅ EN HAUT À DROITE : Session + Mode rapide + Sync + Reload */}
              <div className="top-stats">
                <div className="mini-stat">
                  Session: <strong>{formatMoney(sessionTotal)}</strong>
                </div>

                <div className="toggleWrap">
                  <span className="toggleLabel">Mode rapide</span>
                  <div
                    className={`switch ${quickMode ? "on" : ""}`}
                    onClick={() => {
                      setQuickMode((v) => !v);
                      beep("click");
                    }}
                  >
                    <div className="knob" />
                  </div>
                </div>

                <button className="chipBtn" onClick={syncData} title="↻ Sync (refresh data)">
                  <Icon name="refresh" size={18} /> Sync
                </button>

                <button className="chipBtn" onClick={reloadAll} title="⟳ Reload (refresh complet)">
                  <Icon name="reload" size={18} /> Reload
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === "home" && (
              <div className="dashboard-grid">
                <div className="dash-card" onClick={() => setCurrentTab("invoices")}>
                  <div className="dash-icon">
                    <Icon name="receipt" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Caisse</div>
                    <div className="dash-desc">Nouvelle vente</div>
                  </div>
                </div>

                <div className="dash-card" onClick={() => setCurrentTab("stock")}>
                  <div className="dash-icon">
                    <Icon name="package" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Stock</div>
                    <div className="dash-desc">Production cuisine</div>
                  </div>
                </div>

                <div className="dash-card" onClick={() => setCurrentTab("enterprise")}>
                  <div className="dash-icon">
                    <Icon name="building" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Entreprise</div>
                    <div className="dash-desc">Commandes B2B</div>
                  </div>
                </div>

                <div className="dash-card" onClick={() => setCurrentTab("partners")}>
                  <div className="dash-icon">
                    <Icon name="handshake" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Partenaires</div>
                    <div className="dash-desc">Offres spéciales</div>
                  </div>
                </div>
              </div>
            )}

            {/* CAISSE */}
            {currentTab === "invoices" && (
              <>
                <div className="search-container">
                  <div className="search-icon">
                    <Icon name="search" size={20} />
                  </div>
                  <input className="search-inp" placeholder="Rechercher…" onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="cat-pills">
                  <div className={`pill ${catFilter === "Tous" ? "active" : ""}`} onClick={() => setCatFilter("Tous")}>
                    Tous
                  </div>
                  {Object.keys(data.productsByCategory).map((c) => (
                    <div
                      key={c}
                      className={`pill ${catFilter === c ? "active" : ""}`}
                      onClick={() => setCatFilter(c)}
                    >
                      {c.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>

                <div className="prod-grid">
                  {data.products
                    .filter((p) => {
                      const cat = Object.keys(data.productsByCategory).find((k) => data.productsByCategory[k].includes(p));
                      return (catFilter === "Tous" || cat === catFilter) && p.toLowerCase().includes(search.toLowerCase());
                    })
                    .map((p) => (
                      <div key={p} className="prod-card" onClick={() => addToCart(p)}>
                        {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" alt={p} /> : <div className="prod-img">{p.charAt(0)}</div>}
                        <div className="prod-title">{p}</div>
                        <div className="prod-price">{formatMoney(data.prices[p])}</div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === "stock" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="package" /> Déclaration Stock
                </h2>

                {stockItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <select
                      className="inp-field"
                      value={item.product}
                      onChange={(e) => {
                        const n = [...stockItems];
                        n[i].product = e.target.value;
                        setStockItems(n);
                      }}
                      style={{ flex: 1 }}
                    >
                      <option value="" disabled>
                        Produit…
                      </option>
                      {data.products.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>

                    {/* ✅ saisie clavier OK */}
                    <input
                      type="number"
                      className="inp-field"
                      style={{ width: 110, textAlign: "center" }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...stockItems];
                        n[i].qty = e.target.value;
                        setStockItems(n);
                      }}
                    />

                    <button
                      className="qb"
                      style={{ color: "#ef4444" }}
                      onClick={() => {
                        const n = [...stockItems];
                        n.splice(i, 1);
                        setStockItems(n);
                      }}
                      title="Supprimer"
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={() => setStockItems([...stockItems, { product: data.products[0], qty: 1 }])}>
                  + Ajouter ligne
                </button>
                <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => sendForm("sendProduction", { items: stockItems })}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ENTREPRISE */}
            {currentTab === "enterprise" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="building" /> Commande Pro
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={(e) => setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <select
                      className="inp-field"
                      value={item.product}
                      onChange={(e) => {
                        const n = [...entItems];
                        n[i].product = e.target.value;
                        setEntItems(n);
                      }}
                      style={{ flex: 1 }}
                    >
                      <option value="" disabled>
                        Produit…
                      </option>
                      {data.products.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      className="inp-field"
                      style={{ width: 110, textAlign: "center" }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...entItems];
                        n[i].qty = e.target.value;
                        setEntItems(n);
                      }}
                    />

                    <button
                      className="qb"
                      style={{ color: "#ef4444" }}
                      onClick={() => {
                        const n = [...entItems];
                        n.splice(i, 1);
                        setEntItems(n);
                      }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={() => setEntItems([...entItems, { product: data.products[0], qty: 1 }])}>
                  + Ajouter ligne
                </button>
                <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleSendEnterprise}>
                  Valider
                </button>
              </div>
            )}

            {/* PARTENAIRES */}
            {currentTab === "partners" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="handshake" /> Partenaires
                </h2>

                <div className="inp-group">
                  <label className="inp-label">N° Facture</label>
                  <input className="inp-field" value={parNum} onChange={(e) => setParNum(e.target.value)} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="inp-group">
                    <label className="inp-label">Société</label>
                    <select className="inp-field" value={parCompany} onChange={(e) => setParCompany(e.target.value)}>
                      {Object.keys(data.partners.companies).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inp-group">
                    <label className="inp-label">Bénéficiaire</label>
                    <select className="inp-field" value={parBenef} onChange={(e) => setParBenef(e.target.value)}>
                      {parCompany &&
                        data.partners.companies[parCompany].beneficiaries.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {parItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <select
                      className="inp-field"
                      value={item.menu}
                      onChange={(e) => {
                        const n = [...parItems];
                        n[i].menu = e.target.value;
                        setParItems(n);
                      }}
                      style={{ flex: 1 }}
                    >
                      {parCompany &&
                        data.partners.companies[parCompany].menus.map((m) => (
                          <option key={m.name} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      className="inp-field"
                      style={{ width: 110, textAlign: "center" }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...parItems];
                        n[i].qty = e.target.value;
                        setParItems(n);
                      }}
                    />

                    <button
                      className="qb"
                      style={{ color: "#ef4444" }}
                      onClick={() => {
                        const n = [...parItems];
                        n.splice(i, 1);
                        setParItems(n);
                      }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={() => setParItems([...parItems, { menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }])}>
                  + Menu
                </button>
                <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleSendPartner}>
                  Confirmer
                </button>
              </div>
            )}

            {/* FRAIS */}
            {currentTab === "expenses" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="creditCard" /> Frais
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={expData.veh} onChange={(e) => setExpData({ ...expData, veh: e.target.value })}>
                    {data.vehicles.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Type</label>
                  <select className="inp-field" value={expData.kind} onChange={(e) => setExpData({ ...expData, kind: e.target.value })}>
                    <option>Essence</option>
                    <option>Réparation</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Montant ($)</label>
                  <input type="number" className="inp-field" value={expData.amt} onChange={(e) => setExpData({ ...expData, amt: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>
                  Déclarer
                </button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === "garage" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="car" /> Garage
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field" value={garData.veh} onChange={(e) => setGarData({ ...garData, veh: e.target.value })}>
                    {data.vehicles.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Action</label>
                  <select className="inp-field" value={garData.action} onChange={(e) => setGarData({ ...garData, action: e.target.value })}>
                    <option>Entrée</option>
                    <option>Sortie</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Essence (%)</label>
                  <input
                    type="range"
                    style={{ width: "100%" }}
                    value={garData.fuel}
                    onChange={(e) => setGarData({ ...garData, fuel: e.target.value })}
                  />
                  <div style={{ marginTop: 6, fontWeight: 900, color: "var(--text-muted)" }}>{garData.fuel}%</div>
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendGarage", { vehicle: garData.veh, action: garData.action, fuel: garData.fuel })}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === "support" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                  <Icon name="lifeBuoy" /> Support
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Sujet</label>
                  <select className="inp-field" value={supData.sub} onChange={(e) => setSupData({ ...supData, sub: e.target.value })}>
                    <option>Problème Stock</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Message</label>
                  <textarea className="inp-field" style={{ height: 110 }} value={supData.msg} onChange={(e) => setSupData({ ...supData, msg: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendSupport", { subject: supData.sub, message: supData.msg })}>
                  Envoyer
                </button>
              </div>
            )}
          </main>

          {/* CART */}
          {currentTab === "invoices" && (
            <>
              <div className="cart-btn-float" onClick={() => setCartOpen(true)}>
                <Icon name="cart" size={22} /> <span>{formatMoney(sessionTotal)}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
                <div className="cart-head">
                  <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                    <Icon name="cart" /> Panier
                  </h2>
                  <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Icon name="x" size={24} />
                  </button>
                </div>

                <div style={{ padding: 16 }}>
                  <input
                    className="inp-field"
                    placeholder="N° Facture (Obligatoire)"
                    style={{ textAlign: "center" }}
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                  />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && (
                    <div style={{ textAlign: "center", marginTop: 50, color: "var(--text-muted)", fontWeight: 900 }}>
                      Panier vide
                    </div>
                  )}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <b style={{ fontWeight: 1000 }}>{c.name}</b>
                        <br />
                        <small style={{ color: "var(--text-muted)", fontWeight: 900 }}>{formatMoney(c.pu)}</small>
                      </div>

                      {/* ✅ quantité saisie au clavier */}
                      <div className="qty-ctrl">
                        <button className="qb" onClick={() => modQty(i, -1)}>-</button>
                        <input
                          className="qiInput"
                          type="number"
                          value={c.qty}
                          onChange={(e) => setQtyDirect(i, e.target.value)}
                        />
                        <button className="qb" onClick={() => modQty(i, 1)}>+</button>
                      </div>

                      <button className="qb" style={{ color: "#ef4444" }} onClick={() => setQtyDirect(i, 0)} title="Supprimer">
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 1000, marginBottom: 12 }}>
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>{formatMoney(sessionTotal)}</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>
                    Valider la vente
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* TOAST */}
          {toast && (
            <div
              className="toast"
              style={{
                borderLeft: `5px solid ${
                  toast.type === "error" ? "#ef4444" : toast.type === "success" ? "#10b981" : "var(--primary)"
                }`,
              }}
            >
              <div className="t-title">{toast.title}</div>
              <div className="t-msg">{toast.msg}</div>
            </div>
          )}

          {/* PROFIL MODAL */}
          {profileOpen && (
            <div className="modalOverlay" onClick={() => setProfileOpen(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHead">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                    <Icon name="user" /> Profil
                  </div>
                  <button onClick={() => setProfileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Icon name="x" size={22} />
                  </button>
                </div>

                <div className="modalBody">
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 18, background: "rgba(139,92,246,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 1000, fontSize: 18 }}>
                      {user?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 1000, fontSize: 18 }}>{user}</div>
                      <div style={{ color: "var(--text-muted)", fontWeight: 900 }}>{me?.role || "Employé"}</div>
                    </div>
                  </div>

                  <div className="grid2">
                    <div className="infoCard">
                      <div className="k">Téléphone</div>
                      <div className="v">{me?.phone || "—"}</div>
                    </div>
                    <div className="infoCard">
                      <div className="k">Date d’arrivée</div>
                      <div className="v">{me?.arrival || "—"}</div>
                    </div>
                    <div className="infoCard">
                      <div className="k">Ancienneté</div>
                      <div className="v">{me ? `${me.seniorityDays} jours` : "—"}</div>
                    </div>
                    <div className="infoCard">
                      <div className="k">Salaire</div>
                      <div className="v">{formatMoney(me?.salary || 0)}</div>
                    </div>
                    <div className="infoCard">
                      <div className="k">CA</div>
                      <div className="v">{formatMoney(me?.ca || 0)}</div>
                    </div>
                    <div className="infoCard">
                      <div className="k">Stock</div>
                      <div className="v">{Number(me?.stock || 0)}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <button className="btn btn-text" onClick={syncData}>
                      <Icon name="refresh" size={18} /> Sync données
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
