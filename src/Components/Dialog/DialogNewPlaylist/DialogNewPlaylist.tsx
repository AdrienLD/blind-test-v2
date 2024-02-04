import React from 'react'
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import './DialogNewPlaylist.sass'
import { searchNewSpotifyPlaylist } from '../../Playlist'

interface DialogNewPlaylistProps {
  open: boolean
  onClose: () => void
  addNewUserPlaylist: (mode: string) => void
}

const DialogNewPlaylist: React.FC<DialogNewPlaylistProps> = ({ open, onClose, addNewUserPlaylist }) => {
  const [ playlist, setPlaylist ] = React.useState<string>('')
  const [ showAlert, setShowAlert ] = React.useState(false)

  const verifyPlaylist = async(playlist: string) => {
    const playlistId = playlist.includes('open.spotify.com') ? playlist.replace(/.+playlist\/(.+?)\?.+/, '$1') : playlist
    if (playlistId.length === 22) {
      const playlistinfos =  await searchNewSpotifyPlaylist(playlistId)
      console.log(playlistinfos)
      if (playlistinfos.error === undefined){
        setShowAlert(false)
        setPlaylist('')
        addNewUserPlaylist(playlistinfos)
      } else setShowAlert(true)
    } else {
      setShowAlert(true)
    }
  }
  
  return (
    <Dialog open={open} onClose={onClose} className='Dialog'>
      <DialogContent className='DialogContent'>
        <div className="DialogTitle">
          Ajouter une nouvelle playlist
          <DialogContentText>
            Veuillez entrer l'url ou l'id de la playlist Spotify que vous souhaitez ajouter<br />
            <input type="text" value={playlist} onChange={(e) => setPlaylist(e.target.value)} />
            {
              showAlert && <div className="Alert" style={{ color: 'red' }}>Url ou un id de playlist invalide</div>
            }
            <button onClick={() => verifyPlaylist(playlist)}>Ajouter</button>
          </DialogContentText>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogNewPlaylist