// Configuration for the app
export const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8787' 
  : 'https://fallback.pics/api/v1';