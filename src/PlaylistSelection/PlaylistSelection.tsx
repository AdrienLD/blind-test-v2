import React from 'react'
import PlaylistCard from '../Components/PlaylistCard/PlaylistCard'
import './PlaylistSelection.sass'
import ListPlaylistCard, { ListPlaylistCardProps } from '../Components/PlaylistCard/ListPlaylistCard/ListPlaylistCard'
import DeleteIcon from '@mui/icons-material/Delete'
import { PlaylistItem, playlist2 } from '../Components/playlist'
import CryptoJS from 'crypto-js'

import Alert from '@mui/material/Alert'
import DialogGameChoice from '../Components/Dialog/DialogGameChoice/DialogGameChoice'
import DialogNewPlaylist from '../Components/Dialog/DialogNewPlaylist/DialogNewPlaylist'
import { useNavigate } from 'react-router-dom'
import { getSpotifyToken, secretKey } from '../Components/AppelsSpotify'



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
  const [ open, setOpen ] = React.useState(false)
  const [ openNewPlaylist, setOpenNewPlaylist ] = React.useState(false)
  const [ showAlert, setShowAlert ] = React.useState(false)
  const [ userPlaylist, setUserPlaylist ] = React.useState<PlaylistItem[]>([ { name: 'Ajouter', id:'' } ] )
  const [ userPlaylistInfos, setUserPlaylistInfos ] = React.useState<string[][]>(localStorage.getItem('userPlaylistInfos') ? JSON.parse(localStorage.getItem('userPlaylistInfos') as string) : [ [ 'Ajouter', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/PlusCM128.svg/1200px-PlusCM128.svg.png', '' ] ])
  const [ PlaylistsAfficher, setPlaylistsAfficher ] = React.useState(playlist2[0]['Années'])
  const [ CategorieAfficher, setCategorieAfficher ] = React.useState('Années')

  const [ PlaylistsSelectionnees, setPlaylistsSelectionnees ] = React.useState<string[]>(() => {
    const playlistsJson = localStorage.getItem('playlists')
    return playlistsJson ? JSON.parse(playlistsJson) : []
  })

  const navigate = useNavigate()

  const isTokenFetched = React.useRef(false)
  React.useEffect(() => {
    if (CategorieAfficher === 'UserPlaylist') {
      setPlaylistsAfficher(userPlaylist)
    }
  }, [ userPlaylist ])

  React.useEffect(() => {
    const playlist = localStorage.getItem('playlists')
    if (playlist) {
      console.log('playlist', playlist)
      setPlaylistsSelectionnees(JSON.parse(playlist))
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(PlaylistsSelectionnees))
  }, [ PlaylistsSelectionnees ])

  React.useEffect(() => {
    const newUserPlaylistStructure = userPlaylistInfos.map(playlist => ({
      name: playlist[0],
      id: playlist[2] || ''
    }))
    
    setUserPlaylist(newUserPlaylistStructure)
  }, [])

  React.useEffect(() => {
    if (!isTokenFetched.current) {
      getSpotifyToken()
      isTokenFetched.current = true
    }
  }, [])
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  

  React.useEffect(() => {
    localStorage.setItem('userPlaylistInfos', JSON.stringify(userPlaylistInfos))
  }, [ userPlaylistInfos ])

  const ListPlaylists: ListPlaylistCardProps[] = []

  playlist2.forEach(categoryObject => {
    Object.keys(categoryObject).forEach(category => {
      console.log(categoryObject[category], category)
      ListPlaylists.push({
        nom: category,
        onHover: () => { {setPlaylistsAfficher(categoryObject[category])
          setCategorieAfficher(category)} }
      })
    })
  })


  const addNewPlaylist = (name: string, playlistId: string) => {
    if (name === 'Ajouter') {
      setOpenNewPlaylist(true)
    } else
      if (!PlaylistsSelectionnees.includes(playlistId)) {
        setPlaylistsSelectionnees(PlaylistsSelectionnees.concat(playlistId))
        setShowAlert(false)
      } else {
        setPlaylistsSelectionnees(PlaylistsSelectionnees.filter((playlist) => playlist !== playlistId))
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

  }

  const  addNewUserPlaylist = async (playlist: any) => {
    
    setOpenNewPlaylist(false)
    const updatedPlaylists = [
      ...userPlaylist,
      { name: playlist.name, id: playlist.id || '' }
    ]
    setUserPlaylist(updatedPlaylists as PlaylistItem[])
    setUserPlaylistInfos(userPlaylistInfos.concat([ [ playlist.name, playlist.images[0].url, playlist.id ] ]) )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      importmusique(files[0])
    }
  }

  const extractmusique = async (mode: string) => {
    setOpen(false)
        
    localStorage.setItem('mode', mode)
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(PlaylistsSelectionnees), secretKey).toString()
    await localStorage.setItem('playlistscryptées', ciphertext)
    await localStorage.setItem('playlists', JSON.stringify(PlaylistsSelectionnees))
    navigate('/callback')
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

  const handleClose = () => {
    setOpen(false)
  }

  const openDialog = () => {
    if (PlaylistsSelectionnees.length !== 0) {
      setOpen(true)
      setShowAlert(false)
    } else {
      setShowAlert(true)
    }
  }

  const getImageSelection = (playlist: string) => {
    const [ genre, playlistName ] = playlist.split(' £ ')
    console.log(genre, playlistName)
    if (genre === 'UserPlaylist') {
      return userPlaylistInfos.find(playlist => playlist[0] === playlistName)?.[1]
    }
    return `/images/playlists/${genre} - ${playlistName}.jpg`
  }

  const cutString = (searchString: string) => {
    let string = searchString.replace(` £ `,' - ')
    if (string.length< 48)  return string
    string = string.slice(0, 47)
    const lastIndexOf = string.lastIndexOf(' ')
    if (lastIndexOf > 40 ) {
      return string
    }
    return string.slice(0, lastIndexOf) + '...'
  }


  return (
    <div className='PlaylistSelection'>
      <h2>
                Choisissez les playlists que vous voulez avoir dans votre BlindTest
      </h2>
      <div className="listPlaylists">
                
        <div className='catalogue'>
          {
            ListPlaylists.map((playlist) => (
              <ListPlaylistCard {...playlist} />
            ))
          }
          <button className="ListPlaylistCard UserPlaylist" onClick={() =>{ setPlaylistsAfficher(userPlaylist) 
            setCategorieAfficher('UserPlaylist')}}>Mes playlists</button>

        </div>
        <div className="PlaylistsPossibles">
          <>
            {
              console.log('PlaylistsAfficher', PlaylistsAfficher)
            }
            {
              PlaylistsAfficher
            && PlaylistsAfficher.map(({ name, id }) => (
              <PlaylistCard 
                nom={name} 
                id={id}
                genre={CategorieAfficher}
                choisie={PlaylistsSelectionnees.includes(`${name}`)}
                onClick={() => { addNewPlaylist(name, id) }}
              />
            ))
            
            }
          </>    
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
                    <img src={getImageSelection(playlist)} 
                      alt="logo" 
                      className='logoPlaylist'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/trans.png'
                      }}/>                    
                    <div className="nomplaylistselection">
                      {cutString(playlist)}
                    </div>
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
          </div>
          <button className="Start" onClick={() => openDialog()}>Start</button>
        </div>
      </div>
      <DialogGameChoice open={open} onClose={handleClose} extractmusique={extractmusique} />
      <DialogNewPlaylist open={openNewPlaylist} onClose={() => setOpenNewPlaylist(false)} addNewUserPlaylist={addNewUserPlaylist} />
      {showAlert && <Alert  className="alert" variant="filled" severity="error">Vous n'avez sélectionné aucune Playlist</Alert>}
    </div>
  )
}

export default PlaylistSelection
