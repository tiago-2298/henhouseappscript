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
  "Saumon Grillé": "https://files.catbox.moe/05bofq.png",
  "Crousti-Douce": "https://files.catbox.moe/23lr31.png",
  "Wings épicé": "https://files.catbox.moe/i17915.png",
  "Filet Mignon": "https://files.catbox.moe/3dzjbx.png",
  "Poulet Rôti": "https://files.catbox.moe/8fyin5.png",
  "Paella Méditerranéenne": "https://files.catbox.moe/88udxk.png",
  "Ribbs": "https://files.catbox.moe/ej5jok.png",
  "Steak 'Potatoes": "https://files.catbox.moe/msdthe.png",
  "Rougail Saucisse": "https://files.catbox.moe/jqzox0.png",
  "Boeuf bourguignon": "https://files.catbox.moe/px75e5.png",
  "Quiche aux légumes": "https://files.catbox.moe/vab09x.png",
  "Brochettes de fruits frais": "https://files.catbox.moe/cbmjou.png",
  "Mousse au café": "https://files.catbox.moe/wzvbw6.png",
  "Tiramisu Fraise": "https://files.catbox.moe/6s04pq.png",
  "Tourte Myrtille": "https://files.catbox.moe/oxwlna.png",
  "Los Churros Caramel": "https://files.catbox.moe/pvjuhn.png",
  "Jus d'orange": "https://files.catbox.moe/u29syk.png",
  "Lait de poule": "https://files.catbox.moe/jxgida.png",
  "Café": "https://files.catbox.moe/txb2hd.png",
  "Cappuccino": "https://files.catbox.moe/txb2hd.png",
  "Bière": "https://files.catbox.moe/m4exni.png",
  "Lutinade": "https://files.catbox.moe/oyq84s.png",
  "Berry Fizz": "https://files.catbox.moe/e0ztl3.png",
  "Jus de raisin rouge": "https://files.catbox.moe/dysrkb.png",
  "Jus de raisin blanc": "https://files.catbox.moe/9w8w7k.png",
  "Agua Fresca Pasteque": "https://files.catbox.moe/rh7jy9.png",
  "Vin rouge chaud": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
  "Cidre Pression": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
  "Menu Le Nid Végé": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Menu Grillé du Nord": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Menu Fraîcheur Méditerranéenne": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Menu Voyage Sucré-Salé": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Menu Flamme d OR": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400",
  "Menu Happy Hen House": "https://images.unsplash.com/photo-1547573854-74d2a71d0827?w=400"
};

const NOTIF_MESSAGES = {
  sendFactures: { title: "💰 FACTURE TRANSMISE", msg: "La vente a été enregistrée avec succès !" },
  sendProduction: { title: "📦 STOCK ACTUALISÉ", msg: "La production cuisine a été déclarée." },
  sendEntreprise: { title: "🏢 COMMANDE PRO ENVOYÉE", msg: "Le bon de commande entreprise est parti." },
  sendPartnerOrder: { title: "🤝 PARTENAIRE VALIDÉ", msg: "La commande partenaire est enregistrée." },
  sendGarage: { title: "🚗 VÉHICULE ACTUALISÉ", msg: "L'état du véhicule a été mis à jour." },
  sendExpense: { title: "💳 NOTE DE FRAIS", msg: "Vos frais ont été transmis." },
  sendSupport: { title: "🆘 SUPPORT CONTACTÉ", msg: "Message envoyé au patron." },
  sync: { title: "☁️ SYNC", msg: "Données à jour." }
};

export default function Home() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const notify = (t, m, s='info') => {
    setToast({t, m, s});
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async (isSync = false) => {
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) });
      const j = await r.json();
      if(j.success) {
        setData(j);
        if(isSync) notify(NOTIF_MESSAGES.sync.title, NOTIF_MESSAGES.sync.msg, "success");
      }
    } catch (e) { notify("ERREUR CLOUD", "Connexion perdue", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const total = useMemo(() => cart.reduce((a,b)=>a+b.qty*b.pu, 0), [cart]);
  const myProfile = useMemo(() => data?.employeesFull?.find(e => e.name === user), [data, user]);

  const send = async (action, payload) => {
    if(sending) return;
    setSending(true);
    try {
      const r = await fetch('/api', { method: 'POST', body: JSON.stringify({ action, data: {...payload, employee: user} }) });
      const j = await r.json();
      if(j.success) {
        notify(NOTIF_MESSAGES[action].title, NOTIF_MESSAGES[action].msg, "success");
        if(action === 'sendFactures') { setCart([]); setForms(p=>({...p, invoiceNum:''})); }
        loadData();
      }
    } catch (e) { notify("ERREUR", "Serveur injoignable", "error"); }
    finally { setSending(false); }
  };

  if (loading && !data) return (
    <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1115', color:'#ff9800'}}>
        <div style={{textAlign:'center'}}>
            <div style={{border:'4px solid #181a20', borderTopColor:'#ff9800', borderRadius:'50%', width:40, height:40, animation:'spin 1s linear infinite', margin:'0 auto 20px'}}></div>
            <p style={{fontWeight:800}}>SYNCHRONISATION HEN HOUSE...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="app">
      <style jsx global>{`
        :root { --p: #ff9800; --bg: #0f1115; --panel: #181a20; --txt: #f1f5f9; --muted: #94a3b8; --brd: #2d333f; }
        * { box-sizing: border-box; margin:0; padding:0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--txt); height: 100vh; overflow: hidden; }
        .app { display: flex; height: 100vh; width: 100vw; }
        .side { width: 260px; border-right: 1px solid var(--brd); padding: 24px; display: flex; flex-direction: column; background: #000; }
        .nav-l { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; border:none; background:transparent; color: var(--muted); cursor: pointer; font-weight: 700; width: 100%; transition: 0.2s; font-size: 0.85rem; margin-bottom: 4px; }
        .nav-l.active { background: var(--p); color: #fff; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); }
        .main { flex: 1; overflow-y: auto; padding: 30px; background: radial-gradient(circle at 100% 100%, #2a1b0a 0%, #0b0d11 100%); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        .card { background: var(--panel); border: 1px solid var(--brd); padding: 15px; border-radius: 18px; cursor: pointer; transition: 0.3s; text-align: center; }
        .card:hover { border-color: var(--p); transform: translateY(-3px); }
        .form-ui { width: 100%; max-width: 550px; background: rgba(22, 25, 32, 0.6); backdrop-filter: blur(12px); padding: 40px; border-radius: 30px; border: 1px solid var(--brd); margin: 0 auto; }
        .inp { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--brd); background: #0b0d11; color: #fff; font-weight: 600; margin-bottom: 12px; }
        .btn-p { background: var(--p); color: #fff; border:none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; transition: 0.2s; }
        .cart { width: 320px; border-left: 1px solid var(--brd); background: var(--panel); display: flex; flex-direction: column; }
        .qty-inp { width: 50px; background: #000; border: 1px solid var(--brd); color: #fff; text-align: center; border-radius: 6px; }
        .toast { position: fixed; top: 20px; right: 20px; padding: 15px 30px; border-radius: 12px; z-index: 3000; color: #fff; font-weight: 800; }
      `}</style>

      {view === 'login' ? (
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="form-ui" style={{maxWidth: 400, textAlign: 'center'}}>
            <img src="https://i.goopics.net/dskmxi.png" height="100" style={{marginBottom:30}} />
            <h1>Mon Espace</h1>
            <select className="inp" style={{marginTop:20}} value={user} onChange={e=>setUser(e.target.value)}>
              <option value="">👤 Choisir un agent...</option>
              {data?.employees.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
            <button className="btn-p" onClick={()=>setView('app')} disabled={!user}>SESSION AGENT</button>
          </div>
        </div>
      ) : (
        <>
          <aside className="side">
            <div style={{textAlign:'center', marginBottom:35}}><img src="https://i.goopics.net/dskmxi.png" height="50" /></div>
            <div style={{flex:1}}>
              {MODULES.map(t => (
                <button key={t.id} className={`nav-l ${currentTab===t.id?'active':''}`} onClick={()=>setCurrentTab(t.id)}>
                  <span>{t.e}</span> {t.l}
                </button>
              ))}
            </div>
            <button className="nav-l" onClick={()=>setView('login')} style={{color:'#ef4444'}}>🚪 QUITTER</button>
          </aside>

          <main className="main">
            {currentTab === 'home' && (
              <div>
                <h1 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: 10}}>Bonjour, {user} 👋</h1>
                <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 40}}>
                   <div className="card" style={{padding:40, textAlign:'left'}}>
                      <div style={{fontSize:'3rem'}}>💰</div>
                      <div style={{marginTop:15, color:'var(--muted)'}}>MON CA TOTAL</div>
                      <div style={{fontSize:'2rem', fontWeight:900, color:'var(--p)'}}>${myProfile?.ca.toLocaleString()}</div>
                   </div>
                   <div className="card" style={{padding:40, textAlign:'left'}}>
                      <div style={{fontSize:'3rem'}}>📦</div>
                      <div style={{marginTop:15, color:'var(--muted)'}}>MA PRODUCTION</div>
                      <div style={{fontSize:'2rem', fontWeight:900}}>{myProfile?.stock.toLocaleString()} u.</div>
                   </div>
                </div>
              </div>
            )}

            {currentTab === 'invoices' && (
              <>
                <div style={{display:'flex', gap:10, marginBottom:25}}>
                  <input className="inp" placeholder="🔍 Rechercher..." style={{flex:1, marginBottom:0}} onChange={e=>setSearch(e.target.value)} />
                  <select className="inp" style={{width:180, marginBottom:0}} onChange={e=>setCatFilter(e.target.value)}>
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
                      <div style={{height:110, borderRadius:10, overflow:'hidden', background:'#000', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        {IMAGES[p] ? <img src={IMAGES[p]} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'2rem', opacity:0.2}}>{p.charAt(0)}</span>}
                      </div>
                      <div style={{fontWeight:800, fontSize:'0.75rem', height:35}}>{p}</div>
                      <div style={{color:'var(--p)', fontWeight:900}}>${data.prices[p]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {['stock', 'garage', 'expenses', 'support', 'profile'].includes(currentTab) && (
                <div className="form-ui">
                    {currentTab === 'stock' && (
                        <>
                            <h2 style={{textAlign:'center', marginBottom:20}}>🍳 PRODUCTION CUISINE</h2>
                            {forms.stock.map((item, i) => (
                                <div key={i} style={{display:'flex', gap:10, marginBottom:10}}>
                                    <select className="inp" style={{flex:1}} value={item.product} onChange={e=>{const n=[...forms.stock]; n[i].product=e.target.value; setForms({...forms, stock:n});}}>
                                        <option value="">Produit...</option>
                                        {data.products.map(p=><option key={p}>{p}</option>)}
                                    </select>
                                    <input type="number" className="inp" style={{width:80}} value={item.qty} onChange={e=>{const n=[...forms.stock]; n[i].qty=e.target.value; setForms({...forms, stock:n});}} />
                                </div>
                            ))}
                            <button className="btn-p" onClick={()=>send('sendProduction', {items: forms.stock})}>DÉCLARER PRODUCTION</button>
                        </>
                    )}
                    {currentTab === 'profile' && myProfile && (
                        <div style={{textAlign:'center'}}>
                            <div style={{width:100, height:100, borderRadius:'50%', background:'var(--p)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:900}}>{user.charAt(0)}</div>
                            <h1>{user}</h1>
                            <p style={{color:'var(--p)', fontWeight:800}}>{myProfile.role}</p>
                            <div style={{marginTop:30, padding:20, background:'#000', borderRadius:15, textAlign:'left'}}>
                                <p style={{marginBottom:10}}>🆔 ID Employé : #00{myProfile.id}</p>
                                <p style={{marginBottom:10}}>📞 Téléphone : {myProfile.phone}</p>
                                <p style={{marginBottom:10}}>📅 Ancienneté : {myProfile.seniority} jours</p>
                                <p style={{color:'var(--p)', fontWeight:800, fontSize:'1.2rem'}}>💵 Salaire estimé : ${myProfile.salary.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </main>

          {currentTab === 'invoices' && (
            <aside className="cart">
              <div style={{padding:24, borderBottom:'1px solid var(--brd)'}}><h2 style={{fontSize:'1.1rem'}}>🛒 PANIER</h2></div>
              <div style={{padding:15}}><input className="inp" placeholder="N° FACTURE" value={forms.invoiceNum} onChange={e=>setForms({...forms, invoiceNum:e.target.value})} /></div>
              <div style={{flex:1, overflowY:'auto', padding:'0 15px'}}>
                {cart.map((i, idx)=>(
                  <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{flex:1}}><div style={{fontWeight:800, fontSize:'0.85rem'}}>{i.name}</div><div style={{color:'var(--muted)', fontSize:'0.75rem'}}>${i.pu}</div></div>
                    <div style={{display:'flex', alignItems:'center', gap:5}}>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:25, height:25, borderRadius:5}} onClick={()=>{const n=[...cart]; if(n[idx].qty>1) n[idx].qty--; else n.splice(idx,1); setCart(n);}}>-</button>
                      <span className="qty-inp">{i.qty}</span>
                      <button style={{background:'var(--brd)', border:'none', color:'#fff', width:25, height:25, borderRadius:5}} onClick={()=>{const n=[...cart]; n[idx].qty++; setCart(n);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:25, background:'rgba(0,0,0,0.5)', borderTop:'1px solid var(--brd)'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}><span>TOTAL</span><b style={{fontSize:'2rem', color:'var(--p)'}}>${total.toLocaleString()}</b></div>
                <button className="btn-p" disabled={sending || !forms.invoiceNum || cart.length === 0} onClick={()=>send('sendFactures', {invoiceNumber: forms.invoiceNum, items: cart.map(x=>({desc:x.name, qty:x.qty}))})}>VALIDER VENTE</button>
              </div>
            </aside>
          )}
        </>
      )}

      {toast && <div className="toast" style={{ background: toast.s === 'error' ? '#ef4444' : (toast.s === 'success' ? '#16a34a' : 'var(--p)') }}>{toast.m}</div>}
    </div>
  );
}
