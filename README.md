# Roundkeeper

Roundkeeper is a local-first D&D initiative tracker for tabletop play. The Dungeon Master uses the `/dm` screen to add characters, set initiative, track conditions, hide or show combatants, and advance turns. Players see a view-only `/display` screen on a second browser window, monitor, or projector.

The app runs on your own computer. It does not need an online account, server database, or internet connection after setup.

## Install Node.js

Roundkeeper needs Node.js to run locally.

1. Go to [nodejs.org](https://nodejs.org/).
2. Download the LTS version for your computer.
3. Install it with the default options.
4. Open Terminal on macOS/Linux or PowerShell on Windows.
5. Check that it worked:

```bash
node --version
npm --version
```

## Download From GitHub

On the GitHub project page:

1. Click the green **Code** button.
2. Choose **Download ZIP**.
3. Unzip the file.
4. Open Terminal or PowerShell in the unzipped project folder.

If you use Git, you can clone the repository instead:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd roundkeeper
```

## Run The App

Install the project once:

```bash
npm install
```

Start Roundkeeper:

```bash
npm run dev
```

Open these pages in your browser:

- DM controls: [http://localhost:5173/dm](http://localhost:5173/dm)
- Player display: [http://localhost:5173/display](http://localhost:5173/display)

For a two-screen setup, keep `/dm` on the DM laptop screen and move `/display` to the player-facing monitor or projector.

## Local Data

Roundkeeper saves campaign and encounter data in your browser's local storage on the DM's computer. The `/dm` and `/display` windows stay synchronized through browser-local sync methods, including `BroadcastChannel` and `localStorage` events. No campaign data, character data, encounter state, or uploaded images are sent to an online database.

Uploaded character and monster images are stored inside the browser as local data URLs. They are not written into the project folder.

## Back Up And Restore

Use **Export Backup** on the DM screen to download a JSON backup file. Keep that file somewhere safe if you want to preserve a campaign outside the browser.

Use **Import Backup** on the DM screen to restore a backup file. Importing replaces the current browser state.

The backup file may include character names, encounter data, and uploaded image data. Treat it like private campaign data.

## Privacy Note

The DM's data and images stay on their own computer. Do not commit backup files, local data folders, logs, or private image uploads to GitHub.

## For Developers

This is a small static React app served by a local Node.js server. It is not a Vite app. React is vendored in `vendor/`, so there are no runtime npm dependencies.

Common commands:

```bash
npm install
npm run dev
npm run build
```

Project structure:

- `index.html` - app shell loaded for both `/dm` and `/display`
- `main.js` - React app, routing, local persistence, import/export, and sync
- `styles.css` - DM and player display styles
- `server.js` - local static server with `/dm` and `/display` fallbacks
- `scripts/build.js` - copies the static app into `dist/`
- `vendor/` - vendored React browser files
- `images/roundkeeper-mark.svg` - public app mark

Local-only folders such as `data/`, `logs/`, `uploads/`, `backups/`, and private image files under `images/` are ignored by Git.
