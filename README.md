# 💲 Split Mate - Gestore Spese di Gruppo

Una Web Application full-stack per la gestione e la divisione delle spese in gruppo, ideale per coinquilini, viaggi e cene tra amici.

---

## 🚀 Demo Live

Il frontend è disponibile online su Vercel:
👉 [gestore-spese.vercel.app](https://gestore-spese.vercel.app)

---

## ✅ Funzionalità Principali

* **Login / Registrazione:** Accesso tramite email. Se l'utente non esiste viene registrato automaticamente, altrimenti viene riconosciuto e loggato.
* **Modifica Nome Utente:** Dalla Navbar è possibile cliccare sul proprio nome per modificarlo in tempo reale, senza bisogno di ricaricare la pagina.
* **Gestione Gruppi:** Creazione, visualizzazione ed eliminazione di gruppi di spesa.
* **Codice Invito:** Ogni gruppo ha un codice univoco generato automaticamente. Chiunque può unirsi a un gruppo inserendo il codice invito dalla schermata principale.
* **Gestione Membri:** Aggiunta di utenti fittizi (bot) all'interno di un gruppo specifico e rimozione degli stessi (solo se non hanno spese registrate).
* **Gestione Spese:** Inserimento di nuove spese specificando chi ha pagato e l'importo. Possibilità di eliminare singole spese.
* **Divisione Flessibile:** Possibilità di dividere la spesa equamente tra tutti i membri o solo tra alcuni membri selezionati.
* **Calcolo Bilanci in Tempo Reale:** L'algoritmo calcola istantaneamente chi deve rimborsare chi (e quanto) per pareggiare i conti del gruppo, minimizzando il numero di transazioni.
* **Eliminazione a cascata:** Cancellazione sicura delle singole spese, dei membri e dei gruppi.

---

## 🛠️ Stack Tecnologico

Il progetto è strutturato in due parti (Frontend e Backend) all'interno di un unico monorepo:

### Backend (C# / .NET)
* **Framework:** ASP.NET Core Web API
* **ORM:** Entity Framework Core
* **Database:** SQLite (scelto per portabilità e semplicità di test in locale)
* **Architettura:** RESTful API

### Frontend (React / Vite)
* **Libreria Core:** React
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM

---

## 💻 Come avviare il progetto in locale

Segui questi passaggi per scaricare e far girare l'applicazione sul tuo computer.

### Prerequisiti
* [Node.js e npm](https://nodejs.org/) installati sul PC.
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (o versioni compatibili) installato sul PC.
* Un IDE come Visual Studio o Visual Studio Code.

### Passaggio 1: Clonare la Repository
```bash
git clone https://github.com/lorenzograssiUni/gestore-spese.git
cd gestore-spese

### Passaggio 2: Avviare il Backend (C# / .NET)
Il backend utilizza SQLite. Le tabelle del database verranno generate automaticamente al primo avvio grazie alla migrazione configurata in fase di startup.

1. Apri un terminale e spostati nella cartella del backend:
```bash
cd gestione-spese
```
2. Avvia l'API:
```bash
dotnet run
```
L'API sarà in ascolto all'indirizzo `http://localhost:5207/api\`.
Navigando su `/swagger` sarà possibile visualizzare l'interfaccia interattiva e la documentazione degli endpoint.

### Passaggio 3: Configurare le variabili d'ambiente del Frontend
Nella cartella `frontend-gestione-spese`, crea un file `.env` con il seguente contenuto:
```
VITE_API_URL=http://localhost:5207/api
```

### Passaggio 4: Avviare il Frontend (React)
1. Apri un **nuovo** terminale e spostati nella cartella del frontend:
```bash
cd frontend-gestione-spese
```
2. Installa le dipendenze npm:
```bash
npm install
```
3. Avvia il server di sviluppo:
```bash
npm run dev
```

### Passaggio 5: Utilizzare l'App
Apri il tuo browser preferito e vai all'indirizzo indicato dal terminale di Vite (solitamente **`http://localhost:5173\`\*\*).

---

## 🗄️ Struttura del Database e del Progetto

Il database relazionale contiene le seguenti entità principali:
* `Gruppi`: Contiene le informazioni generali dei gruppi (Nome, Descrizione, CodiceInvito).
* `Utenti`: Partecipanti associati a uno specifico gruppo (Relazione N:M con Gruppi).
* `Spese`: Registra l'importo totale, la descrizione e l'ID di chi ha pagato (`ChiPaga_ID`) (Relazione 1:N con Gruppi).
* `DivisioniSpesa`: Tabella di appoggio che registra la quota esatta dovuta da ogni specifico utente per ogni specifica spesa (Relazione 1:N con Spese e Utenti). L'eliminazione avviene a cascata.

### Organizzazione delle Cartelle
- `/gestione-spese`: Contiene tutta la logica di Backend (Controllers, Models, Migrations).
- `/frontend-gestione-spese`: Contiene l'interfaccia utente in React (Components, Pages, Assets).

---

## 📡 API e Logica di Calcolo

Il backend espone un'architettura **RESTful** divisa per Controller (`GruppoController`, `SpesaController`, `UtenteController`, ecc.).
Tra le logiche di business più interessanti c'è l'**algoritmo di pareggio dei debiti** (gestito dal `RiepilogoController`), che elabora i saldi positivi e negativi di ogni utente e restituisce le transazioni ottimali per saldare tutti i conti del gruppo con il minor numero di passaggi possibili.

---

## 🗺️ Roadmap

- 
Storico delle transazioni e dei pagamenti completati.
- 
Notifiche per i rimborsi pendenti.
- 
Ottimizzazione del design pattern (es. integrazione del *Visitor pattern* per alcune logiche di esportazione dati).
- 
App mobile (React Native).

---

## 👥 Autori
Sviluppato da **Mattia Negri**, **Lorenzo Grassi**, **Erica Paolasini**, **Simranjit Kaur** come progetto pratico di web development full-stack.