import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './BlindGame.sass'
import { getSpotifyAction } from '../Playlist'
import { decryptPlaylist } from './SpotifyAPI'
import AffichageReponse from './AffichageReponse'
import AffichageQuestion from './AffichageQuestion'
import { sleep } from './utils'

function BlindGame() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ affichage, setAffichage ] = React.useState('Chargement')
  const affichageRef = React.useRef(affichage)
  const navigate = useNavigate()
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])
  const [ spotifyEteint, setSpotifyEteint ] = React.useState(false)

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
    while (queue.length > 0 && indexMusicinQueue === -1) {
      for (let index = 0; index < queue.length; index++) {
        const element = queue[index]
        if (element.id === receivedData[musiqueActuelle+1].id) {
          indexMusicinQueue = index
          break
        }
      }
      console.log('indexMusicinQueue', indexMusicinQueue)
      if (indexMusicinQueue === -1) {
        for (let index = 0; index < queue.length; index++) {
          await getAction('next', 'POST')
          await getAction('pause', 'PUT')
        }
        await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
        sleep(200)
        queue = (await getAction('queue', 'GET')).queue
      }
    }
    if (indexMusicinQueue === -1) {
      await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')

    }
    for (let index = 0; index < indexMusicinQueue; index++) {
      getAction('next', 'POST')
      getAction('pause', 'PUT')
    }
    await getAction('pause', 'PUT')
    await getAction('next', 'POST')
    localStorage.setItem('CurrentMusic', (musiqueActuelle + 1).toString())
    setMusiqueActuelle(musiqueActuelle + 1)
    setAffichage('Question-Playing')
  }
    

  const Answered = async () => {
    await getAction('pause', 'PUT')
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
          <div className="content">
            { affichage.includes('Question') && <AffichageQuestion musique={receivedData[musiqueActuelle]} affichage={affichage} setAffichage={setAffichage} /> }
            { affichage.includes('Reponse') && <AffichageReponse musique={receivedData[musiqueActuelle]} setAffichage={setAffichage} /> }
            <button onClick={() => navigate('/ChoosePlaylist')}>Retour à la sélection : </button>

          </div>
          { affichage === 'Chargement' && <div>Chargement...</div> }
        </>
      }
      
    </div>
  )
}



export default BlindGame