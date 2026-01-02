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
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4zM5 4h2v3a3 3 0 0 1-2-3zM19 4h2a3 3 0 0 1-2 3V4z" />,
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
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </>
    ),
    refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
    reload: <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />,
    volume: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M17.5 6.5a8 8 0 0 1 0 11" />
      </>
    ),
    mute: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M23 9 17 15" />
        <path d="M17 9 23 15" />
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

// IMAGES PRODUITS (ton mapping)
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

// ---------- SOUND (sans fichiers) ----------
function beep(freq = 440, duration = 0.08, type = "sine", volume = 0.03) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = volume;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, duration * 1000);
  } catch {}
}
const sound = {
  click: () => beep(520, 0.05, "square", 0.02),
  success: () => {
    beep(660, 0.06, "sine", 0.03);
    setTimeout(() => beep(880, 0.07, "sine", 0.03), 70);
  },
  error: () => {
    beep(220, 0.10, "sawtooth", 0.03);
    setTimeout(() => beep(180, 0.12, "sawtooth", 0.03), 80);
  },
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
  const [darkMode, setDarkMode] = useState(true);
  const [fastMode, setFastMode] = useState(false);

  const [soundOn, setSoundOn] = useState(true);

  // Modal profil (click carte bas gauche OU annuaire)
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("");

  // états formulaires
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

  // Annuaire filters
  const [dirSearch, setDirSearch] = useState("");
  const [dirRole, setDirRole] = useState("Tous");

  // ========= helpers =========
  const currency = data?.currencySymbol || "$";
  const sessionTotal = useMemo(
    () => cart.reduce((a, b) => a + b.qty * b.pu, 0),
    [cart]
  );

  const employeesFull = data?.employeesFull || [];

  const me = useMemo(() => {
    return employeesFull.find((e) => e.name === user) || null;
  }, [employeesFull, user]);

  const topCA = useMemo(() => {
    return [...employeesFull].sort((a, b) => (b.ca || 0) - (a.ca || 0)).slice(0, 5);
  }, [employeesFull]);

  const topStock = useMemo(() => {
    return [...employeesFull].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5);
  }, [employeesFull]);

  const notify = (title, msg, type = "info") => {
    setToast({ title, msg, type });
    if (soundOn) {
      if (type === "success") sound.success();
      else if (type === "error") sound.error();
    }
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMeta = async () => {
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getMeta" }),
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
        // auto init selects si vide
        if (json.vehicles?.length) {
          setExpData((p) => ({ ...p, veh: json.vehicles[0] }));
          setGarData((p) => ({ ...p, veh: json.vehicles[0] }));
        }
        if (json.products?.length) {
          setStockItems((prev) => [{ product: prev?.[0]?.product || json.products[0], qty: prev?.[0]?.qty || 1 }]);
          setEntItems((prev) => [{ product: prev?.[0]?.product || json.products[0], qty: prev?.[0]?.qty || 1 }]);
        }
        if (json.partners && Object.keys(json.partners.companies).length) {
          const first = Object.keys(json.partners.companies)[0];
          setParCompany(first);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // ========= init =========
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark"; // ✅ aide à forcer les selects

    (async () => {
      setLoading(true);
      await fetchMeta();
      setLoading(false);
    })();
  }, []);

  // Update Partner Beneficiaries
  useEffect(() => {
    if (data && parCompany) {
      const comp = data.partners.companies[parCompany];
      if (comp?.beneficiaries?.length) setParBenef(comp.beneficiaries[0]);
      if (comp?.menus?.length) setParItems([{ menu: comp.menus[0].name, qty: 1 }]);
    }
  }, [parCompany, data]);

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.style.colorScheme = newTheme; // ✅ select natif
  };

  const login = () => {
    if (user) {
      setView("app");
      setCurrentTab("home");
    }
  };

  const logout = () => {
    setUser("");
    setView("login");
    setCart([]);
    setCartOpen(false);
    setProfileOpen(false);
  };

  const openMyProfile = () => {
    setProfileName(user);
    setProfileOpen(true);
  };

  const addToCart = (prod) => {
    if (soundOn) sound.click();

    const existing = cart.find((x) => x.name === prod);
    if (existing) {
      setCart(cart.map((x) => (x.name === prod ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { name: prod, qty: 1, pu: data.prices[prod] || 0 }]);
    }
    notify("Ajouté", prod, "success");
  };

  const modQty = (idx, newQty) => {
    const n = [...cart];
    const q = Number(newQty);
    if (!Number.isFinite(q)) return;
    if (q <= 0) n.splice(idx, 1);
    else n[idx].qty = q;
    setCart(n);
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

        // reset forms
        setCart([]);
        setInvNum("");
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

        // ✅ Sync data après actions importantes (CA/Stock)
        if (action === "sendFactures" || action === "sendProduction") {
          await fetchMeta();
        }
      } else {
        notify("Erreur", json.message || "Erreur", "error");
      }
    } catch (e) {
      notify("Erreur", e.message, "error");
    }
  };

  // --- VALIDATION HANDLERS ---
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
    if (!expData.amt || Number(expData.amt) <= 0) return notify("Erreur", "Le montant est OBLIGATOIRE", "error");
    sendForm("sendExpense", { vehicle: expData.veh, kind: expData.kind, amount: expData.amt });
  };

  // ========= loading =========
  if (loading)
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1115", color: "white" }}>
        <div style={{ textAlign: "center" }}>
          <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 16, borderRadius: 14 }} />
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Hen House</div>
          <div style={{ opacity: 0.7, fontWeight: 600 }}>Connexion…</div>
          <div style={{ opacity: 0.45, marginTop: 14, fontSize: 12 }}>v{data?.version || "…"}</div>
        </div>
      </div>
    );

  // ========= UI =========
  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #8b5cf6;
          --primary-light: rgba(139, 92, 246, 0.18);
          --bg-body: #f8f9fc;
          --bg-panel: #ffffff;
          --bg-soft: #f2f4f9;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: rgba(148, 163, 184, 0.28);
          --radius: 24px;
          --sidebar-w: 280px;
          --shadow: 0 20px 35px -18px rgba(0, 0, 0, 0.35);
        }

        [data-theme="dark"] {
          --bg-body: #0b0d12;
          --bg-panel: #12151c;
          --bg-soft: rgba(255, 255, 255, 0.04);
          --text-main: #f8fafc;
          --text-muted: #9aa6bd;
          --border: rgba(255, 255, 255, 0.08);
          --primary-light: rgba(139, 92, 246, 0.18);
          --shadow: 0 25px 45px -30px rgba(0, 0, 0, 0.6);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Plus Jakarta Sans", sans-serif;
          background-color: var(--bg-body);
          color: var(--text-main);
          height: 100vh;
          overflow: hidden;
          display: flex;
          transition: background-color 0.25s ease;
        }

        /* ✅ SELECT DARK (corrige le dropdown blanc) */
        select,
        option,
        input,
        textarea {
          color-scheme: light dark;
        }

        select {
          background: var(--bg-panel) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border) !important;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 700;
          appearance: none;
        }

        /* dropdown list */
        option {
          background: var(--bg-panel) !important;
          color: var(--text-main) !important;
        }

        /* scrollbar du dropdown (Chrome/Edge) */
        select::-webkit-scrollbar {
          width: 10px;
        }
        select::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-w);
          height: 96vh;
          margin: 2vh;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 18%),
            radial-gradient(800px 300px at 20% 10%, rgba(139, 92, 246, 0.22), transparent 55%),
            var(--bg-panel);
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          padding: 22px;
          box-shadow: var(--shadow);
          z-index: 50;
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
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
          box-shadow: 0 10px 25px -12px rgba(0, 0, 0, 0.5);
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          padding-top: 10px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-weight: 800;
          font-size: 0.94rem;
          cursor: pointer;
          transition: 0.18s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-main);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 14px 30px -18px rgba(139, 92, 246, 0.8);
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
          margin-bottom: 20px;
          padding: 0 10px;
          gap: 14px;
        }

        .page-title {
          font-size: 1.65rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .top-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .pillStat {
          background: rgba(255, 255, 255, 0.04);
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid var(--border);
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 900;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .pillStat strong {
          color: var(--text-main);
        }

        .btnIcon {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: var(--text-main);
          font-weight: 900;
          transition: 0.16s;
        }
        .btnIcon:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.16);
        }

        .switchWrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          font-weight: 900;
        }
        .toggle {
          width: 46px;
          height: 26px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.06);
          position: relative;
          cursor: pointer;
        }
        .knob {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: var(--text-main);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 2px;
          transition: 0.18s;
        }
        .toggle.on .knob {
          left: 22px;
          background: var(--primary);
        }

        /* DASHBOARD */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .dash-card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 30%), var(--bg-panel);
          border-radius: var(--radius);
          padding: 26px;
          border: 1px solid var(--border);
          position: relative;
          cursor: pointer;
          transition: 0.22s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 190px;
          box-shadow: 0 18px 40px -30px rgba(0, 0, 0, 0.65);
        }
        .dash-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139, 92, 246, 0.55);
        }
        .dash-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: var(--primary);
          border: 1px solid var(--border);
        }
        .dash-title {
          font-size: 1.1rem;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .dash-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* CATALOG */
        .search-container {
          position: relative;
          margin-bottom: 16px;
          max-width: 520px;
        }
        .search-inp {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 800;
          transition: 0.2s;
        }
        .search-inp:focus {
          border-color: rgba(139, 92, 246, 0.55);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .cat-pills {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 16px;
        }
        .pill {
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.18s;
          color: var(--text-muted);
        }
        .pill:hover,
        .pill.active {
          border-color: rgba(139, 92, 246, 0.55);
          color: white;
          background: var(--primary);
        }

        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 16px;
        }

        .prod-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 22px;
          padding: 14px;
          text-align: center;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.18s;
          position: relative;
          height: ${fastMode ? "175px" : "220px"};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .prod-card:hover {
          border-color: rgba(139, 92, 246, 0.55);
          transform: translateY(-2px);
        }

        .prod-img {
          width: 100%;
          height: ${fastMode ? "92px" : "120px"};
          border-radius: 16px;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: var(--text-muted);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .prod-title {
          font-weight: 900;
          font-size: 0.92rem;
          line-height: 1.2;
          margin-top: 8px;
        }
        .prod-price {
          color: var(--primary);
          font-weight: 1000;
          font-size: 1.08rem;
          margin-top: 6px;
        }

        /* CART */
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 92vw;
          height: 100vh;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 26%), var(--bg-panel);
          box-shadow: -10px 0 50px rgba(0, 0, 0, 0.38);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border);
          backdrop-filter: blur(12px);
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
          padding: 16px;
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
          border-radius: 16px;
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
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          font-weight: 900;
        }

        .qtyInput {
          width: 62px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
          text-align: center;
          font-weight: 1000;
        }

        .btn {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 16px;
          font-weight: 1000;
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
          box-shadow: 0 16px 35px -25px rgba(139, 92, 246, 0.9);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
        }
        .btn-soft {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          color: var(--text-main);
        }
        .btn-soft:hover {
          border-color: rgba(255, 255, 255, 0.18);
        }

        .cart-btn-float {
          position: fixed;
          bottom: 26px;
          right: 26px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 12px 16px;
          border-radius: 999px;
          font-weight: 1000;
          cursor: pointer;
          box-shadow: 0 18px 40px -30px rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.18s;
          z-index: 90;
          backdrop-filter: blur(10px);
        }
        .cart-btn-float:hover {
          transform: translateY(-1px);
          border-color: rgba(139, 92, 246, 0.55);
        }

        /* FORMS */
        .form-wrap {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 28%), var(--bg-panel);
          padding: 34px;
          border-radius: 30px;
          max-width: 650px;
          margin: 0 auto;
          border: 1px solid var(--border);
          box-shadow: 0 22px 55px -40px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
        }
        .inp-group {
          margin-bottom: 16px;
        }
        .inp-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 900;
          font-size: 0.86rem;
          color: var(--text-muted);
        }
        .inp-field {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          font-size: 1rem;
          font-family: inherit;
          color: var(--text-main);
          transition: 0.18s;
          font-weight: 800;
        }
        .inp-field:focus {
          border-color: rgba(139, 92, 246, 0.55);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        /* LOGIN */
        #gate {
          position: fixed;
          inset: 0;
          background: radial-gradient(900px 380px at 30% 20%, rgba(139, 92, 246, 0.25), transparent 55%), var(--bg-body);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-box {
          text-align: center;
          width: 420px;
          max-width: 92vw;
          padding: 34px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 30%), var(--bg-panel);
          border-radius: 30px;
          box-shadow: 0 30px 70px -55px rgba(0, 0, 0, 0.85);
        }

        /* TOAST */
        .toast {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 3000;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 30%), var(--bg-panel);
          padding: 14px 18px;
          border-radius: 16px;
          box-shadow: 0 18px 50px -35px rgba(0, 0, 0, 0.85);
          border: 1px solid var(--border);
          min-width: 280px;
          animation: slideIn 0.25s;
          color: var(--text-main);
          backdrop-filter: blur(10px);
        }
        @keyframes slideIn {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
        }
        .t-title {
          font-weight: 1000;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .t-msg {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        /* EMPLOYEE CARD (bas gauche) */
        .empCard {
          margin-top: 14px;
          padding: 14px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }
        .empTop {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .empAvatar {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(139, 92, 246, 0.22);
          border: 1px solid rgba(139, 92, 246, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 1000;
          color: white;
        }
        .empName {
          font-weight: 1000;
          line-height: 1.1;
        }
        .empMeta {
          margin-top: 4px;
          display: flex;
          gap: 10px;
          align-items: center;
          color: var(--text-muted);
          font-weight: 800;
          font-size: 0.82rem;
        }
        .badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
          font-weight: 1000;
          font-size: 0.75rem;
        }

        .miniGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }
        .miniBox {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 10px;
        }
        .miniLabel {
          color: var(--text-muted);
          font-weight: 900;
          font-size: 0.78rem;
        }
        .miniVal {
          font-weight: 1000;
          margin-top: 4px;
        }

        .empActions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .empBtn {
          height: 38px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-main);
          font-weight: 1000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .empBtn:hover {
          border-color: rgba(255, 255, 255, 0.18);
        }
        .empBtn.danger {
          border-color: rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }

        .empToggles {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 12px;
        }
        .smallRound {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
        }
        .smallRound:hover {
          border-color: rgba(139, 92, 246, 0.55);
        }

        /* MODAL */
        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 4000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .modalCard {
          width: 760px;
          max-width: 96vw;
          border-radius: 26px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 26%), var(--bg-panel);
          box-shadow: 0 40px 120px -80px rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }
        .modalHead {
          padding: 18px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
        }
        .modalBody {
          padding: 18px;
        }
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 760px) {
          .grid2 {
            grid-template-columns: 1fr;
          }
        }

        /* list cards */
        .listCard {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 14px;
          cursor: pointer;
        }
        .listCard:hover {
          border-color: rgba(139, 92, 246, 0.55);
        }
      `}</style>

      {view === "login" ? (
        <div id="gate">
          <div className="login-box">
            <img src="https://i.goopics.net/dskmxi.png" style={{ height: 60, marginBottom: 16, borderRadius: 14 }} />
            <h2 style={{ marginBottom: 8, fontWeight: 1000 }}>Bienvenue</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 18, fontWeight: 700 }}>Connectez-vous pour commencer</p>

            <select className="inp-field" value={user} onChange={(e) => setUser(e.target.value)} style={{ marginBottom: 16, textAlign: "center" }}>
              <option value="">Sélectionner un nom...</option>
              {data?.employees?.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={login} disabled={!user} style={{ opacity: !user ? 0.6 : 1 }}>
              Accéder <Icon name="dashboard" size={18} />
            </button>

            <div style={{ marginTop: 14, fontSize: 12, opacity: 0.5, fontWeight: 700 }}>v{data?.version}</div>
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

            {/* ✅ EMPLOYEE CARD PROPRE */}
            <div className="empCard">
              <div className="empTop" onClick={openMyProfile} title="Voir mon profil">
                <div className="empAvatar">{user?.[0] || "?"}</div>
                <div style={{ flex: 1 }}>
                  <div className="empName">{user}</div>
                  <div className="empMeta">
                    <span className="badge">{me?.poste || "Employé"}</span>
                    <span>•</span>
                    <span>{me?.anciennete ?? 0} j</span>
                  </div>
                </div>
                <Icon name="users" size={18} style={{ opacity: 0.8 }} />
              </div>

              <div className="miniGrid">
                <div className="miniBox">
                  <div className="miniLabel">CA</div>
                  <div className="miniVal">
                    {currency}
                    {(me?.ca || 0).toFixed(2)}
                  </div>
                </div>
                <div className="miniBox">
                  <div className="miniLabel">Stock</div>
                  <div className="miniVal">{me?.stock || 0}</div>
                </div>
              </div>

              <div className="empActions">
                <button className="empBtn" onClick={() => setCurrentTab("directory")}>
                  <Icon name="users" size={16} /> Annuaire
                </button>
                <button className="empBtn" onClick={openMyProfile}>
                  <Icon name="dashboard" size={16} /> Profil
                </button>
                <button className="empBtn danger" onClick={logout}>
                  <Icon name="logout" size={16} /> Quitter
                </button>
              </div>

              <div className="empToggles">
                <button className="smallRound" onClick={toggleTheme} title="Thème">
                  {darkMode ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
                </button>
                <button
                  className="smallRound"
                  onClick={() => {
                    setSoundOn((v) => !v);
                    setTimeout(() => {
                      if (!soundOn) sound.success();
                    }, 0);
                  }}
                  title="Sons"
                >
                  {soundOn ? <Icon name="volume" size={18} /> : <Icon name="mute" size={18} />}
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
                {currentTab === "support" && (
                  <>
                    <Icon name="lifeBuoy" size={30} /> Support
                  </>
                )}
              </div>

              {/* ✅ TOP RIGHT : Session + Mode rapide + Sync + Reload + Theme */}
              <div className="top-actions">
                <div className="pillStat">
                  Session:{" "}
                  <strong>
                    {currency}
                    {sessionTotal.toFixed(2)}
                  </strong>
                </div>

                <div className="switchWrap">
                  Mode rapide
                  <div
                    className={`toggle ${fastMode ? "on" : ""}`}
                    onClick={() => setFastMode((v) => !v)}
                    role="button"
                    aria-label="toggle fast mode"
                  >
                    <div className="knob" />
                  </div>
                </div>

                <button
                  className="btnIcon"
                  onClick={async () => {
                    const ok = await fetchMeta();
                    notify(ok ? "Sync" : "Erreur", ok ? "Données mises à jour" : "Impossible de synchroniser", ok ? "success" : "error");
                  }}
                  title="↻ Sync (rafraîchir les données)"
                >
                  <Icon name="refresh" size={18} /> Sync
                </button>

                <button
                  className="btnIcon"
                  onClick={() => window.location.reload()}
                  title="⟳ Reload (recharger le site)"
                >
                  <Icon name="reload" size={18} /> Reload
                </button>

                <button className="btnIcon" onClick={toggleTheme} title="Thème">
                  {darkMode ? <Icon name="sun" size={18} /> : <Icon name="moon" size={18} />}
                </button>
              </div>
            </header>

            {/* HOME */}
            {currentTab === "home" && (
              <>
                <div className="dashboard-grid" style={{ marginBottom: 18 }}>
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
                      <div className="dash-title">Performance</div>
                      <div className="dash-desc">Top vendeurs & production</div>
                    </div>
                  </div>
                </div>

                {/* blocs top */}
                <div className="dashboard-grid">
                  <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                    <div className="dash-title">🏆 Top CA</div>
                    <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                      {topCA.map((e, idx) => (
                        <div key={e.name} className="listCard" onClick={() => { setProfileName(e.name); setProfileOpen(true); }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: 1000 }}>
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"} {e.name}
                              <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{e.poste}</div>
                            </div>
                            <div style={{ fontWeight: 1000, color: "var(--primary)" }}>
                              {currency}
                              {(e.ca || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                    <div className="dash-title">📦 Top Stock</div>
                    <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                      {topStock.map((e, idx) => (
                        <div key={e.name} className="listCard" onClick={() => { setProfileName(e.name); setProfileOpen(true); }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontWeight: 1000 }}>
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"} {e.name}
                              <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{e.poste}</div>
                            </div>
                            <div style={{ fontWeight: 1000 }}>{e.stock || 0}</div>
                          </div>
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
                        <div className="prod-price">
                          {currency}
                          {Number(data.prices[p] || 0).toFixed(2)}
                        </div>
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
                      inputMode="numeric"
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
                        setStockItems(n.length ? n : [{ product: data.products[0], qty: 1 }]);
                      }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-soft" onClick={() => setStockItems([...stockItems, { product: data.products[0], qty: 1 }])}>
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
                      inputMode="numeric"
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
                        setEntItems(n.length ? n : [{ product: data.products[0], qty: 1 }]);
                      }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-soft" onClick={() => setEntItems([...entItems, { product: data.products[0], qty: 1 }])}>
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

                    <input
                      type="number"
                      inputMode="numeric"
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
                        setParItems(n.length ? n : [{ menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }]);
                      }}
                    >
                      <Icon name="x" size={18} />
                    </button>
                  </div>
                ))}

                <button className="btn btn-soft" onClick={() => setParItems([...parItems, { menu: data.partners.companies[parCompany].menus[0].name, qty: 1 }])}>
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
                  <label className="inp-label">Montant ({currency})</label>
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
                  <input type="range" style={{ width: "100%" }} value={garData.fuel} onChange={(e) => setGarData({ ...garData, fuel: e.target.value })} />{" "}
                  <span style={{ fontWeight: 900 }}>{garData.fuel}%</span>
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendGarage", { vehicle: garData.veh, action: garData.action, fuel: garData.fuel })}>
                  Mettre à jour
                </button>
              </div>
            )}

            {/* ANNUAIRE */}
            {currentTab === "directory" && (
              <>
                <div className="dashboard-grid" style={{ marginBottom: 14 }}>
                  <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                    <div className="dash-title">Recherche</div>
                    <div className="dash-desc" style={{ marginBottom: 10 }}>
                      Filtre par poste + recherche nom / tel
                    </div>

                    <div className="grid2">
                      <div className="inp-group" style={{ marginBottom: 0 }}>
                        <label className="inp-label">Rechercher</label>
                        <input className="inp-field" placeholder="Ex: Parker / 383…" value={dirSearch} onChange={(e) => setDirSearch(e.target.value)} />
                      </div>
                      <div className="inp-group" style={{ marginBottom: 0 }}>
                        <label className="inp-label">Poste</label>
                        <select className="inp-field" value={dirRole} onChange={(e) => setDirRole(e.target.value)}>
                          <option value="Tous">Tous</option>
                          {Array.from(new Set(employeesFull.map((e) => e.poste).filter(Boolean))).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                    <div className="dash-title">Actions rapides</div>
                    <div className="dash-desc" style={{ marginTop: 6 }}>
                      Clique une carte pour ouvrir le profil (copie téléphone)
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  {employeesFull
                    .filter((e) => {
                      const q = dirSearch.toLowerCase();
                      const okSearch =
                        !q ||
                        e.name.toLowerCase().includes(q) ||
                        String(e.telephone || "").toLowerCase().includes(q) ||
                        String(e.poste || "").toLowerCase().includes(q);
                      const okRole = dirRole === "Tous" || e.poste === dirRole;
                      return okSearch && okRole;
                    })
                    .map((e) => (
                      <div
                        key={e.name}
                        className="dash-card"
                        style={{ height: "auto" }}
                        onClick={() => {
                          setProfileName(e.name);
                          setProfileOpen(true);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div className="empAvatar">{e.name?.[0] || "?"}</div>
                            <div>
                              <div style={{ fontWeight: 1000 }}>{e.name}</div>
                              <div style={{ marginTop: 4, display: "flex", gap: 8, alignItems: "center" }}>
                                <span className="badge">{e.poste || "Employé"}</span>
                                <span style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>• {e.anciennete} j</span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btnIcon"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              navigator.clipboard?.writeText(String(e.telephone || ""));
                              notify("Copié", "Téléphone copié", "success");
                            }}
                            title="Copier téléphone"
                          >
                            📞 Copier
                          </button>
                        </div>

                        <div className="miniGrid" style={{ marginTop: 14 }}>
                          <div className="miniBox">
                            <div className="miniLabel">Téléphone</div>
                            <div className="miniVal">{e.telephone || "-"}</div>
                          </div>
                          <div className="miniBox">
                            <div className="miniLabel">Salaire</div>
                            <div className="miniVal">
                              {currency}
                              {(e.salaire || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* PERFORMANCE */}
            {currentTab === "performance" && (
              <div className="dashboard-grid">
                <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                  <div className="dash-title">🏆 Top CA</div>
                  <div className="dash-desc">Classement basé sur la colonne CA du Google Sheet</div>

                  <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                    {topCA.map((e, idx) => (
                      <div key={e.name} className="listCard" onClick={() => { setProfileName(e.name); setProfileOpen(true); }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontWeight: 1000 }}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"} {e.name}
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{e.poste}</div>
                          </div>
                          <div style={{ fontWeight: 1000, color: "var(--primary)" }}>
                            {currency}
                            {(e.ca || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card" style={{ height: "auto", cursor: "default" }}>
                  <div className="dash-title">📦 Top Stock</div>
                  <div className="dash-desc">Classement basé sur la colonne Stock du Google Sheet</div>

                  <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                    {topStock.map((e, idx) => (
                      <div key={e.name} className="listCard" onClick={() => { setProfileName(e.name); setProfileOpen(true); }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontWeight: 1000 }}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"} {e.name}
                            <div style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12, marginTop: 2 }}>{e.poste}</div>
                          </div>
                          <div style={{ fontWeight: 1000 }}>{e.stock || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <textarea className="inp-field" style={{ height: 120, resize: "none" }} value={supData.msg} onChange={(e) => setSupData({ ...supData, msg: e.target.value })} />
                </div>

                <button className="btn btn-primary" onClick={() => sendForm("sendSupport", { subject: supData.sub, message: supData.msg })}>
                  Envoyer
                </button>
              </div>
            )}
          </main>

          {/* CART DRAWER */}
          {currentTab === "invoices" && (
            <>
              <div className="cart-btn-float" onClick={() => setCartOpen(true)}>
                <Icon name="cart" size={22} />{" "}
                <span style={{ fontWeight: 1000 }}>
                  {currency}
                  {sessionTotal.toFixed(2)}
                </span>
              </div>

              <aside className={`cart-drawer ${cartOpen ? "open" : ""}`}>
                <div className="cart-head">
                  <h2 style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 1000 }}>
                    <Icon name="cart" /> Panier
                  </h2>
                  <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-main)" }}>
                    <Icon name="x" size={22} />
                  </button>
                </div>

                <div style={{ padding: 16 }}>
                  <input className="inp-field" placeholder="N° Facture (Obligatoire)" style={{ textAlign: "center" }} value={invNum} onChange={(e) => setInvNum(e.target.value)} />
                </div>

                <div className="cart-body">
                  {cart.length === 0 && <div style={{ textAlign: "center", marginTop: 50, color: "var(--text-muted)", fontWeight: 800 }}>Panier vide</div>}

                  {cart.map((c, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ flex: 1 }}>
                        <b>{c.name}</b>
                        <br />
                        <small style={{ color: "var(--text-muted)", fontWeight: 800 }}>
                          {currency}
                          {Number(c.pu || 0).toFixed(2)}
                        </small>
                      </div>

                      {/* ✅ qty clavier */}
                      <div className="qty-ctrl">
                        <button className="qb" onClick={() => modQty(i, Number(c.qty) - 1)}>
                          -
                        </button>
                        <input
                          className="qtyInput"
                          type="number"
                          inputMode="numeric"
                          value={c.qty}
                          onChange={(e) => modQty(i, e.target.value)}
                        />
                        <button className="qb" onClick={() => modQty(i, Number(c.qty) + 1)}>
                          +
                        </button>
                      </div>

                      <button className="qb" style={{ color: "#ef4444" }} onClick={() => modQty(i, 0)}>
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-foot">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: 1000, marginBottom: 12 }}>
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>
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

          {/* PROFILE MODAL */}
          {profileOpen && (
            <div className="modalBackdrop" onClick={() => setProfileOpen(false)}>
              <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                {(() => {
                  const p = employeesFull.find((x) => x.name === profileName);
                  if (!p) return null;
                  return (
                    <>
                      <div className="modalHead">
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="empAvatar">{p.name?.[0] || "?"}</div>
                          <div>
                            <div style={{ fontWeight: 1000, fontSize: 18 }}>{p.name}</div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                              <span className="badge">{p.poste || "Employé"}</span>
                              <span style={{ color: "var(--text-muted)", fontWeight: 800, fontSize: 12 }}>• {p.anciennete} jours</span>
                            </div>
                          </div>
                        </div>

                        <button className="btnIcon" onClick={() => setProfileOpen(false)}>
                          <Icon name="x" size={18} /> Fermer
                        </button>
                      </div>

                      <div className="modalBody">
                        <div className="grid2">
                          <div className="miniBox">
                            <div className="miniLabel">Téléphone</div>
                            <div className="miniVal" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span>{p.telephone || "-"}</span>
                              <button
                                className="btnIcon"
                                onClick={() => {
                                  navigator.clipboard?.writeText(String(p.telephone || ""));
                                  notify("Copié", "Téléphone copié", "success");
                                }}
                              >
                                📞 Copier
                              </button>
                            </div>
                          </div>

                          <div className="miniBox">
                            <div className="miniLabel">Date d’arrivée</div>
                            <div className="miniVal">{p.dateArrivee ? String(p.dateArrivee) : "-"}</div>
                          </div>

                          <div className="miniBox">
                            <div className="miniLabel">CA</div>
                            <div className="miniVal">
                              {currency}
                              {(p.ca || 0).toFixed(2)}
                            </div>
                          </div>

                          <div className="miniBox">
                            <div className="miniLabel">Stock</div>
                            <div className="miniVal">{p.stock || 0}</div>
                          </div>

                          <div className="miniBox">
                            <div className="miniLabel">Salaire</div>
                            <div className="miniVal">
                              {currency}
                              {(p.salaire || 0).toFixed(2)}
                            </div>
                          </div>

                          <div className="miniBox">
                            <div className="miniLabel">ID</div>
                            <div className="miniVal">{p.id || "-"}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
