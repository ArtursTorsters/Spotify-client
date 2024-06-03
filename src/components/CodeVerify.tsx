// Generate a random string for code verifier
const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('')
};

export const codeVerifier = generateRandomString(64);

// Hash the code verifier using SHA-256
const sha256 = async (plain: string | undefined) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: any) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}


// Export the code challenge
const hashed = await sha256(codeVerifier)
export const codeChallenge = base64encode(hashed)


// Log codeVerifier and codeChallenge
console.log('Code Verifier:', codeVerifier);
console.log('Code Challenge:', codeChallenge);
