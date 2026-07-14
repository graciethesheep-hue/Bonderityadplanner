# 🚀 Deploying your ADHD Life Planner as an installable app (PWA)

This `deploy` folder is everything the live site needs:

| File | What it is |
|---|---|
| `index.html` | The app itself (same as `ADHD_Dashboard_v24.html`) |
| `manifest.webmanifest` | Tells phones the app's name, colors, and icons |
| `sw.js` | Service worker — makes the app work **offline** after the first visit |
| `icon-*.png` | App icons (home screen, splash, iOS) in the app's indigo palette |

> ⚠️ Your data always stays in the browser you use — deploying does NOT upload
> any personal data. But each browser/device has its OWN data, so use
> Settings → Export/Import to move data between devices.

## Option A — Vercel (recommended, you already use it for Sanctuary)

1. Go to https://vercel.com/new
2. Drag and drop this whole `deploy` folder onto the page (or "Browse" and pick it).
3. Click **Deploy**. That's it — you'll get a URL like `https://adhd-planner-xyz.vercel.app`.

## Option B — GitHub Pages

1. Create a repository at https://github.com/new (e.g. `adhd-planner`).
2. Upload all files from this folder ("Add file → Upload files").
3. Settings → Pages → Source: `main` branch, `/ (root)` → Save.
4. Your app appears at `https://<your-username>.github.io/adhd-planner/`.

## Installing it on your phone

- **iPhone (Safari):** open the URL → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the URL → you'll see an **Install app** prompt (or ⋮ menu → Add to Home screen).

It opens full-screen like a native app, uses the 🧠 icon, and works offline.

## Updating the live app later

1. Copy the newest `ADHD_Dashboard_vNN.html` over `deploy/index.html`.
2. In `sw.js`, change `CACHE_VERSION` (e.g. `'adhd-planner-v24'` → `'adhd-planner-v25'`)
   so phones pick up the new version instead of the cached one.
3. Re-deploy the folder (Vercel: drag & drop again; GitHub: upload the two changed files).
