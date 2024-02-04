import { getSpotifyAction, secretKey } from './Playlist' // Mettre à jour le chemin d'accès selon la structure de votre projet
import CryptoJS from 'crypto-js'

export const decryptPlaylist = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const play = () => getSpotifyAction('play', 'PUT')
export const pause = () => getSpotifyAction('pause', 'PUT')
export const nextMusic = (trackId) => getSpotifyAction(`queue?uri=spotify%3Atrack%3A${trackId}`, 'POST')
// Ajouter d'autres interactions avec l'API au besoin
