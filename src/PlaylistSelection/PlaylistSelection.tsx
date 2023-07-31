import React from 'react';
import PlaylistCard, { PlaylistCardProps } from '../Components/PlaylistCard/PlaylistCard';
import './PlaylistSelection.css';


interface Musique {
    titre: string;
    artiste: string;
    album: string;
    id: string;
    playlist: string;
}

const PlaylistSelection: React.FC = () => {
    const playlistsPossibles: PlaylistCardProps[] = [
        {
            nom: 'Playlist 1',
            choisie: false
        },
        {
            nom: 'Playlist 2',
            choisie: false
        }
    ];

    function shuffle(array: Musique[]) {
        for (let i = array.length - 1; i > 0; i--) {
            // Sélectionnez un index aléatoire
            const j = Math.floor(Math.random() * (i + 1));

            // Échangez les éléments aux indices i et j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const requireplalist = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: 'voiture',
                    type: 'playlist'
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

    const extractmusiques = async (id: string) => {
        try {
            const response = await fetch('http://localhost:4000/api/tracks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playlistId: id
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

    const listemusiques = async () => {
        const listeMusiques: Musique[] = [];
        console.log('listemusiques');
        const playlist = await requireplalist();
        console.log('playlist', playlist);
        console.log('playlist', playlist.playlists.items[0].id);
        const musiques = await extractmusiques(playlist.playlists.items[0].id);
        console.log('musiques', musiques.items[5].track);
        musiques.items.forEach((element: { track: { name: any; artists: { name: any; }[]; album: { name: any; }; id: any; }; }) => {
            listeMusiques.push({
                titre: element.track.name,
                artiste: element.track.artists[0].name,
                album: element.track.album.name,
                id: element.track.id,
                playlist: playlist.playlists.items[0].name
            })
        });
        shuffle(listeMusiques)

    }

    return (
        <div className='PlaylistSelection' onClick={listemusiques}>
            <div className="TitreChoix">
                 Choisissez les playlists que vous voulez avoir dans votre BlindTest
            </div>
            <div className="ChoixPlaylists">
                {
                    playlistsPossibles.map((playlist) => {
                        return (
                            <PlaylistCard {...playlist}/>
                        )
                    })
                }
            </div>


        </div>
    );
}

export default PlaylistSelection;
