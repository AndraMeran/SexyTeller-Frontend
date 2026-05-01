import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { getUserProfile, getUserArticles } from "../services/api"
import "./ProfiloUtente.css"

// categorie per i tab di filtro
const categorie = ["Tutti", "Stories", "Decode", "Crossover", "Trends", "Dark Side", "Voices"]

function ProfiloUtente() {
    const { handle } = useParams() // legge il parametro :handle dall'URL — es. /@mariateller → handle = "mariateller"
    const { user } = useAuth() // legge l'utente loggato dal context

    const [profile, setProfile] = useState(null) // dati del profilo utente
    const [articles, setArticles] = useState([]) // tutti gli articoli dell'utente
    const [filteredArticles, setFilteredArticles] = useState([]) // articoli filtrati per categoria
    const [activeTab, setActiveTab] = useState("Tutti") // tab attivo — default "Tutti"
    const [loading, setLoading] = useState(true) // stato di caricamento
    const [error, setError] = useState(null) // messaggio di errore

    // controlla se stai guardando il tuo stesso profilo
    // confronta l'handle dell'utente loggato con quello nell'URL
    const isOwnProfile = user?.handle === handle

    // carica profilo e articoli quando la pagina si monta
    // o quando cambia l'handle nell'URL
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Promise.all esegue le due chiamate in parallelo — più veloce di farle in sequenza
                const [profileData, articlesData] = await Promise.all([
                    getUserProfile(handle),
                    getUserArticles(handle)
                ])
                setProfile(profileData)
                setArticles(articlesData)
                setFilteredArticles(articlesData) // inizialmente mostra tutti
            } catch (err) {
                setError("Errore nel caricamento del profilo")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [handle]) // si riesegue se cambia l'handle — utile se navighi da un profilo all'altro

    // filtra gli articoli ogni volta che cambia il tab attivo o la lista degli articoli
    useEffect(() => {
        if (activeTab === "Tutti") {
            setFilteredArticles(articles) // mostra tutti
        } else {
            setFilteredArticles(
                articles.filter(
                    // confronta la categoria dell'articolo con il tab selezionato
                    // toLowerCase e replace(" ", "") per gestire "Dark Side" → "darkside"
                    (a) => a.category.toLowerCase() === activeTab.toLowerCase().replace(" ", "")
                )
            )
        }
    }, [activeTab, articles]) // dipende da activeTab e articles

    // formatta la data in italiano — es. "12 aprile 2025"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    // converte il badge dal valore del database alla label da mostrare
    const getBadgeLabel = (badge) => {
        switch (badge) {
            case "nuovo": return "Nuovo"
            case "attivo": return "Attivo"
            case "in_evidenza": return "In Evidenza"
            default: return badge
        }
    }

    // stati di caricamento ed errore
    if (loading) return <div className="profilo-loading">Caricamento profilo...</div>
    if (error) return <div className="profilo-error">{error}</div>
    if (!profile) return null

    return (
        <div className="profilo-page">

            {/* ── COVER ── */}
            {/* mostra l'immagine di copertina se esiste, altrimenti un placeholder colorato */}
            <div className="profilo-cover">
                {profile.cover ? (
                    <img src={profile.cover} alt="cover" />
                ) : (
                    <div className="profilo-cover-placeholder" />
                )}
            </div>

            {/* ── PROFILO INFO ── */}
            <div className="profilo-info-wrapper">
                <div className="profilo-info">

                    {/* AVATAR — sovrapposto alla cover con margin-top negativo nel CSS */}
                    <div className="profilo-avatar-wrapper">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="profilo-avatar"
                            />
                        ) : (
                            // se non ha avatar mostra la prima lettera del nome
                            <div className="profilo-avatar-placeholder">
                                {profile.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* TESTO — nome, handle, badge, pulsanti, bio, stats */}
                    <div className="profilo-text">
                        <div className="profilo-header-row">
                            <div>
                                <h1 className="profilo-name">{profile.name}</h1>
                                <p className="profilo-handle">@{profile.handle}</p>
                            </div>

                            <div className="profilo-actions">
                                {/* badge — classe dinamica in base al valore del badge */}
                                <span className={`profilo-badge badge-${profile.badge}`}>
                                    {getBadgeLabel(profile.badge)}
                                </span>

                                {/* mostra "Segui" solo se non è il tuo profilo */}
                                {!isOwnProfile && (
                                    <button className="btn-segui">Segui</button>
                                )}

                                {/* mostra "Modifica profilo" solo se è il tuo profilo */}
                                {isOwnProfile && (
                                    <Link to="/impostazioni" className="btn-modifica">
                                        Modifica profilo
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* bio — mostrata solo se esiste */}
                        {profile.bio && (
                            <p className="profilo-bio">"{profile.bio}"</p>
                        )}

                        {/* STATS — contenuti è reale, follower e seguiti sono placeholder */}
                        <div className="profilo-stats">
                            <div className="stat">
                                <span className="stat-num">{articles.length}</span>
                                <span className="stat-label">Contenuti</span>
                            </div>
                            <div className="stat">
                                <span className="stat-num">—</span>
                                <span className="stat-label">Follower</span>
                            </div>
                            <div className="stat">
                                <span className="stat-num">—</span>
                                <span className="stat-label">Seguiti</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TAB CATEGORIE ── */}
            {/* ogni tab filtra gli articoli per categoria */}
            <div className="profilo-tabs-wrapper">
                <div className="profilo-tabs">
                    {categorie.map((cat) => (
                        <button
                            key={cat}
                            className={`profilo-tab ${activeTab === cat ? "active" : ""}`}
                            onClick={() => setActiveTab(cat)} // aggiorna il tab attivo al click
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── FEED ARTICOLI ── */}
            <div className="profilo-feed">
                {filteredArticles.length === 0 ? (
                    // messaggio se non ci sono articoli in questa categoria
                    <p className="profilo-empty">
                        Nessun articolo in questa categoria.
                    </p>
                ) : (
                    <div className="profilo-articles">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/articolo/${article._id}`}
                                className="profilo-article-card"
                            >
                                {/* immagine copertina — mostrata solo se esiste */}
                                {article.coverImage && (
                                    <img
                                        src={article.coverImage}
                                        alt={article.title}
                                        className="profilo-article-img"
                                    />
                                )}
                                <div className="profilo-article-body">
                                    <span className="profilo-article-cat">
                                        {article.category}
                                        {/* badge SENSIBILE — mostrato solo se isSensitive: true */}
                                        {article.isSensitive && (
                                            <span className="badge-sensitive">SENSIBILE</span>
                                        )}
                                    </span>
                                    <h3 className="profilo-article-title">{article.title}</h3>
                                    <p className="profilo-article-meta">
                                        {formatDate(article.createdAt)} · {article.readTime} min
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default ProfiloUtente
