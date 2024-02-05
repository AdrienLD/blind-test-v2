import React from 'react'
import Countdown from '../VisuelQuestion/Countdown/Countdown' // Mettre à jour le chemin d'accès selon la structure de votre projet

const AffichageQuestion = ({ musique, onStartMusique, onEndTimer, affichage }) => (
  <div className='VisuelQuestion'>
    <img src={musique.playlistimg} alt='pochette playlist' className='PochetteAlbum' />
    <div className="infos">
      <p className='TitrePlaylist'>Playlist : {musique.playlist}</p>
      {/* Gérer l'affichage conditionnel ici */}
    </div>
  </div>
)

export default AffichageQuestion
