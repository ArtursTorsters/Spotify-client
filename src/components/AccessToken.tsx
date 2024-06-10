import React, { useState, useEffect } from 'react';
import { clientId, redirectUri } from './Authorization';

// Function to get the access token using the authorization code
const getToken = async (code: string): Promise<string | null> => {
  const codeVerifier = localStorage.getItem('code_verifier'); // Retrieve the code verifier from local storage
  if (!codeVerifier) {
    console.error('Code verifier not found in localStorage');
    return null;
  }

  // Prepare the payload for the token request
  const payload = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    // Make a POST request to get the access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    // Parse the response data
    const data = await response.json();

    if (data.access_token) {
      // Store the access token in local storage
      localStorage.setItem('access_token', data.access_token);
      return data.access_token;
    } else {
      console.error('Failed to obtain access token', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching access token', error);
    return null;
  }
};

// Interface for AccessToken component props
interface AccessTokenProps {
  children?: React.ReactNode;
}

const AccessToken: React.FC<AccessTokenProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>({});
  const [playlistData, setPlaylistData] = useState<any>({});

  // Effect to get the authorization code from URL and fetch the access token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    if (authorizationCode) {
      getToken(authorizationCode).then((token) => {
        setAccessToken(token);
        console.log('Access Token:', token);
      });
    } else {
      // If there's no authorization code, try to get the token from local storage
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setAccessToken(storedToken);
      } else {
        console.error('Authorization code not found in URL');
      }
    }
  }, []);

  // PLAYLIST DATA TO DSIPLAY
  useEffect(() => {
    if (accessToken) {
      const fetchPlaylist = async () => {
        try {
          const response = await fetch('https://api.spotify.com/v1/playlists/5oFGghsdVHDyOARW3ZDXhW', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPlaylistData(data);
            console.log('Playlist Data:', data);
          } else {
            console.error('Failed to fetch playlist', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching playlist', error);
        }
      };

      fetchPlaylist();
    }
  }, [accessToken]);

  // Effect to fetch user profile data if access token is available
  useEffect(() => {
    if (accessToken) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            console.log('User Profile:', data);
          } else {
            console.error('Failed to fetch user profile', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user profile', error);
        }
      };

      fetchUserProfile();
    }
  }, [accessToken]);

  return (
    <div className="bg-black min-h-50 flex justify-center items-center">
      <div className="flex flex-col md:flex-row">
        <div className="p-4">
          <h1 className="text-white text-left text-xl md:text-2xl font-bold mb-2">Name: {userData.display_name}</h1>
          <h2 className="text-white text-left text-lg md:text-xl mb-2">Email: {userData.email}</h2>
          <h2 className="text-white text-left text-lg md:text-xl mb-2">Country: {userData.country}</h2>
          <h2 className="text-white text-left text-lg md:text-xl mb-2">Subscription: {userData.product}</h2>
          <p className="text-white text-left text-lg md:text-xl">Playlist Title: {playlistData.name}</p>
        </div>
  
        <div className="flex justify-center items-center p-4">
          {playlistData.images && playlistData.images.length > 0 && (
            <img src={playlistData.images[1].url} alt={playlistData.name} className="rounded-lg shadow-lg" />
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AccessToken;
