import React from 'react'
import PlaylistCard from '../Components/PlaylistCard/PlaylistCard'
import './PlaylistSelection.sass'
import ListPlaylistCard, { ListPlaylistCardProps } from '../Components/PlaylistCard/ListPlaylistCard/ListPlaylistCard'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ClearIcon from '@mui/icons-material/Clear'
import { playlist } from '../Components/Playlist'

export interface Musique {
  titre: string
  artiste: string
  album: string
  albumimg: string
  id: string
  playlist: string
  playlistimg: string
  duration: number
}

const PlaylistSelection: React.FC = () => {
    
  const playlistSelections = playlist
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  const [ PlaylistsAfficher, setPlaylistsAfficher ] = React.useState<[string, string[]]>(playlistSelections[0])

  const ListPlaylists: ListPlaylistCardProps[] = playlistSelections.map((selection): ListPlaylistCardProps => ({
    nom: selection[0],
    onHover: () => { setPlaylistsAfficher(selection) }
  }))

  const [ PlaylistsSelectionnees, setPlaylistsSelectionnees ] = React.useState<string[]>([])
    


  const CLIENT_ID = 'bbbe51c137b24687a4edb6c27fbb5dac'


  const addNewPlaylist = (listplaylist: string, playlist: string) => {
    const playlists = `${listplaylist} £ ${playlist}`
    if (!PlaylistsSelectionnees.includes(playlists)) {
      setPlaylistsSelectionnees(PlaylistsSelectionnees.concat(playlists))
    } else {
      setPlaylistsSelectionnees(PlaylistsSelectionnees.filter((playlist) => playlist !== playlists))
    }
  }

  const exportmusique = (): void => {
    const dataStr = JSON.stringify(PlaylistsSelectionnees)
    const blob = new Blob([ dataStr ], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'playlist.json'
    link.click()
  }

  const importmusique = (file: Blob): void => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const playlists = JSON.parse(event.target.result as string)
        setPlaylistsSelectionnees(playlists)
      }
    }
    reader.readAsText(file)
    console.log(file)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      importmusique(files[0])
    }
  }

  const extractmusique = async (mode: string) => {
        
        
    localStorage.setItem('mode', mode)
    const PlaylistSelection = PlaylistsSelectionnees.map((playlist) => playlist)
    await localStorage.setItem('playlists', JSON.stringify(PlaylistSelection))
    const SCOPES = [
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming'
    ]
    const REDIRECT_URI = 'http://localhost:3000/callback'

    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  }
  
  const onImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const clearList = () => {
    setPlaylistsSelectionnees([])
  }

  return (
    <div className='PlaylistSelection'>
      <div className="TitreChoix">
                Choisissez les playlists que vous voulez avoir dans votre BlindTest
      </div>
      <div className="listPlaylists">
                
        <div>
          {
            ListPlaylists.map((playlist) => (
              <ListPlaylistCard {...playlist} />
            ))
          }
        </div>
        <div className="PlaylistsPossibles">
          {
            PlaylistsAfficher[1].map((playlist) => (
              <PlaylistCard 
                genre={PlaylistsAfficher[0]}
                nom={playlist} 
                choisie={PlaylistsSelectionnees.includes(`${PlaylistsAfficher[0]} £ ${playlist}`)}
                onClick={() => { addNewPlaylist(PlaylistsAfficher[0], playlist) }} />
            ))
          }
                    
        </div>
      </div>
      <div className="Selection">
        <div className="ListPlaylistCard">
                    Selection :
        </div>
        <div className="cartesSelectionnees">
          {
            PlaylistsSelectionnees.map((playlist) => {
              return <div className='cartes'>{playlist.split(`£ `)[1]}</div>
            })
          }
        </div>
        <div className="Validations">
          <button onClick={() => clearList()}><ClearIcon/></button>
          <button onClick={() => exportmusique()}><FileUploadIcon/></button>
          <button onClick={onImportClick}><FileDownloadIcon/></button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <button onClick={() => extractmusique('blind')}>Blind Test</button>
          <button onClick={() => extractmusique('nplp')}>N'Oubliez PLP</button>
        </div>
      </div>


    </div>
  )
}

export default PlaylistSelection
