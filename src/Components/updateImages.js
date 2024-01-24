import { playlist } from "./Playlist.js"
import fs from 'fs'
import https from 'https'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const basePath = 'Images/playlist/'

const requireplalist = async (titre) => {
        try {
            const response = await fetch('http://localhost:4000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: titre,
                    type: 'playlist',
                    token: 'BQA0h_0i3mNVq1fnkpHx5vqWxDpZmI2rmgtGFcNr6MuHeKLzJ0_JnoT83l79EZhO9RcTKV_sEtUj3mPDKZn4iQ8j04aObAlygd-2-PuNAu2z4CnDWPQ2VEcL3GIOP00RcDfH8k72BFqNckUEc0hLSVs6WcmspFva2phiW6L5tKyewScaMtfPEZ1018qeMHP8lXl2'
                })
            })
            const data = await response.json()

            const savePath = path.join(__dirname, basePath + titre + '.jpg')
            console.log(data.playlists.items[0], savePath)
            //await downloadImage(data.playlists.items[0].images[0].url, savePath)
            return data;  // Retourner les données reçues
        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error);
            throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
        }
    }

    function downloadImage(url, filename) {
        const file = fs.createWriteStream(filename);
        const request = https.get(url, (response) => {
            response.pipe(file);
    
            file.on('finish', () => {
                file.close();
                console.log('Download completed.');
            });
        });
    
        request.on('error', (err) => {
            console.error('Error downloading the image:', err);
            file.close();
            fs.unlink(filename, () => {}); // Supprimer le fichier en cas d'erreur
        });
    }

    async function gettoken() {
        const code = localStorage.getItem('access_code');
        try {

            const response = await fetch('http://localhost:4000/api/gettoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code
                })
            })
            const data = await response.json()
            await console.log('responseAdrien', data)

        } catch (error) {
            console.error('Erreur lors de l\'échange du code:', error);
            throw error; // Propager l'erreur pour pouvoir la gérer dans listemusiques
        }
    }

function main(){
    // gettoken()
    for (const genre in playlist) {
        for (const titre of playlist[genre][1]) {
            requireplalist(titre)
        }
    }
}

main()