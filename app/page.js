'use client';
import { useState, useEffect, useMemo } from 'react';

// --- CONFIGURATION DES MODULES ---
const MODULES = [
  { id: 'home', l: 'Dashboard', e: '🏠' },
  { id: 'invoices', l: 'Caisse', e: '💰' },
  { id: 'stock', l: 'Stock / Cuisine', e: '📦' },
  { id: 'enterprise', l: 'Commandes Pro', e: '🏢' },
  { id: 'partners', l: 'Partenaires', e: '🤝' },
  { id: 'expenses', l: 'Frais', e: '💳' },
  { id: 'garage', l: 'Garage', e: '🚗' },
  { id: 'directory', l: 'Annuaire', e: '👥' },
  { id: 'performance', l: 'Performance', e: '🏆' },
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
  const [cashReceived, setCashReceived] = useState('');
  const [history, setHistory] = useState([]); // LOGS DE SESSION
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [forms, setForms] = useState({
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '' },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Autre', msg: '' }
  });

  const notify = (t, m, s='info') => { setToast({t, m, s}); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) { 
        setData(j); 
        setForms(f => ({...f, 
          expense: {...f.expense, vehicle: j.vehicles[0]}, 
          garage: {...f.garage, vehicle: j.vehicles[0]},
          partner: { ...f.partner, company: Object.keys(j.partners.companies)[0], benef: j.partners.companies[Object.keys(j.partners.companies)[0]].beneficiaries[0] }
        }));
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const changeToReturn = useMemo(() => {
    const received = parseFloat(cashReceived);
    if (isNaN(received) || received < total) return 0;
    return received - total;
  }, [cashReceived, total]);

  const updateCartQty = (idx, val) => {
    const n = [...cart];
    const newQty = parseInt(val);
    if (isNaN(newQty) || newQty <= 0) n.splice(idx, 1);
    else n[idx].qty = newQty;
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
        // Ajout aux logs de session
        const newLog = { id: forms.invoiceNum, total: total, time: new Date().toLocaleTimeString() };
        setHistory([newLog, ...history].slice(0, 3));
        setCart([]); setForms(f=>({...f, invoiceNum:''})); setCashReceived(''); 
      } 
      load(); 
    }
    else { notify("Erreur", j.message, "error"); }
  };

  if (loading && !data) return <div className="sk-wrap"><div className="sk sk-s"></div><div className="sk sk-m"></div></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #8b5cf6; --bg: #0f1115; --panel: #181a20; --txt: #f8fafc; --muted: #94a3b8; --brd: #2d313a; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        
        .side { width: 240px; border-right: 1px solid var(--brd); padding: 20px; display: flex; flex-direction: column; background: #000; z-index: 10; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 2px; }
        .nav-l.active { background: var(--p); color: #fff; }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }

        .main { flex: 1; overflow-y: auto; padding: 20px; position: relative; }
        .sticky-h { position: sticky; top: -20px; z-index: 100; background: var(--bg); padding: 10px 0; border-bottom: 1px solid var(--brd); margin-bottom: 20px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 8px; border-radius: 12px; cursor: pointer; transition: 0.2s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-2px); }
        .card.sel { border-color: var(--p); box-shadow: 0 0 0 2px var(--p); }
        .img-p { width: 100%; aspect-ratio:1; border-radius: 8px; object-fit: cover; margin-bottom: 6px; background: #000; }
        .p-name { font-weight: 800; font-size: 0.7rem; height: 28px; overflow: hidden; display: flex; align-items: center; justify-content: center; line-height: 1.1; }
        
        .cart-zone { width: 360px; border-left: 1px solid var(--brd); background: rgba(0,0,0,0.4); display: flex; flex-direction: column; }
        .qty-input { width: 40px; background: #000; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 6px; font-weight: 900; padding: 4px 0; font-size: 0.8rem; }

        .inp { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--brd); background: var(--panel); color: #fff; font-weight: 700; margin-bottom: 10px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 14px; border-radius: 10px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .btn-p:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: var(--p); border-radius: 10px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .row-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--brd); cursor: pointer; border-radius: 8px; transition: 0.2s; }
        .row-item:hover { background: rgba(255,255,255,0.03); }

        .history-box { padding: 15px; background: rgba(0,0,0,0.2); border-top: 1px solid var(--brd); }
        .history-item { font-size: 0.7rem; display: flex; justify-content: space-between; color: var(--muted); margin-bottom: 4px; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.05); }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: 'var(--panel)', padding: 40, borderRadius: 30, width: 380, textAlign: 'center', border: '1px solid var(--brd)'}}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>🍳</div>
            <h2 style={{marginBottom:24}}>Hen House RP</h2>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Sélectionner un nom...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>setView('app')} disabled={!user}>Ouvrir la session</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{fontWeight:900, fontSize: '1.1rem', marginBottom:25, textAlign:'center'}}>🐓 HEN HOUSE</div>
            <div style={{flex:1, overflowY:'auto'}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span style={{fontSize:'1.1rem'}}>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <div style={{marginTop:15, padding:12, background:'rgba(255,255,255,0.03)', borderRadius:10}}>
               <div style={{fontSize:'0.75rem', fontWeight:800}}>👤 {user}</div>
               <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', padding:0, marginTop:8, height:'auto'}}>🚪 Quitter</button>
            </div>
          </aside>

          <main className="main">
            {currentTab === 'invoices' && (
              <div className="sticky-h">
                <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <input className="inp" placeholder="🔍 Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                    <div style={{display:'flex', gap:5, overflowX:'auto', whiteSpace:'nowrap', maxWidth: '50%'}}>
                        {['Tous', ...Object.keys(data.productsByCategory)].map(c => (
                        <button key={c} onClick={()=>setCatFilter(c)} className="nav-l" style={{width:'auto', background:catFilter===c?'var(--p)':'var(--panel)', color:'#fff', padding:'6px 12px', fontSize:'0.65rem'}}>
                            {c.replace('_',' ')}
                        </button>
                        ))}
                    </div>
                </div>
              </div>
            )}

            <div className="fade-in">
              {currentTab === 'home' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:15}}>
                   <div className="card" style={{height:150, display:'flex', flexDirection:'column', justifyContent:'center', gap:10}} onClick={()=>setCurrentTab('invoices')}>
                      <span style={{fontSize:'2.5rem'}}>💰</span> <h3>Caisse</h3>
                   </div>
                   <div className="card" style={{height:150, display:'flex', flexDirection:'column', justifyContent:'center', gap:10}} onClick={()=>setCurrentTab('stock')}>
                      <span style={{fontSize:'2.5rem'}}>📦</span> <h3>Cuisine</h3>
                   </div>
                   <div className="card" style={{height:150, display:'flex', flexDirection:'column', justifyContent:'center', gap:10}} onClick={()=>setCurrentTab('directory')}>
                      <span style={{fontSize:'2.5rem'}}>👥</span> <h3>Annuaire</h3>
                   </div>
                   <div className="card" style={{height:150, display:'flex', flexDirection:'column', justifyContent:'center', gap:10}} onClick={()=>setCurrentTab('garage')}>
                      <span style={{fontSize:'2.5rem'}}>🚗</span> <h3>Garage</h3>
                   </div>
                </div>
              )}

              {currentTab === 'invoices' && (
                <div className="grid">
                  {data.products.filter(p => (catFilter==='Tous' || data.productsByCategory[catFilter]?.includes(p)) && p.toLowerCase().includes(search.toLowerCase())).map(p=>(
                    <div key={p} className={`card ${cart.some(i=>i.name===p)?'sel':''}`} onClick={()=>{
                      const ex = cart.find(x=>x.name===p);
                      if(ex) setCart(cart.map(x=>x.name===p?{...x, qty:x.qty+1}:x));
                      else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                    }}>
                      <img src={IMAGES[p]||'https://via.placeholder.com/150'} className="img-p" />
                      <div className="p-name">{p}</div>
                      <div style={{color:'var(--p)', fontWeight:900, fontSize:'0.8rem'}}>${data.prices[p]}</div>
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'stock' && (
                <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:15}}>📦 Déclaration Cuisine</h2>
                  {forms.stock.map((item, i) => (
                    <div key={i} style={{display:'flex', gap:8, marginBottom:8}}>
                      <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                        const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                      }}>
                        <option value="">Choisir produit...</option>
                        {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="number" className="inp" style={{width:90}} value={item.qty} onChange={e=>{
                        const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                      }} />
                    </div>
                  ))}
                  <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>Valider Production</button>
                </div>
              )}

              {currentTab === 'enterprise' && (
                <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:15}}>🏢 Commande Entreprise</h2>
                  <input className="inp" placeholder="Entreprise cliente..." value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
                  <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>Envoyer</button>
                </div>
              )}

              {currentTab === 'partners' && (
                <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:15}}>🤝 Partenaires</h2>
                  <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                  <select className="inp" value={forms.partner.company} onChange={e=>setForms({...forms, partner:{...forms.partner, company:e.target.value}})}>
                     {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="inp" value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                     {data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                  <button className="btn-p" onClick={()=>send('sendPartnerOrder', {company: forms.partner.company, beneficiary: forms.partner.benef, invoiceNumber: forms.partner.num, items: forms.partner.items})}>Confirmer</button>
                </div>
              )}

              {currentTab === 'expenses' && (
                <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:15}}>💳 Note de Frais</h2>
                  <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                  <input type="number" className="inp" placeholder="Montant..." value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                  <button className="btn-p" onClick={()=>send('sendExpense', forms.expense)}>Valider</button>
                </div>
              )}

              {currentTab === 'garage' && (
                <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:15}}>🚗 Garage</h2>
                  <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                  <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                    <option>Entrée</option><option>Sortie</option>
                  </select>
                  <button className="btn-p" onClick={()=>send('sendGarage', forms.garage)}>Enregistrer</button>
                </div>
              )}

              {currentTab === 'directory' && (
                <div className="card" style={{padding:0, cursor:'default', maxWidth:800, margin:'0 auto'}}>
                   {data.employeesFull.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())).map(e=>(
                     <div key={e.id} className="row-item" onClick={()=>setSelectedEmployee(e)}>
                        <div style={{display:'flex', gap:12, alignItems:'center'}}>
                           <div style={{width:35, height:35, borderRadius:8, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.8rem'}}>{e.name.charAt(0)}</div>
                           <div><div style={{fontWeight:800, fontSize:'0.9rem'}}>{e.name}</div><div style={{fontSize:'0.65rem', color:'var(--muted)'}}>{e.role}</div></div>
                        </div>
                        <div style={{textAlign:'right'}}><div style={{fontWeight:800, color:'var(--p)', fontSize:'0.85rem'}}>{e.phone}</div></div>
                     </div>
                   ))}
                </div>
              )}

              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:900, margin:'0 auto'}}>
                  <div className="card" style={{padding:20}}>
                    <h3>🏆 Top CA</h3>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,5).map((e,i)=>(
                      <div key={i} className="row-item" style={{fontSize:'0.8rem'}}><span>{e.name}</span><b>${e.ca.toFixed(0)}</b></div>
                    ))}
                  </div>
                  <div className="card" style={{padding:20}}>
                    <h3>📦 Top Stock</h3>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,5).map((e,i)=>(
                      <div key={i} className="row-item" style={{fontSize:'0.8rem'}}><span>{e.name}</span><b>{e.stock} pts</b></div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'support' && (
                 <div style={{maxWidth:550, margin:'0 auto', background:'var(--panel)', padding:25, borderRadius:20, border:'1px solid var(--brd)'}}>
                    <h2 style={{marginBottom:15}}>🆘 Support</h2>
                    <textarea className="inp" style={{height:120, resize:'none'}} placeholder="Détails du problème..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>Envoyer</button>
                 </div>
              )}
            </div>
          </main>

          <aside className="cart-zone">
            <div style={{padding:15, borderBottom:'1px solid var(--brd)', display:'flex', justifyContent:'space-between'}}>
              <h2 style={{fontSize: '1rem'}}>🛒 Panier</h2>
              <span style={{fontSize:'0.7rem', color:'var(--muted)'}}>{cart.length} items</span>
            </div>
            
            <div style={{padding:12}}>
              <input className="inp" placeholder="N° Facture" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', marginBottom:5}} />
            </div>

            <div style={{flex:1, overflowY:'auto', padding:'0 12px'}}>
              {cart.map((i, idx)=>(
                <div key={idx} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.75rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.65rem'}}>${i.pu}</div></div>
                  <div style={{display:'flex', alignItems:'center', gap:4}}>
                    <button style={{background:'var(--brd)', border:'none', color:'#fff', width:22, height:22, borderRadius:4}} onClick={()=>updateCartQty(idx, i.qty - 1)}>-</button>
                    <input className="qty-input" type="number" value={i.qty} onChange={(e)=>updateCartQty(idx, e.target.value)} />
                    <button style={{background:'var(--brd)', border:'none', color:'#fff', width:22, height:22, borderRadius:4}} onClick={()=>updateCartQty(idx, i.qty + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* LOGS DE SESSION */}
            <div className="history-box">
               <div style={{fontSize:'0.6rem', fontWeight:900, color:'var(--p)', marginBottom:5, letterSpacing:1}}>Dernières Ventes</div>
               {history.length === 0 && <div style={{fontSize:'0.6rem', opacity:0.3}}>Aucune vente enregistrée</div>}
               {history.map((log, i) => (
                 <div key={i} className="history-item">
                    <span>#{log.id} • {log.time}</span>
                    <b style={{color: '#fff'}}>${log.total.toFixed(2)}</b>
                 </div>
               ))}
            </div>

            <div style={{padding:15, background:'rgba(0,0,0,0.3)', borderTop:'1px solid var(--brd)'}}>
              <div style={{display:'flex', gap:8, marginBottom:10, padding:8, background:'rgba(0,0,0,0.2)', borderRadius:8}}>
                <div style={{flex:1}}><label style={{fontSize:'0.55rem', color:'var(--muted)'}}>REÇU</label><input className="inp" style={{marginBottom:0, padding:5}} type="number" value={cashReceived} onChange={e=>setCashReceived(e.target.value)} /></div>
                <div style={{flex:1}}><label style={{fontSize:'0.55rem', color:'var(--muted)'}}>À RENDRE</label><div style={{fontSize:'1rem', fontWeight:900, color: changeToReturn > 0 ? '#10b981' : '#fff'}}>${changeToReturn.toFixed(1)}</div></div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
                <span style={{fontWeight:700, fontSize:'0.8rem'}}>Total</span><span style={{fontSize:'1.3rem', fontWeight:900, color:'var(--p)'}}>${total.toFixed(2)}</span>
              </div>
              <button className="btn-p" disabled={!forms.invoiceNum || cart.length===0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                Valider
              </button>
            </div>
          </aside>

          {toast && <div className="toast"><b>{toast.t}</b> {toast.m}</div>}
        </>
      )}
    </div>
  );
}
