import React, { useEffect, useState } from 'react';
import { clientId, redirectUri } from './Authorization';

const getToken = async (code: string): Promise<string | null> => {
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    console.error('Code verifier not found in localStorage');
    return null;
  }

  const payload = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });

    const data = await response.json();

    if (data.access_token) {
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



// access token properties
interface AccessTokenProps {
  children: React.ReactNode;
}
const AccessToken: React.FC<AccessTokenProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>({}); // storing the json user data in state object
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    if (authorizationCode) {
      getToken(authorizationCode).then((token) => {
        setAccessToken(token);
        console.log('Access Token:', token);
      });
    } else {
      console.error('Authorization code not found in URL');
    }
  }, []);

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
            setUserData(data); // Store user data in state
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
    <div>
        <div>
          <h1>Name: {userData.display_name}</h1>
          <h2>Email: {userData.email}</h2>
          <h2>Country: {userData.country}</h2>
          <h2>Subscription: {userData.product}</h2>
        </div>
    </div>
  )
}

export default AccessToken
