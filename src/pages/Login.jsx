import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser, getGoogleAuthUrl } from "../services/api"
import { useAuth } from "../context/useAuth"
import "./Login.css"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const data = await loginUser(formData)

            if (data.token) {
                login(data.token)
                navigate("/")
            } else {
                setError(data.message || "Email o password errati")
            }
        } catch (err) {
            setError("Problema di connessione, riprova")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = () => {
        window.location.href = getGoogleAuthUrl()
    }

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <h1>Bentornato</h1>
                <p className="auth-sub">Accedi al tuo spazio SexyTeller.</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? "Accesso in corso..." : "Accedi"}
                    </button>
                </form>

                <button onClick={handleGoogle} className="btn-google">
                    Continua con Google
                </button>

                <p className="auth-switch">
                    Non hai un account?{" "}
                    <Link to="/register">Iscriviti — è gratis</Link>
                </p>
            </div>

            <div className="auth-quote-side">
                <blockquote>
                    "In un mondo che guarda,<br />noi raccontiamo."
                </blockquote>
            </div>
        </div>
    )
}

export default Login
