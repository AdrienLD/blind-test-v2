import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import './DialogNoFoundedMusic.sass'

export interface resultsTestBDD {
  totalTested: number
  totalFound: number
  musicsNotFound: any
  timeDuration: number
}

interface DialogNoFoundedMusicProps {
  open: boolean
  onClose: () => void
  results?: resultsTestBDD
}

const DialogNoFoundedMusic: React.FC<DialogNoFoundedMusicProps> = ({ open, onClose, results }) => {
  const navigate = useNavigate()

  if (!results) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <p>Aucun résultat à afficher.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const timePerMusic
    = results.totalTested > 0? (results.timeDuration / results.totalTested).toFixed(2): '-'

  const percentFound = results.totalTested > 0? ((results.totalFound * 100) / results.totalTested).toFixed(2): '-'

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: 'Dialog2' }}>
      <DialogContent>
        <h1>Résultats du test de la BDD</h1>
        <p>
          Vous avez testé <strong>{results.totalTested}</strong> musique(s) dans la BDD.
          <br />
          <strong>{results.totalFound}</strong> ont été trouvées, <strong>{results.totalTested - results.totalFound}</strong> non trouvées,
          soit <strong>{percentFound}%</strong> de réussite.
          <br />
          Temps total : <strong>{results.timeDuration.toFixed(2)}</strong> secondes,
          soit <strong>{timePerMusic}</strong> s/musique.
        </p>
        <h3>Musiques non trouvées :</h3>

        {results.musicsNotFound?.length > 0 && (
          <div className="SplitDialogue">
            <div className="DialogueChoixGauche">
              <ul className="ScrollableList">
                {results.musicsNotFound.map((music: any, idx: number) => (
                  <li key={idx}>
                    {music.title} – {music.artist}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose()
            navigate('/ChoosePlaylist')
          }}
          color="primary"
          autoFocus
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogNoFoundedMusic
