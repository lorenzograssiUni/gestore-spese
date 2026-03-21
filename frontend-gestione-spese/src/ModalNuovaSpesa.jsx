import { useState } from 'react';

function ModalNuovaSpesa({ onClose, onSpesaAggiunta, gruppoId, membri }) {
    const [descrizione, setDescrizione] = useState('');
    const [importo, setImporto] = useState('');
    const [chiPagaId, setChiPagaId] = useState(membri.length > 0 ? membri[0].id : '');

    const [dividiConTutti, setDividiConTutti] = useState(true);
    const [utentiCoinvolti, setUtentiCoinvolti] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleCheckboxChange = (membroId) => {
        setUtentiCoinvolti(prev => {
            if (prev.includes(membroId)) {
                return prev.filter(id => id !== membroId);
            } else {
                return [...prev, membroId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!dividiConTutti && utentiCoinvolti.length === 0) {
            setError("Seleziona almeno un membro con cui dividere la spesa.");
            setIsSubmitting(false);
            return;
        }

        const spesaData = {
            gruppo_ID: gruppoId,
            chiPaga_ID: Number(chiPagaId),
            importo: parseFloat(importo),
            descrizione: descrizione,
            utentiCoinvoltiIds: dividiConTutti ? [] : utentiCoinvolti
        };

        try {
            const response = await fetch(`${API_BASE_URL}/spesa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(spesaData),
            });

            if (!response.ok) {
                throw new Error('Errore durante il salvataggio della spesa');
            }

            onSpesaAggiunta();
            onClose();
        } catch (err) {
            console.error("Errore invio spesa:", err);
            setError('Impossibile salvare la spesa. Controlla la connessione al backend.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header del Modal */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-800">Aggiungi spesa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold border border-red-100">
                            ⚠️ {error}
                        </div>
                    )}

                    <form id="spesa-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Chi paga */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Chi ha pagato?</label>
                            <select
                                value={chiPagaId}
                                onChange={(e) => setChiPagaId(e.target.value)}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                required
                            >
                                {membri.map(m => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Descrizione */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Cosa hai comprato?</label>
                            <input
                                type="text"
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="es. Spesa settimanale, Birre..."
                                required
                            />
                        </div>

                        {/* Importo */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Quanto hai speso?</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold">€</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={importo}
                                    onChange={(e) => setImporto(e.target.value)}
                                    className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Divisione Spesa */}
                        <div className="border-t border-gray-100 pt-5">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Con chi dividi?</label>

                            <div
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${dividiConTutti ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                                onClick={() => setDividiConTutti(!dividiConTutti)}
                            >
                                <input
                                    type="checkbox"
                                    checked={dividiConTutti}
                                    onChange={() => { }} 
                                    className="w-5 h-5 text-blue-600 rounded cursor-pointer focus:ring-0"
                                />
                                <span className="font-bold text-sm">Dividi equamente con tutti</span>
                            </div>

                            {!dividiConTutti && (
                                <div className="mt-4 space-y-2 animate-fade-in">
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-2">Seleziona partecipanti:</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {membri.map(m => (
                                            <label key={m.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                                                <input
                                                    type="checkbox"
                                                    checked={utentiCoinvolti.includes(m.id)}
                                                    onChange={() => handleCheckboxChange(m.id)}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="font-bold text-gray-700 text-sm">{m.nome}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer del Modal */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-gray-500 font-bold hover:bg-gray-200 rounded-2xl transition-all"
                        disabled={isSubmitting}
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        form="spesa-form"
                        className="flex-[2] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Salvataggio...
                            </>
                        ) : 'Salva Spesa'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalNuovaSpesa;
