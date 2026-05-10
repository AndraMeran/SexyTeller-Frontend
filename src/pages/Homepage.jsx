import { Link } from "react-router-dom"
import "./Homepage.css"
import { useState, useEffect } from "react"
import { getFeaturedArticles, getArticles } from "../services/api"
import ArticleImage from "../components/ArticleImage"
import "../components/ArticleImage.css"

const categories = [
    {
        title: "Stories",
        slug: "stories",
        verbo: "Raccontare",
        text: "Storie che seguono un filo dall'inizio alla fine.",
        className: "cat-stories",
    },
    {
        title: "Decode",
        slug: "decode",
        verbo: "Spiegare",
        text: "Andare oltre la superficie, fino a capire davvero.",
        className: "cat-decode",
    },
    {
        title: "Crossover",
        slug: "crossover",
        verbo: "Collegare",
        text: "Quando altri mondi finiscono qui, e cambiano significato.",
        className: "cat-crossover",
    },
    {
        title: "Trends",
        slug: "trends",
        verbo: "Aggiornare",
        text: "Ciò che succede ora, mentre sta cambiando.",
        className: "cat-trends",
    },
    {
        title: "Dark Side",
        slug: "darkside",
        verbo: "Approfondire",
        text: "La parte più complessa, quella che non si evita.",
        className: "cat-darkside",
    },
    {
        title: "Voices",
        slug: "voices",
        verbo: "Dare voce",
        text: "Quando a parlare sono gli altri, non solo tu.",
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
    const [featuredArticles, setFeaturedArticles] = useState([])//contiene gli articoli che arrivanodal backend, parte vuota
    const [loading, setLoading] = useState(true)//dice se stiamo ancora la rispota, parte true 
    const [error, setError] = useState(null)//se qlc va male, salva il messaggio di errore 
    const [heroArticle, setHeroArticle] = useState(null) // articolo della redazione per la hero

    // sceglie un articolo della redazione in modo deterministico
    // cambia ogni 3 giorni — stesso articolo per tutti gli utenti
    const getHeroArticle = (articles) => {
        const redazione = articles.filter(a => a.isRedazione === true)
        if (!redazione.length) return null
        const treGiorni = 3 * 24 * 60 * 60 * 1000
        const indice = Math.floor(Date.now() / treGiorni) % redazione.length
        return redazione[indice]
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featured, all] = await Promise.all([
                    getFeaturedArticles(),
                    getArticles() // prende tutti gli articoli
                ])
                setFeaturedArticles(featured)
                setHeroArticle(getHeroArticle(all)) // sceglie l'articolo hero
            } catch (err) {
                setError("Errore nel caricamento degli articoli")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="homepage">

            {/* HERO */}
            <section className="home-hero">
                <div className="hero-copy">
                    <h1>
                        <span className="hero-h1-first">In un mondo che guarda,</span>
                        <span>noi raccontiamo.</span>
                    </h1>

                    <p>
                        <span>SexyTeller non è solo un sito.</span>
                        <span>Non è solo un social.</span>
                        <span>È un nuovo modo di raccontare il sesso.</span>
                    </p>

                    <Link to="/categoria/stories" className="home-btn">
                        Clicca qui per saperne di più <span>→</span>
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
                    {heroArticle ? (
                        <Link to={`/articolo/${heroArticle._id}`} className="hero-card-link">
                            <span className="tag">{heroArticle.category}</span>
                            {heroArticle.coverImage && (
                                <img
                                    src={heroArticle.coverImage}
                                    alt={heroArticle.title}
                                    className="hero-card-bg-img"
                                />
                            )}
                            <div className="hero-card-content">
                                <h2>{heroArticle.title}</h2>
                                <p>
                                    di {heroArticle.author?.name}
                                    <span></span>
                                    {heroArticle.readTime} min di lettura
                                </p>
                                <span className="hero-read-link">
                                    Leggi l'articolo →
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="hero-card-content">
                            <h2>Benvenuto su SexyTeller</h2>
                        </div>
                    )}
                </article>
            </section>

            <section className="featured-section">
                <div className="section-title">
                    <h2>Le voci di Sexyteller</h2>
                    <Link to="/categoria/stories">Vedi tutti gli articoli →</Link>
                </div>

                {loading && (
                    <p style={{ color: "#A8A0C0" }}>Caricamento articoli...</p>
                )}

                {error && (
                    <p style={{ color: "#FF4DA6" }}>{error}</p>
                )}

                {!loading && !error && (
                    <div className="featured-layout">
                        {featuredArticles.length > 0 ? (
                            <>
                                <Link to={`/articolo/${featuredArticles[0]?._id}`}>
                                    <ArticleImage
                                        src={featuredArticles[0]?.coverImage}
                                        alt={featuredArticles[0]?.title}
                                        isSensitive={featuredArticles[0]?.isSensitive}
                                        className="featured-image"
                                    />
                                </Link>

                                <article className="featured-main">
                                    <span className="tag">{featuredArticles[0]?.category}</span>
                                    <h3>{featuredArticles[0]?.title}</h3>
                                    <p className="article-meta">
                                        di {featuredArticles[0]?.author?.name}
                                        <span></span>
                                        {featuredArticles[0]?.readTime} min di lettura
                                    </p>
                                    <Link to={`/articolo/${featuredArticles[0]?._id}`}>
                                        Leggi l'articolo →
                                    </Link>
                                </article>

                                <div className="featured-list">
                                    {featuredArticles.slice(1).map((article) => (
                                        <Link
                                            key={article._id}
                                            to={`/articolo/${article._id}`}
                                            className="small-article"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <ArticleImage
                                                src={article.coverImage}
                                                alt={article.title}
                                                isSensitive={article.isSensitive}
                                                className="small-thumb"
                                                small={true}
                                            />
                                            <div>
                                                <span>{article.category}</span>
                                                <h4>{article.title}</h4>
                                                <p>
                                                    di {article.author?.name} · {article.readTime} min
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p style={{ color: "#A8A0C0" }}>
                                Nessun articolo in evidenza al momento.
                            </p>
                        )}
                    </div>
                )}
            </section>

            {/* MANIFESTO + CATEGORIE MOSAICO */}
            <section className="manifesto-categories">
                <aside className="manifesto-card">
                    <h2>Il nostro manifesto</h2>
                    <Link to="/manifesto">
                        Leggi il manifesto <span>→</span>
                    </Link>
                    <div className="small-line"></div>
                    <p>
                        SexyTeller non divide i contenuti per argomento, ma per modo di raccontarli.
                    </p>
                    <strong>

                        <br />

                    </strong>

                </aside>

                <div className="category-mosaic">
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/categoria/${cat.slug}`}
                            className={`category-tile ${cat.className}`}
                        >
                            <h3>{cat.title}</h3>
                            <span className="cat-verbo">{cat.verbo}</span> {/* ← aggiunto */}
                            <p>{cat.text}</p>
                            <span>Esplora →</span>
                        </Link>
                    ))}
                </div>
            </section>




            {/* CTA FINALE */}
            < section className="join-section" >
                <div className="join-copy">
                    <h2>
                        Non sei solo qui per leggere.
                        <br />
                        Puoi essere parte di tutto questo.
                    </h2>
                    <p>
                        SexyTeller non è solo un nome.
                        <br />
                        È una voce.

                        E può essere anche la tua.

                    </p>
                    <Link to="/register" className="home-btn">
                        Diventa SexyTeller <span>→</span>
                    </Link>
                </div>
            </section >

        </div >
    )
}

export default Homepage