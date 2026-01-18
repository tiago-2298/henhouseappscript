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
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png", "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Wings épicé": "https://files.catbox.moe/i17915.png", "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png", "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Ribbs": "https://files.catbox.moe/ej5jok.png", "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Rougail Saucisse": "https://files.catbox.moe/jqzox0.png", "Brochettes de fruits frais": "https://files.catbox.moe/cbmjou.png",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png", "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Tourte Myrtille": "https://files.catbox.moe/oxwlna.png", "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Lait de poule": "https://files.catbox.moe/jxgida.png"
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');
  const [cart, setCart] = useState([]);

  const [forms, setForms] = useState({
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '' },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  });

  const playSound = (type) => {
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
    setTimeout(() => setToast(null), 3000); 
  };

  const loadData = async (isSync = false) => {
    if(isSync) notify("Sync Cloud", "Mise à jour en cours...", "info");
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
        if(isSync) playSound('success');
      }
    } catch (e) { notify("Erreur", "Connexion perdue", "error"); }
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
        notify("Validé", "Données enregistrées", "success"); 
        if(action === 'sendFactures') setCart([]); 
        loadData(); 
      } else notify("Échec", j.message, "error");
    } finally { setSending(false); }
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #8b5cf6; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 16px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 2px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .main { flex: 1; overflow-y: auto; padding: 24px; position: relative; background: radial-gradient(circle at 100% 100%, #1a1625 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 18px; cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .center-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80%; }
        .form-ui { width: 100%; max-width: 550px; background: rgba(22, 25, 32, 0.6); backdrop-filter: blur(12px); padding: 40px; border-radius: 30px; border: 1px solid var(--brd); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .cart { width: 380px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; }
        .sk-wrap { display: flex; height: 100vh; gap: 20px; padding: 20px; }
        .sk { background: #1a1a1a; border-radius: 20px; animation: pulse 1.5s infinite; }
        .sk-s { width: 260px; } .sk-m { flex:1; }
        .fuel-gauge { width: 100%; height: 12px; background: #000; border-radius: 10px; overflow: hidden; margin: 10px 0; border: 1px solid var(--brd); }
        .fuel-fill { height: 100%; transition: 0.5s; }
        .qty-inp { width: 55px; background: #000; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 6px; font-weight: 800; padding: 5px 0; font-size: 1rem; }
        .perf-bar { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .perf-fill { height: 100%; background: var(--p); }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{textAlign: 'center', maxWidth: 400}}>
            <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30}} />
            <h1 style={{marginBottom:30}}>BIENVENUE</h1>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Qui êtes-vous ?</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); setView('app');}}>OUVRIR MA SESSION</button>
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
            
            <div style={{padding: '10px 0', borderTop: '1px solid var(--brd)'}}>
              <button className="nav-l" style={{color: 'var(--p)'}} onClick={() => loadData(true)}>☁️ Sync Cloud</button>
              <button className="nav-l" onClick={() => window.location.reload()}>🔃 Refresh Page</button>
              <button className="nav-l" onClick={() => setView('login')} style={{color:'#ef4444', marginTop: 10}}>🚪 Déconnexion</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {/* ACCUEIL */}
              {currentTab === 'home' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20}}>
                   {MODULES.filter(m => m.id !== 'home').map(m => (
                     <div key={m.id} className="card" style={{height:180, display:'flex', flexDirection:'column', justifyContent:'center', gap:15}} onClick={()=>setCurrentTab(m.id)}>
                        <span style={{fontSize:'3.5rem'}}>{m.e}</span>
                        <h3 style={{fontSize:'1rem', fontWeight:800}}>{m.l}</h3>
                     </div>
                   ))}
                </div>
              )}

              {/* CAISSE */}
              {currentTab === 'invoices' && (
                <>
                  <div style={{display:'flex', gap:10, marginBottom:25}}>
                    <input className="inp" placeholder="🔍 Rechercher un plat..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
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

              {/* FORMULAIRES CENTRÉS (STOCK, ENTREPRISE, PARTENAIRES, GARAGE, FRAIS, SUPPORT) */}
              {['stock', 'enterprise', 'partners', 'garage', 'expenses', 'support'].includes(currentTab) && (
                <div className="center-box">
                  <div className="form-ui">
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>📦 STOCK CUISINE</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Choisir produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'1px dashed var(--brd)', justifyContent:'center', margin:'10px 0 20px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ligne</button>
                        <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER PRODUCTION</button>
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
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                            }} />
                          </div>
                        ))}
                        <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>ENVOYER COMMANDE</button>
                      </>
                    )}

                    {currentTab === 'partners' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🤝 PARTENAIRES</h2>
                        <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
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
                        <h4 style={{margin: '10px 0'}}>Menu Partenaire</h4>
                        {forms.partner.items.map((item, i) => (
                           <div key={i} style={{display:'flex', gap:10}}>
                              <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{
                                 const n=[...forms.partner.items]; n[i].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                              }}>
                                 {data.partners.companies[forms.partner.company]?.menus.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
                              </select>
                              <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{
                                 const n=[...forms.partner.items]; n[i].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                              }} />
                           </div>
                        ))}
                        <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>VALIDER COMMANDE</button>
                      </>
                    )}

                    {currentTab === 'expenses' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>💳 FRAIS</h2>
                        <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}><option>Essence</option><option>Réparation</option></select>
                        <input className="inp" type="number" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                        <button className="btn-p" onClick={()=>send('sendExpense', forms.expense)}>DÉCLARER</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🚗 GARAGE</h2>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>{data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}</select>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}><option>Entrée</option><option>Sortie</option></select>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:20}}><span>⛽ Essence</span><span>{forms.garage.fuel}%</span></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', marginTop:15}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:25}} onClick={()=>send('sendGarage', forms.garage)}>ENREGISTRER</button>
                      </>
                    )}

                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:25, textAlign:'center'}}>🆘 SUPPORT</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur Facture</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:180, resize:'none'}} placeholder="Détails du problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER AU PATRON</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ANNUAIRE */}
              {currentTab === 'directory' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:15}}>
                  {data.employeesFull.map(e => (
                    <div key={e.id} className="card" style={{padding:20, textAlign:'left', display:'flex', gap:15, alignItems:'center'}}>
                      <div style={{width:50, height:50, borderRadius:15, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:900}}>{e.name.charAt(0)}</div>
                      <div style={{flex:1}}><div style={{fontWeight:800}}>{e.name}</div><div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700}}>{e.role}</div><div style={{fontSize:'0.85rem', marginTop:5, color:'var(--muted)'}}>📞 {e.phone}</div></div>
                    </div>
                  ))}
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

              {/* MON PROFIL */}
              {currentTab === 'profile' && myProfile && (
                <div className="center-box">
                   <div className="form-ui" style={{maxWidth: 600, padding: 50}}>
                      <div style={{textAlign:'center', marginBottom: 30}}>
                        <div style={{width:130, height:130, borderRadius:40, background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', fontWeight:900}}>{user.charAt(0)}</div>
                        <h1 style={{fontSize:'2.5rem', fontWeight:900}}>{user}</h1>
                        <p style={{color:'var(--p)', fontSize:'1.2rem', fontWeight:800}}>{myProfile.role}</p>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom: 30}}>
                         <div className="card" style={{background: 'rgba(0,0,0,0.3)'}}>
                            <p style={{fontSize:'0.8rem', color:'var(--muted)'}}>💰 CHIFFRE D'AFFAIRES</p>
                            <p style={{fontSize: '1.5rem', fontWeight: 900}}>${myProfile.ca.toLocaleString()}</p>
                         </div>
                         <div className="card" style={{background: 'rgba(0,0,0,0.3)'}}>
                            <p style={{fontSize:'0.8rem', color:'var(--muted)'}}>📦 UNITÉS PRODUITES</p>
                            <p style={{fontSize: '1.5rem', fontWeight: 900}}>{myProfile.stock.toLocaleString()} u.</p>
                         </div>
                      </div>
                      <div className="card" style={{textAlign: 'left', background: 'rgba(255,255,255,0.02)'}}>
                        <p style={{marginBottom: 10}}>📅 <b>Ancienneté :</b> {myProfile.seniority} jours</p>
                        <p style={{marginBottom: 10}}>🆔 <b>ID Employé :</b> #00{myProfile.id}</p>
                        <p>📞 <b>Numéro :</b> {myProfile.phone}</p>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </main>

          {/* PANIER (CAISSE SEULEMENT) */}
          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)'}}><h2 style={{fontSize:'1.1rem', fontWeight:900}}>🛒 PANIER</h2></div>
              <div style={{padding:15}}><input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem'}} /></div>
              <div style={{flex:1, overflowY:'auto', padding:'0 15px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{playSound('click'); const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <input className="qty-inp" type="number" value={i.qty} onChange={(e) => updateCartQty(idx, e.target.value)} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{playSound('click'); const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'rgba(0,0,0,0.5)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}><span>TOTAL</span><b style={{fontSize:'2.2rem', color:'var(--p)', fontWeight:900}}>${total.toLocaleString()}</b></div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>VALIDER VENTE</button>
              </div>
            </aside>
          )}
        </>
      )}
      {toast && <div className="toast" style={{position:'fixed', top:20, right:20, background: toast.s === 'error' ? '#ef4444' : '#8b5cf6', padding:'15px 30px', borderRadius:12, zIndex:2000}}><b>{toast.t.toUpperCase()}</b> : {toast.m}</div>}
    </div>
  );
}
