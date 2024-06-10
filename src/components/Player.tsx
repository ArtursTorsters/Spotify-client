import React, { useState, useEffect } from 'react';

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

interface PlayerProps {
    token: string;
}

const Player: React.FC<PlayerProps> = ({ token }) => {
    const [player, setPlayer] = useState<any>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb: (token: string) => void) => { cb(token); },
                volume: 0.5
            });

            setPlayer(playerInstance);

            // Listener for player readiness
            playerInstance.addListener('ready', ({ device_id }: { device_id: string }) => {
                console.log('Ready with Device ID', device_id);
                setIsPlayerReady(true);
                playerInstance.connect().then((success: boolean) => {
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                    } else {
                        console.warn('Failed to connect to Spotify.');
                    }
                });
            });

            // Listener for player state changes
            playerInstance.addListener('player_state_changed', (state: any) => {
                console.log('Player State Changed:', state);
                setIsPlaying(state.paused === false);
            });

            playerInstance.connect();
        };

        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, [token]);

    // Function to toggle play/pause
    const handleTogglePlay = () => {
        if (player && isPlayerReady) {
            if (isPlaying) {
                player.pause().then(() => setIsPlaying(false)).catch((error: any) => {
                    console.error('Error pausing playback:', error);
                });
            } else {
                player.resume().then(() => setIsPlaying(true)).catch((error: any) => {
                    console.error('Error resuming playback:', error);
                });
            }
        } else {
            console.warn('Player is not ready or not initialized.');
        }
    };

    return (
        <button id="togglePlay" className='spot-btn' onClick={handleTogglePlay} disabled={!isPlayerReady}>
            {isPlaying ? 'Pause' : 'Play'}
        </button>
    );
};

export default Player;
