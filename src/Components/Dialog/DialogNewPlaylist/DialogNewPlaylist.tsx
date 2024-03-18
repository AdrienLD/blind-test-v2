import React from 'react'
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import './DialogNewPlaylist.sass'
import { searchNewSpotifyPlaylist } from '../../../Common/Playlist'

interface DialogNewPlaylistProps {
  open: boolean
  onClose: () => void
  addNewUserPlaylist: (mode: string) => void
}

const DialogNewPlaylist: React.FC<DialogNewPlaylistProps> = ({ open, onClose, addNewUserPlaylist }) => {
  const [ playlist, setPlaylist ] = React.useState<string>('')
  const [ showAlert, setShowAlert ] = React.useState(false)
  const [ alertMessage, setAlertMessage ] = React.useState('')
  const [ isHovered, setIsHovered ] = React.useState(false)
  const [ mousePosition, setMousePosition ] = React.useState({ x: 0, y: 0 })
  
  
  const activateAlert = (erreur: string) => {
    setAlertMessage(erreur)
    setShowAlert(true)
  }
  
  const verifyPlaylist = async(playlist: string) => {
    const playlistId = playlist.includes('open.spotify.com') ? playlist.replace(/.+playlist\/(.+?)\?.+/, '$1') : playlist
    const userPlaylistInfos: Array<[string, string, string]> = [ localStorage.getItem('userPlaylistInfos') ? JSON.parse(localStorage.getItem('userPlaylistInfos') as string) : null ]

    console.log('playlistId', playlistId, userPlaylistInfos)
    if (playlistId.length === 0) {
      activateAlert('Aucune playlist entrée')
    } else if (playlistId.length === 22) {
      const playlistinfos =  await searchNewSpotifyPlaylist(playlistId)
      if (userPlaylistInfos[0].find(playlist => playlist[0] === playlistinfos.name)) {
        activateAlert('Playlist du même nom déjà ajoutée')
      } else if (playlistinfos.error === undefined){
        setShowAlert(false)
        setPlaylist('')
        addNewUserPlaylist(playlistinfos)
      } else {
        console.log('playlistinfos.error', playlistinfos.error)
        activateAlert(`Url ou un id de playlist invalide : ${playlistinfos.error.message}`)
      }
    } else {
      activateAlert('Url ou un id de playlist invalide')
    }
  }

  

  const handleMouseMove = (event: { clientX: any, clientY: any }) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('La touche Entrée a été pressée.')
      verifyPlaylist(playlist) // Exécutez la fonction que vous souhaitez déclencher lorsque Entrée est pressée
    }
  }
  
  return (
    <Dialog open={open} onClose={onClose} className='Dialog'>
      <DialogContent className='DialogContent'>
        <div className="DialogTitle">
          Ajouter une nouvelle playlist
          <DialogContentText>
            Veuillez entrer l'url ou l'id de la playlist Spotify que vous souhaitez ajouter<br />
            <span
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsHovered(false)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              Comment ajouter une playlist ?
            </span>
      
            {isHovered && (
              <img
                src="/images/HowToAddPlaylist.gif"
                alt="Description du GIF"
                style={{
                  position: 'fixed', // Utilisez 'fixed' ou 'absolute' selon le besoin
                  left: mousePosition.x,
                  top: mousePosition.y,
                  transform: 'translate(15px, -50%)', // Décale le GIF pour ne pas cacher le curseur
                  pointerEvents: 'none' // Permet à la souris de "passer à travers" l'image
                }}
              />
            )}
            <input type="text" value={playlist} onChange={(e) => setPlaylist(e.target.value)} onKeyDown={handleKeyDown} autoFocus/>
            {
              showAlert && <div className="Alert" style={{ color: 'red' }}>{alertMessage}</div>
            }
            <button onClick={() => verifyPlaylist(playlist)}>Ajouter</button>
          </DialogContentText>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogNewPlaylist