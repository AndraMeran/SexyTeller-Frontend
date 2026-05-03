import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"
import Image from "@tiptap/extension-image"
import { Link as TiptapLink } from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import EditorToolbar from "../components/EditorToolbar" // componente toolbar riutilizzabile
import { useAuth } from "../context/useAuth"
import { getArticleById, updateArticle, uploadImage } from "../services/api"
import "./Editor.css" // riusa lo stesso CSS dell'editor

const categorie = [
    { nome: "Stories", slug: "stories", verbo: "Racconta" },
    { nome: "Decode", slug: "decode", verbo: "Spiega" },
    { nome: "Crossover", slug: "crossover", verbo: "Collega" },
    { nome: "Trends", slug: "trends", verbo: "Aggiorna" },
    { nome: "Dark Side", slug: "darkside", verbo: "Approfondisce" },
    { nome: "Voices", slug: "voices", verbo: "Dà voce" },
]

function EditorModifica() {
    const { id } = useParams() // legge l'id dell'articolo dall'URL
    const { user } = useAuth()
    const navigate = useNavigate()

    // stati del form — inizializzati vuoti, poi popolati con i dati dell'articolo
    const [categoria, setCategoria] = useState("")
    const [titolo, setTitolo] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [isSensitive, setIsSensitive] = useState(false)
    const [anteprima, setAnteprima] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingArticle, setLoadingArticle] = useState(true) // caricamento articolo iniziale
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [bodyLength, setBodyLength] = useState(0) // lunghezza testo per checklist

    // inizializza Tiptap editor — content vuoto inizialmente, poi popolato con useEffect
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: "tiptap-img",
                },
                // permette attributi personalizzati sulle immagini
                allowBase64: false,
            }).extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        class: {
                            default: "tiptap-img",
                            parseHTML: element => element.getAttribute("class"),
                            renderHTML: attributes => ({
                                class: attributes.class,
                            }),
                        },
                    }
                },
            }),
            TiptapLink.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: "Modifica il tuo contenuto...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"], // funziona su titoli e paragrafi
            }),
        ],
        content: "", // verrà aggiornato dopo il caricamento dell'articolo
        onUpdate: ({ editor }) => {
            // aggiorna bodyLength ogni volta che il contenuto cambia
            setBodyLength(editor.getText().length)
        },
    })

    // carica i dati dell'articolo esistente al montaggio
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getArticleById(id)

                // controlla che l'utente sia l'autore dell'articolo
                // se non lo è reindirizza alla homepage
                if (data.author?._id !== user?.id) {
                    navigate("/")
                    return
                }

                // precompila il form con i dati esistenti
                setCategoria(data.category)
                setTitolo(data.title)
                setSubtitle(data.subtitle || "")
                setCoverImage(data.coverImage || "")
                setIsSensitive(data.isSensitive)

                // popola l'editor Tiptap con il contenuto HTML esistente
                // dobbiamo aspettare che l'editor sia pronto
                if (editor) {
                    editor.commands.setContent(data.body || "")
                }
            } catch (err) {
                setError("Errore nel caricamento dell'articolo")
            } finally {
                setLoadingArticle(false)
            }
        }
        // aspetta che l'editor sia inizializzato prima di caricare l'articolo
        if (editor) {
            fetchArticle()
        }
    }, [id, user, navigate, editor])

    // gestisce l'upload dell'immagine di copertina
    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url) setCoverImage(data.url)
        } catch (err) {
            setError("Errore nel caricamento dell'immagine")
        } finally {
            setUploadingImage(false)
        }
    }

    // gestisce l'upload di immagini nel corpo con allineamento
    // alignment può essere "left", "center" o "right"
    const handleBodyImageUpload = async (e, alignment) => {
        const file = e.target.files[0]
        if (!file) return

        const input = e.target
        try {
            const formData = new FormData()
            formData.append("image", file)
            const data = await uploadImage(formData)
            if (data.url && editor) {
                // inserisce l'immagine con la classe di allineamento
                editor.chain().focus().setImage({
                    src: data.url,
                    class: `tiptap-img img-${alignment}` // img-left, img-center, img-right
                }).run()
            }
        } catch (err) {
            setError("Errore nel caricamento dell'immagine")
        } finally {
            input.value = ""
        }
    }

    // gestisce il salvataggio delle modifiche
    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            // prende il contenuto HTML dall'editor Tiptap
            const htmlContent = editor.getHTML()

            const data = await updateArticle(id, {
                title: titolo,
                subtitle,
                category: categoria,
                body: htmlContent,
                coverImage,
                isSensitive,
            })

            if (data._id) {
                setSuccess("Articolo aggiornato con successo!")
                // aspetta 2 secondi poi reindirizza all'articolo
                setTimeout(() => navigate(`/articolo/${data._id}`), 2000)
            } else {
                setError(data.message || "Errore nel salvataggio")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    // checklist — stessa logica dell'editor
    const checklist = [
        { label: "Categoria scelta", done: !!categoria },
        { label: "Titolo scritto", done: !!titolo },
        { label: "Immagine caricata", done: !!coverImage },
        { label: "Contenuto scritto", done: bodyLength > 50 },
    ]

    const tuttoCompleto = checklist.every((item) => item.done)

    if (loadingArticle) return <div className="articolo-loading">Caricamento articolo...</div>

    // anteprima — stesso layout dell'editor
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
                    {subtitle && <p className="anteprima-subtitle">{subtitle}</p>}
                    <p className="anteprima-meta">
                        di {user?.name}
                        {isSensitive && <span className="badge-sensitive">SENSIBILE</span>}
                    </p>
                    {/* mostra HTML di Tiptap direttamente */}
                    <div
                        className="anteprima-body"
                        dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="editor-page">

            {/* ── HEADER ── */}
            <div className="editor-header">
                <span className="editor-draft">
                    Stai modificando un contenuto
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
                        {loading ? "Salvataggio..." : "Salva modifiche"}
                    </button>
                </div>
            </div>

            {error && <p className="editor-error">{error}</p>}
            {success && <p className="editor-success">{success}</p>}

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

                    {/* STEP 2B — SOTTOTITOLO */}
                    <div className="editor-step">
                        <p className="step-label">02b — Sottotitolo</p>
                        <input
                            type="text"
                            className="editor-sottotitolo"
                            placeholder="Un sottotitolo che amplia il titolo... (opzionale)"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
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
                    <div className="editor-step">
                        <p className="step-label">04 — Contenuto</p>
                        {/* toolbar con pulsanti formattazione e upload immagini */}
                        <EditorToolbar
                            editor={editor}
                            onImageUpload={handleBodyImageUpload}
                        />
                        {/* area di scrittura Tiptap */}
                        <EditorContent
                            editor={editor}
                            className="tiptap-editor"
                        />
                    </div>

                </div>

                {/* ── SIDEBAR ── */}
                <aside className="editor-sidebar">

                    {categoria && (
                        <div className="sidebar-card">
                            <p className="sidebar-label">Categoria selezionata</p>
                            <p className="sidebar-cat-nome">
                                {categorie.find((c) => c.slug === categoria)?.nome}
                            </p>
                        </div>
                    )}

                    <div className="sidebar-card">
                        <p className="sidebar-label">Checklist</p>
                        <ul className="checklist">
                            {checklist.map((item) => (
                                <li key={item.label} className={item.done ? "done" : ""}>
                                    {item.done ? "✓" : "○"} {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>

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
                            <p className="sidebar-label" style={{ marginTop: "12px" }}>
                                Come inserire immagini
                            </p>
                            <ul>
                                <li>Usa <strong>Img sinistra</strong> o <strong>Img destra</strong> per affiancare il testo all'immagine</li>
                                <li>Usa <strong>Img centro</strong> per un'immagine a tutta larghezza</li>
                                <li>⚠️ Evita di inserire due immagini affiancate — mettile in paragrafi separati</li>
                                <li>Scrivi il testo <em>dopo</em> aver inserito l'immagine</li>
                            </ul>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default EditorModifica