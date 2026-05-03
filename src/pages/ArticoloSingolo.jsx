import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown" // converte il markdown in HTML per la visualizzazione
import { useAuth } from "../context/useAuth"
import {
    getArticleById,
    getComments,
    createComment,
    deleteComment,
    toggleLikeArticle,
    toggleLikeComment,
    getFeaturedArticles
} from "../services/api"
import "./ArticoloSingolo.css"
import ArticleImage from "../components/ArticleImage"
import "../components/ArticleImage.css"

function ArticoloSingolo() {
    const { id } = useParams() // legge l'_id dell'articolo dall'URL — es. /articolo/abc123 → id = "abc123"
    const { user } = useAuth() // legge l'utente loggato dal context
    const navigate = useNavigate() // serve per reindirizzare l'utente — es. al login se non loggato

    const [article, setArticle] = useState(null) // dati dell'articolo
    const [comments, setComments] = useState([]) // lista commenti
    const [featured, setFeatured] = useState([]) // articoli in evidenza per la sidebar
    const [loading, setLoading] = useState(true) // stato di caricamento
    const [error, setError] = useState(null) // messaggio di errore
    const [newComment, setNewComment] = useState("") // testo del nuovo commento
    const [commentLoading, setCommentLoading] = useState(false) // stato di caricamento invio commento
    const [showSensitive, setShowSensitive] = useState(false) // controlla se mostrare contenuto sensibile
    const [copied, setCopied] = useState(false) // controlla il testo del pulsante condividi

    // carica articolo, commenti e articoli in evidenza quando la pagina si monta
    // Promise.all esegue le tre chiamate in parallelo — più veloce di farle in sequenza
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [articleData, commentsData, featuredData] = await Promise.all([
                    getArticleById(id),
                    getComments(id),
                    getFeaturedArticles()
                ])
                setArticle(articleData)
                setComments(commentsData)
                // filtra l'articolo corrente dagli articoli in evidenza e prende i primi 3
                setFeatured(featuredData.filter(a => a._id !== id).slice(0, 3))
            } catch (err) {
                setError("Errore nel caricamento dell'articolo")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [id]) // si riesegue se cambia l'id nell'URL

    // gestisce il like all'articolo
    // se non loggato reindirizza al login
    // toggleLikeArticle aggiunge o rimuove il like — lo gestisce il backend
    const handleLike = async () => {
        if (!user) return navigate("/login")
        try {
            const data = await toggleLikeArticle(id)
            setArticle(data) // aggiorna l'articolo con il nuovo stato dei like
        } catch (err) {
            console.error(err)
        }
    }

    // copia l'URL dell'articolo negli appunti del browser
    // cambia il testo del pulsante in "✓ Copiato!" per 2 secondi
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // gestisce l'invio di un nuovo commento
    // trim() rimuove spazi vuoti — evita commenti vuoti
    const handleComment = async (e) => {
        e.preventDefault() // previene il reload della pagina al submit del form
        if (!newComment.trim()) return
        setCommentLoading(true)
        try {
            const data = await createComment(id, { body: newComment })
            setComments([...comments, data]) // aggiunge il nuovo commento alla lista esistente
            setNewComment("") // svuota il campo dopo l'invio
        } catch (err) {
            console.error(err)
        } finally {
            setCommentLoading(false)
        }
    }

    // gestisce l'eliminazione di un commento
    // filter crea una nuova lista senza il commento eliminato
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(id, commentId)
            setComments(comments.filter(c => c._id !== commentId))
        } catch (err) {
            console.error(err)
        }
    }

    // gestisce il like a un commento
    // map aggiorna solo il commento che ha ricevuto il like, lascia gli altri invariati
    const handleLikeComment = async (commentId) => {
        if (!user) return navigate("/login")
        try {
            const data = await toggleLikeComment(id, commentId)
            setComments(comments.map(c => c._id === commentId ? data : c))
        } catch (err) {
            console.error(err)
        }
    }

    // controlla se l'utente loggato ha già messo like all'articolo
    // includes cerca l'id dell'utente nell'array dei like
    const isLiked = article?.likes?.includes(user?.id)

    // formatta la data in italiano — es. "12 aprile 2025"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    // stati di caricamento ed errore
    if (loading) return <div className="articolo-loading">Caricamento...</div>
    if (error) return <div className="articolo-error">{error}</div>
    if (!article) return null

    // ── SCHERMATA 18+ ──
    // appare se l'articolo è sensibile E l'utente non è loggato E non ha confermato l'età
    if (article.isSensitive && !user && !showSensitive) {
        return (
            <div className="sensitive-screen">
                {/* titolo sfocato in background — crea curiosità senza rivelare il contenuto */}
                <div className="sensitive-blur">
                    {/* immagine offuscata — crea curiosità senza rivelare il contenuto */}
                    {article.coverImage ? (
                        <img src={article.coverImage} alt={article.title} className="sensitive-blur-img" />
                    ) : (
                        <h1>{article.title}</h1>
                    )}
                </div>
                <div className="sensitive-card">
                    <h2>Contenuto Riservato</h2>
                    <p>Questo contenuto è accessibile solo agli utenti maggiorenni.</p>
                    <p>Anche i contenuti sensibili sono inseriti in un contesto culturale e informativo.</p>
                    <p className="sensitive-quote">"Il contenuto è il mezzo. Il racconto è il fine."</p>

                    {/* pulsante conferma età */}
                    <button
                        className="btn-sensitive-confirm"
                        onClick={() => setShowSensitive(true)}
                    >
                        Sì, ho più di 18 anni
                    </button>

                    <div className="sensitive-divider">oppure</div>

                    <div className="sensitive-actions">
                        <Link to="/login" className="btn-sensitive-login">Accedi</Link>
                        <Link to="/register" className="btn-sensitive-register">Diventa SexyTeller</Link>
                    </div>

                    <p className="sensitive-disclaimer">
                        Continuando accetti le linee guida della piattaforma.
                    </p>

                    {/* link per tornare alla homepage — per chi non vuole procedere */}
                    <Link to="/" className="sensitive-back">
                        ← Torna alla Homepage
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="articolo-page">

            {/* ── HEADER FULLWIDTH ── */}
            <div className="articolo-header">

                {/* breadcrumb — mostra il percorso Home > Categoria > Titolo */}
                <p className="articolo-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> › </span>
                    <Link to={`/categoria/${article.category}`}>{article.category}</Link>
                    <span> › </span>
                    <span>{article.title}</span>
                </p>

                {/* badge categoria — sempre visibile */}
                <span className="articolo-badge">{article.category}</span>

                {/* badge Redazione — visibile solo se isRedazione: true */}
                {article.isRedazione && (
                    <span className="articolo-badge-redazione">Redazione</span>
                )}

                <h1 className="articolo-title">{article.title}</h1>

                {/* sottotitolo — mostrato solo se esiste */}
                {article.subtitle && (
                    <p className="articolo-subtitle">{article.subtitle}</p>
                )}

                {/* meta bar — autore, data, tempo di lettura, like, condividi */}
                <div className="articolo-meta">
                    <div className="meta-author">
                        <div className="meta-avatar">
                            {article.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            {/* link al profilo dell'autore — aggiornato da /@ a /profilo/ */}
                            <Link
                                to={`/profilo/${article.author?.handle}`}
                                className="meta-author-name"
                            >
                                {article.author?.name}
                            </Link>
                            <p className="meta-author-handle">@{article.author?.handle}</p>
                        </div>
                    </div>

                    <span className="meta-sep">·</span>
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="meta-sep">·</span>
                    <span>{article.readTime} min di lettura</span>

                    <div className="meta-actions">
                        {/* pulsante like — classe "liked" aggiunge il colore rosa se già messo like */}
                        <button
                            className={`btn-like ${isLiked ? "liked" : ""}`}
                            onClick={handleLike}
                        >
                            ♥ {article.likes?.length || 0}
                        </button>

                        {/* pulsante condividi — copia URL negli appunti */}
                        <button className="btn-share" onClick={handleShare}>
                            {copied ? "✓ Copiato!" : "↗ Condividi"}
                        </button>
                        {/* pulsante modifica — visibile solo all'autore */}
                        {user?.id === article.author?._id && (
                            <Link
                                to={`/modifica/${article._id}`}
                                className="btn-modifica-articolo"
                            >
                                ✎ Modifica
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ── IMMAGINE COPERTINA FULLWIDTH ── */}
            {/* mostrata solo se esiste */}
            {article.coverImage && (
                <div className="articolo-cover">
                    <img src={article.coverImage} alt={article.title} />
                </div>
            )}

            {/* ── CORPO A DUE COLONNE ── */}
            <div className="articolo-layout">

                {/* ── COLONNA SINISTRA — corpo + commenti ── */}
                <div className="articolo-main">

                    {/* corpo dell'articolo in markdown — ReactMarkdown converte in HTML */}
                    <div className="articolo-body">
                        <ReactMarkdown>{article.body}</ReactMarkdown>
                    </div>

                    {/* ── SEZIONE COMMENTI ── */}
                    <div className="commenti-section">
                        <h3 className="commenti-title">
                            Commenti ({comments.length})
                        </h3>

                        {/* form commento — visibile solo se loggato */}
                        {user ? (
                            <form onSubmit={handleComment} className="commento-form">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Scrivi un commento..."
                                    className="commento-input"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    className="btn-commento"
                                    disabled={commentLoading}
                                >
                                    {commentLoading ? "Invio..." : "Pubblica commento"}
                                </button>
                            </form>
                        ) : (
                            // messaggio per utenti non loggati
                            <p className="commenti-login">
                                <Link to="/login">Accedi</Link> per lasciare un commento.
                            </p>
                        )}

                        {/* lista commenti */}
                        <div className="commenti-list">
                            {comments.map((comment) => (
                                <div key={comment._id} className="commento">
                                    <div className="commento-header">
                                        <div className="meta-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                                            {comment.author?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="commento-author">
                                            {comment.author?.name}
                                        </span>
                                        <span className="commento-date">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="commento-body">{comment.body}</p>
                                    <div className="commento-actions">
                                        {/* like commento — funziona come toggle */}
                                        <button
                                            className={`btn-like-comment ${comment.likes?.includes(user?.id) ? "liked" : ""}`}
                                            onClick={() => handleLikeComment(comment._id)}
                                        >
                                            ♥ {comment.likes?.length || 0}
                                        </button>

                                        {/* elimina commento — visibile solo all'autore o alla redazione */}
                                        {(user?.id === comment.author?._id || user?.isRedazione) && (
                                            <button
                                                className="btn-delete-comment"
                                                onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                Elimina
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="articolo-sidebar">

                    {/* BOX AUTORE — link al profilo aggiornato da /@ a /profilo/ */}
                    <div className="sidebar-card">
                        <p className="sidebar-label">Autore</p>
                        <Link
                            to={`/profilo/${article.author?.handle}`}
                            className="author-box"
                        >
                            <div className="author-avatar">
                                {article.author?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="author-name">{article.author?.name}</p>
                                <p className="author-handle">@{article.author?.handle}</p>
                            </div>
                        </Link>
                        {/* bio autore — mostrata solo se esiste */}
                        {article.author?.bio && (
                            <p className="author-bio">{article.author.bio}</p>
                        )}
                    </div>

                    {/* ARTICOLI IN EVIDENZA — mostrati solo se esistono */}
                    {featured.length > 0 && (
                        <div className="sidebar-card">
                            <p className="sidebar-label">In evidenza</p>
                            {featured.map((a) => (
                                <Link
                                    key={a._id}
                                    to={`/articolo/${a._id}`}
                                    className="sidebar-article"
                                >
                                    {/* immagine articolo — mostrata solo se esiste */}
                                    <ArticleImage
                                        src={a.coverImage}
                                        alt={a.title}
                                        isSensitive={a.isSensitive}
                                        className="sidebar-thumb"
                                    />
                                    <div>
                                        <p className="sidebar-cat">{a.category}</p>
                                        <p className="sidebar-article-title">{a.title}</p>
                                        <p className="sidebar-article-meta">
                                            {a.author?.name} · {a.readTime} min
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default ArticoloSingolo
