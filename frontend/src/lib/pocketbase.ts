// frontend/src/lib/pocketbase.ts

import Pocketbase from "pocketbase";

const pb = new Pocketbase(import.meta.env.VITE_API_URL);

export default pb;