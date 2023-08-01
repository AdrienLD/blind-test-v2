import React from 'react';
import { useLocation } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import SpotifyPlayer from '../Components/SpotifyPlayer/SpotifyPlayer';


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

    return (
        <div>
            <SpotifyPlayer track={receivedData[musiqueActuelle]}/>
        </div>
    );
}

export default BlindGame;