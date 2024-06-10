import React, { useState, useEffect } from 'react';


// taken from https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

interface PlayerProps {
    token: string; // Access token for authorization
    playlistUri: string; // URI of the playlist to play
}

const Player: React.FC<PlayerProps> = ({ token, playlistUri }) => {
    // State variables
    const [player, setPlayer] = useState<any>(null); // Spotify player instance
    const [isPlayerReady, setIsPlayerReady] = useState(false); // Flag indicating if the player is ready
    const [isPlaying, setIsPlaying] = useState(false); // Flag indicating if playback is currently active
    const [deviceId, setDeviceId] = useState<string | null>(null); // ID of the device for playback

    // Effect to load Spotify Web Playback SDK and initialize the player
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb: (token: string) => void) => { cb(token); }, // Provide access token to the player
                volume: 0.5
            });

            setPlayer(playerInstance);

            // Add event listeners for various player events
            playerInstance.addListener('ready', ({ device_id }: { device_id: string }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id); // Set the device ID for playback
                setIsPlayerReady(true); // Player is ready
                playerInstance.connect().then((success: boolean) => {
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                    } else {
                        console.warn('Failed to connect to Spotify.');
                    }
                });
            });


            playerInstance.connect(); // Connect the player to Spotify
        };

        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, [token]);

    // Function to start playback
    const startPlayback = async () => {
        if (deviceId) {
            try {
                const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Authorization header with access token
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        context_uri: `spotify:artist:${playlistUri}` // playlist to play

                        //  spotify:user:1185903410:playlist:6YAnJeVC7tgOiocOG23Dd

                        // spotify:album:27ftYHLeunzcSzb33Wk1hf
                        // spotify:artist:3mvkWMe6swnknwscwvGCHO
                        // spotify:track:7lEptt4wbM0yJTvSG5EBof

                    }),
                });

                if (response.ok) {
                    console.log('Playback started');
                } else {
                    console.error('Failed to start playback', response.statusText);
                }
            } catch (error) {
                console.error('Error starting playback', error);
            }
        } else {
            console.warn('Device ID is not available');
        }
    };

    // Function to toggle play/pause
    const handleTogglePlay = () => {
        if (player && isPlayerReady) {
            if (isPlaying) {
                // Pause playback
                player.pause().then(() => setIsPlaying(false)).catch((error: any) => {
                    console.error('Error pausing playback:', error);
                });
            } else {
                // Start playback
                startPlayback();
                player.resume().then(() => setIsPlaying(true)).catch((error: any) => {
                    console.error('Error resuming playback:', error);
                });
            }
        } else {
            console.warn('Player is not ready or not initialized.');
        }
    };

    // btn
    return (
        <button id="togglePlay" className="spot-btn" onClick={handleTogglePlay} disabled={!isPlayerReady}>
            {isPlaying ? 'Pause' : 'Play'}
        </button>
    );
};

export default Player;
