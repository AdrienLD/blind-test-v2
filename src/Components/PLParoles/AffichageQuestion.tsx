import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import Chargement from '../../Common/Chargement/Chargement'
import { AffichageState, QUESTION_ANSWERED, QUESTION_LOADING, QUESTION_PLAYING, QUESTION_REPONSE, SetAffichage } from './PLParoles'

interface AffichageQuestionNPLP {
  musique: Musique
  affichage: AffichageState
  setAffichage: SetAffichage
  paroles: React.ReactElement | null
}

function AffichageQuestion ({ musique, affichage, setAffichage, paroles }: AffichageQuestionNPLP) {
    
  return (
    <div className='VisuelQuestion PLP'>
      <img src={musique.albumimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>{musique.titre} by {musique.artiste}</p>
        {affichage === QUESTION_LOADING && <Chargement />}
        {affichage === QUESTION_PLAYING && <>{ paroles }
          <div className='Question-Answered'>
            <button onClick={() => setAffichage(QUESTION_LOADING)}>Passer</button>
            <button onClick={() => setAffichage(QUESTION_REPONSE)}>Réponse</button>
          </div>
        </>}
        {affichage === QUESTION_ANSWERED && <>
          { paroles }
          <button onClick={() => setAffichage(QUESTION_REPONSE)}>Réponse</button>
        </> }
      </div>
    </div>
  )
}
export default AffichageQuestion
