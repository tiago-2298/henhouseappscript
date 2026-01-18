'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION DES MODULES ---
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

  const notify = (t, m, s='info') => { setToast({t, m, s}); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
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
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const v = parseInt(val);
    if (isNaN(v) || v <= 0) n.splice(idx, 1);
    else n[idx].qty = v;
    setCart(n);
  };

  const send = async (action, payload) => {
    if(action === 'sendFactures' && (!forms.invoiceNum || cart.length === 0)) return notify("Erreur", "Facture ou Panier vide", "error");
    notify("Envoi...", "Traitement...");
    const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
    const j = await r.json();
    if(j.success) { 
      notify("Succès", "Validé", "success"); 
      if(action === 'sendFactures') { 
        setHistory([{ id: forms.invoiceNum, total: total, time: new Date().toLocaleTimeString() }, ...history].slice(0, 3));
        setCart([]); setForms(f=>({...f, invoiceNum:''})); 
      } 
      load(); 
    } else notify("Erreur", j.message, "error");
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #8b5cf6; --bg: #0f1115; --panel: #181a20; --txt: #f8fafc; --muted: #94a3b8; --brd: #2d313a; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 240px; border-right: 1px solid var(--brd); padding: 20px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 2px; }
        .nav-l.active { background: var(--p); color: #fff; }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .main { flex: 1; overflow-y: auto; padding: 20px; scroll-behavior: smooth; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 8px; border-radius: 12px; cursor: pointer; transition: 0.2s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-2px); }
        .img-p { width: 100%; aspect-ratio:1; border-radius: 8px; object-fit: cover; margin-bottom: 6px; background: #000; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .cart-zone { width: 360px; border-left: 1px solid var(--brd); background: rgba(0,0,0,0.4); display: flex; flex-direction: column; }
        .inp { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--brd); background: var(--panel); color: #fff; font-weight: 700; margin-bottom: 10px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 14px; border-radius: 10px; font-weight: 800; cursor: pointer; width: 100%; }
        .sk-wrap { display: flex; height: 100vh; gap: 20px; padding: 20px; }
        .sk { background: #1a1a1a; border-radius: 20px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        .fuel-gauge { width: 100%; height: 12px; background: #000; border-radius: 10px; overflow: hidden; margin: 10px 0; border: 1px solid var(--brd); }
        .fuel-fill { height: 100%; transition: 0.3s; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: 'var(--panel)', padding: 40, borderRadius: 30, width: 380, textAlign: 'center', border: '1px solid var(--brd)'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="70" style={{marginBottom:20}} />
            <h2 style={{marginBottom:24}}>Hen House</h2>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Votre nom...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>setView('app')} disabled={!user}>Se connecter</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:25}}><img src="https://i.goopics.net/dskmxi.png" height="40" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <div style={{padding:12, background:'rgba(255,255,255,0.03)', borderRadius:10}}>
               <div style={{fontSize:'0.75rem', fontWeight:800}}>👤 {user}</div>
               <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', padding:0, marginTop:8, height:'auto'}}>🚪 Déconnexion</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in">
              {currentTab === 'invoices' && (
                <>
                  <div style={{display:'flex', gap:10, marginBottom:20}}>
                    <input className="inp" placeholder="🔍 Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                    <select className="inp" style={{width:150, marginBottom:0}} onChange={e=>setCatFilter(e.target.value)}>
                      <option>Tous</option>
                      {Object.keys(data.productsByCategory).map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                      <div key={p} className="card" onClick={()=>{
                        const ex = cart.find(x=>x.name===p);
                        if(ex) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                        else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                      }}>
                        <div className="img-p">{IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:8}} /> : p.charAt(0)}</div>
                        <div style={{fontWeight:800, fontSize:'0.7rem', height:30, overflow:'hidden'}}>{p}</div>
                        <div style={{color:'var(--p)', fontWeight:900}}>${data.prices[p]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {currentTab === 'stock' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:20}}>📦 Stock Cuisine</h2>
                  {forms.stock.map((item, i) => (
                    <div key={i} style={{display:'flex', gap:8, marginBottom:8}}>
                      <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                        const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                      }}>
                        <option value="">Produit...</option>
                        {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="number" className="inp" style={{width:100}} value={item.qty} onChange={e=>{
                        const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                      }} />
                    </div>
                  ))}
                  <button className="nav-l" onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter</button>
                  <button className="btn-p" style={{marginTop:15}} onClick={()=>send('sendProduction', {items: forms.stock})}>Déclarer Stock</button>
                </div>
              )}

              {currentTab === 'garage' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2>🚗 Garage</h2>
                  <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                  <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                    <option>Entrée</option><option>Sortie</option>
                  </select>
                  <label style={{fontSize:'0.8rem', fontWeight:800}}>Essence : {forms.garage.fuel}%</label>
                  <div className="fuel-gauge"><div className="fuel-fill" style={{width:`${forms.garage.fuel}%`, background: forms.garage.fuel < 20 ? '#ef4444' : 'var(--p)'}}></div></div>
                  <input type="range" style={{width:'100%'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                  <button className="btn-p" style={{marginTop:15}} onClick={()=>send('sendGarage', forms.garage)}>Valider</button>
                </div>
              )}

              {currentTab === 'partners' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2>🤝 Partenaires</h2>
                  <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                  <select className="inp" value={forms.partner.company} onChange={e=>{
                    const c = e.target.value;
                    setForms({...forms, partner:{...forms.partner, company:c, benef: data.partners.companies[c].beneficiaries[0], items:[{menu:data.partners.companies[c].menus[0].name, qty:1}]}});
                  }}>
                    {Object.keys(data.partners.companies).map(c=><option key={c}>{c}</option>)}
                  </select>
                  <select className="inp" value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                    {data.partners.companies[forms.partner.company].beneficiaries.map(b=><option key={b}>{b}</option>)}
                  </select>
                  <h3>Menus</h3>
                  {forms.partner.items.map((item, i) => (
                    <div key={i} style={{display:'flex', gap:8, marginBottom:8}}>
                      <select className="inp" style={{flex:1}} value={item.menu} onChange={e=>{
                        const n=[...forms.partner.items]; n[i].menu=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                      }}>
                        {data.partners.companies[forms.partner.company].menus.map(m=><option key={m.name}>{m.name}</option>)}
                      </select>
                      <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{
                        const n=[...forms.partner.items]; n[i].qty=e.target.value; setForms({...forms, partner:{...forms.partner, items:n}});
                      }} />
                    </div>
                  ))}
                  <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>Confirmer</button>
                </div>
              )}

              {currentTab === 'directory' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:15}}>
                  {data.employeesFull.map(e => (
                    <div key={e.id} className="card" style={{padding:15, textAlign:'left', display:'flex', gap:12, alignItems:'center'}}>
                      <div style={{width:45, height:45, borderRadius:10, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{e.name.charAt(0)}</div>
                      <div>
                        <div style={{fontWeight:800}}>{e.name}</div>
                        <div style={{fontSize:'0.7rem', color:'var(--muted)'}}>{e.role}</div>
                        <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--p)'}}>{e.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                  <div className="card" style={{padding:20}}>
                    <h3 style={{marginBottom:15}}>🏆 Top 10 CA</h3>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--brd)'}}>
                        <span>{e.name}</span><b style={{color:'var(--p)'}}>${e.ca.toFixed(0)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:20}}>
                    <h3 style={{marginBottom:15}}>📦 Top 10 Stock (Quantité)</h3>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--brd)'}}>
                        <span>{e.name}</span><b style={{color:'var(--p)'}}>{e.stock} unités</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'profile' && myProfile && (
                <div style={{maxWidth:500, margin:'0 auto', textAlign:'center'}}>
                   <div style={{width:100, height:100, borderRadius:30, background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:900}}>{user.charAt(0)}</div>
                   <h1>{user}</h1>
                   <div style={{color:'var(--p)', fontWeight:800, marginBottom:20}}>{myProfile.role}</div>
                   <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
                      <div className="card" style={{padding:20}}><h3>💰 Mon CA</h3><div style={{fontSize:'1.5rem', fontWeight:900}}>${myProfile.ca.toFixed(0)}</div></div>
                      <div className="card" style={{padding:20}}><h3>📦 Mon Stock</h3><div style={{fontSize:'1.5rem', fontWeight:900}}>{myProfile.stock}</div></div>
                   </div>
                   <div className="card" style={{marginTop:15, padding:15, textAlign:'left'}}>
                      <div style={{marginBottom:10}}>📞 <b>Téléphone :</b> {myProfile.phone}</div>
                      <div style={{marginBottom:10}}>📅 <b>Arrivée :</b> {myProfile.arrival}</div>
                      <div>🎖️ <b>Ancienneté :</b> {myProfile.seniority} jours</div>
                   </div>
                </div>
              )}

              {currentTab === 'support' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2>🆘 Support</h2>
                  <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                    <option>Problème Stock</option><option>Erreur Facture</option><option>Demande RH</option><option>Autre</option>
                  </select>
                  <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Détails..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                  <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>Envoyer</button>
                </div>
              )}
            </div>
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart-zone">
              <div style={{padding:20, borderBottom:'1px solid var(--brd)'}}><h2>🛒 Panier</h2></div>
              <div style={{padding:12}}><input className="inp" placeholder="N° Facture" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} /></div>
              <div style={{flex:1, overflowY:'auto', padding:'0 12px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.75rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.65rem'}}>${i.pu}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:5}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:22, height:22, borderRadius:4}} onClick={()=>updateCartQty(idx, i.qty-1)}>-</button>
                      <input style={{width:35, background:'#000', border:'1px solid var(--brd)', color:'#fff', textAlign:'center', borderRadius:4}} type="number" value={i.qty} onChange={e=>updateCartQty(idx, e.target.value)} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:22, height:22, borderRadius:4}} onClick={()=>updateCartQty(idx, i.qty+1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:15, background:'rgba(0,0,0,0.3)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}><span>Total</span><b style={{fontSize:'1.3rem', color:'var(--p)'}}>${total.toFixed(2)}</b></div>
                <button className="btn-p" disabled={!forms.invoiceNum || cart.length===0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>Valider</button>
              </div>
            </aside>
          )}
        </>
      )}
      {toast && <div className="toast"><b>{toast.t}</b> {toast.m}</div>}
    </div>
  );
}
