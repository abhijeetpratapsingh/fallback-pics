// Configuration for the app
export const PUBLIC_API_BASE = 'https://fallback.pics/api/v1';

export const API_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : PUBLIC_API_BASE;