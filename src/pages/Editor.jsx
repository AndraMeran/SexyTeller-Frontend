import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor"
import ReactMarkdown from "react-markdown"
import { createArticle, uploadImage } from "../services/api"
import { useAuth } from "../context/useAuth"
import "./Editor.css"

const categorie = [
    { nome: "Stories", slug: "stories", verbo: "Racconta" },
    { nome: "Decode", slug: "decode", verbo: "Spiega" },
    { nome: "Crossover", slug: "crossover", verbo: "Collega" },
    { nome: "Trends", slug: "trends", verbo: "Aggiorna" },
    { nome: "Dark Side", slug: "darkside", verbo: "Approfondisce" },
    { nome: "Voices", slug: "voices", verbo: "Dà voce" },
]

const modules = {
    toolbar: [
        [{ header: 2 }],
        ["bold", "italic"],
        ["link", "image"],
        ["blockquote"],
        ["clean"],
    ],
}

function Editor() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [categoria, setCategoria] = useState("")
    const [titolo, setTitolo] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [body, setBody] = useState("")
    const [isSensitive, setIsSensitive] = useState(false)
    const [anteprima, setAnteprima] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url) {
                setCoverImage(data.url)
            }
        } catch (err) {
            setError("Errore nel caricamento dell'immagine")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleBodyImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const input = e.target // ← salva il riferimento prima dell'async

        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url) {
                const imageMarkdown = `\n![immagine](${data.url})\n`
                setBody((prev) => prev + imageMarkdown)
            }
        } catch (err) {
            setError("Errore nel caricamento dell'immagine")
        } finally {
            input.value = "" // ← ora funziona perché abbiamo salvato il riferimento
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await createArticle({
                title: titolo,
                category: categoria,
                body,
                coverImage,
                isSensitive,
            })

            if (data._id) {
                navigate(`/articolo/${data._id}`)
            } else {
                setError(data.message || "Errore nella pubblicazione")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    // Checklist
    const checklist = [
        { label: "Categoria scelta", done: !!categoria },
        { label: "Titolo scritto", done: !!titolo },
        { label: "Immagine caricata", done: !!coverImage },
        { label: "Contenuto scritto", done: body.length > 50 },
    ]

    const tuttoCompleto = checklist.every((item) => item.done)

    if (anteprima) {
        return (
            <div className="editor-anteprima">
                <div className="anteprima-bar">
                    <button onClick={() => setAnteprima(false)} className="btn-back">
                        ← Torna all'editor
                    </button>
                    <span>Anteprima</span>
                </div>
                <div className="anteprima-content">
                    {coverImage && (
                        <img src={coverImage} alt="copertina" className="anteprima-cover" />
                    )}
                    <span className="anteprima-cat">{categoria}</span>
                    <h1>{titolo}</h1>
                    <p className="anteprima-meta">
                        di {user?.name}
                        {isSensitive && <span className="badge-sensitive">SENSIBILE</span>}
                    </p>
                    <div

                    />
                </div>
                <div className="anteprima-body">
                    <ReactMarkdown>{body}</ReactMarkdown>
                </div>
            </div>
        )
    }

    return (
        <div className="editor-page">

            {/* ── HEADER ── */}
            <div className="editor-header">
                <span className="editor-draft">
                    Stai creando un contenuto — bozza non salvata
                </span>
                <div className="editor-header-actions">
                    <button
                        className="btn-anteprima"
                        onClick={() => setAnteprima(true)}
                        disabled={!titolo}
                    >
                        Anteprima
                    </button>
                    <button
                        className="btn-pubblica"
                        onClick={handleSubmit}
                        disabled={!tuttoCompleto || loading}
                    >
                        {loading ? "Pubblicazione..." : "Pubblica come SexyTeller"}
                    </button>
                </div>
            </div>

            {error && <p className="editor-error">{error}</p>}

            <div className="editor-layout">

                {/* ── FORM PRINCIPALE ── */}
                <div className="editor-main">

                    {/* STEP 1 — CATEGORIA */}
                    <div className="editor-step">
                        <p className="step-label">01 — Come stai raccontando?</p>
                        <div className="cat-grid">
                            {categorie.map((cat) => (
                                <button
                                    key={cat.slug}
                                    className={`cat-btn ${categoria === cat.slug ? "active" : ""}`}
                                    onClick={() => setCategoria(cat.slug)}
                                >
                                    <span className="cat-btn-nome">{cat.nome}</span>
                                    <span className="cat-btn-verbo">{cat.verbo}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* STEP 2 — TITOLO */}
                    <div className="editor-step">
                        <p className="step-label">02 — Titolo</p>
                        <input
                            type="text"
                            className="editor-titolo"
                            placeholder="Un buon titolo è già metà storia..."
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                        />
                    </div>

                    {/* STEP 3 — IMMAGINE */}
                    <div className="editor-step">
                        <p className="step-label">03 — Immagine di copertina</p>
                        {coverImage ? (
                            <div className="cover-preview">
                                <img src={coverImage} alt="copertina" />
                                <button
                                    className="btn-remove-cover"
                                    onClick={() => setCoverImage("")}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        ) : (
                            <label className="upload-area">
                                {uploadingImage ? "Caricamento..." : "Carica immagine — jpg/png max 5mb"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />
                            </label>
                        )}
                    </div>

                    {/* STEP 4 — CONTENUTO */}
                    {/* <div className="editor-step">
                        <p className="step-label">04 — Contenuto</p>
                        <MDEditor
                            value={body}
                            onChange={setBody}
                            preview="edit"
                            height={400}
                            data-color-mode="dark"
                            placeholder="Racconta qualcosa che vale la pena essere raccontato..."
                        />
                    </div> */}

                    {/* STEP 4 — CONTENUTO */}
                    <div className="editor-step">
                        <p className="step-label">04 — Contenuto</p>

                        <div className="body-image-upload">
                            <label className="btn-body-image">
                                + Aggiungi immagine nel testo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBodyImageUpload}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <span className="body-image-hint">
                                L'immagine verrà inserita nel punto in cui ti trovi nel testo
                            </span>
                        </div>

                        <MDEditor
                            value={body}
                            onChange={setBody}
                            preview="edit"
                            height={400}
                            data-color-mode="dark"
                            placeholder="Racconta qualcosa che vale la pena essere raccontato..."
                        />
                    </div>

                </div>

                {/* ── SIDEBAR ── */}
                <aside className="editor-sidebar">

                    {/* CATEGORIA SELEZIONATA */}
                    {categoria && (
                        <div className="sidebar-card">
                            <p className="sidebar-label">Categoria selezionata</p>
                            <p className="sidebar-cat-nome">
                                {categorie.find((c) => c.slug === categoria)?.nome}
                            </p>
                        </div>
                    )}

                    {/* CHECKLIST */}
                    <div className="sidebar-card">
                        <p className="sidebar-label">Checklist</p>
                        <ul className="checklist">
                            {checklist.map((item) => (
                                <li
                                    key={item.label}
                                    className={item.done ? "done" : ""}
                                >
                                    {item.done ? "✓" : "○"} {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTENUTO SENSIBILE */}
                    <div className="sidebar-card">
                        <label className="sensitive-label">
                            <input
                                type="checkbox"
                                checked={isSensitive}
                                onChange={(e) => setIsSensitive(e.target.checked)}
                            />
                            Contenuto sensibile
                        </label>
                        {isSensitive && (
                            <p className="sensitive-note">
                                Questo contenuto sarà accessibile solo agli utenti registrati.
                            </p>
                        )}
                    </div>

                    {/* GUIDA */}
                    <div className="sidebar-card sidebar-guida">
                        <p className="sidebar-label">Guida SexyTeller</p>
                        <p>"Non pubblicare. Racconta."</p>
                        <ul>
                            <li>Aggiungi contesto</li>
                            <li>Costruisci un punto di vista</li>
                            <li>Dai significato</li>
                            <li>Evita il vuoto</li>
                        </ul>
                        <div className="guida-tip">
                            <p className="sidebar-label" style={{ marginTop: "12px" }}>Come inserire immagini</p>
                            <p>Scrivi fino al punto dove vuoi l'immagine, clicca il pulsante, poi continua a scrivere sotto.</p>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Editor
