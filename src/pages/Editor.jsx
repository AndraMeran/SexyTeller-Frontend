import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"
import Image from "@tiptap/extension-image"
import { Link as TiptapLink } from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import FontFamily from "@tiptap/extension-font-family"
import { TextStyle } from "@tiptap/extension-text-style"
import { useAuth } from "../context/useAuth"
import { createArticle, uploadImage } from "../services/api"
import EditorToolbar from "../components/EditorToolbar"
import "./Editor.css"

const categorie = [
    { nome: "Stories", slug: "stories", verbo: "Raccontare", descrizione: "Stories è la categoria narrativa. Qui i contenuti: raccontano una storia, seguono un filo narrativo, hanno inizio, sviluppo e fine. Può trattarsi di biografie, eventi, ascesa/caduta, dietro le quinte, racconti narrativi, racconti erotici, storie verie, fiction narrative, confessioni intime purché ci sia una storia da seguire. Lo stile è simile a: documentario, storytelling, narrativa.", descrizione2: "Se sembra un documentario o un racconto → Stories" },

    { nome: "Decode", slug: "decode", verbo: "Spiegare", descrizione: "Decode è la categoria analitica. Qui i contenuti spiegano fenomeni, analizzano comportamenti, approfondiscono concetti. Esempi: fetish spiegati, categorie pornografiche, psicologia del desiderio. Risponde sempre a 'Perché esiste questa cosa?'", descrizione2: "Se insegna qualcosa → Decode " },

    { nome: "Crossover", slug: "crossover", verbo: "Collegare", descrizione: "Crossover è il ponte tra mondi. Qui si analizzano collegamenti tra: sessualità / erotismo / pornografia e altri ambiti. Esempi: cinema, musica, moda, arte, sport, ecc. Mostra come questi mondi si influenzano tra loro.", descrizione2: "Se collega due mondi → Crossover" },
    { nome: "Trends", slug: "trends", verbo: "Aggiornare", descrizione: "Trends raccoglie contenuti veloci, attuali, immediati. Esempi: notizie, trend, top 10/classifiche, novità. Contenuti pensati per essere letti rapidamente ed essere condivisi.", descrizione2: "Se è veloce e attuale → Trends" },
    { nome: "Dark Side", slug: "darkside", verbo: "Approfondire", descrizione: "Dark Side affronta i temi più complessi e scomodi. Qui trovi problemi reali, distorsioni, aspetti negativi, temi delicati. Esempi: misteri, crime, dipendenza, sfruttamento, dinamiche tossiche.", descrizione2: "Se è scomodo ma reale → Dark Side" },
    { nome: "Voices", slug: "voices", verbo: "Dare voce", descrizione: "Voices è la categoria delle voci. Contiene contenuti basati su dialogo, confronto, testimoniaza diretta. Esempi: interviste, Q&A, conversazioni. Qui non racconti da solo, dai spazio a qualcun altro. ", descrizione2: "Se ci sono domande e risposte → Voices " },
]


function Editor() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [categoria, setCategoria] = useState("")
    const [titolo, setTitolo] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [isSensitive, setIsSensitive] = useState(false)
    const [anteprima, setAnteprima] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [bodyLength, setBodyLength] = useState(0) // lunghezza testo per checklist

    // inizializza Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle.configure({
                types: ["textStyle"],
            }),
            FontFamily,
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
                placeholder: "Scrivi qualcosa che lasci il segno...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"], // funziona su titoli e paragrafi
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            // aggiorna bodyLength ogni volta che il contenuto cambia
            setBodyLength(editor.getText().length)
        },

    })

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

    // gestisce la pubblicazione dell'articolo
    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            // prende il contenuto HTML dall'editor Tiptap
            const htmlContent = editor.getHTML()

            const data = await createArticle({
                title: titolo,
                subtitle,
                category: categoria,
                body: htmlContent, // salviamo HTML invece di Markdown
                coverImage,
                isSensitive,
            })

            if (data._id) {
                setSuccess("Articolo pubblicato con successo!")
                setTimeout(() => navigate(`/articolo/${data._id}`), 2000)
            } else {
                setError(data.message || "Errore nella pubblicazione")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    // checklist
    const checklist = [
        { label: "Categoria scelta", done: !!categoria },
        { label: "Titolo scritto", done: !!titolo },
        { label: "Immagine caricata", done: !!coverImage },
        { label: "Contenuto scritto", done: bodyLength > 50 },
    ]

    const tuttoCompleto = checklist.every((item) => item.done)

    // anteprima
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
                    {/* nell'anteprima mostriamo direttamente l'HTML di Tiptap */}
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
                    Stai creando un contenuto — Bozza non salvata
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
            {success && <p className="editor-success">{success}</p>}

            <div className="editor-layout">

                {/* ── FORM PRINCIPALE ── */}
                <div className="editor-main">

                    {/* STEP 1 — CATEGORIA */}
                    <div className="editor-step">
                        <p className="step-label"> Scegli come raccontare</p>
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
                    {/* BOX DESCRIZIONE CATEGORIA SELEZIONATA */}
                    {categoria && (
                        <div className="cat-descrizione-box">
                            <p className="cat-descrizione-titolo">
                                Hai scelto <strong>{categorie.find(c => c.slug === categoria)?.nome}</strong>
                            </p>
                            <p className="cat-descrizione-testo">
                                {categorie.find(c => c.slug === categoria)?.descrizione}
                                <br />
                                {categorie.find(c => c.slug === categoria)?.descrizione2}
                            </p>
                        </div>
                    )}

                    {/* STEP 2 — TITOLO */}
                    <div className="editor-step">
                        <p className="step-label">Titolo</p>
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
                        <p className="step-label">Sottotitolo</p>
                        <input
                            type="text"
                            className="editor-sottotitolo"
                            placeholder="Dai profondità a quello che vuoi dire... (opzionale)"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                        />
                    </div>

                    {/* STEP 3 — IMMAGINE COPERTINA */}
                    <div className="editor-step">
                        <p className="step-label">Immagine di copertina</p>
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
                        <p className="step-label">Contenuto</p>
                        <EditorToolbar
                            editor={editor}
                            onImageUpload={handleBodyImageUpload}
                        />

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
                        <p>Qui non pubblichi semplicemente un contenuto.</p>
                        <ul>
                            <li>Scrivi. Spiega. Racconta. </li>
                            <li>Qualcosa che meriti di essere ascoltato.</li>

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

export default Editor