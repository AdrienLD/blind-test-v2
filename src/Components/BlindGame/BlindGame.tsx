import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './BlindGame.sass'
import { getSpotifyAction } from '../Playlist'
import { decryptPlaylist } from './SpotifyAPI'
import AffichageReponse from './AffichageReponse'
import AffichageQuestion from './AffichageQuestion'
import { sleep } from './utils'
import DialogRules, { RulesParams } from './DialogRules/DialogRules'

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

  const nextmusique = async () => {
    getAction('pause', 'PUT')
    await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
    sleep(200)
    let queue = (await getAction('queue', 'GET')).queue
    let indexMusicinQueue = -1
    console.log('queue', queue, receivedData[musiqueActuelle+1])
    for (let index = 0; index < queue.length; index++) {
      const element = queue[index]
      if (element.id === receivedData[musiqueActuelle+1].id) {
        indexMusicinQueue = index
        break
      }
    }
    if (indexMusicinQueue === -1) {
      await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
      sleep(200)
      queue = (await getAction('queue', 'GET')).queue
      for (let index = 0; index < queue.length; index++) {
        const element = queue[index]
        if (element.id === receivedData[musiqueActuelle+1].id) {
          indexMusicinQueue = index
          break
        }
      }
      if (indexMusicinQueue === -1) {
        console.error('Error while adding music to queue', receivedData[musiqueActuelle+1])
        localStorage.setItem('CurrentMusic', (musiqueActuelle + 1).toString())
        setMusiqueActuelle(musiqueActuelle + 1)
        await sleep(200)
        nextmusique()
      }
      await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
      sleep(200)
      queue = (await getAction('queue', 'GET')).queue
    }
    const volume = (await getAction('', 'GET')).device.volume_percent
    await getAction('volume?volume_percent=0', 'PUT')
    for (let index = 0; index < indexMusicinQueue; index++) {
      getAction('next', 'POST')
      getAction('pause', 'PUT')
    }
    await getAction('pause', 'PUT')
    await getAction('next', 'POST')
    await getAction('pause', 'PUT')
    console.log('indexMusicinQueue', modeDebut, tempsauDebut, tempsauDebut * 100)
    if (modeDebut === 'Selectionner') {
      await getSpotifyAction(`seek?position_ms=${tempsauDebut * 1000}`, 'PUT')
    } else {
      const positionAleatoireMs = Math.floor(Math.random() * 60000)
      await getSpotifyAction(`seek?position_ms=${positionAleatoireMs}`, 'PUT')
    }
    await getAction(`volume?volume_percent=${volume}`, 'PUT')
    await getAction('play', 'PUT')
    localStorage.setItem('CurrentMusic', (musiqueActuelle + 1).toString())
    setMusiqueActuelle(musiqueActuelle + 1)
    setAffichage('Question-Playing')
  }
    

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
    if (affichage === 'Question-Playing') {
      getAction('play', 'PUT')
    }
    if (affichage === 'Question-Loading') {
      nextmusique()
    }
    if (affichage === 'Question-Answered') {
      Answered()
    }
    if (affichage === 'Reponse') {
      getAction('play', 'PUT')
    }
  }, [ affichage ])
  

  
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
      
      <DialogRules open={openRules} onClose={() => setOpenRules(false)} modifyRules={Rules} modeInitial={mode} tempsInitial={temps} modeDebutInitial={modeDebut} tempsDebutInitial={tempsauDebut} />
    </div>
  )
}



export default BlindGame