import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import { updateMe, deleteMe, uploadImage } from "../services/api"
import "./Impostazioni.css"

// sezioni del menu laterale
const sezioni = ["Profilo", "Identità editoriale", "Sicurezza", "Il mio badge", "Elimina account"]

function Impostazioni() {
    const { user, login, logout } = useAuth() // user per i dati attuali, login per aggiornare il token, logout per eliminare account
    const navigate = useNavigate()

    const [sezioneAttiva, setSezioneAttiva] = useState("Profilo") // sezione del menu attiva
    const [loading, setLoading] = useState(false) // stato di caricamento salvataggio
    const [error, setError] = useState(null) // messaggio di errore
    const [success, setSuccess] = useState(null) // messaggio di successo
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false) // mostra/nasconde conferma eliminazione

    // dati del form — inizializzati con i dati attuali dell'utente dal token
    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
    })

    // gestisce il cambio dei campi del form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // gestisce il salvataggio delle modifiche
    const handleSubmit = async (e) => {
        e.preventDefault() // previene il reload della pagina
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const data = await updateMe(formData)
            if (data.token) {
                login(data.token) // aggiorna il token con i nuovi dati
                setSuccess("Modifiche salvate con successo!")
            } else {
                setError(data.message || "Errore nel salvataggio")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    // gestisce l'upload dell'avatar
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url) {
                // salva subito l'avatar aggiornato
                const updated = await updateMe({ avatar: data.url })
                if (updated.token) login(updated.token)
                setSuccess("Avatar aggiornato!")
            }
        } catch (err) {
            setError("Errore nel caricamento dell'avatar")
        }
    }

    // gestisce l'upload della cover
    const handleCoverUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url) {
                const updated = await updateMe({ cover: data.url })
                if (updated.token) login(updated.token)
                setSuccess("Immagine di copertina aggiornata!")
            }
        } catch (err) {
            setError("Errore nel caricamento della copertina")
        }
    }

    // gestisce l'eliminazione dell'account
    const handleDeleteAccount = async () => {
        try {
            await deleteMe()
            logout() // rimuove il token e resetta lo stato
            navigate("/") // reindirizza alla homepage
        } catch (err) {
            setError("Errore nell'eliminazione dell'account")
        }
    }

    // label del badge in italiano
    const getBadgeLabel = (badge) => {
        switch (badge) {
            case "nuovo": return "Nuovo"
            case "attivo": return "Attivo"
            case "in_evidenza": return "In Evidenza"
            default: return badge
        }
    }

    // descrizione del badge
    const getBadgeDescription = (badge) => {
        switch (badge) {
            case "nuovo": return "Hai appena iniziato il tuo percorso su SexyTeller."
            case "attivo": return "Hai pubblicato almeno 3 articoli. Continua così!"
            case "in_evidenza": return "Assegnato dalla redazione per la qualità dei contenuti."
            default: return ""
        }
    }

    return (
        <div className="impostazioni-page">

            {/* ── MENU LATERALE ── */}
            <aside className="impostazioni-menu">
                <h2 className="impostazioni-menu-title">Account</h2>
                <nav className="impostazioni-nav">
                    {sezioni.map((sezione) => (
                        <button
                            key={sezione}
                            className={`impostazioni-nav-item ${sezioneAttiva === sezione ? "active" : ""} ${sezione === "Elimina account" ? "danger" : ""}`}
                            onClick={() => {
                                setSezioneAttiva(sezione)
                                setError(null)
                                setSuccess(null)
                            }}
                        >
                            {sezione}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* ── CONTENUTO ── */}
            <div className="impostazioni-content">

                {/* messaggi di successo ed errore */}
                {success && <p className="impostazioni-success">{success}</p>}
                {error && <p className="impostazioni-error">{error}</p>}

                {/* ── SEZIONE PROFILO ── */}
                {sezioneAttiva === "Profilo" && (
                    <div>
                        <h3 className="impostazioni-section-title">Immagini profilo</h3>

                        {/* avatar */}
                        <div className="impostazioni-images">
                            <div className="impostazioni-avatar-wrapper">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="impostazioni-avatar" />
                                ) : (
                                    <div className="impostazioni-avatar-placeholder">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <label className="btn-upload-img">
                                    Cambia avatar
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>

                            {/* cover */}
                            <div className="impostazioni-cover-wrapper">
                                {user?.cover ? (
                                    <img src={user.cover} alt="cover" className="impostazioni-cover" />
                                ) : (
                                    <div className="impostazioni-cover-placeholder" />
                                )}
                                <label className="btn-upload-img">
                                    Cambia copertina
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverUpload}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* form informazioni personali */}
                        <h3 className="impostazioni-section-title">Informazioni personali</h3>
                        <form onSubmit={handleSubmit} className="impostazioni-form">

                            <div className="form-group">
                                <label>Nome completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* handle non modificabile — spiegazione sotto */}
                            <div className="form-group">
                                <label>Handle</label>
                                <input
                                    type="text"
                                    value={`@${user?.handle}`}
                                    disabled // handle non modificabile dopo la registrazione
                                    className="input-disabled"
                                />
                                <span className="form-hint">
                                    L'handle è la tua identità pubblica su SexyTeller e non può essere modificato.
                                </span>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled // email non modificabile per sicurezza
                                    className="input-disabled"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-salva"
                                disabled={loading}
                            >
                                {loading ? "Salvataggio..." : "Salva modifiche"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── SEZIONE IDENTITÀ EDITORIALE ── */}
                {sezioneAttiva === "Identità editoriale" && (
                    <div>
                        <h3 className="impostazioni-section-title">Linea editoriale</h3>
                        <p className="impostazioni-description">
                            La tua linea editoriale è la frase che ti descrive come SexyTeller.
                            Appare sul tuo profilo e negli articoli che pubblichi.
                        </p>
                        <form onSubmit={handleSubmit} className="impostazioni-form">
                            <div className="form-group">
                                <label>Linea editoriale</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder='"Racconto il lato nascosto del desiderio..."'
                                    rows={3}
                                    className="impostazioni-textarea"
                                />
                                <span className="form-hint">
                                    Una frase che descrive il tuo sguardo. Massimo 160 caratteri.
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="btn-salva"
                                disabled={loading}
                            >
                                {loading ? "Salvataggio..." : "Salva modifiche"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── SEZIONE SICUREZZA ── */}
                {sezioneAttiva === "Sicurezza" && (
                    <div>
                        <h3 className="impostazioni-section-title">Sicurezza</h3>
                        <p className="impostazioni-description">
                            La modifica della password non è ancora disponibile.
                            Se hai bisogno di assistenza contatta la redazione.
                        </p>
                    </div>
                )}

                {/* ── SEZIONE BADGE ── */}
                {sezioneAttiva === "Il mio badge" && (
                    <div>
                        <h3 className="impostazioni-section-title">Il tuo badge</h3>
                        <div className="badge-card">
                            {/* badge con classe dinamica in base al valore */}
                            <span className={`profilo-badge badge-${user?.badge}`}>
                                {getBadgeLabel(user?.badge)}
                            </span>
                            <p className="badge-description">
                                {getBadgeDescription(user?.badge)}
                            </p>
                            <p className="form-hint">
                                I badge vengono aggiornati automaticamente in base alla tua attività.
                                Il badge "In Evidenza" viene assegnato solo dalla redazione.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── SEZIONE ELIMINA ACCOUNT ── */}
                {sezioneAttiva === "Elimina account" && (
                    <div>
                        <h3 className="impostazioni-section-title danger-title">Elimina account</h3>
                        <p className="impostazioni-description">
                            Eliminando il tuo account verranno cancellati tutti i tuoi articoli
                            e commenti. Questa azione è irreversibile.
                        </p>

                        {/* conferma eliminazione — appare solo dopo aver cliccato il pulsante */}
                        {!showDeleteConfirm ? (
                            <button
                                className="btn-delete"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Elimina il mio account
                            </button>
                        ) : (
                            <div className="delete-confirm">
                                <p>Sei sicura di voler eliminare il tuo account? <strong>Non potrai tornare indietro.</strong></p>
                                <div className="delete-confirm-actions">
                                    <button
                                        className="btn-delete"
                                        onClick={handleDeleteAccount}
                                    >
                                        Sì, elimina definitivamente
                                    </button>
                                    <button
                                        className="btn-annulla"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Annulla
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Impostazioni
