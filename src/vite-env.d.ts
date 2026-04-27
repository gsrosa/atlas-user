/// <reference types="vite/client" />
/// <reference types="webpack/module" />

declare const __webpack_public_path__: string;

interface ImportMetaEnv {
  readonly VITE_I18N_ASSET_ORIGIN?: string;
}

declare module '@gsrosa/nexploring-ui/styles';
declare module '@gsrosa/nexploring-ui/tokens';
declare module '@gsrosa/nexploring-ui/theme';
