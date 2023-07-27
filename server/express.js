import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors()); // Utilisez CORS pour permettre à votre front-end de faire des requêtes vers ce serveur

app.use(express.json());
let accessToken = 'BQDVQJaEw2hHpyUPcr8wPwNbZhKvTz0rmLHd35LtwNteL8_cyQ4dxjT1ULJtgN4ZwWOkpr2n7BUVMW-KCbr66uGdVNVkm4idZM6oHmUt6dg2zMYl-7z3usDVN5YMoMPVJhBf7IRyVsMJENC5a0aPj7v9MB3VUKJSJBxcgHvu8DUBSiWcAFevvCcP_dpVcVOY7UuLEA';

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
    const {titre} = req.body
    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/search?q=${titre}o&type=track`, {
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
    } catch (error) {
        console.error('Erreur lors de l\'échange du code:', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
});

app.listen(4000, () => {
    console.log('Serveur démarré (port 4000)');
});
