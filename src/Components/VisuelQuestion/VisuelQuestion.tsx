import React from 'react';
import { Musique } from '../../PlaylistSelection/PlaylistSelection';
import './VisuelQuestion.css';

function VisuelQuestion(musique: Musique) {
    console.log(musique)
    return (
        <div className='VisuelQuestion'>
            <p className='TitrePlaylist'>{musique.playlist}</p>
            <img src={musique.playlistimg} alt='pochette playlist' className='PochetteAlbum'/>
        </div>
    )
}

export default VisuelQuestion