import React from 'react';
import './PlaylistCard.css';
import Carre from '../Images/carre.jpg';
import transparent from '../Images/trans.png'

export interface PlaylistCardProps {
  nom: string;
  choisie: boolean;
  onClick: () => void;
}

function PlaylistCard(props: PlaylistCardProps) {

  return (
    <div className="PlaylistCard" onClick={props.onClick} style={props.choisie ? {transform: 'scale(0.7)', filter: 'grayscale(60%)'} : {}}>
      <div className="titre">
        {props.nom}
      </div>
          <img src={transparent} className='logoplaylist' alt='logoimage'/>
    </div>
  );
}

export default PlaylistCard;