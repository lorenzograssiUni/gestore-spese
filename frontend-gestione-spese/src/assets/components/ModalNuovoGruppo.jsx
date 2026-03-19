import { useState } from 'react';
function ModalNuovoGruppo({ onClose, onGruppoCreato }) {
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [loading, setLoading] = useState(false);
    const [errore, setErrore] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrore('');

        const nuovoGruppo = {
            nome: nome,
            descrizione: descrizione
        };

        fetch('http://lhttps://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/gruppo', { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuovoGruppo)
        })
            .then(async response => {
                if (!response.ok) {
                    const errText = await response.text();
                    console.error("Errore dal server:", errText);
                    throw new Error('Errore durante il salvataggio');
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
                setErrore('Impossibile creare il gruppo. Controlla la console.');
                setLoading(false);
            });
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 animate-fade-in-up">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Crea Nuovo Gruppo</h2>

                {errore && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {errore}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome del Gruppo *</label>
                        <input
                            type="text"
                            required
                            placeholder="es. Vacanze Ibiza 2026"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Breve Descrizione</label>
                        <textarea
                            rows="3"
                            placeholder="A cosa serve questo gruppo?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:bg-blue-400 flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Crea Gruppo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalNuovoGruppo;
