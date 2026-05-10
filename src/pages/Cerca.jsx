import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { searchGlobal } from "../services/api"
import "./Cerca.css"

function Cerca() {
    const [searchParams] = useSearchParams() // legge ?q= dall'URL
    const query = searchParams.get("q") || ""

    const [risultati, setRisultati] = useState({ articles: [], users: [] })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!query.trim()) return

        const fetchRisultati = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await searchGlobal(query)
                setRisultati(data)
            } catch (err) {
                setError("Errore nella ricerca")
            } finally {
                setLoading(false)
            }
        }
        fetchRisultati()
    }, [query]) // si riesegue ogni volta che cambia la parola cercata

    // evidenzia la parola cercata nel testo
    const highlight = (text) => {
        if (!query) return text
        const regex = new RegExp(`(${query})`, "gi")
        return text.split(regex).map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="cerca-highlight">{part}</mark>
                : part
        )
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    const totale = risultati.articles?.length + risultati.users?.length

    return (
        <div className="cerca-page">
            <div className="cerca-header">
                <h1 className="cerca-titolo">
                    {query ? (
                        <>Risultati per "<span className="cerca-query">{query}</span>"</>
                    ) : (
                        "Cerca su SexyTeller"
                    )}
                </h1>
                {!loading && query && (
                    <p className="cerca-count">{totale} risultati trovati</p>
                )}
            </div>

            {loading && <p className="cerca-loading">Ricerca in corso...</p>}
            {error && <p className="cerca-error">{error}</p>}

            {!loading && !error && query && (
                <div className="cerca-risultati">

                    {/* ── ARTICOLI ── */}
                    {risultati.articles?.length > 0 && (
                        <section className="cerca-section">
                            <p className="cerca-section-label">
                                Articoli — {risultati.articles.length} risultati
                            </p>
                            <div className="cerca-articles">
                                {risultati.articles.map((article) => (
                                    <Link
                                        key={article._id}
                                        to={`/articolo/${article._id}`}
                                        className="cerca-article-card"
                                    >
                                        {article.coverImage && (
                                            <img
                                                src={article.coverImage}
                                                alt={article.title}
                                                className="cerca-article-thumb"
                                            />
                                        )}
                                        <div className="cerca-article-info">
                                            <span className="cerca-article-cat">
                                                {article.category}
                                            </span>
                                            <h3 className="cerca-article-title">
                                                {highlight(article.title)}
                                            </h3>
                                            <p className="cerca-article-meta">
                                                di @{article.author?.handle} · {formatDate(article.createdAt)} · {article.readTime} min
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── UTENTI ── */}
                    {risultati.users?.length > 0 && (
                        <section className="cerca-section">
                            <p className="cerca-section-label">
                                Utenti — {risultati.users.length} risultati
                            </p>
                            <div className="cerca-users">
                                {risultati.users.map((user) => (
                                    <Link
                                        key={user._id}
                                        to={`/profilo/${user.handle}`}
                                        className="cerca-user-card"
                                    >
                                        <div className="cerca-user-avatar">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                            ) : (
                                                <span>{user.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="cerca-user-name">
                                                {highlight(user.name)}
                                            </p>
                                            <p className="cerca-user-handle">
                                                @{highlight(user.handle)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── NESSUN RISULTATO ── */}
                    {totale === 0 && (
                        <div className="cerca-vuoto">
                            <p>Nessun risultato per "<strong>{query}</strong>"</p>
                            <p>Prova con un altro termine o esplora le categorie.</p>
                            <Link to="/" className="cerca-home-link">
                                ← Torna alla homepage
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Cerca