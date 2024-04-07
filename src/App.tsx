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
        <h3>Découvrez Songs : Votre plateforme de jeux musicaux</h3>
        <p>Plongez dans l'univers de Songs, notre site révolutionnaire conçu spécialement pour les mélomanes et les amateurs de jeux musicaux. Connectez-vous facilement à votre plateforme de musique préférée, actuellement exclusivement sur Spotify, et vivez une expérience où votre passion pour la musique se mêle au divertissement interactif.</p>

        <h3>Personnalisez votre expérience musicale</h3>
        <p>Lancez-vous dans l'aventure Songs en sélectionnant vos playlists préférées déjà disponibles sur Spotify. Découvrez de nouveaux horizons musicaux en ajoutant de nouvelles playlists à votre collection en toute simplicité, enrichissant ainsi votre expérience sur Songs.</p>

        <h3>Modes de jeu captivants sur Songs</h3>
        <p>Songs vous propose deux modes de jeu immersifs pour tester vos connaissances musicales ou pour vous amuser entre amis :</p>

        <ul>
          <li><strong>Blindtest</strong> : Testez votre sens de l'écoute ! Une musique sera jouée pendant 10 secondes avant de se mettre en pause. Devinez le titre de la chanson pour montrer votre expertise musicale.</li>
          <li><strong>N'oubliez pas les paroles</strong> : Ce mode est idéal pour les amateurs de chant. Écoutez les paroles d'une chanson qui s'arrêtera brusquement, et tentez de deviner la suite. Un jeu amusant qui mettra à l'épreuve votre mémoire et votre amour pour la musique.</li>
        </ul>

        <p>Songs est l'endroit parfait pour les fans de musique recherchant une expérience ludique unique, mêlant jeu et passion musicale. Que vous soyez à la recherche d'un défi compétitif ou d'une activité divertissante pour animer vos soirées, Songs offre une nouvelle dimension à l'écoute musicale. Connectez-vous, sélectionnez vos playlists, et jouez. La musique vous attend sur Songs !</p>


        <h3>Commencez dès maintenant ! Connectez vous à votre plateforme préférée : </h3>
        <div className="logosmusique">
          <img src="/images/Spotify.png" alt="Spotify" onClick={() => authentificate('')}/>
          <img src="/images/Deezer.png" style={{ filter: 'grayscale(70%)' }} alt="Deezer" />
          <img src="/images/AppleMusic.png" style={{ filter: 'grayscale(70%)' }} alt="AppleMusic" />
        </div>
      </div>

    </div>
  )
}

export default App
