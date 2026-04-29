# Minimal Album

A small Vite + React album app with Clerk sign-up and shareable album links.

## Clerk setup

Create a Clerk application, copy the publishable key, and add it to `.env`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

The app loads Clerk's browser SDK from Clerk's CDN at runtime, so no Clerk npm package is required.

## Sharing

Signed-in users can edit the local album and share it. The share link stores a compact read-only album snapshot in the URL hash, so it works without a backend.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
