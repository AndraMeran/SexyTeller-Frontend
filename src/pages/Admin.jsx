import { useState, useEffect } from "react"
import { useAuth } from "../context/useAuth"
import {
    adminGetUsers,
    adminToggleBlock,
    adminDeleteUser,
    getFeaturedArticles,
    getArticles,
    toggleLikeArticle,
    adminGetAllComments,
    adminDeleteComment
} from "../services/api"
import "./Admin.css"

// importiamo anche updateArticle per il toggle isFeatured
import { updateArticle } from "../services/api"

function Admin() {
    const { user } = useAuth() // utente loggato — deve essere redazione

    const [users, setUsers] = useState([]) // lista tutti gli utenti
    const [articles, setArticles] = useState([]) // lista tutti gli articoli
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sezioneAttiva, setSezioneAttiva] = useState("Utenti") // sezione attiva del pannello
    const [success, setSuccess] = useState(null) // messaggio di successo
    const [comments, setComments] = useState([]) // lista tutti i commenti

    // carica utenti e articoli al montaggio del componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, articlesData, commentsData] = await Promise.all([
                    adminGetUsers(),
                    getArticles(),
                    adminGetAllComments() // ← aggiunto
                ])
                setUsers(usersData)
                setArticles(articlesData)
                setComments(commentsData) // ← aggiunto
            } catch (err) {
                setError("Errore nel caricamento dei dati")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // mostra messaggio di successo per 3 secondi poi lo nasconde
    const showSuccess = (msg) => {
        setSuccess(msg)
        setTimeout(() => setSuccess(null), 3000)
    }

    // gestisce blocco/sblocco utente
    const handleToggleBlock = async (userId) => {
        try {
            const data = await adminToggleBlock(userId)
            // aggiorna solo l'utente modificato nella lista
            setUsers(users.map(u => u._id === userId ? data : u))
            showSuccess("Stato utente aggiornato!")
        } catch (err) {
            setError("Errore nell'aggiornamento dell'utente")
        }
    }

    // gestisce eliminazione utente
    // window.confirm apre una finestra di conferma nativa del browser
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo utente? Verranno eliminati tutti i suoi contenuti.")) return
        try {
            await adminDeleteUser(userId)
            // rimuove l'utente dalla lista senza ricaricare
            setUsers(users.filter(u => u._id !== userId))
            showSuccess("Utente eliminato!")
        } catch (err) {
            setError("Errore nell'eliminazione dell'utente")
        }
    }

    // gestisce toggle in evidenza articolo
    const handleToggleFeatured = async (articleId, currentFeatured) => {
        try {
            const data = await updateArticle(articleId, { isFeatured: !currentFeatured })
            // aggiorna solo l'articolo modificato nella lista
            setArticles(articles.map(a => a._id === articleId ? data : a))
            showSuccess(`Articolo ${!currentFeatured ? "messo in evidenza" : "rimosso dall'evidenza"}!`)
        } catch (err) {
            setError("Errore nell'aggiornamento dell'articolo")
        }
    }
    // gestisce eliminazione commento
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo commento?")) return
        try {
            await adminDeleteComment(commentId)
            // rimuove il commento dalla lista senza ricaricare
            setComments(comments.filter(c => c._id !== commentId))
            showSuccess("Commento eliminato!")
        } catch (err) {
            setError("Errore nell'eliminazione del commento")
        }
    }

    // formatta la data in italiano
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    // label badge in italiano
    const getBadgeLabel = (badge) => {
        switch (badge) {
            case "nuovo": return "Nuovo"
            case "attivo": return "Attivo"
            case "in_evidenza": return "In Evidenza"
            default: return badge
        }
    }

    // statistiche rapide calcolate dagli array
    const stats = {
        utenti: users.length,
        articoli: articles.length,
        bloccati: users.filter(u => u.isBlocked).length,
        inEvidenza: articles.filter(a => a.isFeatured).length,
        commenti: comments.length, // ← aggiunto
    }

    if (loading) return <div className="admin-loading">Caricamento pannello...</div>
    if (error) return <div className="admin-error">{error}</div>

    return (
        <div className="admin-page">

            {/* ── HEADER ── */}
            <div className="admin-header">
                <h1 className="admin-title">Pannello Admin</h1>
                <p className="admin-subtitle">SexyTeller — Redazione</p>
            </div>

            {/* ── STATISTICHE RAPIDE ── */}
            <div className="admin-stats">
                <div className="admin-stat">
                    <span className="admin-stat-num">{stats.utenti}</span>
                    <span className="admin-stat-label">Utenti totali</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-num">{stats.articoli}</span>
                    <span className="admin-stat-label">Articoli</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-num">{stats.bloccati}</span>
                    <span className="admin-stat-label">Bloccati</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-num">{stats.inEvidenza}</span>
                    <span className="admin-stat-label">In evidenza</span>
                </div>
            </div>

            {/* messaggi successo ed errore */}
            {success && <p className="admin-success">{success}</p>}
            {error && <p className="admin-error-msg">{error}</p>}

            {/* ── TAB NAVIGAZIONE ── */}
            <div className="admin-tabs">
                {["Utenti", "Articoli", "Commenti"].map((tab) => (
                    <button
                        key={tab}
                        className={`admin-tab ${sezioneAttiva === tab ? "active" : ""}`}
                        onClick={() => setSezioneAttiva(tab)}
                    >
                        {tab === "Utenti" && `Utenti (${stats.utenti})`}
                        {tab === "Articoli" && `Articoli (${stats.articoli})`}
                        {tab === "Commenti" && `Commenti (${stats.commenti})`}
                    </button>
                ))}
            </div>

            {/* ── TABELLA UTENTI ── */}
            {sezioneAttiva === "Utenti" && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Utente</th>
                                <th>Handle</th>
                                <th>Badge</th>
                                <th>Stato</th>
                                <th>Registrato</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className={u.isBlocked ? "row-blocked" : ""}>
                                    <td>
                                        <div className="admin-user-cell">
                                            {/* avatar con iniziale */}
                                            <div className="admin-avatar">
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{u.name}</span>
                                            {/* badge redazione — solo per i membri della redazione */}
                                            {u.isRedazione && (
                                                <span className="badge-redazione-small">Redazione</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="admin-handle">@{u.handle}</td>
                                    <td>
                                        <span className={`admin-badge badge-${u.badge}`}>
                                            {getBadgeLabel(u.badge)}
                                        </span>
                                    </td>
                                    <td>
                                        {/* stato — verde se attivo, rosso se bloccato */}
                                        <span className={`admin-status ${u.isBlocked ? "blocked" : "active"}`}>
                                            {u.isBlocked ? "Bloccato" : "Attivo"}
                                        </span>
                                    </td>
                                    <td className="admin-date">{formatDate(u.createdAt)}</td>
                                    <td>
                                        <div className="admin-actions">
                                            {/* non mostrare azioni per i membri della redazione */}
                                            {!u.isRedazione ? (
                                                <>
                                                    <button
                                                        className={`btn-admin ${u.isBlocked ? "btn-sblocca" : "btn-blocca"}`}
                                                        onClick={() => handleToggleBlock(u._id)}
                                                    >
                                                        {u.isBlocked ? "Sblocca" : "Blocca"}
                                                    </button>
                                                    <button
                                                        className="btn-admin btn-elimina"
                                                        onClick={() => handleDeleteUser(u._id)}
                                                    >
                                                        Elimina
                                                    </button>
                                                </>
                                            ) : (
                                                // messaggio per i membri della redazione
                                                <span className="admin-protected">Protetto</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── TABELLA ARTICOLI ── */}
            {sezioneAttiva === "Articoli" && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Articolo</th>
                                <th>Categoria</th>
                                <th>Autore</th>
                                <th>Sensibile</th>
                                <th>Data</th>
                                <th>Like</th>
                                <th>In evidenza</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((a) => (
                                <tr key={a._id}>
                                    <td className="admin-article-title">{a.title}</td>
                                    <td>
                                        <span className="badge-cat-small">{a.category}</span>
                                    </td>
                                    <td className="admin-handle">
                                        {a.isRedazione ? "Redazione" : `@${a.author?.handle}`}
                                    </td>
                                    <td>
                                        {a.isSensitive ? (
                                            <span className="badge-sensitive-small">Sì</span>
                                        ) : (
                                            <span className="admin-date">No</span>
                                        )}
                                    </td>
                                    <td className="admin-date">{formatDate(a.createdAt)}</td>
                                    <td className="admin-likes">♥ {a.likes?.length || 0}</td>
                                    <td>
                                        {/* toggle in evidenza — cambia stile in base allo stato */}
                                        <button
                                            className={`btn-featured ${a.isFeatured ? "featured-on" : "featured-off"}`}
                                            onClick={() => handleToggleFeatured(a._id, a.isFeatured)}
                                        >
                                            {a.isFeatured ? "✓ In evidenza" : "Metti in evidenza"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── TABELLA COMMENTI ── */}
            {sezioneAttiva === "Commenti" && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Commento</th>
                                <th>Autore</th>
                                <th>Articolo</th>
                                <th>Data</th>
                                <th>Like</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((c) => (
                                <tr key={c._id}>
                                    {/* testo del commento — troncato se troppo lungo */}
                                    <td className="admin-article-title">{c.body}</td>
                                    <td className="admin-handle">
                                        @{c.author?.handle}
                                    </td>
                                    <td className="admin-article-title">
                                        {c.article?.title}
                                    </td>
                                    <td className="admin-date">{formatDate(c.createdAt)}</td>
                                    <td className="admin-likes">♥ {c.likes?.length || 0}</td>
                                    <td>
                                        <button
                                            className="btn-admin btn-elimina"
                                            onClick={() => handleDeleteComment(c._id)}
                                        >
                                            Elimina
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {comments.length === 0 && (
                        <p className="categoria-empty">Nessun commento al momento.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Admin
