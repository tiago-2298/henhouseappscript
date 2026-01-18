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

  const notify = (t, m, s='info') => { setToast({t, m, s}); setTimeout(() => setToast(null), 4000); };

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

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const v = parseInt(val);
    if (isNaN(v) || v <= 0) n.splice(idx, 1);
    else n[idx].qty = v;
    setCart(n);
  };

  const send = async (action, payload) => {
    if(sending) return;
    setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) { 
        notify("Succès", "Données transmises", "success"); 
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
        .side { width: 240px; border-right: 1px solid var(--brd); padding: 20px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 10px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; }
        .nav-l.active { background: var(--p); color: #fff; }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .main { flex: 1; overflow-y: auto; padding: 24px; position: relative; }
        .cart-zone { width: 380px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 12px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 8px; border-radius: var(--radius); cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-2px); }
        .card.in-cart { border-color: var(--p); background: rgba(139, 92, 246, 0.05); }
        .img-p { width: 100%; aspect-ratio:1; border-radius: 10px; object-fit: cover; margin-bottom: 8px; background: #0b0c10; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: var(--muted); }
        .inp { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; font-size: 0.95rem; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .btn-p:disabled { opacity: 0.5; cursor: wait; }
        .fuel-gauge { width: 100%; height: 10px; background: #000; border-radius: 10px; overflow: hidden; margin: 10px 0; border: 1px solid var(--brd); }
        .fuel-fill { height: 100%; transition: 0.5s; }
        .sk-wrap { display: flex; height: 100vh; gap: 20px; padding: 20px; }
        .sk { background: #1a1a1a; border-radius: 20px; animation: pulse 1.5s infinite; }
        .sk-s { width: 240px; } .sk-m { flex:1; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: 'var(--panel)', padding: 50, borderRadius: 40, width: 450, textAlign: 'center', border: '1px solid var(--brd)'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30}} />
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
            <div style={{textAlign:'center', marginBottom:35}}><img src="https://i.goopics.net/dskmxi.png" height="50" /></div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span style={{fontSize:'1.2rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <div style={{padding:15, background:'rgba(255,255,255,0.03)', border:'1px solid var(--brd)', borderRadius:16}}>
               <div style={{fontSize:'0.85rem', fontWeight:800}}>{user}</div>
               <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700}}>{myProfile?.role}</div>
               <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', padding:0, marginTop:12, height:'auto'}}>🚪 Quitter</button>
            </div>
          </aside>

          <main className="main">
            {currentTab === 'home' && (
               <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:20}}>
                 {MODULES.filter(m => m.id !== 'home').map(m => (
                   <div key={m.id} className="card" style={{height:160, display:'flex', flexDirection:'column', justifyContent:'center', gap:10}} onClick={()=>setCurrentTab(m.id)}>
                     <span style={{fontSize:'3rem'}}>{m.e}</span>
                     <h3 style={{fontSize:'1rem'}}>{m.l}</h3>
                   </div>
                 ))}
               </div>
            )}

            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:10, marginBottom:20}}>
                  <input className="inp" placeholder="🔍 Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                  <select className="inp" style={{width:180, marginBottom:0}} onChange={e=>setCatFilter(e.target.value)}>
                    <option>Tous</option>
                    {Object.keys(data.productsByCategory).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid">
                  {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                    <div key={p} className={`card ${cart.some(i=>i.name===p)?'in-cart':''}`} onClick={()=>addToCart(p)}>
                      <div className="img-p">{IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:8}} /> : p.charAt(0)}</div>
                      <div style={{fontWeight:800, fontSize:'0.75rem', height:35, display:'flex', alignItems:'center', justifyContent:'center'}}>{p}</div>
                      <div style={{color:'var(--p)', fontWeight:900, fontSize:'1rem'}}>${data.prices[p]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'stock' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2 style={{marginBottom:20}}>📦 Stock Cuisine</h2>
                {forms.stock.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                      const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                    }}>
                      <option value="">Choisir un produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp" style={{width:100}} value={item.qty} onChange={e=>{
                      const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                    }} />
                  </div>
                ))}
                <button className="nav-l" onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})}>+ Ajouter une ligne</button>
                <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendProduction', {items: forms.stock})}>Valider Stock</button>
              </div>
            )}

            {currentTab === 'enterprise' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2>🏢 Commande Pro (B2B)</h2>
                <input className="inp" placeholder="Nom de l'entreprise..." value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                {forms.enterprise.items.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                    <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                      const n=[...forms.enterprise.items]; n[i].product=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                    }}>
                      <option value="">Produit...</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp" style={{width:100}} value={item.qty} onChange={e=>{
                      const n=[...forms.enterprise.items]; n[i].qty=e.target.value; setForms({...forms, enterprise:{...forms.enterprise, items:n}});
                    }} />
                  </div>
                ))}
                <button className="btn-p" onClick={()=>send('sendEntreprise', forms.enterprise)}>Envoyer Commande</button>
              </div>
            )}

            {currentTab === 'partners' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2>🤝 Commandes Partenaires</h2>
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
                <h3 style={{margin:'15px 0'}}>Menus sélectionnés</h3>
                {forms.partner.items.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
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
                <button className="btn-p" onClick={()=>send('sendPartnerOrder', forms.partner)}>Confirmer Partenaire</button>
              </div>
            )}

            {currentTab === 'garage' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2>🚗 Garage</h2>
                <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                  {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                </select>
                <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                  <option>Entrée</option><option>Sortie</option>
                </select>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:800}}><span>Niveau Essence</span><span>{forms.garage.fuel}%</span></div>
                <div className="fuel-gauge"><div className="fuel-fill" style={{width:`${forms.garage.fuel}%`, background: forms.garage.fuel < 20 ? '#ef4444' : 'var(--p)'}}></div></div>
                <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                <button className="btn-p" style={{marginTop:20}} onClick={()=>send('sendGarage', forms.garage)}>Enregistrer</button>
              </div>
            )}

            {currentTab === 'expenses' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2>💳 Note de Frais</h2>
                <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                  {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                </select>
                <input type="number" className="inp" placeholder="Montant ($)" value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                <button className="btn-p" onClick={()=>send('sendExpense', forms.expense)}>Déclarer Frais</button>
              </div>
            )}

            {currentTab === 'directory' && (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:15}}>
                {data.employeesFull.map(e => (
                  <div key={e.id} className="card" style={{padding:20, textAlign:'left', display:'flex', gap:15, alignItems:'center'}}>
                    <div style={{width:50, height:50, borderRadius:15, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:900}}>{e.name.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800}}>{e.name}</div>
                      <div style={{fontSize:'0.7rem', color:'var(--p)', fontWeight:700, textTransform:'uppercase'}}>{e.role}</div>
                      <div style={{fontSize:'0.85rem', fontWeight:800, marginTop:5, color:'var(--muted)'}}>📞 {e.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'performance' && (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:25, maxWidth:1000, margin:'0 auto'}}>
                <div className="card" style={{padding:25}}>
                  <h3 style={{marginBottom:20}}>🏆 Top 10 CA</h3>
                  {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,10).map((e,i)=>(
                    <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px dashed var(--brd)'}}>
                      <span>{i+1}. {e.name}</span><b style={{color:'var(--p)'}}>${e.ca.toLocaleString()}</b>
                    </div>
                  ))}
                </div>
                <div className="card" style={{padding:25}}>
                  <h3 style={{marginBottom:20}}>📦 Top 10 Stock (Quantité)</h3>
                  {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,10).map((e,i)=>(
                    <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px dashed var(--brd)'}}>
                      <span>{i+1}. {e.name}</span><b style={{color:'var(--p)'}}>{e.stock} u.</b>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'profile' && myProfile && (
              <div style={{maxWidth:800, margin:'0 auto', textAlign:'center'}}>
                 <div style={{width:120, height:120, borderRadius:40, background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4.5rem', fontWeight:900}}>{user.charAt(0)}</div>
                 <h1 style={{fontSize:'2.2rem'}}>{user}</h1>
                 <div style={{color:'var(--p)', fontWeight:800, fontSize:'1.1rem', marginBottom:30}}>{myProfile.role}</div>
                 <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
                    <div className="card" style={{padding:20}}>
                      <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>CA GÉNÉRÉ</div>
                      <div style={{fontSize:'1.8rem', fontWeight:900}}>${myProfile.ca.toLocaleString()}</div>
                    </div>
                    <div className="card" style={{padding:20}}>
                      <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>PRODUCTION</div>
                      <div style={{fontSize:'1.8rem', fontWeight:900}}>{myProfile.stock}</div>
                    </div>
                    <div className="card" style={{padding:20}}>
                      <div style={{fontSize:'0.7rem', color:'var(--muted)', fontWeight:800, marginBottom:10}}>ANCIENNETÉ</div>
                      <div style={{fontSize:'1.8rem', fontWeight:900}}>{myProfile.seniority}j</div>
                    </div>
                 </div>
              </div>
            )}

            {currentTab === 'support' && (
              <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:40, borderRadius:30, border:'1px solid var(--brd)'}}>
                <h2>🆘 Support</h2>
                <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                  <option>Problème Stock</option><option>Erreur Facture</option><option>Demande RH</option><option>Autre</option>
                </select>
                <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Expliquez votre problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>Envoyer au Patron</button>
              </div>
            )}
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart-zone">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize: '1.2rem', fontWeight:900}}>🛒 Panier</h2>
              </div>
              <div style={{padding:15}}><input className="inp" placeholder="N° FACTURE CLIENT" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem'}} /></div>
              <div style={{flex:1, overflowY:'auto', padding:'0 15px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu} / u</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>updateCartQty(idx, i.qty-1)}>-</button>
                      <input style={{width:45, background:'#000', border:'1px solid var(--brd)', color:'#fff', textAlign:'center', borderRadius:8, fontWeight:900, padding:'6px 0'}} type="number" value={i.qty} onChange={e=>updateCartQty(idx, e.target.value)} />
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:28, height:28, borderRadius:8, cursor:'pointer'}} onClick={()=>updateCartQty(idx, i.qty+1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:24, background:'rgba(0,0,0,0.4)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
                  <span style={{fontWeight:800, color:'var(--muted)', fontSize:'0.8rem', textTransform:'uppercase'}}>Total</span>
                  <b style={{fontSize:'2rem', color:'var(--p)', fontWeight:900}}>${total.toLocaleString()}</b>
                </div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>✅ Valider la vente</button>
              </div>
            </aside>
          )}
        </>
      )}
      {toast && <div className={`toast ${toast.s === 'error' ? 'error' : ''}`} style={{position:'fixed', top:20, right:20, background: toast.s==='error'?'#dc2626':'#16a34a', padding:'15px 30px', borderRadius:12, fontWeight:800, zIndex:2000}}><b>{toast.t}</b> : {toast.m}</div>}
    </div>
  );
}
