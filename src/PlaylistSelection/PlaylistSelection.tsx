import React from 'react'
import PlaylistCard from '../Components/PlaylistCard/PlaylistCard'
import './PlaylistSelection.sass'
import ListPlaylistCard, { ListPlaylistCardProps } from '../Components/PlaylistCard/ListPlaylistCard/ListPlaylistCard'
import DeleteIcon from '@mui/icons-material/Delete'
import { playlist, secretKey } from '../Components/Playlist'
import CryptoJS from 'crypto-js'


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
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(PlaylistsSelectionnees), secretKey).toString()
    console.log(ciphertext)
    await localStorage.setItem('playlists', JSON.stringify(PlaylistsSelectionnees))
    window.location.href = 'http://localhost:4000/api/start-auth' // Remplacez par l'URL de votre serveur
  }
  
  const onImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const clearList = () => {
    setPlaylistsSelectionnees([])
  }

  const deleteThisPlaylist = (playlistToDelete: string) => {
    setPlaylistsSelectionnees(PlaylistsSelectionnees.filter((playlist) => playlist !== playlistToDelete))
  }



  return (
    <div className='PlaylistSelection'>
      <div className="TitreChoix">
                Choisissez les playlists que vous voulez avoir dans votre BlindTest
      </div>
      <div className="listPlaylists">
                
        <div className='catalogue'>
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
        <div className="panneaudroite">
          
          <div className="Selection">
            <div className="Carte_Selection">
            Selection
              <button onClick={() => clearList()} className='DeleteIconsButon'><DeleteIcon/></button>
            </div>
            <div className="cartesSelectionnees">
              {
                PlaylistsSelectionnees.map((playlist) => {
                  return <div className='cartes'>
                    <img src={`/images/${playlist.split(' £ ')[0]} - ${playlist.split(' £ ')[1]}.jpg`} 
                      alt="logo" 
                      className='logoPlaylist'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/trans.png'
                      }}/>                    {playlist.replace(` £ `,' - ')}
                    <div onClick={() => deleteThisPlaylist(playlist)} className='DeletePlaylist'>
                      <DeleteIcon className='DeletePlaylistIcon'/>
                    </div>
                  </div>
                })
              }
            </div>
            <div className="Validations">
              <button onClick={() => exportmusique()}>Exporter</button>
              <button onClick={onImportClick}>Importer</button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>
            <button onClick={() => extractmusique('blind')}>Blind Test</button>
            <button onClick={() => extractmusique('nplp')}>N'Oubliez PLP</button>
          </div>
          <button className="Start">Start</button>
        </div>
      </div>


    </div>
  )
}

export default PlaylistSelection
