import { useState } from 'react';
import DettaglioGruppo from './pages/DettaglioGruppo.jsx';
import HomePage from './pages/HomePage.jsx';
import Navbar from './components/Navbar.jsx';
import ModalNuovoGruppo from './components/ModalNuovoGruppo.jsx';
import RiepilogoGruppo from './pages/RiepilogoGruppo.jsx';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5207/api';

function App() {
    const [utente, setUtente] = useState(() => {
        const savedUtente = localStorage.getItem('utente_spese');
        return savedUtente ? JSON.parse(savedUtente) : null;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [gruppoAttivoId, setGruppoAttivoId] = useState(null);
    const [vistaRiepilogo, setVistaRiepilogo] = useState(false);
    const [emailInput, setEmailInput] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('utente_spese');
        setUtente(null);
        setGruppoAttivoId(null);
        setVistaRiepilogo(false);
    };

    const handleAggiornaUtente = (nuoviDati) => {
        const utenteAggiornato = { ...utente, ...nuoviDati };
        setUtente(utenteAggiornato);
        localStorage.setItem('utente_spese', JSON.stringify(utenteAggiornato));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!emailInput) return;

        try {
            const response = await fetch(`${API_BASE_URL}/Utente/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput })
            });

            if (response.ok) {
                const user = await response.json();
                setUtente(user);
                localStorage.setItem('utente_spese', JSON.stringify(user));
            } else {
                alert("Errore durante il login");
            }
        } catch (error) {
            console.error("Errore di connessione al server", error);
        }
    };

    if (!utente) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl w-96">
                    <h2 className="text-2xl font-bold mb-2 text-blue-600">Split Mate</h2>
                    <p className="mb-6 text-gray-500 text-sm">Accedi o registrati con la tua email</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-3 mb-2">
                        <input
                            type="email"
                            placeholder="La tua email..."
                            className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                            Accedi / Registrati
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar
                utente={utente}
                onLogout={handleLogout}
                onGoHome={() => { setGruppoAttivoId(null); setVistaRiepilogo(false); }}
                onAggiornaUtente={handleAggiornaUtente}
            />

            <main>
                {vistaRiepilogo && gruppoAttivoId ? (
                    <RiepilogoGruppo
                        gruppoId={gruppoAttivoId}
                        onBack={() => setVistaRiepilogo(false)}
                    />
                ) : gruppoAttivoId ? (
                    <DettaglioGruppo
                        gruppoId={gruppoAttivoId}
                        onBack={() => setGruppoAttivoId(null)}
                        onApriRiepilogo={() => setVistaRiepilogo(true)}
                    />
                ) : (
                    <HomePage
                        utente={utente}
                        refreshKey={refreshKey}
                        onOpenModal={() => setIsModalOpen(true)}
                        onApriGruppo={(id) => setGruppoAttivoId(id)}
                    />
                )}
            </main>

            {isModalOpen && (
                <ModalNuovoGruppo
                    onClose={() => setIsModalOpen(false)}
                    onGruppoCreato={() => setRefreshKey(prev => prev + 1)}
                    utente={utente}
                />
            )}
        </div>
    );
}

export default App;
