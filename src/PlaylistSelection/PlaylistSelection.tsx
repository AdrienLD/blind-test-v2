import React from 'react';
import PlaylistCard, { PlaylistCardProps } from '../Components/PlaylistCard/PlaylistCard';
import './PlaylistSelection.css';
import { useNavigate } from 'react-router-dom';


export interface Musique {
    titre: string;
    artiste: string;
    album: string;
    id: string;
    playlist: string;
}

const PlaylistSelection: React.FC = () => {
    const navigate = useNavigate();
    const playlistNames = ['Années 50', 'Années 60', 'Années 70', 'Années 80', 'Années 90', 'Années 2000', 'Années 2010', 'Années 2020', 'Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde', 'Films', 'Jeu Vidéo', 'Dessin animés', 'Séries', 'Pub']

    const [playlistsPossibles, setPlaylistsPossibles] = React.useState<PlaylistCardProps[]>(playlistNames.map((name) => ({
        nom: name,
        choisie: false,
        onClick: () => {} // Ceci sera mis à jour plus tard
    })));

    function shuffle(array: Musique[]) {
        for (let i = array.length - 1; i > 0; i--) {
            // Sélectionnez un index aléatoire
            const j = Math.floor(Math.random() * (i + 1));

            // Échangez les éléments aux indices i et j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function balanceArrays(playlists: Musique[][]) {
        const minLength = Math.min(...playlists.map(subArr => subArr.length));
        playlists = playlists.map(subArr => shuffle(subArr));
        
        playlists.forEach((playlist) => {
            while (playlist.length > minLength) {
                const randomIndex = Math.floor(Math.random() * playlist.length);
                playlist.splice(randomIndex, 1);
            }
        })

        let flattened = playlists.reduce((acc, curr) => acc.concat(curr), [])
        flattened = shuffle(flattened);

        let playlistmelange: Musique[] = [];

        while (flattened.length) {
            const randomIndex = Math.floor(Math.random() * flattened.length);
            playlistmelange.push(flattened[randomIndex]);
            flattened.splice(randomIndex, 1);
        }
        playlistmelange = shuffle(playlistmelange);
        return playlistmelange;
      }

    const reverseChoix = (index: number) => {
        const newPlaylists = [...playlistsPossibles];
        newPlaylists[index].choisie = !newPlaylists[index].choisie;
        setPlaylistsPossibles(newPlaylists);
    }

    playlistsPossibles.forEach((playlist, index) => {
        playlist.onClick = () => reverseChoix(index);
    })

    const requireplalist = async (titre: string) => {
        try {
            const response = await fetch('http://localhost:4000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: titre,
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

    const extractmusique = async () => {
        const playlistSelection: string[] = [];
        playlistsPossibles.forEach(async (playlist) => {
            if (playlist.choisie) {
                playlistSelection.push(playlist.nom);
            }
        })
        let playlistComplete: Musique[][] = [];
        for (let index = 0; index < playlistSelection.length; index++) {
            const playlist = playlistSelection[index];
            const playlistId = await requireplalist(playlist);
            const musiques = await extractmusiques(playlistId.playlists.items[1].id);
            playlistComplete.push([]);
            musiques.items.forEach((element: { track: { name: any; artists: { name: any; }[]; album: { name: any; }; id: any; }; }) => {
                playlistComplete[index].push({
                    titre: element.track.name,
                    artiste: element.track.artists.map(artist => artist.name).join(', '),
                    album: element.track.album.name,
                    id: element.track.id,
                    playlist: playlist
                })
            })
        }
        const playlistFinale: Musique[] = balanceArrays(playlistComplete)
        console.log('playlistFinale', playlistFinale);
        navigate('/BlindGame', { state: { playlist: playlistFinale } });
    }

    /*const listemusiques = async () => {
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

    }*/

    return (
        <div className='PlaylistSelection'>
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
            <div className="Validations">
                <button onClick={() => extractmusique()}>S'entrainer</button>
                <button>Jouer</button>
            </div>


        </div>
    );
}

export default PlaylistSelection;
