import React from 'react';
import { Musique } from '../../PlaylistSelection/PlaylistSelection';

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady?: () => void;
        Spotify?: any;
    }
}

type Props = {
    track: Musique;
};

function SpotifyPlayer({ track }: Props) {
    React.useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Votre lecteur Spotify",
                getOAuthToken: (callback: (token: string) => void) => {
                    // Ici, vous devriez récupérer votre token d'accès et le passer au callback
                    callback("YOUR_SPOTIFY_ACCESS_TOKEN");
                }
            });
            // ...
        };

        // 2. Charger le SDK
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        // 3. Nettoyage
        return () => {
            document.body.removeChild(script);
            // Supprimer la fonction globale pour éviter des erreurs ou conflits possibles à l'avenir
            delete window.onSpotifyWebPlaybackSDKReady;
        };
    }, []);

    return (
        <div className="SpotifyPlayer">
            <img src={track.id} alt="Album Cover" />
            <div>{track.titre}</div>
            <div>{track.artiste}</div>
            <div>{track.album}</div>
        </div>
    );
}

export default SpotifyPlayer;