# Progetto Palestra: "Tempra" (Laravel Backend + React Frontend)

## Obiettivo del Progetto
Creare una semplice applicazione web per la gestione di schede di allenamento. 
Il sistema prevede tre tipologie di utenti:
1. **Admin:** Può inserire i vari esercizi nella tabella 'exercises'.
2. **Personal Trainer (PT):** Può vedere il catalogo degli esercizi e creare schede personalizzate per i clienti.
3. **Cliente:** Può visualizzare la propria scheda suddivisa per giorni.

---

## Stack Tecnologico
*   **Backend:** Laravel.
*   **Frontend:** React.
*   **Database:** Eloquent.
*   **Collaborazione:** GitHub.

---

## Struttura del Database e Permessi

Abbiamo 3 ruoli (`admin`, `pt`, `client`). Per gestire chi può vedere e fare cosa, useremo 4 tabelle principali con un collegamento extra nella tabella delle schede:

1.  `users`: id, name, role ('admin', 'pt', o 'client'), email, password.
2.  `exercises`: id, name, description, muscle_group.
3.  `plans` (Schede): id, user_id (id del cliente a cui è assegnata), pt_id (id del PT che l'ha creata), name (es. "Massa Gennaio"), duration.
4.  `plan_exercises` (Esercizi nella scheda): id, plan_id, exercise_id, day_of_week, sets, reps.

### Logica dei Permessi (da implementare nel Backend)

Il database da solo non blocca gli utenti; la sicurezza va gestita nei *Controllers* di Laravel controllando il `role` dell'utente loggato.

*   **L'Admin (`role === 'admin'`):**
    *   Ha il controllo totale sulla tabella `exercises` (può creare, modificare, eliminare gli esercizi).
*   **Il Personal Trainer (`role === 'pt'`):**
    *   Sulla tabella `exercises`: può fare solo chiamate `GET` (lettura) per vedere il catalogo creato dall'admin.
    *   Sulla tabella `plans`: può creare nuove schede inserendo il proprio ID nel campo `pt_id`.
    *   Quando richiede la lista delle schede, il backend gli restituirà **solo** quelle dove `pt_id` corrisponde al suo ID.
*   **Il Cliente (`role === 'client'`):**
    *   Sulla tabella `plans`: non può creare nulla.
    *   Quando richiede la lista delle schede, il backend gli restituirà **solo** quelle dove `user_id` corrisponde al suo ID. Non può modificarle.
---

### Frontend

Il login è uguale per tutti. 


## 1. Il Flusso del Cliente

L'utente normale ha l'esperienza più pulita e semplice. L'app per lui è una sorta di "bacheca" personale dove il suo allenatore gli carica i compiti.

### Cosa vede (Interfaccia React):
* **Dashboard (Home):** Un riepilogo del suo stato. Vede chi è il suo Personal Trainer attuale (se ne ha uno) e il prossimo allenamento in programma.
* **Le mie Schede:** Una pagina (Read) con la lista delle schede create *esclusivamente* per lui dal suo PT.
* **Dettaglio Scheda:** Cliccando su una scheda, vede la lista degli esercizi, serie, ripetizioni e recuperi.
* **Catalogo Esercizi (Opzionale):** Una semplice lista in sola lettura per consultare la descrizione degli esercizi.

### Cosa può fare (Azioni):
* **Sola lettura:** Può navigare e consultare i propri dati. Non c'è nessun bottone "Crea" o "Elimina" per lui.
* **Richiedi Modifica / Invia Notifica:** Nel dettaglio di una scheda, può esserci un piccolo form React (un campo di testo) con un bottone "Invia feedback al Trainer". Questo invia una notifica al backend (es. *"Ho sentito dolore alla spalla durante la panca piana, possiamo cambiare?"*).

---

## 2. Il Flusso del Personal Trainer
Il PT è l'utente che userà di più l'applicazione per la creazione di contenuti. Il suo flusso è incentrato sulla gestione dei clienti.

### Cosa vede (Interfaccia React):
* **Dashboard Trainer:** Statistiche rapide: *"Hai 5 clienti attivi"*, *"Ci sono 3 nuovi utenti in cerca di trainer"*, *"Hai 2 notifiche non lette dai tuoi clienti"*.
* **I Miei Clienti:** Una tabella che elenca solo gli utenti che hanno il `trainer_id` uguale all'ID del PT loggato. Cliccando su un cliente, entra in una vista dedicata a lui.
* **Bacheca Nuovi Clienti:** La lista (di cui parlavamo prima) degli utenti normali senza PT (`trainer_id === null`).
* **Gestione Schede:** La pagina dove crea materialmente gli allenamenti.

### Cosa può fare (Azioni):
* **Prendi in carico (Associazione):** Dalla "Bacheca Nuovi Clienti", clicca "Associa a me". Il backend Laravel farà un update: `User::find($id)->update(['trainer_id' => Auth::id()])`.
* **CRUD Completo sulle Schede dei SUOI clienti:**
    * *Create:* Crea una nuova scheda assegnandola a uno dei suoi clienti tramite un menu a tendina.
    * *Read/Update/Delete:* Modifica o elimina le schede, ma *solo* quelle associate ai suoi clienti (fondamentale usare le *Policies* di Laravel qui per impedire che modifichi le schede di un altro PT).
* **Lettura Esercizi:** Può scorrere il dizionario degli esercizi per comporre le schede, ma non può aggiungerne di nuovi (questo garantisce che il database degli esercizi rimanga pulito e standardizzato).

---

## 3. Il Flusso dell'Admin (Il Supervisore)

L'Admin ha i "superpoteri". La sua interfaccia non è pensata per l'uso quotidiano in palestra, ma per la gestione del sistema (il classico pannello di Backoffice).

### Cosa vede (Interfaccia React):
* **Dashboard Globale:** Metriche di sistema: numero totale di utenti, rapporto utenti/trainer, schede create questo mese nel sistema.
* **Gestione Utenti (User Management):** Una grande tabella che elenca *tutti* gli iscritti al sistema.
* **Gestione Esercizi:** La pagina dedicata al dizionario degli esercizi.
* **Visione Globale Schede:** Può vedere l'elenco di tutte le schede create da chiunque.

### Cosa può fare (Azioni):
* **Cambio Ruoli (Cruciale):** Dalla tabella Utenti, tramite un menu a tendina, può trasformare un "Utente" appena registrato in "Personal Trainer", oppure nominare un altro "Admin".
* **CRUD Completo Esercizi:** È l'unico che può creare un nuovo esercizio, modificarne il nome (es. correggere un errore di battitura) o eliminarlo.
* **Moderazione Totale (CRUD Globale):** Può forzare la cancellazione di una scheda (magari creata per errore o con contenuti non appropriati) o disconnettere un PT da un utente in caso di problemi.

---

# 🏋️‍♂️ Progetto FitTrack: Roadmap di Sviluppo (10 Giorni)

Questo documento descrive la strategia di sviluppo per l'applicazione **FitTrack**, un gestionale per palestre basato su **Laravel** (Backend) e **React** (Frontend).

---

## 👥 Suddivisione Team
*   **Sviluppatore A (Backend):** Gestione Database, API REST, Autenticazione e Logica dei Ruoli.
*   **Sviluppatore B (Frontend):** Interfaccia Utente (React), Integrazione API, Stato del Login e Rotte Protette.

---

## 📅 Roadmap Operativa

### Fase 1: Setup & Identità (Giorno 1-2)
*   **Insieme:** Inizializzazione Repository GitHub e installazione ambienti locali.
*   **Sviluppatore A:** 
    *   Installazione Laravel.
    *   Creazione Migration per le tabelle: `users`, `exercises`, `plans`, `plan_exercises`.
    *   Setup di **Laravel Breeze (API)** per gestire il login velocemente.
*   **Sviluppatore B:** 
    *   Inizializzazione React (Vite).
    *   Configurazione `react-router-dom` per la navigazione.
    *   Creazione delle pagine "vuote" per i 3 ruoli (DashboardAdmin, DashboardPT, DashboardClient).

### Fase 2: Gestione Esercizi - Flusso Admin (Giorno 3-4)
*   **Sviluppatore A:** 
    *   Creazione Controller `ExerciseController` con CRUD (Create, Read, Update, Delete).
    *   Protezione delle rotte: solo l'utente con `role === 'admin'` può fare POST/PUT/DELETE.
*   **Sviluppatore B:** 
    *   Creazione pagina "Catalogo Esercizi".
    *   Form per l'Admin per aggiungere nuovi esercizi al database.
    *   Integrazione chiamata `GET` per visualizzare la lista globale degli esercizi.

### Fase 3: Gestione Utenti e Relazioni (Giorno 5)
*   **Sviluppatore A:** 
    *   Aggiunta del campo `trainer_id` nella tabella `users` (opzionale, per legare cliente-PT).
    *   Creazione API per l'Admin per vedere tutti gli utenti e cambiare il loro ruolo.
*   **Sviluppatore B:** 
    *   Interfaccia per l'Admin per gestire gli utenti (es. trasformare un utente semplice in PT).

### Fase 4: Creazione Schede - Flusso PT (Giorno 6-7)
*   **Sviluppatore A:** 
    *   Creazione Controller `PlanController`.
    *   Logica di salvataggio: una scheda deve ricevere un titolo, un `user_id` (cliente) e un array di esercizi con serie e ripetizioni.
*   **Sviluppatore B:** 
    *   Pagina "Crea Scheda" per il PT.
    *   Menu a tendina per selezionare il Cliente.
    *   Sistema per aggiungere più esercizi a una singola scheda prima di inviare i dati.

### Fase 5: Visualizzazione - Flusso Cliente (Giorno 8)
*   **Sviluppatore A:** 
    *   Filtro API: `GET /api/plans` deve restituire solo le schede appartenenti all'utente loggato.
*   **Sviluppatore B:** 
    *   Pagina "I Miei Allenamenti" per il cliente.
    *   Vista di dettaglio per vedere gli esercizi del giorno specifico.

### Fase 6: Rifiniture e Sicurezza (Giorno 9)
*   **Sviluppatore A:** Controllo finale sui permessi (un PT non deve poter cancellare esercizi o vedere schede di altri PT).
*   **Sviluppatore B:** Miglioramento della UX: messaggi di errore (es. "Login fallito") e stati di caricamento.
*   **Insieme:** Applicazione di uno stile CSS coerente (consigliato: **Tailwind CSS**).

### Fase 7: Test & Bug Fixing (Giorno 10)
*   Simulazione completa dei tre flussi:
    1.  L'Admin crea l'esercizio "Panca Piana".
    2.  Il PT crea una scheda per "Mario" usando "Panca Piana".
    3.  "Mario" accede e vede la sua scheda.

---

Per semplificazione gli utenti e i personal tranier sono inseriti di default da parte degli sviluppatori, non ci sarà quindi una pagina di creazione utente.

---