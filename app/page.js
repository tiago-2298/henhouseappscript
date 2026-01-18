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

  const notify = (t, m, s='info') => { 
    setToast({t, m, s}); 
    setTimeout(() => setToast(null), 4000); 
  };

  const loadData = async () => {
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
    } catch (e) { notify("Erreur", "Serveur injoignable", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const addToCart = (p) => {
    const ex = cart.find(x => x.name === p);
    if(ex) setCart(cart.map(x => x.name === p ? {...x, qty: x.qty + 1} : x));
    else setCart([...cart, {name: p, qty: 1, pu: data.prices[p] || 0}]);
  };

  const send = async (action, payload) => {
    if(sending) return;
    if(action === 'sendFactures' && (!forms.invoiceNum || cart.length === 0)) return notify("Caisse", "Numéro de facture ou panier vide !", "error");
    
    setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        notify("Succès", "Action enregistrée avec succès", "success"); 
        if(action === 'sendFactures') { 
          setHistory([{ id: forms.invoiceNum, total: total, time: new Date().toLocaleTimeString() }, ...history].slice(0, 3));
          setCart([]); setForms(f=>({...f, invoiceNum:''})); 
        } 
        loadData(); 
      } else notify("Erreur", j.message, "error");
    } finally { setSending(false); }
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #8b5cf6; --bg: #0b0d11; --panel: #161920; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; --radius: 14px; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        
        /* Layout */
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .main { flex: 1; overflow-y: auto; padding: 24px; position: relative; background: var(--bg); }
        .cart-zone { width: 380px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.3); }

        /* Navigation */
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.9rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; transform: translateX(5px); box-shadow: 0 4px 15px -5px var(--p); }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }

        /* Products Grid */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 10px; border-radius: var(--radius); cursor: pointer; transition: 0.3s; text-align: center; position: relative; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
        .card.in-cart { border-color: var(--p); background: rgba(139, 92, 246, 0.05); border-width: 2px; }
        .img-p { width: 100%; aspect-ratio:1; border-radius: 10px; object-fit: cover; margin-bottom: 8px; background: #0b0c10; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--muted); border: 1px solid rgba(255,255,255,0.05); }

        /* Form Controls */
        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; transition: 0.2s; font-size: 0.95rem; }
        .inp:focus { border-color: var(--p); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); outline: none; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; font-size: 1rem; }
        .btn-p:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-p:disabled { opacity: 0.5; cursor: wait; }

        /* Category Pills */
        .pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: none; }
        .pill { padding: 8px 16px; background: var(--panel); border: 1px solid var(--brd); border-radius: 30px; font-size: 0.8rem; font-weight: 700; color: var(--muted); cursor: pointer; white-space: nowrap; transition: 0.2s; }
        .pill.active { background: var(--p); color: #fff; border-color: var(--p); }

        /* Toasts */
        .toast { position: fixed; top: 24px; right: 24px; padding: 16px 28px; background: #16a34a; border-radius: 12px; z-index: 1000; box-shadow: 0 20px 40px rgba(0,0,0,0.5); font-weight: 800; animation: slideIn 0.4s ease-out; }
        .toast.error { background: #dc2626; }
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(circle at center, #1e1b4b 0%, #000 100%)'}}>
          <div style={{background: 'rgba(22, 25, 32, 0.8)', backdropFilter: 'blur(20px)', padding: 50, borderRadius: 40, width: 450, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30}} />
            <h1 style={{marginBottom:30, fontSize:'1.8rem', fontWeight:900, letterSpacing:'-1px'}}>AUTHENTIFICATION</h1>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">Sélectionner un agent...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>setView('app')} disabled={!user}>Ouvrir la session</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:35, borderBottom:'1px solid var(--brd)', paddingBottom:20}}>
              <img src="https://i.goopics.net/dskmxi.png" height="50" />
            </div>
            <div style={{flex:1, overflowY:'auto', paddingRight:5}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span style={{fontSize:'1.2rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <div style={{padding:15, background:'rgba(255,255,255,0.03)', borderRadius:16, border:'1px solid var(--brd)'}}>
               <div style={{fontSize:'0.85rem', fontWeight:800}}>{user}</div>
               <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700, textTransform:'uppercase'}}>{myProfile?.role}</div>
               <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', padding:0, marginTop:12, height:'auto', fontSize:'0.75rem'}}>🚪 Se déconnecter</button>
            </div>
          </aside>

          <main className="main">
            <div className="fade-in" style={{maxWidth:1200, margin:'0 auto'}}>
              
              {currentTab === 'invoices' && (
                <>
                  <div style={{display:'flex', gap:15, marginBottom:20}}>
                    <input className="inp" placeholder="🔍 Rechercher un produit..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div className="pills">
                    <div className={`pill ${catFilter==='Tous'?'active':''}`} onClick={()=>setCatFilter('Tous')}>Tout</div>
                    {Object.keys(data.productsByCategory).map(c=>(
                      <div key={c} className={`pill ${catFilter===c?'active':''}`} onClick={()=>setCatFilter(c)}>{c.replace(/_/g, ' ')}</div>
                    ))}
                  </div>
                  <div className="grid">
                    {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                      <div key={p} className={`card ${cart.some(i=>i.name===p)?'in-cart':''}`} onClick={()=>addToCart(p)}>
                        <div className="img-p">
                          {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:8}} /> : p.charAt(0)}
                        </div>
                        <div style={{fontWeight:800, fontSize:'0.75rem', height:35, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>{p}</div>
                        <div style={{color:'var(--p)', fontWeight:900, fontSize:'1rem'}}>${data.prices[p]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* MODULE STOCK */}
              {currentTab === 'stock' && (
                <div style={{maxWidth:650, margin:'40px auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:30, fontSize:'1.5rem'}}>📦 Production Cuisine</h2>
                  {forms.stock.map((item, i) => (
                    <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                      <select className="inp" style={{flex:1, marginBottom:0}} value={item.product} onChange={e=>{
                        const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                      }}>
                        <option value="">Choisir un produit...</option>
                        {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="number" className="inp" style={{width:120, marginBottom:0}} value={item.qty} onChange={e=>{
                        const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                      }} />
                    </div>
                  ))}
                  <button className="nav-l" style={{border:'1px dashed var(--brd)', justifyContent:'center', margin:'10px 0 25px'}} onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter un article</button>
                  <button className="btn-p" disabled={sending} onClick={()=>send('sendProduction', {items: forms.stock})}>
                    {sending ? '⏳ Enregistrement...' : '🚀 Valider la production'}
                  </button>
                </div>
              )}

              {/* MODULE GARAGE */}
              {currentTab === 'garage' && (
                <div style={{maxWidth:600, margin:'40px auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:30}}>🚗 État des Véhicules</h2>
                  <label style={{fontSize:'0.8rem', color: 'var(--muted)', fontWeight:800}}>VÉHICULE</label>
                  <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                  <label style={{fontSize:'0.8rem', color: 'var(--muted)', fontWeight:800}}>ACTION</label>
                  <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                    <option>Entrée au garage</option>
                    <option>Sortie du garage</option>
                  </select>
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:20, fontWeight:800, fontSize:'0.9rem'}}>
                    <span>Niveau d'essence</span>
                    <span style={{color:'var(--p)'}}>{forms.garage.fuel}%</span>
                  </div>
                  <div className="fuel-gauge">
                    <div className="fuel-fill" style={{width:`${forms.garage.fuel}%`, background: forms.garage.fuel < 20 ? '#ef4444' : 'var(--p)'}}></div>
                  </div>
                  <input type="range" style={{width:'100%', accentColor:'var(--p)', cursor:'pointer'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                  <button className="btn-p" style={{marginTop:30}} disabled={sending} onClick={()=>send('sendGarage', forms.garage)}>Enregistrer l'état</button>
                </div>
              )}

              {/* MODULE PERFORMANCE (TOP 10) */}
              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30}}>
                  <div className="card" style={{padding:30, cursor:'default'}}>
                    <h3 style={{marginBottom:25, fontSize:'1.2rem'}}>🏆 TOP 10 CHIFFRE D'AFFAIRES</h3>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--brd)'}}>
                        <span style={{fontWeight:700}}>{i+1}. {e.name}</span>
                        <b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{padding:30, cursor:'default'}}>
                    <h3 style={{marginBottom:25, fontSize:'1.2rem'}}>📦 TOP 10 PRODUCTION CUISINE</h3>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--brd)'}}>
                        <span style={{fontWeight:700}}>{i+1}. {e.name}</span>
                        <b style={{color:'var(--p)'}}>{e.stock.toLocaleString()} u.</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE PROFIL PERSO */}
              {currentTab === 'profile' && myProfile && (
                <div style={{maxWidth:800, margin:'0 auto', textAlign:'center'}}>
                   <div style={{width:140, height:140, borderRadius:50, background:'var(--p)', margin:'0 auto 25px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4.5rem', fontWeight:900, boxShadow:'0 20px 40px rgba(139, 92, 246, 0.3)'}}>
                     {user.charAt(0)}
                   </div>
                   <h1 style={{fontSize:'2.2rem', fontWeight:900}}>{user}</h1>
                   <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.1rem', marginTop:10}}>{myProfile.role}</div>
                   
                   <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginTop:40}}>
                      <div className="card" style={{padding:25}}>
                        <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>CA GÉNÉRÉ</div>
                        <div style={{fontSize:'1.8rem', fontWeight:900}}>${myProfile.ca.toLocaleString()}</div>
                      </div>
                      <div className="card" style={{padding:25}}>
                        <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>ARTICLES PRODUITS</div>
                        <div style={{fontSize:'1.8rem', fontWeight:900}}>{myProfile.stock}</div>
                      </div>
                      <div className="card" style={{padding:25}}>
                        <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>ANCIENNETÉ</div>
                        <div style={{fontSize:'1.8rem', fontWeight:900}}>{myProfile.seniority}j</div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </main>

          {/* PANIER - UNIQUEMENT DANS LA CAISSE */}
          {currentTab === 'invoices' && (
            <aside className="cart-zone">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize: '1.2rem', fontWeight:900}}>🛒 Panier</h2>
                <span className="badge" style={{background:'var(--p)', padding:'4px 10px', borderRadius:8, fontSize:'0.75rem', fontWeight:900}}>{cart.length} items</span>
              </div>
              
              <div style={{padding:20, flex:1, overflowY:'auto'}}>
                <input className="inp" placeholder="N° FACTURE CLIENT" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem', letterSpacing:'2px'}} />
                
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div>
                      <div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu} / unité</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>updateCartQty(idx, i.qty-1)}>-</button>
                      <input 
                        style={{width:45, background:'#000', border:'1px solid var(--brd)', color:'#fff', textAlign:'center', borderRadius:8, fontWeight:900, padding:'6px 0', fontSize:'0.9rem'}} 
                        type="number" 
                        value={i.qty} 
                        onChange={e=>updateCartQty(idx, e.target.value)} 
                      />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>updateCartQty(idx, i.qty+1)}>+</button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && <div style={{textAlign:'center', marginTop:50, opacity:0.3}}><span style={{fontSize:'3rem'}}>🛒</span><p>Votre panier est vide</p></div>}
              </div>

              <div style={{padding:24, background:'rgba(0,0,0,0.4)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
                  <span style={{fontWeight:800, color:'var(--muted)', fontSize:'0.8rem', textTransform:'uppercase'}}>Total Facture</span>
                  <b style={{fontSize:'2rem', color:'var(--p)', fontWeight:900}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                   {sending ? '⏳ Envoi...' : '✅ Finaliser la vente'}
                </button>
              </div>
            </aside>
          )}
        </>
      )}
      {toast && <div className={`toast ${toast.s === 'error' ? 'error' : ''}`}><b>{toast.t}</b> : {toast.m}</div>}
    </div>
  );
}
