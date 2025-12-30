'use client';
import { useState, useEffect } from 'react';

// Composants Icones Simples
const Icons = {
  Dash: () => <span>📊</span>,
  Invoice: () => <span>🧾</span>,
  Stock: () => <span>📦</span>,
  Factory: () => <span>🏭</span>,
  Partner: () => <span>🤝</span>,
  Card: () => <span>💳</span>,
  Car: () => <span>🚗</span>,
  Help: () => <span>🆘</span>,
};

export default function Home() {
  const [view, setView] = useState('home');
  const [meta, setMeta] = useState(null);
  const [employee, setEmployee] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États formulaires
  const [formStock, setFormStock] = useState([{product: '', qty: 1}]);
  const [formEnt, setFormEnt] = useState({ name: '', items: [{product: '', qty: 1}] });
  const [formGarage, setFormGarage] = useState({ vehicle: '', action: 'Entrée', fuel: 50 });
  const [formExp, setFormExp] = useState({ vehicle: '', kind: 'Essence', amount: '' });
  const [formSup, setFormSup] = useState({ subject: 'Problème Stock', message: '' });

  // Init
  useEffect(() => {
    fetch('/api/route', { method: 'POST', body: JSON.stringify({ action: 'getMeta' }) })
      .then(res => res.json())
      .then(data => { setMeta(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  // API Call Wrapper
  const api = async (action, data) => {
    if (!employee) return alert("Reconnecte-toi !");
    const res = await fetch('/api/route', {
      method: 'POST',
      body: JSON.stringify({ action, data: { ...data, employee } })
    });
    return await res.json();
  };

  // --- ACTIONS ---
  const addToCart = (p) => {
    const existing = cart.find(x => x.desc === p);
    if (existing) {
      setCart(cart.map(x => x.desc === p ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { desc: p, qty: 1 }]);
    }
  };

  const sendInvoice = async () => {
    const num = prompt("Numéro de facture ?");
    if (!num) return;
    const res = await api('sendFactures', { invoiceNumber: num, items: cart });
    if (res.success) { alert("Envoyé !"); setCart([]); setView('home'); }
  };

  const submitStock = async (e) => {
    e.preventDefault();
    const res = await api('sendProduction', { items: formStock.filter(i => i.product) });
    if (res.success) { alert("Stock envoyé !"); setFormStock([{product: '', qty: 1}]); }
  };

  const submitGarage = async (e) => {
    e.preventDefault();
    const res = await api('sendGarage', formGarage);
    if (res.success) alert("Garage mis à jour !");
  };

  // --- RENDER ---
  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Chargement Hen House...</div>;

  // LOGIN SCREEN
  if (!employee) return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <h1 className="mb-6 text-3xl font-extrabold text-orange-600">HEN HOUSE</h1>
        <p className="mb-4 text-gray-500">Sélectionnez votre nom</p>
        <select onChange={e => setEmployee(e.target.value)} className="mb-6 w-full rounded-lg border p-3 font-bold">
          <option value="">-- Choisir --</option>
          {meta?.employees?.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <button disabled={!employee} className="w-full rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-50">
          ACCÉDER
        </button>
      </div>
    </div>
  );

  // APP UI
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-lg hidden md:flex flex-col z-50">
        <div className="mb-10 flex items-center gap-3 text-2xl font-black text-slate-800">
          <span className="text-orange-600">HH</span> SYSTEM
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {[
            { id: 'home', l: 'Dashboard', i: <Icons.Dash/> },
            { id: 'caisse', l: 'Caisse', i: <Icons.Invoice/> },
            { id: 'stock', l: 'Stock', i: <Icons.Stock/> },
            { id: 'ent', l: 'Entreprise', i: <Icons.Factory/> },
            { id: 'garage', l: 'Garage', i: <Icons.Car/> },
            { id: 'frais', l: 'Frais', i: <Icons.Card/> },
            { id: 'support', l: 'Support', i: <Icons.Help/> },
          ].map(m => (
            <button key={m.id} onClick={() => setView(m.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-all ${view === m.id ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}>
              {m.i} {m.l}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t pt-4">
            <div className="font-bold text-sm">{employee}</div>
            <button onClick={() => setEmployee('')} className="text-xs text-red-500 hover:underline">Déconnexion</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:ml-64 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold capitalize text-slate-800">{view === 'ent' ? 'Entreprise' : view}</h2>
          <div className="md:hidden font-bold">{employee}</div>
        </header>

        {/* --- VIEW: HOME --- */}
        {view === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div onClick={() => setView('caisse')} className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm hover:shadow-md border-l-4 border-orange-500 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-2">🧾</div>
              <h3 className="text-xl font-bold">Nouvelle Vente</h3>
              <p className="text-slate-400 text-sm">Accéder au catalogue</p>
            </div>
            <div onClick={() => setView('stock')} className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm hover:shadow-md border-l-4 border-blue-500 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-2">📦</div>
              <h3 className="text-xl font-bold">Déclarer Stock</h3>
              <p className="text-slate-400 text-sm">Production cuisine</p>
            </div>
          </div>
        )}

        {/* --- VIEW: CAISSE --- */}
        {view === 'caisse' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {meta?.products?.map(p => (
                  <div key={p} onClick={() => addToCart(p)} 
                    className="cursor-pointer rounded-xl bg-white p-4 shadow-sm hover:ring-2 ring-orange-400 transition-all text-center flex flex-col items-center justify-between h-32">
                    <div className="font-bold text-sm leading-tight">{p}</div>
                    <div className="text-orange-600 font-extrabold">${meta.prices[p] || 0}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* PANIER */}
            <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-4">
              <h3 className="text-xl font-bold mb-4 flex justify-between">
                Panier <span>${cart.reduce((a,b) => a + (b.qty * (meta.prices[b.desc]||0)), 0)}</span>
              </h3>
              {cart.length === 0 ? <p className="text-slate-400 text-center py-4">Vide</p> : (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b pb-2">
                      <div>
                        <div className="font-bold">{c.desc}</div>
                        <div className="text-xs text-slate-400">${meta.prices[c.desc]}</div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 rounded px-2">
                        <span className="font-bold">x{c.qty}</span>
                        <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-red-500 font-bold">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={sendInvoice} disabled={!cart.length} className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50">
                VALIDER
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW: STOCK --- */}
        {view === 'stock' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-6">Déclaration Production</h3>
            <form onSubmit={submitStock}>
              {formStock.map((row, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                   <select className="flex-1 p-3 border rounded-xl bg-slate-50" 
                     value={row.product} onChange={e => {
                        const newS = [...formStock]; newS[idx].product = e.target.value; setFormStock(newS);
                     }}>
                      <option value="">Produit...</option>
                      {meta?.products?.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                   <input type="number" className="w-20 p-3 border rounded-xl text-center" value={row.qty} 
                     onChange={e => {
                        const newS = [...formStock]; newS[idx].qty = parseInt(e.target.value); setFormStock(newS);
                     }} />
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setFormStock([...formStock, {product: '', qty: 1}])} className="px-4 py-2 text-slate-500 border rounded-xl hover:bg-slate-50">+ Ligne</button>
                <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-xl">ENVOYER</button>
              </div>
            </form>
          </div>
        )}

        {/* --- VIEW: GARAGE --- */}
        {view === 'garage' && (
            <div className="max-w-xl bg-white p-8 rounded-2xl shadow-sm">
                <form onSubmit={submitGarage} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Véhicule</label>
                        <select className="w-full p-3 border rounded-xl" onChange={e => setFormGarage({...formGarage, vehicle: e.target.value})}>
                            <option value="">-- Choisir --</option>
                            {meta?.vehicles?.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Action</label>
                        <select className="w-full p-3 border rounded-xl" onChange={e => setFormGarage({...formGarage, action: e.target.value})}>
                            <option>Entrée</option><option>Sortie</option><option>Réparation</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1">Essence ({formGarage.fuel}%)</label>
                        <input type="range" className="w-full" min="0" max="100" value={formGarage.fuel} onChange={e => setFormGarage({...formGarage, fuel: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl">VALIDER</button>
                </form>
            </div>
        )}

      </main>
    </div>
  );
}