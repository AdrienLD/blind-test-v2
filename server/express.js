import nodeFetch from 'node-fetch'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { URLSearchParams } from 'url'

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
dotenv.config()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

app.post('/api/gettoken', async (req, res) => {
  console.log('gettoken')
  const action = req.body.action
  const code = action === 'gettoken' ? req.body.code : req.cookies.refresh_token
  const params = new URLSearchParams()
  params.append('grant_type', action === 'gettoken' ? 'authorization_code' : 'refresh_token')
  action === 'gettoken' ? params.append('redirect_uri', 'http://localhost:3000/ChoosePlaylist') : null
  params.append(action === 'gettoken' ? 'code' : 'refresh_token' , code)
  const headers = {
    'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: params,
      headers: headers,
      credentials: 'include'
    })
    const data = await response.json()     
    if (data.access_token) res.cookie('token', data.access_token, { httpOnly: true })
    if (data.refresh_token) res.cookie('refresh_token', data.refresh_token, { httpOnly: true })
    res.send(data)
  } catch (error) {
    console.error('Error fetching access token:', error.message)
    res.status(500).send('Internal Server Error')
  }
})



app.get('/api/testtoken', async (req, res) => {
  try {
    const token = req.cookies.token
    console.log('test')
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    console.log(response.status)
    if (response.status === 204) return res.json({ error: { status: 401 } })
    return res.json(await response.json())
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})


app.post('/api/research', async (req, res) => {
  const { titre, type } = req.body
    

  try {
    const token = 'BQA_IbGqbpC05I046E4JV95JXThNaYKissrv4vAX7IzOAofT24s0un9UbpZo2vlnGKgR2bhdEDWAq2VwwaVPnlvIsipWy6CnHjbcyyEVJwYKCbxptmHqwU8qWpQvI3Bb7A_gF6b1c5fCOYRRgXdCdMMp97EucuWNoyNRGAfC1fDK16GZgnJl2sl4ZCkebmN9lDAs_7jcq3LDb_9ymC1512JczQ'
    console.log('research')
    const response = await nodeFetch(`https://api.spotify.com/v1/search?q=${titre}&type=${type}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Impossible de rechercher la musique : ', error)
    res.status(500).json({ error: 'Erreur lors de l\'échange du code.' })
  }
})

app.post('/api/tracks', async (req, res) => {
  const { playlistId, offset } = req.body
  try {
    const token = req.cookies.token
    console.log('tracks')
    const response = await nodeFetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Impossible d extraire les musiques : ', error)
    res.status(500).json({ error: 'Erreur lors de l\'échange du code.' })
  }
})

app.get('/api/getplayerstate', async (req, res) => {
  try {
    const token = req.cookies.token
    console.log('getplayserestat')
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Spotify API responded with status: ${response.status}`)
    }

    const data = await response.json()

    res.json(data)
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/api/playpause', async (req, res) => {
  const commande = req.headers.command
  const method = req.headers.method
  try {
    const token = req.cookies.token
    console.log('playpause')
    const response = await fetch(`https://api.spotify.com/v1/me/player/${commande}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok && response.status !== 204) {
      const data = await response.json()
      console.log(data)
      res.json(data)
    } else {
      console.log('Réponse réussie sans corps de contenu.')
      res.status(response.status).send('Réponse sans contenu')
    }
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})


app.get('/api/getlyricsId', async (req, res) => {
  const titreId = req.headers.titreid
  try {
    const response = await fetch(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${titreId}`, {
      method: 'GET'
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/api/newplaylist', async (req, res) => {
  const { playlistId } = req.body
  try {
    const token = 'BQA_IbGqbpC05I046E4JV95JXThNaYKissrv4vAX7IzOAofT24s0un9UbpZo2vlnGKgR2bhdEDWAq2VwwaVPnlvIsipWy6CnHjbcyyEVJwYKCbxptmHqwU8qWpQvI3Bb7A_gF6b1c5fCOYRRgXdCdMMp97EucuWNoyNRGAfC1fDK16GZgnJl2sl4ZCkebmN9lDAs_7jcq3LDb_9ymC1512JczQ'
    console.log('newPlaylist')
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    console.log(data)
    res.json(data)
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/api/start-auth', (req, res) => {
  const spotifyScopes = [
    'user-read-playback-state',  // Accès en lecture à l'état de lecture courant de l'utilisateur
    'user-modify-playback-state', // Permet de contrôler la lecture sur les appareils de l'utilisateur
    'user-read-currently-playing', // Accès aux informations sur la piste actuellement en lecture
    'streaming', // Utilisation de l'API Web Playback SDK pour lire du contenu dans le navigateur
    'playlist-read-private', // Accès aux playlists privées de l'utilisateur
    'playlist-read-collaborative', // Accès aux playlists collaboratives de l'utilisateur
    'user-library-read' // Accès à la bibliothèque musicale de l'utilisateur
  ]

  const REDIRECT_URI = 'http://localhost:3000/ChoosePlaylist'
  const CLIENT_ID = process.env.CLIENT_ID
  
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${spotifyScopes.join('%20')}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  
  res.redirect(authUrl)
})

app.listen(4000, () => {
  console.log('Serveur démarré (port 4000)')
})

