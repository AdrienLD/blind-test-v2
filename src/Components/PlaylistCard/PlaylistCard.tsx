import React from 'react'
import './PlaylistCard.css'
import DoneIcon from '@mui/icons-material/Done'
import DeleteIcon from '@mui/icons-material/Delete'

export interface PlaylistCardProps {
  genre: string
  nom: string
  choisie: boolean
  onClick: () => void
  onDeletePlaylist?: (value: string) => void
}

function PlaylistCard(props: PlaylistCardProps) {
  const imagePath = `/images/playlists/${props.genre} - ${props.nom}.jpg`
  const userPlaylistInfos: Array<[string, string, string]> = [ localStorage.getItem('userPlaylistInfos') ? JSON.parse(localStorage.getItem('userPlaylistInfos') as string) : null ]

  const imageafficher = (props.genre === 'UserPlaylist' && userPlaylistInfos) ? userPlaylistInfos[0].find(playlist => playlist[0] === props.nom)?.[1] : imagePath
  const handleImageError = (e:any) => {
    e.target.onerror = null // Pour éviter une boucle infinie en cas d'erreur sur l'image de remplacement
    e.target.src = '/images/playlists/trans.png'
  }

  const handleDeleteClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation() // Empêche tout événement parent de se déclencher
    if (props.onDeletePlaylist) { // Vérifie si onDeletePlaylist est défini
      props.onDeletePlaylist(props.nom) // Devrait être corrigé pour appeler la prop avec le bon argument
    }
  }
  
  return (
    <div className="PlaylistCard" onClick={props.onClick} style={props.choisie ? { transform: 'scale(0.7)' } : {}}>
      <div className='Inline'>
        <img src={imageafficher} className='logoplaylist' alt='logoimage' onError={handleImageError}/>
        
        
      </div>
      <div className="titre">
        {props.nom}
      </div>        
      {props.genre === 'UserPlaylist' && props.nom !== 'Ajouter' && <DeleteIcon className='DeletePlaylistIcon' onClick={handleDeleteClick}/>}

      {
        props.choisie && <DoneIcon className='done' />
      }
    </div>
  )
}

export default PlaylistCard