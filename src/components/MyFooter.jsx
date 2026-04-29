import { Link } from "react-router-dom"
import "./MyFooter.css"

function MyFooter() {
    return (
        <>
            <div className="footer-divider"></div>
            <footer className="footer">
                <span className="footer-copy">© SexyTeller 2026</span>

                <div className="footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link">
                        Facebook
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link">
                        Instagram
                    </a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="footer-social-link">
                        X
                    </a>
                </div>

                <span className="footer-made">Made by Andra M.</span>
            </footer>
        </>
    )
}

export default MyFooter