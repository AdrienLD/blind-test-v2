import React from 'react'
import './ListPlaylistCard.sass'

export interface ListPlaylistCardProps {
  nom: string
  onHover: () => void
}

function ListPlaylistCard(props: ListPlaylistCardProps) {

  return (
    <div className="ListPlaylistCard" onClick={props.onHover} >
      {props.nom}
    </div>
  )
}

export default ListPlaylistCard