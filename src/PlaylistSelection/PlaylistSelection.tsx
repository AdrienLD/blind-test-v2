import React from 'react'
import PlaylistCard from '../Components/PlaylistCard/PlaylistCard'
import './PlaylistSelection.sass'
import ListPlaylistCard, { ListPlaylistCardProps } from '../Components/PlaylistCard/ListPlaylistCard/ListPlaylistCard'
import DeleteIcon from '@mui/icons-material/Delete'
import { authentificate, getUserInfos, playlist, secretKey } from '../server/Playlist'
import CryptoJS from 'crypto-js'

import Alert from '@mui/material/Alert'
import DialogGameChoice from '../Components/Dialog/DialogGameChoice/DialogGameChoice'
import DialogNewPlaylist from '../Components/Dialog/DialogNewPlaylist/DialogNewPlaylist'
import { useNavigate } from 'react-router-dom'



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
  const [ userPlaylist, setUserPlaylist ] = React.useState<[string, string[]]>([ 'UserPlaylist', [ 'Ajouter' ] ])
  const [ userPlaylistInfos, setUserPlaylistInfos ] = React.useState<string[][]>(localStorage.getItem('userPlaylistInfos') ? JSON.parse(localStorage.getItem('userPlaylistInfos') as string) : [ [ 'Ajouter', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/PlusCM128.svg/1200px-PlusCM128.svg.png', '' ] ])
  const playlistSelections = playlist
  const [ PlaylistsAfficher, setPlaylistsAfficher ] = React.useState<[string, string[]]>(playlistSelections[0])
  const [ User, setUser ] = React.useState<any>()

  const [ PlaylistsSelectionnees, setPlaylistsSelectionnees ] = React.useState<string[]>(() => {
    const playlistsJson = localStorage.getItem('playlists')
    return playlistsJson ? JSON.parse(playlistsJson) : []
  })

  const navigate = useNavigate()

  React.useEffect(() => {
    if (PlaylistsAfficher[0] === 'UserPlaylist') {
      setPlaylistsAfficher(userPlaylist)
    }
  }, [ userPlaylist ])

  React.useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(PlaylistsSelectionnees))
  }, [ PlaylistsSelectionnees ])

  async function getUser () {
    const user = await getUserInfos()
    console.log('user', user)
    setUser(user)
  }
      
  React.useEffect(() => {
    console.log('userPlaylistInfos', User)

    const nomsPlaylists = userPlaylistInfos.map(playlist => playlist[0])
    setUserPlaylist([ 'UserPlaylist', nomsPlaylists ])
    setPlaylistsAfficher(playlistSelections[0])
    if (!User) getUser()
  }, [])
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  

  React.useEffect(() => {
    localStorage.setItem('userPlaylistInfos', JSON.stringify(userPlaylistInfos))
  }, [ userPlaylistInfos ])

  const ListPlaylists: ListPlaylistCardProps[] = playlistSelections.map((selection): ListPlaylistCardProps => ({
    nom: selection[0],
    onHover: () => { setPlaylistsAfficher(selection) }
  }))


  const addNewPlaylist = (listplaylist: string, playlist: string) => {
    const playlists = `${listplaylist} £ ${playlist}`
    if (playlists === 'UserPlaylist £ Ajouter') {
      setOpenNewPlaylist(true)
    } else
      if (!PlaylistsSelectionnees.includes(playlists)) {
        setPlaylistsSelectionnees(PlaylistsSelectionnees.concat(playlists))
        setShowAlert(false)
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

  }

  const  addNewUserPlaylist = async (playlist: any) => {
    console.log('playlist', playlist, playlist.name)
    setOpenNewPlaylist(false)
    await setUserPlaylist(userPlaylist => {
      const updatedFirstElement = userPlaylist[0]
      const updatedSecondElement = [ ...userPlaylist[1], playlist.name ]
      return [ updatedFirstElement, updatedSecondElement ]
    })
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

  const handleDeletePlaylist = (playlistName: string) => {
    console.log('playlistName', playlistName, userPlaylist)
    const index = userPlaylist[1].findIndex(playlist => playlist === playlistName)
    if (index !== -1) {
      const newPlaylists = [ ...userPlaylist[1] ]
      newPlaylists.splice(index, 1)
      setUserPlaylist([ userPlaylist[0], newPlaylists ])
      if (PlaylistsSelectionnees.includes(`UserPlaylist £ ${playlistName}`)) {
        setPlaylistsSelectionnees(PlaylistsSelectionnees.filter(playlist => playlist !== `UserPlaylist £ ${playlistName}`))
      }
    }
    const indexInfos = userPlaylistInfos.findIndex(playlist => playlist[0] === playlistName)
    if (indexInfos !== -1) {
      const newPlaylistsInfos = [ ...userPlaylistInfos ]
      newPlaylistsInfos.splice(indexInfos, 1)
      setUserPlaylistInfos(newPlaylistsInfos)
    }
  }
  const changeAccount = () => {
    authentificate('&show_dialog=true')
  }

  return (
    <div className='PlaylistSelection'>
      <h2>
                Choisissez les playlists que vous voulez avoir dans votre BlindTest
      </h2>
      { 
        User && <div className='UserInfos' onClick={() => changeAccount()}>
          <img src={User.images[0]?.url ?? '/images/S.png'} 
            alt='user' 
            className='UserImage'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/playlists/trans.png'
            }}
          />  
          <div className="UserText">
            <div className='UserName'>{User.display_name}</div>
            <div className="info">Cliquez pour changer d'utilisateur</div>
          </div>
        </div>
      }
      <div className="listPlaylists">
                
        <div className='catalogue'>
          {
            ListPlaylists.map((playlist) => (
              <ListPlaylistCard {...playlist} />
            ))
          }
          <button className="ListPlaylistCard UserPlaylist" onClick={() => setPlaylistsAfficher(userPlaylist)}>Mes playlists</button>

        </div>
        <div className="PlaylistsPossibles">
          {
            PlaylistsAfficher[1].map((playlist) => (
              <PlaylistCard 
                genre={PlaylistsAfficher[0]}
                nom={playlist} 
                choisie={PlaylistsSelectionnees.includes(`${PlaylistsAfficher[0]} £ ${playlist}`)}
                onClick={() => { addNewPlaylist(PlaylistsAfficher[0], playlist) }} 
                onDeletePlaylist={handleDeletePlaylist}/>
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
                    <img src={getImageSelection(playlist)} 
                      alt="logo" 
                      className='logoPlaylist'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/playlists/trans.png'
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
              <button onClick={() => extractmusique('test')}>Tester la BDD </button>
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
