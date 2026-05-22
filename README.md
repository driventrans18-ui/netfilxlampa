# Cinematic Theme for Lampa TV

An Apple TV+ inspired theme plugin for [Lampa](https://github.com/yumata/lampa-source) media center. Strips Lampa down to pure black, monochrome focus rings, glass surfaces, refined typography, and a near full-screen cinematic hero.

## Features

- **Monochrome cinematic palette** — pure black `#000` with off-white `#f5f5f7` and translucent whites; no bright accent color
- **Full-screen hero** — focused content fills 92% of the viewport with backdrop image, large tight-tracked title, and a clean meta row
- **Glass surfaces** — header, sidebar menu, modals, notifications, and player panel all use `backdrop-filter` blur over translucent dark
- **Refined card focus** — soft white ring, deep drop shadow, gentle 1.10× scale on focus; unfocused cards stay bright (not dimmed)
- **Quiet motion** — slow Apple-style easing, shortened row stagger, no splash intro
- **Pill controls** — buttons, search input, badges, and filters all use rounded pill shapes with white-on-black focus
- **Settings integration** — toggle the hero, card focus details, and row motion from Lampa settings
- **Multi-language** — setting labels in English, Russian, Ukrainian, and Belarusian
- **Responsive** — hero scales from 92vh on desktop, 70vh on tablet, 55vh on mobile

## Installation

### Option 1: Plugin URL

Add the plugin URL in Lampa:

1. Open Lampa → **Settings** → **Plugins**
2. Paste the plugin URL:
   ```
   https://driventrans18-ui.github.io/netfilxlampa/netflix.js
   ```
3. Restart Lampa

### Option 2: Manual

1. Download `netflix.js` and `style.css`
2. Host them on any web server (both files must be in the same directory)
3. Add the URL to `netflix.js` as a Lampa plugin

## Files

| File | Description |
|------|-------------|
| `netflix.js` | Main plugin — injects CSS, creates the hero billboard, focus overlays, row motion, settings |
| `style.css` | Theme styles — palette tokens, glass surfaces, motion, responsive breakpoints |

## Configuration

After installation, go to **Settings** → **Interface** to find these options:

| Setting | Default | Description |
|---------|---------|-------------|
| Cinematic Hero | On | Full-screen backdrop hero for the focused card |
| Card Focus Details | On | Title + year overlay on focused cards |
| Row Motion | On | Smooth fade-up entrance for content rows |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--tv-bg` | `#000000` | Main background |
| `--tv-surface` | `#0a0a0a` | Card surfaces |
| `--tv-surface-2` | `#161616` | Modals, settings panels |
| `--tv-text` | `#f5f5f7` | Titles, primary text |
| `--tv-text-2` | `rgba(255,255,255,0.72)` | Body, descriptions |
| `--tv-text-dim` | `rgba(255,255,255,0.48)` | Captions, metadata |
| `--tv-accent` | `#ffffff` | Focus rings, active states |
| `--tv-accent-soft` | `rgba(255,255,255,0.12)` | Hover/focus tint |
| `--tv-blur` | `saturate(180%) blur(24px)` | Glass surfaces |
| `--tv-ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Standard motion |

## Compatibility

- Lampa 1.x — 3.x
- Android TV, WebOS 3+, Tizen 4+, Desktop browsers
- Glass blur falls back gracefully on devices that don't support `backdrop-filter`

## License

MIT
