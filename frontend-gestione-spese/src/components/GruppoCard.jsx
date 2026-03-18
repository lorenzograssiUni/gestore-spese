function GruppoCard({ gruppo, onSeleziona }) {
    const totaleSpese = gruppo.spese?.reduce((acc, spesa) => acc + spesa.importo, 0) || 0;
    const numeroMembri = gruppo.utenti?.length || 0;

    return (
        <div
            onClick={() => onSeleziona(gruppo.id)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {gruppo.nome}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {gruppo.descrizione}
                    </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex justify-center items-center group-hover:bg-blue-100 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
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
