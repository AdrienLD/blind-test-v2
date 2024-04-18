import React from 'react'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './PLParoles.sass'
import { decryptPlaylist } from '../BlindGame/SpotifyAPI'
import { getLyricsId, getSpotifyAction } from '../../Common/Playlist'
import { nextmusique } from '../../Common/GameAction'
import { cancelableSleep, sleep } from '../BlindGame/utils'
import AffichageQuestion from './AffichageQuestion'
import AffichageReponse from './AffichageReponse'
import { useNavigate } from 'react-router-dom'

function PLParoles() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ parolesActuelles, setParolesActuelles ] = React.useState<Array<{ startTimeMs: string, words: string }>>([])
  const [ affichage, setAffichage ] = React.useState('Chargement')
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])
  const [ position, setPosition ] = React.useState(0)
  const [ lyricsJSX, setLyricsJSX ] = React.useState<React.ReactElement | null>(null)
  const [ affichageprecedent, setAffichageprecedent ] = React.useState(4)
  const [ affichagesuivant, setAffichagesuivant ] = React.useState(4)
  const [ spotifyEteint, setSpotifyEteint ] = React.useState(false)

  const [ controller, setController ] = React.useState(new AbortController())

  const navigate = useNavigate()
    
  const getAction = async (action: string, method: string) => {
    const response = await getSpotifyAction(action, method)
    if (!response) return
    if (response.status === 404) {
      setSpotifyEteint(true)
    }
    return response
  }

  
  React.useEffect(() => {
    if (receivedData.length > 0) {
      setAffichage('Question-Loading')
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

  function transformString(input: string) {
    if (!input) return ''
    return input.split('').map(char => {
      if (char === ' ') {
        return ' '
      } else if (char.match(/[a-zA-Zéïèàùç0-9]/)) {
        return '_'
      } else {
        return char
      }
    }).join('')
  }

  React.useEffect(( ) => {
    const updateLyrics = async () => {
      controller.abort()
      const newController = new AbortController()
      setController(newController)
      const currLyric = parolesActuelles[position] ?? { startTimeMs: '0', words: '' }
      const nextLyric = parolesActuelles[position + 1] ?? { startTimeMs: '0', words: '' }
      setLyricsJSX(
        <div className='paroles'>
          <div className="secondaires">
            {parolesActuelles[position - 3]?.words ?? '   '}

          </div>
          <div className="secondaires">
            {parolesActuelles[position - 2]?.words ?? '   '}

          </div>
          <div className="secondaires">
            {parolesActuelles[position - 1] ? parolesActuelles[position - 1].words : '   '}

          </div>
          <div className="primaires">
            {affichagesuivant === -1 ? transformString(parolesActuelles[position]?.words) : parolesActuelles[position]?.words}
          </div>
          <div className="secondaires">
            {affichagesuivant >= 0 ? affichagesuivant === 0 ? transformString(parolesActuelles[position + 1]?.words) : parolesActuelles[position + 1]?.words : '   '}
          </div>
          <div className="secondaires">
            {affichagesuivant >= 1 ? affichagesuivant === 1 ? transformString(parolesActuelles[position + 2]?.words) : parolesActuelles[position + 2]?.words : '   '}
          </div>
          <div className="secondaires">
            {affichagesuivant >= 2 ? affichagesuivant === 2 ? transformString(parolesActuelles[position + 3]?.words) : parolesActuelles[position + 3]?.words : '   '}
          </div>
        </div>
      )
      if (affichagesuivant === 0 && affichage === 'Question-Playing') {
        const result = await cancelableSleep(parseInt(nextLyric.startTimeMs) - parseInt(currLyric.startTimeMs) - 100, newController.signal )
        if (result.ok){
          setAffichagesuivant(affichagesuivant - 1)
          setPosition(position + 1)
          getAction('pause', 'PUT')
        }
      } else if (affichagesuivant > 0) {
        const result = await cancelableSleep(parseInt(nextLyric.startTimeMs) - parseInt(currLyric.startTimeMs), newController.signal )
        if (result.ok){
          setAffichagesuivant(affichagesuivant - 1)
          setPosition(position + 1)
        }
      } else if (affichage !== 'Reponse')setAffichage('Question-Answered')
      else if (currLyric.words === '') {
        const result = await cancelableSleep(receivedData[musiqueActuelle].duration - parseInt(parolesActuelles[parolesActuelles.length - 1].startTimeMs), newController.signal)
        if (result.ok) setAffichage('Question-Loading')
      }
      
    }
    if (affichage === 'Question-Playing' || affichage=== 'Reponse') updateLyrics()
  }, [ affichagesuivant, affichage ])

  const getRandomStartTime = async (musique: number) => {
    let paroles = await getLyricsId(receivedData[musique].id)
    console.log('paroles', paroles, paroles === 'Lyrics non trouvés')
    while (paroles === 'Lyrics non trouvés') {
      sleep(1000)
      musique++
      paroles = await getLyricsId(receivedData[musique].id)
      console.log('paroles', paroles, paroles === 'Lyrics non trouvés', receivedData[musique].id)
    }
    if (paroles.length > 0) {
      let randomIndex = Math.floor(Math.random() * (paroles.length - 5))
      let randandaffichage = randomIndex + affichageprecedent
      console.log('paroles dans rand', paroles[randandaffichage + 1])
      while (paroles[randandaffichage + 1].words === '♪' || paroles[randandaffichage + 1].words === '' || paroles[randandaffichage + 1].words === paroles[randandaffichage].words) {
        randomIndex = Math.floor(Math.random() * (paroles.length - 5))
        randandaffichage = randomIndex + affichageprecedent
      }
      const timer = parseInt(paroles[randomIndex].startTimeMs)
      getAction('seek?position_ms=' + timer, 'PUT')
      setPosition(randomIndex)
      setParolesActuelles(paroles)
      setAffichageprecedent(4)
    } else { setAffichage('Question-Loading') }
  }

  React.useEffect(() => {
    const executeAsyncOperation = async () => {
      if (affichage === 'Question-Loading') {
        console.log('musiqueActuelle', musiqueActuelle, affichagesuivant) 
        setAffichagesuivant(-1)
        const musique = await nextmusique(receivedData, musiqueActuelle, 'Selectionner', 0)
        
        if (musique === -1) {
          setSpotifyEteint(true)
        } else {
          console.log('musique', affichagesuivant)
          setMusiqueActuelle(musique)
          await getRandomStartTime(musique)
          await setAffichagesuivant(4)
          setAffichage('Question-Playing')
        }
      
      } else if (affichage === 'Reponse') {
        setAffichagesuivant(parolesActuelles.length - position)
        getAction('seek?position_ms=' + parolesActuelles[position].startTimeMs, 'PUT')
        getAction('play', 'PUT')
      }
    }
    executeAsyncOperation()
  }, [ affichage ])

  


  return (
    <div>
      {spotifyEteint ? <h2>Spotify est éteint, veuillez le lancer pour jouer, puis recharger la page</h2>: <><h2>N'oubliez Pas Les Paroles - Musique : {musiqueActuelle}</h2>
        <div className="header">
          <button onClick={() => navigate('/ChoosePlaylist')}>Retour sélection</button>
        </div>
        <div className="content">
          { affichage.includes('Question') && <AffichageQuestion musique={receivedData[musiqueActuelle]} affichage={affichage} setAffichage={setAffichage} paroles={lyricsJSX} /> }
          { affichage.includes('Reponse') && <AffichageReponse musique={receivedData[musiqueActuelle]} setAffichage={setAffichage} paroles={lyricsJSX} /> }
        </div> </>
      }
    </div>
  )
}

export default PLParoles
