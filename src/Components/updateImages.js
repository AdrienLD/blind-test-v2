import { playlist } from "./Playlist.js"
import fs from 'fs'
import https from 'https'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const basePath = '../../public/images/'

const requireplalist = async (titre, genre) => {
        try {
            const response = await fetch('http://localhost:4000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: titre,
                    type: 'playlist',
                    token: 'BQDse9lJ4JLHJAXh_2VqQMvyy1Xrb36c-5zpMaBJeWtjFQccSa8ois-13tf7tRTAPnlHA3-09GwwXGU8z0wroyze5sO63-48wF7aySDdvGDAVhKW4A6T6fn86EkdTURBW7_C2TAS6IzQ0_Dre35Xxy_7m0jQ60EAX8o4KINEW8ZVHNqyt-3RsqdppkYcZGVw_W68'
                })
            })
            const data = await response.json()

            const savePath = path.join(__dirname, `${basePath}${genre} - ${titre}.jpg`) 
            console.log(data)
            if (data.playlists && data.playlists.items) await downloadImage(data.playlists?.items[0]?.images[0].url, savePath)
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

function main(){
    // gettoken()
    for (const genre in playlist) {
        for (const titre of playlist[genre][1]) {
            requireplalist(titre, playlist[genre][0])
        }
    }
}

main()