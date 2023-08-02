import React from "react";
import { SpotifyPlaybackPlayer } from "react-spotify-playback-player";
import {
    usePlayerDevice,
    usePlaybackState,
    useSpotifyPlayer,
  } from "react-spotify-web-playback-sdk";


export const Player = () => {
    // spotify sdk playback methods, you can get them any way you like
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();
    const playback = usePlaybackState();

    console.log(playback);
    console.log(player);
    console.log(device);
  
    return (
      <SpotifyPlaybackPlayer
        playback={playback || undefined}
        player={player || undefined}
        deviceIsReady={device?.status}
      />
    );
  };