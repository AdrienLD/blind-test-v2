import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './BlindGame.sass'
import { getSpotifyAction } from '../../Common/Playlist'
import { decryptPlaylist } from './SpotifyAPI'
import AffichageReponse from './AffichageReponse'
import AffichageQuestion from './AffichageQuestion'
import { sleep } from './utils'
import DialogRules, { RulesParams } from './DialogRules/DialogRules'
import { nextmusique } from '../../Common/GameAction'

function BlindGame() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ affichage, setAffichage ] = React.useState('Chargement')
  const affichageRef = React.useRef(affichage)
  const navigate = useNavigate()
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])
  const [ spotifyEteint, setSpotifyEteint ] = React.useState(false)
  
  const [ openRules, setOpenRules ] = React.useState(false)
  const [ mode, setMode ] = React.useState('Arrêt')
  const [ temps, setTemps ] = React.useState(10)
  const [ modeDebut, setModeDebut ] = React.useState('Selectionner')
  const [ tempsauDebut, setTempsDebut ] = React.useState(0)
  const [ finPlaylist, setFinPlaylist ] = React.useState(false)

  React.useEffect(() => {
    const ciphertext = localStorage.getItem('playlistFinale')
    if (ciphertext) {
      setReceivedData(decryptPlaylist(ciphertext))
    } else {
      console.error('No playlist found in local storage')
      return
    }
    const currentMusic = localStorage.getItem('CurrentMusic')
    if (currentMusic) {
      if (currentMusic === '0') setMusiqueActuelle(0)
      else setMusiqueActuelle(parseInt(currentMusic)-1)
    } else {
      setMusiqueActuelle(0)
    }
    
  }, [])

  const getAction = async (action: string, method: string) => {
    const response = await getSpotifyAction(action, method)
    if (!response) return
    if (response.status === 404) {
      setSpotifyEteint(true)
    }
    return response
  }

  React.useEffect(() => {
    if (receivedData.length > 0) {
      setAffichage('Question-Loading')
    }
  } , [ receivedData ])

    

  const Answered = async () => {
    if (mode === 'Continu') {
      setAffichage('Reponse')
      await sleep(5000)
      setAffichage('Question-Loading')
    } else await getAction('pause', 'PUT')
  }

  const Rules = ({ mode, temps, modeDebut, tempsDebut }: RulesParams) => {
    console.log('Mode sélectionné:', mode, 'Temps d\'écoute:', temps, 'Mode de début:', modeDebut, 'Temps de début:', tempsDebut)
    setOpenRules(false)
    setMode(mode)
    setTemps(temps)
    setModeDebut(modeDebut)
    setTempsDebut(tempsDebut)
  }
  
  React.useEffect(() => {
    affichageRef.current = affichage
  
    const executeAsyncOperation = async () => {
      if (affichage === 'Question-Loading') {
        const musique = await nextmusique(receivedData, musiqueActuelle, modeDebut, tempsauDebut)
        if (musique === -1) {
          setSpotifyEteint(true)
        } else if (musique === -2) {
          setFinPlaylist(true)
        } else {
          setMusiqueActuelle(musique)
          setAffichage('Question-Playing')
        }
      } else if (affichage === 'Question-Answered') {
        Answered()
      } else if (affichage === 'Reponse') {
        getAction('play', 'PUT')
      }
    }
    executeAsyncOperation()
  }, [ affichage, nextmusique, receivedData, musiqueActuelle, modeDebut, tempsauDebut, Answered ])
  

  
  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if ((event.code === 'Space' || event.key === ' ') && !event.repeat) {
        event.preventDefault()
        if (affichageRef.current === 'Question-Playing') {
          setAffichage('Question-Answered')
        } else if (affichageRef.current === 'Question-Answered') {
          setAffichage('Question-Playing')
        }
      } else if ((event.key === 'Enter' || event.code === 'Enter') && !event.repeat) {
        if (affichageRef.current === 'Question-Answered') {
          setAffichage('Reponse')
        } else if (affichageRef.current === 'Reponse') {
          setAffichage('Question-Loading')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])


  return (
    <div>
      {
        spotifyEteint ? <h2>Spotify est éteint, veuillez le lancer pour jouer, puis recharger la page</h2>: <>
          <h2>BlindGame Musique : {musiqueActuelle}</h2>
          <div className="header">
            <button onClick={() => navigate('/ChoosePlaylist')}>Retour sélection</button>
            <button onClick={() => setOpenRules(true)}>Règles</button>
          </div>
          <div className="content">
            { affichage.includes('Question') && <AffichageQuestion musique={receivedData[musiqueActuelle]} affichage={affichage} setAffichage={setAffichage} temps={temps} /> }
            { affichage.includes('Reponse') && <AffichageReponse musique={receivedData[musiqueActuelle]} setAffichage={setAffichage} /> }

          </div>
          { affichage === 'Chargement' && <div>Chargement...</div> }
        </>
      }

      {
        finPlaylist && <div>Fin de la playlist </div>
      }
      
      <DialogRules open={openRules} onClose={() => setOpenRules(false)} modifyRules={Rules} modeInitial={mode} tempsInitial={temps} modeDebutInitial={modeDebut} tempsDebutInitial={tempsauDebut} />
    </div>
  )
}



export default BlindGame