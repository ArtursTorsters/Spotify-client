import React, { useEffect, useState } from 'react';
import { clientId, redirectUri } from '../components/Authorization';

// Function to exchange the authorization code for an access token
const getToken = async (code: string): Promise<string | null> => {
  // Retrieve the code verifier from localStorage
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) {
    console.error('Code verifier not found in localStorage');
    return null;
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const url = 'https://accounts.spotify.com/api/token'
  try {
    const response = await fetch(url, payload);
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

interface AccessTokenProps {
  children: React.ReactNode;
}

const AccessToken: React.FC<AccessTokenProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Extract the authorization code from the URL and exchange it for an access token
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

  // Function to fetch the user's profile data
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch user profile', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('User Profile:', data);
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  };

  // Fetch the user's profile data when accessToken is set
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      {accessToken ? (
        <p>Access Token acquired. Check console for user profile data.</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AccessToken;
