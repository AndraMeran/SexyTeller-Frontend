import { useState } from "react"
import { useAuth } from "../context/useAuth"
import { Link, useLocation } from "react-router-dom"
import "./MyNavbar.css"

const categorie = [
    { label: "Stories", slug: "stories" },
    { label: "Decode", slug: "decode" },
    { label: "Crossover", slug: "crossover" },
    { label: "Trends", slug: "trends" },
    { label: "Dark Side", slug: "darkside" },
    { label: "Voices", slug: "voices" },
]

function MyNavbar() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [menuAuthOpen, setMenuAuthOpen] = useState(false)
    const [menuCatOpen, setMenuCatOpen] = useState(false)
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)

    const getInitials = (name) => {
        if (!name) return "ST"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const closeAll = () => {
        setMenuAuthOpen(false)
        setMenuCatOpen(false)
    }

    return (
        <nav className="navbar">

            {/* ── RIGA 1 ── */}
            <div className="navbar-top">
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

                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    SexyTeller
                </Link>

                {/* Desktop — riga 1 destra */}
                <div className="navbar-right navbar-desktop">
                    {user ? (
                        <>
                            <Link to="/crea" className="btn-primary">+ Crea</Link>
                            {/* <Link to={`/@${user.handle}`} className="navbar-avatar">
                                {getInitials(user.name)}
                            </Link> */}

                            <div className="avatar-menu-wrapper">
                                <div
                                    className="navbar-avatar"
                                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                                >
                                    {getInitials(user.name)}
                                </div>

                                {avatarMenuOpen && (
                                    <div className="avatar-dropdown">
                                        <Link
                                            to={`/@${user.handle}`}
                                            className="avatar-dropdown-item"
                                            onClick={() => setAvatarMenuOpen(false)}
                                        >
                                            Il mio profilo
                                        </Link>
                                        <Link
                                            to="/impostazioni"
                                            className="avatar-dropdown-item"
                                            onClick={() => setAvatarMenuOpen(false)}
                                        >
                                            Impostazioni
                                        </Link>
                                        <button
                                            className="avatar-dropdown-item avatar-logout"
                                            onClick={() => { logout(); setAvatarMenuOpen(false) }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary">Accedi</Link>
                            <Link to="/register" className="btn-primary">Diventa SexyTeller</Link>
                        </>
                    )}
                </div>

                {/* Mobile — hamburger riga 1 */}
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

            {/* Mobile — dropdown auth */}
            {menuAuthOpen && (
                <div className="mobile-dropdown mobile-dropdown-auth">
                    {user ? (
                        <>
                            <Link to="/crea" className="btn-primary mobile-btn" onClick={closeAll}>
                                + Crea
                            </Link>
                            <Link to={`/@${user.handle}`} className="navbar-link" onClick={closeAll}>
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

            {/* ── RIGA 2 — CATEGORIE desktop ── */}
            <div className="navbar-cats navbar-desktop">
                {categorie.map((cat) => {
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
            {/* ── RIGA 2 — mobile con hamburger ── */}
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

            {/* Mobile — dropdown categorie */}
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