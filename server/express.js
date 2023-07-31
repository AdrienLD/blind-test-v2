import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import { URLSearchParams } from 'url';

const CLIENT_ID = 'bbbe51c137b24687a4edb6c27fbb5dac'; // Remplacez par votre client ID
const CLIENT_SECRET = '58db67382ecf4533a02aabbcd71ae60d';

const app = express();

app.use(cors()); // Utilisez CORS pour permettre à votre front-end de faire des requêtes vers ce serveur

app.use(express.json());

async function getAccessToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials')
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

        if (data.error) {
            throw new Error(`Error from Spotify: ${data.error_description}`);
        }
        if (process.env.TOKEN === undefined) {
            process.env.TOKEN = data.access_token;
        }
    } catch (error) {
        console.error('Error fetching access token:', error.message)
        return null
    }
}

async function testAccessToken() {
    const token = process.env.TOKEN;

    try {
        // Utiliser un endpoint qui ne nécessite pas d'authentification utilisateur
        const response = await nodeFetch(`https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Si le token est expiré ou non valide, renouveler le token
        if (response.status === 401) {
            await getAccessToken();
        } else if (!response.ok) {
            console.error('Erreur lors de la vérification du token. Status:', response.status);
        }

    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error.message);
    }
}


app.post('/api/research', async (req, res) => {
    const { titre, type } = req.body
    console.log("ici")
    
    if (process.env.TOKEN === undefined) await getAccessToken()
    await testAccessToken()
    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/search?q=${titre}&type=${type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`
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
    console.log("ici2")
    const { playlistId } = req.body
    if (process.env.TOKEN === undefined) await getAccessToken()
    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`
            }
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Impossible d extraire les musiques : ', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
})

app.listen(4000, () => {
    console.log('Serveur démarré (port 4000)');
});
