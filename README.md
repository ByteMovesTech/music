# Mike & Jaclyn's Tournament of Tunes

A lightweight music tournament that runs on GitHub Pages.

## Features

- 16-song tournaments
- 32-song tournaments
- Create tournaments directly in the browser
- Play preset tournaments
- Add YouTube links
- Randomized brackets
- Head-to-head song selection
- Automatic advancement
- Visual bracket
- Winner tracking
- Champion screen
- Save tournaments as JSON
- Load tournaments from your device
- Mobile friendly

## Repository Structure

The main website files stay in the root:

- `index.html`
- `style.css`
- `app.js`

Preset tournaments are stored in:

`tournaments/`

Inside that folder:

- `presets.json`
- `game1.json`
- `game2.json`
- `game3.json`

## Preset Tournaments

`presets.json` controls what appears under:

**Play Existing**

Example:

```json
{
  "tournaments": [
    {
      "name": "80s Dance",
      "file": "game1.json",
      "description": "The ultimate 80s dance song showdown."
    }
  ]
}
