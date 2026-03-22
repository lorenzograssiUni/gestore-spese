# 💲 Split Mate - Gestore Spese di Gruppo

Una Web Application full-stack per la gestione e la divisione delle spese in gruppo, ideale per coinquilini, viaggi e cene tra amici.

---

## 🚀 Demo Live

| Componente | URL | Hosting |
|---|---|---|
| 🖥️ Frontend | [gestore-spese-xi.vercel.app](https://gestore-spese-xi.vercel.app) | Vercel |
| ⚙️ Backend API | [gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net](https://gestione-spese-hbhga0crf6hsagdn.swedencentral-01.azurewebsites.net) | Azure App Service |

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

### Backend (C# / .NET) — Deploy su Azure App Service
* **Framework:** ASP.NET Core Web API
* **Runtime:** .NET 10.0
* **ORM:** Entity Framework Core
* **Database:** SQLite
* **Architettura:** RESTful API
* **Hosting:** Azure App Service (Free F1, Sweden Central)

### Frontend (React / Vite) — Deploy su Vercel
* **Libreria Core:** React
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **Hosting:** Vercel

---

## 🌐 Utilizzo dell'App

L'applicazione è già deployata e pronta all'uso, senza necessità di installare nulla.

1. Apri il browser e vai su 👉 [gestore-spese-xi.vercel.app](https://gestore-spese-xi.vercel.app)
2. Inserisci la tua email per accedere o registrarti automaticamente.
3. Crea un nuovo gruppo oppure unisciti a uno esistente tramite codice invito.
4. Aggiungi spese, seleziona chi ha pagato e scegli come dividere il costo.
5. Consulta il riepilogo per sapere chi deve rimborsare chi.

> ℹ️ Il frontend comunica automaticamente con il backend ospitato su Azure. Non è necessaria alcuna configurazione aggiuntiva.

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

* Storico delle transazioni e dei pagamenti completati.
* Notifiche per i rimborsi pendenti.
* Ottimizzazione del design pattern (es. integrazione del *Visitor pattern* per alcune logiche di esportazione dati).
* App mobile (React Native).

---

## 👥 Autori
Sviluppato da **Mattia Negri**, **Lorenzo Grassi**, **Erica Paolasini**, **Simranjit Kaur** come progetto pratico di web development full-stack.
