import { nextedMusic } from './Playlist'
import { Musique } from '../PlaylistSelection/PlaylistSelection'


export const nextmusique = async (receivedData : Musique[], musiqueprecedente: number, modeDebut: string, tempsauDebut: number): Promise<number> => {
  try{
    const musiqueActuelle = musiqueprecedente+1
    if (musiqueActuelle >= receivedData.length) {
      console.error('Fin de la playlist.')
      return -2
    }
    const positionMs = modeDebut === 'Selectionner' ? tempsauDebut * 1000 : Math.floor(Math.random() * 60000)
    await nextedMusic(receivedData[musiqueActuelle].id, positionMs)
    localStorage.setItem('CurrentMusic', musiqueActuelle.toString())
    return musiqueActuelle
  } catch (e) {
    console.error('Erreur lors du changement de musique:', e)
    return -1
  }
}