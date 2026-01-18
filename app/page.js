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
  const [history, setHistory] = useState([]);

  const [forms, setForms] = useState({
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '' },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  });

  // --- SYSTÈME AUDIO AMÉLIORÉ ---
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(); osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now); // Do
        osc.frequency.setValueAtTime(659.25, now + 0.1); // Mi
        osc.frequency.setValueAtTime(783.99, now + 0.2); // Sol
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(); osc.stop(now + 0.4);
      } else if (type === 'garage') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(); osc.stop(now + 0.5);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(110, now);
        gain.gain.setValueAtTime(0.2, now);
        osc.start(); osc.stop(now + 0.3);
      }
    } catch (e) {}
  };

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); 
    if(s === 'success') playSound('success');
    if(s === 'error') playSound('error');
    setTimeout(() => setToast(null), 4000); 
  };

  const loadData = async (isSync = false) => {
    if(isSync) notify("Synchronisation", "Mise à jour de la base de données...");
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
    } catch (e) { notify("Erreur", "Serveur injoignable", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const send = async (action, payload) => {
    if(sending) return;
    if(action === 'sendGarage') playSound('garage');
    else playSound('click');
    
    setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        notify("Validé", "Données enregistrées", "success"); 
        if(action === 'sendFactures') { 
          setHistory([{ id: forms.invoiceNum, total: total, time: new Date().toLocaleTimeString() }, ...history].slice(0, 3));
          setCart([]); setForms(f=>({...f, invoiceNum:''})); 
        } 
        loadData(); 
      } else notify("Échec", j.message, "error");
    } finally { setSending(false); }
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #8b5cf6; --bg: #0b0d11; --panel: #161920; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 18px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 2px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        .main { flex: 1; overflow-y: auto; padding: 24px; position: relative; background: radial-gradient(circle at 100% 0%, #1a1625 0%, #0b0d11 100%); }
        .center-form { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 85%; padding: 20px; }
        .form-card { width: 100%; max-width: 580px; background: rgba(22, 25, 32, 0.6); backdrop-filter: blur(15px); padding: 45px; border-radius: 35px; border: 1px solid var(--brd); box-shadow: 0 30px 60px rgba(0,0,0,0.6); animation: slideUp 0.4s ease-out; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 10px; border-radius: var(--radius); cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); }
        
        .btn-refresh { position: absolute; top: 25px; right: 25px; background: var(--panel); border: 1px solid var(--brd); color: var(--txt); width: 45px; height: 45px; border-radius: 50%; cursor: pointer; transition: 0.4s; display: flex; align-items: center; justify-content: center; z-index: 100; font-size: 1.2rem; }
        .btn-refresh:hover { transform: rotate(180deg); border-color: var(--p); background: var(--p); }

        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 18px; border-radius: 14px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2); }
        .btn-p:hover { filter: brightness(1.2); }

        .stat-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 10px; overflow: hidden; }
        .stat-fill { height: 100%; background: var(--p); border-radius: 10px; transition: 1s ease-out; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-card" style={{textAlign: 'center', maxWidth: 420}}>
            <img src="https://i.goopics.net/dskmxi.png" height="110" style={{marginBottom:30}} />
            <h1 style={{marginBottom:35, fontSize:'1.6rem', fontWeight:900}}>ACCÈS SYSTÈME</h1>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Qui êtes-vous ?</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>{playSound('success'); setView('app');}}>LANCER LA SESSION</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:35}}><img src="https://i.goopics.net/dskmxi.png" height="55" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>{playSound('click'); setCurrentTab(t.id);}}>
                  <span style={{fontSize:'1.2rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <button className="nav-l" onClick={()=>loadData(true)} style={{marginTop:10, color:'var(--p)', background:'rgba(139, 92, 246, 0.05)'}}>🔄 Sync Cloud</button>
          </aside>

          <main className="main">
            <button className="btn-refresh" title="Rafraîchir" onClick={()=>loadData(true)}>🔃</button>
            
            <div className="fade-in">
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
                      <div key={p} className={`card ${cart.some(i=>i.name===p)?'sel':''}`} onClick={()=>{playSound('click'); addToCart(p);}}>
                        <div className="img-p" style={{background: '#0b0c10', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 8, overflow:'hidden'}}>
                          {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{opacity:0.3}}>{p.charAt(0)}</span>}
                        </div>
                        <div style={{fontWeight:800, fontSize:'0.75rem', height:35, display:'flex', alignItems:'center', justifyContent:'center'}}>{p}</div>
                        <div style={{color:'var(--p)', fontWeight:900, marginTop:5}}>${data.prices[p]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {['stock', 'enterprise', 'partners', 'garage', 'expenses', 'support'].includes(currentTab) && (
                <div className="center-form">
                  <div className="form-card">
                    {currentTab === 'stock' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>📦 STOCK CUISINE</h2>
                        {forms.stock.map((item, i) => (
                          <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                            <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                              const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                            }}><option value="">Produit...</option>{data.products.map(p=><option key={p} value={p}>{p}</option>)}</select>
                            <input type="number" className="inp" style={{width:100, marginBottom:0}} value={item.qty} onChange={e=>{
                              const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                            }} />
                          </div>
                        ))}
                        <button className="nav-l" style={{border:'1px dashed var(--brd)', justifyContent:'center', margin:'15px 0 25px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter une ligne</button>
                        <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER LA PRODUCTION</button>
                      </>
                    )}

                    {currentTab === 'garage' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🚗 GESTION GARAGE</h2>
                        <label style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800}}>VÉHICULE</label>
                        <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                          {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                        <label style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800}}>ÉTAT</label>
                        <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                          <option>Entrée au garage</option><option>Sortie du garage</option>
                        </select>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:900, marginTop:25, fontSize:'0.9rem'}}><span>⛽ CARBURANT</span><span>{forms.garage.fuel}%</span></div>
                        <div className="fuel-gauge" style={{height:15}}><div className="fuel-fill" style={{width:`${forms.garage.fuel}%`, background: forms.garage.fuel < 25 ? '#ef4444' : 'var(--p)'}}></div></div>
                        <input type="range" style={{width:'100%', accentColor:'var(--p)', cursor:'pointer'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                        <button className="btn-p" style={{marginTop:35}} onClick={()=>send('sendGarage', forms.garage)}>METTRE À JOUR LE VÉHICULE</button>
                      </>
                    )}

                    {currentTab === 'support' && (
                      <>
                        <h2 style={{marginBottom:30, textAlign:'center'}}>🆘 ASSISTANCE DIRECTE</h2>
                        <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                          <option>Problème Stock</option><option>Erreur de Caisse</option><option>Demande RH</option><option>Autre</option>
                        </select>
                        <textarea className="inp" style={{height:180, resize:'none'}} placeholder="Détaillez votre besoin ici..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                        <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>ENVOYER LA DEMANDE</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'profile' && myProfile && (
                <div style={{maxWidth:700, margin:'50px auto', animation: 'slideUp 0.5s ease'}}>
                   <div style={{display:'flex', gap:40, alignItems:'center', marginBottom:50}}>
                      <div style={{width:130, height:130, borderRadius:40, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', fontWeight:900, boxShadow:'0 15px 35px rgba(139, 92, 246, 0.3)'}}>{user.charAt(0)}</div>
                      <div>
                        <h1 style={{fontSize:'2.5rem', fontWeight:900}}>{user}</h1>
                        <p style={{color:'var(--p)', fontSize:'1.2rem', fontWeight:800}}>{myProfile.role}</p>
                        <p style={{color:'var(--muted)', marginTop:5}}>Membre depuis {myProfile.seniority} jours</p>
                      </div>
                   </div>

                   <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:25}}>
                      <div className="card" style={{padding:30, textAlign:'left', cursor:'default'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                          <span style={{fontSize:'0.8rem', fontWeight:800, color:'var(--muted)'}}>CHIFFRE D'AFFAIRES</span>
                          <b style={{fontSize:'1.8rem'}}>${myProfile.ca.toLocaleString()}</b>
                        </div>
                        <div className="stat-bar"><div className="stat-fill" style={{width: `${Math.min((myProfile.ca/50000)*100, 100)}%`}}></div></div>
                        <p style={{fontSize:'0.65rem', marginTop:10, opacity:0.5}}>Objectif palier : $50,000</p>
                      </div>
                      
                      <div className="card" style={{padding:30, textAlign:'left', cursor:'default'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                          <span style={{fontSize:'0.8rem', fontWeight:800, color:'var(--muted)'}}>PRODUCTION STOCK</span>
                          <b style={{fontSize:'1.8rem'}}>{myProfile.stock.toLocaleString()}</b>
                        </div>
                        <div className="stat-bar"><div className="stat-fill" style={{width: `${Math.min((myProfile.stock/1000)*100, 100)}%`, background:'#10b981'}}></div></div>
                        <p style={{fontSize:'0.65rem', marginTop:10, opacity:0.5}}>Objectif palier : 1,000 unités</p>
                      </div>
                   </div>

                   <div className="card" style={{marginTop:25, padding:30, textAlign:'left', cursor:'default'}}>
                      <h3 style={{marginBottom:20, fontSize:'1rem'}}>INFORMATIONS PERSONNELLES</h3>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                        <div><label style={{fontSize:'0.7rem', color:'var(--muted)'}}>CONTACT</label><p style={{fontWeight:800, fontSize:'1.1rem'}}>{myProfile.phone}</p></div>
                        <div><label style={{fontSize:'0.7rem', color:'var(--muted)'}}>ID EMPLOYÉ</label><p style={{fontWeight:800, fontSize:'1.1rem'}}>#00{myProfile.id}</p></div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)'}}><h2 style={{fontSize:'1.1rem', fontWeight:900}}>🛒 PANIER ACTUEL</h2></div>
              <div style={{padding:15}}><input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.1rem', letterSpacing:3}} /></div>
              <div style={{flex:1, overflowY:'auto', padding:'0 15px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.8rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.7rem'}}>${i.pu}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{playSound('click'); const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <b style={{minWidth:25, textAlign:'center'}}>{i.qty}</b>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>{playSound('click'); const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'rgba(0,0,0,0.5)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:25}}>
                  <span style={{fontWeight:800, color:'var(--muted)', fontSize:'0.8rem'}}>TOTAL</span>
                  <b style={{fontSize:'2.2rem', color:'var(--p)', fontWeight:900, lineHeight:1}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>VALIDER LA VENTE</button>
              </div>
            </aside>
          )}
        </>
      )}
      {toast && <div className="toast" style={{background: toast.s === 'error' ? '#ef4444' : 'var(--p)', boxShadow:'0 10px 30px rgba(0,0,0,0.5)', fontWeight:900}}><b>{toast.t.toUpperCase()}</b> : {toast.m}</div>}
    </div>
  );
}
