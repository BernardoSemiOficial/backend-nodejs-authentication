import { google } from "googleapis";

// Configurar OAuth2
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, // Substitua pelo seu client ID
  process.env.GOOGLE_CLIENT_SECRET, // Substitua pelo seu client secret
  process.env.GOOGLE_URL_REDIRECT // Substitua pelo seu redirect URI
);
