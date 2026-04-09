import { useState, useEffect } from 'react';
import GraficoTorta from '../components/GraficoTorta';
import GraficoIstogramma from '../components/GraficoIstogramma';
import { getGruppo, getBilanciGruppo, saldaDebito } from '../api/api';

function RiepilogoGruppo({ gruppoId, onBack }) {
    const [gruppo, setGruppo] = useState(null);
    const [riepiloghi, setRiepiloghi] = useState([]);
    const [loading, setLoading] = useState(true);

    const caricaDati = async () => {
        try {
            const resGruppo = await getGruppo(gruppoId);
            const dataGruppo = await resGruppo.json();
            setGruppo(dataGruppo);

            const resBilanci = await getBilanciGruppo(gruppoId);
            if (resBilanci.ok) {
                const dataBilanci = await resBilanci.json();
                setRiepiloghi(dataBilanci);
            }
        } catch (error) {
            console.error("Errore caricamento riepilogo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gruppoId) caricaDati();
    }, [gruppoId]);

    const handleSaldaDebito = async (riepilogoId) => {
        if (window.confirm("Confermi che il debito è stato saldato?")) {
            const res = await saldaDebito(riepilogoId);
            if (res.ok) caricaDati();
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const listaMembri = gruppo?.utenti || [];
    const listaSpese = gruppo?.spese || [];
    const totaleSpese = listaSpese.reduce((acc, s) => acc + s.importo, 0);
    const debitiAperti = riepiloghi.filter(r => !r.pagato).length;
    const debitiSaldati = riepiloghi.filter(r => r.pagato).length;

    return (
        <main className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">

            {/* Navigazione */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-gray-500 hover:text-blue-600 font-medium flex items-center transition-colors">
                    <span className="mr-2">←</span> Torna al gruppo
                </button>
            </div>

            {/* Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Riepilogo</p>
                    <h1 className="text-4xl font-black text-gray-900">{gruppo?.nome}</h1>
                    <p className="text-gray-400 mt-1 text-sm">{listaMembri.length} membri · {listaSpese.length} spese registrate</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-50 px-6 py-3 rounded-2xl text-center">
                        <p className="text-xs font-bold text-blue-600 uppercase">Totale</p>
                        <p className="text-2xl font-black text-blue-800">€{totaleSpese.toFixed(0)}</p>
                    </div>
                    <div className="bg-red-50 px-6 py-3 rounded-2xl text-center">
                        <p className="text-xs font-bold text-red-500 uppercase">Da saldare</p>
                        <p className="text-2xl font-black text-red-600">{debitiAperti}</p>
                    </div>
                    <div className="bg-green-50 px-6 py-3 rounded-2xl text-center">
                        <p className="text-xs font-bold text-green-600 uppercase">Saldati</p>
                        <p className="text-2xl font-black text-green-700">{debitiSaldati}</p>
                    </div>
                </div>
            </div>

            {/* Grid principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* SINISTRA — Torta + Istogramma impilati */}
                <div className="flex flex-col gap-8">
                    <GraficoTorta spese={listaSpese} membri={listaMembri} />
                    <GraficoIstogramma spese={listaSpese} membri={listaMembri} />
                </div>

                {/* DESTRA — Pareggio dei conti */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-8">
                    {/* Header card */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-black text-gray-900">
                            Pareggio dei Conti
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Chi deve dare a chi per tornare tutti in pari.</p>
                    </div>

                    {/* Contenuto */}
                    <div className="p-6">
                        {riepiloghi.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">✅</span>
                                </div>
                                <p className="font-bold text-lg text-gray-700">Siete tutti in pari!</p>
                                <p className="text-sm mt-1">Nessun debito da saldare.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {riepiloghi.map((r, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-2xl border transition-all ${r.pagato
                                                ? 'bg-gray-50 border-gray-100 opacity-50'
                                                : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Deve dare a</p>
                                                <p className="text-base font-bold text-gray-800">
                                                    <span className="text-blue-600">{r.da}</span>
                                                    <span className="text-gray-400 mx-2">→</span>
                                                    <span className="text-gray-800">{r.a}</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-lg font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">
                                                    €{r.importo.toFixed(2)}
                                                </span>
                                                {r.pagato ? (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                                        ✓ Saldato
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSaldaDebito(r.id)}
                                                        className="text-xs bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg font-bold transition-all"
                                                    >
                                                        Segna come saldato
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RiepilogoGruppo;