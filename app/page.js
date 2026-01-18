'use client';
import { useState, useEffect, useMemo } from 'react';

// --- ICONS ---
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    dashboard: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />,
    package: <path d="M16.5 9.4 7.5 4.21M21 16v-6a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 10v6a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7l8.7 5 8.7-5M12 22v-9" />,
    building: <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4" />,
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    cart: <><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    car: <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9M5 17h2v-6H5v6ZM15 17h2v-6h-2v6Z" />,
    handshake: <path d="m11 17 2 2a1 1 0 1 0 3-3M11 14l-3-3m8-2-9 9a2 2 0 0 0 0 2.83 2 2 0 0 0 2.83 0l9-9a2 2 0 0 0 0-2.83 2 2 0 0 0-2.83 0" />,
    creditCard: <path d="M2 10h20M2 6h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4Z" />,
    refresh: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />,
    lifeBuoy: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name] || null}</svg>;
};

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

  const send = async (action, payload) => {
    if(action === 'sendFactures' && (!forms.invoiceNum || cart.length === 0)) return notify("Erreur", "Données manquantes", "error");
    notify("Envoi...", "Traitement...");
    const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
    const j = await r.json();
    if(j.success) { notify("Succès", "Validé", "success"); if(action === 'sendFactures') { setCart([]); setForms(f=>({...f, invoiceNum:''})); } load(); }
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
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; z-index: 10; }
        .main { flex: 1; overflow-y: auto; padding: 24px; position: relative; scroll-behavior: smooth; }
        .cart-zone { width: 380px; border-left: 1px solid var(--brd); background: rgba(0,0,0,0.2); display: flex; flex-direction: column; }
        @media (max-width: 1200px) { .cart-zone { display: none; } }
        .sticky-h { position: sticky; top: -24px; z-index: 100; background: var(--bg); padding: 12px 0; border-bottom: 1px solid var(--brd); margin-bottom: 24px; }
        .nav-l { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; text-align: left; transition: 0.2s; }
        .nav-l.active { background: var(--p); color: #fff; }
        .nav-l:hover:not(.active) { background: rgba(255,255,255,0.05); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 12px; border-radius: 16px; cursor: pointer; transition: 0.2s; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); }
        .card.sel { border-color: var(--p); background: rgba(139,92,246,0.1); }
        .img-p { width: 100%; aspect-ratio:1; border-radius: 12px; object-fit: cover; margin-bottom: 8px; background: #000; }
        .inp { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--brd); background: var(--panel); color: #fff; font-weight: 700; margin-bottom: 12px; }
        .inp:focus { outline: none; border-color: var(--p); }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .btn-p:disabled { opacity: 0.4; cursor: not-allowed; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 16px; background: var(--p); border-radius: 12px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-left: 5px solid #fff; }
        .sk-wrap { display: flex; height: 100vh; gap: 20px; padding: 20px; }
        .sk { background: #1a1a1a; border-radius: 20px; animation: pulse 1.5s infinite; }
        .sk-s { width: 260px; } .sk-m { flex:1; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        .badge { background: var(--p); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; }
        .row-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--brd); transition: 0.2s; border-radius: 10px; cursor: pointer; }
        .row-item:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background: 'var(--panel)', padding: 40, borderRadius: 32, width: 400, textAlign: 'center', border: '1px solid var(--brd)'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="70" style={{marginBottom:20}} />
            <h2 style={{marginBottom:24}}>Hen House RP</h2>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">Sélectionner un nom...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>setView('app')} disabled={!user}>Se connecter</button>
            <p style={{marginTop:20, fontSize:'0.7rem', color:'var(--muted)'}}>Version {data?.version}</p>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{fontWeight:900, marginBottom:30, display:'flex', alignItems:'center', gap:10}}>
              <img src="https://i.goopics.net/dskmxi.png" height="30" /> HEN HOUSE
            </div>
            <div style={{flex:1, overflowY:'auto'}}>
              {[
                {id:'home', l:'Dashboard', i:'dashboard'}, {id:'invoices', l:'Caisse', i:'receipt'},
                {id:'stock', l:'Stock / Cuisine', i:'package'}, {id:'enterprise', l:'Commandes Pro', i:'building'},
                {id:'partners', l:'Partenaires', i:'handshake'}, {id:'expenses', l:'Frais', i:'creditCard'},
                {id:'garage', l:'Garage', i:'car'}, {id:'directory', l:'Annuaire', i:'users'},
                {id:'performance', l:'Performance', i:'trophy'}, {id:'support', l:'Support', i:'lifeBuoy'}
              ].map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <Icon name={t.i} /> {t.l}
                </button>
              ))}
            </div>
            <div style={{marginTop:20, padding:15, background:'rgba(255,255,255,0.03)', borderRadius:12}}>
               <div style={{fontSize:'0.8rem', fontWeight:800}}>{user}</div>
               <div style={{fontSize:'0.65rem', color:'var(--muted)'}}>{data.employeesFull.find(e=>e.name===user)?.role || 'Employé'}</div>
               <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444', padding:0, marginTop:10, height:'auto'}}><Icon name="logout" size={14}/> Déconnexion</button>
            </div>
          </aside>

          <main className="main">
            {/* STICKY HEADER POUR LA CAISSE */}
            {currentTab === 'invoices' && (
              <div className="sticky-h">
                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{flex:1, position:'relative'}}>
                    <Icon name="search" style={{position:'absolute', left:14, top:13, color:'var(--muted)'}} />
                    <input className="inp" placeholder="Recherche rapide..." style={{flex:1, marginBottom:0, paddingLeft:45}} onChange={e=>setSearch(e.target.value)} />
                  </div>
                  <div style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:5}}>
                    {['Tous', ...Object.keys(data.productsByCategory)].map(c => (
                      <button key={c} onClick={()=>setCatFilter(c)} className="nav-l" style={{width:'auto', background:catFilter===c?'var(--p)':'var(--panel)', color:'#fff', padding:'8px 16px', fontSize:'0.75rem'}}>
                        {c.replace('_',' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENU DES ONGLETS */}
            <div className="fade-in">
              {currentTab === 'home' && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20}}>
                   <div className="card" style={{height:180, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:15}} onClick={()=>setCurrentTab('invoices')}>
                      <Icon name="receipt" size={40} /> <h3>Nouvelle Vente</h3>
                   </div>
                   <div className="card" style={{height:180, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:15}} onClick={()=>setCurrentTab('stock')}>
                      <Icon name="package" size={40} /> <h3>Production</h3>
                   </div>
                   <div className="card" style={{height:180, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:15}} onClick={()=>setCurrentTab('directory')}>
                      <Icon name="users" size={40} /> <h3>Annuaire</h3>
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
                      <div style={{fontWeight:900, fontSize:'0.85rem', height:35, overflow:'hidden'}}>{p}</div>
                      <div style={{color:'var(--p)', fontWeight:900, marginTop:5}}>${data.prices[p]}</div>
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'stock' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:20, display:'flex', gap:10}}><Icon name="package"/> Déclaration de Stock</h2>
                  {forms.stock.map((item, i) => (
                    <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                      <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{
                        const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});
                      }}>
                        <option value="">Produit...</option>
                        {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="number" className="inp" style={{width:100}} value={item.qty} onChange={e=>{
                        const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});
                      }} />
                      {forms.stock.length > 1 && <button onClick={()=>{const n=[...forms.stock]; n.splice(i,1); setForms({...forms, stock:n});}} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}><Icon name="x"/></button>}
                    </div>
                  ))}
                  <button className="nav-l" onClick={()=>setForms({...forms, stock:[...forms.stock, {product:'', qty:1}]})} style={{marginBottom:20, justifyContent:'center'}}>+ Ajouter une ligne</button>
                  <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>Valider la production</button>
                </div>
              )}

              {currentTab === 'enterprise' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:20}}><Icon name="building"/> Commande Pro (B2B)</h2>
                  <input className="inp" placeholder="Nom de l'entreprise client..." value={forms.enterprise.name} onChange={e=>setForms({...forms, enterprise:{...forms.enterprise, name:e.target.value}})} />
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
                  <button className="btn-p" onClick={()=>send('sendEntreprise', {company: forms.enterprise.name, items: forms.enterprise.items})}>Envoyer Commande Pro</button>
                </div>
              )}

              {currentTab === 'partners' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                   <h2 style={{marginBottom:20}}><Icon name="handshake"/> Partenaires</h2>
                   <input className="inp" placeholder="N° Facture" value={forms.partner.num} onChange={e=>setForms({...forms, partner:{...forms.partner, num:e.target.value}})} />
                   <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
                      <select className="inp" value={forms.partner.company} onChange={e=>setForms({...forms, partner:{...forms.partner, company:e.target.value}})}>
                         {Object.keys(data.partners.companies).map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                      <select className="inp" value={forms.partner.benef} onChange={e=>setForms({...forms, partner:{...forms.partner, benef:e.target.value}})}>
                         {data.partners.companies[forms.partner.company]?.beneficiaries.map(b=><option key={b} value={b}>{b}</option>)}
                      </select>
                   </div>
                   <button className="btn-p" onClick={()=>send('sendPartnerOrder', {company: forms.partner.company, beneficiary: forms.partner.benef, invoiceNumber: forms.partner.num, items: forms.partner.items})}>Valider Commande Partenaire</button>
                </div>
              )}

              {currentTab === 'garage' && (
                <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                  <h2 style={{marginBottom:20}}><Icon name="car"/> Gestion Garage</h2>
                  <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                    {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                  <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                    <option>Entrée</option><option>Sortie</option>
                  </select>
                  <div style={{margin:'20px 0'}}>
                    <label style={{fontSize:'0.8rem', color:'var(--muted)'}}>Essence : {forms.garage.fuel}%</label>
                    <input type="range" style={{width:'100%', accentColor:'var(--p)'}} value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                  </div>
                  <button className="btn-p" onClick={()=>send('sendGarage', forms.garage)}>Mettre à jour le véhicule</button>
                </div>
              )}

              {currentTab === 'expenses' && (
                 <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                    <h2 style={{marginBottom:20}}><Icon name="creditCard"/> Note de Frais</h2>
                    <select className="inp" value={forms.expense.vehicle} onChange={e=>setForms({...forms, expense:{...forms.expense, vehicle:e.target.value}})}>
                       {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                    </select>
                    <select className="inp" value={forms.expense.kind} onChange={e=>setForms({...forms, expense:{...forms.expense, kind:e.target.value}})}>
                       <option>Essence</option><option>Réparation</option><option>Autre</option>
                    </select>
                    <input type="number" className="inp" placeholder="Montant..." value={forms.expense.amount} onChange={e=>setForms({...forms, expense:{...forms.expense, amount:e.target.value}})} />
                    <button className="btn-p" onClick={()=>send('sendExpense', forms.expense)}>Déclarer les frais</button>
                 </div>
              )}

              {currentTab === 'directory' && (
                <div style={{maxWidth:900, margin:'0 auto'}}>
                   <div style={{display:'flex', gap:10, marginBottom:20}}>
                      <input className="inp" style={{flex:1, marginBottom:0}} placeholder="Rechercher un collègue..." onChange={e=>setSearch(e.target.value)} />
                   </div>
                   <div className="card" style={{padding:0, cursor:'default'}}>
                      {data.employeesFull.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())).map(e=>(
                        <div key={e.id} className="row-item" onClick={()=>setSelectedEmployee(e)}>
                           <div style={{display:'flex', gap:15, alignItems:'center'}}>
                              <div style={{width:40, height:40, borderRadius:10, background:'var(--p)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{e.name.charAt(0)}</div>
                              <div>
                                 <div style={{fontWeight:800}}>{e.name}</div>
                                 <div style={{fontSize:'0.75rem', color:'var(--muted)'}}>{e.role}</div>
                              </div>
                           </div>
                           <div style={{textAlign:'right'}}>
                              <div style={{fontWeight:800, color:'var(--p)'}}>{e.phone}</div>
                              <div style={{fontSize:'0.7rem', color:'var(--muted)'}}>{e.seniority}j d'ancienneté</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {currentTab === 'performance' && (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:1000, margin:'0 auto'}}>
                  <div className="card" style={{cursor:'default', padding:25}}>
                    <h3 style={{marginBottom:20, display:'flex', gap:10}}><Icon name="trophy"/> Top Ventes (CA)</h3>
                    {data.employeesFull.sort((a,b)=>b.ca-a.ca).slice(0,5).map((e,i)=>(
                      <div key={i} className="row-item" style={{borderBottom:'1px solid var(--brd)', cursor:'default'}}>
                        <span>{i+1}. <b>{e.name}</b></span>
                        <span style={{color:'var(--p)', fontWeight:900}}>${e.ca.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{cursor:'default', padding:25}}>
                    <h3 style={{marginBottom:20, display:'flex', gap:10}}><Icon name="package"/> Top Production</h3>
                    {data.employeesFull.sort((a,b)=>b.stock-a.stock).slice(0,5).map((e,i)=>(
                      <div key={i} className="row-item" style={{borderBottom:'1px solid var(--brd)', cursor:'default'}}>
                        <span>{i+1}. <b>{e.name}</b></span>
                        <span style={{color:'var(--p)', fontWeight:900}}>{e.stock} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'support' && (
                 <div style={{maxWidth:600, margin:'0 auto', background:'var(--panel)', padding:30, borderRadius:24, border:'1px solid var(--brd)'}}>
                    <h2 style={{marginBottom:20}}><Icon name="lifeBuoy"/> Support & Aide</h2>
                    <select className="inp" value={forms.support.sub} onChange={e=>setForms({...forms, support:{...forms.support, sub:e.target.value}})}>
                       <option>Problème Stock</option><option>Erreur Facture</option><option>Demande RH</option><option>Autre</option>
                    </select>
                    <textarea className="inp" style={{height:150, resize:'none'}} placeholder="Détaillez votre demande..." value={forms.support.msg} onChange={e=>setForms({...forms, support:{...forms.support, msg:e.target.value}})}></textarea>
                    <button className="btn-p" onClick={()=>send('sendSupport', forms.support)}>Envoyer au patron</button>
                 </div>
              )}
            </div>
          </main>

          {/* PANIER FIXE (DROITE) */}
          <aside className="cart-zone">
            <div style={{padding:24, borderBottom:'1px solid var(--brd)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{display:'flex', gap:10, alignItems:'center'}}><Icon name="cart"/> Panier</h2>
              <span className="badge">{cart.reduce((s,i)=>s+i.qty, 0)} produits</span>
            </div>
            
            <div style={{padding:20}}>
              <label style={{fontSize:'0.7rem', fontWeight:900, color:'var(--muted)', display:'block', marginBottom:8}}>NUMÉRO DE FACTURE (OBLIGATOIRE)</label>
              <input className="inp" placeholder="Ex: 10293" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} style={{textAlign:'center', fontSize:'1.2rem', letterSpacing:2}} />
            </div>

            <div style={{flex:1, overflowY:'auto', padding:'0 20px'}}>
              {cart.map((i, idx)=>(
                <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800, fontSize:'0.9rem'}}>{i.name}</div>
                    <div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu} / unité</div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:12, background:'#000', padding:'5px 12px', borderRadius:12}}>
                    <button style={{border:'none', background:'none', color:'#fff', cursor:'pointer', fontWeight:900, fontSize:'1.1rem'}} onClick={()=>{
                      const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);
                    }}>-</button>
                    <span style={{fontWeight:900, minWidth:20, textAlign:'center'}}>{i.qty}</span>
                    <button style={{border:'none', background:'none', color:'#fff', cursor:'pointer', fontWeight:900, fontSize:'1.1rem'}} onClick={()=>{
                      const n=[...cart]; n[idx].qty++; setCart(n);
                    }}>+</button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div style={{textAlign:'center', marginTop:100, opacity:0.2}}><Icon name="cart" size={60}/><p>Panier vide</p></div>}
            </div>

            <div style={{padding:24, background:'rgba(0,0,0,0.3)', borderTop:'1px solid var(--brd)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <span style={{fontWeight:700, color:'var(--muted)'}}>Total à encaisser</span>
                <span style={{fontSize:'1.8rem', fontWeight:900, color:'var(--p)'}}>${total.toFixed(2)}</span>
              </div>
              <button className="btn-p" disabled={!forms.invoiceNum || cart.length===0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>
                Encaisser la vente
              </button>
            </div>
          </aside>

          {/* MODAL EMPLOYE (ANNUAIRE) */}
          {selectedEmployee && (
            <div className="modal-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setSelectedEmployee(null)}>
               <div className="card" style={{width:400, padding:30, cursor:'default'}} onClick={e=>e.stopPropagation()}>
                  <div style={{textAlign:'center', marginBottom:20}}>
                     <div style={{width:80, height:80, borderRadius:20, background:'var(--p)', margin:'0 auto 15px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:900}}>{selectedEmployee.name.charAt(0)}</div>
                     <h2>{selectedEmployee.name}</h2>
                     <p style={{color:'var(--p)', fontWeight:800}}>{selectedEmployee.role}</p>
                  </div>
                  <div className="inp" style={{background:'rgba(0,0,0,0.2)'}}>📞 {selectedEmployee.phone}</div>
                  <div className="inp" style={{background:'rgba(0,0,0,0.2)'}}>💰 CA: ${selectedEmployee.ca.toFixed(2)}</div>
                  <div className="inp" style={{background:'rgba(0,0,0,0.2)'}}>📦 Stock: {selectedEmployee.stock} pts</div>
                  <button className="btn-p" style={{marginTop:10}} onClick={()=>setSelectedEmployee(null)}>Fermer</button>
               </div>
            </div>
          )}

          {toast && <div className="toast"><b>{toast.t}</b>: {toast.m}</div>}
        </>
      )}
    </div>
  );
}
