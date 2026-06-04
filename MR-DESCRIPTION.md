## Summary

- Replaces the desktop app icon in all three channels (`dev`, `beta`, `prod`) with the Atenea avatar (rasterized from `avatar.svg` using `rsvg-convert` + `iconutil`)
- Renames the application to `"Atenea Desktop"` in `APP_NAMES` (all channels) and the `BrowserWindow` title
- 21 icon assets updated (PNG sizes: 512, 256, 128, 64, 32 + ICNS bundle per channel)
- TypeScript verified clean (`tsgo -b` exit 0)

## Changes

| Area | Files |
|---|---|
| Icons (dev/beta/prod) | `icon.png`, `dock.png`, `128x128.png`, `128x128@2x.png`, `64x64.png`, `32x32.png`, `icon.icns` × 3 channels |
| App name | `packages/desktop/src/main/index.ts` — `APP_NAMES` + dev `app.setName` fallback |
| Window title | `packages/desktop/src/main/windows.ts` — `createMainWindow` `title` |

## Out of scope (intentionally untouched)

- `productName`, `appId`, deep-link protocols in `electron-builder.config.ts`
- Error dialog strings (`"OpenCode failed to load"`, etc.)
- `icon.ico` (Windows packaging)
- Windows Store tile assets (`StoreLogo.png`, `Square*Logo.png`)
- `bun.lock` (pre-existing noise)

## Test plan

- [ ] Run `bun dev:desktop` and confirm the Dock shows the Atenea avatar icon
- [ ] Confirm the main window title bar reads "Atenea Desktop"
- [ ] Confirm the macOS menu bar app name reads "Atenea Desktop"
- [ ] Confirm no regression in OpenCode functionality (chat, file editing, etc.)

Co-authored-by: Atenea Agent <srv_atenea_gitlab@ofidona.net>
