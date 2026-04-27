import { useContext } from "react"
import { AuthContext } from "./AuthContext"

export function useAuth() {// Questo è un hook personalizzato — invece di scrivere useContext(AuthContext) in ogni pagina, scriverò semplicemente useAuth().
    return useContext(AuthContext)
}