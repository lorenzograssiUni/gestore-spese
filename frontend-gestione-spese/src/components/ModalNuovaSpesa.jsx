import { useState } from 'react';

function ModalNuovaSpesa({ onClose, onSpesaAggiunta, gruppoId, membri }) {
    const [descrizione, setDescrizione] = useState('');
    const [importo, setImporto] = useState('');
    const [chiPagaId, setChiPagaId] = useState(membri.length > 0 ? membri[0].id : '');

    // Nuovi stati per la divisione della spesa
    const [dividiConTutti, setDividiConTutti] = useState(true);
    const [utentiCoinvolti, setUtentiCoinvolti] = useState([]); // Array degli ID selezionati

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Gestione dei checkbox per selezionare con chi si divide
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

        // Se si divide solo con alcuni, controlliamo che almeno uno sia selezionato
        if (!dividiConTutti && utentiCoinvolti.length === 0) {
            setError("Seleziona almeno un membro con cui dividere la spesa.");
            setIsSubmitting(false);
            return;
        }

        // Costruiamo il payload per il C# (Ora combacia con NuovaSpesaDTO)
        const spesaData = {
            gruppo_ID: gruppoId,
            chiPaga_ID: Number(chiPagaId),
            importo: parseFloat(importo),
            descrizione: descrizione,
            // Se "dividi con tutti" è attivo, passiamo array vuoto (il C# sa già cosa fare)
            utentiCoinvoltiIds: dividiConTutti ? [] : utentiCoinvolti
        };

        try {
            const response = await fetch('http://localhost:5000/api/spesa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(spesaData),
            });

            if (!response.ok) {
                throw new Error('Errore durante il salvataggio della spesa');
            }

            onSpesaAggiunta(); // Ricarica il gruppo nella pagina padre
            onClose();         // Chiude la modale
        } catch (err) {
            console.error(err);
            setError('Impossibile salvare la spesa. Riprova.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Modale */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-800">Aggiungi una spesa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Corpo Modale - Scorrevole se ci sono tanti membri */}
                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form id="spesa-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Chi ha pagato */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Chi ha pagato?</label>
                            <select
                                value={chiPagaId}
                                onChange={(e) => setChiPagaId(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                required
                            >
                                {membri.map(m => (
                                    <option key={m.id} value={m.id}>{m.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Descrizione */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Descrizione (es. Cena, Benzina)</label>
                                <input
                                    type="text"
                                    value={descrizione}
                                    onChange={(e) => setDescrizione(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="A cosa serve?"
                                    required
                                />
                            </div>

                            {/* Importo */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Importo (€)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-bold">€</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={importo}
                                        onChange={(e) => setImporto(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEZIONE: CON CHI DIVIDERE */}
                        <div className="border-t border-gray-100 pt-5 mt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Con chi vuoi dividere?</label>

                            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100 mb-4 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setDividiConTutti(!dividiConTutti)}>
                                <input
                                    type="checkbox"
                                    checked={dividiConTutti}
                                    onChange={() => setDividiConTutti(!dividiConTutti)}
                                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                                />
                                <span className="font-medium text-blue-900">Dividi equamente con tutto il gruppo</span>
                            </div>

                            {/* Lista membri se NON si divide con tutti */}
                            {!dividiConTutti && (
                                <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold">Seleziona chi deve pagare la sua quota:</p>
                                    {membri.map(m => (
                                        <label key={m.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={utentiCoinvolti.includes(m.id)}
                                                onChange={() => handleCheckboxChange(m.id)}
                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex justify-center items-center text-xs font-bold">
                                                    {m.nome.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-700">{m.nome}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                {/* Footer con bottoni */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-200 rounded-xl transition-colors"
                        disabled={isSubmitting}
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        form="spesa-form"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
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
