import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // Utilisez CORS pour permettre à votre front-end de faire des requêtes vers ce serveur

app.use(express.json());
let accessToken = 'BQDs7yKVmOpF0ocnIdS8OLSGNBsOilzLOPLMIqZXTiR2pQlZXEGLvkFj2K_0ZYJsHcEh6ogCE69fTSD4-LxWDpJxoO4yKNuX7xZu-O8yLvXjYkWVcbp-407zeSyXWwjsF8gzU0UJxkN3W5DshgzkDuPTQM18kVz1KwEF4L0L8MGllstMbpQiIj-RwSzr1drI6iIxlg';

app.post('/api/token', async (req, res) => {
    const { code } = req.body;
    try {
        const response = await nodeFetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from('bbbe51c137b24687a4edb6c27fbb5dac:58db67382ecf4533a02aabbcd71ae60d').toString('base64')
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback`
        });
        const data = await response.json();
        res.json(data);
        accessToken = data.access_token;
    } catch (error) {
        console.error('Erreur lors de l\'échange du code:', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
});

app.post('/api/research', async (req, res) => {
    try {
        const response = await nodeFetch('https://api.spotify.com/v1/search?q=blindtest', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Erreur avec l\'API Spotify');
        }
        const data = await response.json();
        res.json(data);
        console.log(data);
    } catch (error) {
        console.error('Erreur lors de l\'échange du code:', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
});

app.listen(4000, () => {
    console.log('Serveur démarré (port 4000)');
});
