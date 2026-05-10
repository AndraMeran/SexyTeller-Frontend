import { useState } from "react"
import { useAuth } from "../context/useAuth"
import { Link, useLocation, useNavigate } from "react-router-dom" // ← useNavigate aggiunto qui
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
    const navigate = useNavigate() // ← aggiunto
    const [menuAuthOpen, setMenuAuthOpen] = useState(false)
    const [menuCatOpen, setMenuCatOpen] = useState(false)
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("") // ← aggiunto

    const getInitials = (name) => {
        if (!name) return "ST"
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    }

    const closeAll = () => {
        setMenuAuthOpen(false)
        setMenuCatOpen(false)
        setAvatarMenuOpen(false)
    }

    // gestisce la ricerca — naviga a /cerca quando premi Invio
    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/cerca?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery("")
            closeAll()
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <div className="navbar-left">
                    <div className="navbar-search-wrapper">
                        <i className="bi bi-search navbar-search-icon"></i>
                        <input
                            type="text"
                            placeholder="Cerca qualsiasi cosa..."
                            className="navbar-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    SexyTeller
                </Link>

                <div className="navbar-right navbar-desktop">
                    {user ? (
                        <>
                            <Link to="/crea" className="btn-primary">+ Crea</Link>
                            <div className="avatar-menu-wrapper">
                                <div
                                    className="navbar-avatar"
                                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                                >
                                    {getInitials(user.name)}
                                </div>
                                {avatarMenuOpen && (
                                    <div className="avatar-dropdown">
                                        <Link to={`/profilo/${user.handle}`} className="avatar-dropdown-item" onClick={closeAll}>
                                            Il mio profilo
                                        </Link>
                                        {user?.isRedazione && (
                                            <Link to="/admin" className="avatar-dropdown-item admin-link" onClick={closeAll}>
                                                Pannello Admin
                                            </Link>
                                        )}
                                        <Link to="/impostazioni" className="avatar-dropdown-item" onClick={closeAll}>
                                            Impostazioni
                                        </Link>
                                        <button className="avatar-dropdown-item avatar-logout" onClick={() => { logout(); closeAll() }}>
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

            {menuAuthOpen && (
                <div className="mobile-dropdown mobile-dropdown-auth">
                    {user ? (
                        <>
                            <Link to="/crea" className="btn-primary mobile-btn" onClick={closeAll}>+ Crea</Link>
                            <Link to={`/profilo/${user.handle}`} className="navbar-link" onClick={closeAll}>Il mio profilo</Link>
                            <button className="navbar-link mobile-logout" onClick={() => { logout(); closeAll() }}>Esci</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary mobile-btn" onClick={closeAll}>Accedi</Link>
                            <Link to="/register" className="btn-primary mobile-btn" onClick={closeAll}>Diventa SexyTeller</Link>
                        </>
                    )}
                </div>
            )}

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