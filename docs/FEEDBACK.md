# DARKMOON FEEDBACK

Completed items should be removed from this file. Below are the active tasks we still need to track and prioritize for play testing.

- Short actionable checklist

## Instructions

Use `TODO.md` to pick next features to implement but prioritize the feedback below. But if too complex move to the next `PHASE#.md` like `PHASE7.md`. If none are found add these to your current action items and continue working.

## QA Review - Phase 7 - Round 2 ✅ COMPLETED

All 7 issues have been implemented. Use the checklist below to validate:

### QA Validation Checklist

#### QA Feedback

- [ ] Add a "jump" for the player character (spacebar on desktop, button on mobile - button can be added later or adjusted to pickup tap on joystick area)
- [ ] The bot should move towards the player when "close" give it a radius indicator to show when it will start moving towards the player.
- [ ] Add sound effects for jumping and landing
- [ ] move chat to the top lft corner of the screen
- [ ] home screen should be more responsive and get a ui makover to make it look less plain
- [ ] add some terrain variation to the ground plane like hills or valleys (like the moons surface)
- [ ] add some obstacles or items to the game world to make it more interesting ,and give them collision boxes so the player can bump into them
- [ ] restart should reset the game state/position not just unpause
- [ ] make the character a spaceman instead of a box (can be a simple model with distinct head, body, and limbs) we'll add animation next.
- [ ] if you win tag (you are not it when time runs out) add a sound effect and visual effect (like confetti above the player and fireworks emojis to chat)
- [ ] A & D should turn the camera left and right instead of strafing
- [ ] Q & E should strafe left and right

#### 1. WASD Movement Fixed (Desktop)

Validated as fixed! Feedback above.

#### 2. Mobile Joystick Touch

They still do not work the right joystick is still on a weird grey bar and at the top right of screen instead of the expected lower right half. the move one is in the correct spot but doesnt respond to touch. two touch should work like right click does (when not on joysticks) but it does not. single touch should do nothing right now on mobile. maybe we need some type of "input" control or toggle for now? to ennable touch/mobile controls? howeever the chat toggle does work on touch for mobile.

#### 3. Mobile Browser Bar Hidden

- [ ] Open game on actual mobile device (iOS Safari or Android Chrome)
- [ ] Page should scroll down 1px on load to hide address bar?
- [ ] Rotate device - bar should stay hidden after orientation change
- [ ] Resize browser window - layout should adjust using dynamic viewport units
- [ ] Game should fill entire screen without white space at top/bottom

- QA says this doesn't work on mobile safari or android chrome. the address bar is still visible on load. rotating device also shows the address bar again. so this is not fixed yet. must be some other way to address url bar hiding on mobile browsers.

#### 4. WebSocket Warnings Eliminated

- [ ] Open game in solo mode
- [ ] Open browser console (F12)
- [ ] Check console output - NO WebSocket connection warnings
- [ ] Should NOT see "WebSocket is closed before connection is established"
- [ ] Should NOT see repeated reconnection attempt messages
- [ ] Debug logs may show "Socket connection error (expected in solo mode)" - this appears to be fixed.

#### 5. Chat Profanity Filter Working

working as expected!

#### 6. Home Page UI

- QA says this still needs work. needs a ui makeover to make it look less plain. spacing is better but still needs more visual polish. the "upcoming features" section is still well below the footer and cannot be seen, even when trying to scroll its hidden (not scrollable), but either way should not take up more than 1 page and should be responsive.

#### 7. Code Quality Issues Fixed

- looks good
