const readEnv = (key: string): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Set it in .env (local dev) or in the deployment platform settings (Vercel, GitHub Actions, etc.).`
    );
  }
  return value;
};

export const environment = {
  production: true,
  companyName: 'Gifs',
  companyName2: 'App',
  companySlogan: 'Maneja tus gifs',

  giphyApiKey: readEnv('VITE_GIPHY_API_KEY'),
  giphyUrl: 'https://api.giphy.com/v1',
};
