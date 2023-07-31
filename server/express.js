import nodeFetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import fs from 'fs';


const app = express();

app.use(cors()); // Utilisez CORS pour permettre à votre front-end de faire des requêtes vers ce serveur

app.use(express.json());

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
        if (process.env.TOKEN === undefined) {
            fs.writeFileSync('.env', `TOKEN=${data.access_token}\n`);
        }
        console.log('TOKEN : ', data.access_token, process.env.TOKEN);

    } catch (error) {
        console.error('Impossible de récupérer le Token Spotify : ', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
});

app.post('/api/research', async (req, res) => {
    const { titre } = req.body
    console.log('ACCESS TOKEN : ', process.env.TOKEN);
    try {
        const response = await nodeFetch(`https://api.spotify.com/v1/search?q=${titre}&type=track`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        })
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Impossible de rechercher la musique : ', error);
        res.status(500).json({ error: 'Erreur lors de l\'échange du code.' });
    }
});

app.listen(4000, () => {
    console.log('Serveur démarré (port 4000)');
});
