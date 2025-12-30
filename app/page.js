'use client';
import { useState, useEffect } from 'react';

// ================= STYLES (Design "Dark Mode" Hen House) =================
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '20px' },
  loginBox: { maxWidth: '400px', margin: '100px auto', padding: '30px', backgroundColor: '#1e1e1e', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', textAlign: 'center' },
  title: { color: '#f1c40f', fontSize: '2rem', marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase' },
  select: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff', fontSize: '16px' },
  button: { width: '100%', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#f1c40f', color: '#121212', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  dashboard: { maxWidth: '1000px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' },
  nav: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' },
  navBtn: (active) => ({
    padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer',
    backgroundColor: active ? '#f1c40f' : '#2d2d2d', color: active ? '#121212' : '#aaa', fontWeight: 'bold'
  }),
  card: { backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  label: { display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff' },
  row: { display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' },
  removeBtn: { padding: '10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  addBtn: { padding: '10px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginBottom: '20px' },
  success: { backgroundColor: '#2ecc71', color: '#fff', padding: '15px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' },
  error: { backgroundColor: '#e74c3c', color: '#fff', padding: '15px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }
};

export default function Home() {
  // --- ÉTATS ---
  const [view, setView] = useState('login'); // 'login' ou 'dashboard'
  const [currentUser, setCurrentUser] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Contient les Prix, Produits, Véhicules, etc.
  const [activeTab, setActiveTab] = useState('facture');
  const [status, setStatus] = useState(null); // Pour afficher les messages de succès/erreur
  const [formData, setFormData] = useState({}); // Stocke les données des formulaires

  // --- 1. CHARGEMENT INITIAL (Récupère la liste et les configs depuis route.js) ---
  useEffect(() => {
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getMeta' }) // On demande toutes les infos
    })
    .then(res => res.json())
    .then(res => {
      setEmployees(res.employees || []);
      setData(res); // On stocke la config (produits, prix...)
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setStatus({ type: 'error', msg: "Erreur de connexion serveur" });
      setLoading(false);
    });
  }, []);

  // --- 2. CONNEXION ---
  const handleLogin = () => {
    if (currentUser) {
      setView('dashboard');
      setFormData({}); // Reset du formulaire à la connexion
    }
  };

  // --- 3. ENVOI DES FORMULAIRES ---
  const submitForm = async (action, payload) => {
    setStatus({ type: 'loading', msg: 'Envoi en cours...' });
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: { ...payload, employee: currentUser } })
      });
      const json = await res.json();
      
      if (json.success) {
        setStatus({ type: 'success', msg: 'Envoyé avec succès ! ✅' });
        setFormData({}); // On vide le formulaire après succès
        // On remet un item vide par défaut si besoin
        if (['facture', 'stock', 'entreprise'].includes(activeTab)) {
           setFormData({ items: [{ desc: (data?.products?.[0] || ''), qty: 1 }] });
        }
        setTimeout(() => setStatus(null), 3000);
      } else {
        throw new Error(json.message || "Erreur inconnue");
      }
    } catch (e) {
      setStatus({ type: 'error', msg: `Erreur: ${e.message}` });
    }
  };

  // --- 4. GESTION DE L'AFFICHAGE DES ONGLETS ---
  const renderTabContent = () => {
    if (!data) return <p>Chargement des données...</p>;

    // --- ONGLET FACTURE ---
    if (activeTab === 'facture') {
      const items = formData.items || [{ desc: data.products[0], qty: 1 }];
      
      const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
      };

      return (
        <div style={styles.card}>
          <h3 style={{ color: '#f1c40f', marginBottom: '20px' }}>🧾 Nouvelle Facture</h3>
          <div style={styles.row}>
             <input 
               placeholder="Numéro Facture (Optionnel)" 
               style={styles.input} 
               value={formData.invoiceNumber || ''}
               onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} 
             />
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={styles.row}>
              <select style={{...styles.select, flex: 3}} value={item.desc} onChange={e => updateItem(idx, 'desc', e.target.value)}>
                {data.products.map(p => (
                  <option key={p} value={p}>{p} ({data.prices[p] || 0}$)</option>
                ))}
              </select>
              <input type="number" style={{...styles.input, flex: 1}} value={item.qty} min="1" onChange={e => updateItem(idx, 'qty', e.target.value)} />
              {items.length > 1 && <button style={styles.removeBtn} onClick={() => setFormData({...formData, items: items.filter((_, i) => i !== idx)})}>X</button>}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setFormData({...formData, items: [...items, { desc: data.products[0], qty: 1 }]})}>+ Ajouter un article</button>
          <button style={styles.button} onClick={() => submitForm('sendFactures', { items, invoiceNumber: formData.invoiceNumber })}>Envoyer la facture</button>
        </div>
      );
    }

    // --- ONGLET STOCK ---
    if (activeTab === 'stock') {
      const items = formData.items || [{ product: data.products[0], qty: 1 }];
      return (
        <div style={styles.card}>
          <h3 style={{ color: '#e67e22', marginBottom: '20px' }}>📦 Déclaration Production</h3>
          {items.map((item, idx) => (
            <div key={idx} style={styles.row}>
              <select style={{...styles.select, flex: 3}} value={item.product} onChange={e => {
                const newItems = [...items]; newItems[idx].product = e.target.value;
                setFormData({ ...formData, items: newItems });
              }}>
                {data.products.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="number" style={{...styles.input, flex: 1}} value={item.qty} min="1" onChange={e => {
                 const newItems = [...items]; newItems[idx].qty = e.target.value;
                 setFormData({ ...formData, items: newItems });
              }} />
              {items.length > 1 && <button style={styles.removeBtn} onClick={() => setFormData({...formData, items: items.filter((_, i) => i !== idx)})}>X</button>}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setFormData({...formData, items: [...items, { product: data.products[0], qty: 1 }]})}>+ Ajouter</button>
          <button style={styles.button} onClick={() => submitForm('sendProduction', { items })}>Envoyer Stock</button>
        </div>
      );
    }

    // --- ONGLET ENTREPRISE ---
    if (activeTab === 'entreprise') {
      const items = formData.items || [{ product: data.products[0], qty: 1 }];
      return (
        <div style={styles.card}>
           <h3 style={{ color: '#f39c12', marginBottom: '20px' }}>🏭 Commande Entreprise</h3>
           <label style={styles.label}>Nom de l'entreprise</label>
           <input style={styles.input} placeholder="Ex: LSPD, EMS..." value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} />
           
           {items.map((item, idx) => (
            <div key={idx} style={styles.row}>
              <select style={{...styles.select, flex: 3}} value={item.product} onChange={e => {
                const newItems = [...items]; newItems[idx].product = e.target.value;
                setFormData({ ...formData, items: newItems });
              }}>
                {data.products.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="number" style={{...styles.input, flex: 1}} value={item.qty} min="1" onChange={e => {
                 const newItems = [...items]; newItems[idx].qty = e.target.value;
                 setFormData({ ...formData, items: newItems });
              }} />
               {items.length > 1 && <button style={styles.removeBtn} onClick={() => setFormData({...formData, items: items.filter((_, i) => i !== idx)})}>X</button>}
            </div>
          ))}
          <button style={styles.addBtn} onClick={() => setFormData({...formData, items: [...items, { product: data.products[0], qty: 1 }]})}>+ Ajouter</button>
          <button style={styles.button} onClick={() => submitForm('sendEntreprise', { company: formData.company, items })}>Valider Commande</button>
        </div>
      );
    }

    // --- ONGLET GARAGE ---
    if (activeTab === 'garage') {
      return (
        <div style={styles.card}>
          <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>🚗 Gestion Garage</h3>
          <label style={styles.label}>Véhicule</label>
          <select style={styles.select} value={formData.vehicle || ''} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
            <option value="">-- Choisir --</option>
            {data.vehicles.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <label style={styles.label}>Action</label>
          <select style={styles.select} value={formData.action || 'Entrée'} onChange={e => setFormData({...formData, action: e.target.value})}>
            {['Entrée', 'Sortie', 'Maintenance', 'Réparation'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <label style={styles.label}>Niveau Essence (%)</label>
          <input type="number" max="100" style={styles.input} value={formData.fuel || ''} onChange={e => setFormData({...formData, fuel: e.target.value})} />
          <button style={styles.button} onClick={() => submitForm('sendGarage', formData)}>Enregistrer</button>
        </div>
      );
    }

    return null;
  };

  // --- RENDU PRINCIPAL DU SITE ---
  return (
    <div style={styles.container}>
      {loading ? (
        <div style={{textAlign: 'center', marginTop: '100px'}}>Chargement HEN HOUSE...</div>
      ) : view === 'login' ? (
        <div style={styles.loginBox}>
          <h1 style={styles.title}>HEN HOUSE</h1>
          <p style={{marginBottom: '20px', color: '#aaa'}}>Connectez-vous pour commencer</p>
          <select style={styles.select} value={currentUser} onChange={e => setCurrentUser(e.target.value)}>
            <option value="">-- Sélectionnez votre nom --</option>
            {employees.map((emp, i) => (
              <option key={i} value={emp.nom}>{emp.nom}</option>
            ))}
          </select>
          <button style={styles.button} disabled={!currentUser} onClick={handleLogin}>ACCÉDER</button>
        </div>
      ) : (
        <div style={styles.dashboard}>
          <header style={styles.header}>
            <h2 style={{color: '#f1c40f'}}>HEN HOUSE</h2>
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
              <span style={{fontWeight: 'bold'}}>👤 {currentUser}</span>
              <button onClick={() => setView('login')} style={{...styles.removeBtn, backgroundColor: '#333'}}>Déco</button>
            </div>
          </header>

          <nav style={styles.nav}>
            {['facture', 'stock', 'entreprise', 'garage'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={styles.navBtn(activeTab === tab)}>
                {tab.toUpperCase()}
              </button>
            ))}
          </nav>

          {status && (
            <div style={status.type === 'error' ? styles.error : styles.success}>
              {status.msg}
            </div>
          )}

          {renderTabContent()}
        </div>
      )}
    </div>
  );
}
