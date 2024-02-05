import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './BlindGame.sass'
import Countdown from '../VisuelQuestion/Countdown/Countdown'
import { getSpotifyAction, secretKey } from '../Playlist'
import CryptoJS from 'crypto-js'

function BlindGame() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ affichage, setAffichage ] = React.useState(0)
  const [ entrainement, setEntrainement ] = React.useState(false)
  const navigate = useNavigate()
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])

  React.useEffect(() => {
    const modeEntrainement = localStorage.getItem('mode') === 'entrainement'
    setEntrainement(modeEntrainement)
    const ciphertext = localStorage.getItem('playlistFinale')
    if (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      console.log('decryptedData', JSON.parse(decryptedData))
      setReceivedData(JSON.parse(decryptedData)) 
    } else {
      console.error('No playlist found in local storage')
      return
    }
    
  }, [])

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


  const moreTime = async () => {
    await getSpotifyAction('play', 'PUT')
    await setAffichage(1)
  }

  
  const nextmusique = async () => {
    await getSpotifyAction('pause', 'PUT')
    setAffichage(0)
    sleep(200)
    await getSpotifyAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
    await sleep(200)
    const userNextMusic = await getSpotifyAction('queue', 'GET')
    let queue = userNextMusic.queue
    let indexMusicinQueue = -1
    while (queue.length > 0 && indexMusicinQueue === -1) {
      for (let index = 0; index < queue.length; index++) {
        const element = queue[index]
        if (element.id === receivedData[musiqueActuelle+1].id) {
          indexMusicinQueue = index
          break
        }
      }
      if (indexMusicinQueue === -1) {
        for (let index = 0; index < queue.length; index++) {
          getSpotifyAction('next', 'POST')
          getSpotifyAction('pause', 'PUT')
        }
        queue = (await getSpotifyAction('queue', 'GET')).queue
      }
    }
    if (indexMusicinQueue === -1) {
      console.error('Music not found in queue')
      return
    }
    for (let index = 0; index <= indexMusicinQueue; index++) {
      getSpotifyAction('next', 'POST')
      getSpotifyAction('pause', 'PUT')
    }
    await getSpotifyAction('pause', 'PUT')
    await setMusiqueActuelle(musiqueActuelle + 1)
  }

  const response = async () => {
    if (!entrainement) {
      await getSpotifyAction('play', 'PUT')
    } else {
      const utterance = new SpeechSynthesisUtterance(`${receivedData[musiqueActuelle].titre} de ${receivedData[musiqueActuelle].artiste}`)
      const allVoices = window.speechSynthesis.getVoices()
      const frenchVoices = allVoices.filter(voice => voice.lang.startsWith('fr-FR'))
      utterance.voice = frenchVoices[8]
      utterance.rate = 0.5
      await window.speechSynthesis.speak(utterance)
      await sleep(3000)
      await nextmusique()
    }
    await setAffichage(3)

  }

  const endTimer = async () => {
    await getSpotifyAction('pause', 'PUT')
    if (!entrainement) {
      setAffichage(2)
    } else {
      console.log('entrainement')
      await response()
    }
  }
  const startmusique = async () => {
    await getSpotifyAction('play', 'PUT')
    await sleep(5000)
    if (!entrainement) {
      await setAffichage(1)
    } else {
      await sleep(20000)
      await endTimer()
    }
  }

  return (
    <div>
      <h2>BlindGame Musique : {musiqueActuelle}
        <button onClick={() => navigate('/ChoosePlaylist')}>Retour à la sélection : </button>
      </h2>
      {
        receivedData.length === 0 ? <div>Chargement...</div>: affichage <= 2? <div className='VisuelQuestion'>
          <img src={receivedData[musiqueActuelle].playlistimg} alt='pochette playlist' className='PochetteAlbum' />
          <div className="infos">
            <p className='TitrePlaylist'>Playlist : {receivedData[musiqueActuelle].playlist}</p>
            {affichage === 0 ? <Countdown onFinish={startmusique} timer={0} />: affichage === 1? <video width="320" height="240" controls autoPlay muted onEnded={endTimer}>
              <source src={`${process.env.PUBLIC_URL}/countdown10.mp4`} type="video/mp4" />
                                        Votre navigateur ne prend pas en charge la balise vidéo.
            </video>: <div>
              <button onClick={moreTime}>+ de temps</button>
              <button onClick={response}>Réponse</button>
            </div>
            }
          </div>
        </div>: <div className='VisuelQuestion'>
          <img src={receivedData[musiqueActuelle].albumimg} alt='pochette playlist' className='PochetteAlbum' />
          <div className="infos">
            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].titre}</p>
            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].artiste}</p>
            <p className='TitrePlaylist'>{receivedData[musiqueActuelle].album}</p>
            {
              <div>
                <button onClick={nextmusique}>Musique suivante</button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default BlindGame