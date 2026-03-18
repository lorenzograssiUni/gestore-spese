import { useState } from 'react';
import HomePage from './pages/HomePage';
import DettaglioGruppo from './pages/DettaglioGruppo';
import Navbar from './components/Navbar';
import ModalNuovoGruppo from './components/ModalNuovoGruppo';
import './index.css';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [gruppoAttivoId, setGruppoAttivoId] = useState(null);

    const handleGruppoCreato = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Navbar onOpenModal={() => setIsModalOpen(true)} />

            {/* SE c'è un gruppo attivo, mostriamo i Dettagli. ALTRIMENTI mostriamo la Home */}
            {gruppoAttivoId ? (
                <DettaglioGruppo
                    gruppoId={gruppoAttivoId}
                    onBack={() => setGruppoAttivoId(null)}
                />
            ) : (
                <HomePage
                    refreshKey={refreshKey}
                    onOpenModal={() => setIsModalOpen(true)}
                    onApriGruppo={(id) => setGruppoAttivoId(id)}
                />
            )}

            {isModalOpen && (
                <ModalNuovoGruppo
                    onClose={() => setIsModalOpen(false)}
                    onGruppoCreato={handleGruppoCreato}
                />
            )}
        </div>
    );
}

export default App;
