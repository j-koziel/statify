/**
 * Secrets interface
 * @interface Secrets
 * @property {string | undefined} clientId - Client ID from .env file
 * @property {string | undefined} clientSecret - Client Secret from .env file
 */
interface Secrets {
  clientId: string | undefined;
  clientSecret: string | undefined;
}

export default Secrets;
