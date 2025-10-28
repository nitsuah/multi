# FEEDBACK for darkmoon.dev

src/pages/Solo.tsx
Comment on lines +239 to +240
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (e: any) => {
Copilot AI
now
Use proper TypeScript typing instead of any. The event parameter should be typed as KeyboardEvent which is the correct type for keyboard events.

Copilot uses AI. Check for mistakes.
@nitsuah	Reply...
src/pages/Solo.tsx
Comment on lines +250 to +251
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyUp = (e: any) => {
Copilot AI
now
Use proper TypeScript typing instead of any. The event parameter should be typed as KeyboardEvent which is the correct type for keyboard events.

Copilot uses AI. Check for mistakes.
@nitsuah	Reply...
src/components/HelpModal.tsx
Comment on lines +9 to +10
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyPress = (e: any) => {
Copilot AI
now
Use proper TypeScript typing instead of any. The event parameter should be typed as KeyboardEvent which is the correct type for keyboard events.

Suggested change
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyPress = (e: any) => {
    
    const handleKeyPress = (e: KeyboardEvent) => {
Copilot uses AI. Check for mistakes.


## MAnual feedback

- camera is locked, but should match rotation.

- clicking the mouse seems to interupt movement, should not. and should allow freecam movement while moving (so can rotate around the player while moving forward/backwards)
  tl;dr maybe we use left click to do rotation? and right click to do skycam/freecam? i think that would make more sense? given we may need to use left click for inputs.

- ui - move the dark mode toggle to the lower left section, near settings. its a bit jarring to have it up top left.
- but the connection status should stay up top middle for now. also make it not interactable, so cant be highlights or clicked/- make it click through? and half opacity? also just make it say offline when in solo mode.

- make the input indicators (shift, wasd) bigger text but closer grouped. i like having that for debugging right now. but eventually we will hide it.. this is just the bones we're focusing on for now. 


- we dont need the fps counter in the top right. we can remove that for now. we have the unified one in the top left already.

- 