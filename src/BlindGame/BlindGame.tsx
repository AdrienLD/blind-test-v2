import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import './BlindGame.css'
import Countdown from '../Components/VisuelQuestion/Countdown/Countdown';

function BlindGame() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
    const [affichage, setAffichage] = React.useState(0);
    const location = useLocation();
    const receivedData: Musique[] = location.state?.playlist;

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
        await getpause('pause', 'PUT')
        await getpause(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
        await getpause('next', 'POST')
        await getpause('play', 'PUT')
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
            <h1>BlindGame Musique : {musiqueActuelle}</h1>
            {
                affichage <= 2 ?
                    <div className='VisuelQuestion'>
                        <img src={receivedData[musiqueActuelle].playlistimg} alt='pochette playlist' className='PochetteAlbum' />
                        <div className="infos">
                            <p className='TitrePlaylist'>Playlist : {receivedData[musiqueActuelle].playlist}</p>
                            {affichage === 0 ? <Countdown onFinish={startmusique} timer={0}/> :
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

export default BlindGame;