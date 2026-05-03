import "./Manifesto.css"

function Manifesto() {
    return (
        <div className="manifesto-page">
            {/* contenuto centrato con max-width stretto — effetto colonna tipografica stile Kinfolk */}
            <div className="manifesto-content">

                {/* label in piccolo sopra il titolo — stile editoriale */}
                <p className="manifesto-label">Il nostro manifesto</p>

                {/* titolo con gradiente — elemento più importante visivamente */}
                <h1 className="manifesto-title">SexyTeller</h1>

                {/* corpo del testo — alternanza tra testo normale e grassetto */}
                {/* il grassetto crea ritmo visivo e enfatizza i concetti chiave */}
                <div className="manifesto-body">
                    <p>Il sesso è ovunque.</p>
                    <p>Ma nessuno lo racconta davvero.</p>
                    <p>
                        È nei film, nella musica, nella moda, nei social,
                        nelle ossessioni quotidiane. Eppure viene nascosto,
                        censurato, ridicolizzato o ridotto a qualcosa di superficiale.
                    </p>
                    <p>
                        Nel mainstream la violenza non ha limiti.
                        Si può mostrare fino in fondo.
                        Il sesso si interrompe sempre un attimo prima.
                    </p>
                    <p>La violenza è spettacolo. Il sesso è imbarazzo.</p>
                    <p>E questo dice molto più di quello che sembra.</p>
                    <p>SexyTeller nasce qui.</p>
                    <p>
                        Per fare luce su un mondo che tutti guardano,
                        ma pochi hanno il coraggio di affrontare davvero.
                    </p>
                    <p>
                        Pornografia, erotismo, sessualità.
                        Non li osserviamo da fuori. Ci entriamo dentro.
                    </p>
                    <p>Raccontiamo le storie dietro le immagini.</p>
                    <p>Le persone dietro i personaggi.</p>
                    <p>Le verità dietro i pregiudizi.</p>
                    <p>Senza filtri. Senza maschere.</p>
                    <p>
                        Perché il sesso non è solo consumo.
                        È immaginario, identità, cultura.
                    </p>
                    <p>SexyTeller nasce per cambiare questo.</p>
                </div>

                <p className="manifesto-chiusura">
                    In un mondo che guarda,
                    noi raccontiamo.
                </p>

            </div>
        </div>
    )
}

export default Manifesto
