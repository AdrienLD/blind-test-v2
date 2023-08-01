declare namespace Spotify {
    interface Player {
        constructor(options: PlayerInit);
        // autres méthodes et propriétés...
    }
    interface PlayerInit {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        // autres propriétés...
    }
}

declare global {
    interface Window {
        Spotify?: typeof Spotify;
        onSpotifyWebPlaybackSDKReady?: () => void;
    }
}
