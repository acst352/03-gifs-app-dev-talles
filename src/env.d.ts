declare global {
  interface ImportMetaEnv {
    readonly VITE_GIPHY_API_KEY?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
