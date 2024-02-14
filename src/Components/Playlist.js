/**
 * @type {[string, string[]][]}
 */



export const playlist = [
  [ 'Années' , [ '50', '60', '70', '80', '90', '2000', '2010', '2020', '2023' ] ],
  [ 'Genres' , [ 'Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde' ] ],
  [ 'Artistes' , [ 'Imagine Dragons', 'Steel Panther', 'Ghost', 'Lady Gaga' ] ],
  [ 'Télévision' , [ 'Films', 'Gen Séries TV', 'Dessins animés', 'Anime Opening', 'Disney', "Films d'animation", 'Jeux Vidéos', 'Publicités' ] ],
  [ 'Langues' , [ 'Chanson française', 'Rock Français', 'Rap Français' ] ]
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

const API_URL = 'http://localhost:4000/api'


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
    const erreur = await verifyToken(response, () => SpotifyToken(action))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getSpotifyToken() {
  const result = await SpotifyToken('refreshToken')
  if (!result.token) await SpotifyToken('gettoken')
}

export async function researchSpotify(recherche, type) {
  try {
    const response = await fetch(`${API_URL}/research`, fetchOptions('POST', { titre: recherche, type }))
    const erreur = await verifyToken(response, () => researchSpotify(recherche, type))
    if (erreur) return erreur
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function extractMusiquesSpotify(playlistId, offset) {
  try {
    const response = await fetch(`${API_URL}/tracks`, fetchOptions('POST', { playlistId, offset }))
    const data = await response.json()
    const erreur = await verifyToken(data, () => extractMusiquesSpotify(playlistId, offset))
    if (erreur) return erreur
    console.log('data2', data)
    return data
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

