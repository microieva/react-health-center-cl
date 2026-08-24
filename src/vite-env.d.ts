/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required - API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_GRAPHQL_ENDPOINT: string;
  readonly VITE_WEBSOCKET_URL: string;
  
  // Optional - App Configuration
  readonly VITE_DEBUG_MODE?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  
  // Optional - Third-party Services
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;

  // Signicat Configuration (Required)
  readonly VITE_SIGNICAT_AUTH_ENDPOINT: string;
  readonly VITE_SIGNICAT_TOKEN_ENDPOINT: string;
  readonly VITE_SIGNICAT_CLIENT_ID: string;
  readonly VITE_SIGNICAT_CLIENT_SECRET: string;
  readonly VITE_SIGNICAT_REDIRECT_URI: string;
  readonly VITE_SIGNICAT_GRANT_TYPE?: string;
  
  // Build environment
  readonly MODE: 'development' | 'production' | 'test';
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}