import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import Chargement from '../../Common/Chargement/Chargement'
import Countdown from '../../Common/Countdown/Countdown'

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

  return (
    <div className='VisuelQuestion'>
      <img src={musique.playlistimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>Playlist : {musique.playlist.split(' £ ')[1]}</p>
        {affichage === 'Question-Loading' && <Chargement />}
        {affichage === 'Question-Playing' && <>
          <Countdown duration={temps*1000} onFinish={() => setAffichage('Question-Answered')}/>
          <div className='Question-Answered'>
            <button onClick={() => setAffichage('Question-Loading')}>Passer</button>
            <button onClick={() => setAffichage('Reponse')}>Réponse</button>
          </div>
        </>}
        {affichage === 'Question-Answered' && <div className='Question-Answered'>
          <button onClick={() => setAffichage('Question-Playing')}>+ de temps</button>
          <button onClick={() => setAffichage('Reponse')}>Réponse</button>
        </div> }
      </div>
    </div>
  )
}
export default AffichageQuestion
