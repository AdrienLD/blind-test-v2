import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import { setAffichageProps } from './AffichageQuestion'

interface AffichageReponseProps {
  musique: Musique
  setAffichage: setAffichageProps
}

function AffichageReponse ({ musique, setAffichage }: AffichageReponseProps){
  return (
    <div className='VisuelQuestion'>
      <img src={musique.albumimg} alt='pochette playlist' className='PochetteAlbum' />
      <div className="infos">
        <p className='TitrePlaylist'>{musique.titre}</p>
        <p className='TitrePlaylist'>{musique.artiste}</p>
        <p className='TitrePlaylist'>{musique.album}</p>
        <div>
          <button onClick={() =>setAffichage('Question-Loading')}>Musique suivante</button>
        </div>
      </div>
    </div>
  )}

export default AffichageReponse
