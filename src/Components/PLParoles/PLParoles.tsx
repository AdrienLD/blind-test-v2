import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './PLParoles.sass'
import { decryptPlaylist } from '../BlindGame/SpotifyAPI'
import { getSpotifyAction } from '../../Common/Playlist'
import { getNextMusiqueWLyrics, Lyrics, MusicWLyrics, nextmusiqueNPLP } from '../../Common/GameAction'
import { cancelableSleep } from '../BlindGame/utils'
import AffichageQuestion from './AffichageQuestion'
import AffichageReponse from './AffichageReponse'
import { useNavigate } from 'react-router-dom'

export type AffichageState =
  | 'Question-Loading'
  | 'Question-Playing'
  | 'Question-Answered'
  | 'Question-Reponse'
  | 'Question-Chargement'

export const QUESTION_LOADING: AffichageState   = 'Question-Loading'
export const QUESTION_PLAYING: AffichageState   = 'Question-Playing'
export const QUESTION_ANSWERED: AffichageState  = 'Question-Answered'
export const QUESTION_REPONSE: AffichageState   = 'Question-Reponse'
export const QUESTION_CHARGEMENT: AffichageState   = 'Question-Chargement'

export type SetAffichage = React.Dispatch<React.SetStateAction<AffichageState>>

export function parseLyrics(lrc: string): Lyrics[] {
  const lines = lrc.split('\n')
  const result: Lyrics[] = []

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\]\s*(.*)$/)
    if (match) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const centiseconds = parseInt(match[3], 10)
      const text = match[4].trim()

      const totalMilliseconds = (minutes * 60 + seconds) * 1000 + centiseconds * 10

      result.push({
        startTimeMs: totalMilliseconds,
        words: text
      })
    }
  }

  return result
}

const transformString = (input: string | undefined | null) =>
  (input ?? '').split('').map(char =>
    char === ' ' ? ' ' : /[^\s\WêôÔçàéè]/.test(char) ? '_' : char
  ).join('')


function PLParoles() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ parolesActuelles, setParolesActuelles ] = React.useState<Lyrics[]>([])
  const [ affichage, setAffichage ] = React.useState<AffichageState>(QUESTION_CHARGEMENT)
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])
  const [ position, setPosition ] = React.useState(0)
  const [ lyricsJSX, setLyricsJSX ] = React.useState<React.ReactElement | null>(null)
  const [ affichagesuivant, setAffichagesuivant ] = React.useState(4)
  const [ spotifyEteint, setSpotifyEteint ] = React.useState(false)
  const nextMusiquePromiseRef = React.useRef<Promise<MusicWLyrics> | null>(null)
  const nextMusiqueRef = React.useRef<MusicWLyrics | null>(null)

  const controllerRef = React.useRef(new AbortController())

  const navigate = useNavigate()
    
  const getAction = React.useCallback(async (action: string, method: string) => {
    const response = await getSpotifyAction(action, method)
    if (!response) return
    if (response.status === 404) {
      setSpotifyEteint(true)
    }
    return response
  }, [])

  
  React.useEffect(() => {
    if (receivedData.length > 0) {
      setAffichage(QUESTION_LOADING)
    }
  } , [ receivedData ])

    
  React.useEffect(() => {
    const ciphertext = localStorage.getItem('playlistFinale')
    if (ciphertext) {
      setReceivedData(decryptPlaylist(ciphertext))
    } else {
      console.error('No playlist found in local storage')
      return
    }
    const currentMusic = localStorage.getItem('CurrentMusic')
    if (currentMusic) {
      if (currentMusic === '0') setMusiqueActuelle(0)
      else setMusiqueActuelle(parseInt(currentMusic)-1)
    } else {
      setMusiqueActuelle(0)
    }
  }, [])

  const renderLine = (relativeIndex: number): React.ReactElement => {
    const index = position + relativeIndex
    const lyric = parolesActuelles[index]
    const words = lyric?.words ?? '   '

    const isPrimary = relativeIndex === 0
    const shouldTransform = (
      (isPrimary && affichagesuivant === -1)
    || (!isPrimary && affichagesuivant === relativeIndex - 1)
    )

    let displayText = shouldTransform ? transformString(words) : words

    if (affichagesuivant+1 < relativeIndex) {
      displayText = ''
    }

    return (
      <div className={isPrimary ? 'primaires' : 'secondaires'} key={relativeIndex}>
        {displayText}
      </div>
    )
  }

  React.useEffect(( ) => {
    const updateLyrics = async () => {
      
      controllerRef.current.abort()
      controllerRef.current = new AbortController()
      const signal = controllerRef.current.signal

      const currLyric = parolesActuelles[position] ?? { startTimeMs: 0, words: '' }
      const nextLyric = parolesActuelles[position + 1] ?? currLyric

      if (signal.aborted) return
      setLyricsJSX(
        <div className='paroles'>
          {[ -3, -2, -1, 0, 1, 2, 3 ].map(i => renderLine(i))}
        </div>
      )

      const delay = nextLyric.startTimeMs - currLyric.startTimeMs - (affichagesuivant === 0 ? 200 : 0)
      if (affichage === QUESTION_PLAYING || affichage === QUESTION_REPONSE){
        await cancelableSleep(delay, signal)
        if (signal.aborted) return

        setAffichagesuivant(n => n - 1)
        setPosition(p => p + 1)
      } 
    }
    if (affichage === QUESTION_PLAYING || affichage === QUESTION_REPONSE) updateLyrics()
      
    return () => controllerRef.current.abort()
  }, [ affichagesuivant, affichage ])

  React.useEffect(() => {
    if (affichage !== QUESTION_PLAYING || affichagesuivant !== -1) {
      return
    }
    let cancelled = false
  ;(async () => {
      await getAction('pause', 'PUT')
      if (cancelled) return

      setAffichagesuivant(-1)

      setAffichage(QUESTION_ANSWERED)
    })()

    return () => {
      cancelled = true
    }
  }, [ affichagesuivant, affichage, getAction ])

  const getRandomStartTime = (musique: MusicWLyrics ) => {
    const maxStart = Math.max(0, musique.lyrics.length - 6)
    return Math.floor(Math.random() * (maxStart + 1))
  }


  React.useEffect(() => {
    const executeAsyncOperation = async () => {
      if (affichage === QUESTION_LOADING) {
        setAffichagesuivant(-1)

        if (nextMusiqueRef.current === null) {
          nextMusiquePromiseRef.current = getNextMusiqueWLyrics(receivedData, musiqueActuelle)
        }
        const nextMusique = await nextMusiquePromiseRef.current!
        nextMusiqueRef.current = nextMusique
        nextMusiquePromiseRef.current = null
        const startLine = getRandomStartTime(nextMusique)
        const musique = await nextmusiqueNPLP(nextMusique, nextMusique.lyrics[startLine].startTimeMs)
        if (musique === -1) {
          setSpotifyEteint(true)
        } else {
          localStorage.setItem('CurrentMusic', nextMusique.musicActualPosition.toString())
          setParolesActuelles(nextMusique.lyrics)
          setPosition(startLine)
          setMusiqueActuelle(nextMusique.musicActualPosition)
          setAffichagesuivant(4)
          setAffichage(QUESTION_PLAYING)
        }
      
      } else if (affichage === QUESTION_REPONSE) {
        setAffichagesuivant(parolesActuelles.length - position)
        getAction('seek?position_ms=' + parolesActuelles[position].startTimeMs, 'PUT')
        getAction('play', 'PUT')
      } else if (affichage === QUESTION_PLAYING) {
        searchNextMusic()
      }

    }
    executeAsyncOperation()
  }, [ affichage ])

  function searchNextMusic() {
    if (!nextMusiquePromiseRef.current) {
      nextMusiquePromiseRef.current = getNextMusiqueWLyrics(receivedData, musiqueActuelle)
    }
  }
  




  return (
    <div>
      {spotifyEteint ? <h2>Spotify est éteint, veuillez le lancer pour jouer, puis recharger la page</h2>: <><h2>N'oubliez Pas Les Paroles - Musique : {musiqueActuelle}</h2>
        <div className="header">
          <button onClick={() => navigate('/ChoosePlaylist')}>Retour sélection</button>
        </div>
        <div className="content">
          { (affichage !== QUESTION_REPONSE && affichage !== QUESTION_CHARGEMENT) && <AffichageQuestion musique={receivedData[musiqueActuelle]} affichage={affichage} setAffichage={setAffichage} paroles={lyricsJSX} /> }
          { affichage === QUESTION_REPONSE && <AffichageReponse musique={receivedData[musiqueActuelle]} setAffichage={setAffichage} paroles={lyricsJSX} /> }
        </div> </>
      }
    </div>
  )
}

export default PLParoles
