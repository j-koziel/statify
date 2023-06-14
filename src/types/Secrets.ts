/**
 * Secrets interface
 * @interface Secrets
 * @property {string | undefined} clientId - Client ID from .env file
 * @property {string | undefined} clientSecret - Client Secret from .env file
 * @property {string | undefined} redirectUri - Where the user will be redirected after they login
 */
interface Secrets {
  clientId: string | undefined;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
}

export default Secrets;
