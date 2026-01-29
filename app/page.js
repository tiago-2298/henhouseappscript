'use client';
import { useState, useEffect, useMemo } from 'react';

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
  "Lasagne aux légumes": "https://images.unsplash.com/photo-1514516348920-f5d92839957d?w=400",
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Ribs": "https://files.catbox.moe/ej5jok.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Wings Epicé": "https://files.catbox.moe/i17915.png",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Jus de raisin Rouge": "https://files.catbox.moe/dysrkb.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png"
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  const [data, setData] = useState({ employees: [], employeesFull: [], products: [], productsByCategory: {}, prices: {}, partners: { companies: {} }, vehicles: [] });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tous');

  const [forms, setForms] = useState({
    invoiceNum: '',
    stock: [{ product: '', qty: 1 }],
    enterprise: { name: '', items: [{ product: '', qty: 1 }] },
    partner: { num: '', company: '', benef: '', items: [{ menu: '', qty: 1 }] },
    expense: { vehicle: '', kind: 'Essence', amount: '', file: null },
    garage: { vehicle: '', action: 'Entrée', fuel: 50 },
    support: { sub: 'Problème Stock', msg: '' }
  });

  const notify = (t, m, s='info') => { setToast({t, m, s}); setTimeout(() => setToast(null), 3000); };

  const loadData = async () => {
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) {
        setData(j);
        if (j.employees.length > 0) {
            const firstC = Object.keys(j.partners.companies)[0];
            setForms(f => ({...f, 
                expense: {...f.expense, vehicle: j.vehicles[0]},
                garage: {...f.garage, vehicle: j.vehicles[0]},
                partner: {...f.partner, company: firstC, benef: j.partners.companies[firstC]?.beneficiaries[0]}
            }));
        }
      }
    } catch (e) { notify("ERREUR", "Connexion impossible", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data.employeesFull.find(e => e.name === user), [data, user]);

  const send = async (action, payload) => {
    setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) {
        notify("SUCCÈS", "Action enregistrée", "success");
        if(action === 'sendFactures') { setCart([]); setForms(f=>({...f, invoiceNum:''})); }
        loadData();
      }
    } catch (e) { notify("ERREUR", "Échec de l'envoi", "error"); }
    finally { setSending(false); }
  };

  if (loading) return <div className="loader">Chargement...<style jsx>{`.loader{height:100vh;display:flex;align-items:center;justify-content:center;background:#0f1115;color:#ff9800;font-weight:bold;}`}</style></div>;

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --brd: #2d333f; }
        body { background: var(--bg); color: var(--txt); font-family: sans-serif; margin:0; }
        .app { display: flex; height: 100vh; }
        .side { width: 250px; background: #000; padding: 20px; display: flex; flex-direction: column; gap: 5px; }
        .main { flex: 1; padding: 30px; overflow-y: auto; background: radial-gradient(circle at bottom right, #2a1b0a, #0f1115); }
        .nav-l { padding: 12px; border-radius: 8px; border:none; background:none; color: #94a3b8; cursor: pointer; text-align: left; font-weight: bold; }
        .nav-l.active { background: var(--p); color: #fff; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 12px; cursor: pointer; transition: 0.2s; }
        .card:hover { border-color: var(--p); transform: translateY(-2px); }
        .inp { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; margin-bottom: 10px; box-sizing: border-box; }
        .btn-p { width: 100%; padding: 15px; border-radius: 8px; border:none; background: var(--p); color: #fff; font-weight: bold; cursor: pointer; }
        .btn-p:disabled { opacity: 0.5; cursor: not-allowed; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
        .cart { width: 300px; background: var(--panel); border-left: 1px solid var(--brd); display: flex; flex-direction: column; padding: 20px; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px; background: var(--p); color: #fff; font-weight: bold; z-index: 9999; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width: 350, textAlign: 'center'}} className="card">
            <h2 style={{color: 'var(--p)'}}>Authentification</h2>
            <select className="inp" value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">Sélectionner un agent</option>
              {data.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" disabled={!user} onClick={()=>setView('app')}>Ouvrir Session</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <h2 style={{color: 'var(--p)', textAlign: 'center'}}>Hen House</h2>
            {MODULES.map(m => (
              <button key={m.id} className={`nav-l ${currentTab===m.id?'active':''}`} onClick={()=>setCurrentTab(m.id)}>{m.e} {m.l}</button>
            ))}
            <button className="nav-l" style={{marginTop: 'auto', color: '#ef4444'}} onClick={()=>setView('login')}>🚪 Déconnexion</button>
          </aside>

          <main className="main">
            {currentTab === 'home' && (
              <div>
                <h1>Bonjour, {user}</h1>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                  <div className="card"><h3>Chiffre d'Affaires</h3><h2 style={{color:'var(--p)'}}>{myProfile?.ca}$</h2></div>
                  <div className="card"><h3>Production Stock</h3><h2 style={{color:'var(--p)'}}>{myProfile?.stock}u</h2></div>
                </div>
              </div>
            )}

            {currentTab === 'invoices' && (
              <div className="grid">
                {data.products.map(p => (
                  <div key={p} className="card" onClick={()=>{
                    const ex = cart.find(x=>x.name===p);
                    if(ex) setCart(cart.map(x=>x.name===p?{...x,qty:x.qty+1}:x));
                    else setCart([...cart, {name:p, qty:1, pu:data.prices[p]||0}]);
                  }}>
                    <div style={{height: 80, background: '#000', borderRadius: 8, marginBottom: 10, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : p[0]}
                    </div>
                    <div style={{fontSize: '0.8rem', fontWeight: 'bold'}}>{p}</div>
                    <div style={{color: 'var(--p)'}}>{data.prices[p]}$</div>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'stock' && (
              <div className="card" style={{maxWidth: 500, margin: 'auto'}}>
                <h2>Production Cuisine</h2>
                {forms.stock.map((item, i) => (
                  <div key={i} style={{display:'flex', gap:10}}>
                    <select className="inp" value={item.product} onChange={e=>{let n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n})}}>
                      <option value="">Produit</option>
                      {data.products.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                    <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{let n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n})}} />
                  </div>
                ))}
                <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>Valider Production</button>
              </div>
            )}

            {currentTab === 'garage' && (
              <div className="card" style={{maxWidth: 500, margin: 'auto'}}>
                <h2>Garage</h2>
                <select className="inp" value={forms.garage.vehicle} onChange={e=>setForms({...forms, garage:{...forms.garage, vehicle:e.target.value}})}>
                  {data.vehicles.map(v=><option key={v} value={v}>{v}</option>)}
                </select>
                <select className="inp" value={forms.garage.action} onChange={e=>setForms({...forms, garage:{...forms.garage, action:e.target.value}})}>
                    <option>Entrée</option><option>Sortie</option>
                </select>
                <input type="range" className="inp" value={forms.garage.fuel} onChange={e=>setForms({...forms, garage:{...forms.garage, fuel:e.target.value}})} />
                <button className="btn-p" onClick={()=>send('sendGarage', forms.garage)}>Enregistrer</button>
              </div>
            )}
            
            {/* Ajoutez les autres onglets ici sur le même modèle */}
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <h3>🛒 Panier</h3>
              <input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} />
              <div style={{flex:1, overflowY:'auto'}}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:'0.9rem'}}>
                    <span>{item.name} x{item.qty}</span>
                    <span>{item.qty * item.pu}$</span>
                  </div>
                ))}
              </div>
              <div style={{borderTop: '1px solid var(--brd)', paddingTop: 10}}>
                <h2 style={{color: 'var(--p)'}}>{total}$</h2>
                <button className="btn-p" disabled={!forms.invoiceNum || cart.length===0 || sending} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(i=>({desc:i.name, qty:i.qty}))})}>Valider Vente</button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && <div className="toast" style={{background: toast.s==='error'?'#ef4444':'#16a34a'}}>{toast.t}: {toast.m}</div>}
    </div>
  );
}
