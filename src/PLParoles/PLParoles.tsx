import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import './PLParoles.css'
import Countdown from '../Components/VisuelQuestion/Countdown/Countdown';
import LyricsClient from "sync-lyrics"
import { get } from 'http';

function PLParoles() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
    const [affichage, setAffichage] = React.useState(0)
    const [lyrics, setLyrics] = React.useState<any>([])
    const [position, setPosition] = React.useState(0)
    const location = useLocation()
    const receivedData: Musique[] = location.state?.playlist;

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
        console.log('debut', debut)
        if (paroles.error === false) {
            let i = 0
            while (parseInt(paroles.lines[i].startTimeMs) < debut) {
                console.log('lyrics i', paroles.lines[i].startTimeMs, i)
                i++
            }
            await getpause(`seek?position_ms=${paroles.lines[i-1].startTimeMs}`, 'PUT')
            await getpause('play', 'PUT')
            await sleep(10000)
        } else {
            await getpause(`seek?position_ms=${debut}`, 'PUT')
        }
        
    }

    const afficherLyrics = async () => {
        for (let i = position; i < 50; i++) {
            console.log('lyrics 1', lyrics[i])
            console.log('lyrics 2', parseInt(lyrics[i + 1].startTimeMs))
            await sleep(parseInt(lyrics[i + 1].startTimeMs) - parseInt(lyrics[i].startTimeMs))
        }
    }


    const startmusique = async () => {
        await testtoken()
        await getpause(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
        await sleep(100)
        await getpause('next', 'POST')
        await getpause('pause', 'PUT')
        await getRandomStartTime()
        // await getRandomStartTime()
    }

    const moreTime = async () => {
        await testtoken()
        await getpause('play', 'PUT')
        await setAffichage(1)
    }

    const endTimer = async () => {
        await testtoken()
        await getpause('pause', 'PUT')
        setAffichage(2)
    }

    const response = async () => {
        await testtoken()
        await getpause('play', 'PUT')
        await setAffichage(3)

    }

    const nextmusique = async () => {
        await testtoken()
        await getpause('pause', 'PUT')
        setMusiqueActuelle(musiqueActuelle + 1)
        setAffichage(0)
    }


    return (
        <div>
            <h1>N'Oubliez pas les Paroles !</h1>
            <script type="text/javascript" src="https://tracking.musixmatch.com/t1.0/m_img/e_1/sn_0/l_19915235/su_0/rs_0/tr_3vUCADZOeQ2EJZus_nq7GH01wP79qOxU-KWYz3bsrUtZ9_14VvzJM6e48M0i-V0_D17XhCqc4KoDkUTfWRWrFSa3ZRaeS8-UkymCNQntabWoeSZQMic7SuKwzoSLsBh6LeQ5TrPqTkzuDNDqlPb547uzG1-aOSdsrOAfM4z4EO-6phAf-Xs2Z1fA_hwVGTxahZ8VIecsHnQOvQLuq4uE7ku1I8ez_jQUBIiFV1dFepqUOA3D0hFVtd2VXbwurF4-MYtYkReTr5bjcDFwe6NV2HQvBuD0ddXwtpH4IE9mnnnNGHDp85eEVlCegDKHyM1hpH-qWERgcPkM8n1kKM13sJAU2Qw5tbTxoyhYI96pMLYoGG_8qV2MRHj8lI7mMTlLVPn_LD3VMqUlXV6UXtFNUsxEC75iLSGQcJp_/"></script>
            {
                affichage <= 2 ?
                    <div className='VisuelQuestion'>
                        <img src={receivedData[musiqueActuelle].playlistimg} alt='pochette playlist' className='PochetteAlbum' />
                        <div className="infos">
                            <p className='TitrePlaylist'>Playlist : {receivedData[musiqueActuelle].playlist}</p>
                            {affichage === 0 ? <Countdown onFinish={startmusique} timer={0} /> :
                                affichage === 1 ?
                                    <video width="320" height="240" controls autoPlay muted onEnded={endTimer}>
                                        <source src={`${process.env.PUBLIC_URL}/countdown10.mp4`} type="video/mp4" />
                                        Votre navigateur ne prend pas en charge la balise vidéo.
                                    </video> :
                                    <div>
                                        <button onClick={moreTime}>+ de temps</button>
                                        <button onClick={response}>Réponse</button>
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