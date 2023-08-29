import React from 'react';
import './PlaylistCard.css';
import Carre from '../Images/carre.jpg';
import transparent from '../Images/trans.png'
import DoneIcon from '@mui/icons-material/Done';

export interface PlaylistCardProps {
  nom: string;
  choisie: boolean;
  onClick: () => void;
}

function PlaylistCard(props: PlaylistCardProps) {
  console.log(props.choisie)
  return (
    <div className="PlaylistCard" onClick={props.onClick} style={props.choisie ? {transform: 'scale(0.7)'} : {}}>
      <div className="titre">
        {props.nom}
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img src={transparent} className='logoplaylist' alt='logoimage'/>
        {
          props.choisie && <DoneIcon className='done' />
        }
        
      </div>
    </div>
  )
}

export default PlaylistCard;