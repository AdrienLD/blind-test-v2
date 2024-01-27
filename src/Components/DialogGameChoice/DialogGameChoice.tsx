import React from 'react'
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import './DialogGameChoice.sass'

interface DialogGameChoiceProps {
    open: boolean;
    onClose: () => void;
    extractmusique: (mode: string) => void;
}

const DialogGameChoice: React.FC<DialogGameChoiceProps> = ({ open, onClose, extractmusique }) => {

    return (
        <Dialog open={open} onClose={onClose} className='Dialog'>
        <DialogContent className='DialogContent'>
          <div className="DialogTitle">
          Sélectionnez votre mode de jeu

          </div>

          <div className="SplitDialogue">
            <div className="DialogueChoixGauche">
              <button onClick={() => extractmusique('blind')}>BlindTest</button>
              <DialogContentText>
                Chaque tour, une nouvelle musique parmi la playlist séléctionnée se lance sur votre compte Spotify<br/>
                Au bout de 10 secondes la musique se mets sur pause, et les regles ne sont pas encore finies<br/>
              </DialogContentText>
            </div>

            <div className="DialogueChoixGauche">

              <button onClick={() => extractmusique('nplp')}>N'oubliez PLP</button>
              <DialogContentText>
                <ol>
                  <li>
                    <strong>Sélection de la Musique :</strong> À chaque tour, une nouvelle chanson est choisie. Si la chanson sélectionnée ne contient pas de paroles sur Spotify, elle est automatiquement passée et une autre est choisie.
                  </li>
                  <li>
                    <strong>Début de la Chanson :</strong> La lecture de la chanson ne commence pas nécessairement au début. Au lieu de cela, elle démarre aléatoirement au début d'une ligne de parole.
                  </li>
                  <li>
                    <strong>Affichage des Paroles :</strong> Trois lignes de paroles seront affichées à l'écran pour vous aider.
                  </li>
                  <li>
                    <strong>Pause et Devinettes :</strong> Après l'affichage des trois lignes, la musique sera mise en pause. C'est à ce moment que vous devez deviner et fournir la suite des paroles de la chanson.
                  </li>
                </ol>
              </DialogContentText>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
}

export default DialogGameChoice