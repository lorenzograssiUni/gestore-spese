function GraficoTorta({ spese, membri }) {
    if (!spese || spese.length === 0) return null;

    const totaliPerMembro = membri.map(m => ({
        nome: m.nome,
        totale: spese
            .filter(s => s.chiPaga_ID === m.id)
            .reduce((acc, s) => acc + s.importo, 0)
    })).filter(m => m.totale > 0);

    if (totaliPerMembro.length === 0) return null;

    const totaleGlobale = totaliPerMembro.reduce((acc, m) => acc + m.totale, 0);

    const COLORI = [
        '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
        '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'
    ];

    const cx = 100, cy = 100, r = 80;
    const fette = totaliPerMembro.reduce((acc, m, i) => {
        const angoloCorrente = acc.length > 0
            ? acc[acc.length - 1].angoloFine
            : -Math.PI / 2;
        const percentuale = m.totale / totaleGlobale;
        const angolo = percentuale * 2 * Math.PI;
        const angoloFine = angoloCorrente + angolo;
        const x1 = cx + r * Math.cos(angoloCorrente);
        const y1 = cy + r * Math.sin(angoloCorrente);
        const x2 = cx + r * Math.cos(angoloFine);
        const y2 = cy + r * Math.sin(angoloFine);
        const largeArc = angolo > Math.PI ? 1 : 0;

        return [...acc, {
            ...m,
            percentuale,
            angoloFine,
            path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
            colore: COLORI[i % COLORI.length]
        }];
    }, []);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Torta SVG */}
                <div className="flex-shrink-0">
                    <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-lg">
                        {fette.map((f, i) => (
                            <path
                                key={i}
                                d={f.path}
                                fill={f.colore}
                                stroke="white"
                                strokeWidth="2"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        ))}
                        <circle cx={cx} cy={cy} r={38} fill="white" />
                        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#6b7280" fontWeight="bold">TOTALE</text>
                        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fill="#111827" fontWeight="bold">
                            €{totaleGlobale.toFixed(0)}
                        </text>
                    </svg>
                </div>

                {/* Legenda */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    {fette.map((f, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: f.colore }}></div>
                                <span className="font-bold text-gray-700 text-sm">{f.nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-gray-900">€{f.totale.toFixed(2)}</span>
                                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                                    {(f.percentuale * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GraficoTorta;