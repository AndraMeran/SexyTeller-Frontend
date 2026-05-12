import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getArticles } from "../services/api"
import "./Categoria.css"
import ArticleImage from "../components/ArticleImage"
import "../components/ArticleImage.css"

// dati statici delle categorie — numero, nome, verbo, descrizione
const categorieInfo = {
    stories: {
        numero: "01",
        nome: "Stories",
        verbo: "Raccontare",
        descrizione: "Ci sono storie che si consumano in un istante. E altre che lasciano tracce. Qui trovi racconti, confessioni, biografie e narrazioni che seguono un filo preciso, dall’inizio alla fine"
    },
    decode: {
        numero: "02",
        nome: "Decode",
        verbo: "Spiegare",
        descrizione: "Ci sono storie che si consumano in un istante. E altre che lasciano tracce. Qui trovi racconti, confessioni, biografie e narrazioni che seguono un filo preciso, dall’inizio alla fine."
    },
    crossover: {
        numero: "03",
        nome: "Crossover",
        verbo: "Collegare",
        descrizione: "Esistono mondi che sembrano lontani. Poi si incontrano, si contaminano e cambiano significato. Qui la sessualità si intreccia con cultura, potere, sport, arte, internet e tutto ciò che influenza l’immaginario contemporaneo."
    },
    trends: {
        numero: "04",
        nome: "Trends",
        verbo: "Aggiornare",
        descrizione: "Il domani corre veloce. Tendenze, notizie e fenomeni nascono, si diffondono e spariscono nel tempo di uno scroll. Qui trovi ciò che sta attirando l’attenzione proprio adesso."
    },
    darkside: {
        numero: "05",
        nome: "Dark Side",
        verbo: "Approfondire",
        descrizione: "Non tutto viene raccontato apertamente. Qui si esplorano le parti più controverse, delicate e difficili da raccontare, senza semplificazioni e senza filtri."
    },
    voices: {
        numero: "06",
        nome: "Voices",
        verbo: "Dare voce",
        descrizione: "A volte la parte più interessante è ascoltare qualcun altro. Qui le storie passano attraverso dialoghi, interviste e testimonianze dirette.."
    },
}

// citazioni per ogni categoria — una viene scelta a random ad ogni caricamento della pagina
const citazioni = {
    stories: [
        { testo: "Scrivere è come fare l'amore. Non preoccuparti dell'orgasmo, preoccupati del processo.", autore: "Isabel Allende" },
        { testo: "Ogni storia cambia chi la racconta.", autore: "Elif Shafak" },
        { testo: "Ogni persona nasconde un romanzo.", autore: "Truman Capote" },
        { testo: "Raccontare è un modo per capire cosa ci è successo.", autore: "Joan Didion" },
    ],
    decode: [
        { testo: "Capire cambia tutto.", autore: "Susan Sontag" },
        { testo: "Ogni desiderio ha un linguaggio.", autore: "Jacques Lacan" },
        { testo: "Capire sé stessi è un lavoro senza fine.", autore: "Clarice Lispector" },
        { testo: "Ciò che non viene compreso ritorna sotto altre forme.", autore: "Françoise Dolto" },
    ],
    crossover: [
        { testo: "La cultura è mescolare tutto.", autore: "David Bowie" },
        { testo: "Nulla esiste da solo.", autore: "Marshall McLuhan" },
        { testo: "L'arte più interessante nasce dagli incroci.", autore: "Brian Eno" },
        { testo: "Tutto si collega, prima o poi.", autore: "Virginia Woolf" },
    ],
    trends: [
        { testo: "Il futuro arriva sempre prima del previsto.", autore: "Alvin Toffler" },
        { testo: "Le mode cambiano. I segnali restano.", autore: "Anna Wintour" },
        { testo: "Ogni generazione reinventa ciò che desidera.", autore: "Zygmunt Bauman" },
        { testo: "Le nuove idee spaventano sempre all'inizio.", autore: "Susan Sontag" },
    ],
    darkside: [
        { testo: "La vita interiore dell'uomo è un territorio oscuro.", autore: "Anaïs Nin" },
        { testo: "Dentro ogni desiderio esiste anche un'ombra.", autore: "Carl Jung" },
        { testo: "Le persone ignorano ciò che le mette a disagio.", autore: "David Lynch" },
        { testo: "L'occhio è atratto dalla luce, ma le ombre hanno più da dire.", autore: "Gregory Maguire" },
    ],
    voices: [
        { testo: "Ascoltare è una forma di rispetto.", autore: "Haruki Murakami" },
        { testo: "Ogni voce cambia la storia che racconta.", autore: "Toni Morrison" },
        { testo: "Le conversazioni sincere lasciano tracce.", autore: "Alain de Botton" },
        { testo: "Parlare davvero è più raro di quanto sembri.", autore: "Michel Foucault" },
    ],
}

// opzioni di ordinamento
const filtri = ["Recenti", "Più letti", "Redazione", "SexyTeller"]

// numero di articoli per pagina
const ARTICOLI_PER_PAGINA = 6

function Categoria() {
    const { nome } = useParams() // legge il parametro :nome dall'URL

    const [articles, setArticles] = useState([]) // tutti gli articoli della categoria
    const [filtered, setFiltered] = useState([]) // articoli dopo i filtri applicati
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroAttivo, setFiltroAttivo] = useState("Recenti") // filtro attivo — default "Recenti"
    const [paginaCorrente, setPaginaCorrente] = useState(1) // pagina corrente per la paginazione
    const [citazione, setCitazione] = useState(null) // citazione random della categoria corrente

    // info della categoria corrente
    const categoriaInfo = categorieInfo[nome] || {
        numero: "—",
        nome: nome,
        verbo: "",
        descrizione: ""
    }

    // carica gli articoli quando cambia la categoria nell'URL
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            setFiltroAttivo("Recenti") // resetta il filtro quando cambia categoria
            setPaginaCorrente(1) // resetta la pagina quando cambia categoria

            // sceglie una citazione random per la categoria corrente
            const pool = citazioni[nome] || []
            if (pool.length > 0) {
                const random = pool[Math.floor(Math.random() * pool.length)]
                setCitazione(random)
            }

            try {
                const data = await getArticles(nome)
                setArticles(data)
                setFiltered(data)
            } catch (err) {
                setError("Errore nel caricamento degli articoli")
            } finally {
                setLoading(false)
            }
        }
        fetchArticles()
    }, [nome]) // si riesegue ogni volta che cambia il nome della categoria nell'URL

    // applica il filtro selezionato ogni volta che cambia filtroAttivo o articles
    useEffect(() => {
        let result = [...articles]

        if (filtroAttivo === "Recenti") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (filtroAttivo === "Più letti") {
            result.sort((a, b) => b.likes.length - a.likes.length)
        } else if (filtroAttivo === "Redazione") {
            result = result.filter(a => a.isRedazione === true)
        } else if (filtroAttivo === "SexyTeller") {
            result = result.filter(a => a.isRedazione === false)
        }

        setFiltered(result)
        setPaginaCorrente(1)
    }, [filtroAttivo, articles])

    // calcola gli articoli da mostrare nella pagina corrente
    const totalePagine = Math.ceil(filtered.length / ARTICOLI_PER_PAGINA)
    const inizio = (paginaCorrente - 1) * ARTICOLI_PER_PAGINA
    const articoliPagina = filtered.slice(inizio, inizio + ARTICOLI_PER_PAGINA)

    // formatta la data in italiano
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    if (error) return <div className="categoria-error">{error}</div>

    return (
        <div className="categoria-page" data-categoria={nome}>

            {/* ── HEADER CATEGORIA ── */}
            <div className="categoria-header">
                <h1 className="categoria-nome">{categoriaInfo.nome}</h1>
                <span className="categoria-verbo">{categoriaInfo.verbo}</span>
                <p className="categoria-descrizione">{categoriaInfo.descrizione}</p>
            </div>

            {/* ── FILTRI + CONTATORE ── */}
            <div className="categoria-toolbar">
                <div className="categoria-filtri">
                    {filtri.map((f) => (
                        <button
                            key={f}
                            className={`filtro-btn ${filtroAttivo === f ? "active" : ""}`}
                            onClick={() => setFiltroAttivo(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <span className="categoria-count">
                    {filtered.length} contenuti
                </span>
            </div>

            {/* ── LAYOUT — feed + sidebar ── */}
            <div className="categoria-layout">

                {/* ── FEED ARTICOLI ── */}
                <div className="categoria-feed">
                    {loading ? (
                        <p className="categoria-loading">Caricamento...</p>
                    ) : articoliPagina.length === 0 ? (
                        <p className="categoria-empty">
                            Nessun articolo trovato con questo filtro.
                        </p>
                    ) : (
                        articoliPagina.map((article) => (
                            <Link
                                key={article._id}
                                to={`/articolo/${article._id}`}
                                className="categoria-card"
                            >
                                <ArticleImage
                                    src={article.coverImage}
                                    alt={article.title}
                                    isSensitive={article.isSensitive}
                                    className="categoria-card-img"
                                />

                                <div className="categoria-card-body">
                                    <div className="categoria-card-badges">
                                        <span className="badge-cat">{article.category}</span>
                                        {article.isRedazione && (
                                            <span className="badge-redazione">Redazione</span>
                                        )}
                                        {article.isFeatured && (
                                            <span className="badge-featured">In Evidenza</span>
                                        )}
                                        {article.isSensitive && (
                                            <span className="badge-sensitive">Sensibile</span>
                                        )}
                                    </div>

                                    <h2 className="categoria-card-title">{article.title}</h2>

                                    <div className="categoria-card-meta">
                                        <span
                                            className="categoria-card-author"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                window.location.href = `/profilo/${article.author?.handle}`
                                            }}
                                        >
                                            @{article.author?.handle}
                                        </span>
                                        <span>·</span>
                                        <span>{formatDate(article.createdAt)}</span>
                                        <span>·</span>
                                        <span>{article.readTime} min</span>
                                        <span>·</span>
                                        <span>♥ {article.likes?.length || 0}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}

                    {/* ── PAGINAZIONE ── */}
                    {totalePagine > 1 && (
                        <div className="paginazione">
                            <button
                                className="pag-btn"
                                onClick={() => setPaginaCorrente(p => p - 1)}
                                disabled={paginaCorrente === 1}
                            >
                                ←
                            </button>

                            {Array.from({ length: totalePagine }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    className={`pag-btn ${paginaCorrente === num ? "active" : ""}`}
                                    onClick={() => setPaginaCorrente(num)}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                className="pag-btn"
                                onClick={() => setPaginaCorrente(p => p + 1)}
                                disabled={paginaCorrente === totalePagine}
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>

                {/* ── SIDEBAR — citazione random ── */}
                <aside className="categoria-sidebar">
                    {citazione && (
                        <div className="sidebar-citazione">
                            <p className="citazione-testo">"{citazione.testo}"</p>
                            <div className="citazione-line" />
                            <p className="citazione-autore">— {citazione.autore}</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default Categoria