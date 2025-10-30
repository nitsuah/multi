# DARKMOON FEEDBACK

Completed items should be removed from this file. Below are the active tasks we still need to track and prioritize for play testing.

- Short actionable checklist

## Instructions

Use `TODO.md` to pick next features to implement but prioritize the feedback below. But if too complex move to the next `PHASE#.md` like `PHASE7.md`. If none are found add these to your current action items and continue working.

## QA Review - Phase 7 - Round 2 ✅ COMPLETED

All 7 issues have been implemented. Use the checklist below to validate:

### QA Validation Checklist

#### 1. WASD Movement Fixed (Desktop)

- [ ] Open game in desktop browser (Chrome/Firefox/Safari)
- [ ] Press W/A/S/D keys - character should move immediately
- [ ] Verify on-screen key indicators light up AND character moves
- [ ] Press SHIFT while moving - character should move faster
- [ ] Open browser console - no errors about keysPressed or event listeners
- [ ] Press ESC to pause - movement should stop
- [ ] Press ESC again to unpause - movement should resume

#### 2. Mobile Joystick Touch Fixed

- [ ] Open game on mobile device or enable mobile emulation in DevTools
- [ ] Touch and drag left joystick - character should move in that direction
- [ ] Touch and drag right joystick - camera should rotate
- [ ] Check browser console - NO "Unable to preventDefault inside passive event listener" warnings
- [ ] Joystick knobs should visually move with touch input
- [ ] Release touch - joysticks should return to center position

#### 3. Mobile Browser Bar Hidden

- [ ] Open game on actual mobile device (iOS Safari or Android Chrome)
- [ ] Page should scroll down 1px on load to hide address bar
- [ ] Rotate device - bar should stay hidden after orientation change
- [ ] Resize browser window - layout should adjust using dynamic viewport units
- [ ] Game should fill entire screen without white space at top/bottom

#### 4. WebSocket Warnings Eliminated

- [ ] Open game in solo mode
- [ ] Open browser console (F12)
- [ ] Check console output - NO WebSocket connection warnings
- [ ] Should NOT see "WebSocket is closed before connection is established"
- [ ] Should NOT see repeated reconnection attempt messages
- [ ] Debug logs may show "Socket connection error (expected in solo mode)" - this is OK

#### 5. Chat Profanity Filter Working

- [ ] Open game and press C to open chat
- [ ] Type a test message with profanity (e.g., "what the fuck")
- [ ] Press Enter to send
- [ ] Message should display with asterisks replacing bad words (e.g., "what the \*\*\*\*")
- [ ] Test multiple bad words from the filter list
- [ ] Filter should be case-insensitive (FUCK, fuck, FuCk all filtered)

#### 6. Home Page UI Improved

- [ ] Navigate to home page (/)
- [ ] Content should have visible spacing/padding around game cards
- [ ] Projects container should have 1.5rem gap between cards
- [ ] Footer should NOT touch the content (2rem padding, 3rem margin-top)
- [ ] Layout should feel spacious, not cramped
- [ ] Moon emoji background should be visible and properly sized

#### 7. Code Quality Issues Fixed

- [ ] Run `npm run lint` - should pass with 0 warnings
- [ ] Check Solo.tsx debug logging - uses `frameCounter.current % 100` NOT `Math.random()`
- [ ] Check App.css - all viewport units should be `dvh`/`dvw` NOT `vh`/`vw`
- [ ] Check mobile styles - `.moon-background` class selector used (not fragile `div[style*="fontSize"]`)
- [ ] Run `npm test` - all tests should pass (116 tests)
- [ ] Run `npm run build` - should complete successfully

### Technical Implementation Summary

**Fixed Files:**

- `src/pages/Solo.tsx` - Keyboard event handlers, profanity filter, mobile viewport, WebSocket config, frame counter
- `src/components/MobileJoystick.tsx` - Native touch events with passive: false
- `src/styles/App.css` - Viewport units standardized, CSS selectors improved, spacing updated

**Key Changes:**

- Event listener closures fixed with refs for isPaused/chatVisible
- Touch events: React synthetic → native DOM with { passive: false }
- Socket reconnection disabled for solo mode
- Client-side profanity filtering added
- All vh/vw → dvh/dvw throughout CSS
- Math.random() → frame counter for debug logging
