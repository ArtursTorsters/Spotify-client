// App.tsx
import React from 'react';
import authorize from '../src/components/Authorization';
import AccessToken from '../src/components/AccessToken';
import Player from '../src/components/Player';

const App: React.FC = () => {
    const token = 'BQAdhaZ_U-AUskste6UfPRGNDxlU0GwX6ezskee4Rzch7ZDxspNQMP5wE2GU8pP4cdEGknj55u6HRQ2frWG05e7CQhn29o7NH8o6nhxiWWPprKXgTof6OsDlMTW5XjMXZtQ5naNyQCG_EY14zeHQ8bjhyUsg1lzQ0JKPsD2hlr0-DuPvMyxQbXrto90G9T74Ptc9wcMa2dA6l52sThYRu5dztsJ9';

    return (
        <div className="black min-h-screen">
            <div className='flex'>
                <button className='spot-btn' onClick={authorize}>Login with Spotify</button>
            </div>
            <AccessToken children={undefined} />
            <Player token={token} />
        </div>
    );
};

export default App;
