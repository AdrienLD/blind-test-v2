import React from 'react'
import './App.css'
import { authentificate } from './Common/Playlist'

function App() {
  

  

  return (
    <div className="App">
      <h2>
        Bienvenue dans Songs !
      </h2>
      <div className='description'>
        <h3>Personnalisez votre expérience musicale</h3>
        <p>Lancez-vous dans l'aventure Songs en sélectionnant vos playlists préférées déjà disponibles sur la plateforme de ton choix. Découvrez de nouveaux horizons musicaux en ajoutant de nouvelles playlists à votre collection en toute simplicité, enrichissant ainsi votre expérience sur Songs.</p>

        <h3>Modes de jeu captivants sur Songs</h3>
        <p>Songs vous propose deux modes de jeu immersifs pour tester vos connaissances musicales ou pour vous amuser entre amis :</p>

        <ul>
          <li><strong>Blindtest</strong> : Testez votre sens de l'écoute ! Une musique sera jouée pendant 10 secondes avant de se mettre en pause. Devinez le titre de la chanson pour montrer votre expertise musicale.</li>
          <li><strong>N'oubliez pas les paroles</strong> : Ce mode est idéal pour les amateurs de chant. Écoutez les paroles d'une chanson qui s'arrêtera brusquement, et tentez de deviner la suite. Un jeu amusant qui mettra à l'épreuve votre mémoire et votre amour pour la musique.</li>
        </ul>

        <h3>Commencez dès maintenant ! Connectez vous à votre plateforme préférée : </h3>
        <div className="logosmusique">
          <img src="/images/Spotify.png" alt="Spotify" onClick={() => authentificate('')}/>
          <img src="/images/Deezer.png" style={{ filter: 'grayscale(100%)' }} alt="Deezer" />
          <img src="/images/AppleMusic.png" style={{ filter: 'grayscale(100%)' }} alt="AppleMusic" />
        </div>

        <h3>Alerte</h3>
        <p>Actuellement, Songs est uniquement compatible avec Spotify. <br/>
        L'API de Spotify étant en mode développeur, l'application ne peut pas être rendue publique. <br/>
        Chaque compte doit être autorisé au préalable. Pour cela, veuillez contacter le créateur avec l'adresse email associée à votre compte Spotify afin qu'il puisse vous donner accès à l'API.</p>
      </div>

    </div>
  )
}

export default App
