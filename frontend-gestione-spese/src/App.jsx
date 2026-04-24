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
    const [passwordInput, setPasswordInput] = useState('');
    const [erroreLogin, setErroreLogin] = useState('');
    const [modalita, setModalita] = useState('login');
    const [nomeInput, setNomeInput] = useState('');
    const [confermaPasswordInput, setConfermaPasswordInput] = useState('');

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
        setErroreLogin('');

        if (modalita === 'registrazione' && passwordInput !== confermaPasswordInput) {
            setErroreLogin('Le password non coincidono.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, password: passwordInput })
            });

            if (response.ok) {
                const user = await response.json();

                if (modalita === 'registrazione' && nomeInput.trim()) {
                    await fetch(`${API_BASE_URL}/Utente/${user.id}/nome`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nuovoNome: nomeInput.trim() })
                    });
                    user.nome = nomeInput.trim();
                }

                setUtente(user);
                localStorage.setItem('utente_spese', JSON.stringify(user));
            } else if (response.status === 401) {
                setErroreLogin(modalita === 'login' ? 'Password errata. Riprova.' : 'Email già registrata con password diversa.');
            } else {
                setErroreLogin('Errore durante l\'accesso. Riprova.');
            }
        } catch (error) {
            console.error('Errore di connessione al server', error);
            setErroreLogin('Impossibile contattare il server.');
        }
    };

    if (!utente) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl w-96">
                    <h2 className="text-2xl font-bold mb-2 text-blue-600">Split Mate</h2>

                    <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
                        <button
                            type="button"
                            onClick={() => { setModalita('login'); setErroreLogin(''); }}
                            className={`flex-1 py-2 text-sm font-semibold transition ${modalita === 'login' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            Accedi
                        </button>
                        <button
                            type="button"
                            onClick={() => { setModalita('registrazione'); setErroreLogin(''); }}
                            className={`flex-1 py-2 text-sm font-semibold transition ${modalita === 'registrazione' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            Registrati
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-3 mb-2">
                        {modalita === 'registrazione' && (
                            <input
                                type="text"
                                placeholder="Il tuo nome..."
                                className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={nomeInput}
                                onChange={(e) => setNomeInput(e.target.value)}
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="La tua email..."
                            className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="La tua password..."
                            className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            required
                        />
                        {modalita === 'registrazione' && (
                            <input
                                type="password"
                                placeholder="Conferma password..."
                                className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                value={confermaPasswordInput}
                                onChange={(e) => setConfermaPasswordInput(e.target.value)}
                                required
                            />
                        )}
                        {erroreLogin && <p className="text-red-500 text-sm">{erroreLogin}</p>}
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                            {modalita === 'login' ? 'Accedi' : 'Registrati'}
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
