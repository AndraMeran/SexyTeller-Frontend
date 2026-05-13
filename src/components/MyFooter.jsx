import { Link } from "react-router-dom"
import "./MyFooter.css"

function MyFooter() {
    return (
        <>
            <div className="footer-divider"></div>
            <footer className="footer">

                {/* ── SEZIONE BRAND ── */}
                <div className="footer-brand">
                    <span className="footer-logo">SexyTeller</span>
                    <p className="footer-tagline">
                        In un mondo che guarda, noi raccontiamo.
                    </p>
                    <div className="footer-social">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="footer-social-link">
                            <i className="bi bi-tiktok"></i>
                        </a>
                    </div>
                </div>



                {/* ── SEZIONE CHI SIAMO ── */}
                <div className="footer-col">
                    <p className="footer-col-title">Chi siamo</p>
                    <Link to="/manifesto" className="footer-link">Il nostro manifesto</Link>
                    <Link to="/register" className="footer-link">Diventa SexyTeller</Link>
                </div>

                {/* ── SEZIONE CONTATTI ── */}
                <div className="footer-col">
                    <p className="footer-col-title">Contatti</p>
                    <a href="mailto:info@sexyteller.com" className="footer-link">
                        <i className="bi bi-envelope"></i> info@sexyteller.com
                    </a>
                    <a href="mailto:support@sexyteller.com" className="footer-link">
                        <i className="bi bi-headset"></i> Supporto utenti
                    </a>
                    <a href="mailto:claim@sexyteller.com" className="footer-link">
                        <i className="bi bi-flag"></i> Segnalazioni
                    </a>
                </div>

                {/* ── SEZIONE LEGALE ── */}
                <div className="footer-col">
                    <p className="footer-col-title">Legale</p>
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Cookie Policy</a>
                    <a href="#" className="footer-link">Termini e Condizioni</a>

                </div>

            </footer>

            {/* ── COPYRIGHT ── */}
            <div className="footer-bottom">
                <span>© SexyTeller 2026</span>

            </div>
        </>
    )
}

export default MyFooter