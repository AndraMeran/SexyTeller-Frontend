import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
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

function ArticoloSingolo() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [article, setArticle] = useState(null)
    const [comments, setComments] = useState([])
    const [featured, setFeatured] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newComment, setNewComment] = useState("")
    const [commentLoading, setCommentLoading] = useState(false)
    const [showSensitive, setShowSensitive] = useState(false)
    const [copied, setCopied] = useState(false)

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
                setFeatured(featuredData.filter(a => a._id !== id).slice(0, 3))
            } catch (err) {
                setError("Errore nel caricamento dell'articolo")
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [id])

    const handleLike = async () => {
        if (!user) return navigate("/login")
        try {
            const data = await toggleLikeArticle(id)
            setArticle(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setCommentLoading(true)
        try {
            const data = await createComment(id, { body: newComment })
            setComments([...comments, data])
            setNewComment("")
        } catch (err) {
            console.error(err)
        } finally {
            setCommentLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(id, commentId)
            setComments(comments.filter(c => c._id !== commentId))
        } catch (err) {
            console.error(err)
        }
    }

    const handleLikeComment = async (commentId) => {
        if (!user) return navigate("/login")
        try {
            const data = await toggleLikeComment(id, commentId)
            setComments(comments.map(c => c._id === commentId ? data : c))
        } catch (err) {
            console.error(err)
        }
    }

    const isLiked = article?.likes?.includes(user?.id)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    if (loading) return <div className="articolo-loading">Caricamento...</div>
    if (error) return <div className="articolo-error">{error}</div>
    if (!article) return null

    // Schermata 18+
    if (article.isSensitive && !user && !showSensitive) {
        return (
            <div className="sensitive-screen">
                <div className="sensitive-blur">
                    <h1>{article.title}</h1>
                </div>
                <div className="sensitive-card">
                    <h2>Contenuto Riservato</h2>
                    <p>Questo contenuto è accessibile solo agli utenti maggiorenni.</p>
                    <p className="sensitive-quote">"Il contenuto è il mezzo. Il racconto è il fine."</p>
                    <label className="sensitive-check">
                        <input
                            type="checkbox"
                            onChange={(e) => setShowSensitive(e.target.checked)}
                        />
                        Confermo di avere più di 18 anni e di accettare le linee guida di SexyTeller.
                    </label>
                    <div className="sensitive-actions">
                        <Link to="/login" className="btn-sensitive-login">Accedi</Link>
                        <Link to="/register" className="btn-sensitive-register">Registrati — è gratis</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="articolo-page">

            {/* ── HEADER FULLWIDTH ── */}
            <div className="articolo-header">
                <p className="articolo-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> › </span>
                    <Link to={`/categoria/${article.category}`}>{article.category}</Link>
                    <span> › </span>
                    <span>{article.title}</span>
                </p>

                <span className="articolo-badge">{article.category}</span>
                {article.isRedazione && (
                    <span className="articolo-badge-redazione">Redazione</span>
                )}

                <h1 className="articolo-title">{article.title}</h1>

                <div className="articolo-meta">
                    <div className="meta-author">
                        <div className="meta-avatar">
                            {article.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <Link
                                to={`/@${article.author?.handle}`}
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
                        <button
                            className={`btn-like ${isLiked ? "liked" : ""}`}
                            onClick={handleLike}
                        >
                            ♥ {article.likes?.length || 0}
                        </button>
                        <button className="btn-share" onClick={handleShare}>
                            {copied ? "✓ Copiato!" : "↗ Condividi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── IMMAGINE COPERTINA FULLWIDTH ── */}
            {article.coverImage && (
                <div className="articolo-cover">
                    <img src={article.coverImage} alt={article.title} />
                </div>
            )}

            {/* ── CORPO A DUE COLONNE ── */}
            <div className="articolo-layout">

                {/* COLONNA SINISTRA */}
                <div className="articolo-main">
                    <div className="articolo-body">
                        <ReactMarkdown>{article.body}</ReactMarkdown>
                    </div>

                    {/* COMMENTI */}
                    <div className="commenti-section">
                        <h3 className="commenti-title">
                            Commenti ({comments.length})
                        </h3>

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
                            <p className="commenti-login">
                                <Link to="/login">Accedi</Link> per lasciare un commento.
                            </p>
                        )}

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
                                        <button
                                            className={`btn-like-comment ${comment.likes?.includes(user?.id) ? "liked" : ""}`}
                                            onClick={() => handleLikeComment(comment._id)}
                                        >
                                            ♥ {comment.likes?.length || 0}
                                        </button>
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

                {/* SIDEBAR */}
                <aside className="articolo-sidebar">

                    {/* BOX AUTORE */}
                    <div className="sidebar-card">
                        <p className="sidebar-label">Autore</p>
                        <Link
                            to={`/@${article.author?.handle}`}
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
                        {article.author?.bio && (
                            <p className="author-bio">{article.author.bio}</p>
                        )}
                    </div>

                    {/* ARTICOLI IN EVIDENZA */}
                    {featured.length > 0 && (
                        <div className="sidebar-card">
                            <p className="sidebar-label">In evidenza</p>
                            {featured.map((a) => (
                                <Link
                                    key={a._id}
                                    to={`/articolo/${a._id}`}
                                    className="sidebar-article"
                                >
                                    {a.coverImage && (
                                        <img
                                            src={a.coverImage}
                                            alt={a.title}
                                            className="sidebar-thumb"
                                        />
                                    )}
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
