// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import { codeVerifier } from '../components/CodeVerify';
import { codeChallenge } from '../components/CodeVerify';



// Spotify application credentials
export const clientId = 'f0cf6b591f814e23a3713dad44df02d3';
export const redirectUri = 'http://localhost:3000/';

const scope = 'user-read-private user-read-email';

// Create a new URL object for Spotify's authorization endpoint
const authUrl = new URL("https://accounts.spotify.com/authorize");

// storing codeVerifier in localStorage for use in the token exchange step
window.localStorage.setItem('code_verifier', codeVerifier);

const params = {
  response_type: 'code',
  client_id: clientId,
  scope,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: redirectUri,
};

// Set the search parameters of the authUrl to the params object, converting it to a query string
authUrl.search = new URLSearchParams(params).toString();

// Redirect the user to Spotify's authorization page
window.location.href = authUrl.toString();

//  authorization code from the URL
const urlParams = new URLSearchParams(window.location.search);
export let code = urlParams.get('code');