"use client";
import { useEffect, useMemo, useState } from "react";

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
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M5 6H3v2a4 4 0 0 0 4 4" />
        <path d="M19 6h2v2a4 4 0 0 1-4 4" />
      </>
    ),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" />,
    copy: <path d="M8 8h12v12H8zM4 4h12v12H4z" />,
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

const THEMES = {
  Orange: { primary: "#ff6a2b", soft: "rgba(255,106,43,0.16)" },
  Mint: { primary: "#2dd4bf", soft: "rgba(45,212,191,0.16)" },
  Purple: { primary: "#8b5cf6", soft: "rgba(139,92,246,0.16)" },
};

const formatMoney = (n, sym = "$") => `${sym}${(Number(n) || 0).toFixed(2)}`;

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

  const [themeName, setThemeName] = useState("Purple");
  const [quickMode, setQuickMode] = useState(false);

  // forms
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

  // annuaire
  const [dirSearch, setDirSearch] = useState("");
  const [dirRole, setDirRole] = useState("Tous");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // INIT
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    applyThemeVars(themeName, true);

    fetch("/api", { method: "POST", body: JSON.stringify({ action: "getMeta" }) })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);

        if (res?.products?.length) {
          setStockItems([{ product: res.products[0], qty: 1 }]);
          setEntItems([{ product: res.products[0], qty: 1 }]);
        }

        if (res?.vehicles?.length) {
          setExpData((p) => ({ ...p, veh: res.vehicles[0] }));
          setGarData((p) => ({ ...p, veh: res.vehicles[0] }));
        }

        if (res?.partners?.companies && Object.keys(res.partners.companies).length) {
          setParCompany(Object.keys(res.partners.companies)[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur chargement");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && parCompany) {
      const comp = data.partners.companies[parCompany];
      if (comp?.beneficiaries?.length) setParBenef(comp.beneficiaries[0]);
      if (comp?.menus?.length) setParItems([{ menu: comp.menus[0].name, qty: 1 }]);
    }
  }, [parCompany, data]);

  const currencySymbol = data?.currencySymbol || "$";

  const notify = (title, msg, type = "info") => {
    setToast({ title, msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => {
    if (user) setView("app");
  };

  const logout = () => {
    setUser("");
    setView("login");
    setCurrentTab("home");
    setCart([]);
    setCartOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const applyThemeVars = (name, initial = false) => {
    const t = THEMES[name] || THEMES.Purple;
    document.documentElement.style.setProperty("--primary", t.primary);
    document.documentElement.style.setProperty("--primary-light", t.soft);
    if (!initial) notify("Thème", `Palette: ${name}`, "success");
  };

  const sessionTotal = useMemo(
    () => cart.reduce((a, b) => a + b.qty * b.pu, 0),
    [cart]
  );

  const addToCart = (prod) => {
    const existing = cart.find((x) => x.name === prod);
    if (existing) {
      setCart(cart.map((x) => (x.name === prod ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { name: prod, qty: 1, pu: data.prices[prod] || 0 }]);
    }
    // micro interaction
    const el = document.getElementById("cartFloat");
    if (el) {
      el.classList.remove("pop");
      // force reflow
      void el.offsetWidth;
      el.classList.add("pop");
    }
    notify("Ajouté", prod, "success");
    if (quickMode) setCartOpen(true);
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
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: { ...payload, employee: user } }),
      });
      const json = await res.json();

      if (json.success) {
        notify("Succès", "Action validée !", "success");

        // reset
        setCart([]);
        setInvNum("");
        setStockItems([{ product: data.products[0], qty: 1 }]);
        setEntItems([{ product: data.products[0], qty: 1 }]);
        setEntName("");
        setParItems([{ menu: data.partners.companies[parCompany]?.menus[0].name, qty: 1 }]);
        setParNum("");
        setSupData({ sub: "Autre", msg: "" });
        setExpData((p) => ({ ...p, amt: "" }));

        if (action === "sendFactures") {
          setCurrentTab("home");
          setCartOpen(false);
          // refresh stats after invoice
          fetch("/api", { method: "POST", body: JSON.stringify({ action: "getMeta" }) })
            .then((r) => r.json())
            .then((r) => setData(r))
            .catch(() => {});
        }
      } else {
        notify("Erreur", json.message, "error");
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
    if (!expData.amt || expData.amt <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm("sendExpense", { vehicle: expData.veh, kind: expData.kind, amount: expData.amt });
  };

  // --- EMPLOYEE DATA ---
  const employeesFull = data?.employeesFull || [];
  const me = useMemo(
    () => employeesFull.find((e) => e.name === user) || null,
    [employeesFull, user]
  );

  const topCA = useMemo(() => {
    return [...employeesFull].sort((a, b) => (b.ca || 0) - (a.ca || 0)).slice(0, 5);
  }, [employeesFull]);

  const topStock = useMemo(() => {
    return [...employeesFull].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5);
  }, [employeesFull]);

  const allRoles = useMemo(() => {
    const s = new Set(employeesFull.map((e) => e.role).filter(Boolean));
    return ["Tous", ...Array.from(s)];
  }, [employeesFull]);

  const filteredDirectory = useMemo(() => {
    const q = dirSearch.toLowerCase();
    return employeesFull.filter((e) => {
      const okRole = dirRole === "Tous" || e.role === dirRole;
      const okQ =
        !q ||
        (e.name || "").toLowerCase().includes(q) ||
        (e.phone || "").toLowerCase().includes(q) ||
        (e.role || "").toLowerCase().includes(q);
      return okRole && okQ;
    });
  }, [employeesFull, dirSearch, dirRole]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      notify("Copié", String(text || ""), "success");
    } catch {
      notify("Erreur", "Impossible de copier", "error");
    }
  };

  const formatArrival = (val) => {
    if (!val) return "-";
    // si google renvoie un nombre (date serial) => on laisse tel quel (sinon tu peux convertir)
    return String(val);
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1115",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center", width: 320 }}>
          <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 16 }} />
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Chargement Hen House...</div>
          <div className="skeleton" style={{ height: 14, borderRadius: 999 }} />
          <div className="skeleton" style={{ height: 14, borderRadius: 999, marginTop: 10, width: "70%", marginInline: "auto" }} />
        </div>
      </div>
    );

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: ${THEMES[themeName]?.primary || "#8b5cf6"};
          --primary-light: ${THEMES[themeName]?.soft || "rgba(139,92,246,0.16)"};
          --bg-body: #f8f9fc;
          --bg-panel: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --radius: 24px;
          --sidebar-w: 270px;
        }

        [data-theme="dark"] {
          --bg-body: #0f1115;
          --bg-panel: #14161c;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: #242834;
          --primary-light: ${THEMES[themeName]?.soft || "rgba(139,92,246,0.16)"};
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background-color: var(--bg-body);
          color: var(--text-main);
          height: 100vh;
          overflow: hidden;
          display: flex;
          transition: background-color 0.25s ease;
        }

        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14), rgba(255,255,255,0.06));
          background-size: 200% 100%;
          animation: sk 1.2s infinite;
        }
        @keyframes sk { 0% { background-position: 0% 0; } 100% { background-position: -200% 0; } }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-w);
          height: 96vh;
          margin: 2vh;
          background: var(--bg-panel);
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          padding: 22px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
          z-index: 50;
          border: 1px solid var(--border);
          gap: 14px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          font-size: 1.1rem;
          margin-bottom: 6px;
          color: var(--text-main);
        }
        .brand img {
          height: 34px;
          border-radius: 10px;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          margin-top: 6px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.18s;
          font-family: inherit;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
        }

        .nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 12px 26px -10px rgba(0, 0, 0, 0.35);
        }

        /* Bas gauche: palette + user (fix propre) */
        .side-bottom {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .palette-row {
          display: flex;
          gap: 10px;
          padding: 10px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
        }
        .pal-btn {
          flex: 1;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
          color: var(--text-muted);
          padding: 8px 10px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.85rem;
          transition: 0.2s;
          text-align: center;
        }
        .pal-btn.active {
          background: var(--primary);
          border-color: transparent;
          color: white;
        }
        .pal-btn:hover {
          transform: translateY(-1px);
          border-color: var(--primary);
          color: var(--text-main);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.18s;
        }
        .user-card:hover {
          border-color: var(--primary);
        }
        .avatar {
          width: 38px;
          height: 38px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.95rem;
          flex: 0 0 auto;
        }
        .u-meta {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          min-width: 0;
          flex: 1;
        }
        .u-name {
          font-weight: 900;
          font-size: 0.92rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .u-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .logout-pill {
          margin-left: auto;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          font-weight: 900;
          color: var(--text-main);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        /* MAIN */
        .main-content {
          flex: 1;
          padding: 2vh 2vh 2vh 0;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 0 10px;
          gap: 14px;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .top-stats {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .mini-stat {
          background: var(--bg-panel);
          padding: 9px 18px;
          border-radius: 999px;
          border: 1px solid var(--border);
          display: flex;
          gap: 8px;
          align-items: center;
          font-weight: 800;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .mini-stat strong {
          color: var(--text-main);
        }

        .pill-toggle {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          padding: 10px 14px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-weight: 900;
        }

        .switch {
          width: 42px;
          height: 24px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          position: relative;
          cursor: pointer;
        }
        .knob {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--text-main);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 3px;
          transition: 0.2s;
        }
        .switch.on .knob { left: 21px; background: white; }
        .switch.on { background: var(--primary); border-color: transparent; }

        .theme-btn {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
          transition: 0.2s;
        }
        .theme-btn:hover {
          background: rgba(255,255,255,0.04);
          transform: rotate(12deg);
        }

        /* DASHBOARD */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        .dash-card {
          background: var(--bg-panel);
          border-radius: var(--radius);
          padding: 26px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.25s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 190px;
          position: relative;
          overflow: hidden;
        }

        .dash-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 18px 34px -18px rgba(0,0,0,0.6);
        }

        .dash-icon {
          width: 52px;
          height: 52px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .dash-title {
          font-size: 1.15rem;
          font-weight: 900;
          margin-top: 16px;
          margin-bottom: 6px;
        }
        .dash-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .home-leader {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 900px) {
          .home-leader { grid-template-columns: 1fr; }
        }
        .panel {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
        }
        .panel h3 {
          display:flex; align-items:center; gap:10px;
          font-size: 1.05rem;
          font-weight: 900;
          margin-bottom: 14px;
        }
        .rank-row {
          display:flex; align-items:center; justify-content: space-between;
          padding: 12px 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          margin-bottom: 10px;
        }
        .rank-left { display:flex; align-items:center; gap:10px; min-width:0; }
        .medal {
          width: 30px; height: 30px; border-radius: 12px;
          display:flex; align-items:center; justify-content:center;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          font-weight: 900;
        }
        .rank-name {
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 210px;
        }
        .rank-val { font-weight: 900; color: var(--primary); }

        /* CATALOG */
        .search-container { position: relative; margin-bottom: 16px; max-width: 460px; }
        .search-inp {
          width: 100%;
          padding: 14px 18px 14px 46px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 800;
          transition: 0.2s;
        }
        .search-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

        .cat-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px; }
        .pill {
          padding: 8px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .pill:hover, .pill.active { border-color: var(--primary); color: white; background: var(--primary); }

        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 16px;
        }

        .quick .prod-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .quick .prod-card { padding: 18px; }
        .quick .prod-title { font-size: 1rem; }
        .quick .prod-price { font-size: 1.25rem; }

        .prod-card {
          background: rgba(255,255,255,0.02);
          border-radius: 22px;
          padding: 14px;
          text-align: center;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.18s;
          position: relative;
        }
        .prod-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 14px 26px -20px rgba(0,0,0,0.8); }
        .prod-img {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 18px;
          margin-bottom: 12px;
          object-fit: cover;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
        .prod-title { font-weight: 900; font-size: 0.9rem; margin-bottom: 6px; line-height: 1.2; min-height: 40px; }
        .prod-price { color: var(--primary); font-weight: 900; font-size: 1.1rem; }

        /* CART */
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          height: 100vh;
          background: var(--bg-panel);
          box-shadow: -10px 0 40px rgba(0,0,0,0.4);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border);
        }
        .cart-drawer.open { transform: translateX(0); }

        .cart-head { padding: 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .cart-body { flex: 1; overflow-y: auto; padding: 16px 18px; }
        .cart-foot { padding: 18px; background: rgba(255,255,255,0.03); border-top: 1px solid var(--border); }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 18px;
          margin-bottom: 10px;
          border: 1px solid var(--border);
        }
        .qty-ctrl {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.02);
          border-radius: 14px;
          padding: 3px;
          border: 1px solid var(--border);
        }
        .qb {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          font-weight: 900;
        }
        .qi {
          width: 28px;
          border: none;
          background: transparent;
          text-align: center;
          font-weight: 900;
          color: var(--text-main);
        }

        .btn {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 18px;
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.18s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 18px 34px -22px rgba(0,0,0,0.9);
        }
        .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.02); }

        .btn-text {
          background: transparent;
          border: 1px dashed var(--border);
          color: var(--text-muted);
        }
        .btn-text:hover { border-color: var(--primary); color: var(--primary); }

        .cart-btn-float {
          position: fixed;
          bottom: 26px;
          right: 26px;
          background: var(--text-main);
          color: var(--bg-panel);
          padding: 14px 22px;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 16px 34px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.18s;
          z-index: 90;
        }
        .cart-btn-float:hover { transform: scale(1.03); }
        .cart-btn-float.pop { animation: pop 0.22s ease; }
        @keyframes pop { 0% { transform: scale(1); } 60% { transform: scale(1.08); } 100% { transform: scale(1); } }

        /* FORMS */
        .form-wrap {
          background: var(--bg-panel);
          padding: 32px;
          border-radius: 30px;
          max-width: 620px;
          margin: 0 auto;
          border: 1px solid var(--border);
          box-shadow: 0 22px 45px -28px rgba(0,0,0,0.8);
        }
        .inp-group { margin-bottom: 16px; }
        .inp-label { display: block; margin-bottom: 8px; font-weight: 900; font-size: 0.9rem; color: var(--text-muted); }
        .inp-field {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          border-radius: 14px;
          font-size: 1rem;
          font-family: inherit;
          color: var(--text-main);
          transition: 0.2s;
          font-weight: 800;
        }
        .inp-field:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

        /* LOGIN */
        #gate { position: fixed; inset: 0; background: var(--bg-body); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .login-box {
          text-align: center;
          width: 410px;
          padding: 38px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          border-radius: 30px;
          box-shadow: 0 22px 40px -28px rgba(0,0,0,0.9);
        }

        /* TOAST */
        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 3000;
          background: var(--bg-panel);
          padding: 14px 18px;
          border-radius: 18px;
          box-shadow: 0 18px 36px -26px rgba(0,0,0,0.9);
          border-left: 5px solid var(--primary);
          min-width: 280px;
          animation: slideIn 0.25s;
          color: var(--text-main);
          border: 1px solid var(--border);
        }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } }
        .t-title { font-weight: 900; font-size: 0.95rem; margin-bottom: 4px; }
        .t-msg { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; }

        /* DIRECTORY */
        .dir-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .dir-grid { grid-template-columns: 1fr; }
        }
        .dir-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
        .emp-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 16px;
          cursor: pointer;
          transition: 0.18s;
        }
        .emp-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .emp-top { display:flex; align-items:center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
        .badge {
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--text-muted);
          font-weight: 900;
          font-size: 0.78rem;
          white-space: nowrap;
        }
        .emp-name { font-weight: 900; margin-bottom: 6px; }
        .emp-phone { color: var(--text-muted); font-weight: 800; display:flex; gap: 8px; align-items: center; }
        .icon-btn {
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--text-main);
          padding: 10px 12px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 900;
          display:flex;
          align-items:center;
          gap: 8px;
          transition: 0.18s;
        }
        .icon-btn:hover { border-color: var(--primary); transform: translateY(-1px); }
        .emp-profile {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
          position: sticky;
          top: 18px;
          height: fit-content;
        }
        .emp-profile h3 { font-weight: 900; margin-bottom: 10px; }
        .stat-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .stat {
          padding: 12px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
        }
        .stat .k { color: var(--text-muted); font-weight: 900; font-size: 0.8rem; }
        .stat .v { font-weight: 900; margin-top: 4px; color: var(--text-main); }
        .stat .v.primary { color: var(--primary); }

      `}</style>

      {view === "login" ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 16 }} />
            <h2 style={{ marginBottom: 8, fontWeight: 900 }}>Bienvenue</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 22, fontWeight: 700 }}>
              Connectez-vous pour commencer
            </p>

            <select
              className="inp-field"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{ marginBottom: 14, textAlign: "center" }}
            >
              <option value="">Sélectionner un nom...</option>
              {data?.employees?.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user}>
              Accéder <Icon name="dashboard" size={18} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <div className="brand">
              <img src="https://i.goopics.net/dskmxi.png" alt="Logo" /> HEN HOUSE
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

              {/* ✅ NOUVEAUX MODULES */}
              <button className={`nav-btn ${currentTab === "directory" ? "active" : ""}`} onClick={() => setCurrentTab("directory")}>
                <Icon name="users" /> Annuaire
              </button>
              <button className={`nav-btn ${currentTab === "performance" ? "active" : ""}`} onClick={() => setCurrentTab("performance")}>
                <Icon name="trophy" /> Performance
              </button>

              <button className={`nav-btn ${currentTab === "support" ? "active" : ""}`} onClick={() => setCurrentTab("support")}>
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            {/* ✅ BAS GAUCHE FIXÉ (palette + logout propre) */}
            <div className="side-bottom">
              <div className="palette-row">
                {Object.keys(THEMES).map((k) => (
                  <button
                    key={k}
                    className={`pal-btn ${themeName === k ? "active" : ""}`}
                    onClick={() => {
                      setThemeName(k);
                      applyThemeVars(k);
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <div className="user-card" onClick={logout} title="Déconnexion">
                <div className="avatar">{user.charAt(0)}</div>
                <div className="u-meta">
                  <div className="u-name">{user}</div>
                  <div className="u-role">{me?.role ? me.role : "Déconnexion"}</div>
                </div>
                <div className="logout-pill">
                  <Icon name="logout" size={16} /> Quitter
                </div>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="header-bar">
              <div className="page-title">
                {currentTab === "home" && (
                  <>
                    <Icon name="dashboard" size={30} /> Tableau de bord
                  </>
                )}
                {currentTab === "invoices" && (
                  <>
                    <Icon name="receipt" size={30} /> Caisse
                  </>
                )}
                {currentTab === "stock" && (
                  <>
                    <Icon name="package" size={30} /> Stock
                  </>
                )}
                {currentTab === "enterprise" && (
                  <>
                    <Icon name="building" size={30} /> Entreprise
                  </>
                )}
                {currentTab === "partners" && (
                  <>
                    <Icon name="handshake" size={30} /> Partenaires
                  </>
                )}
                {currentTab === "garage" && (
                  <>
                    <Icon name="car" size={30} /> Garage
                  </>
                )}
                {currentTab === "expenses" && (
                  <>
                    <Icon name="creditCard" size={30} /> Frais
                  </>
                )}
                {currentTab === "support" && (
                  <>
                    <Icon name="lifeBuoy" size={30} /> Support
                  </>
                )}
                {currentTab === "directory" && (
                  <>
                    <Icon name="users" size={30} /> Annuaire
                  </>
                )}
                {currentTab === "performance" && (
                  <>
                    <Icon name="trophy" size={30} /> Performance
                  </>
                )}
              </div>

              <div className="top-stats">
                <div className="mini-stat">
                  Session: <strong>{formatMoney(sessionTotal, currencySymbol)}</strong>
                </div>

                {/* ✅ Mode rapide seulement utile pour Caisse */}
                {currentTab === "invoices" && (
                  <div className="pill-toggle">
                    Mode rapide
                    <div className={`switch ${quickMode ? "on" : ""}`} onClick={() => setQuickMode(!quickMode)}>
                      <div className="knob" />
                    </div>
                  </div>
                )}

                <button className="theme-btn" onClick={toggleTheme} title="Dark/Light">
                  {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
                </button>
              </div>
            </header>

            {/* ================= HOME ================= */}
            {currentTab === "home" && (
              <>
                <div className="dashboard-grid">
                  <div className="dash-card" onClick={() => setCurrentTab("invoices")}>
                    <div className="dash-icon">
                      <Icon name="receipt" size={26} />
                    </div>
                    <div>
                      <div className="dash-title">Caisse</div>
                      <div className="dash-desc">Nouvelle vente</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={() => setCurrentTab("stock")}>
                    <div className="dash-icon">
                      <Icon name="package" size={26} />
                    </div>
                    <div>
                      <div className="dash-title">Stock</div>
                      <div className="dash-desc">Production cuisine</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={() => setCurrentTab("enterprise")}>
                    <div className="dash-icon">
                      <Icon name="building" size={26} />
                    </div>
                    <div>
                      <div className="dash-title">Entreprise</div>
                      <div className="dash-desc">Commandes B2B</div>
                    </div>
                  </div>

                  <div className="dash-card" onClick={() => setCurrentTab("partners")}>
                    <div className="dash-icon">
                      <Icon name="handshake" size={26} />
                    </div>
                    <div>
                      <div className="dash-title">Partenaires</div>
                      <div className="dash-desc">Offres spéciales</div>
                    </div>
                  </div>
                </div>

                {/* ✅ Home plus vivant: Classement du moment */}
                <div className="home-leader">
                  <div className="panel">
                    <h3>
                      <Icon name="trophy" size={20} /> Top CA
                    </h3>
                    {topCA.map((e, idx) => (
                      <div key={e.name} className="rank-row">
                        <div className="rank-left">
                          <div className="medal">{["🥇", "🥈", "🥉"][idx] || `#${idx + 1}`}</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="rank-name">{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>{e.role || "-"}</div>
                          </div>
                        </div>
                        <div className="rank-val">{formatMoney(e.ca, currencySymbol)}</div>
                      </div>
                    ))}
                    <button className="btn btn-text" onClick={() => setCurrentTab("performance")}>
                      Voir Performance
                    </button>
                  </div>

                  <div className="panel">
                    <h3>
                      <Icon name="package" size={20} /> Top Production (Stock)
                    </h3>
                    {topStock.map((e, idx) => (
                      <div key={e.name} className="rank-row">
                        <div className="rank-left">
                          <div className="medal">{["🥇", "🥈", "🥉"][idx] || `#${idx + 1}`}</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="rank-name">{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>{e.role || "-"}</div>
                          </div>
                        </div>
                        <div className="rank-val">{Number(e.stock || 0)}</div>
                      </div>
                    ))}
                    <button className="btn btn-text" onClick={() => setCurrentTab("directory")}>
                      Voir Annuaire
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ================= CAISSE ================= */}
            {currentTab === "invoices" && (
              <div className={quickMode ? "quick" : ""}>
                <div className="search-container">
                  <div className="search-icon">
                    <Icon name="search" size={20} />
                  </div>
                  <input className="search-inp" placeholder="Rechercher..." onChange={(e) => setSearch(e.target.value)} />
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
                        {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img">{p.charAt(0)}</div>}
                        <div className="prod-title">{p}</div>
                        <div className="prod-price">{formatMoney(data.prices[p], currencySymbol)}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= STOCK ================= */}
            {currentTab === "stock" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                        Produit...
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
                      style={{ width: 90 }}
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
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={() => setStockItems([...stockItems, { product: data.products[0], qty: 1 }])}>
                  + Ajouter ligne
                </button>

                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => sendForm("sendProduction", { items: stockItems })}>
                  Envoyer
                </button>
              </div>
            )}

            {/* ================= ENTREPRISE ================= */}
            {currentTab === "enterprise" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                        Produit...
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
                      style={{ width: 90 }}
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

                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSendEnterprise}>
                  Valider
                </button>
              </div>
            )}

            {/* ================= PARTENAIRES ================= */}
            {currentTab === "partners" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                      style={{ width: 90 }}
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

                <button
                  className="btn btn-text"
                  onClick={() =>
                    setParItems([...parItems, { menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }])
                  }
                >
                  + Menu
                </button>

                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSendPartner}>
                  Confirmer
                </button>
              </div>
            )}

            {/* ================= FRAIS ================= */}
            {currentTab === "expenses" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                  <label className="inp-label">Montant ({currencySymbol})</label>
                  <input type="number" className="inp-field" value={expData.amt} onChange={(e) => setExpData({ ...expData, amt: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>
                  Déclarer
                </button>
              </div>
            )}

            {/* ================= GARAGE ================= */}
            {currentTab === "garage" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                  <input type="range" style={{ width: "100%" }} value={garData.fuel} onChange={(e) => setGarData({ ...garData, fuel: e.target.value })} />{" "}
                  <b>{garData.fuel}%</b>
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendGarage", { vehicle: garData.veh, action: garData.action, fuel: garData.fuel })}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* ================= SUPPORT ================= */}
            {currentTab === "support" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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

            {/* ================= ANNUAIRE ================= */}
            {currentTab === "directory" && (
              <div className="dir-grid">
                <div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                    <div className="search-container" style={{ marginBottom: 0, flex: 1, minWidth: 260 }}>
                      <div className="search-icon">
                        <Icon name="search" size={20} />
                      </div>
                      <input className="search-inp" placeholder="Nom, téléphone, poste..." value={dirSearch} onChange={(e) => setDirSearch(e.target.value)} />
                    </div>

                    <select className="inp-field" style={{ width: 220 }} value={dirRole} onChange={(e) => setDirRole(e.target.value)}>
                      {allRoles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="dir-list">
                    {filteredDirectory.map((e) => (
                      <div key={e.name} className="emp-card" onClick={() => setSelectedEmployee(e)}>
                        <div className="emp-top">
                          <div className="emp-name">{e.name}</div>
                          <div className="badge">{e.role || "—"}</div>
                        </div>

                        <div className="emp-phone">
                          <Icon name="phone" size={16} /> {e.phone || "-"}
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                          <button className="icon-btn" onClick={(ev) => (ev.stopPropagation(), copy(e.phone))}>
                            <Icon name="copy" size={16} /> Copier
                          </button>
                          <button className="icon-btn" onClick={(ev) => (ev.stopPropagation(), setSelectedEmployee(e))}>
                            Voir fiche →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="emp-profile">
                  <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="users" /> Fiche employé
                  </h3>

                  {!selectedEmployee ? (
                    <div style={{ color: "var(--text-muted)", fontWeight: 800 }}>
                      Clique sur un employé dans la liste 👈
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: 900, fontSize: "1.05rem", marginTop: 6 }}>
                        {selectedEmployee.name}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontWeight: 800, marginTop: 4 }}>
                        {selectedEmployee.role || "-"}
                      </div>

                      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                        <button className="icon-btn" onClick={() => copy(selectedEmployee.phone)}>
                          <Icon name="copy" size={16} /> Copier {selectedEmployee.phone || "-"}
                        </button>
                      </div>

                      <div className="stat-grid">
                        <div className="stat">
                          <div className="k">Téléphone</div>
                          <div className="v">{selectedEmployee.phone || "-"}</div>
                        </div>
                        <div className="stat">
                          <div className="k">Date d’arrivée</div>
                          <div className="v">{formatArrival(selectedEmployee.arrival)}</div>
                        </div>
                        <div className="stat">
                          <div className="k">Ancienneté</div>
                          <div className="v">{selectedEmployee.seniority || 0} j</div>
                        </div>
                        <div className="stat">
                          <div className="k">Salaire</div>
                          <div className="v primary">{formatMoney(selectedEmployee.salary, currencySymbol)}</div>
                        </div>
                        <div className="stat">
                          <div className="k">CA</div>
                          <div className="v primary">{formatMoney(selectedEmployee.ca, currencySymbol)}</div>
                        </div>
                        <div className="stat">
                          <div className="k">Stock</div>
                          <div className="v">{Number(selectedEmployee.stock || 0)}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ================= PERFORMANCE ================= */}
            {currentTab === "performance" && (
              <div className="panel" style={{ padding: 20 }}>
                <h3 style={{ marginBottom: 12 }}>
                  <Icon name="trophy" size={20} /> Classements
                </h3>

                <div className="home-leader" style={{ marginTop: 0 }}>
                  <div className="panel">
                    <h3>
                      <Icon name="trophy" size={20} /> Top CA
                    </h3>
                    {topCA.map((e, idx) => (
                      <div key={e.name} className="rank-row">
                        <div className="rank-left">
                          <div className="medal">{["🥇", "🥈", "🥉"][idx] || `#${idx + 1}`}</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="rank-name">{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>{e.role || "-"}</div>
                          </div>
                        </div>
                        <div className="rank-val">{formatMoney(e.ca, currencySymbol)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="panel">
                    <h3>
                      <Icon name="package" size={20} /> Top Production (Stock)
                    </h3>
                    {topStock.map((e, idx) => (
                      <div key={e.name} className="rank-row">
                        <div className="rank-left">
                          <div className="medal">{["🥇", "🥈", "🥉"][idx] || `#${idx + 1}`}</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="rank-name">{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>{e.role || "-"}</div>
                          </div>
                        </div>
                        <div className="rank-val">{Number(e.stock || 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 14, color: "var(--text-muted)", fontWeight: 800 }}>
                  Astuce: tu peux ajouter des objectifs (ex: 10 000$/semaine) directement en affichage ici si tu veux.
                </div>
              </div>
            )}
          </main>

          {/* CART DRAWER (Caisse) */}
          {currentTab === "invoices" && (
            <>
              <div id="cartFloat" className="cart-btn-float" onClick={() => setCartOpen(true)}>
                <Icon name="cart" size={22} /> <span>{formatMoney(sessionTotal, currencySymbol)}</span>
                <span style={{ opacity: 0.75, fontWeight: 900 }}>• {cart.reduce((a, b) => a + b.qty, 0)}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
                <div className="cart-head">
                  <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 900 }}>
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
                  {cart.length === 0 && <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-muted)", fontWeight: 800 }}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <b style={{ fontWeight: 900 }}>{c.name}</b>
                        <br />
                        <small style={{ color: "var(--text-muted)", fontWeight: 800 }}>{formatMoney(c.pu, currencySymbol)}</small>
                      </div>

                      <div className="qty-ctrl">
                        <button className="qb" onClick={() => modQty(i, -1)}>
                          -
                        </button>
                        <span className="qi">{c.qty}</span>
                        <button className="qb" onClick={() => modQty(i, 1)}>
                          +
                        </button>
                      </div>

                      <button className="qb" style={{ color: "#ef4444" }} onClick={() => modQty(i, -999)}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 900, marginBottom: 12 }}>
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>{formatMoney(sessionTotal, currencySymbol)}</span>
                  </div>

                  <button className="btn btn-primary" onClick={handleSendInvoice}>
                    Valider la vente
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* Toast */}
          {toast && (
            <div
              className="toast"
              style={{
                borderLeftColor:
                  toast.type === "error" ? "#ef4444" : toast.type === "success" ? "#10b981" : "var(--primary)",
              }}
            >
              <div className="t-title">{toast.title}</div>
              <div className="t-msg">{toast.msg}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
