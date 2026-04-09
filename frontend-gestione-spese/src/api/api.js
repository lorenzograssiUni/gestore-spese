// src/api/api.js
// Punto centrale per tutte le chiamate HTTP al backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5097/api';

// ─── AUTH ──────────────────────────────────────────────
export const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res;
};

// ─── UTENTE ────────────────────────────────────────────
export const aggiornaUtente = async (id, dati) => {
    const res = await fetch(`${API_BASE_URL}/Utente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
    });
    return res;
};

// ─── GRUPPI ────────────────────────────────────────────
export const getGruppiUtente = async (utenteId) => {
    const res = await fetch(`${API_BASE_URL}/Gruppo/utente/${utenteId}`);
    return res;
};

export const creaGruppo = async (dati) => {
    const res = await fetch(`${API_BASE_URL}/Gruppo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
    });
    return res;
};

export const getGruppo = async (gruppoId) => {
    const res = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}`);
    return res;
};

export const eliminaGruppo = async (gruppoId) => {
    const res = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}`, {
        method: 'DELETE'
    });
    return res;
};

export const aggiungiBotAlGruppo = async (gruppoId, dati) => {
    const res = await fetch(`${API_BASE_URL}/Gruppo/${gruppoId}/aggiungi-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
    });
    return res;
};

export const rimuoviMembroDalGruppo = async (gruppoId, membroId) => {
    const res = await fetch(`${API_BASE_URL}/Gruppo/${gruppoId}/rimuovi-membro/${membroId}`, {
        method: 'DELETE'
    });
    return res;
};

// ─── BILANCI ───────────────────────────────────────────
export const getBilanciGruppo = async (gruppoId) => {
    const res = await fetch(`${API_BASE_URL}/gruppo/${gruppoId}/bilanci`);
    return res;
};

// ─── SPESE ─────────────────────────────────────────────
export const creaSpesa = async (dati) => {
    const res = await fetch(`${API_BASE_URL}/Spesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
    });
    return res;
};

export const eliminaSpesa = async (spesaId) => {
    const res = await fetch(`${API_BASE_URL}/spesa/${spesaId}`, {
        method: 'DELETE'
    });
    return res;
};

export const modificaSpesa = async (spesaId, dati) => {
    const res = await fetch(`${API_BASE_URL}/Spesa/${spesaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati)
    });
    return res;
};

// ─── RIEPILOGO ─────────────────────────────────────────
export const saldaDebito = async (riepilogoId) => {
    const res = await fetch(`${API_BASE_URL}/Riepilogo/${riepilogoId}/Saldato`, {
        method: 'PUT'
    });
    return res;
};