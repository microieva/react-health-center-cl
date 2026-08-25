import { env, log, logError, buildSignicatAuthUrl } from '../constants';

export interface SignicatTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

export const initiateSignicatLogin = (): void => {
  try {
    const authUrl = getSignicatLoginUrl();
    log('Redirecting to Signicat for authentication');
    window.location.href = authUrl;
  } catch (error) {
    logError('Failed to initiate Signicat login', error);
    // show an error message to the user here
    throw error;
  }
};

export const getSignicatLoginUrl = (): string => {
  return buildSignicatAuthUrl();
};

export const getSignicatToken = async (code: string): Promise<SignicatTokenResponse> => {
  log('Fetching Signicat token');
  
  const params = new URLSearchParams({
    grant_type: env.signicatGrantType,
    code: code,
    redirect_uri: env.signicatRedirectUri,
    client_id: env.signicatClientId,
    client_secret: env.signicatClientSecret,
  });

  try {
    const response = await fetch(env.signicatTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    log('Signicat token received successfully');
    return data;
  } catch (error) {
    logError('Failed to get Signicat token', error);
    throw error;
  }
};