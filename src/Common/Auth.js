
export const authentificate = (add) => {
  const spotifyScopes = [
    'user-read-playback-state',  // Accès en lecture à l'état de lecture courant de l'utilisateur
    'user-modify-playback-state', // Permet de contrôler la lecture sur les appareils de l'utilisateur
    'user-read-currently-playing', // Accès aux informations sur la piste actuellement en lecture
    'streaming', // Utilisation de l'API Web Playback SDK pour lire du contenu dans le navigateur
    'playlist-read-private', // Accès aux playlists privées de l'utilisateur
    'playlist-read-collaborative', // Accès aux playlists collaboratives de l'utilisateur
    'user-library-read' // Accès à la bibliothèque musicale de l'utilisateur
  ]
  
  const REDIRECT_URI = 'http://localhost:3000/Auth'
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
    
  window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${spotifyScopes.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}${add}`
  console.log('CLIENT_ID', CLIENT_ID, `redirect_uri=${encodeURIComponent(REDIRECT_URI)}${add}`)
    
}