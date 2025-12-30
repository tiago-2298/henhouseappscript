'use client';
import { useState, useEffect } from 'react';

// --- BIBLIOTHÈQUE D'ICÔNES SVG ---
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22v-9" />,
    building: <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4" />,
    handshake: <path d="m11 17 2 2a1 1 0 1 0 3-3M11 14l-3-3m8-2-9 9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9-9a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0" />,
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    car: <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" />,
    lifeBuoy: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.39-3.39M4.93 19.07l4.24-4.24" /></>,
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>,
    trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>;
};

export default function Home() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); 
  const [currentTab, setCurrentTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // États formulaires
  const [invNum, setInvNum] = useState('');
  const [stockItems, setStockItems] = useState([{product:'', qty:1}]);
  const [entName, setEntName] = useState('');
  const [parNum, setParNum] = useState('');
  const [expAmt, setExpAmt] = useState('');

  useEffect(() => {
    fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) })
      .then(res => res.json()).then(res => { setData(res); setLoading(false); })
      .catch(() => alert("Erreur serveur"));
  }, []);

  const notify = (title, msg, type='info') => { setToast({title, msg, type}); setTimeout(() => setToast(null), 3500); };

  const sendForm = async (action, payload) => {
    if (submitting) return; setSubmitting(true);
    notify("Envoi...", "Veuillez patienter", "info");
    try {
        const res = await fetch('/api', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action, data: { ...payload, employee: user.nom } }) });
        const json = await res.json();
        if(json.success) { notify("Succès", "Action validée !", "success"); if(action==='sendFactures') setCurrentTab('home'); setCart([]); setInvNum(''); setEntName(''); }
        else notify("Erreur", "Problème d'envoi", "error");
    } catch(e) { notify("Erreur", "Connexion perdue", "error"); } finally { setSubmitting(false); }
  };

  if(loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f9fc'}}>Chargement Hen House...</div>;

  const isManagement = user && ['PDG', 'Co-PDG', 'Manager'].includes(user.poste);
  const topEmployees = [...(data?.employees || [])].sort((a,b) => b.ca - a.ca).slice(0, 3);

  return (
    <>
    <style jsx global>{`
        :root { --primary: #ff6a2b; --bg-body: #f8f9fc; --bg-panel: #ffffff; --text-main: #1e293b; --text-muted: #64748b; --border: #e2e8f0; --radius: 24px; --sidebar-w: 260px; }
        [data-theme="dark"] { --bg-body: #0f1115; --bg-panel: #181a20; --text-main: #f8fafc; --text-muted: #94a3b8; --border: #2d313a; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background-color: var(--bg-body); color: var(--text-main); height: 100vh; overflow: hidden; display: flex; transition: 0.3s; }
        .sidebar { width: var(--sidebar-w); height: 96vh; margin: 2vh; background: var(--bg-panel); border-radius: var(--radius); display: flex; flex-direction: column; padding: 25px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); z-index: 50; border: 1px solid var(--border); }
        .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; margin-bottom: 40px; color: var(--text-main); }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; border: none; background: transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: 0.2s; text-align: left; width: 100%; }
        .nav-btn:hover { background: var(--bg-body); color: var(--text-main); }
        .nav-btn.active { background: var(--primary); color: white; }
        .main-content { flex: 1; padding: 2vh 2vh 2vh 0; overflow-y: auto; overflow-x: hidden; position: relative; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .dash-card { background: var(--bg-panel); border-radius: var(--radius); padding: 30px; border: 1px solid var(--border); transition: 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .dash-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .form-wrap { background: var(--bg-panel); padding: 40px; border-radius: 30px; max-width: 600px; margin: 0 auto; border: 1px solid var(--border); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
        .inp-field { width: 100%; padding: 14px; border: 2px solid var(--border); background: var(--bg-body); border-radius: 12px; font-size: 1rem; color: var(--text-main); margin-bottom: 20px; }
        .inp-field:focus { border-color: var(--primary); }
        .btn-primary { width: 100%; padding: 16px; background: var(--primary); color: white; border: none; border-radius: 16px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .cart-drawer { position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: var(--bg-panel); box-shadow: -10px 0 40px rgba(0,0,0,0.05); transform: translateX(100%); transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 100; border-left: 1px solid var(--border); display: flex; flex-direction: column; }
        .cart-drawer.open { transform: translateX(0); }
        .toast { position: fixed; top: 30px; right: 30px; padding: 15px 25px; background: var(--bg-panel); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-left: 5px solid var(--primary); z-index: 3000; animation: slideIn 0.3s; }
        @keyframes slideIn { from { transform: translateX(100%); } }
        .avatar { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    `}</style>

    {view === 'login' ? (
        <div style={{width:'100vw', display:'flex', justifyContent:'center', alignItems:'center', background:'var(--bg-body)'}}>
            <div className="form-wrap" style={{textAlign:'center', width:420}}>
                <img src="https://i.goopics.net/dskmxi.png" style={{height:60, marginBottom:20}} />
                <h2>Identification Lumina</h2>
                <select className="inp-field" style={{marginTop:30}} onChange={e => setUser(data.employees.find(x=>x.nom===e.target.value))}>
                    <option value="">Sélectionner un employé...</option>
                    {data.employees.map(e => <option key={e.nom} value={e.nom}>{e.nom}</option>)}
                </select>
                <button className="btn-primary" disabled={!user} onClick={()=>setView('app')}>Se connecter</button>
            </div>
        </div>
    ) : (
        <>
        <aside className="sidebar">
            <div className="brand"><img src="https://i.goopics.net/dskmxi.png" height="32" /> HEN HOUSE</div>
            <nav className="nav-list" style={{flex:1}}>
                <button className={`nav-btn ${currentTab==='home'?'active':''}`} onClick={()=>setCurrentTab('home')}><Icon name="dashboard" /> Accueil</button>
                <button className={`nav-btn ${currentTab==='invoices'?'active':''}`} onClick={()=>setCurrentTab('invoices')}><Icon name="receipt" /> Caisse</button>
                <button className={`nav-btn ${currentTab==='recipes'?'active':''}`} onClick={()=>setCurrentTab('recipes')}><Icon name="lifeBuoy" /> Cuisine</button>
                <button className={`nav-btn ${currentTab==='stock'?'active':''}`} onClick={()=>setCurrentTab('stock')}><Icon name="package" /> Stock</button>
                {isManagement && <><button className={`nav-btn ${currentTab==='enterprise'?'active':''}`} onClick={()=>setCurrentTab('enterprise')}><Icon name="building" /> Entreprise</button>
                <button className={`nav-btn ${currentTab==='partners'?'active':''}`} onClick={()=>setCurrentTab('partners')}><Icon name="handshake" /> Partenaires</button></>}
                <button className={`nav-btn ${currentTab==='team'?'active':''}`} onClick={()=>setCurrentTab('team')}><Icon name="users" /> Équipe</button>
            </nav>
            <div className="user-profile" style={{display:'flex', alignItems:'center', gap:10, padding:15, background:'var(--bg-body)', borderRadius:16, cursor:'pointer'}} onClick={()=>logout()}>
                <div className="avatar">{user.nom.charAt(0)}</div>
                <div><strong>{user.nom}</strong><br/><small style={{color:'var(--text-muted)'}}>{user.poste}</small></div>
                <Icon name="logout" size={16} className="text-muted" />
            </div>
        </aside>

        <main className="main-content">
            <header className="header-bar">
                <div style={{fontSize:'1.8rem', fontWeight:800}}>{currentTab.toUpperCase()}</div>
                <div style={{display:'flex', gap:15}}>
                    <div className="mini-stat">Session: <strong>${cart.reduce((s,i)=>s+(i.qty*i.pu),0).toFixed(2)}</strong></div>
                    <button onClick={()=>{setDarkMode(!darkMode); document.documentElement.setAttribute('data-theme', darkMode?'light':'dark')}} style={{background:'var(--bg-panel)', border:'1px solid var(--border)', width:40, height:40, borderRadius:50, cursor:'pointer'}}><Icon name={darkMode?'sun':'moon'} /></button>
                </div>
            </header>

            {currentTab === 'home' && (
                <>
                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, marginBottom:40}}>
                    {topEmployees.map((e,i)=>(
                        <div key={e.nom} className="dash-card" style={{display:'flex', alignItems:'center', gap:15}}>
                            <div style={{fontSize:'2rem'}}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                            <div><strong style={{fontSize:'1.1rem'}}>{e.nom}</strong><br/><span style={{color:'var(--primary)', fontWeight:700}}>${e.ca}</span></div>
                        </div>
                    ))}
                </div>
                <div className="dashboard-grid">
                    <div className="dash-card" onClick={()=>setCurrentTab('invoices')}><div style={{fontSize:'1.5rem', marginBottom:15}}>🧾</div><strong>Caisse</strong><p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Effectuer une vente client</p></div>
                    <div className="dash-card" onClick={()=>setCurrentTab('recipes')}><div style={{fontSize:'1.5rem', marginBottom:15}}>📖</div><strong>Recettes</strong><p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>Livre de cuisine numérique</p></div>
                </div>
                </>
            )}

            {currentTab === 'recipes' && (
                <div className="dashboard-grid">
                    {Object.entries(data.recipes).map(([name, desc]) => (
                        <div key={name} className="dash-card">
                            <strong style={{color:'var(--primary)', fontSize:'1.1rem'}}>{name}</strong>
                            <p style={{fontSize:'0.9rem', marginTop:10, lineHeight:1.5, color:'var(--text-muted)'}}>{desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {currentTab === 'invoices' && (
                <>
                <div className="prod-grid">
                    {data.products.map(p => (
                        <div key={p} className="dash-card" style={{textAlign:'center', padding:20}} onClick={()=>{
                            const ex = cart.find(x=>x.name===p);
                            if(ex) setCart(cart.map(x=>x.name===p?{...x,qty:x.qty+1}:x));
                            else setCart([...cart, {name:p, qty:1, pu:data.prices[p]}]);
                            notify("Ajouté", p, "success");
                        }}>
                            <strong>{p}</strong><br/><span style={{color:'var(--primary)'}}>${data.prices[p]}</span>
                        </div>
                    ))}
                </div>
                <div style={{position:'fixed', bottom:30, right:30, background:'var(--text-main)', color:'white', padding:'16px 30px', borderRadius:50, cursor:'pointer', fontWeight:800, boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}} onClick={()=>setCartOpen(true)}>🛒 Panier (${cart.reduce((s,i)=>s+(i.qty*i.pu),0).toFixed(2)})</div>
                </>
            )}

            {currentTab === 'team' && (
                <div className="dashboard-grid">
                    {data.employees.map(e => (
                        <div key={e.nom} className="dash-card" style={{display:'flex', alignItems:'center', gap:15}}>
                            <div className="avatar">{e.nom.charAt(0)}</div>
                            <div><strong>{e.nom}</strong><br/><small style={{color:'var(--text-muted)'}}>{e.poste}</small><br/><span style={{color:'var(--primary)', fontWeight:800}}>📞 {e.tel}</span></div>
                        </div>
                    ))}
                </div>
            )}

            {currentTab === 'stock' && (
                <div className="form-wrap">
                    <h2 style={{marginBottom:30}}>📦 Déclarer Production</h2>
                    {stockItems.map((item, i) => (
                        <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp-field" style={{flex:1}} value={item.product} onChange={e=>{const n=[...stockItems];n[i].product=e.target.value;setStockItems(n)}}>
                                <option value="">Choisir un produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}
                            </select>
                            <input type="number" className="inp-field" style={{width:100}} value={item.qty} onChange={e=>{const n=[...stockItems];n[i].qty=e.target.value;setStockItems(n)}} />
                        </div>
                    ))}
                    <button className="btn-primary" disabled={submitting} onClick={()=>sendForm('sendProduction', {items:stockItems})}>Envoyer le stock</button>
                </div>
            )}
        </main>

        <aside className={`cart-drawer ${cartOpen?'open':''}`}>
            <div className="cart-head" style={{padding:25, display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)'}}>
                <h2>Votre Panier</h2><button onClick={()=>setCartOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}><Icon name="x" size={24}/></button>
            </div>
            <div style={{flex:1, padding:25, overflowY:'auto'}}>
                <input className="inp-field" placeholder="Numéro Facture (OBLIGATOIRE)" value={invNum} onChange={e=>setInvNum(e.target.value)} style={{textAlign:'center', fontWeight:800}} />
                {cart.map((c,i)=>(
                    <div key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:20, padding:15, background:'var(--bg-body)', borderRadius:16}}>
                        <div><strong>{c.name}</strong><br/><small>x{c.qty}</small></div>
                        <strong>${(c.qty*c.pu).toFixed(2)}</strong>
                    </div>
                ))}
            </div>
            <div style={{padding:25, background:'var(--bg-body)', borderTop:'1px solid var(--border)'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.4rem', fontWeight:800, marginBottom:20}}><span>Total</span><span style={{color:'var(--primary)'}}>${cart.reduce((s,i)=>s+(i.qty*i.pu),0).toFixed(2)}</span></div>
                <button className="btn-primary" disabled={submitting || !invNum.trim()} onClick={()=>{sendForm('sendFactures', {invoiceNumber:invNum, items:cart.map(x=>({desc:x.name, qty:x.qty}))})}}>Valider la Vente</button>
            </div>
        </aside>
        </>
    )}
    {toast && <div className="toast"><strong style={{display:'block', marginBottom:4}}>{toast.title}</strong><span style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>{toast.msg}</span></div>}
    </>
  );
}
