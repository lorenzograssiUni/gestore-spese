import { useState } from 'react';

const Navbar = ({ utente, onLogout, onGoHome, onAggiornaUtente }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempNome, setTempNome] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const avviaModifica = () => {
        setTempNome(utente?.nome || '');
        setIsEditing(true);
    };

    const salvaNome = async () => {
        if (!tempNome.trim() || tempNome.trim() === utente?.nome) {
            setIsEditing(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/Utente/${utente.id}/nome`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nuovoNome: tempNome.trim() })
            });

            if (response.ok) {
                onAggiornaUtente({ nome: tempNome.trim() });
            } else {
                alert("Errore durante l'aggiornamento del nome.");
            }
        } catch (error) {
            console.error("Errore di connessione", error);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            background: '#1a1a1a',
            color: 'white',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
            <button
                onClick={onGoHome}
                style={{
                    color: 'white',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    letterSpacing: '-1px',
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                💲 SPLIT MATE
            </button>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

                    {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '0.9rem' }}>Ciao, </span>
                            <input
                                autoFocus
                                value={tempNome}
                                onChange={(e) => setTempNome(e.target.value)}
                                onBlur={salvaNome} 
                                onKeyDown={(e) => e.key === 'Enter' && salvaNome()} 
                                style={{
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    border: '2px solid #646cff',
                                    outline: 'none',
                                    width: '120px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: 'black',
                                    background: 'white'
                                }}
                            />
                        </div>
                    ) : (
                        <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Ciao,
                            <b
                                onClick={avviaModifica}
                                title="Clicca per modificare"
                                style={{ color: '#646cff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                {utente?.nome || 'Utente'}
                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>✏️</span>
                            </b>
                        </span>
                    )}

                    <button onClick={onLogout} style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        ESCI
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
