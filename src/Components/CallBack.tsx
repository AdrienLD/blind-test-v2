import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../PlaylistSelection/PlaylistSelection'
import { replaceThisPlaylist, secretKey, testBDD  } from '../server/Playlist'
import CryptoJS from 'crypto-js'
import DialogNoFoundedMusic, { resultsTestBDD } from './Dialog/DialogNonFoudedMusics/DialogNoFoundedMusic'
import { decryptPlaylist } from './BlindGame/SpotifyAPI'



function CallBack() {
  const navigate = useNavigate()
  
  const [ openMusicsNotFound, setOpenMusicsNotFound ] = React.useState(false)

  const [ resultsTestBDD, setResultsTestBDD ] = React.useState<resultsTestBDD>()
  console.log('CallBack')

  const isTokenFetched = React.useRef(false)

  /*

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
    const playlistreseach = await researchSpotify([ genre, playlistName ], 'playlist')
    return playlistreseach
  }

  */

  const testBDDOnPlaylists = async () => {
    const ciphertext = localStorage.getItem('playlistFinale')
    if (ciphertext) {
      const playlist = decryptPlaylist(ciphertext)
      const shortPlaylist = playlist.map((musique: Musique) => ({
        title : musique.titre,
        artist: musique.artiste
      }))
      console.log('shortPlaylist', shortPlaylist)
      const resultsTest: resultsTestBDD  = await testBDD(shortPlaylist)
      setResultsTestBDD(resultsTest)
      setOpenMusicsNotFound(true)
    } else {
      console.error('No playlist found in local storage')
      return
    }
  }
  
  const extractmusique = async () => {
    await console.log('extractmusique')
    const playlistfromlocalStorage = localStorage.getItem('playlists')
    if (playlistfromlocalStorage === null) {
      console.error('No playlist selected')
    }
    const playlistSelection: string[] = JSON.parse(playlistfromlocalStorage!)
    const playlistComplete: Musique[] = []

    
    for (let i = 0; i < playlistSelection.length; i++) {
      const [ genre, playlistName ] = playlistSelection[i].split(' £ ')
    
      if (genre === 'UserPlaylist') {
        const userPlaylistInfos = JSON.parse(localStorage.getItem('userPlaylistInfos') || '[]')
    
        const selectedUserMusic: [string, string, string] | undefined = userPlaylistInfos.find((playlist: [string, string, string]) => playlist[0] === playlistName)
        if (selectedUserMusic === undefined) {
          console.error('Invalid selected User Playlist')
          continue
        }
        playlistSelection[i] = `UserPlaylist £ ${selectedUserMusic[2]}`
      }
    }

    const playlistBrut = await replaceThisPlaylist(playlistSelection)
    if (!playlistBrut.results || playlistBrut.results.length === 0) {
      console.error('No results found in the test')
    }
    
    playlistBrut.results.forEach((element: { 
      duration_ms: any
      name: any
      artists: Array<{ name: any }>
      album: { name: any, images: any }
      id: any 
      playlist: any
    
    }) => {
      playlistComplete.push({
        titre: element.name,
        artiste: element.artists.map(artist => artist.name).join(', '),
        album: element.album.name,
        albumimg: element.album.images[0]?.url,
        id: element.id,
        playlist: element.playlist.name,
        playlistimg: element.playlist.images[0].url,
        duration: element.duration_ms
      })
    })

    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(playlistComplete), secretKey).toString()
    await localStorage.setItem('playlistFinale', ciphertext)
    await localStorage.setItem('CurrentMusic', '0')
    const mode = localStorage.getItem('mode')
    if (mode === 'test') {
      await testBDDOnPlaylists()
      return
    }
    navigate(mode === 'blind' ? '/BlindGame' : '/PLParoles' )
  }

  React.useEffect(() => {
    if (!isTokenFetched.current) {
      extractmusique()
      isTokenFetched.current = true
    }
  }, [])

  return (
    <div className='PlaylistSelection'>
            
      <h2>
        {
          <div>Recherche en cours...</div>
        }
      </h2>
      <DialogNoFoundedMusic  open={openMusicsNotFound} onClose={() => setOpenMusicsNotFound(false)} results={resultsTestBDD}/>

    </div>
  )
}

export default CallBack
