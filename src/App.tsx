import React from 'react';
import authorize from '../src/components/Authorization';
import AccessToken from '../src/components/AccessToken';
// import Playlist from './components/Playlist';

const App: React.FC = () => {
  return (

    <div className="black">
      <button onClick={authorize}>Login with Spotify</button>
      <AccessToken children={undefined} />
      {/* <Playlist/> */}
    </div>



  );
};

export default App;
