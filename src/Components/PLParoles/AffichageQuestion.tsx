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
    
  const response = async () => {
    console.log('response')
    await setAffichage('Reponse')
  }


  return (
    <div className='VisuelQuestion'>
      <img src={musique.albumimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>{musique.titre} by {musique.artiste}</p>
        {affichage === 'Question-Loading' && <Chargement />}
        {affichage === 'Question-Playing' && <>{ paroles }<button onClick={() => setAffichage('Question-Loading')}>Passer</button></>}
        {affichage === 'Question-Answered' && <>
          { paroles }
          <button onClick={response}>Réponse</button>
        </> }
      </div>
    </div>
  )
}
export default AffichageQuestion
