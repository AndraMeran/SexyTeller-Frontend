import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext() //componente interno di React 

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)//i dati del utente loggato, parte da null, nessun loggato
    const [token, setToken] = useState(localStorage.getItem("token") || null)//qui cerca il JWT nel localstorage, se c'è lo usa se no parte da null

    useEffect(() => {//qui ogni volta che token cambia, legge i dati dell'utente dal token e li salva in user
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]))
                setUser(payload)
            } catch {
                logout()
            }
        }
    }, [token])

    function login(newToken) {
        localStorage.setItem("token", newToken)//salva il token nel localstorage
        setToken(newToken)//aggiorna la variabile toke - aggiorna lo stato
        const payload = JSON.parse(atob(newToken.split(".")[1]))//legge i dati dal token - nome, handle, isRedazione ecc
        setUser(payload)//salva i dati in usr cosi tutta l'app sa chi è loggato
    }

    function logout() {
        localStorage.removeItem("token")//cancella il token dal localStorage
        setToken(null)// azzera il token
        setUser(null)//azzera user - nessun loggato
    }

    return (//AuthContext.Provider è il componente che "avvolge" tutta l'app e mette a disposizione di tutti: user, token, login, logout
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider> // queato  children significa " tutto quello che c'è dentro" - cioè tutta l'app
    )
}

