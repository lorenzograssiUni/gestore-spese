const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5207";

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login fallito");
    return res.json();
  },

  async register(nome, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });
    if (!res.ok) throw new Error("Registrazione fallita");
    return res.json();
  },

  async getSpese(token) {
    const res = await fetch(`${API_BASE_URL}/spesa`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Impossibile ottenere le spese");
    return res.json();
  },

  async createSpese(token, spesa) {
    const res = await fetch(`${API_BASE_URL}/spesa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(spesa),
    });
    if (!res.ok) throw new Error("Impossibile creare la spesa");
    return res.json();
  },

  async deleteSpesa(token, id) {
    const res = await fetch(`${API_BASE_URL}/spesa/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Impossibile eliminare la spesa");
    return res.json();
  },
};
