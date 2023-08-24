import React from 'react';
import PlaylistCard, { PlaylistCardProps } from '../Components/PlaylistCard/PlaylistCard';
import './PlaylistSelection.css';

export interface Musique {
    titre: string;
    artiste: string;
    album: string;
    albumimg: string;
    id: string;
    playlist: string;
    playlistimg: string;
    duration: number;
}

const PlaylistSelection: React.FC = () => {
    const playlistNames = ['Années 50', 'Années 60', 'Années 70', 'Années 80', 'Années 90', 'Années 2000', 'Années 2010', 'Années 2020', 'Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde', 'Films', 'Gen Séries TV', 'Dessins animés', 'Anime OST', 'Disney', "Films d'animation", 'Jeux Vidéos', 'Publicités']
    
    const [playlistsPossibles, setPlaylistsPossibles] = React.useState<PlaylistCardProps[]>(playlistNames.map((name) => ({
        nom: name,
        choisie: false,
        onClick: () => { } // Ceci sera mis à jour plus tard
    })));

    const CLIENT_ID = 'bbbe51c137b24687a4edb6c27fbb5dac'

    const reverseChoix = (index: number) => {
        const newPlaylists = [...playlistsPossibles];
        newPlaylists[index].choisie = !newPlaylists[index].choisie;
        setPlaylistsPossibles(newPlaylists);
    }


    playlistsPossibles.forEach((playlist, index) => {
        playlist.onClick = () => reverseChoix(index);
    })



    const extractmusique = async (mode: string) => {
        localStorage.setItem('mode', mode);
        const PlaylistSelection = playlistsPossibles.filter((playlist) => playlist.choisie).map((playlist) => playlist.nom);
        await localStorage.setItem('playlists', JSON.stringify(PlaylistSelection))
        const SCOPES = [
            "ugc-image-upload",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "streaming",
        ];
        const REDIRECT_URI = 'http://localhost:3000/callback';

        window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES.join("%20")}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    }

    return (
        <div className='PlaylistSelection'>
            <div className="TitreChoix">
                Choisissez les playlists que vous voulez avoir dans votre BlindTest
            </div>
            <div className="ChoixPlaylists">
                {
                    playlistsPossibles.map((playlist) => {
                        return (
                            <PlaylistCard {...playlist} />
                        )
                    })
                }
            </div>
            <div className="Validations">
                <button onClick={() => extractmusique('blind')}>Blind Test</button>
                <button onClick={() => extractmusique('nplp')}>N'Oubliez Pas Les Paroles</button>
            </div>


        </div>
    );
}

export default PlaylistSelection;
