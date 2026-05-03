// componente toolbar riutilizzabile per Editor e EditorModifica
function EditorToolbar({ editor, onImageUpload }) {
    if (!editor) return null

    return (
        <div className="tiptap-toolbar">
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
                className={`toolbar-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Titolo"
            >
                H2
            </button>

            <button
                type="button"
                className={`toolbar-btn ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Sottotitolo"
            >
                H3
            </button>
            <div className="toolbar-sep" />

            {/* allineamento sinistra */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "left" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="Allinea a sinistra"
            >
                <i className="bi bi-text-left"></i>
            </button>

            {/* allineamento centro */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="Centra"
            >
                <i className="bi bi-text-center"></i>
            </button>

            {/* allineamento destra */}
            <button
                type="button"
                className={`toolbar-btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="Allinea a destra"
            >
                <i className="bi bi-text-right"></i>
            </button>

            <div className="toolbar-sep" />

            <div className="toolbar-sep" />

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

            <label className="toolbar-btn" title="Immagine a sinistra">
                ◧ Add Img sinistra
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "left")}
                />
            </label>

            <label className="toolbar-btn" title="Immagine centrata">
                ☐ Add Img centro
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "center")}
                />
            </label>

            <label className="toolbar-btn" title="Immagine a destra">
                ◨ Add Img destra
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onImageUpload(e, "right")}
                />
            </label>

            <div className="toolbar-sep" />

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