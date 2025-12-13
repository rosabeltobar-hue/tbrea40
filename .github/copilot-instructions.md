# Copilot instructions — tbrea40

Quick context
- This is a small React + TypeScript single-page app (entry: `src/index.tsx`, router in `src/App.tsx`).
- UI pages live in `src/pages/*` (e.g. `src/pages/Dashboard.tsx`).
- Lightweight service layer is under `src/services/*` (e.g. `user.ts`, `auth.ts`, `chat.ts`) — these are the canonical place for API/network code.

Build & dev commands
- Start dev server: `npm start` (uses `react-scripts start`).
- Production build: `npm run build` (output in `build/`).
- Tests: `npm test` (runs `react-scripts test`).

Important project patterns (do not invent alternatives)
- Pages: Add/modify pages in `src/pages/`. Each page is a default-exported React component (see `Dashboard.tsx`).
- Routing: `src/App.tsx` uses `react-router-dom` and defines routes — follow its route structure and add new routes there.
- Services: Put cross-cutting network or domain logic in `src/services/*.ts` and export named functions. Example: `src/services/user.ts` exports `createUser` and `getUser` which currently log to console — use that module-style pattern when adding API functions.
- Minimal global state: The repo expects centralized contexts (look for `src/components` / `src/components/context`) — if you add global state, prefer a context under `src/components` and export hooks for consumption by pages.

Conventions & constraints discovered here
- TypeScript project using `react-scripts` (see `package.json`). Keep edits type-safe and avoid adding runtime-only JS unless necessary.
- Many `src/services/*.ts` files are placeholders (some empty). Do NOT assume external API shapes — prefer to add small, well-named functions and keep them isolated in `src/services`.
- UI navigation currently uses plain anchors in `src/pages/Dashboard.tsx`. When improving navigation, prefer `react-router-dom` primitives (`Link`, `useNavigate`) to avoid full page reloads.

Integration points to be careful with
- `public/index.html` and `build/` are used for the static site; adding runtime server logic is out of scope.
- `src/services/*` is the place to add fetch/axios wrappers. If adding environment URLs, prefer using a `.env` or `process.env` and document required env vars in PR notes.

Firebase (optional)
- Starter Firebase files are available at `src/services/firebase.ts` and `src/services/firestore.ts`.
- Install SDK before use: `npm install firebase`.
- Provide config via environment variables named `REACT_APP_FIREBASE_*` (see `.env.example`).
- Keep Firebase usage isolated to `src/services/*`. Prefer small wrapper functions (see `src/services/firestore.ts` `createUserDoc` / `getUserDoc`) rather than spreading SDK calls across many components.


Examples (how to make typical changes)
- Add a new page: create `src/pages/NewPage.tsx` default-exporting a React component, then add `<Route path="/new" element={<NewPage/>} />` in `src/App.tsx`.
- Add an API helper: create `src/services/example.ts` and export `export const fetchExample = async () => { /* use fetch and return typed result */ }` — import and call from pages or hooks.

Behavior expectations for AI agents
- Keep changes minimal and local — update or create the smallest number of files needed.
- If a service file is empty, do not invent external endpoints; add a TODO comment and a simple placeholder implementation consistent with `user.ts` (console.log) unless the user supplies API details.
- When adding dependencies, mention them in the PR description and avoid changing `package.json` without the user's confirmation.
- Always reference the file(s) you modify in your commit message and in the PR body.

Where to look first
- `src/App.tsx` — routing and site structure.
- `src/pages/*` — current UI components and nav patterns.
- `src/services/*` — canonical place for network/domain logic.
- `package.json` — scripts and project type.
- `public/index.html` and `build/` — static entry points.

If anything above is unclear or you need repository-specific API details (auth tokens, backend URLs), ask before implementing network calls.

— End of file
