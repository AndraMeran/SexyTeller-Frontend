# SexyTeller — Frontend

> 🔗 **Repository Backend:** [link da aggiungere]
> 🌐 **Demo live:** [link Vercel da aggiungere]

---

## Descrizione

**SexyTeller** è una piattaforma editoriale dedicata alla cultura della sessualità — un luogo dove giornalisti, scrittori e voci della community possono raccontare, analizzare e approfondire temi legati al sesso, al desiderio e all'identità, con rigore culturale e senza tabù.

Il progetto nasce come capstone finale del corso di sviluppo web full-stack e rappresenta un'applicazione completa con autenticazione, pannello amministrativo, editor di contenuti e sistema di ricerca.

---

## Stack Tecnologico

| Tecnologia | Versione | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 6 | Build tool |
| React Router | v7 | Routing |
| Bootstrap 5 | 5 | Layout base |
| Tiptap | 2 | Editor articoli WYSIWYG |
| React Markdown | — | Rendering contenuti |
| Cloudinary | — | Upload e gestione immagini |

---

## Funzionalità Principali

### Utenti
- Registrazione e login con JWT
- Autenticazione Google OAuth
- Profilo pubblico con feed articoli personali
- Impostazioni account (avatar, cover, bio)

### Articoli
- Editor WYSIWYG con Tiptap — grassetto, corsivo, titoli, citazioni, liste, allineamento testo
- Upload immagini nel testo con posizionamento sinistra/centro/destra
- Anteprima articolo prima della pubblicazione
- Modifica articoli pubblicati
- Contenuti sensibili con schermata di verifica età (+18)
- Sistema di like

### Commenti
- Commenti sugli articoli
- Like ai commenti
- Eliminazione commenti (autore o redazione)

### Ricerca
- Ricerca globale per articoli e utenti
- Risultati con evidenziazione della parola cercata

### Pannello Admin (solo Redazione)
- Gestione utenti — blocca/sblocca/elimina
- Gestione articoli — metti/togli in evidenza
- Gestione commenti — eliminazione
- Statistiche rapide

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
git clone https://github.com/tuoaccount/sexyteller-frontend.git

# Entra nella cartella
cd sexyteller-frontend

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

In produzione sostituisci con l'URL del backend su Render.

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

Il frontend è deployato su **Vercel**.

🌐 Link: [da aggiungere dopo il deploy]

---

## Autore

**Andra Meran**
Progetto capstone — Corso Full Stack Web Development

---

## Note

- I contenuti sensibili sono protetti da una schermata di verifica età
- Il pannello admin è accessibile solo agli utenti con ruolo `isRedazione: true`
