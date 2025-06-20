import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import { QUESTION_LOADING, SetAffichage } from './PLParoles'

interface AffichageReponseNPLP {
  musique: Musique
  setAffichage: SetAffichage
  paroles: React.ReactElement | null
}

function AffichageReponse ({ musique, setAffichage, paroles }: AffichageReponseNPLP){
  return (
    <div className='VisuelQuestion PLP'>
      <img src={musique.albumimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>{musique.titre} by {musique.artiste}</p>
        {paroles}
        <div className='Response'>
          <button onClick={() =>setAffichage(QUESTION_LOADING)}>Musique suivante</button>
        </div>
      </div>
    </div>
  )}

export default AffichageReponse
