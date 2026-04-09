function GraficoIstogramma({ spese, membri }) {
    if (!spese || spese.length === 0) return null;

    const totaliPerMembro = membri.map(m => ({
        nome: m.nome,
        totale: spese
            .filter(s => s.chiPaga_ID === m.id)
            .reduce((acc, s) => acc + s.importo, 0)
    })).filter(m => m.totale > 0);

    if (totaliPerMembro.length === 0) return null;

    const COLORI = [
        '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
        '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'
    ];

    const maxValore = Math.max(...totaliPerMembro.map(m => m.totale));

    const svgW = 500;
    const svgH = 260;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 50;
    const chartW = svgW - paddingLeft - paddingRight;
    const chartH = svgH - paddingTop - paddingBottom;

    const barWidth = Math.min(50, (chartW / totaliPerMembro.length) * 0.5);
    const barSpacing = chartW / totaliPerMembro.length;

    const gridLines = [0.25, 0.5, 0.75, 1].map(p => ({
        y: paddingTop + chartH - chartH * p,
        label: `€${(maxValore * p).toFixed(0)}`
    }));

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">

                {/* Linee griglia */}
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line
                            x1={paddingLeft} y1={g.y}
                            x2={svgW - paddingRight} y2={g.y}
                            stroke="#f3f4f6" strokeWidth="1.5"
                        />
                        <text
                            x={paddingLeft - 8} y={g.y + 4}
                            textAnchor="end" fontSize="9"
                            fill="#9ca3af" fontWeight="600"
                        >
                            {g.label}
                        </text>
                    </g>
                ))}

                {/* Asse X */}
                <line
                    x1={paddingLeft} y1={paddingTop + chartH}
                    x2={svgW - paddingRight} y2={paddingTop + chartH}
                    stroke="#e5e7eb" strokeWidth="1.5"
                />

                {/* Barre */}
                {totaliPerMembro.map((m, i) => {
                    const barH = (m.totale / maxValore) * chartH;
                    const x = paddingLeft + i * barSpacing + barSpacing / 2 - barWidth / 2;
                    const y = paddingTop + chartH - barH;
                    const colore = COLORI[i % COLORI.length];

                    return (
                        <g key={i}>
                            <rect
                                x={x} y={y}
                                width={barWidth} height={barH}
                                fill={colore}
                                rx="6" ry="6"
                                opacity="0.9"
                            />
                            <text
                                x={x + barWidth / 2} y={y - 6}
                                textAnchor="middle" fontSize="10"
                                fill={colore} fontWeight="800"
                            >
                                €{m.totale.toFixed(0)}
                            </text>
                            <text
                                x={x + barWidth / 2} y={paddingTop + chartH + 18}
                                textAnchor="middle" fontSize="10"
                                fill="#6b7280" fontWeight="600"
                            >
                                {m.nome.length > 8 ? m.nome.slice(0, 8) + '…' : m.nome}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default GraficoIstogramma;