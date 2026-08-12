# Mike & Jaclyn's Tournament of Tunes

A lightweight music tournament that runs on GitHub Pages.

## Features

- 16-song tournaments
- 32-song tournaments
- Create tournaments directly in the browser
- Add YouTube links
- Randomized brackets
- Head-to-head song selection
- Automatic advancement
- Visual bracket
- Winner tracking
- Champion screen
- Save tournaments as JSON
- Load tournaments from JSON
- Mobile friendly

## Files

- `index.html` — Main website
- `style.css` — Website styling
- `app.js` — Tournament logic
- `sample-tournament.json` — Example tournament
- `README.md` — Instructions

## How to use

Create a GitHub repository and upload:

- index.html
- style.css
- app.js

Then enable GitHub Pages.

Open the website and choose:

**Create Tournament**

Choose either:

**16 Songs**

or

**32 Songs**

Then enter your songs.

The easiest format is:

Song Title | YouTube URL

For example:

Stellar | https://www.youtube.com/watch?v=123456

Drive | https://www.youtube.com/watch?v=789012

The YouTube URL is optional.

You can also use the "Load Tournament" button to load a previously saved JSON tournament.

## Saving a Tournament

During a tournament, click:

**Save JSON**

The website will download a JSON file containing the tournament's song list.

You can keep that file and load it again later.

## Important

This version does NOT require:

- Firebase
- A database
- User accounts
- A server
- Any backend

Everything runs in the browser.
