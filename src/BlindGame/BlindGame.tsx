import React from 'react';
import { useLocation } from 'react-router-dom';
import VisuelQuestion from '../Components/VisuelQuestion/VisuelQuestion';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import './BlindGame.css'

function BlindGame() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
    const [montrerReponse, setMontrerReponse] = React.useState(true); 
    const location = useLocation();
    const receivedData: Musique[] = location.state?.playlist;

    const goToNextMusique = () => {
        if (musiqueActuelle < receivedData.length - 1) { // Pour éviter de dépasser la liste
            setMusiqueActuelle(prevMusique => prevMusique + 1);
        } else {
            console.log("C'est la dernière piste.");
            // Ici, vous pouvez gérer ce qui se passe après la dernière piste, comme rediriger vers une autre page ou afficher un message.
        }
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

    const loop = async () => {
        await getpause('pause', 'PUT')
        await getpause('queue?uri=spotify%3Atrack%3A4iV5W9uYEdYUVa79Axb7Rh', 'POST')
        await getpause('next', 'POST')
        await getpause('play', 'PUT')
    }

    return (
        <div>
            <h1>BlindGame Musique : {musiqueActuelle}</h1>
            {
                montrerReponse ? <VisuelQuestion {...receivedData[musiqueActuelle]}/> : <p> test</p>
            }
        </div>
    );
}

export default BlindGame;