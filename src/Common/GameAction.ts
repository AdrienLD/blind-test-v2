import { sleep } from '../Components/BlindGame/utils'
import { getSpotifyAction } from './Playlist'
import { Musique } from '../PlaylistSelection/PlaylistSelection'



const getAction = async (action: string, method: string) => {
  const response = await getSpotifyAction(action, method)
  if (!response) return
  if (response.status === 404) {
    throw new Error('Spotify is not available')
  }
  return response
}

export const nextmusique = async (receivedData : Musique[], musiqueprecedente: number, modeDebut: string, tempsauDebut: number): Promise<number> => {
  try{
    const musiqueActuelle = musiqueprecedente+1
    if (musiqueActuelle >= receivedData.length) {
      console.error('Fin de la playlist.')
      return -2
    }
    if (!receivedData[musiqueActuelle]) {
      console.error('Aucune musique suivante trouvée.')
      return -2
    }

    await getAction('pause', 'PUT')
    await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
    await sleep(400)

    const volume = (await getAction('', 'GET')).device.volume_percent
    console.log('volume', volume)
    await getAction('volume?volume_percent=0', 'PUT')
    let queue = (await getAction('queue', 'GET')).queue
    let indexMusicinQueue = queue.findIndex((element: { id: string }) => element.id === receivedData[musiqueActuelle].id)
    
    if (indexMusicinQueue === -1 && queue.length === 20) {
      for (let i = 0; i < queue.length; i++) {
        await getAction('next', 'POST')
      }
      sleep(400)
      queue = (await getAction('queue', 'GET')).queue
      indexMusicinQueue = queue.findIndex((element: { id: string }) => element.id === receivedData[musiqueActuelle].id) - 1
      console.log('indexMusicinQueue', indexMusicinQueue, queue)
    } 
    if (indexMusicinQueue === -1) {
      await getAction('pause', 'PUT')
      await getAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle].id}`, 'POST')
      await sleep(800)
      queue = (await getAction('queue', 'GET')).queue
      indexMusicinQueue = queue.findIndex((element: { id: string }) => element.id === receivedData[musiqueActuelle].id)
    }

    if (indexMusicinQueue === -1) {
      console.error('La musique n\'a pas pu être ajoutée à la file d\'attente.')
      return -4
    }

    for (let i = 0; i <= indexMusicinQueue; i++) {
      await getAction('next', 'POST')
    }
 
    await sleep(200) // Donner un peu de temps pour que 'next' soit traité
    const positionMs = modeDebut === 'Selectionner' ? tempsauDebut * 1000 : Math.floor(Math.random() * 60000)
    await getSpotifyAction(`seek?position_ms=${positionMs}`, 'PUT')
 
    // Restaurer le volume et jouer la musique
    await getAction(`volume?volume_percent=${volume}`, 'PUT')
    await getAction('play', 'PUT')
 
    // Mettre à jour le stockage local pour refléter la musique actuelle
    localStorage.setItem('CurrentMusic', musiqueActuelle.toString())
    return musiqueActuelle
  } catch (e) {
    console.error('Erreur lors du changement de musique:', e)
    return -1
  }
}