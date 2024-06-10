

import React, { useState } from 'react';
import authorize from './components/Authorization';
import AccessToken from './components/AccessToken';
import Player from './components/Player';

const App: React.FC = () => {
    const playlistUri = '05fG473iIaoy82BF1aGhL8'; // playlist uri  Slipknot
    const token = 'BQBemeVKu_brAdUDlCVzvYXnPAhOLHpSkKqKkACDTHEX7sxkjrPTO3ZrqO0M3WMc2Ya3b0B9j8IR7EHi6MXo3kFdLxG9QucH4Y1so-HSV4MVJ_Y4JshSWxIVpatZ9w__waPqNMzpi_bNuMzHOPw6IVswAX1aHouR0XnVPthDk5erkbp1QJrDHX-PI6zokDa2Qu7zGHzYS4mwv3JG76wzurpVNVi_';

    const handleLogin = () => {
        authorize();
    };

    return (
        <div className="black min-h-screen">
            <div className='flex'>
                <button className='spot-btn' onClick={handleLogin}>Login with Spotify</button>
            </div>
            <AccessToken  />
            <Player  token={token} playlistUri={playlistUri} />
        </div>
    );
};

export default App;
