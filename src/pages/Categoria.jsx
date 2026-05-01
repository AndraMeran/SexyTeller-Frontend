import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getArticles } from "../services/api"
import "./Categoria.css"

// dati statici delle categorie — numero, nome, verbo, descrizione
const categorieInfo = {
    stories: {
        numero: "01",
        nome: "Stories",
        verbo: "Racconta",
        descrizione: "Biografie, ascese e cadute, dietro le quinte. Come un documentario narrato."
    },
    decode: {
        numero: "02",
        nome: "Decode",
        verbo: "Spiega",
        descrizione: "Analisi, spiegazioni e approfondimenti culturali sulla sessualità."
    },
    crossover: {
        numero: "03",
        nome: "Crossover",
        verbo: "Collega",
        descrizione: "Quando il sesso incontra cinema, musica, arte e cultura pop."
    },
    trends: {
        numero: "04",
        nome: "Trends",
        verbo: "Aggiorna",
        descrizione: "Temi caldi, nuove prospettive e quello che sta succedendo ora."
    },
    darkside: {
        numero: "05",
        nome: "Dark Side",
        verbo: "Approfondisce",
        descrizione: "Quello che nessuno dice. I lati nascosti e complessi della sessualità."
    },
    voices: {
        numero: "06",
        nome: "Voices",
        verbo: "Dà voce",
        descrizione: "Le voci della nostra community. Storie personali e punti di vista."
    },
}

// opzioni di ordinamento
const filtri = ["Recenti", "Più letti", "Redazione", "SexyTeller"]

// numero di articoli per pagina
const ARTICOLI_PER_PAGINA = 6

function Categoria() {
    const { nome } = useParams() // legge il parametro :nome dall'URL — es. /categoria/stories → nome = "stories"

    const [articles, setArticles] = useState([]) // tutti gli articoli della categoria
    const [filtered, setFiltered] = useState([]) // articoli dopo i filtri applicati
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroAttivo, setFiltroAttivo] = useState("Recenti") // filtro attivo — default "Recenti"
    const [paginaCorrente, setPaginaCorrente] = useState(1) // pagina corrente per la paginazione

    // info della categoria corrente — es. { numero: "01", nome: "Stories", ... }
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
            try {
                const data = await getArticles(nome) // passa il nome come filtro categoria
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
        let result = [...articles] // copia l'array per non modificare l'originale

        if (filtroAttivo === "Recenti") {
            // ordina per data decrescente — più recenti prima
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (filtroAttivo === "Più letti") {
            // ordina per numero di like decrescente
            result.sort((a, b) => b.likes.length - a.likes.length)
        } else if (filtroAttivo === "Redazione") {
            // mostra solo articoli della redazione
            result = result.filter(a => a.isRedazione === true)
        } else if (filtroAttivo === "SexyTeller") {
            // mostra solo articoli degli utenti
            result = result.filter(a => a.isRedazione === false)
        }

        setFiltered(result)
        setPaginaCorrente(1) // resetta la pagina quando cambia filtro
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
        <div className="categoria-page">

            {/* ── HEADER CATEGORIA ── */}
            <div className="categoria-header">
                <span className="categoria-numero">{categoriaInfo.numero}</span>
                <h1 className="categoria-nome">{categoriaInfo.nome}</h1>
                <span className="categoria-verbo">{categoriaInfo.verbo}</span>
                <div className="categoria-line" />
                <p className="categoria-descrizione">{categoriaInfo.descrizione}</p>
            </div>

            {/* ── FILTRI + CONTATORE ── */}
            <div className="categoria-toolbar">
                <div className="categoria-filtri">
                    {/* bottone per ogni filtro — classe active sul filtro selezionato */}
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
                {/* contatore articoli totali */}
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
                                {/* immagine copertina — mostrata solo se esiste */}
                                {article.coverImage && (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="categoria-card-img"
                                    />
                                )}

                                <div className="categoria-card-body">
                                    {/* badge categoria + badge SENSIBILE + badge IN EVIDENZA */}
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

                                    {/* meta — autore, data, tempo lettura, like */}
                                    <div className="categoria-card-meta">
                                        <Link
                                            to={`/profilo/${article.author?.handle}`}
                                            className="categoria-card-author"
                                            onClick={(e) => e.stopPropagation()} // evita che il click sull'autore apra l'articolo
                                        >
                                            @{article.author?.handle}
                                        </Link>
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
                            {/* pulsante precedente */}
                            <button
                                className="pag-btn"
                                onClick={() => setPaginaCorrente(p => p - 1)}
                                disabled={paginaCorrente === 1}
                            >
                                ←
                            </button>

                            {/* numeri di pagina */}
                            {Array.from({ length: totalePagine }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    className={`pag-btn ${paginaCorrente === num ? "active" : ""}`}
                                    onClick={() => setPaginaCorrente(num)}
                                >
                                    {num}
                                </button>
                            ))}

                            {/* pulsante successivo */}
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

                {/* ── SIDEBAR — tutte le categorie ── */}
                <aside className="categoria-sidebar">
                    <p className="sidebar-label">Tutte le categorie</p>
                    {Object.entries(categorieInfo).map(([slug, info]) => (
                        <Link
                            key={slug}
                            to={`/categoria/${slug}`}
                            className={`sidebar-cat-link ${nome === slug ? "active" : ""}`}
                        >
                            <span className="sidebar-cat-nome">{info.nome}</span>
                            <span className="sidebar-cat-verbo">{info.verbo}</span>
                        </Link>
                    ))}
                </aside>
            </div>
        </div>
    )
}

export default Categoria
