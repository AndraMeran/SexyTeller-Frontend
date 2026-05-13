// componente toolbar riutilizzabile per Editor e EditorModifica
function EditorToolbar({ editor, onImageUpload }) {
    if (!editor) return null

    return (
        <div className="tiptap-toolbar">

            {/* ── FORMATTAZIONE TESTO ── */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Grassetto"
            >
                <strong>B</strong>
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Corsivo"
            >
                <em>I</em>
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("underline") ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Sottolineato"
            >
                <u>U</u>
            </button>

            <div className="toolbar-sep" />

            {/* ── GRANDEZZA CARATTERE ── */}
            <select
                className="toolbar-btn"
                value={
                    editor.isActive("heading", { level: 2 }) ? "grande" :
                        editor.isActive("heading", { level: 3 }) ? "medio" : "normale"
                }
                onChange={(e) => {
                    const val = e.target.value
                    if (val === "grande") {
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    } else if (val === "medio") {
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    } else {
                        editor.chain().focus().setParagraph().run()
                    }
                }}
                title="Grandezza testo"
                style={{ cursor: "pointer" }}
            >
                <option value="normale">Normale</option>
                <option value="medio">Medio</option>
                <option value="grande">Grande</option>
            </select>

            {/* ── TIPO DI CARATTERE ── */}
            <select
                className="toolbar-btn"
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                defaultValue=""
                title="Tipo di carattere"
                style={{ cursor: "pointer" }}
            >
                <option value="" disabled>Font</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="'Cormorant Garamond', serif">Cormorant</option>
                <option value="'Courier New', monospace">Courier</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Roboto Serif', serif">Roboto Serif</option>
            </select>

            <div className="toolbar-sep" />

            {/* ── ALLINEAMENTO ── */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "left" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="Allinea a sinistra"
            >
                <i className="bi bi-text-left"></i>
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="Centra"
            >
                <i className="bi bi-text-center"></i>
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="Allinea a destra"
            >
                <i className="bi bi-text-right"></i>
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "justify" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                title="Giustificato"
            >
                <i className="bi bi-justify"></i>
            </button>

            <div className="toolbar-sep" />

            {/* ── ELEMENTI ── */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("blockquote") ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Citazione"
            >
                ❝
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("bulletList") ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Lista"
            >
                ☰
            </button>

            <div className="toolbar-sep" />

            {/* ── IMMAGINI ── */}
            <label className="toolbar-btn" title="Immagine a sinistra">
                ◧ Img sinistra
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "left")}
                />
            </label>

            <label className="toolbar-btn" title="Immagine centrata">
                ☐ Img centro
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "center")}
                />
            </label>

            <label className="toolbar-btn" title="Immagine a destra">
                ◨ Img destra
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "right")}
                />
            </label>

            <div className="toolbar-sep" />

            {/* ── CRONOLOGIA ── */}
            <button
                type="button"
                className="toolbar-btn"
                onClick={() => editor.chain().focus().undo().run()}
                title="Annulla"
            >
                ↩
            </button>

            <button
                type="button"
                className="toolbar-btn"
                onClick={() => editor.chain().focus().redo().run()}
                title="Ripristina"
            >
                ↪
            </button>

        </div>
    )
}

export default EditorToolbar