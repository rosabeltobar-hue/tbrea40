// src/services/firebase.ts
// Re-export of top-level `src/firebase.ts` initialization.
// Keeps existing import paths in the codebase working while centralizing
// config in `src/firebase.ts` (Vite `import.meta.env` usage).
export { auth, db } from "../firebase";
