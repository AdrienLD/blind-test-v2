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
    setMusiqueActuelle(musiqueActuelle + 1)
    setAffichage(0)
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
    await getSpotifyAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
    await sleep(100)
    await getSpotifyAction('next', 'POST')
    await sleep(100)
    let musiqueactuelle = await getSpotifyAction('currently-playing', 'GET')
    await sleep(100)
    while (musiqueactuelle.item.id !== receivedData[musiqueActuelle].id) {
      await getSpotifyAction('next', 'POST')
      await sleep(100)
      musiqueactuelle = await getSpotifyAction('currently-playing', 'GET')
      await sleep(100)
    }
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