// api/pocketbase.ts
import PocketBase from 'pocketbase';

let pb: PocketBase | null = null; // Explicitly type pb

const getPocketBase = (): PocketBase => { // Explicitly type the return value
  if (!pb) {
    pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
  }
  return pb;
};

export default getPocketBase;