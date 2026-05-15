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

## Save And Import Character Files

Use **Save File** on the DM screen to save the current character list as a JSON file. Your browser may open a Save As dialog so you can choose the file name and location. If the browser does not support that dialog, Roundkeeper will download a JSON file instead.

Use **Import File** on the DM screen to choose a saved JSON file. Imported characters are added to the current tracker instead of replacing it.

This supports a practical table workflow:

1. Create the party and allies, then save them as something like `main party.json`.
2. Create monster groups for specific rooms or encounters, then save each group separately.
3. Start play with only the party and allies in the tracker.
4. When the party enters a room, import that room's monster file.
5. Remove defeated monsters with the `X` button until only the party remains.

Saved files may include character names, encounter data, and uploaded image data. Treat them like private campaign data.

## Private Victory And Unconscious Images

Roundkeeper can automatically swap in special local images for the **Victory** button and the **Unconscious** condition.

Put private campaign images here:

```text
backups/roundkeeper-private-campaign-files/images
```

Name files with the exact character name followed by `Victory` or `Unconscious`:

```text
Sherlock Gnomes Victory.jpg
Sherlock Gnomes Unconscious.jpg
Room A Skeleton Victory.jpg
Room A Skeleton Unconscious.jpg
```

Supported image formats are `.jpg`, `.jpeg`, `.png`, and `.webp`. These private files are ignored by Git and should be shared separately, such as in a zip file.

When a DM clicks **Victory** or applies the **Unconscious** condition, the player display briefly features that character in a large portrait overlay, then returns to the normal initiative grid.

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
