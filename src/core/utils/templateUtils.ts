
export const replaceBackendUrl = (html: string | null | undefined): string => {
  if (!html) return '';
  
  let backendUrl = process.env.BACKEND_URL || '';
  if (!backendUrl && process.env.MAILING_SERVICE_URL) {
    backendUrl = process.env.MAILING_SERVICE_URL.replace(/\/mailing\/?$/, '');
  }
  
  // Si no hay backendUrl, intentamos dejarlo como está o usar una ruta relativa
  // Pero lo más seguro es reemplazar el placeholder si existe
  return html.replace(/{{\s*backend_url\s*}}/g, backendUrl);
};
