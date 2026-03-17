function Navbar({ onOpenModal }) {
    return (
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-sm">
                                €
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">GestoreSpese</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            I Miei Gruppi
                        </button>
                        <button
                            onClick={onOpenModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            + Nuovo Gruppo
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
