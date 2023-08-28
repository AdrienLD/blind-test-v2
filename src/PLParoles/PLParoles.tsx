import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import './PLParoles.css'
import Countdown from '../Components/VisuelQuestion/Countdown/Countdown'

function PLParoles() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
    const [affichage, setAffichage] = React.useState(0)
    const [infiniteloop, setInfiniteloop] = React.useState(false)
    const lyrics = React.useRef<Array<{ startTimeMs: string, words: string }>>([]);
    const position = React.useRef(0);
    const timestart = React.useRef(0);
    const [startmusic, setStartmusic] = React.useState(false)
    const [lyricsJSX, setLyricsJSX] = React.useState<React.ReactElement | null>(null);
    const location = useLocation()
    const receivedData: Musique[] = location.state?.playlist;
    let affichagesuivant = 4
    function transformString(input: string) {
        return input.split('').map(char => {
            if (char === ' ') {
                return ' ';
            } else if (char.match(/[a-zA-Zéïèàùç]/)) {
                return '-';
            } else {
                return char;
            }
        }).join('');
    }

    React.useEffect(() => {
        console.log('musiqueActuelle', startmusic);
        if (!startmusic) return;

        let isCancelled = false; // Pour suivre si le composant est démonté

        const updateLyrics = async () => {
            if (!lyrics.current) return;
            while (position.current < lyrics.current.length && !isCancelled) {
                const currLyric = lyrics.current[position.current];
                const nextLyric = lyrics.current[position.current + 1];
                if (!currLyric || !nextLyric) break;
                console.log('lyrics', lyrics.current, position.current, currLyric, nextLyric)

                console.log('Adrien', affichagesuivant)
                setLyricsJSX(
                    <div className='paroles'>
                        <div className="secondaires">
                            {affichagesuivant < 0 ? lyrics.current[position.current - 3]?.words : '   '}

                        </div>
                        <div className="secondaires">
                            {affichagesuivant < 0 ? lyrics.current[position.current - 2]?.words : '   '}

                        </div>
                        <div className="secondaires">
                            {lyrics.current[position.current - 1] ? lyrics.current[position.current - 1].words : '   '}

                        </div>
                        <div className="primaires">
                            {affichagesuivant === -1 ? transformString(lyrics.current[position.current]?.words) : lyrics.current[position.current]?.words}
                        </div>
                        <div className="secondaires">
                            {affichagesuivant >= 0 ? affichagesuivant === 0 ? transformString(lyrics.current[position.current + 1]?.words) : lyrics.current[position.current + 1]?.words : '   '}
                        </div>
                        <div className="secondaires">
                            {affichagesuivant >= 1 ? affichagesuivant === 1 ? transformString(lyrics.current[position.current + 2]?.words) : lyrics.current[position.current + 2]?.words : '   '}
                        </div>
                        <div className="secondaires">
                            {affichagesuivant >= 2 ? affichagesuivant === 2 ? transformString(lyrics.current[position.current + 3]?.words) : lyrics.current[position.current + 3]?.words : '   '}
                        </div>
                    </div>

                )

                if (affichagesuivant < 0) {
                    await getpause('pause', 'PUT')
                    setStartmusic(false)
                    break
                }
                position.current++;
                infiniteloop === false ? affichagesuivant-- : affichagesuivant++
                
                await sleep(parseInt(nextLyric.startTimeMs) - parseInt(currLyric.startTimeMs));
            }
        };

        updateLyrics();

        return () => {
            isCancelled = true; // Mettre à jour le flag lors du nettoyage
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startmusic, lyrics, position, setLyricsJSX, musiqueActuelle]);





    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getpause(commande: string, method: string) {
        const token = localStorage.getItem('token')!
        try {
            await fetch('http://localhost:4000/api/playpause', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: token,
                    command: commande,
                    method: method
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error)
            throw error
        }
    }

    async function gettoken() {
        const code = localStorage.getItem('access_code');
        try {

            const response = await fetch('http://localhost:4000/api/gettoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code
                })
            });
            const data = await response.json();
            await console.log('responseAdrien', data);
            await localStorage.setItem('token', data.access_token);

        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error);
            throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
        }
    }

    async function getlyricsId() {
        try {
            const response = await fetch('http://localhost:4000/api/getlyricsId', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    titreid: receivedData[musiqueActuelle].id
                }
            });
            const data = await response.json();
            return data;  // Retourner les données reçues

        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error);
            throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
        }
    }

    async function testtoken() {
        const token = localStorage.getItem('token')!
        try {
            const response = await fetch('http://localhost:4000/api/testtoken', {
                method: 'GET',
                headers: {
                    token: token
                }
            });
            const data = await response.json();
            if (data.error?.status === 401) await gettoken();
            await console.log('responseAdrien', data);
        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error)
            throw error
        }
    }

    const getRandomStartTime = async () => {
        const limit = receivedData[musiqueActuelle].duration * 0.5
        const debut = Math.floor(Math.random() * limit)
        const paroles = await getlyricsId()
        if (paroles.error === false) {
            let i = 0
            while (parseInt(paroles.lines[i].startTimeMs) < debut) {
                console.log('lyrics i', paroles.lines[i].startTimeMs, i)
                i++
            }
            getpause('next', 'POST')
            await getpause(`seek?position_ms=${paroles.lines[i].startTimeMs}`, 'PUT')
            lyrics.current = paroles.lines
            position.current = i
            timestart.current = parseInt(paroles.lines[i].startTimeMs)
            console.log('lyrics', lyrics.current)
        }

    }



    const startmusique = async () => {
        await testtoken()
        await getpause(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
        await sleep(100)
        await getRandomStartTime()
        await setAffichage(1)
        affichagesuivant = 3
        setStartmusic(true)
    }

    const continuer = async () => {
        setInfiniteloop(true)
        setStartmusic(true)
        await getpause('play', 'PUT')
    }

    const response = async () => {
        setLyricsJSX(
            <div className='paroles'>
                <div className="secondaires">
                    {lyrics.current[position.current - 1] ? lyrics.current[position.current - 1].words : '   '}

                </div>
                <div className="primaires">
                    {lyrics.current[position.current]?.words}
                </div>
                <button onClick={() => continuer()}>Continuer</button>
            </div>

        )
    }

    const nextmusique = async () => {
        await testtoken()
        await getpause('pause', 'PUT')
        setMusiqueActuelle(musiqueActuelle + 1)
        setStartmusic(false)
        setInfiniteloop(false)
        setAffichage(0)

    }


    return (
        <div>
            <h1>N'Oubliez pas les Paroles !</h1>
            <script type="text/javascript" src="https://tracking.musixmatch.com/t1.0/m_img/e_1/sn_0/l_19915235/su_0/rs_0/tr_3vUCADZOeQ2EJZus_nq7GH01wP79qOxU-KWYz3bsrUtZ9_14VvzJM6e48M0i-V0_D17XhCqc4KoDkUTfWRWrFSa3ZRaeS8-UkymCNQntabWoeSZQMic7SuKwzoSLsBh6LeQ5TrPqTkzuDNDqlPb547uzG1-aOSdsrOAfM4z4EO-6phAf-Xs2Z1fA_hwVGTxahZ8VIecsHnQOvQLuq4uE7ku1I8ez_jQUBIiFV1dFepqUOA3D0hFVtd2VXbwurF4-MYtYkReTr5bjcDFwe6NV2HQvBuD0ddXwtpH4IE9mnnnNGHDp85eEVlCegDKHyM1hpH-qWERgcPkM8n1kKM13sJAU2Qw5tbTxoyhYI96pMLYoGG_8qV2MRHj8lI7mMTlLVPn_LD3VMqUlXV6UXtFNUsxEC75iLSGQcJp_/"></script>
            {
                affichage < 2 ?
                    <div className='VisuelQuestion'>
                        <img src={receivedData[musiqueActuelle].albumimg} alt='pochette playlist' className='PochetteAlbum' />
                        <div className="infos">
                            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].titre}</p>
                            {affichage === 0 ? <Countdown onFinish={() => startmusique()} timer={0} /> :
                                <div>
                                    {lyricsJSX}
                                    <button onClick={() => nextmusique()}>Passer</button>
                                    <button onClick={() => response()}>Réponse</button>
                                </div>
                            }
                        </div>
                    </div> :
                    <div className='VisuelQuestion'>
                        <img src={receivedData[musiqueActuelle].albumimg} alt='pochette playlist' className='PochetteAlbum' />
                        <div className="infos">
                            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].titre}</p>
                            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].artiste}</p>
                            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].album}</p>
                            {
                                <div>
                                    <button onClick={nextmusique}>Musique suivante</button>
                                </div>
                            }
                        </div>
                    </div>
            }
        </div>
    );
}

export default PLParoles;