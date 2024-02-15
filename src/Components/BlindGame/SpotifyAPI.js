import { getSpotifyAction, secretKey } from '../AppelsSpotify.js'
import CryptoJS from 'crypto-js'

export const decryptPlaylist = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const play = async () => await getSpotifyAction('play', 'PUT')
export const pause = async () => await  getSpotifyAction('pause', 'PUT')
export const nextMusic = async (trackId) =>await  getSpotifyAction(`queue?uri=spotify%3Atrack%3A${trackId}`, 'POST')
// Ajouter d'autres interactions avec l'API au besoin
