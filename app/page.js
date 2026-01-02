"use client";
import { useEffect, useMemo, useState } from "react";

// --- ICONS ---
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
        <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
        <path d="M5 7a3 3 0 0 0 3 3" />
        <path d="M19 7a3 3 0 0 1-3 3" />
      </>
    ),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />,
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

// --- IMAGES ---
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

const clampInt = (v, min = 0, max = 999999) => {
  const n = Math.floor(Number(v));
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
};

const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;

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
  const [palette, setPalette] = useState("Purple"); // Orange / Mint / Purple
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
  const [dirPoste, setDirPoste] = useState("Tous");
  const [selectedEmp, setSelectedEmp] = useState(null);

  // ================= INIT =================
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.setAttribute("data-palette", "Purple");

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
          const first = Object.keys(res.partners.companies)[0];
          setParCompany(first);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur chargement");
      });
  }, []);

  useEffect(() => {
    if (!data || !parCompany) return;
    const comp = data.partners.companies[parCompany];
    if (comp?.beneficiaries?.length) setParBenef(comp.beneficiaries[0]);
    if (comp?.menus?.length) setParItems([{ menu: comp.menus[0].name, qty: 1 }]);
  }, [parCompany, data]);

  const notify = (title, msg, type = "info") => {
    setToast({ title, msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  const setPaletteUI = (p) => {
    setPalette(p);
    document.documentElement.setAttribute("data-palette", p);
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
    setCartOpen(false);
  };

  // ================= CART =================
  const addToCart = (prod) => {
    const existing = cart.find((x) => x.name === prod);
    if (existing) {
      setCart(cart.map((x) => (x.name === prod ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { name: prod, qty: 1, pu: data.prices[prod] || 0 }]);
    }
    notify("Ajouté", prod, "success");
  };

  const setCartQty = (idx, qty) => {
    const n = clampInt(qty, 0, 9999);
    const newCart = [...cart];
    if (n <= 0) newCart.splice(idx, 1);
    else newCart[idx].qty = n;
    setCart(newCart);
  };

  const cartTotal = useMemo(() => cart.reduce((a, b) => a + b.qty * b.pu, 0), [cart]);

  // ================= SEND =================
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

        // reset forms
        setInvNum("");
        setCart([]);
        if (data?.products?.length) {
          setStockItems([{ product: data.products[0], qty: 1 }]);
          setEntItems([{ product: data.products[0], qty: 1 }]);
        }
        setEntName("");
        setParNum("");
        if (data?.partners?.companies?.[parCompany]?.menus?.length) {
          setParItems([{ menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }]);
        }
        setSupData({ sub: "Autre", msg: "" });
        setExpData((p) => ({ ...p, amt: "" }));

        // refresh meta for perf/annuaire (stats)
        fetch("/api", { method: "POST", body: JSON.stringify({ action: "getMeta" }) })
          .then((r) => r.json())
          .then((r) => setData(r))
          .catch(() => {});
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

  // ================= DIRECTORY + PERFORMANCE =================
  const directory = data?.employeeDirectory || [];
  const postes = useMemo(() => {
    const set = new Set(directory.map((x) => x.poste).filter(Boolean));
    return ["Tous", ...Array.from(set).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [directory]);

  const filteredDirectory = useMemo(() => {
    return directory.filter((e) => {
      const okPoste = dirPoste === "Tous" || (e.poste || "") === dirPoste;
      const s = dirSearch.toLowerCase().trim();
      const okSearch =
        !s ||
        (e.name || "").toLowerCase().includes(s) ||
        (e.tel || "").toLowerCase().includes(s) ||
        (e.poste || "").toLowerCase().includes(s);
      return okPoste && okSearch;
    });
  }, [directory, dirPoste, dirSearch]);

  const topCA = useMemo(() => [...directory].sort((a, b) => (b.ca || 0) - (a.ca || 0)).slice(0, 5), [directory]);
  const topStock = useMemo(() => [...directory].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5), [directory]);

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <style jsx global>{`
          :root {
            --primary: #8b5cf6;
            --bg-body: #0f1115;
            --bg-panel: #181a20;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border: #2d313a;
            --radius: 24px;
          }
          body {
            margin: 0;
            height: 100vh;
            background: var(--bg-body);
            color: var(--text-main);
            display: grid;
            place-items: center;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          }
          .loaderWrap {
            display: grid;
            gap: 14px;
            place-items: center;
          }
          .logo {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: var(--bg-panel);
            border: 1px solid var(--border);
            display: grid;
            place-items: center;
            overflow: hidden;
          }
          .logo img {
            width: 46px;
            height: 46px;
            object-fit: cover;
            border-radius: 10px;
          }
          .bar {
            width: 320px;
            height: 10px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
            overflow: hidden;
            border: 1px solid var(--border);
          }
          .bar::after {
            content: "";
            display: block;
            width: 45%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
            transform: translateX(-100%);
            animation: shimmer 1.1s infinite;
          }
          @keyframes shimmer {
            to {
              transform: translateX(220%);
            }
          }
          .small {
            color: var(--text-muted);
            font-weight: 700;
            letter-spacing: 0.2px;
          }
        `}</style>
        <div className="loaderWrap">
          <div className="logo">
            <img src="https://i.goopics.net/dskmxi.png" alt="Hen House" />
          </div>
          <div className="small">Chargement Hen House...</div>
          <div className="bar" />
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6; /* default Purple */
          --primary-2: rgba(139, 92, 246, 0.18);
          --primary-3: rgba(139, 92, 246, 0.28);

          --bg-body: #f8f9fc;
          --bg-panel: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;

          --radius: 24px;
          --sidebar-w: 270px;

          --shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.35);
        }

        [data-theme="dark"] {
          --bg-body: #0f1115;
          --bg-panel: #181a20;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: #2d313a;
        }

        /* Palettes */
        [data-palette="Orange"] {
          --primary: #ff6a2b;
          --primary-2: rgba(255, 106, 43, 0.16);
          --primary-3: rgba(255, 106, 43, 0.28);
        }
        [data-palette="Mint"] {
          --primary: #10b981;
          --primary-2: rgba(16, 185, 129, 0.16);
          --primary-3: rgba(16, 185, 129, 0.28);
        }
        [data-palette="Purple"] {
          --primary: #8b5cf6;
          --primary-2: rgba(139, 92, 246, 0.16);
          --primary-3: rgba(139, 92, 246, 0.28);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* ✅ Fix "liste blanche" : indique au navigateur un thème + option colors */
        html {
          color-scheme: light;
        }
        [data-theme="dark"] html,
        [data-theme="dark"] body {
          color-scheme: dark;
        }

        body {
          font-family: "Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          background-color: var(--bg-body);
          color: var(--text-main);
          height: 100vh;
          overflow: hidden;
          display: flex;
          transition: background-color 0.25s ease;
        }

        /* ✅ Select + option dark */
        select,
        option,
        input,
        textarea {
          font-family: inherit;
        }
        select.inp-field,
        .inp-field {
          background: var(--bg-body);
          color: var(--text-main);
          border: 1px solid var(--border);
        }
        option {
          background: var(--bg-panel);
          color: var(--text-main);
        }

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
          box-shadow: var(--shadow);
          z-index: 50;
          border: 1px solid var(--border);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
          font-size: 1.15rem;
          margin-bottom: 22px;
          color: var(--text-main);
          letter-spacing: 0.5px;
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
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
        }
        .nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 12px 24px -14px var(--primary);
        }

        /* Bottom-left user block (✅ amélioré) */
        .bottom-panel {
          margin-top: auto;
          display: grid;
          gap: 12px;
        }
        .palette-row {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: var(--bg-body);
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        .pill2 {
          flex: 1;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s;
        }
        .pill2.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .user-card {
          padding: 14px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-body);
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .avatar {
          width: 38px;
          height: 38px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 0.95rem;
        }
        .u-name {
          font-weight: 900;
          line-height: 1.05;
        }
        .u-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 700;
        }
        .logout-btn {
          margin-left: auto;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
          border-radius: 14px;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 900;
          display: flex;
          gap: 8px;
          align-items: center;
          transition: 0.2s;
        }
        .logout-btn:hover {
          border-color: var(--primary);
          box-shadow: 0 12px 24px -18px var(--primary);
        }

        /* MAIN */
        .main-content {
          flex: 1;
          padding: 2vh 2vh 2vh 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          padding: 0 10px;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 40;
          background: linear-gradient(to bottom, var(--bg-body) 70%, transparent);
          padding-top: 14px;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 950;
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
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--border);
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 900;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .mini-stat strong {
          color: var(--text-main);
        }

        .theme-btn {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: var(--text-main);
          transition: 0.2s;
        }
        .theme-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: rotate(10deg);
        }

        .toggle {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          font-weight: 900;
        }
        .switch {
          width: 48px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          position: relative;
          cursor: pointer;
        }
        .knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--text-main);
          transition: 0.2s;
        }
        .switch.on .knob {
          left: 23px;
          background: var(--primary);
        }

        /* DASHBOARD */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          padding: 10px;
        }
        .dash-card {
          background: var(--bg-panel);
          border-radius: var(--radius);
          padding: 26px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: 0.25s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 190px;
        }
        .dash-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: var(--shadow);
        }
        .dash-icon {
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          color: var(--primary);
          border: 1px solid var(--border);
        }
        .dash-title {
          font-size: 1.2rem;
          font-weight: 950;
          margin-bottom: 6px;
        }
        .dash-desc {
          font-size: 0.92rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* Catalog */
        .search-container {
          position: relative;
          margin: 10px 10px 18px;
          max-width: 520px;
        }
        .search-inp {
          width: 100%;
          padding: 16px 18px 16px 50px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 800;
          transition: 0.2s;
        }
        .search-inp:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-2);
        }
        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .cat-pills {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 0 10px 10px;
          margin-bottom: 10px;
        }
        .pill {
          padding: 10px 16px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
          color: var(--text-muted);
        }
        .pill:hover,
        .pill.active {
          border-color: var(--primary);
          color: white;
          background: var(--primary);
        }

        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          padding: 10px;
        }
        .prod-card {
          background: var(--bg-panel);
          border-radius: 20px;
          padding: 14px;
          text-align: center;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.2s;
          position: relative;
        }
        .prod-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow);
        }
        .prod-img {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          margin-bottom: 12px;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.04);
          display: grid;
          place-items: center;
          font-size: 2rem;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
        .prod-title {
          font-weight: 950;
          font-size: 0.9rem;
          margin-bottom: 5px;
          line-height: 1.2;
        }
        .prod-price {
          color: var(--primary);
          font-weight: 950;
          font-size: 1.1rem;
        }

        /* CART */
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          height: 100vh;
          background: var(--bg-panel);
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.35);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border);
        }
        .cart-drawer.open {
          transform: translateX(0);
        }
        .cart-head {
          padding: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
        }
        .cart-foot {
          padding: 22px;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid var(--border);
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 18px;
          margin-bottom: 10px;
          border: 1px solid var(--border);
        }
        .qty-ctrl {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--border);
          gap: 6px;
        }
        .qb {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: var(--text-main);
          font-weight: 950;
          border-radius: 10px;
          transition: 0.15s;
        }
        .qb:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .qiInput {
          width: 54px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          color: var(--text-main);
          font-weight: 950;
          text-align: center;
        }

        .btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 16px;
          font-weight: 950;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 14px 28px -18px var(--primary);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px -20px var(--primary);
        }
        .btn-text {
          background: transparent;
          border: 1px dashed var(--border);
          color: var(--text-muted);
        }
        .btn-text:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .cart-btn-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: var(--bg-panel);
          color: var(--text-main);
          padding: 14px 18px;
          border-radius: 999px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
          z-index: 90;
          border: 1px solid var(--border);
        }
        .cart-btn-float:hover {
          transform: scale(1.03);
          border-color: var(--primary);
        }
        .badge {
          background: var(--primary);
          color: white;
          font-weight: 950;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.85rem;
        }

        /* FORMS */
        .form-wrap {
          background: var(--bg-panel);
          padding: 34px;
          border-radius: 30px;
          max-width: 680px;
          margin: 0 auto;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .inp-group {
          margin-bottom: 18px;
        }
        .inp-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 950;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .inp-field {
          width: 100%;
          padding: 14px;
          border: 1px solid var(--border);
          background: var(--bg-body);
          border-radius: 14px;
          font-size: 1rem;
          color: var(--text-main);
          transition: 0.2s;
          font-weight: 800;
        }
        .inp-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-2);
          background: var(--bg-panel);
        }

        /* LOGIN */
        #gate {
          position: fixed;
          inset: 0;
          background: var(--bg-body);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-box {
          text-align: center;
          width: 420px;
          padding: 42px;
          border: 1px solid var(--border);
          background: var(--bg-panel);
          border-radius: 30px;
          box-shadow: var(--shadow);
        }

        /* TOAST */
        .toast {
          position: fixed;
          top: 26px;
          right: 26px;
          z-index: 3000;
          background: var(--bg-panel);
          padding: 14px 18px;
          border-radius: 16px;
          box-shadow: var(--shadow);
          border-left: 5px solid var(--primary);
          min-width: 280px;
          animation: slideIn 0.25s;
          color: var(--text-main);
          border: 1px solid var(--border);
        }
        @keyframes slideIn {
          from {
            transform: translateX(40px);
            opacity: 0;
          }
        }
        .t-title {
          font-weight: 950;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .t-msg {
          font-size: 0.86rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* Directory + Performance */
        .split {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 18px;
          padding: 10px;
        }
        .panel {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .panelHead {
          padding: 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .panelBody {
          padding: 18px;
        }
        .row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .empItem {
          padding: 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          cursor: pointer;
          transition: 0.15s;
          margin-bottom: 10px;
        }
        .empItem:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .tag {
          font-size: 0.8rem;
          font-weight: 950;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }
        .copyBtn {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
          border-radius: 12px;
          padding: 10px 12px;
          font-weight: 950;
          cursor: pointer;
        }
        .copyBtn:hover {
          border-color: var(--primary);
        }
        .statGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }
        .statCard {
          padding: 14px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
        }
        .statCard .k {
          color: var(--text-muted);
          font-weight: 900;
          font-size: 0.85rem;
        }
        .statCard .v {
          font-weight: 950;
          font-size: 1.2rem;
          margin-top: 6px;
        }
        .leaderRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          margin-bottom: 10px;
        }
        .medal {
          font-weight: 950;
          font-size: 1.1rem;
          width: 30px;
        }

        @media (max-width: 1100px) {
          .sidebar {
            display: none;
          }
          .main-content {
            padding: 2vh;
          }
          .split {
            grid-template-columns: 1fr;
          }
          .cart-drawer {
            width: 100%;
          }
        }
      `}</style>

      {view === "login" ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 18, borderRadius: 14 }} />
            <h2 style={{ marginBottom: 10, fontWeight: 950 }}>Bienvenue</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 22, fontWeight: 700 }}>Connectez-vous pour commencer</p>

            {/* ✅ select noir (plus de liste blanche) */}
            <select className="inp-field" value={user} onChange={(e) => setUser(e.target.value)} style={{ marginBottom: 18, textAlign: "center" }}>
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

              <button className={`nav-btn ${currentTab === "annuaire" ? "active" : ""}`} onClick={() => setCurrentTab("annuaire")}>
                <Icon name="users" /> Annuaire
              </button>

              <button className={`nav-btn ${currentTab === "performance" ? "active" : ""}`} onClick={() => setCurrentTab("performance")}>
                <Icon name="trophy" /> Performance
              </button>

              <button className={`nav-btn ${currentTab === "support" ? "active" : ""}`} onClick={() => setCurrentTab("support")}>
                <Icon name="lifeBuoy" /> Support
              </button>
            </nav>

            <div className="bottom-panel">
              <div className="palette-row">
                <button className={`pill2 ${palette === "Orange" ? "active" : ""}`} onClick={() => setPaletteUI("Orange")}>
                  Orange
                </button>
                <button className={`pill2 ${palette === "Mint" ? "active" : ""}`} onClick={() => setPaletteUI("Mint")}>
                  Mint
                </button>
                <button className={`pill2 ${palette === "Purple" ? "active" : ""}`} onClick={() => setPaletteUI("Purple")}>
                  Purple
                </button>
              </div>

              <div className="user-card">
                <div className="avatar">{user?.charAt(0) || "?"}</div>
                <div>
                  <div className="u-name">{user}</div>
                  <div className="u-sub">Session prête</div>
                </div>

                <button className="logout-btn" onClick={logout} title="Déconnexion">
                  <Icon name="logout" size={16} /> Quitter
                </button>
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
                {currentTab === "expenses" && (
                  <>
                    <Icon name="creditCard" size={30} /> Frais
                  </>
                )}
                {currentTab === "garage" && (
                  <>
                    <Icon name="car" size={30} /> Garage
                  </>
                )}
                {currentTab === "annuaire" && (
                  <>
                    <Icon name="users" size={30} /> Annuaire
                  </>
                )}
                {currentTab === "performance" && (
                  <>
                    <Icon name="trophy" size={30} /> Performance
                  </>
                )}
                {currentTab === "support" && (
                  <>
                    <Icon name="lifeBuoy" size={30} /> Support
                  </>
                )}
              </div>

              <div className="top-stats">
                <div className="mini-stat">
                  Session: <strong>{money(cartTotal)}</strong>
                </div>

                {currentTab === "invoices" && (
                  <div className="toggle">
                    Mode rapide
                    <div className={`switch ${quickMode ? "on" : ""}`} onClick={() => setQuickMode(!quickMode)}>
                      <div className="knob" />
                    </div>
                  </div>
                )}

                <button className="theme-btn" onClick={toggleTheme} title="Thème">
                  {darkMode ? <Icon name="sun" size={20} /> : <Icon name="moon" size={20} />}
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

                <div className="dash-card" onClick={() => setCurrentTab("annuaire")}>
                  <div className="dash-icon">
                    <Icon name="users" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Annuaire</div>
                    <div className="dash-desc">Coordonnées employés</div>
                  </div>
                </div>

                <div className="dash-card" onClick={() => setCurrentTab("performance")}>
                  <div className="dash-icon">
                    <Icon name="trophy" size={28} />
                  </div>
                  <div>
                    <div className="dash-title">Performance</div>
                    <div className="dash-desc">Top vendeurs / production</div>
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
                  <input className="search-inp" placeholder="Rechercher..." onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="cat-pills">
                  <div className={`pill ${catFilter === "Tous" ? "active" : ""}`} onClick={() => setCatFilter("Tous")}>
                    Tous
                  </div>
                  {Object.keys(data.productsByCategory).map((c) => (
                    <div key={c} className={`pill ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>
                      {c.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>

                <div className="prod-grid" style={quickMode ? { gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" } : {}}>
                  {data.products
                    .filter((p) => {
                      const cat = Object.keys(data.productsByCategory).find((k) => data.productsByCategory[k].includes(p));
                      return (catFilter === "Tous" || cat === catFilter) && p.toLowerCase().includes(search.toLowerCase());
                    })
                    .map((p) => (
                      <div key={p} className="prod-card" onClick={() => addToCart(p)} style={quickMode ? { padding: 18 } : {}}>
                        {IMAGES[p] ? <img src={IMAGES[p]} className="prod-img" /> : <div className="prod-img">{p.charAt(0)}</div>}
                        <div className="prod-title">{p}</div>
                        <div className="prod-price">${data.prices[p]}</div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* STOCK */}
            {currentTab === "stock" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
                  <Icon name="package" /> Déclaration Stock
                </h2>

                {stockItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
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

                    {/* ✅ Quantité clavier */}
                    <input
                      type="number"
                      inputMode="numeric"
                      className="inp-field"
                      style={{ width: 120, textAlign: "center", fontWeight: 950 }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...stockItems];
                        n[i].qty = clampInt(e.target.value, -9999, 9999);
                        setStockItems(n);
                      }}
                    />

                    <button className="qb" style={{ color: "#ef4444" }} onClick={() => { const n = [...stockItems]; n.splice(i, 1); setStockItems(n); }}>
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

            {/* ENTREPRISE */}
            {currentTab === "enterprise" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
                  <Icon name="building" /> Commande Pro
                </h2>

                <div className="inp-group">
                  <label className="inp-label">Nom Entreprise</label>
                  <input className="inp-field" value={entName} onChange={(e) => setEntName(e.target.value)} />
                </div>

                {entItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
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

                    {/* ✅ Quantité clavier */}
                    <input
                      type="number"
                      inputMode="numeric"
                      className="inp-field"
                      style={{ width: 120, textAlign: "center", fontWeight: 950 }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...entItems];
                        n[i].qty = clampInt(e.target.value, 0, 9999);
                        setEntItems(n);
                      }}
                    />

                    <button className="qb" style={{ color: "#ef4444" }} onClick={() => { const n = [...entItems]; n.splice(i, 1); setEntItems(n); }}>
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

            {/* PARTENAIRES */}
            {currentTab === "partners" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
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
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
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

                    {/* ✅ Quantité clavier */}
                    <input
                      type="number"
                      inputMode="numeric"
                      className="inp-field"
                      style={{ width: 120, textAlign: "center", fontWeight: 950 }}
                      value={item.qty}
                      onChange={(e) => {
                        const n = [...parItems];
                        n[i].qty = clampInt(e.target.value, 0, 9999);
                        setParItems(n);
                      }}
                    />

                    <button className="qb" style={{ color: "#ef4444" }} onClick={() => { const n = [...parItems]; n.splice(i, 1); setParItems(n); }}>
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-text" onClick={() => setParItems([...parItems, { menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }])}>
                  + Menu
                </button>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSendPartner}>
                  Confirmer
                </button>
              </div>
            )}

            {/* FRAIS */}
            {currentTab === "expenses" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
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

                {/* ✅ montant clavier */}
                <div className="inp-group">
                  <label className="inp-label">Montant ($)</label>
                  <input type="number" inputMode="decimal" className="inp-field" value={expData.amt} onChange={(e) => setExpData({ ...expData, amt: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={handleSendExpense}>
                  Déclarer
                </button>
              </div>
            )}

            {/* GARAGE */}
            {currentTab === "garage" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
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

            {/* ANNUAIRE */}
            {currentTab === "annuaire" && (
              <div className="split">
                <div className="panel">
                  <div className="panelHead">
                    <div className="row" style={{ gap: 10 }}>
                      <div style={{ fontWeight: 950, fontSize: "1.05rem" }}>Employés</div>
                      <span className="tag">{filteredDirectory.length}</span>
                    </div>

                    <div className="row" style={{ gap: 10 }}>
                      <select className="inp-field" style={{ width: 200 }} value={dirPoste} onChange={(e) => setDirPoste(e.target.value)}>
                        {postes.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="panelBody">
                    <div className="search-container" style={{ maxWidth: "100%", margin: "0 0 14px" }}>
                      <div className="search-icon">
                        <Icon name="search" size={20} />
                      </div>
                      <input className="search-inp" placeholder="Rechercher (nom, tel, poste)..." value={dirSearch} onChange={(e) => setDirSearch(e.target.value)} />
                    </div>

                    {filteredDirectory.map((e) => (
                      <div key={e.id + e.name} className="empItem" onClick={() => setSelectedEmp(e)}>
                        <div>
                          <div style={{ fontWeight: 950 }}>{e.name}</div>
                          <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: "0.9rem" }}>{e.poste || "—"}</div>
                        </div>

                        <div className="row">
                          <span className="tag">{e.tel || "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panelHead">
                    <div style={{ fontWeight: 950, fontSize: "1.05rem" }}>Fiche</div>
                    {selectedEmp?.tel ? (
                      <button
                        className="copyBtn"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedEmp.tel);
                          notify("Copié", selectedEmp.tel, "success");
                        }}
                      >
                        <Icon name="phone" size={16} /> Copier
                      </button>
                    ) : (
                      <span className="tag">Sélectionner un employé</span>
                    )}
                  </div>

                  <div className="panelBody">
                    {!selectedEmp ? (
                      <div style={{ color: "var(--text-muted)", fontWeight: 800 }}>Clique sur un employé à gauche.</div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar">{selectedEmp.name?.charAt(0) || "?"}</div>
                          <div>
                            <div style={{ fontWeight: 950, fontSize: "1.15rem" }}>{selectedEmp.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800 }}>{selectedEmp.poste || "—"}</div>
                          </div>
                        </div>

                        <div className="statGrid">
                          <div className="statCard">
                            <div className="k">Téléphone</div>
                            <div className="v" style={{ fontSize: "1.05rem" }}>
                              {selectedEmp.tel || "—"}
                            </div>
                          </div>
                          <div className="statCard">
                            <div className="k">Ancienneté</div>
                            <div className="v">{selectedEmp.anciennete || 0} j</div>
                          </div>
                          <div className="statCard">
                            <div className="k">CA</div>
                            <div className="v">{money(selectedEmp.ca)}</div>
                          </div>
                          <div className="statCard">
                            <div className="k">Stock</div>
                            <div className="v">{selectedEmp.stock || 0}</div>
                          </div>
                          <div className="statCard" style={{ gridColumn: "span 2" }}>
                            <div className="k">Salaire</div>
                            <div className="v">{money(selectedEmp.salaire)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE */}
            {currentTab === "performance" && (
              <div className="split">
                <div className="panel">
                  <div className="panelHead">
                    <div className="row">
                      <Icon name="trophy" size={20} />
                      <div style={{ fontWeight: 950 }}>Top CA</div>
                    </div>
                    <span className="tag">Top 5</span>
                  </div>
                  <div className="panelBody">
                    {topCA.map((e, idx) => (
                      <div className="leaderRow" key={e.name + idx}>
                        <div className="row" style={{ gap: 12 }}>
                          <div className="medal">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🏅"}</div>
                          <div>
                            <div style={{ fontWeight: 950 }}>{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: "0.9rem" }}>{e.poste || "—"}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 950, color: "var(--primary)" }}>{money(e.ca)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panelHead">
                    <div className="row">
                      <Icon name="package" size={20} />
                      <div style={{ fontWeight: 950 }}>Top Production</div>
                    </div>
                    <span className="tag">Top 5</span>
                  </div>
                  <div className="panelBody">
                    {topStock.map((e, idx) => (
                      <div className="leaderRow" key={e.name + idx}>
                        <div className="row" style={{ gap: 12 }}>
                          <div className="medal">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🏅"}</div>
                          <div>
                            <div style={{ fontWeight: 950 }}>{e.name}</div>
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: "0.9rem" }}>{e.poste || "—"}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 950, color: "var(--primary)" }}>{e.stock || 0}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT */}
            {currentTab === "support" && (
              <div className="form-wrap">
                <h2 style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
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
                  <textarea className="inp-field" style={{ height: 120 }} value={supData.msg} onChange={(e) => setSupData({ ...supData, msg: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendSupport", { subject: supData.sub, message: supData.msg })}>
                  Envoyer
                </button>
              </div>
            )}
          </main>

          {/* CART UI */}
          {currentTab === "invoices" && (
            <>
              <div className="cart-btn-float" onClick={() => setCartOpen(true)}>
                <Icon name="cart" size={22} /> <span style={{ fontWeight: 950 }}>{money(cartTotal)}</span>
                <span className="badge">{cart.reduce((a, b) => a + b.qty, 0)}</span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
                <div className="cart-head">
                  <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 950 }}>
                    <Icon name="cart" /> Panier
                  </h2>
                  <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Icon name="x" size={24} />
                  </button>
                </div>

                <div style={{ padding: 18 }}>
                  <input className="inp-field" placeholder="N° Facture (Obligatoire)" style={{ textAlign: "center", fontWeight: 950 }} value={invNum} onChange={(e) => setInvNum(e.target.value)} />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-muted)", fontWeight: 800 }}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <b style={{ fontWeight: 950 }}>{c.name}</b>
                        <br />
                        <small style={{ color: "var(--text-muted)", fontWeight: 800 }}>{money(c.pu)}</small>
                      </div>

                      {/* ✅ quantités clavier (plus boutons) */}
                      <div className="qty-ctrl">
                        <button className="qb" onClick={() => setCartQty(i, c.qty - 1)}>
                          -
                        </button>
                        <input
                          className="qiInput"
                          type="number"
                          inputMode="numeric"
                          value={c.qty}
                          onChange={(e) => setCartQty(i, e.target.value)}
                        />
                        <button className="qb" onClick={() => setCartQty(i, c.qty + 1)}>
                          +
                        </button>
                      </div>

                      <button className="qb" style={{ color: "#ef4444" }} onClick={() => setCartQty(i, 0)} title="Supprimer">
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 950, marginBottom: 14 }}>
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>{money(cartTotal)}</span>
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
                borderLeftColor: toast.type === "error" ? "#ef4444" : toast.type === "success" ? "#10b981" : "var(--primary)",
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
