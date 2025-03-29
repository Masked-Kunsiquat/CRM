// api/pocketbase.ts
import PocketBase from "pocketbase";

let pb: PocketBase | null = null; // Explicitly type pb

/**
 * Returns a singleton instance of the PocketBase client.
 *
 * If the client hasn't been initialized yet, it creates a new instance
 * using the `VITE_POCKETBASE_URL` from the environment variables.
 *
 * @returns {PocketBase} The PocketBase client instance
 */
const getPocketBase = (): PocketBase => {
  if (!pb) {
    pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  }
  return pb;
};

export default getPocketBase;
