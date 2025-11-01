# DARKMOON FEEDBACK

Completed items should be removed from this file. Below are the active tasks we still need to track and prioritize for play testing.

- Short actionable checklist

## Instructions

Use `TODO.md` to pick next features to implement but prioritize the feedback below. But if too complex move to the next `PHASE#.md` like `PHASE7.md`. If none are found add these to your current action items and continue working.

## QA Review - Phase 7 - Round 2 ✅ COMPLETED

All 7 issues have been implemented. Use the checklist below to validate:

### QA Validation Checklist

#### QA Feedback

- [ ] Input bug, sometimes when clicking away from the browser/game window the character movement gets "stuck" as if a key is being held down. clicking back into the window does not fix it. only clicking the key again fixes it. this happens on desktop with keyboard controls. ex: A continues to be held down or most commonly W continues to be held down after clicking away from the window and back.
- [ ] Add a "jump" button on mobile - or aadjusted to pickup tap on joystick area as a button as well for jumping.
- [ ] The jump should work more like a jetpack. right now we kind of just pop up. also theres no delay to jumping so we just kind of hop. give it a gradient. some delay to reach max height and some floaty physics so it falls slowly back down. maybe hold space to go up higher? but definitely make it more floaty like low gravity on the moon and less like a quick hop (currently like a bunny hop).
- [ ] The environment should have some "float" to it - like low gravity on the moon - so jumps are higher and longer hang time as well as slower falls and slight movement drift while in air or jumping forward (so inertia is "maintained" better)
- [ ] make the chat button a "button" like the mute button instead of just text so its more obvious its clickable. set it next to the mute button on the top left.
- [ ] The jump button should be more prominent and easier to reach on mobile devices.
- [ ] Love the new home ui! the game features section should be a "hover" card style so when you hover over each game it highlights or pops out a bit to indicate which features you have.
- [ ] change the terrain color to a more moon-like grayish color instead of green grass. give it some rocky texture as well smaller.
- [ ] add some obstacles or items to the game world to make it more interesting ,and give them collision boxes so the player can bump into them. ie: random rocks that are "interactable" (have collision boxes) so the player can bump into them while running around (and they move a bit when hit)
- [ ] improve the player model to have even more of a space suit design to it. give it a jetpack and a "temp" animation (cones that are pointed down and show up when "jumping" is fine for now)
- [ ] add some ambient background music to the game (looping spacey music)
- [ ] add sound effects for jumping, landing, footsteps when moving, and item pickups (
- [ ] Currently when a bot runs into a player they are not tagged back. this should be fixed so that bots can tag the player as well when they run into them.
- [ ] when the bot runs into the user when playing tag they should stop moving for a second to simulate being tagged.
- [ ] when the bot is not currently tagged it should run away from the player (but not fast enough to get away while the user is sprinting but not always force them to sprint to catch the bot)
- [ ] if you win tag (you are not it when time runs out) add a sound effect and visual effect (like confetti above the player and fireworks emojis to chat)
- [ ] A & D should turn the camera left and right instead of strafing **(AND rotate the character to match camera direction)**
- [ ] Q & E should strafe left and right **(without rotating the character)**
- [ ] Space should jump **(with upward momentum and floaty physics)**

#### 1. WASD Movement Fixed (Desktop)

Validated as fixed! Feedback above.

#### 2. Mobile Joystick Touch

They still do not work the right joystick is still on a weird grey bar and at the top right of screen instead of the expected lower right half. the move one is in the correct spot but doesnt respond to touch. two touch should work like right click does (when not on joysticks) but it does not. single touch should do nothing right now on mobile. maybe we need some type of "input" control or toggle for now? to ennable touch/mobile controls? howeever the chat toggle does work on touch for mobile.

#### 3. Mobile Browser Bar Hidden

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
