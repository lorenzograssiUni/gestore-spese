import { useState } from 'react';
import { modificaSpesa } from '../api/api';

function ModalModificaSpesa({ spesa, membri, onClose, onSpesaModificata }) {
    const [descrizione, setDescrizione] = useState(spesa.descrizione);
    const [importo, setImporto] = useState(spesa.importo);
    const [chiPagaId, setChiPagaId] = useState(spesa.chiPaga_ID);
    const [salvataggio, setSalvataggio] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvataggio(true);
        const res = await modificaSpesa(spesa.id, {
            gruppo_ID: spesa.gruppo_ID,
            descrizione,
            importo: parseFloat(importo),
            chiPaga_ID: parseInt(chiPagaId),
            utentiCoinvoltiIds: []
        });
        if (res.ok) {
            onSpesaModificata();
            onClose();
        } else {
            alert("Errore durante la modifica.");
        }
        setSalvataggio(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-6 text-gray-800">Modifica Spesa</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Descrizione</label>
                        <input
                            value={descrizione}
                            onChange={e => setDescrizione(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Importo (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={importo}
                            onChange={e => setImporto(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Chi ha pagato</label>
                        <select
                            value={chiPagaId}
                            onChange={e => setChiPagaId(e.target.value)}
                            className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {membri.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50">
                            Annulla
                        </button>
                        <button type="submit" disabled={salvataggio} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                            {salvataggio ? 'Salvataggio...' : 'Salva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalModificaSpesa;