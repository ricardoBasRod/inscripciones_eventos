export const environment = {
  production: true,
  apiUrl: '',
  // Configuración de OneDrive para producción
  oneDrive: {
    clientId: '', // Se rellenará con el Client ID de Azure
    authority: 'https://login.microsoftonline.com/common',
    redirectUrl: 'https://tudominio.com' // Cambiar por tu dominio
  }
};
