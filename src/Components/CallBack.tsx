import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../PlaylistSelection/PlaylistSelection'
import { extractMusiquesSpotify, researchSpotify, secretKey } from './Playlist'
import CryptoJS from 'crypto-js'

interface Image {
  url: string
}

interface UserMusic {
  id: string
  images: Image[] // Utilisez la sous-interface Image ici
}

function CallBack() {
  const navigate = useNavigate()

  console.log('CallBack')

  const isTokenFetched = React.useRef(false)



  function shuffle(array: Musique[]) {
    for (let i = array.length - 1; i > 0; i--) {
      // Sélectionnez un index aléatoire
      const j = Math.floor(Math.random() * (i + 1));

      // Échangez les éléments aux indices i et j
      [ array[i], array[j] ] = [ array[j], array[i] ]
    }
    return array
  }

  function balanceArrays(playlists: Musique[][]) {
    const minLength = Math.min(...playlists.map(subArr => subArr.length))
    playlists = playlists.map(subArr => shuffle(subArr))
        
    playlists.forEach((playlist) => {
      while (playlist.length > minLength) {
        const randomIndex = Math.floor(Math.random() * playlist.length)
        playlist.splice(randomIndex, 1)
      }
    })

    let flattened = playlists.reduce((acc, curr) => acc.concat(curr), [])
    flattened = shuffle(flattened)

    let playlistmelange: Musique[] = []

    while (flattened.length) {
      const randomIndex = Math.floor(Math.random() * flattened.length)
      playlistmelange.push(flattened[randomIndex])
      flattened.splice(randomIndex, 1)
    }
    playlistmelange = shuffle(playlistmelange)
    return playlistmelange
  }

  const extractplaylistId = async (playlist: string) => {
    const [ genre, playlistName ] = playlist.split(' £ ')
    if (genre === 'UserPlaylist') {
      const userPlaylistInfos: Array<[string, string, string]> = JSON.parse(localStorage.getItem('userPlaylistInfos') || '[]')
      if (userPlaylistInfos[0][0] !== 'Ajouter') console.error('Invalid UserPlaylistInfos')
      const selectedUserMusic = userPlaylistInfos.find(playlist => playlist[0] === playlistName)
      if (selectedUserMusic === undefined) return console.error('Invalid selected User Playlist')
      const userplaylist: UserMusic = {
        id: selectedUserMusic[2],
        images :[ {
          url: selectedUserMusic[1]
        } ]
      }
      return userplaylist
    }
    const playlistreseach = await researchSpotify(`${genre} ${playlistName}`, 'playlist')
    console.log('playlistreseach', playlistreseach.playlists.items[0])
    return playlistreseach.playlists.items[0]
  }

  const extractmusique = async () => {
    await console.log('extractmusique')
    const playlistfromlocalStorage = localStorage.getItem('playlists')
    if (playlistfromlocalStorage === null) {
      console.error('No playlist selected')
    }
    const playlistSelection: string[] = JSON.parse(playlistfromlocalStorage!)
    console.log('playlistSelection', playlistSelection)

    const playlistComplete: Musique[][] = []
    for (let index = 0; index < playlistSelection.length; index++) {
      const playlist = playlistSelection[index]
      console.log('playlist', playlist)
      const playlistId = await extractplaylistId(playlist)
      console.log('playlistId', playlistId)
      const musiques = await extractMusiquesSpotify(playlistId.id)
      console.log('musiques', musiques)
      playlistComplete.push([])
      musiques.items.forEach((element: { track: {
        duration_ms: any
        name: any
        artists: Array<{ name: any }>
        album: { name: any, images: any }
        id: any 
      }
      }) => {
        playlistComplete[index].push({
          titre: element.track.name,
          artiste: element.track.artists.map(artist => artist.name).join(', '),
          album: element.track.album.name,
          albumimg: element.track.album.images[0].url,
          id: element.track.id,
          playlist: playlist,
          playlistimg: playlistId.images[0].url,
          duration: element.track.duration_ms
        })
      })
    }
    const playlistFinale: Musique[] = balanceArrays(playlistComplete)
    console.log('playlistFinale', playlistFinale)

    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(playlistFinale), secretKey).toString()
    await localStorage.setItem('playlistFinale', ciphertext)
    const mode = localStorage.getItem('mode')
    navigate(mode === 'blind' ? '/BlindGame' : '/PLParoles')
  }

  React.useEffect(() => {
    if (!isTokenFetched.current) {
      extractmusique()
      isTokenFetched.current = true
    }
  }, [])

  return (
    <div className='PlaylistSelection'>
            Recherche en cours...
    </div>
  )
}

export default CallBack
