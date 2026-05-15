# SexyTeller — Frontend

>**Repository Backend:** https://github.com/AndraMeran/SexyTeller-Backend
> 🌐 **Demo live:** [link Vercel da aggiungere]

---

## Descrizione

**SexyTeller** è una piattaforma editoriale dedicata alla cultura della sessualità — un luogo dove giornalisti, scrittori e voci della community possono raccontare, analizzare e approfondire temi legati al sesso, al desiderio e all'identità, con rigore culturale e senza tabù.

Il progetto nasce come capstone finale del corso di sviluppo web e rappresenta un'applicazione completa con autenticazione, pannello amministrativo, editor di contenuti e sistema di ricerca globale.

---

## Stack MERN

| Tecnologia | Versione | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 6 | Build tool |
| React Router | v7 | Routing SPA |
| Bootstrap 5 | 5 | Layout base |
| Tiptap | 2 | Editor articoli WYSIWYG |
| Cloudinary | — | Upload e gestione immagini |
| Google Fonts | — | Cormorant Garamond + Inter |
| Bootstrap Icons | — | Iconografia |

---

## Funzionalità Principali

### Autenticazione
- Registrazione con verifica età (+18)
- Login con JWT
- Autenticazione Google OAuth
- Token JWT con avatar e cover inclusi

### Utenti
- Profilo pubblico con cover e avatar
- Feed articoli personali filtrabili per categoria
- Impostazioni account — avatar, cover, bio, linea editoriale
- Badge dinamici (Nuovo, Attivo, In Evidenza)

### Articoli
- Editor WYSIWYG con Tiptap
  - Grassetto, corsivo, sottolineato
  - Grandezza testo (Normale, Medio, Grande)
  - Tipo di carattere (Georgia, Inter, Cormorant, Courier, Verdana, Roboto Serif)
  - Allineamento testo (sinistra, centro, destra, giustificato)
  - Citazioni e liste
  - Upload immagini con posizionamento sinistra/centro/destra
  - Toolbar sticky durante la scrittura
- Box descrizione categoria con guida editoriale
- Anteprima articolo prima della pubblicazione
- Modifica articoli pubblicati
- Contenuti sensibili con schermata di verifica età (+18)
- Sistema di like
- Condivisione articolo via clipboard

### Commenti
- Commenti sugli articoli
- Like ai commenti
- Eliminazione commenti (autore o redazione)

### Ricerca
- Ricerca globale per articoli e utenti dalla navbar
- Pagina `/cerca` con risultati divisi per articoli e utenti
- Evidenziazione della parola cercata nei risultati

### Pannello Admin (solo Redazione)
- Gestione utenti — blocca/sblocca/elimina
- Gestione articoli — metti/togli in evidenza
- Gestione commenti — eliminazione
- Statistiche rapide

---

## Design System

### Palette Colori
| Nome | Hex | Uso |
|---|---|---|
| Midnight | `#0C0A14` | Sfondo body, navbar |
| Card | `#14111F` | Sfondo card |
| Teal | `#00D4B8` | CTA, link attivi, accenti |
| Coral | `#D95D82` | Like, notifiche, errori |
| White | `#F5F5F5` | Testo principale |
| Zinc | `#A1A1AA` | Testo secondario |
| Bordi | `rgba(255,255,255,0.08)` | Bordi sottili |

### Typography
- **Cormorant Garamond** — titoli e citazioni (serif elegante)
- **Inter** — testi, label, UI (sans-serif moderno)
- **Georgia** — corpo articoli (serif leggibile)

---

## Struttura del Progetto

```
src/
├── components/
│   ├── MyNavbar.jsx
│   ├── MyFooter.jsx
│   ├── ArticleImage.jsx
│   ├── EditorToolbar.jsx
│   └── ScrollToTop.jsx
├── context/
│   ├── AuthContext.jsx
│   └── useAuth.js
├── pages/
│   ├── Homepage.jsx
│   ├── Categoria.jsx
│   ├── ArticoloSingolo.jsx
│   ├── ProfiloUtente.jsx
│   ├── Editor.jsx
│   ├── EditorModifica.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Manifesto.jsx
│   ├── Impostazioni.jsx
│   ├── Admin.jsx
│   └── Cerca.jsx
└── services/
    └── api.js
```

---

## Installazione e Avvio

### Prerequisiti
- Node.js >= 18
- npm >= 9

### Setup

```bash
# Clona il repository
git clone https://github.com/AndraMeran/SexyTeller-Frontend.git

# Entra nella cartella
cd SexyTeller-Frontend

# Installa le dipendenze
npm install

# Avvia in sviluppo
npm run dev
```

### Variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
VITE_API_URL=http://localhost:5000
```

---

## Script disponibili

```bash
npm run dev      # Avvia server di sviluppo
npm run build    # Build per produzione
npm run preview  # Anteprima build produzione
npm run lint     # Controllo ESLint
```

---

## Deploy

- **Frontend** → Vercel (deploy automatico ad ogni push su main)
- **Backend** → Render (deploy automatico ad ogni push su main)
- **Database** → MongoDB Atlas
- **Immagini** → Cloudinary

🌐 Frontend: [da aggiungere]
🔧 Backend: [da aggiungere]

---

## Categorie Editoriali

| Categoria | Verbo | Descrizione |
|---|---|---|
| Stories | Raccontare | Storie narrative con inizio, sviluppo e fine |
| Decode | Spiegare | Analisi e approfondimenti culturali |
| Crossover | Collegare | Sessualità e cultura pop, cinema, musica |
| Trends | Aggiornare | Tendenze e fenomeni attuali |
| Dark Side | Approfondire | Temi complessi e controversi |
| Voices | Dare voce | Interviste, dialoghi, testimonianze |

---

## Autore

**Andra Meran**
Progetto capstone — Corso Web Developer

---

## Note

- Il sito è riservato agli utenti maggiori di 18 anni
- I contenuti sensibili sono protetti da una schermata di verifica età
- Il pannello admin è accessibile solo agli utenti con ruolo `isRedazione: true`
- Il routing SPA è gestito tramite `vercel.json` per evitare errori 404 su refresh

