import { useState, useEffect } from 'react';
import ModalNuovaSpesa from '../components/ModalNuovaSpesa';

function DettaglioGruppo({ gruppoId, onBack }) {
    const [gruppo, setGruppo] = useState(null);
    const [riepiloghi, setRiepiloghi] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nuovoMembroNome, setNuovoMembroNome] = useState('');
    const [isAggiungendo, setIsAggiungendo] = useState(false);
    const [isModalSpesaOpen, setIsModalSpesaOpen] = useState(false);

    const caricaDatiGruppo = () => {
        fetch(`https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/gruppo/${gruppoId}`)
            .then(response => response.json())
            .then(data => {
                setGruppo(data);
            })
            .catch(error => {
                console.error("Errore caricamento gruppo:", error);
            });

        fetch(`https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/gruppo/${gruppoId}/bilanci`)
            .then(response => response.json())
            .then(data => {
                setRiepiloghi(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Errore caricamento bilanci:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        caricaDatiGruppo();
    }, [gruppoId]);

    const handleAggiungiMembro = async (e) => {
        e.preventDefault();
        if (!nuovoMembroNome.trim()) return;

        setIsAggiungendo(true);

        const nuovoUtente = {
            nome: nuovoMembroNome,
            email: `${nuovoMembroNome.toLowerCase().replace(' ', '')}@example.com`,
            gruppo_ID: gruppoId
        };

        try {
            const response = await fetch('https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/utente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuovoUtente),
            });

            if (response.ok) {
                setNuovoMembroNome('');
                caricaDatiGruppo();
            }
        } catch (error) {
            console.error("Errore salvataggio utente:", error);
        } finally {
            setIsAggiungendo(false);
        }
    };

    const handleEliminaGruppo = async () => {
        const conferma = window.confirm("Sei sicuro di voler eliminare questo gruppo? Tutte le spese andranno perse in modo irreversibile.");
        if (conferma) {
            try {
                const response = await fetch(`https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/gruppo/${gruppoId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    onBack();
                } else {
                    alert("Si è verificato un errore durante l'eliminazione.");
                }
            } catch (error) {
                console.error("Errore eliminazione gruppo:", error);
            }
        }
    };

    const handleEliminaSpesa = async (spesaId) => {
        const conferma = window.confirm("Sei sicuro di voler eliminare questa spesa?");
        if (conferma) {
            try {
                const response = await fetch(`https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/spesa/${spesaId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    caricaDatiGruppo(); 
                } else {
                    alert("Errore nell'eliminazione della spesa.");
                }
            } catch (error) {
                console.error("Errore eliminazione spesa:", error);
            }
        }
    };

    const handleEliminaAmico = async (amicoId, nomeAmico) => {
        const eCoinvolto = gruppo.spese.some(s => s.chiPaga_ID === amicoId || s.divisioni?.some(d => d.utente_ID === amicoId));

        if (eCoinvolto) {
            alert(`Non puoi eliminare ${nomeAmico} perché ha pagato o partecipato a delle spese. Elimina prima le sue spese!`);
            return;
        }

        const conferma = window.confirm(`Vuoi rimuovere ${nomeAmico} dal gruppo?`);
        if (conferma) {
            try {
                const response = await fetch(`https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/api/utente/${amicoId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    caricaDatiGruppo();
                } else {
                    alert("Errore nell'eliminazione dell'amico.");
                }
            } catch (error) {
                console.error("Errore eliminazione amico:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!gruppo) return <div className="text-center text-red-500 py-10">Gruppo non trovato</div>;

    const listaMembri = gruppo.utenti || [];
    const listaSpese = gruppo.spese || [];

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">

            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Torna ai gruppi
                </button>

                <button onClick={handleEliminaGruppo} className="flex items-center text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Elimina Gruppo
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{gruppo.nome}</h1>
                    <p className="text-gray-500">{gruppo.descrizione}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-blue-50 rounded-xl">
                        <span className="block text-sm font-semibold text-blue-600 uppercase tracking-wide">Membri</span>
                        <span className="text-2xl font-bold text-blue-800">{listaMembri.length}</span>
                    </div>
                    <div className="text-center px-6 py-3 bg-green-50 rounded-xl">
                        <span className="block text-sm font-semibold text-green-600 uppercase tracking-wide">Spese</span>
                        <span className="text-2xl font-bold text-green-800">{listaSpese.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* COLONNA AMICI */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 30 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            I tuoi Amici
                        </h2>
                        <ul className="space-y-3 mb-6 flex-grow max-h-[300px] overflow-y-auto pr-2">
                            {listaMembri.length === 0 ? (
                                <li className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">Nessun amico nel gruppo.</li>
                            ) : (
                                listaMembri.map(membro => (
                                    <li key={membro.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold text-sm">
                                                {membro.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800">{membro.nome}</span>
                                        </div>
                                        {/* Pulsante elimina amico */}
                                        <button
                                            onClick={() => handleEliminaAmico(membro.id, membro.nome)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Rimuovi amico"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                        <form onSubmit={handleAggiungiMembro} className="border-t border-gray-100 pt-4 mt-auto">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Nuovo amico</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    required
                                    value={nuovoMembroNome}
                                    onChange={(e) => setNuovoMembroNome(e.target.value)}
                                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button type="submit" disabled={isAggiungendo} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
                                    +
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* COLONNA SPESE */}
                <div className="lg:col-span-2">
                    {listaSpese.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full flex flex-col justify-center items-center min-h-[300px]">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Nessuna spesa inserita</h2>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Aggiungi la prima spesa per iniziare a calcolare i bilanci e vedere chi deve a chi.</p>
                            <button onClick={() => setIsModalSpesaOpen(true)} disabled={listaMembri.length < 2} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all">
                                + Aggiungi Nuova Spesa
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Cronologia Spese</h2>
                                <button onClick={() => setIsModalSpesaOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all">
                                    + Nuova Spesa
                                </button>
                            </div>
                            <ul className="space-y-4 overflow-y-auto pr-2 flex-grow max-h-[350px]">
                                {listaSpese.slice().reverse().map(spesa => {
                                    const chiHaPagato = listaMembri.find(m => m.id === spesa.chiPaga_ID)?.nome || "Sconosciuto";
                                    return (
                                        <li key={spesa.id} className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200 group">
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">{spesa.descrizione}</p>
                                                <p className="text-sm text-gray-500">Pagato da <span className="font-medium text-blue-600">{chiHaPagato}</span></p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-black text-gray-800">€{spesa.importo.toFixed(2)}</span>
                                                {/* Pulsante elimina spesa */}
                                                <button
                                                    onClick={() => handleEliminaSpesa(spesa.id)}
                                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Elimina spesa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {listaSpese.length > 0 && (
                <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Chi deve a chi?
                    </h2>
                    <p className="text-indigo-600/80 mb-8 text-sm">Calcolato in tempo reale dal server basato sulle tue spese esatte.</p>

                    {riepiloghi.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <span className="text-4xl mb-3 block">🎉</span>
                            <p className="text-indigo-900 font-bold text-lg">Siete tutti in pari!</p>
                            <p className="text-indigo-500 text-sm">Nessuno deve niente a nessuno.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {riepiloghi.map((r, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-gray-800 text-lg">{r.da}</span>
                                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider my-0.5">deve dare a</span>
                                        <span className="font-extrabold text-indigo-600 text-lg">{r.a}</span>
                                    </div>
                                    <div className="text-xl font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl">
                                        €{r.importo.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
