function GruppoCard({ gruppo, onSeleziona }) {
    const totaleSpese = gruppo.spese?.reduce((acc, spesa) => acc + spesa.importo, 0) || 0;
    const numeroMembri = gruppo.utenti?.length || 0;

    return (
        <div
            onClick={() => onSeleziona(gruppo.id)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="pr-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {gruppo.nome}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {gruppo.descrizione}
                    </p>
                </div>

                <div
                    className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm flex flex-col items-center justify-center min-w-[80px] transition-transform group-hover:scale-105"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <span className="text-[10px] font-black uppercase text-indigo-400 mb-0.5 tracking-wider">Codice</span>
                    <span className="text-sm font-mono font-bold tracking-widest">{gruppo.codiceInvito}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center text-sm font-medium text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {numeroMembri} {numeroMembri === 1 ? 'membro' : 'membri'}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    € {totaleSpese.toFixed(2)} totali
                </div>
            </div>
        </div>
    );
}

export default GruppoCard;
