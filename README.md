# TEMPRA - Training Platform

Una piattaforma web moderna e scalabile per la gestione degli allenamenti, progettata per connettere Personal Trainer (PT) e Atleti sotto la supervisione amministrativa. Costruita con un focus sull'**Architettura del Software**, la sicurezza dei dati e la User Experience.

## Tech Stack

* **Backend:** Laravel (PHP)
* **Frontend:** React.js integrato tramite Inertia.js
* **Styling & UI:** Tailwind CSS, shadcn/ui, Ant Design
* **Database:** MySQL / PostgreSQL
* **Autorizzazioni:** Spatie Laravel Permission

## Principi Architetturali

Questa applicazione è stata sviluppata seguendo pattern architetturali solidi per garantire manutenibilità e scalabilità:

* **Single Source of Truth & Atomic State Transitions:** La gestione della scheda attiva dell'atleta è gestita a livello di Database (`is_active` boolean) tramite transazioni SQL (`DB::transaction`). Nessun calcolo in RAM: è il database a dettare lo stato, evitando sovrapposizioni.
* **Query Optimization & Eager Loading:** Risolto il problema N+1. Le query differenziano i payload in base al contesto (es. caricamento completo delle relazioni per le schede attive, DTO leggeri per lo storico).
* **Security & Policy-Driven Access:** Accesso ai dati blindato su due livelli: i ruoli/permessi Spatie definiscono *cosa* un utente può fare, mentre le Laravel Policies (`UserPolicy`, `PlanPolicy`) verificano la proprietà del dato (es. un PT può visualizzare solo le schede dei *propri* clienti).
* **DRY Frontend (Don't Repeat Yourself):** Logica di creazione e modifica delle schede unificata in un singolo "Smart Component" React, che adatta dinamicamente interfaccia, metodi HTTP e payload.
* **Idempotent DB Seeding:** Il `DatabaseSeeder` è compartimentato in metodi privati ed è progettato per essere idempotente, permettendo reset dell'ambiente rapidi e senza crash.

## Core Features

### Per l'Amministratore (Admin)
* **Gestione Utenze e Ruoli:** Creazione di nuovi utenti e assegnazione sicura dei ruoli (Admin, Personal Trainer, Cliente).
* **Gestione Catalogo Globale:** Controllo CRUD completo sul dizionario del sistema (Gruppi Muscolari ed Esercizi) utilizzato dai PT.
* **Supervisione Globale:** Accesso in lettura e scrittura a tutti i dati della piattaforma per assistenza e manutenzione.

### Per i Personal Trainer
* **Gestione Clienti:** Assegnazione atleti "liberi" (senza trainer) e dashboard di riepilogo.
* **Workout Builder:** Creazione di schede di allenamento altamente personalizzate, suddivise per settimane e giorni.
* **Gestione Parametri Avanzata:** Inserimento per ogni esercizio di Serie, Ripetizioni, Tempi di Recupero e **Carichi (Kg)** specifici.
* **Revisione Dinamica:** Modifica in tempo reale delle schede assegnate con aggiornamento istantaneo sul profilo dell'atleta.

### Per gli Atleti
* **Dashboard Interattiva:** Visualizzazione immediata della scheda attiva in corso, organizzata in pratiche tab settimanali e giornaliere.
* **Storico Allenamenti:** Accesso a un archivio paginato e navigabile di tutte le schede completate o passate.

## Prerequisiti

Assicurati di avere installato sul tuo ambiente locale:
* PHP >= 8.3
* Composer
* Node.js >= 18.x e npm
* Un server database (MySQL >= 8.0 o PostgreSQL)
