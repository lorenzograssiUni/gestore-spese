import { useState, useEffect } from 'react';
import GruppoCard from './GruppoCard';

function HomePage({ utente, refreshKey, onOpenModal, onApriGruppo }) {
    const [gruppi, setGruppi] = useState([]);
    const [loading, setLoading] = useState(!!utente?.id);
    const [status, setStatus] = useState(utente?.id ? "Inizializzazione..." : "Nessun utente.");

    const [codice, setCodice] = useState('');

    const [prevKey, setPrevKey] = useState(refreshKey);
    if (refreshKey !== prevKey) {
        setPrevKey(refreshKey);
        setLoading(true);
    }

    const API_URL = import.meta.env.VITE_API_URL;

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!codice || !utente?.id) return;
        try {
            const response = await fetch(`${API_URL}/Gruppo/join?codice=${codice}&utenteId=${utente.id}`, {
                method: 'POST'
            });
            if (response.ok) {
                setCodice('');
                window.location.reload();
            } else {
                alert("Codice non valido o sei già presente in questo gruppo.");
            }
        } catch (error) {
            console.error("Errore durante l'unione", error);
        }
    };

    useEffect(() => {
        if (!utente?.id) return;

        const endpoint = `${API_URL}/Gruppo/miei-gruppi/${utente.id}`;

        fetch(endpoint)
            .then(res => {
                if (!res.ok) throw new Error(`Errore Server: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setGruppi(data);
                setLoading(false);
                setStatus("Dati aggiornati.");
            })
            .catch(err => {
                console.error("Errore fetch gruppi:", err);
                setStatus("Errore di connessione al server.");
                setLoading(false);
            });

    }, [refreshKey, utente?.id, API_URL]);

    if (!utente) return <div className="p-10 text-center">Effettua il login per continuare.</div>;

    return (
        <main className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">I Miei Gruppi</h1>
                    <p className="text-sm text-gray-400 font-medium">Stato: {status}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Codice invito..."
                            value={codice}
                            onChange={(e) => setCodice(e.target.value.toUpperCase())}
                            className="px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-40 text-sm font-medium uppercase"
                        />
                        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-2xl font-bold transition-all text-sm">
                            Unisciti
                        </button>
                    </form>

                    <button
                        onClick={onOpenModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 whitespace-nowrap"
                    >
                        + Nuovo Gruppo
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-400 font-medium italic">Sincronizzazione in corso...</p>
                </div>
            ) : gruppi.length === 0 ? (
                <div className="text-center p-16 border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ancora tutto vuoto!</h3>
                    <p className="text-gray-500 mb-6">Non sei in nessun gruppo. Creane uno o fatti invitare usando il codice.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gruppi.map(g => (
                        <div key={g.id} className="transition-transform hover:-translate-y-1">
                            <GruppoCard
                                gruppo={g}
                                onSeleziona={() => onApriGruppo(g.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default HomePage;
