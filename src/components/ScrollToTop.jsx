import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// componente che riporta la pagina in cima ad ogni navigazione
function ScrollToTop() {
    const { pathname } = useLocation() // legge l'URL corrente

    useEffect(() => {
        window.scrollTo(0, 0) // riporta in cima quando cambia URL
    }, [pathname]) // si attiva ad ogni cambio di pagina

    return null // non renderizza niente — è solo logica
}

export default ScrollToTop