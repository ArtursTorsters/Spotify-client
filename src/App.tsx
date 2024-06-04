import React from 'react';
import authorize from '../src/components/Authorization';
import AccessToken from '../src/components/AccessToken';

const App: React.FC = () => {
  return (
    <div>
      <button onClick={authorize}>Login with Spotify</button>
      <AccessToken children={undefined} />
    </div>
  );
};

export default App;
