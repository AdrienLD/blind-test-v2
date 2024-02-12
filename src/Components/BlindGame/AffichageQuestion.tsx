import React from 'react'
import Countdown from '../VisuelQuestion/Countdown/Countdown' // Mettre à jour le chemin d'accès selon la structure de votre projet
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import { play } from './SpotifyAPI'

interface AffichageQuestionProps {
  musique: Musique
  affichage: string
  setAffichage: setAffichageProps
}

export interface setAffichageProps {
  (value: string): void
}

function AffichageQuestion ({ musique, affichage, setAffichage }: AffichageQuestionProps) {

  
  const moreTime = async () => {
    await setAffichage('Question-Playing')
  }
    
  const response = async () => {
    await play()
    await setAffichage('Reponse')
    /*
          const utterance = new SpeechSynthesisUtterance(`${receivedData[musiqueActuelle].titre} de ${receivedData[musiqueActuelle].artiste}`)
          const allVoices = window.speechSynthesis.getVoices()
          const frenchVoices = allVoices.filter(voice => voice.lang.startsWith('fr-FR'))
          utterance.voice = frenchVoices[8]
          utterance.rate = 0.5
          await window.speechSynthesis.speak(utterance)
          await sleep(3000)
          await nextmusique()
          */
  }


  return (
    <div className='VisuelQuestion'>
      <img src={musique.playlistimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>Playlist : {musique.playlist}</p>
        {affichage === 'Question-Loading' && <Countdown />}
        {affichage === 'Question-Playing' && <VideoCountdown setAffichage={setAffichage}/>}
        {affichage === 'Question-Answered' && <div>
          <button onClick={moreTime}>+ de temps</button>
          <button onClick={response}>Réponse</button>
        </div> }
      </div>
    </div>
  )
}

function VideoCountdown({ setAffichage }: { setAffichage: setAffichageProps}) {
  const endTimer = async () => {
    setAffichage('Question-Loading')
  }
  return (
    <div>
      <video width="320" height="240" controls autoPlay muted onEnded={endTimer}>
        <source src={`${process.env.PUBLIC_URL}/countdown10.mp4`} type="video/mp4" />
                                          Votre navigateur ne prend pas en charge la balise vidéo.
      </video>
    </div>
  )
}
export default AffichageQuestion
