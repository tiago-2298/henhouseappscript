'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // C'est ici que la correction opère :
    // 1. On appelle '/api' (et pas /api/route)
    // 2. On utilise la méthode 'POST' pour que le serveur accepte la demande
    fetch('/api', { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des données');
        return res.json();
      })
      .then((data) => {
        // On trie les noms par ordre alphabétique pour faire propre
        const sortedData = data.sort((a, b) => a.nom.localeCompare(b.nom));
        setEmployees(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setError('Impossible de charger la liste des noms.');
        setLoading(false);
      });
  }, []);

  const handleLogin = () => {
    if (selectedName) {
      alert(`Connexion réussie pour : ${selectedName}`);
      // Plus tard, on mettra ici la redirection vers le dashboard
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      color: 'black'
    }}>
      <h1 style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>HEN HOUSE</h1>
      
      <div style={{ marginTop: '40px' }}>
        <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>Sélectionnez votre nom</p>

        {loading && <p style={{ color: 'gray' }}>Chargement de la liste en cours...</p>}
        
        {error && (
          <div style={{ color: 'red', marginBottom: '15px', padding: '10px', border: '1px solid red' }}>
            ⚠️ {error} <br/>
            <small>Vérifiez que le robot est bien invité sur le Google Sheet.</small>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={selectedName} 
              onChange={(e) => setSelectedName(e.target.value)}
              style={{ 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                minWidth: '200px'
              }}
            >
              <option value="">-- Choisir --</option>
              {employees.map((emp, index) => (
                <option key={index} value={`${emp.prenom} ${emp.nom}`}>
                  {emp.nom} {emp.prenom}
                </option>
              ))}
            </select>

            <button 
              onClick={handleLogin}
              disabled={!selectedName}
              style={{ 
                padding: '10px 25px', 
                fontSize: '14px', 
                cursor: selectedName ? 'pointer' : 'not-allowed',
                backgroundColor: selectedName ? '#333' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              ACCÉDER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
