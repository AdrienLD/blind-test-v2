import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import { play } from './SpotifyAPI'
import Chargement from '../Chargement/Chargement'
import Countdown from '../VisuelQuestion/Countdown/Countdown'

interface AffichageQuestionProps {
  musique: Musique
  affichage: string
  setAffichage: setAffichageProps
  temps: number
}

export interface setAffichageProps {
  (value: string): void
}

function AffichageQuestion ({ musique, affichage, setAffichage, temps }: AffichageQuestionProps) {

  
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
        <p className='TitrePlaylist'>Playlist : {musique.playlist.split(' £ ')[1]}</p>
        {affichage === 'Question-Loading' && <Chargement />}
        {affichage === 'Question-Playing' && <Countdown duration={temps*1000} onFinish={() => setAffichage('Question-Answered')}/>}
        {affichage === 'Question-Answered' && <div className='Question-Answered'>
          <button onClick={moreTime}>+ de temps</button>
          <button onClick={response}>Réponse</button>
        </div> }
      </div>
    </div>
  )
}
export default AffichageQuestion
