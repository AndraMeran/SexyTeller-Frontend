// componente riutilizzabile per le immagini degli articoli
// gestisce automaticamente l'offuscamento per i contenuti sensibili
// props:
// - src: URL dell'immagine
// - alt: testo alternativo
// - isSensitive: true/false
// - className: classe CSS aggiuntiva per lo stile

function ArticleImage({ src, alt, isSensitive, className }) {
    // se non c'è immagine non mostra nulla
    if (!src) return null

    return (
        <div className="article-img-wrapper">
            <img
                src={src}
                alt={alt}
                className={`${className} ${isSensitive ? "img-sensitive" : ""}`}
            />
            {/* overlay con lucchetto — visibile solo se sensibile */}
            {isSensitive && (
                <div className="article-img-overlay">
                    <i className="bi bi-lock-fill"></i>
                    <span>Contenuto riservato ai 18+</span>
                </div>
            )}
        </div>
    )
}

export default ArticleImage