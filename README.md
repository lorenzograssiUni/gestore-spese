# Split Mate - Gestore Spese di Gruppo

Una Web Application full-stack per la gestione e la divisione delle spese in gruppo, ideale per coinquilini, viaggi e cene tra amici.

![CI](https://github.com/lorenzograssiUni/gestore-spese/actions/workflows/ci.yml/badge.svg)

---

## Demo Live

| Componente | URL | Hosting |
|---|---|---|
| Frontend | [gestore-spese-xi.vercel.app](https://gestore-spese-xi.vercel.app) | Vercel |
| Backend API + Swagger | [gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/swagger](https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net/swagger) | Azure App Service |

---

## Credenziali di Prova

Per testare l'app senza registrarsi, usare le seguenti credenziali:

| Campo | Valore |
|---|---|
| Email | `test@splitmate.it` |
| Password | `test1234` |
| Codice Invito | `B74FC1B9` |

> L'account ha gia' alcuni gruppi e spese di esempio per mostrare tutte le funzionalita'.

---

## Funzionalita' Principali

* **Login / Registrazione:** Form separati — il login accede solo a utenti gia' registrati, la registrazione crea un nuovo account.
* **Modifica Nome Utente:** Dalla Navbar e' possibile cliccare sul proprio nome per modificarlo in tempo reale.
* **Gestione Gruppi:** Creazione, visualizzazione ed eliminazione di gruppi di spesa.
* **Codice Invito:** Ogni gruppo ha un codice univoco generato automaticamente per invitare altri utenti.
* **Gestione Membri:** Aggiunta di utenti fittizi (bot) e rimozione degli stessi (solo se non hanno spese registrate).
* **Gestione Spese:** Inserimento di nuove spese specificando chi ha pagato e l'importo, con possibilita' di eliminarle.
* **Divisione Flessibile:** Divisione equa tra tutti i membri o solo tra alcuni selezionati.
* **Calcolo Bilanci in Tempo Reale:** Algoritmo che calcola chi deve rimborsare chi minimizzando il numero di transazioni.
* **Eliminazione a cascata:** Cancellazione sicura delle spese, dei membri e dei gruppi.

---

## Stack Tecnologico

### Backend (C# / .NET) — Azure App Service
* **Framework:** ASP.NET Core Web API
* **Runtime:** .NET 10.0
* **ORM:** Entity Framework Core
* **Database:** SQLite
* **Architettura:** RESTful API
* **Hosting:** Azure App Service (Free F1, Sweden Central)

### Frontend (React / Vite) — Vercel
* **Libreria Core:** React 18
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Hosting:** Vercel (auto-deploy da branch main)

---

## Build e Avvio in Locale

### Prerequisiti
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org)
- [Git](https://git-scm.com)

### 1. Clona il repository
```bash
git clone https://github.com/lorenzograssiUni/gestore-spese.git
cd gestore-spese
```

### 2. Avvia il Backend
```bash
cd gestione-spese
dotnet restore
dotnet ef database update
dotnet run
```
Il backend sara' disponibile su `http://localhost:5207`.
La documentazione Swagger e' accessibile su `http://localhost:5207/swagger`.

### 3. Avvia il Frontend
Apri un nuovo terminale:
```bash
cd frontend-gestione-spese
npm install
npm run dev
```
Il frontend sara' disponibile su `http://localhost:5173`.

> **Nota:** Per far comunicare il frontend con il backend locale, crea il file `frontend-gestione-spese/.env.local` con il seguente contenuto:
> ```
> VITE_API_URL=http://localhost:5207/api
> ```

---

## Struttura del Repository

```
gestore-spese/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD GitHub Actions
├── docs/
│   └── architettura.md         # Diagrammi architettura, deploy e database (Mermaid)
├── gestione-spese/             # Backend ASP.NET Core
│   ├── Controllers/            # AuthController, GruppoController, SpesaController...
│   ├── Models/                 # Entita' del dominio (Utente, Gruppo, Spesa...)
│   ├── Data/                   # ApplicationDbContext (Entity Framework)
│   ├── Migrations/             # Migrazioni del database
│   └── Program.cs              # Entry point e configurazione servizi
└── frontend-gestione-spese/    # Frontend React/Vite
    ├── src/
    │   ├── pages/              # HomePage, DettaglioGruppo, RiepilogoGruppo
    │   ├── components/         # Navbar, ModalNuovoGruppo...
    │   └── App.jsx             # Root component con logica login/registrazione
    └── package.json
```

---

## Documentazione Aggiuntiva

| File | Contenuto |
|---|---|
| [docs/architettura.md](docs/architettura.md) | Diagrammi Mermaid: architettura generale, deploy e schema database ER |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Pipeline CI/CD: build automatica di backend e frontend ad ogni push |

---

## API e Logica di Calcolo

Il backend espone un'architettura **RESTful** divisa per Controller (`GruppoController`, `SpesaController`, `UtenteController`, ecc.).
Tra le logiche di business piu' interessanti c'e' l'**algoritmo di pareggio dei debiti** (gestito dal `RiepilogoController`), che elabora i saldi positivi e negativi di ogni utente e restituisce le transazioni ottimali per saldare tutti i conti del gruppo con il minor numero di passaggi possibili.

---

## Autori
Sviluppato da **Mattia Negri**, **Lorenzo Grassi**, **Erica Paolasini**, **Simranjit Kaur** come progetto pratico di web development full-stack.
