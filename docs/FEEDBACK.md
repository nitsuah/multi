# FEEDBACK for darkmoon.dev - Remaining Items

## Completed ✅

- TypeScript typing: Fixed all `any` types to use `KeyboardEvent`
- FPS counter removal: Removed Stats component from top right
- Input indicators: Made text bigger (16px) and closer grouped

## Still TODO ❌

### Camera & Controls

- Camera is locked, but should match rotation
- Clicking the mouse seems to interrupt movement, should not. Should allow freecam movement while moving (so can rotate around the player while moving forward/backwards)
  - Maybe use left click for rotation and right click for skycam/freecam? Given we may need to use left click for inputs.

### UI Positioning & Behavior

- **Dark mode toggle**: Move to the lower left section, near settings. It's jarring to have it up top left.
- **Connection status**: Should stay up top middle but:
  - Make it non-interactable (can't be highlighted or clicked - click through)
  - Half opacity
  - Show "offline" when in solo mode