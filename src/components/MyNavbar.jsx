import { useState } from "react"
import { useAuth } from "../context/useAuth"
import { Link, useLocation } from "react-router-dom"
import "./MyNavbar.css"

// lista categorie con label da mostrare e slug per l'URL
const categorie = [
    { label: "Stories", slug: "stories" },
    { label: "Decode", slug: "decode" },
    { label: "Crossover", slug: "crossover" },
    { label: "Trends", slug: "trends" },
    { label: "Dark Side", slug: "darkside" },
    { label: "Voices", slug: "voices" },
]

function MyNavbar() {
    const { user, logout } = useAuth() // legge utente loggato e funzione logout dal context
    const location = useLocation() // legge l'URL corrente — serve per evidenziare la categoria attiva
    const [menuAuthOpen, setMenuAuthOpen] = useState(false) // controlla apertura hamburger auth su mobile
    const [menuCatOpen, setMenuCatOpen] = useState(false) // controlla apertura hamburger categorie su mobile
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false) // controlla apertura dropdown avatar

    // restituisce le iniziali del nome — es. "Maria Rossi" → "MR"
    const getInitials = (name) => {
        if (!name) return "ST"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // chiude tutti i menu aperti — usato quando si naviga
    const closeAll = () => {
        setMenuAuthOpen(false)
        setMenuCatOpen(false)
        setAvatarMenuOpen(false)
    }

    return (
        <nav className="navbar">

            {/* ── RIGA 1 ── */}
            <div className="navbar-top">

                {/* SINISTRA — Manifesto + campo ricerca */}
                <div className="navbar-left">
                    <Link to="/manifesto" className="btn-secondary" onClick={closeAll}>
                        Manifesto
                    </Link>
                    <input
                        type="text"
                        placeholder="Cerca..."
                        className="navbar-search"
                    />
                </div>

                {/* CENTRO — Logo */}
                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    SexyTeller
                </Link>

                {/* DESTRA — Desktop */}
                <div className="navbar-right navbar-desktop">
                    {user ? (
                        // utente loggato → mostra + Crea e avatar con dropdown
                        <>
                            <Link to="/crea" className="btn-primary">+ Crea</Link>

                            {/* avatar con menu a tendina */}
                            <div className="avatar-menu-wrapper">
                                <div
                                    className="navbar-avatar"
                                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                                >
                                    {getInitials(user.name)}
                                </div>

                                {/* dropdown — appare solo quando avatarMenuOpen è true */}
                                {avatarMenuOpen && (
                                    <div className="avatar-dropdown">
                                        <Link
                                            to={`/profilo/${user.handle}`}
                                            className="avatar-dropdown-item"
                                            onClick={closeAll}
                                        >
                                            Il mio profilo
                                        </Link>

                                        {/* link admin — visibile solo se isRedazione: true */}
                                        {user?.isRedazione && (
                                            <Link
                                                to="/admin"
                                                className="avatar-dropdown-item admin-link"
                                                onClick={closeAll}
                                            >
                                                Pannello Admin
                                            </Link>
                                        )}
                                        <Link
                                            to="/impostazioni"
                                            className="avatar-dropdown-item"
                                            onClick={closeAll}
                                        >
                                            Impostazioni
                                        </Link>
                                        <button
                                            className="avatar-dropdown-item avatar-logout"
                                            onClick={() => { logout(); closeAll() }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // utente non loggato → mostra Accedi e Diventa SexyTeller
                        <>
                            <Link to="/login" className="btn-secondary">Accedi</Link>
                            <Link to="/register" className="btn-primary">Diventa SexyTeller</Link>
                        </>
                    )}
                </div>

                {/* DESTRA — Mobile hamburger auth */}
                <div className="navbar-right navbar-mobile">
                    <button
                        className="hamburger"
                        onClick={() => {
                            setMenuAuthOpen(!menuAuthOpen)
                            setMenuCatOpen(false)
                        }}
                    >
                        {menuAuthOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* ── DROPDOWN AUTH MOBILE ── */}
            {/* appare solo su mobile quando hamburger auth è aperto */}
            {menuAuthOpen && (
                <div className="mobile-dropdown mobile-dropdown-auth">
                    {user ? (
                        <>
                            <Link to="/crea" className="btn-primary mobile-btn" onClick={closeAll}>
                                + Crea
                            </Link>
                            <Link to={`/profilo/${user.handle}`} className="navbar-link" onClick={closeAll}>
                                Il mio profilo
                            </Link>
                            <button className="navbar-link mobile-logout" onClick={() => { logout(); closeAll() }}>
                                Esci
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary mobile-btn" onClick={closeAll}>
                                Accedi
                            </Link>
                            <Link to="/register" className="btn-primary mobile-btn" onClick={closeAll}>
                                Diventa SexyTeller
                            </Link>
                        </>
                    )}
                </div>
            )}

            {/* ── RIGA 2 — CATEGORIE DESKTOP ── */}
            {/* visibile solo su desktop — ogni link evidenzia la categoria attiva */}
            <div className="navbar-cats navbar-desktop">
                {categorie.map((cat) => {
                    // controlla se l'URL corrente corrisponde alla categoria
                    const isActive = location.pathname === `/categoria/${cat.slug}`

                    return (
                        <Link
                            key={cat.slug}
                            to={`/categoria/${cat.slug}`}
                            className={`navbar-cat ${isActive ? "active" : ""}`}
                            onClick={closeAll}
                        >
                            {cat.label}
                        </Link>
                    )
                })}
            </div>

            {/* ── RIGA 2 — HAMBURGER CATEGORIE MOBILE ── */}
            {/* visibile solo su mobile */}
            <div className="navbar-cats-mobile navbar-mobile">
                <button
                    className="hamburger hamburger-cat"
                    onClick={() => {
                        setMenuCatOpen(!menuCatOpen)
                        setMenuAuthOpen(false)
                    }}
                >
                    {menuCatOpen ? "✕" : "☰"} Categorie
                </button>
            </div>

            {/* ── DROPDOWN CATEGORIE MOBILE ── */}
            {/* appare solo su mobile quando hamburger categorie è aperto */}
            {menuCatOpen && (
                <div className="mobile-dropdown mobile-dropdown-cats">
                    {categorie.map((cat) => {
                        const isActive = location.pathname === `/categoria/${cat.slug}`

                        return (
                            <Link
                                key={cat.slug}
                                to={`/categoria/${cat.slug}`}
                                className={`mobile-cat ${isActive ? "active" : ""}`}
                                onClick={closeAll}
                            >
                                {cat.label}
                            </Link>
                        )
                    })}
                </div>
            )}

        </nav>
    )
}

export default MyNavbar