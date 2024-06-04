import { generateRandomString, generateCodeChallenge } from './CodeVerify'

export const clientId = 'f0cf6b591f814e23a3713dad44df02d3'
export const redirectUri = 'http://localhost:3000/'

const scope = 'user-read-private user-read-email';

const authorize = async () => {
  //  random string for code
  const codeVerifier = generateRandomString(128);
  console.log('Code Verifier:', codeVerifier);

  // Generate a code challenge using the SHA-256 hash of the code verifier
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log('Code Challenge:', codeChallenge);

  // Store the code verifier in local storage for later use
  localStorage.setItem('code_verifier', codeVerifier);

  // Construct the authorization URL parameters
  const params = new URLSearchParams({
    response_type: 'code', // Request an authorization code from Spotify
    client_id: clientId,    // Your Spotify application client ID
    scope,                  // Desired access scopes (separated by spaces)
    code_challenge_method: 'S256', // Hashing method used for code challenge
    code_challenge: codeChallenge,         // The generated code challenge
    redirect_uri: redirectUri, // Redirect URI after authorization
  });

  // Redirect the user to Spotify's authorization endpoint
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export default authorize;