import { useState, useEffect } from 'react';
import ModalNuovaSpesa from './ModalNuovaSpesa';
function DettaglioGruppo({ gruppoId, onBack }) {
    const [gruppo, setGruppo] = useState(null);
    const [riepiloghi, setRiepiloghi] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nuovoMembroNome, setNuovoMembroNome] = useState('');
    const [isAggiungendo, setIsAggiungendo] = useState(false);
    const [isModalSpesaOpen, setIsModalSpesaOpen] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const caricaDatiGruppo = async () => {
        try {
            const resGruppo = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}`);
            if (!resGruppo.ok) throw new Error("Gruppo non trovato");
            const dataGruppo = await resGruppo.json();
            setGruppo(dataGruppo);

            const resBilanci = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}/bilanci`);
            if (resBilanci.ok) {
                const dataBilanci = await resBilanci.json();
                setRiepiloghi(dataBilanci);
            }
        } catch (error) {
            console.error("Errore nel caricamento dati:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gruppoId) caricaDatiGruppo();
    }, [gruppoId]);

    const handleAggiungiMembro = async (e) => {
        e.preventDefault();
        if (!nuovoMembroNome.trim()) return;

        setIsAggiungendo(true);

        const nuovoUtente = {
            nome: nuovoMembroNome,
            email: `${nuovoMembroNome.toLowerCase().replace(/\s+/g, '')}_${Math.floor(Math.random() * 10000)}@bot.it`
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Gruppo/${gruppoId}/aggiungi-bot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuovoUtente),
            });

            if (response.ok) {
                setNuovoMembroNome('');
                caricaDatiGruppo();    
            } else {
                alert("Errore durante l'aggiunta dell'amico fittizio.");
            }
        } catch (error) {
            console.error("Errore salvataggio utente:", error);
        } finally {
            setIsAggiungendo(false);
        }
    };

    const handleEliminaGruppo = async () => {
        if (window.confirm("ATTENZIONE: Sei sicuro di voler eliminare questo gruppo? Tutte le spese verranno perse.")) {
            try {
                const response = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}`, {
                    method: 'DELETE',
                });
                if (response.ok) onBack();
            } catch (error) {
                console.error("Errore eliminazione gruppo:", error);
            }
        }
    };

    const handleEliminaSpesa = async (spesaId) => {
        if (window.confirm("Eliminare questa spesa?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/spesa/${spesaId}`, {
                    method: 'DELETE',
                });
                if (response.ok) caricaDatiGruppo();
            } catch (error) {
                console.error("Errore eliminazione spesa:", error);
            }
        }
    };

    const handleEliminaAmico = async (amicoId, nomeAmico) => {
        const eCoinvolto = gruppo?.spese?.some(s => s.chiPagaID === amicoId);
        if (eCoinvolto) {
            alert(`Non puoi eliminare ${nomeAmico} perché ha delle spese registrate.`);
            return;
        }
        if (window.confirm(`Vuoi rimuovere ${nomeAmico} dal gruppo?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/Gruppo/${gruppoId}/rimuovi-membro/${amicoId}`, {
                    method: 'DELETE',
                });
                if (response.ok) caricaDatiGruppo();
            } catch (error) {
                console.error("Errore eliminazione amico", error);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!gruppo) return <div className="text-center text-red-500 py-10 font-bold">Gruppo non trovato.</div>;

    const listaMembri = gruppo.utenti || [];
    const listaSpese = gruppo.spese || [];

    return (
        <main className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
            {/* Navigazione Superiore */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-blue-600 font-medium flex items-center transition-colors">
                    <span className="mr-2">←</span> Torna ai gruppi
                </button>
                <button onClick={handleEliminaGruppo} className="text-red-500 border border-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition-all">
                    Elimina Gruppo
                </button>
            </div>

            {/* Header del Gruppo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">{gruppo.nome}</h1>
                    <p className="text-gray-500">{gruppo.descrizione || "Nessuna descrizione"}</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-50 px-6 py-3 rounded-2xl text-center">
                        <p className="text-xs font-bold text-blue-600 uppercase">Amici</p>
                        <p className="text-2xl font-black text-blue-800">{listaMembri.length}</p>
                    </div>
                    <div className="bg-green-50 px-6 py-3 rounded-2xl text-center">
                        <p className="text-xs font-bold text-green-600 uppercase">Spese</p>
                        <p className="text-2xl font-black text-green-800">{listaSpese.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLONNA AMICI */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Membri</h2>
                        <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                            {listaMembri.map(m => (
                                <li key={m.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl group">
                                    <span className="font-medium text-gray-700">{m.nome}</span>
                                    <button onClick={() => handleEliminaAmico(m.id, m.nome)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        🗑
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleAggiungiMembro} className="flex gap-2 border-t pt-4">
                            <input
                                value={nuovoMembroNome}
                                onChange={e => setNuovoMembroNome(e.target.value)}
                                placeholder="Aggiungi nome..."
                                className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" disabled={isAggiungendo} className="bg-blue-600 text-white px-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                                {isAggiungendo ? '...' : '+'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLONNA SPESE */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Cronologia Spese</h2>
                            <button onClick={() => setIsModalSpesaOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-all">
                                + Nuova Spesa
                            </button>
                        </div>

                        {listaSpese.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 italic">Nessuna spesa registrata.</div>
                        ) : (
                            <ul className="space-y-3">
                                {listaSpese.slice().reverse().map(s => {
                                    const chiPaga = listaMembri.find(m => m.id === s.chiPaga_ID)?.nome || "Sconosciuto";
                                    return (
                                        <li key={s.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group">
                                            <div>
                                                <p className="font-bold text-gray-800">{s.descrizione}</p>
                                                <p className="text-xs text-gray-500">Pagato da <span className="text-blue-600 font-bold">{chiPaga}</span></p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-black text-gray-900">€{s.importo.toFixed(2)}</span>
                                                <button onClick={() => handleEliminaSpesa(s.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                    🗑
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* SEZIONE BILANCI ("Chi deve a chi") */}
            {riepiloghi.length > 0 && (
                <div className="mt-8 bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
                    <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                        <span>📊</span> Pareggio dei Conti
                    </h2>
                    <p className="text-indigo-100 text-sm mb-6">Ecco come dividere i debiti per tornare tutti in pari.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {riepiloghi.map((r, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold uppercase text-indigo-200">Deve dare a</p>
                                    <p className="text-lg font-bold"><span className="text-yellow-300">{r.da}</span> → {r.a}</p>
                                </div>
                                <div className="text-xl font-black bg-white text-indigo-600 px-3 py-1 rounded-lg">
                                    €{r.importo.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal per aggiungere spese */}
            {isModalSpesaOpen && (
                <ModalNuovaSpesa
                    onClose={() => setIsModalSpesaOpen(false)}
                    onSpesaAggiunta={caricaDatiGruppo}
                    gruppoId={gruppoId}
                    membri={listaMembri}
                />
            )}
        </main>
    );
}

export default DettaglioGruppo;