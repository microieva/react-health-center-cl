import { env, log, logError } from '../constants';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
  id_token: string;
}

const STATE_KEY = 'google_oauth_state';

export const getGoogleLoginUrl = (): string => {
  const state = generateRandomState();
  sessionStorage.setItem(STATE_KEY, state);
  
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleRedirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state: state,
    access_type: 'offline', 
    prompt: 'select_account', 
  });
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  if (env.debugMode) {
    log('Generated Google auth URL:', { authUrl, state });
  }
  
  return authUrl;
};

export const initiateGoogleLogin = (): void => {
  try {
    const authUrl = getGoogleLoginUrl();
    log('Redirecting to Google for authentication');
    window.location.href = authUrl;
  } catch (error) {
    logError('Failed to initiate Google login', error);
    throw error;
  }
};

export const getGoogleToken = async (code: string, state: string): Promise<GoogleTokenResponse> => {
  log('Fetching Google token');
  
  const storedState = sessionStorage.getItem(STATE_KEY);
  if (state !== storedState) {
    throw new Error('Invalid state parameter - possible CSRF attack');
  }
  
  sessionStorage.removeItem(STATE_KEY);
  
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: env.googleRedirectUri
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google token request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    log('Google token received successfully');
    return data;
  } catch (error) {
    logError('Failed to get Google token', error);
    throw error;
  }
};

// export const getGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
//   log('Fetching Google user info');
  
//   try {
//     const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to get user info: ${response.statusText}`);
//     }

//     const data = await response.json();
//     log('Google user info received');
//     return data;
//   } catch (error) {
//     logError('Failed to get Google user info', error);
//     throw error;
//   }
// };


const generateRandomState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const clearCallbackParams = (): void => {
  window.history.replaceState({}, '', window.location.pathname);
};