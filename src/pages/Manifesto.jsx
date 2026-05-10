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
                    <p>Il sesso è ovunque.<br />Ma nessuno lo racconta davvero.</p>

                    <p>È nei film, nella musica, nella moda, nei social, nelle ossessioni quotidiane.</p>

                    <p>Eppure viene nascosto, censurato, ridicolizzato o ridotto a qualcosa di superficiale.</p>

                    <p>Nel mainstream la violenza non ha limiti.<br />Si può mostrare fino in fondo.<br />Il sesso si interrompe sempre un attimo prima.</p>

                    <p>La violenza è spettacolo.<br />Il sesso è imbarazzo.</p>

                    <p>E questo dice molto più di quello che sembra.</p>

                    <p>SexyTeller nasce qui.</p>

                    <p>Per fare luce su un mondo che tutti guardano, ma pochi hanno il coraggio di affrontare davvero.</p>

                    <p>Sessualità, erotismo, pornografia.<br />Non li osserviamo da fuori.<br />Ci entriamo dentro.</p>

                    <p>Raccontiamo le storie dietro le immagini.<br />Le persone dietro i personaggi.<br />Le verità dietro i pregiudizi.</p>

                    <p>Parliamo di ciò che esiste da sempre.<br />Senza filtri. Senza maschere.</p>

                    <p>Perché il sesso non è solo consumo.<br />È immaginario, identità, cultura.</p>

                    <p>Per troppo tempo è stato trattato male.<br />Senza visione. Senza rispetto.</p>

                    <p>SexyTeller nasce per cambiare questo.</p>

                    <p>Per dare parole a un mondo fatto di immagini.<br />Per prendere sul serio ciò che tutti trattano con leggerezza.<br />Per normalizzare ciò che è sempre stato umano.</p>
                    <p>
                        In un mondo che guarda,<br />
                        noi raccontiamo.
                    </p>

                </div>



            </div>
        </div>
    )
}

export default Manifesto
