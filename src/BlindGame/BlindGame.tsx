import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';

function BlindGame() {
    const [musiqueActuelle, setMusiqueActuelle] = React.useState(0);
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

    async function getplayerstate() {
        const token = localStorage.getItem('token')!
        console.log('tokenici', token);
        try {

            const response = await fetch('http://localhost:4000/api/getplayerstate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token
                })
            });

            console.log('response', response);
            const data = await response.json();
            console.log(data);
            return data;  // Retourner les données reçues
        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error);
            throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
        }
    }
    getplayerstate();


    const token = localStorage.getItem('token')!;
    console.log('token', token);

    return (
        <div>
        </div>
    );
}

export default BlindGame;