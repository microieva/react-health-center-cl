// src/constants.ts

// Type definitions for environment variables
interface EnvVariables {
  // API
  apiUrl: string;
  graphqlEndpoint: string;
  websocketUrl: string;
  graphqlUrl: string;
  
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  debugMode: boolean;
  mode: string;
  baseUrl: string;
  
  // App
  appName: string;
  version: string;
  
  // Third-party
  sentryDsn?: string;
  googleClientId?: string;
  googleAnalyticsId?: string;
  
  // Signicat
  signicatAuthEndpoint: string;
  signicatTokenEndpoint: string;
  signicatClientId: string;
  signicatClientSecret: string;
  signicatRedirectUri: string;
  signicatGrantType: string;
}

// Helper function to safely get environment variables
// Use string instead of keyof ImportMetaEnv to avoid type restrictions
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (import.meta.env.MODE === 'development') {
      console.warn(`⚠️ Environment variable ${key} is not set`);
    }
    return '';
  }
  return value as string;
};

// Helper to get boolean environment variables
const getBooleanEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return (value as string).toLowerCase() === 'true' || (value as string) === '1';
};

// Get all environment variables with defaults
const apiUrl = getEnvVar('VITE_API_URL', 'http://localhost:4000');
const graphqlEndpoint = getEnvVar('VITE_GRAPHQL_ENDPOINT', '/graphql');
const websocketUrl = getEnvVar('VITE_WEBSOCKET_URL', 'ws://localhost:4000/subscriptions');
const appName = getEnvVar('VITE_APP_NAME', 'Health Center');
const version = getEnvVar('VITE_APP_VERSION') || '1.0.0';
const sentryDsn = getEnvVar('VITE_SENTRY_DSN');
const googleClientId = getEnvVar('VITE_GOOGLE_CLIENT_ID');
const googleAnalyticsId = getEnvVar('VITE_GOOGLE_ANALYTICS_ID');

// Signicat configuration (required) - now using string key
const signicatAuthEndpoint = getEnvVar('VITE_SIGNICAT_AUTH_ENDPOINT');
const signicatTokenEndpoint = getEnvVar('VITE_SIGNICAT_TOKEN_ENDPOINT');
const signicatClientId = getEnvVar('VITE_SIGNICAT_CLIENT_ID');
const signicatClientSecret = getEnvVar('VITE_SIGNICAT_CLIENT_SECRET');
const signicatRedirectUri = getEnvVar('VITE_SIGNICAT_REDIRECT_URI');
const signicatGrantType = getEnvVar('VITE_SIGNICAT_GRANT_TYPE', 'authorization_code');

// Environment flags
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';
const isTest = import.meta.env.MODE === 'test';
const debugMode = getBooleanEnv('VITE_DEBUG_MODE', isDevelopment);

// Computed values
const graphqlUrl = `${apiUrl}${graphqlEndpoint}`;

// Export all environment variables
export const env: EnvVariables = {
  // API
  apiUrl,
  graphqlEndpoint,
  websocketUrl,
  graphqlUrl,
  
  // Environment
  isDevelopment,
  isProduction,
  isTest,
  debugMode,
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
  
  // App
  appName,
  version,
  
  // Third-party
  sentryDsn,
  googleClientId,
  googleAnalyticsId,
  
  // Signicat
  signicatAuthEndpoint,
  signicatTokenEndpoint,
  signicatClientId,
  signicatClientSecret,
  signicatRedirectUri,
  signicatGrantType,
};

// Export individual constants for convenience
export {
  apiUrl,
  graphqlEndpoint,
  websocketUrl,
  graphqlUrl,
  isDevelopment,
  isProduction,
  isTest,
  debugMode,
  appName,
  version,
  sentryDsn,
  googleClientId,
  googleAnalyticsId,
  signicatAuthEndpoint,
  signicatTokenEndpoint,
  signicatClientId,
  signicatClientSecret,
  signicatRedirectUri,
  signicatGrantType,
};

// Debug logger
export const log = (message: string, ...args: any[]): void => {
  if (debugMode) {
    console.log(`[${appName}] ${message}`, ...args);
  }
};

// Error logger (always logs)
export const logError = (message: string, error?: any): void => {
  console.error(`[${appName}] ❌ ${message}`, error || '');
};

// Info logger (always logs in development)
export const logInfo = (message: string, ...args: any[]): void => {
  if (isDevelopment) {
    console.info(`[${appName}] ℹ️ ${message}`, ...args);
  }
};

export const generateRandomState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const buildSignicatAuthUrl = (): string => {
  // Add validation at the start of the function
  if (!signicatAuthEndpoint) {
    throw new Error('VITE_SIGNICAT_AUTH_ENDPOINT is not configured. Please check your .env file.');
  }
  if (!signicatClientId) {
    throw new Error('VITE_SIGNICAT_CLIENT_ID is not configured. Please check your .env file.');
  }
  if (!signicatClientSecret) {
    throw new Error('VITE_SIGNICAT_CLIENT_SECRET is not configured. Please check your .env file.');
  }
  if (!signicatRedirectUri) {
    throw new Error('VITE_SIGNICAT_REDIRECT_URI is not configured. Please check your .env file.');
  }

  const state = generateRandomState();
  const responseType = 'code';
  const prompt = 'login';
  const scope = 'openid profile';
  const acrValues = 'idp:ftn';
  
  const params = new URLSearchParams({
    client_id: signicatClientId,
    client_secret: signicatClientSecret,
    response_type: responseType,
    grant_type: signicatGrantType,
    scope: scope,
    state: state,
    prompt: prompt,
    acr_values: acrValues,
    redirect_uri: signicatRedirectUri,
  });
  
  const authUrl = `${signicatAuthEndpoint}?${params.toString()}`;
  
  if (debugMode) {
    log('Generated Signicat auth URL:', { authUrl, state });
  }
  
  return authUrl;
};

// Validation function
export const validateEnv = (): boolean => {
  const requiredVars = [
    { key: 'VITE_API_URL', value: env.apiUrl },
    { key: 'VITE_GRAPHQL_ENDPOINT', value: env.graphqlEndpoint },
    { key: 'VITE_SIGNICAT_AUTH_ENDPOINT', value: env.signicatAuthEndpoint },
    { key: 'VITE_SIGNICAT_TOKEN_ENDPOINT', value: env.signicatTokenEndpoint },
    { key: 'VITE_SIGNICAT_CLIENT_ID', value: env.signicatClientId },
    { key: 'VITE_SIGNICAT_CLIENT_SECRET', value: env.signicatClientSecret },
    { key: 'VITE_SIGNICAT_REDIRECT_URI', value: env.signicatRedirectUri },
  ];

  const missing: string[] = [];

  requiredVars.forEach(({ key, value }) => {
    if (!value || value === '') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables:`);
    missing.forEach(key => console.error(`  - ${key}`));
    console.error(`\nPlease add these to your .env file and restart the dev server.`);
    console.error(`Make sure the .env file is in the root directory of your project.`);
    return false;
  }

  if (debugMode) {
    log('✅ Environment variables loaded successfully:', {
      API_URL: env.apiUrl,
      GRAPHQL_ENDPOINT: env.graphqlEndpoint,
      WEBSOCKET_URL: env.websocketUrl,
      MODE: env.mode,
      DEBUG_MODE: env.debugMode,
      APP_NAME: env.appName,
      VERSION: env.version,
      VITE_SIGNICAT_AUTH_ENDPOINT: env.signicatAuthEndpoint ? '✓ Configured' : '✗ Missing',
      VITE_SIGNICAT_TOKEN_ENDPOINT: env.signicatTokenEndpoint ? '✓ Configured' : '✗ Missing',
      VITE_SIGNICAT_CLIENT_ID: env.signicatClientId ? '✓ Configured' : '✗ Missing',
      VITE_SIGNICAT_CLIENT_SECRET: env.signicatClientSecret ? '✓ Configured' : '✗ Missing',
      VITE_SIGNICAT_REDIRECT_URI: env.signicatRedirectUri ? '✓ Configured' : '✗ Missing',
      VITE_SIGNICAT_GRANT_TYPE: env.signicatGrantType,
    });
  }

  return true;
};

// Auto-validate in development
if (isDevelopment) {
  validateEnv();
}

// Default export
export default env;