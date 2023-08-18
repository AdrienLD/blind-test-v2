import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import './PLParoles.css'
import Countdown from '../Components/VisuelQuestion/Countdown/Countdown';
import LyricsClient from "sync-lyrics"

function PLParoles() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
    const [affichage, setAffichage] = React.useState(0)
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
        console.log('receivedData', receivedData[musiqueActuelle].titre, receivedData[musiqueActuelle].artiste)
        try {
            const response = await fetch('http://localhost:4000/api/getlyricsId', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: 'f3c6b3987f2930fd77d65aace3e556e1',
                    titre: encodeURIComponent(receivedData[musiqueActuelle].titre),
                    artiste: encodeURIComponent(receivedData[musiqueActuelle].artiste)
                }
            });
            const data = await response.json();
            let i = 0
            while (data.message.body.track_list[i].track.has_lyrics === 0) {
                i++
                if (i === data.message.body.track_list.length) {
                    console.log('pas de lyrics')
                    break
                }
            }
            console.log('richsyng', data.message.body.track_list[i].track.has_richsync)
            await console.log('lyricssonbgs', data, data.message.body.track_list[i].track.track_id);
            const lyrics = await fetch('http://localhost:4000/api/getlyrics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: 'f3c6b3987f2930fd77d65aace3e556e1',
                    track_id: receivedData[musiqueActuelle].id
                }
            });
            const final = await lyrics.json();
            await console.log('lyrics', final);

           
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

    const startmusique = async () => {
        await testtoken()
        await getlyricsId()
        
        await getpause(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
        await sleep(100)
        await getpause('next', 'POST')
        await sleep(5000)
        await setAffichage(1)
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