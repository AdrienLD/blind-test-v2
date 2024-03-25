import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getSpotifyToken } from './Common/Playlist'

function Auth() {
  
  const isTokenFetched = React.useRef(false)

  const navigate = useNavigate()
  const [ error, setError ] = React.useState('')

  React.useEffect(() => {

    async function initialize() {
      isTokenFetched.current = true
      const values = await getSpotifyToken()
      console.log('values', values)
      if (values.token_type) navigate('/ChoosePlaylist')
      else (setError('Erreur de connexion' + values))
    }
    if (!isTokenFetched.current) initialize()
  }, [])
      

  return (
    <div className="App">
      <h2>
        Connection ...
      </h2>
      {
        error && <div>{error}</div>
      }
    </div>
  )
}

export default Auth
