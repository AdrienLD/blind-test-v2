import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import Chargement from '../../Common/Chargement/Chargement'

interface AffichageQuestionNPLP {
  musique: Musique
  affichage: string
  setAffichage: setAffichageProps
  paroles: React.ReactElement | null
}

export interface setAffichageProps {
  (value: string): void
}

function AffichageQuestion ({ musique, affichage, setAffichage, paroles }: AffichageQuestionNPLP) {
    
  return (
    <div className='VisuelQuestion PLP'>
      <img src={musique.albumimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>{musique.titre} by {musique.artiste}</p>
        {affichage === 'Question-Loading' && <Chargement />}
        {affichage === 'Question-Playing' && <>{ paroles }
          <div className='Question-Answered'>
            <button onClick={() => setAffichage('Question-Loading')}>Passer</button>
            <button onClick={() => setAffichage('Reponse')}>Réponse</button>
          </div>
        </>}
        {affichage === 'Question-Answered' && <>
          { paroles }
          <button onClick={() => setAffichage('Reponse')}>Réponse</button>
        </> }
      </div>
    </div>
  )
}
export default AffichageQuestion
