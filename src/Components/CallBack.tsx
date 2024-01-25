import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Musique } from '../PlaylistSelection/PlaylistSelection';
import { getSpotifyToken } from './Playlist';


function CallBack() {
    const navigate = useNavigate();

    console.log('CallBack')

    const isTokenFetched = React.useRef(false);

    React.useEffect(() => {
        if (!isTokenFetched.current) {
            extractmusique();
            isTokenFetched.current = true;
        }
    }, []);

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

    

    

    const requireplalist = async (titre: string) => {
        try {
            const response = await fetch('http://localhost:4000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: titre,
                    type: 'playlist',
                    
                }),
                credentials: 'include'
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
        await console.log('extractmusique')
        await getSpotifyToken()
        const playlistSelection: string[] = JSON.parse(localStorage.getItem('playlists') || '[]')
        console.log('playlistSelection', playlistSelection)
        let playlistComplete: Musique[][] = [];
        for (let index = 0; index < playlistSelection.length; index++) {
            const playlist = playlistSelection[index];
            const playlistId = await requireplalist(playlist);
            const musiques = await extractmusiques(playlistId.playlists.items[0].id);
            playlistComplete.push([]);
            musiques.items.forEach((element: { track: {
                duration_ms: any; name: any; artists: { name: any; }[]; album: { name: any; images: any; }; id: any; }; }) => {
                playlistComplete[index].push({
                    titre: element.track.name,
                    artiste: element.track.artists.map(artist => artist.name).join(', '),
                    album: element.track.album.name,
                    albumimg: element.track.album.images[0].url,
                    id: element.track.id,
                    playlist: playlist,
                    playlistimg: playlistId.playlists.items[0].images[0].url,
                    duration: element.track.duration_ms
                })
            })
        }
        const playlistFinale: Musique[] = balanceArrays(playlistComplete)
        console.log('playlistFinale', playlistFinale)
        const mode = localStorage.getItem('mode')
        mode === 'blind' ? navigate('/BlindGame', { state: { playlist: playlistFinale } }) :
        navigate('/PLParoles', { state: { playlist: playlistFinale } });
    }

    return (
        <div className='PlaylistSelection'>
            Recherche en cours...
        </div>
    );
}

export default CallBack;
