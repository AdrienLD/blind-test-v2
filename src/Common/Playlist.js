/**
 * @type {[string, string[]][]}
 */

export const playlist = [
  [ 'Années' , [ '50', '60', '70', '80', '90', '2000', '2010' ] ],
  [ 'Genres' , [ 'Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde' ] ],
  [ 'Artistes' , [ 'Imagine Dragons', 'Steel Panther', 'Ghost', 'Lady Gaga', 'Taylor Swift', 'Miley Cyrus', 'Indochine', 'Sorano', 'Shakira' ] ],
  [ 'Télévision' , [ 'Films', 'séries tv', 'Séries Dessins Animés', 'Anime Opening', 'Disney', "Films d'animation", 'Jeux Vidéos', 'Publicités' ] ],
  [ 'Français' , [ 'Hits', 'Rock', 'Rap', 'Variétée' ] ]
]

export const playlistUtilisateur = [
  []
]

export const secretKey = 'meilleur'

const headers = {
  'Content-Type': 'application/json'
}

const fetchOptions = (method, body = null) => ({
  method,
  headers,
  body: body ? JSON.stringify(body) : null,
  credentials: 'include'
})

const API_URL = '/api'


const verifyToken = async (data, action) => {
  console.log('data', data)
  if (data.status === 401 || !data || data.error?.status === 401) {
    console.error('Spotify déconnecté')
    await getSpotifyToken()
    const test = await testSpotifyToken()
    if (test.error?.status === 401 || !test) {
      console.error('Spotify éteint')
      return test
    } else {
      action()
    }
  } else if (data.status === 404|| data.error?.status === 404) {
    console.error('Spotify déconnecté')
    return data
  }
}

async function SpotifyToken(action){
  try {
    const response = await fetch(`${API_URL}/gettoken`, fetchOptions('POST', { action, code: window.location.search.split('=')[1] }))
    console.log('response', response)
    const erreur = await verifyToken(response, () => SpotifyToken(action))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getUserInfos() {
  try {
    const adminInfos = await fetch (`${API_URL}/getplayerstate`, fetchOptions('GET'))
    const erreur = await verifyToken(adminInfos, () => getUserInfos())
    if (erreur) return erreur
    const adminData = await adminInfos.json()
    console.log('adminData', adminData)
    return adminData
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getSpotifyToken() {
  let result = await SpotifyToken('refreshToken')
  console.log('result', result)
  if (!result.token) result = await SpotifyToken('gettoken')
  return result
}

export async function researchSpotify(playlist, type) {
  let recherche
  switch (playlist[0]){
    case 'Années':
      recherche = `Années ${playlist[1]}`
      break
    case 'Genres':
      recherche = `${playlist[1]} Classics`
      break
    case 'Artistes':
      recherche = `This is ${playlist[1]}`
      break
    case 'Télévision':
      recherche = `musiques de ${playlist[1]}`
      break
    case 'Français':
      recherche = `gen ${playlist[1]} Français`
      break
  }
  try {
    const response = await fetch(`${API_URL}/research`, fetchOptions('POST', { titre: recherche, type }))
    const erreur = await verifyToken(response, () => researchSpotify(recherche, type))
    if (erreur) return erreur
    const data = await response.json()
    const topTenItems = data.playlists.items.slice(0, 10)
    const playlistFound = topTenItems.find(playlist => playlist.owner.uri === 'spotify:user:spotify')
    return playlistFound || data.playlists.items[0]
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function testSpotifyToken() {
  try {
    const response = await fetch(`${API_URL}/testtoken`, fetchOptions('GET'))
    const data = await response.json()
    if (data.error?.status === 401 || !data) await getSpotifyToken()
    else return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}


export async function getSpotifyAction(commande, method) {
  try {
    const response = await fetch(`${API_URL}/playpause`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        command: commande,
        method: method
      },
      credentials: 'include'
    })
    const erreur = await verifyToken(response, () => getSpotifyAction(commande, method))
    if (erreur) return erreur
    if (response.ok && response.status !== 204) {
      const data = await response.json()
      console.log(data)
      return data
    } else {
      console.log('Réponse réussie sans corps de contenu.')
      
    }
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function searchNewSpotifyPlaylist(playlistId) {
  try {
    const response = await fetch(`${API_URL}/newplaylist`, fetchOptions('POST', { playlistId }))
    const erreur = await verifyToken(response, () => getSpotifyAction(commande, method))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getLyricsId(musiqueId) {
  try {
    const response = await fetch(`${API_URL}/getlyricsId`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        titreid: musiqueId
      }
    })
    const data = await response.json()
    console.log(data)
    return data.lyrics.lines  // Retourner les données reçues

  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    return 'Lyrics non trouvés'
  }
}

export async function replaceThisPlaylist(playlistId) {
  try {
    console.log('ceciestplaylistId', playlistId)
    const response = await fetch(`${API_URL}/replaceplaylist`, fetchOptions('POST', { playlistId }))
    const erreur = await verifyToken(response, () => replaceThisPlaylist(playlistId))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function nextedMusic(MusicId, positionMs) {
  try {
    console.log('ceciestplaylistId', MusicId)
    const response = await fetch(`${API_URL}/nextmusic`, fetchOptions('POST', { MusicId, positionMs }))
    const erreur = await verifyToken(response, () => replaceThisPlaylist(MusicId))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getSyncLyrics(artist, title) {
  try {
    const response = await fetch(`${API_URL}/searchmusic`, fetchOptions('POST', { artist, title }))
    const data = await response.json()
    console.log('getSyncLyrics', data)
    return data
  } catch (error) {
    console.error('Erreur lors de la recherche des paroles synchronisées:', error)
    throw error
  }
}


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

  const REDIRECT_URI = 'https://songs.flgr.fr/Auth'
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID

  console.log('CLIENT_ID', CLIENT_ID, `redirect_uri=${encodeURIComponent(REDIRECT_URI)}${add}`)

  window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${spotifyScopes.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}${add}`

}

