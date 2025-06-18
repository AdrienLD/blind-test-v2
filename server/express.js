import nodeFetch from 'node-fetch'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { URLSearchParams } from 'url'

const app = express()

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true
}
dotenv.config()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

app.post('/api/gettoken', async (req, res) => {
  const action = req.body.action
  const code = action === 'gettoken' ? req.body.code : req.cookies.refresh_token
  const params = new URLSearchParams()
  params.append('grant_type', action === 'gettoken' ? 'authorization_code' : 'refresh_token')
  action === 'gettoken' ? params.append('redirect_uri', 'https://songs.flgr.fr/Auth') : null
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
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const token = req.cookies.token ?? 'insert token for update-images'
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
    const response = await fetch('https://api.spotify.com/v1/me', {
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
    const response = await fetch(`https://api.spotify.com/v1/me/player/${commande}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok && response.status !== 204) {
      const data = await response.json()
      res.json(data)
    } else {
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
    const token = await fetch('https://open.spotify.com/get_access_token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'cookie': 'sp_dc=AQBnWO3KXmJuHqh9-S5i73RAdi7vugSLVTgQ9NCcGJ5fjn-nhScvEMw5I3rCZw6iPh0heIqU0XklPsJaeyfww4gsqcjo5-RcK2h1K4MIEaskRGwk0hiYXz1-kjQBMeM55x2-LqVLJlkA7L4_AR51oO_Z3RPPZg-v'
      }
    })
    const data2 = await token.json()
    const response = await fetch(`https://api.lyricstify.vercel.app/v1/lyrics/${titreId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data2.accessToken}`,
        'App-Platform': 'WebPlayer',
        'Accept': 'application/json'
      }
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
    const token = req.cookies.token
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching player state:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(4000, () => {
  console.log('Serveur démarré (port 4000)')
})

