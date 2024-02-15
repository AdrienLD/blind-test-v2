import playlisttest from './playlistImages.js'
import { searchNewSpotifyPlaylist } from './AppelsSpotify.js'

import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const basePath = '../../public/images/playlists/'

const requireplaylist = async (titre, genre, id) => {
  const data = await searchNewSpotifyPlaylist(id)
  console.log(data.name)
  const savePath = path.join(__dirname, `${basePath}${genre} - ${titre}.jpg`)
  console.log(savePath)
  await downloadImage(data.images[0].url, savePath)
  return data
}

function downloadImage(url, filename) {
  const file = fs.createWriteStream(filename)
  const request = https.get(url, (response) => {
    response.pipe(file)
    console.log('Downloading image...', request)
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

export function main(){
  Object.entries(playlisttest).forEach(([ genre, titres ]) => {
    titres.forEach(titre => {
      requireplaylist(titre.name, genre, titre.id) // Assurez-vous que requireplaylist est défini correctement
    })
  })
}

main()