import React from 'react';
import { Musique } from '../../PlaylistSelection/PlaylistSelection';
import './VisuelQuestion.css';
import Countdown from './Countdown/Countdown';

function VisuelQuestion(musique: Musique) {
    console.log(musique)
    return (
        <div className='VisuelQuestion'>

            <img src={musique.playlistimg} alt='pochette playlist' className='PochetteAlbum' />
            <div className="infos">
                <p className='TitrePlaylist'>Playlist : {musique.playlist}</p>
                <Countdown />
            </div>

        </div>
    )
}

export default VisuelQuestion