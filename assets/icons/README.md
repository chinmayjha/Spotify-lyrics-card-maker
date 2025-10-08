# Icon Assets

This directory contains all icon and image assets for the Spotify Lyrics Card Maker PWA.

## Icon Files

- `favicon.svg` - Main favicon (scalable vector)
- `icon-192.png` - PWA icon (192x192)
- `icon-512.png` - PWA icon (512x512)

## Notes

Current implementation uses inline SVG emoji for favicon. 
For production, consider creating proper branded icons:

1. Create a custom logo/icon design
2. Generate multiple sizes (16x16, 32x32, 192x192, 512x512)
3. Update manifest.json references
4. Add apple-touch-icon variations

## Tools for Icon Generation

- [PWA Asset Generator](https://github.com/pwa-builder/PWABuilder)
- [Favicon.io](https://favicon.io/)
- [Real Favicon Generator](https://realfavicongenerator.net/)