import { getSyncLyrics, nextedMusic } from '../server/Playlist'
import { Musique } from '../PlaylistSelection/PlaylistSelection'
import { parseLyrics } from '../Components/PLParoles/PLParoles'

export interface Lyrics {
  startTimeMs: number
  words: string
}

export interface MusicWLyrics extends Musique {
  lyrics: Lyrics[]
  musicActualPosition: number
}
export const nextmusiqueBT = async (receivedData : Musique[], musiqueprecedente: number, modeDebut: string, tempsauDebut: number): Promise<number> => {
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

export const getNextMusiqueWLyrics = async (receivedData: Musique[], musiqueActuelle: number): Promise<MusicWLyrics> => {
  let i = musiqueActuelle
  let lyrics  = undefined
  while (!lyrics){
    i++
    if (i >= receivedData.length) {
      console.error('Fin de la playlist.')
      return receivedData[musiqueActuelle] as MusicWLyrics
    }
    lyrics = await getSyncLyrics(receivedData[i].artiste, receivedData[i].titre)
  }
  return {
    ...receivedData[i],
    lyrics: parseLyrics(lyrics),
    musicActualPosition: i
  }
}

export const nextmusiqueNPLP = async (musique : MusicWLyrics, tempsauDebut: number): Promise<number> => {
  try{
    await nextedMusic(musique.id, tempsauDebut)
    return 0
  } catch (e) {
    console.error('Erreur lors du changement de musique:', e)
    return -1
  }
}
