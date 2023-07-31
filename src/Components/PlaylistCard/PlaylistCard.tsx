import React from 'react';
import './PlaylistCard.css';

export interface PlaylistCardProps {
  nom: string;
  choisie: boolean;
}

function PlaylistCard(props: PlaylistCardProps) {
  return (
    <div className="PlaylistCard">
      <div className="titre">
        {props.nom}
      </div>
      PNGICI
    </div>
  );
}

export default PlaylistCard;