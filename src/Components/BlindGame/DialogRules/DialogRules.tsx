import React from 'react'
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import './DialogRules.sass'
import Slider from '@mui/material/Slider'

export interface DialogRulesProps {
  open: boolean
  onClose: () => void
  modifyRules: ({ mode, temps }: RulesParams) => void
  modeInitial: string
  tempsInitial: number
  modeDebutInitial: string
  tempsDebutInitial: number
}


export interface RulesParams {
  mode: string
  temps: number
  modeDebut: string
  tempsDebut: number
}

const DialogRules: React.FC<DialogRulesProps> = ({ open, onClose, modifyRules, modeInitial, tempsInitial, modeDebutInitial, tempsDebutInitial }) => {
  const [ modeSelectionne, setModeSelectionne ] = React.useState(modeInitial)
  const [ debutSelectionne, setDebutSelectionne ] = React.useState(modeDebutInitial)
  const [ tempsEcoute, setTempsEcoute ] = React.useState(tempsInitial)
  const [ tempsDebut, setTempsDebut ] = React.useState(tempsDebutInitial)

  function valueText(value: number) {
    setTempsEcoute(value)
    return `${value} secondes`
  }

  function valueTextDebut(value: number) {
    setTempsDebut(value)
    return `${value} secondes`
  }

  return (
    <Dialog open={open} onClose={onClose} className='Dialog'>
      <DialogContent className='DialogContent'>
        <div className="DialogTitle">
          Regles
          <DialogContentText>
            <div className="ModeJeu">
                Mode de jeu : 
              <select name="mode" id="mode" value={modeSelectionne} onChange={(event) => setModeSelectionne(event.target.value)}>
                <option value="Continu">Continu</option>
                <option value="Arrêt">Arrêt auto</option>
              </select>
              { modeSelectionne === 'Continu' && <div>
                    Après x secondes, la réponse est donnée, puis enchaîne automatiquement la musique suivante<br />
                    Mode de jeu idéal pour une soirée entre amis, nul besoin de rester devant le clavier
              </div> }
              { modeSelectionne === 'Arrêt' && <div>
                    Après x secondes, La musique s'arrête, vous avez possibilité de demander du temps en plus ou la réponse<br />
                    Mode de jeu idéal si il faut compter les points, avec un temps de réflexion<br />
                    Astuce : les touches espace et entrée permettent respectivement de mettre en pause/play la musique, et de passer à la réponse / musique suivante
              </div> }
            </div>
            <div className="tempsQuestion">
                Temps d'écoute (en secondes) : 
              <Slider
                aria-label="Temps d'écoute"
                defaultValue={tempsInitial}
                getAriaValueText={valueText}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={20}
                onChangeCommitted={(event, value) => setTempsEcoute(value as number)}
              />
            </div>
            Début de la musique :
            <select name="debut" id="mode" value={debutSelectionne} onChange={(event) => setDebutSelectionne(event.target.value)}>
              <option value="Selectionner">Sélectionner</option>
              <option value="Aléatoire">Aléatoire</option>
            </select>
            { debutSelectionne === 'Selectionner' && <div>
              <Slider
                aria-label="Temps d'écoute"
                defaultValue={tempsDebutInitial}
                getAriaValueText={valueTextDebut}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={60}
                onChangeCommitted={(event, value) => setTempsDebut(value as number)}
              />
            </div>}
          </DialogContentText>
          <button onClick={() => modifyRules({ mode: modeSelectionne, temps: tempsEcoute, modeDebut: debutSelectionne, tempsDebut: tempsDebut })}>Valider</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogRules
