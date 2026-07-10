# Split Mate - Gestore Spese di Gruppo

Una Web Application full-stack per la gestione e la divisione delle spese in gruppo, ideale per coinquilini, viaggi e cene tra amici.

![CI](https://github.com/lorenzograssiUni/gestore-spese/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/lorenzograssiUni/gestore-spese/actions/workflows/docker.yml/badge.svg)

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
| Codice Invito | `ABE7C35D` |

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

## Scelte Progettuali

### Perche' ASP.NET Core (C#) per il backend?
Il team aveva familiarita' con C# e l'ecosistema .NET. ASP.NET Core offre ottime performance, un sistema di dependency injection nativo, e si integra perfettamente con Entity Framework Core per la gestione del database. La generazione automatica della documentazione Swagger tramite Swashbuckle ha semplificato il testing delle API durante lo sviluppo.

### Perche' SQLite come database?
Trattandosi di un progetto didattico con carico limitato, SQLite e' stata la scelta piu' pragmatica: nessun server da configurare, il database e' un singolo file, e Entity Framework Core lo supporta nativamente. In un contesto di produzione reale si migrerebbe facilmente a PostgreSQL o Azure SQL semplicemente cambiando il connection string e il provider EF.

### Perche' React + Vite per il frontend?
React permette di costruire UI reattive a componenti riutilizzabili, ideale per una SPA con molte interazioni (modali, aggiornamenti in tempo reale dei bilanci, liste dinamiche). Vite e' stato scelto come build tool al posto di Create React App per la sua velocita' di avvio in sviluppo (HMR istantaneo) e build di produzione piu' ottimizzate.

### Perche' Tailwind CSS?
Tailwind consente di stilare i componenti direttamente nel JSX senza dover gestire file CSS separati, velocizzando lo sviluppo e mantenendo la consistenza visiva. Le utility class evitano conflitti di naming e rendono ogni componente autonomo e facile da modificare.

### Perche' Vercel + Azure App Service per il deploy?
Vercel e' la piattaforma piu' semplice per deployare app React: si connette direttamente al repository GitHub e fa auto-deploy ad ogni push su `main`, senza configurazione. Azure App Service e' stato scelto per il backend perche' supporta nativamente .NET e offre un piano gratuito (F1) sufficiente per un progetto dimostrativo.

### Perche' un algoritmo di minimizzazione delle transazioni?
Un approccio naive (ogni utente rimborsa chi ha pagato direttamente) genera molte transazioni ridondanti in gruppi numerosi. L'algoritmo implementato calcola il saldo netto di ciascun utente e risolve il problema come un problema di flusso: abbina i creditori ai debitori in modo ottimale, riducendo al minimo il numero di bonifici necessari per pareggiare tutti i conti.

### Perche' Docker?
I Dockerfile e il `docker-compose.yml` sono stati aggiunti per garantire la riproducibilita' dell'ambiente di sviluppo: chiunque cloni il repository puo' avviare l'intera applicazione con un singolo comando (`docker compose up --build`), senza dover installare .NET SDK o Node.js localmente.

---

## Build e Avvio in Locale con Docker

### Prerequisiti
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (include Docker Compose)

### Avvio completo (frontend + backend)
```bash
git clone https://github.com/lorenzograssiUni/gestore-spese.git
cd gestore-spese
docker compose up --build
```

Dopo il build:

| Servizio | URL |
|---|---|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:5207](http://localhost:5207) |
| Swagger UI | [http://localhost:5207/swagger](http://localhost:5207/swagger) |

> **Nota:** Il database SQLite viene salvato in un volume Docker (`sqlite-data`) e persiste tra i riavvii del container.

### Comandi utili
```bash
# Avvio in background
docker compose up --build -d

# Fermare i container
docker compose down

# Fermare e rimuovere anche i volumi (reset database)
docker compose down -v

# Visualizzare i log
docker compose logs -f
```

### Struttura dei Dockerfile
| File | Descrizione |
|---|---|
| `gestione-spese/Dockerfile` | Multi-stage build: SDK .NET 10 per la compilazione, ASP.NET runtime per l'esecuzione |
| `frontend-gestione-spese/Dockerfile` | Multi-stage build: Node 20 per il build Vite, nginx per servire i file statici con SPA fallback |
| `docker-compose.yml` | Orchestrazione dei due servizi con healthcheck e volume per SQLite |

---

## Struttura del Repository

```
gestore-spese/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Pipeline CI/CD: build backend e frontend ad ogni push
│       └── docker.yml          # Pipeline CI/CD: build e validazione immagini Docker
├── docs/
│   └── architettura.md         # Diagrammi architettura, deploy e database (Mermaid)
├── gestione-spese/             # Backend ASP.NET Core
│   ├── Controllers/            # AuthController, GruppoController, SpesaController...
│   ├── Models/                 # Entita' del dominio (Utente, Gruppo, Spesa...)
│   ├── Data/                   # ApplicationDbContext (Entity Framework)
│   ├── Migrations/             # Migrazioni del database
│   ├── Dockerfile              # Docker image del backend
│   └── Program.cs              # Entry point e configurazione servizi
├── frontend-gestione-spese/    # Frontend React/Vite
│   ├── src/
│   │   ├── pages/              # HomePage, DettaglioGruppo, RiepilogoGruppo
│   │   ├── components/         # Navbar, ModalNuovoGruppo...
│   │   └── App.jsx             # Root component con logica login/registrazione
│   ├── Dockerfile              # Docker image del frontend (nginx)
│   └── package.json
└── docker-compose.yml          # Orchestrazione Docker completa
```

---

## Documentazione Aggiuntiva

| File | Contenuto |
|---|---|
| [docs/architettura.md](docs/architettura.md) | Diagrammi Mermaid: architettura generale, deploy e schema database ER |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Pipeline CI/CD: build automatica di backend e frontend ad ogni push |
| [.github/workflows/docker.yml](.github/workflows/docker.yml) | Pipeline CI/CD: build e validazione immagini Docker ad ogni push |

---

## API e Logica di Calcolo

Il backend espone un'architettura **RESTful** divisa per Controller (`GruppoController`, `SpesaController`, `UtenteController`, ecc.).
Tra le logiche di business piu' interessanti c'e' l'**algoritmo di pareggio dei debiti** (gestito dal `RiepilogoController`), che elabora i saldi positivi e negativi di ogni utente e restituisce le transazioni ottimali per saldare tutti i conti del gruppo con il minor numero di passaggi possibili.

---

## Autori
Sviluppato da **Mattia Negri**, **Lorenzo Grassi**, **Erica Paolasini**, **Simranjit Kaur** come progetto pratico di web development full-stack.
