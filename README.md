# Netflix Theme for Lampa TV

A Netflix-inspired dark theme plugin for [Lampa](https://github.com/yumata/lampa-source) media center. Transforms the Lampa interface with Netflix's signature look — dark backgrounds, red accents, smooth animations, and a hero billboard.

## Features

- **Netflix color scheme** — dark `#141414` background with `#E50914` red accents
- **Hero billboard** — focused content displays a large backdrop banner with title, rating, year, and overview
- **Card overlays** — Netflix-style info overlay on focused cards with title and metadata
- **Row animations** — staggered slide-in entrance animations for content rows and cards
- **Focus effects** — cards scale up with a red glow border on focus, unfocused cards dim slightly
- **Full UI restyle** — menu, modals, settings, player, search, buttons all themed
- **Intro animation** — Netflix-style zoom intro on app launch
- **Settings integration** — toggle hero banner, card overlays, and animations from Lampa settings
- **Multi-language** — settings labels in English, Russian, Ukrainian, and Belarusian
- **Responsive** — adapts to mobile, tablet, and TV screen sizes

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
| `netflix.js` | Main plugin — injects CSS, creates hero billboard, card overlays, row animations |
| `style.css` | All theme styles — colors, layout, animations, responsive breakpoints |

## Configuration

After installation, go to **Settings** → **Interface** to find these options:

| Setting | Default | Description |
|---------|---------|-------------|
| Netflix Hero Banner | On | Large backdrop billboard for focused content |
| Card Overlays | On | Title/year overlay on card focus |
| Row Animations | On | Staggered slide-in animation for rows |

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Netflix Red | `#E50914` | Accent, focus borders, buttons, badges |
| Background | `#141414` | Main background |
| Surface | `#181818` | Cards, modals, elevated elements |
| Primary Text | `#FFFFFF` | Headings, titles |
| Secondary Text | `#E5E5E5` | Body text, descriptions |
| Dim Text | `#999999` | Metadata, timestamps |
| Green Accent | `#46D369` | Year badge in overlays |

## Compatibility

- Lampa 1.x — 3.x
- Android TV, WebOS 3+, Tizen 4+, Desktop browsers

## License

MIT
