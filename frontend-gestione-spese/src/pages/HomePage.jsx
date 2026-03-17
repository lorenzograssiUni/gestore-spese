import { useState, useEffect } from 'react';
import GruppoCard from '../components/GruppoCard';

function HomePage({ refreshKey, onOpenModal, onApriGruppo }) {
    const [gruppi, setGruppi] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Assicurati che 5000 sia la porta giusta del tuo backend!
        fetch('http://localhost:5000/api/gruppo')
            .then(response => response.json())
            .then(data => {
                setGruppi(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Errore nel caricamento dei gruppi:", error);
                setLoading(false);
            });
    }, [refreshKey]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">I Miei Gruppi</h1>
                    <p className="text-gray-500 mt-1">Gestisci le spese divise con i tuoi amici e colleghi.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Totale Gruppi:</span>
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md text-sm">{gruppi.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : gruppi.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nessun gruppo trovato</h3>
                    <p className="text-gray-500 mb-6">Crea il tuo primo gruppo per iniziare a dividere le spese.</p>
                    <button
                        onClick={onOpenModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                    >
                        Creane uno ora
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gruppi.map(gruppo => (
                        <GruppoCard
                            key={gruppo.id}
                            gruppo={gruppo}
                            // Ho corretto qui: la prop che si aspetta GruppoCard ora è "onSeleziona"
                            onSeleziona={() => onApriGruppo(gruppo.id)}
                        />
                    ))}
                </div>
            )}

        </main>
    );
}

export default HomePage;
