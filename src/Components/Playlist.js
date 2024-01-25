/**
 * @type {[string, string[]][]}
 */

export const playlist = [
  [ 'Années' , [ '50', '60', '70', '80', '90', '2000', '2010', '2020', '2023' ] ],
  [ 'Genres' , [ 'Rock', 'Pop', 'Rap', 'RnB', 'Classique', 'Jazz', 'Monde' ] ],
  [ 'Artistes' , [ 'Imagine Dragons', 'Steel Panther', 'Ghost', 'Lady Gaga' ] ],
  [ 'Télévision' , [ 'Films', 'Gen Séries TV', 'Dessins animés', 'Anime OST', 'Disney', "Films d'animation", 'Jeux Vidéos', 'Publicités' ] ],
  [ 'Langues' , [ 'Chanson française', 'Rock Français', 'Rap Français' ] ],
  [ 'Ajouter' , [ 'Ajouter une playlist' ] ]
]

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

export async function getSpotifyToken(action) {

  try {
    const response = await fetch(`${API_URL}/gettoken`, fetchOptions('POST', { action, code: window.location.search.split('=')[1] }))
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function researchSpotify(recherche, type) {
  await testSpotifyToken()
  try {
    const response = await fetch(`${API_URL}/research`, fetchOptions('POST', { titre: recherche, type }))
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function extractMusiquesSpotify(playlistId) {
  await testSpotifyToken()
  try {
    const response = await fetch(`${API_URL}/tracks`, fetchOptions('POST', { playlistId }))
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function testSpotifyToken() {
  console.log('test')
  try {
    const response = await fetch(`${API_URL}/testtoken`, fetchOptions('GET'))
    const data = await response.json()
    if (data.error?.status === 401) await getSpotifyToken('refresh_token')
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}

export async function getSpotifyAction(commande, method) {
  await testSpotifyToken()
  try {
    await fetch(`${API_URL}/playpause`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        command: commande,
        method: method
      },
      credentials: 'include'
    })
  } catch (error) {
    console.error('Erreur lors de l\'échange du code:', error)
    throw error
  }
}