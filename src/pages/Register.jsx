import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/api"
import { useAuth } from "../context/useAuth"
import "./Login.css"

function Register() {

    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        handle: "",
        email: "",
        password: "",
        birthDate: "",
        bio: "",
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const data = await registerUser(formData)

            if (data.token) {
                login(data.token)
                navigate("/")
            } else {
                setError(data.message || "Errore nella registrazione")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
    }

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <h1>Unisciti a SexyTeller</h1>
                <p className="auth-sub">Crea la tua identità editoriale.</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="il tuo nome"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Handle</label>
                        <input
                            type="text"
                            name="handle"
                            value={formData.handle}
                            onChange={handleChange}
                            placeholder="@nomeutente"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="la tua email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="btn-toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Data di nascita</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? "Registrazione in corso..." : "Diventa SexyTeller"}
                    </button>
                </form>

                <button onClick={handleGoogle} className="btn-google">
                    Continua con Google
                </button>

                <p className="auth-switch">
                    Hai già un account?{" "}
                    <Link to="/login">Accedi</Link>
                </p>
            </div>

            <div className="auth-quote-side">
                <blockquote>
                    "Non sei solo qui<br />per leggere.<br />Puoi raccontare."
                </blockquote>
            </div>
        </div>
    )
}

export default Register
