import { playlist, researchSpotify } from '../server/Playlist.js'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const basePath = '../../public/images/playlists/'

const requireplalist = async (titre, genre) => {
  const data = await researchSpotify([ genre, titre ], 'playlist')
  const savePath = path.join(__dirname, `${basePath}${genre} - ${titre}.jpg`)
  console.log('data', data)
  await downloadImage(data.images[0].url, savePath)
  return data
}

function downloadImage(url, filename) {
  const file = fs.createWriteStream(filename)
  const request = https.get(url, (response) => {
    response.pipe(file)
    
    file.on('finish', () => {
      file.close()
      console.log('Download completed.')
    })
  })
    
  request.on('error', (err) => {
    console.error('Error downloading the image:', err)
    file.close()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.unlink(filename, () => {}) // Supprimer le fichier en cas d'erreur
  })
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