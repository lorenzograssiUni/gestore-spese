// src/components/LoginForm.jsx
import { useState } from 'react';
import { login } from '../api/api';

function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errore, setErrore] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrore('');

        const res = await login(email, password);

        if (res.ok) {
            const utente = await res.json();
            onLoginSuccess(utente);
        } else if (res.status === 401) {
            setErrore('Password errata. Riprova.');
        } else {
            setErrore('Errore durante il login. Riprova.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="text-center p-10 bg-white rounded-3xl shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-2 text-blue-600">Split Mate</h2>
                <p className="mb-6 text-gray-500 text-sm">Accedi o registrati con la tua email</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-2">
                    <input
                        type="email"
                        placeholder="La tua email..."
                        className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="La tua password..."
                        className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errore && <p className="text-red-500 text-sm">{errore}</p>}
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                        Accedi / Registrati
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;