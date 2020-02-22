
// Par défaut (dev), l'API sera accessible en local sur le port 3333
let apiUrl = "http://localhost:3333"
// Permet la surcharge si déclarée en variable d'environnement (REACT_APP_API_URL)
if (process.env.API_URL) {
  apiUrl = process.env.API_URL
}

export const APIUrl = apiUrl;
