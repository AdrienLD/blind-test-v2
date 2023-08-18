import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import { URLSearchParams } from 'url';
import LyricsClient from "sync-lyrics";

const app = express();

app.use(cors()); // Utilisez CORS pour permettre à votre front-end de faire des requêtes vers ce serveur

app.use(express.json());

const CLIENT_ID = 'bbbe51c137b24687a4edb6c27fbb5dac'
const CLIENT_SECRET = '58db67382ecf4533a02aabbcd71ae60d'

app.post('/api/gettoken', async (req, res) => {
    const code = req.body.code
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3000/callback');

    const headers = {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: params,
            headers: headers
        });

        const data = await response.json();
        if (data.access_token) res.json({ access_token: data.access_token })

    } catch (error) {
        console.error('Error fetching access token:', error.message);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/api/testtoken', async (req, res) => {
    const token = req.headers.token
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response) {
            res.json({ response })
        }

    } catch (error) {
        console.error('Error fetching player state:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/research', async (req, res) => {
    const { titre, type, token } = req.body

    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/search?q=${titre}&type=${type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Impossible de rechercher la musique : ', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
})

app.post('/api/tracks', async (req, res) => {
    const { playlistId, token } = req.body
    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Impossible d extraire les musiques : ', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
})

app.post('/api/play', async (req, res) => {
    const { track } = req.body
    fetch('https://api.spotify.com/v1/me/player', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`
        },
        body: JSON.stringify({
            uris: [`spotify:track:${track.id}`]
        })
    });
})

app.get('/api/getplayerstate', async (req, res) => {
    const token = req.headers.token
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Spotify API responded with status: ${response.status}`);
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching player state:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/playpause', async (req, res) => {
    const token = req.headers.token
    const commande = req.headers.command
    const method = req.headers.method
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/${commande}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching player state:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/getlyricsId', async (req, res) => {
    const apikey = req.headers.apikey
    const titre = req.headers.titre
    const artiste = req.headers.artiste
    try {
        const response = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${titre}&q_artist=${artiste}&apikey=${apikey}`, {
            method: 'GET'
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching player state:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getlyrics', async (req, res) => {
    const apikey = req.headers.apikey
    const titre_id = req.headers.track_id
    const client = new LyricsClient("BQD8D0NrL3nIlTpungmePQW4fSCcelHcYWmEfaSVvYiTFxzMlf7sJRQC1PYCTjaIu0XAN3mTgIMGP9hqnuLFaH6o21Bgjnrj-7eSVJq1VPtAbrPFasGOXLQeGSuu8Eu7youD5Ap_eoAyZYpKR0T9QeRQCuS8AHRteNV8srXPXwTj7riCYcLntdF7tpyy9mhTol7m");
    console.log('client', client);
    const lyrics = await client.getLyrics(titre_id);
    console.log('lyricsAdrien', lyrics);

});


app.listen(4000, () => {
    console.log('Serveur démarré (port 4000)');
});
