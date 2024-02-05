import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Musique } from '../../PlaylistSelection/PlaylistSelection'
import './BlindGame.sass'
import { getSpotifyAction } from '../Playlist'
import { decryptPlaylist } from './SpotifyAPI'
import AffichageReponse from './AffichageReponse'
import AffichageQuestion from './AffichageQuestion'
import { sleep } from './utils'

function BlindGame() {
  const [ musiqueActuelle, setMusiqueActuelle ] = React.useState(0)
  const [ affichage, setAffichage ] = React.useState('Chargement')
  const navigate = useNavigate()
  const [ receivedData, setReceivedData ] = React.useState<Musique[]>([])

  React.useEffect(() => {
    const ciphertext = localStorage.getItem('playlistFinale')
    if (ciphertext) {
      setReceivedData(decryptPlaylist(ciphertext))
    } else {
      console.error('No playlist found in local storage')
      return
    }
    
  }, [])

  React.useEffect(() => {
    if (receivedData.length > 0) {
      setAffichage('Question-Loading')
    }
  } , [ receivedData ])

  const nextmusique = async () => {
    getSpotifyAction('pause', 'PUT')
    await getSpotifyAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
    sleep(200)
    let queue = (await getSpotifyAction('queue', 'GET')).queue
    let indexMusicinQueue = -1
    console.log('queue', queue, receivedData[musiqueActuelle+1])
    while (queue.length > 0 && indexMusicinQueue === -1) {
      for (let index = 0; index < queue.length; index++) {
        const element = queue[index]
        if (element.id === receivedData[musiqueActuelle+1].id) {
          indexMusicinQueue = index
          break
        }
      }
      console.log('indexMusicinQueue', indexMusicinQueue)
      if (indexMusicinQueue === -1) {
        for (let index = 0; index < queue.length; index++) {
          await getSpotifyAction('next', 'POST')
          await getSpotifyAction('pause', 'PUT')
        }
        await getSpotifyAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')
        sleep(200)
        queue = (await getSpotifyAction('queue', 'GET')).queue
      }
    }
    if (indexMusicinQueue === -1) {
      await getSpotifyAction(`queue?uri=spotify%3Atrack%3A${receivedData[musiqueActuelle+1].id}`, 'POST')

    }
    for (let index = 0; index < indexMusicinQueue; index++) {
      getSpotifyAction('next', 'POST')
      getSpotifyAction('pause', 'PUT')
    }
    await getSpotifyAction('pause', 'PUT')
    setMusiqueActuelle(musiqueActuelle + 1)
    await getSpotifyAction('next', 'POST')
    setAffichage('Question-Playing')
  }

  
  React.useEffect(() => {
    const playMusic = async () => {
      await getSpotifyAction('play', 'PUT')
      
      
    }
    const LoadMusic = async () => {
      nextmusique()
    }
    if (affichage === 'Question-Playing') {
      playMusic()
    }
    if (affichage === 'Question-Loading') {
      LoadMusic()
    }
  }, [ affichage ])
  

  
  

  return (
    <div>
      <h2>BlindGame Musique : {musiqueActuelle}</h2>
      <div className="content">
        { affichage.includes('Question') && <AffichageQuestion musique={receivedData[musiqueActuelle]} affichage={affichage} setAffichage={setAffichage} /> }
        { affichage.includes('Reponse') && <AffichageReponse musique={receivedData[musiqueActuelle]} setAffichage={setAffichage} /> }
        <button onClick={() => navigate('/ChoosePlaylist')}>Retour à la sélection : </button>

      </div>
      { affichage === 'Chargement' && <div>Chargement...</div> }
    </div>
  )
}



export default BlindGame