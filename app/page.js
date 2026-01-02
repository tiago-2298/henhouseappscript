"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// --- SVG ICONS ---
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
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M20 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM5 6H3v2a4 4 0 0 0 4 4M19 6h2v2a4 4 0 0 1-4 4" />,
    bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 0 1-3.46 0" />,
    volume: <path d="M11 5 6 9H2v6h4l5 4V5zM15 9a3 3 0 0 1 0 6M17.5 6.5a6 6 0 0 1 0 11" />,
    mute: <path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" />,
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

function clampInt(v, fallback = 1) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return n;
}

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

  const [darkMode, setDarkMode] = useState(true);
  const [quickMode, setQuickMode] = useState(false);

  // Son
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef(null);

  // Forms
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

  // Annuaire
  const [dirQuery, setDirQuery] = useState("");
  const [dirRole, setDirRole] = useState("Tous");
  const [dirOpen, setDirOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const currency = data?.currencySymbol || "$";

  const sessionTotal = useMemo(() => cart.reduce((a, b) => a + b.qty * b.pu, 0), [cart]);

  // ---- SON (beep sans fichier) ----
  const beep = (freq = 520, dur = 0.06, gain = 0.03) => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch {}
  };

  const notify = (title, msg, type = "info") => {
    setToast({ title, msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    // important: aide les contrôles natifs à respecter le thème
    document.documentElement.style.colorScheme = newTheme;
  };

  const login = () => {
    if (!user) return;
    setView("app");
    setCurrentTab("home");
  };

  const logout = () => {
    setUser("");
    setView("login");
    setCart([]);
    setInvNum("");
    setCartOpen(false);
  };

  const addToCart = (prod) => {
    const existing = cart.find((x) => x.name === prod);
    if (existing) {
      setCart(cart.map((x) => (x.name === prod ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { name: prod, qty: 1, pu: data.prices[prod] || 0 }]);
    }
    beep(650, 0.05, 0.03);
    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, nextQty) => {
    const newCart = [...cart];
    const q = clampInt(nextQty, 1);
    if (q <= 0) {
      newCart.splice(idx, 1);
    } else {
      newCart[idx].qty = q;
    }
    setCart(newCart);
  };

  const sendForm = async (action, payload) => {
    notify("Envoi…", "Veuillez patienter", "info");
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: { ...payload, employee: user } }),
      });
      const json = await res.json();
      if (json.success) {
        beep(880, 0.06, 0.03);
        beep(990, 0.06, 0.03);
        notify("Succès", "Action validée !", "success");

        // reset
        setCart([]);
        setInvNum("");
        setStockItems([{ product: data.products[0], qty: 1 }]);
        setEntItems([{ product: data.products[0], qty: 1 }]);
        setEntName("");
        const firstMenu = data.partners.companies[parCompany]?.menus?.[0]?.name || "";
        setParItems([{ menu: firstMenu, qty: 1 }]);
        setParNum("");
        setSupData({ sub: "Autre", msg: "" });
        setExpData((p) => ({ ...p, amt: "" }));
        setCartOpen(false);
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
    sendForm("sendFactures", { invoiceNumber: invNum, items: cart.map((x) => ({ desc: x.name, qty: x.qty })) });
  };

  const handleSendEnterprise = () => {
    if (!entName.trim()) return notify("Erreur", "Le nom de l'entreprise est OBLIGATOIRE", "error");
    sendForm("sendEntreprise", { company: entName, items: entItems });
  };

  const handleSendPartner = () => {
    if (!parNum.trim()) return notify("Erreur", "Le numéro de facture est OBLIGATOIRE", "error");
    sendForm("sendPartnerOrder", { company: parCompany, beneficiary: parBenef, invoiceNumber: parNum, items: parItems });
  };

  const handleSendExpense = () => {
    if (!expData.amt || Number(expData.amt) <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm("sendExpense", { vehicle: expData.veh, kind: expData.kind, amount: expData.amt });
  };

  // -------- INIT ----------
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";

    fetch("/api", { method: "POST", body: JSON.stringify({ action: "getMeta" }) })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);

        // defaults
        if (res.vehicles?.length) {
          setExpData((p) => ({ ...p, veh: res.vehicles[0] }));
          setGarData((p) => ({ ...p, veh: res.vehicles[0] }));
        }
        if (res.products?.length) {
          setStockItems([{ product: res.products[0], qty: 1 }]);
          setEntItems([{ product: res.products[0], qty: 1 }]);
        }
        if (res.partners && Object.keys(res.partners.companies).length) {
          const firstC = Object.keys(res.partners.companies)[0];
          setParCompany(firstC);
          const comp = res.partners.companies[firstC];
          setParBenef(comp?.beneficiaries?.[0] || "");
          setParItems([{ menu: comp?.menus?.[0]?.name || "", qty: 1 }]);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur chargement");
      });
  }, []);

  // Update Partner options when company changes
  useEffect(() => {
    if (!data || !parCompany) return;
    const comp = data.partners.companies[parCompany];
    if (comp?.beneficiaries?.length) setParBenef(comp.beneficiaries[0]);
    if (comp?.menus?.length) setParItems([{ menu: comp.menus[0].name, qty: 1 }]);
  }, [parCompany, data]);

  const myProfile = useMemo(() => {
    if (!data?.directory || !user) return null;
    return data.directory.find((e) => e.name === user) || null;
  }, [data, user]);

  const dirRoles = useMemo(() => {
    const set = new Set((data?.directory || []).map((e) => e.role).filter(Boolean));
    return ["Tous", ...Array.from(set).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [data]);

  const directoryFiltered = useMemo(() => {
    const list = data?.directory || [];
    const q = dirQuery.trim().toLowerCase();
    return list.filter((e) => {
      const okRole = dirRole === "Tous" || e.role === dirRole;
      const okQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        (e.phone || "").toLowerCase().includes(q) ||
        (e.role || "").toLowerCase().includes(q);
      return okRole && okQ;
    });
  }, [data, dirQuery, dirRole]);

  // ----- UI: LOADING (skeleton) -----
  if (loading) {
    return (
      <>
        <style jsx global>{globalStyles}</style>
        <div className="loading-wrap">
          <div className="loading-card">
            <img src="https://i.goopics.net/dskmxi.png" className="loading-logo" />
            <div className="loading-title">Hen House</div>
            <div className="loading-sub">Connexion…</div>

            <div className="sk-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sk-card shimmer" />
              ))}
            </div>

            <div className="loading-foot">v{data?.version || "…"} • Chargement des données</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{globalStyles}</style>

      {view === "login" ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 18 }} />
            <h2 style={{ marginBottom: 8 }}>Bienvenue</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 18 }}>
              Connectez-vous pour commencer • <span style={{ opacity: 0.8 }}>v{data.version}</span>
            </p>

            {/* ✅ SELECT DARK (plus blanc) */}
            <select className="inp-field select-dark" value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="">Sélectionner un nom…</option>
              {data?.employees?.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 10 }}>
              <button className="pill" onClick={toggleTheme}>
                {darkMode ? "Dark" : "Light"}
              </button>
              <button className="pill" onClick={() => setSoundOn((s) => !s)}>
                {soundOn ? "Son: ON" : "Son: OFF"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <aside className={`sidebar ${quickMode ? "quick" : ""}`}>
            <div className="brand">
              <img src="https://i.goopics.net/dskmxi.png" alt="Logo" />
              HEN HOUSE
            </div>

            <nav className="nav-list">
              <button className={`nav-btn ${currentTab === "home" ? "active" : ""}`} onClick={() => setCurrentTab("home")}>
                <Icon name="dashboard" /> Tableau de bord
              </button>
              <button
                className={`nav-btn ${currentTab === "invoices" ? "active" : ""}`}
                onClick={() => setCurrentTab("invoices")}
              >
                <Icon name="receipt" /> Caisse
              </button>
              <button className={`nav-btn ${currentTab === "stock" ? "active" : ""}`} onClick={() => setCurrentTab("stock")}>
                <Icon name="package" /> Stock
              </button>
              <button
                className={`nav-btn ${currentTab === "enterprise" ? "active" : ""}`}
                onClick={() => setCurrentTab("enterprise")}
              >
                <Icon name="building" /> Entreprise
              </button>
              <button
                className={`nav-btn ${currentTab === "partners" ? "active" : ""}`}
                onClick={() => setCurrentTab("partners")}
              >
                <Icon name="handshake" /> Partenaires
              </button>
              <button
                className={`nav-btn ${currentTab === "expenses" ? "active" : ""}`}
                onClick={() => setCurrentTab("expenses")}
              >
                <Icon name="creditCard" /> Frais
              </button>
              <button className={`nav-btn ${currentTab === "garage" ? "active" : ""}`} onClick={() => setCurrentTab("garage")}>
                <Icon name="car" /> Garage
              </button>

              {/* ✅ Annuaire + Performance */}
              <button
                className={`nav-btn ${currentTab === "directory" ? "active" : ""}`}
                onClick={() => setCurrentTab("directory")}
              >
                <Icon name="users" /> Annuaire
              </button>
              <button
                className={`nav-btn ${currentTab === "performance" ? "active" : ""}`}
                onClick={() => setCurrentTab("performance")}
              >
                <Icon name="trophy" /> Performance
              </button>

              <button
                className={`nav-btn ${currentTab === "support" ? "active" : ""}`}
                onClick={() => setCurrentTab("support")}
              >
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            {/* ✅ BAS GAUCHE : propre */}
            <div className="profileCard">
              <div className="profileTop">
                <div className="avatarLg">{user?.charAt(0) || "?"}</div>
                <div style={{ flex: 1 }}>
                  <div className="profileName">{user}</div>
                  <div className="profileMeta">
                    <span className="badge">{myProfile?.role || "Employé"}</span>
                    <span className="muted">• {myProfile?.seniority ?? 0} j</span>
                  </div>
                </div>
              </div>

              <div className="profileStats">
                <div className="statMini">
                  <span>CA</span>
                  <b>
                    {currency}
                    {(myProfile?.ca || 0).toFixed(0)}
                  </b>
                </div>
                <div className="statMini">
                  <span>Stock</span>
                  <b>{(myProfile?.stock || 0).toFixed(0)}</b>
                </div>
              </div>

              <div className="profileActions">
                <button className="btnMini" onClick={() => setCurrentTab("directory")}>
                  <Icon name="users" size={16} /> Annuaire
                </button>
                <button className="btnMini" onClick={() => setSelectedEmp(myProfile) || setDirOpen(true)}>
                  <Icon name="dashboard" size={16} /> Profil
                </button>
                <button className="btnMini danger" onClick={logout}>
                  <Icon name="logout" size={16} /> Quitter
                </button>
              </div>

              <div className="tinyToggles">
                <button className="pill" onClick={toggleTheme}>
                  {darkMode ? "☀" : "🌙"}
                </button>
                <button className="pill" onClick={() => setSoundOn((s) => !s)} title="Son">
                  {soundOn ? <Icon name="volume" size={16} /> : <Icon name="mute" size={16} />}
                </button>
              </div>
            </div>
          </aside>

          <main className={`main-content ${quickMode ? "quick" : ""}`}>
            <header className="header-bar">
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
                {currentTab === "directory" && (
                  <>
                    <Icon name="users" size={32} /> Annuaire
                  </>
                )}
                {currentTab === "performance" && (
                  <>
                    <Icon name="trophy" size={32} /> Performance
                  </>
                )}
              </div>

              <div className="top-stats">
                <div className="mini-stat">
                  Session:{" "}
                  <strong>
                    {currency}
                    {sessionTotal.toFixed(2)}
                  </strong>
                </div>

                <label className="toggle">
                  <span>Mode rapide</span>
                  <input type="checkbox" checked={quickMode} onChange={() => setQuickMode((q) => !q)} />
                  <span className="slider" />
                </label>

                <button className="theme-btn" onClick={toggleTheme} title="Thème">
                  {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === "home" && (
              <>
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

                  <div className="dash-card" onClick={() => setCurrentTab("performance")}>
                    <div className="dash-icon">
                      <Icon name="trophy" size={28} />
                    </div>
                    <div>
                      <div className="dash-title">Classements</div>
                      <div className="dash-desc">Top CA & Production</div>
                    </div>
                  </div>
                </div>

                <div className="homeRow">
                  <div className="panel">
                    <div className="panelHead">
                      <b>🏆 Top CA</b>
                      <span className="muted">Top 5</span>
                    </div>
                    <div className="rankList">
                      {(data.leaderboard?.topCA || []).map((p, i) => (
                        <div key={p.name} className="rankItem" onClick={() => (setSelectedEmp(p), setDirOpen(true))}>
                          <span className="rankN">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                          <span className="rankName">{p.name}</span>
                          <span className="rankVal">
                            {currency}
                            {Number(p.ca || 0).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panelHead">
                      <b>📦 Top Production</b>
                      <span className="muted">Top 5</span>
                    </div>
                    <div className="rankList">
                      {(data.leaderboard?.topStock || []).map((p, i) => (
                        <div key={p.name} className="rankItem" onClick={() => (setSelectedEmp(p), setDirOpen(true))}>
                          <span className="rankN">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                          <span className="rankName">{p.name}</span>
                          <span className="rankVal">{Number(p.stock || 0).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CAISSE */}
            {currentTab === "invoices" && (
              <>
                <div className="search-container">
                  <div className="search-icon">
                    <Icon name="search" size={20} />
                  </div>
                  <input className="search-inp" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="cat-pills">
                  <button className={`pill ${catFilter === "Tous" ? "active" : ""}`} onClick={() => setCatFilter("Tous")}>
                    Tous
                  </button>
                  {Object.keys(data.productsByCategory).map((c) => (
                    <button
                      key={c}
                      className={`pill ${catFilter === c ? "active" : ""}`}
                      onClick={() => setCatFilter(c)}
                    >
                      {c.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>

                <div className="prod-grid">
                  {data.products
                    .filter((p) => {
                      const cat = Object.keys(data.productsByCategory).find((k) => data.productsByCategory[k].includes(p));
                      return (catFilter === "Tous" || cat === catFilter) && p.toLowerCase().includes(search.toLowerCase());
                    })
                    .map((p) => (
                      <button key={p} className="prod-card" onClick={() => addToCart(p)}>
                        {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img letter">{p.charAt(0)}</div>}
                        <div className="prod-title">{p}</div>
                        <div className="prod-price">
                          {currency}
                          {Number(data.prices[p] || 0).toFixed(0)}
                        </div>
                      </button>
                    ))}
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === "stock" && (
              <div className="form-wrap">
                <h2 className="form-title">
                  <Icon name="package" /> Déclaration Stock
                </h2>

                {stockItems.map((item, i) => (
                  <div key={i} className="rowLine">
                    <select
                      className="inp-field select-dark"
                      value={item.product}
                      onChange={(e) => {
                        const n = [...stockItems];
                        n[i].product = e.target.value;
                        setStockItems(n);
                      }}
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

                    {/* ✅ clavier */}
                    <input
                      type="number"
                      className="inp-field qty"
                      value={item.qty}
                      inputMode="numeric"
                      step="1"
                      onChange={(e) => {
                        const n = [...stockItems];
                        n[i].qty = e.target.value;
                        setStockItems(n);
                      }}
                    />

                    <button className="iconBtn danger" onClick={() => setStockItems(stockItems.filter((_, idx) => idx !== i))}>
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
                <h2 className="form-title">
                  <Icon name="building" /> Commande Pro
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={(e) => setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} className="rowLine">
                    <select
                      className="inp-field select-dark"
                      value={item.product}
                      onChange={(e) => {
                        const n = [...entItems];
                        n[i].product = e.target.value;
                        setEntItems(n);
                      }}
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
                      className="inp-field qty"
                      inputMode="numeric"
                      step="1"
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...entItems];
                        n[i].qty = e.target.value;
                        setEntItems(n);
                      }}
                    />

                    <button className="iconBtn danger" onClick={() => setEntItems(entItems.filter((_, idx) => idx !== i))}>
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
                <h2 className="form-title">
                  <Icon name="handshake" /> Partenaires
                </h2>

                <div className="inp-group">
                  <label className="inp-label">N° Facture</label>
                  <input className="inp-field" value={parNum} onChange={(e) => setParNum(e.target.value)} />
                </div>

                <div className="grid2">
                  <div className="inp-group">
                    <label className="inp-label">Société</label>
                    <select className="inp-field select-dark" value={parCompany} onChange={(e) => setParCompany(e.target.value)}>
                      {Object.keys(data.partners.companies).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inp-group">
                    <label className="inp-label">Bénéficiaire</label>
                    <select className="inp-field select-dark" value={parBenef} onChange={(e) => setParBenef(e.target.value)}>
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
                  <div key={i} className="rowLine">
                    <select
                      className="inp-field select-dark"
                      value={item.menu}
                      onChange={(e) => {
                        const n = [...parItems];
                        n[i].menu = e.target.value;
                        setParItems(n);
                      }}
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
                      className="inp-field qty"
                      inputMode="numeric"
                      step="1"
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...parItems];
                        n[i].qty = e.target.value;
                        setParItems(n);
                      }}
                    />

                    <button className="iconBtn danger" onClick={() => setParItems(parItems.filter((_, idx) => idx !== i))}>
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button
                  className="btn btn-text"
                  onClick={() =>
                    setParItems([...parItems, { menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }])
                  }
                >
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
                <h2 className="form-title">
                  <Icon name="creditCard" /> Frais
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field select-dark" value={expData.veh} onChange={(e) => setExpData({ ...expData, veh: e.target.value })}>
                    {data.vehicles.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Type</label>
                  <select className="inp-field select-dark" value={expData.kind} onChange={(e) => setExpData({ ...expData, kind: e.target.value })}>
                    <option>Essence</option>
                    <option>Réparation</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Montant ({currency})</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="inp-field"
                    value={expData.amt}
                    onChange={(e) => setExpData({ ...expData, amt: e.target.value })}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>
                  Déclarer
                </button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === "garage" && (
              <div className="form-wrap">
                <h2 className="form-title">
                  <Icon name="car" /> Garage
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Véhicule</label>
                  <select className="inp-field select-dark" value={garData.veh} onChange={(e) => setGarData({ ...garData, veh: e.target.value })}>
                    {data.vehicles.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Action</label>
                  <select className="inp-field select-dark" value={garData.action} onChange={(e) => setGarData({ ...garData, action: e.target.value })}>
                    <option>Entrée</option>
                    <option>Sortie</option>
                    <option>Maintenance</option>
                    <option>Réparation</option>
                  </select>
                </div>

                <div className="inp-group">
                  <label className="inp-label">Essence (%)</label>
                  <input type="range" className="range" value={garData.fuel} onChange={(e) => setGarData({ ...garData, fuel: e.target.value })} />
                  <div className="muted">{garData.fuel}%</div>
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendGarage", { vehicle: garData.veh, action: garData.action, fuel: garData.fuel })}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === "support" && (
              <div className="form-wrap">
                <h2 className="form-title">
                  <Icon name="lifeBuoy" /> Support
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Sujet</label>
                  <select className="inp-field select-dark" value={supData.sub} onChange={(e) => setSupData({ ...supData, sub: e.target.value })}>
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

            {/* ANNUAIRE */}
            {currentTab === "directory" && (
              <>
                <div className="dirBar">
                  <div className="search-container" style={{ marginBottom: 0, maxWidth: 520 }}>
                    <div className="search-icon">
                      <Icon name="search" size={20} />
                    </div>
                    <input
                      className="search-inp"
                      placeholder="Rechercher nom / téléphone / poste…"
                      value={dirQuery}
                      onChange={(e) => setDirQuery(e.target.value)}
                    />
                  </div>

                  <select className="inp-field select-dark" style={{ maxWidth: 240 }} value={dirRole} onChange={(e) => setDirRole(e.target.value)}>
                    {dirRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dirGrid">
                  {directoryFiltered.map((p) => (
                    <button key={p.name} className="dirCard" onClick={() => (setSelectedEmp(p), setDirOpen(true))}>
                      <div className="dirTop">
                        <div className="avatarLg">{p.name?.charAt(0) || "?"}</div>
                        <div style={{ flex: 1 }}>
                          <div className="dirName">{p.name}</div>
                          <div className="dirMeta">
                            <span className="badge">{p.role || "Employé"}</span>
                            <span className="muted">• {p.seniority ?? 0} j</span>
                          </div>
                        </div>
                      </div>

                      <div className="dirBottom">
                        <div className="muted">{p.phone || "—"}</div>
                        <div className="dirQuick">
                          <span className="dirMini">
                            CA: <b>{currency + Number(p.ca || 0).toFixed(0)}</b>
                          </span>
                          <span className="dirMini">
                            Stock: <b>{Number(p.stock || 0).toFixed(0)}</b>
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* PERFORMANCE */}
            {currentTab === "performance" && (
              <div className="perfGrid">
                <div className="panel">
                  <div className="panelHead">
                    <b>🏆 Top CA</b>
                    <span className="muted">Top 5</span>
                  </div>
                  <div className="rankList">
                    {(data.leaderboard?.topCA || []).map((p, i) => (
                      <div key={p.name} className="rankItem" onClick={() => (setSelectedEmp(p), setDirOpen(true))}>
                        <span className="rankN">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <span className="rankName">{p.name}</span>
                        <span className="rankVal">
                          {currency}
                          {Number(p.ca || 0).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panelHead">
                    <b>📦 Top Production</b>
                    <span className="muted">Top 5</span>
                  </div>
                  <div className="rankList">
                    {(data.leaderboard?.topStock || []).map((p, i) => (
                      <div key={p.name} className="rankItem" onClick={() => (setSelectedEmp(p), setDirOpen(true))}>
                        <span className="rankN">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                        <span className="rankName">{p.name}</span>
                        <span className="rankVal">{Number(p.stock || 0).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* CART */}
          {currentTab === "invoices" && (
            <>
              <button className="cart-btn-float" onClick={() => setCartOpen(true)}>
                <Icon name="cart" size={24} />{" "}
                <span>
                  {currency}
                  {sessionTotal.toFixed(2)}
                </span>
              </button>

              <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
                <div className="cart-head">
                  <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="cart" /> Panier
                  </h2>
                  <button className="iconBtn" onClick={() => setCartOpen(false)}>
                    <Icon name="x" size={22} />
                  </button>
                </div>

                <div style={{ padding: 18 }}>
                  <input
                    className="inp-field"
                    placeholder="N° Facture (Obligatoire)"
                    style={{ textAlign: "center", fontWeight: 800 }}
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                  />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div className="empty">Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <b>{c.name}</b>
                        <div className="muted">
                          {currency}
                          {Number(c.pu).toFixed(2)}
                        </div>
                      </div>

                      {/* ✅ quantité clavier */}
                      <div className="qty-ctrl">
                        <button className="qb" onClick={() => modQty(i, c.qty - 1)}>
                          -
                        </button>
                        <input
                          className="qiInput"
                          type="number"
                          inputMode="numeric"
                          step="1"
                          min="0"
                          value={c.qty}
                          onChange={(e) => modQty(i, e.target.value)}
                        />
                        <button className="qb" onClick={() => modQty(i, c.qty + 1)}>
                          +
                        </button>
                      </div>

                      <button className="iconBtn danger" onClick={() => setCart(cart.filter((_, idx) => idx !== i))}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div className="totalRow">
                    <span>Total</span>
                    <span className="totalVal">
                      {currency}
                      {sessionTotal.toFixed(2)}
                    </span>
                  </div>
                  <button className="btn btn-primary" onClick={handleSendInvoice}>
                    Valider la vente
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* MODAL PROFIL EMPLOYÉ */}
          {dirOpen && selectedEmp && (
            <div className="modalBack" onClick={() => setDirOpen(false)}>
              <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                <div className="modalHead">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatarLg">{selectedEmp.name?.charAt(0) || "?"}</div>
                    <div>
                      <div className="dirName">{selectedEmp.name}</div>
                      <div className="dirMeta">
                        <span className="badge">{selectedEmp.role || "Employé"}</span>
                        <span className="muted">• {selectedEmp.seniority ?? 0} jours</span>
                      </div>
                    </div>
                  </div>
                  <button className="iconBtn" onClick={() => setDirOpen(false)}>
                    <Icon name="x" size={20} />
                  </button>
                </div>

                <div className="modalBody">
                  <div className="infoRow">
                    <span className="muted">Téléphone</span>
                    <div className="infoRight">
                      <b>{selectedEmp.phone || "—"}</b>
                      {selectedEmp.phone && (
                        <button
                          className="btnMini"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedEmp.phone);
                            notify("Copié", "Numéro copié", "success");
                            beep(740, 0.05, 0.03);
                          }}
                        >
                          Copier
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="infoRow">
                    <span className="muted">Date d'arrivée</span>
                    <b>{selectedEmp.arrival || "—"}</b>
                  </div>

                  <div className="stats3">
                    <div className="statBox">
                      <span>CA</span>
                      <b>
                        {currency}
                        {Number(selectedEmp.ca || 0).toFixed(0)}
                      </b>
                    </div>
                    <div className="statBox">
                      <span>Stock</span>
                      <b>{Number(selectedEmp.stock || 0).toFixed(0)}</b>
                    </div>
                    <div className="statBox">
                      <span>Salaire</span>
                      <b>
                        {currency}
                        {Number(selectedEmp.salary || 0).toFixed(0)}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOAST */}
          {toast && (
            <div className="toast" data-type={toast.type}>
              <div className="t-title">{toast.title}</div>
              <div className="t-msg">{toast.msg}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ----------------- GLOBAL STYLES -----------------
const globalStyles = `
:root{
  --primary:#8b5cf6; /* purple */
  --primary-light: rgba(139,92,246,.16);
  --bg-body:#0f1115;
  --bg-panel:#171a21;
  --bg-panel-2:#12151b;
  --text-main:#f8fafc;
  --text-muted:#94a3b8;
  --border:#2a2f3a;
  --radius:24px;
  --sidebar-w:270px;
}
[data-theme="light"]{
  --bg-body:#f7f8fc;
  --bg-panel:#ffffff;
  --bg-panel-2:#f2f4f8;
  --text-main:#111827;
  --text-muted:#6b7280;
  --border:#e5e7eb;
  --primary-light: rgba(139,92,246,.15);
}

*{box-sizing:border-box;margin:0;padding:0;outline:none;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  background: var(--bg-body);
  color: var(--text-main);
  overflow:hidden;
}

/* ✅ IMPORTANT: force les contrôles natifs */
html{ color-scheme: dark; }
[data-theme="light"]{ color-scheme: light; }

/* -------- LOADING -------- */
.loading-wrap{height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.loading-card{
  width:min(860px, 94vw);
  border:1px solid var(--border);
  background:linear-gradient(180deg, var(--bg-panel), var(--bg-panel-2));
  border-radius:32px;
  padding:28px;
  box-shadow:0 30px 60px rgba(0,0,0,.35);
}
.loading-logo{height:56px;border-radius:14px;margin-bottom:10px}
.loading-title{font-weight:900;font-size:1.2rem}
.loading-sub{color:var(--text-muted);margin-top:4px}
.loading-foot{color:var(--text-muted);margin-top:16px;font-size:.9rem}
.sk-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:16px}
.sk-card{height:72px;border-radius:18px;border:1px solid var(--border);background:rgba(255,255,255,.04)}
@media (max-width:900px){.sk-grid{grid-template-columns:repeat(2,1fr)}}
.shimmer{
  background:linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.10), rgba(255,255,255,.04));
  background-size:200% 100%;
  animation:shimmer 1.2s infinite;
}
@keyframes shimmer{0%{background-position:0% 0}100%{background-position:200% 0}}

/* SIDEBAR */
.sidebar{
  width:var(--sidebar-w);
  height:96vh;
  margin:2vh;
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:var(--radius);
  display:flex;
  flex-direction:column;
  padding:22px;
  border:1px solid var(--border);
  box-shadow:0 20px 40px rgba(0,0,0,.25);
}
.brand{display:flex;align-items:center;gap:12px;font-weight:900;font-size:1.1rem;margin-bottom:18px}
.brand img{height:32px;border-radius:10px}
.nav-list{display:flex;flex-direction:column;gap:8px;flex:1;overflow:auto;padding-right:2px}
.nav-btn{
  display:flex;align-items:center;gap:12px;
  padding:12px 14px;border-radius:14px;border:none;background:transparent;
  color:var(--text-muted);font-weight:800;cursor:pointer;
  transition:.18s;
}
.nav-btn:hover{background:rgba(255,255,255,.04);color:var(--text-main)}
.nav-btn.active{background:var(--primary);color:white;box-shadow:0 14px 30px rgba(139,92,246,.25)}
.nav-btn.active svg{stroke-width:3}

/* BAS GAUCHE PROFIL */
.profileCard{
  margin-top:14px;
  padding:14px;
  border-radius:20px;
  border:1px solid var(--border);
  background:rgba(0,0,0,.10);
}
.profileTop{display:flex;align-items:center;gap:12px}
.avatarLg{
  width:42px;height:42px;border-radius:16px;
  background:var(--primary);
  display:flex;align-items:center;justify-content:center;
  font-weight:900;color:white;
}
.profileName{font-weight:900}
.profileMeta{display:flex;align-items:center;gap:8px;margin-top:2px}
.badge{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 10px;border-radius:999px;
  background:rgba(255,255,255,.07);
  border:1px solid var(--border);
  font-weight:800;font-size:.78rem;color:var(--text-main);
}
.muted{color:var(--text-muted)}
.profileStats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.statMini{
  border:1px solid var(--border);
  background:rgba(255,255,255,.04);
  border-radius:14px;padding:10px;
  display:flex;flex-direction:column;gap:4px;
  font-size:.85rem;
}
.statMini b{font-size:1rem}
.profileActions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}
.btnMini{
  display:flex;align-items:center;justify-content:center;gap:8px;
  padding:10px;border-radius:14px;border:1px solid var(--border);
  background:rgba(255,255,255,.04);color:var(--text-main);
  font-weight:900;cursor:pointer;transition:.15s;
}
.btnMini:hover{transform:translateY(-1px);border-color:rgba(139,92,246,.55)}
.btnMini.danger{border-color:rgba(239,68,68,.45);color:#fecaca}
.btnMini.danger:hover{border-color:#ef4444}
.tinyToggles{display:flex;gap:10px;margin-top:10px;justify-content:flex-end}

/* MAIN */
.main-content{flex:1;padding:2vh 2vh 2vh 0;overflow:auto}
.header-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding:0 10px}
.page-title{font-size:1.75rem;font-weight:950;display:flex;align-items:center;gap:10px}
.top-stats{display:flex;gap:12px;align-items:center}
.mini-stat{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  padding:10px 16px;border-radius:999px;border:1px solid var(--border);
  display:flex;gap:10px;align-items:center;font-weight:800;font-size:.92rem;color:var(--text-muted);
}
.mini-stat strong{color:var(--text-main)}
.theme-btn{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border:1px solid var(--border);
  width:42px;height:42px;border-radius:999px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-main);transition:.15s;
}
.theme-btn:hover{transform:rotate(10deg)}

/* Toggle */
.toggle{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid var(--border);padding:10px 12px;border-radius:999px;font-weight:800;color:var(--text-muted)}
.toggle input{display:none}
.toggle .slider{
  width:46px;height:26px;border-radius:999px;border:1px solid var(--border);
  background:rgba(255,255,255,.06);position:relative;display:inline-block;
}
.toggle .slider:after{
  content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:999px;
  background:var(--text-main);transition:.2s;
}
.toggle input:checked + .slider{background:rgba(139,92,246,.28);border-color:rgba(139,92,246,.55)}
.toggle input:checked + .slider:after{transform:translateX(20px);background:var(--primary)}
.toggle span{font-size:.9rem}

/* DASHBOARD */
.dashboard-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.dash-card{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:var(--radius);
  padding:24px;border:1px solid var(--border);
  cursor:pointer;transition:.2s;
  display:flex;flex-direction:column;justify-content:space-between;height:170px;
}
.dash-card:hover{transform:translateY(-4px);border-color:rgba(139,92,246,.55);box-shadow:0 18px 40px rgba(0,0,0,.25)}
.dash-icon{width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;color:var(--primary)}
.dash-title{font-size:1.15rem;font-weight:950;margin-bottom:4px}
.dash-desc{font-size:.92rem;color:var(--text-muted)}

/* Home panels */
.homeRow{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
@media (max-width:1100px){.homeRow{grid-template-columns:1fr}}
.panel{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border:1px solid var(--border);
  border-radius:24px;padding:18px;
}
.panelHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.rankList{display:flex;flex-direction:column;gap:8px}
.rankItem{
  display:grid;grid-template-columns:48px 1fr auto;
  align-items:center;gap:10px;
  padding:12px 12px;border-radius:16px;
  border:1px solid var(--border);
  background:rgba(255,255,255,.04);
  cursor:pointer;transition:.15s;
}
.rankItem:hover{border-color:rgba(139,92,246,.55);transform:translateY(-1px)}
.rankN{font-weight:950}
.rankName{font-weight:900}
.rankVal{font-weight:950;color:var(--primary)}

/* SEARCH + PILLS */
.search-container{position:relative;margin-bottom:16px;max-width:520px}
.search-inp{
  width:100%;
  padding:14px 16px 14px 46px;
  border-radius:18px;border:1px solid var(--border);
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  font-size:1rem;color:var(--text-main);font-weight:800;
}
.search-inp:focus{border-color:rgba(139,92,246,.65);box-shadow:0 0 0 3px var(--primary-light)}
.search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text-muted)}
.cat-pills{display:flex;gap:10px;overflow:auto;padding-bottom:8px;margin-bottom:16px}
.pill{
  padding:8px 14px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--border);
  border-radius:999px;
  font-weight:900;cursor:pointer;white-space:nowrap;
  transition:.15s;color:var(--text-muted)
}
.pill:hover,.pill.active{border-color:rgba(139,92,246,.65);color:white;background:var(--primary)}

/* PRODUITS */
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px}
.prod-card{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:20px;padding:14px;text-align:center;
  border:1px solid var(--border);cursor:pointer;
  transition:.18s;position:relative;
  display:flex;flex-direction:column;gap:10px;
}
.prod-card:hover{border-color:rgba(139,92,246,.55);transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.25)}
.prod-img{
  width:100%;aspect-ratio:1;border-radius:16px;object-fit:cover;
  background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;
}
.prod-img.letter{font-size:2rem;font-weight:950;color:var(--text-muted)}
.prod-title{font-weight:900;font-size:.92rem;line-height:1.2;min-height:40px;display:flex;align-items:center;justify-content:center}
.prod-price{color:var(--primary);font-weight:950;font-size:1.05rem}

/* CART */
.cart-drawer{
  position:fixed;top:0;right:0;width:420px;height:100vh;
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  box-shadow:-20px 0 60px rgba(0,0,0,.35);
  z-index:100;transform:translateX(100%);
  transition:transform .35s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;border-left:1px solid var(--border);
}
.cart-drawer.open{transform:translateX(0)}
.cart-head{padding:18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border)}
.cart-body{flex:1;overflow:auto;padding:14px}
.cart-foot{padding:18px;background:rgba(255,255,255,.03);border-top:1px solid var(--border)}
.cart-item{
  display:flex;align-items:center;gap:12px;
  padding:12px;background:rgba(255,255,255,.04);
  border-radius:16px;margin-bottom:10px;border:1px solid var(--border);
}
.qty-ctrl{display:flex;align-items:center;background:rgba(255,255,255,.03);border-radius:12px;border:1px solid var(--border);overflow:hidden}
.qb{width:34px;height:34px;border:none;background:transparent;cursor:pointer;color:var(--text-main);font-weight:950}
.qiInput{
  width:52px;border:none;background:transparent;text-align:center;
  font-weight:950;color:var(--text-main);
  padding:6px 0;
}
.qiInput::-webkit-outer-spin-button,.qiInput::-webkit-inner-spin-button{ -webkit-appearance: none; margin: 0; }
.qiInput{ -moz-appearance: textfield; }
.iconBtn{
  width:38px;height:38px;border-radius:12px;border:1px solid var(--border);
  background:rgba(255,255,255,.04);cursor:pointer;color:var(--text-main);
  display:flex;align-items:center;justify-content:center;transition:.15s;
}
.iconBtn:hover{transform:translateY(-1px);border-color:rgba(139,92,246,.55)}
.iconBtn.danger{border-color:rgba(239,68,68,.45);color:#fecaca}
.iconBtn.danger:hover{border-color:#ef4444}
.empty{text-align:center;margin-top:40px;color:var(--text-muted)}
.totalRow{display:flex;justify-content:space-between;font-size:1.3rem;font-weight:950;margin-bottom:12px}
.totalVal{color:var(--primary)}
.cart-btn-float{
  position:fixed;bottom:28px;right:28px;
  background:var(--text-main);color:var(--bg-panel);
  padding:14px 18px;border-radius:999px;font-weight:950;
  cursor:pointer;box-shadow:0 16px 40px rgba(0,0,0,.35);
  display:flex;align-items:center;gap:10px;z-index:90;border:none;
}
.cart-btn-float:hover{transform:scale(1.03)}

/* FORMS */
.form-wrap{
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  padding:26px;border-radius:28px;max-width:640px;margin:0 auto;
  border:1px solid var(--border);box-shadow:0 20px 50px rgba(0,0,0,.25)
}
.form-title{margin-bottom:16px;display:flex;align-items:center;gap:10px;font-weight:950}
.inp-group{margin-bottom:14px}
.inp-label{display:block;margin-bottom:8px;font-weight:900;font-size:.9rem;color:var(--text-muted)}
.inp-field{
  width:100%;padding:14px;border:1px solid var(--border);
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:14px;font-size:1rem;font-weight:800;color:var(--text-main);
}
.inp-field:focus{border-color:rgba(139,92,246,.65);box-shadow:0 0 0 3px var(--primary-light)}
.rowLine{display:flex;gap:10px;align-items:center;margin-bottom:10px}
.inp-field.qty{width:110px;text-align:center;font-weight:950}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:700px){.grid2{grid-template-columns:1fr}}
.range{width:100%}

/* ✅ SELECT DARK FIX (plus blanc !) */
.select-dark{
  appearance:none;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-muted) 50%),
                    linear-gradient(135deg, var(--text-muted) 50%, transparent 50%),
                    linear-gradient(to right, transparent, transparent);
  background-position: calc(100% - 22px) calc(1em + 2px), calc(100% - 16px) calc(1em + 2px), 100% 0;
  background-size: 6px 6px, 6px 6px, 2.5em 2.5em;
  background-repeat: no-repeat;
  padding-right: 44px;
}
select.select-dark, select.select-dark option{
  background-color: var(--bg-panel) !important;
  color: var(--text-main) !important;
}
select.select-dark option{
  border: none;
}
select.select-dark option:checked{
  background: var(--primary) !important;
  color: white !important;
}

/* LOGIN */
#gate{position:fixed;inset:0;background:var(--bg-body);display:flex;align-items:center;justify-content:center}
.login-box{
  text-align:center;width:420px;max-width:92vw;
  padding:28px;border:1px solid var(--border);
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:30px;box-shadow:0 25px 60px rgba(0,0,0,.35)
}

/* BUTTONS */
.btn{
  width:100%;padding:14px;border:none;border-radius:16px;
  font-weight:950;font-size:1rem;cursor:pointer;transition:.15s;
  display:flex;justify-content:center;align-items:center;gap:10px;
}
.btn-primary{background:var(--primary);color:white;box-shadow:0 16px 30px rgba(139,92,246,.25)}
.btn-primary:hover{transform:translateY(-2px)}
.btn-text{background:transparent;border:1px dashed var(--border);color:var(--text-muted)}
.btn-text:hover{border-color:rgba(139,92,246,.6);color:var(--primary)}
.perfGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media (max-width:1100px){.perfGrid{grid-template-columns:1fr}}

/* ANNUAIRE */
.dirBar{display:flex;gap:12px;align-items:center;margin-bottom:14px}
.dirGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.dirCard{
  text-align:left;
  border:1px solid var(--border);
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  border-radius:22px;padding:14px;cursor:pointer;
  transition:.15s;
}
.dirCard:hover{border-color:rgba(139,92,246,.55);transform:translateY(-2px)}
.dirTop{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.dirName{font-weight:950}
.dirMeta{display:flex;gap:8px;align-items:center;margin-top:2px}
.dirBottom{display:flex;justify-content:space-between;align-items:center}
.dirQuick{display:flex;gap:10px}
.dirMini{font-size:.85rem;color:var(--text-muted)}
.dirMini b{color:var(--text-main)}

/* MODAL */
.modalBack{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:18px}
.modalCard{
  width:min(520px, 96vw);
  border-radius:26px;
  border:1px solid var(--border);
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  box-shadow:0 30px 80px rgba(0,0,0,.45);
}
.modalHead{display:flex;justify-content:space-between;align-items:center;padding:14px;border-bottom:1px solid var(--border)}
.modalBody{padding:14px}
.infoRow{display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);background:rgba(255,255,255,.04);border-radius:16px;margin-bottom:10px}
.infoRight{display:flex;gap:10px;align-items:center}
.stats3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.statBox{border:1px solid var(--border);background:rgba(255,255,255,.04);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px}
.statBox span{color:var(--text-muted);font-weight:900;font-size:.85rem}
.statBox b{font-weight:950}

/* TOAST */
.toast{
  position:fixed;top:22px;right:22px;z-index:3000;
  background:linear-gradient(180deg,var(--bg-panel),var(--bg-panel-2));
  padding:14px 18px;border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.35);
  border:1px solid var(--border);
  border-left:5px solid var(--primary);
  min-width:260px;
  animation:slideIn .22s ease-out;
}
.toast[data-type="error"]{border-left-color:#ef4444}
.toast[data-type="success"]{border-left-color:#10b981}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}}
.t-title{font-weight:950;margin-bottom:4px}
.t-msg{color:var(--text-muted);font-weight:800;font-size:.9rem}
`;
