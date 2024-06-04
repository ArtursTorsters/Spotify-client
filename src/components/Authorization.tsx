import { generateRandomString, generateCodeChallenge } from './CodeVerify';

export const clientId = 'f0cf6b591f814e23a3713dad44df02d3';
export const redirectUri = 'http://localhost:3000/';
const scope = 'user-read-private user-read-email';

const authorize = async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  console.log('Code Verifier:', codeVerifier);
  console.log('Code Challenge:', codeChallenge);

  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export default authorize;
