import { Link } from "react-router-dom"
import "./Homepage.css"

const categories = [
    {
        title: "Stories",
        slug: "stories",
        text: "Vite vere, raccontate senza filtri.",
        className: "cat-stories",
    },
    {
        title: "Decode",
        slug: "decode",
        text: "Capire il sesso, oltre i tabù.",
        className: "cat-decode",
    },
    {
        title: "Crossover",
        slug: "crossover",
        text: "Quando il sesso incontra la cultura.",
        className: "cat-crossover",
    },
    {
        title: "Trends",
        slug: "trends",
        text: "Temi caldi, nuove prospettive.",
        className: "cat-trends",
    },
    {
        title: "Dark Side",
        slug: "darkside",
        text: "Quello che nessuno dice.",
        className: "cat-darkside",
    },
    {
        title: "Voices",
        slug: "voices",
        text: "Le voci della nostra community.",
        className: "cat-voices",
    },
]

const smallArticles = [
    {
        category: "Decode",
        title: "Consenso: parliamone senza paura",
        author: "Sara B.",
        time: "4 min",
    },
    {
        category: "Dark Side",
        title: "Quando il porno non è la realtà",
        author: "Mark D.",
        time: "6 min",
    },
    {
        category: "Voices",
        title: "Lettera a me stessa, a 20 anni",
        author: "Giulia R.",
        time: "3 min",
    },
]

function Homepage() {
    return (
        <div className="homepage">

            {/* HERO */}
            <section className="home-hero">
                <div className="hero-copy">
                    <h1>
                        Il sesso è ovunque.
                        <span>Ma nessuno lo racconta davvero.</span>
                    </h1>

                    <p>
                        SexyTeller è lo spazio dove le storie incontrano la verità.
                        Senza filtri.
                    </p>

                    <Link to="/categoria/stories" className="home-btn">
                        Scopri le storie <span>→</span>
                    </Link>

                    <div className="community-row">
                        <div className="fake-avatars">
                            <span>A</span>
                            <span>M</span>
                            <span>S</span>
                            <span>G</span>
                        </div>
                        <p>
                            <strong>10K+ SexyTeller</strong>
                            fanno parte della community
                        </p>
                    </div>
                </div>

                <article className="hero-card">
                    <span className="tag">Stories</span>
                    <div className="hero-card-content">
                        <h2>Desiderio e libertà: una questione di scelta</h2>
                        <p>di Andra M. <span></span> 5 min di lettura</p>
                    </div>
                    <div className="stamp">✶</div>
                </article>
            </section>

            {/* MANIFESTO + CATEGORIE MOSAICO */}
            <section className="manifesto-categories">
                <aside className="manifesto-card">
                    <h2>Il nostro manifesto</h2>
                    <div className="small-line"></div>
                    <p>
                        Crediamo che parlare di sesso significhi parlare di libertà,
                        consenso, piacere, identità.
                    </p>
                    <strong>
                        Niente moralismi.
                        <br />
                        Solo storie vere.
                    </strong>
                    <Link to="/manifesto">
                        Leggi il manifesto <span>→</span>
                    </Link>
                </aside>

                <div className="category-mosaic">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/categoria/${cat.slug}`}
                            className={`category-tile ${cat.className}`}
                        >
                            <h3>{cat.title}</h3>
                            <p>{cat.text}</p>
                            <span>Esplora →</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SCELTI DA SEXYTELLER */}
            <section className="featured-section">
                <div className="section-title">
                    <h2>Scelti da SexyTeller</h2>
                    <Link to="/categoria/stories">Vedi tutti gli articoli →</Link>
                </div>

                <div className="featured-layout">
                    <div className="featured-image"></div>

                    <article className="featured-main">
                        <span className="tag">Stories</span>
                        <h3>Il primo bacio non si scorda mai?</h3>
                        <p className="article-meta">di Laura P. <span></span> 7 min di lettura</p>
                        <p>
                            Quella scarica elettrica, il respiro che cambia,
                            il mondo che si ferma per un secondo. Raccontaci il tuo.
                        </p>
                        <Link to="/articolo/demo">Leggi l’articolo →</Link>
                    </article>

                    <div className="featured-list">
                        {smallArticles.map((article) => (
                            <article key={article.title} className="small-article">
                                <div className="small-thumb"></div>
                                <div>
                                    <span>{article.category}</span>
                                    <h4>{article.title}</h4>
                                    <p>
                                        di {article.author} · {article.time}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINALE */}
            <section className="join-section">
                <div className="join-copy">
                    <span>Diventa SexyTeller</span>
                    <h2>
                        Non sei solo qui per leggere.
                        <br />
                        Sei qui per <em>raccontare.</em>
                    </h2>
                    <p>
                        Unisciti alla community, condividi la tua voce
                        e lascia il segno.
                    </p>
                    <Link to="/register" className="home-btn">
                        Diventa SexyTeller <span>→</span>
                    </Link>
                </div>
            </section>

        </div>
    )
}

export default Homepage