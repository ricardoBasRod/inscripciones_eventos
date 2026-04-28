// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: '',
  // Configuración de OneDrive (será completada posteriormente)
  oneDrive: {
    clientId: '', // Se rellenará con el Client ID de Azure
    authority: 'https://login.microsoftonline.com/common',
    redirectUrl: 'http://localhost:4200'
  }
};
