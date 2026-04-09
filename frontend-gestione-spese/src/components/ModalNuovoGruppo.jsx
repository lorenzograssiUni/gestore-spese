import { useState } from 'react';

function ModalNuovoGruppo({ onClose, onGruppoCreato, utente }) {
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [loading, setLoading] = useState(false);
    const [errore, setErrore] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrore('');

        const nuovoGruppo = {
            nome: nome,
            descrizione: descrizione
        };

        fetch(`${API_BASE_URL}/gruppo?creatoreId=${utente.id}`, {            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuovoGruppo)
        })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error("Dettagli errore server:", errorData);
                    throw new Error('Errore durante la creazione del gruppo.');
                }
                return response.json();
            })
            .then(data => {
                setLoading(false);
                onGruppoCreato();
                onClose();
            })
            .catch(error => {
                console.error("Errore fetch:", error);
                setErrore('Impossibile creare il gruppo. Controlla che il backend sia attivo.');
                setLoading(false);
            });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Sfondo oscurato (Backdrop) */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Contenuto del Modal */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-fade-in-up border border-gray-100">

                {/* Bottone X per chiudere */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-black text-gray-900 mb-2">Crea Gruppo</h2>
                <p className="text-gray-500 mb-8 text-sm">Inizia a gestire le spese con i tuoi amici.</p>

                {/* Messaggio di Errore */}
                {errore && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100">
                        ⚠️ {errore}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-widest">Nome del Gruppo *</label>
                        <input
                            type="text"
                            required
                            placeholder="es. Casa al Mare 2026"
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-widest">Descrizione</label>
                        <textarea
                            rows="3"
                            placeholder="Di cosa si tratta?"
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 disabled:bg-blue-300 flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Crea Ora'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalNuovoGruppo;