# DARKMOON FEEDBACK

Active QA feedback and issues. Completed items are removed.

## Pending QA Issues

### Mobile Joystick Touch (HIGH PRIORITY)

Right joystick appears on a grey bar at top-right instead of lower-right. Left joystick doesn't respond to touch. Two-finger touch should work like right-click but doesn't. Single touch (not on joystick) should do nothing. Investigate touch event handling and joystick positioning/responsiveness.

**Note**: May need input toggle for mobile controls or investigate proven React joystick libraries.

### Mobile Browser Address Bar (MEDIUM PRIORITY)

Current `dvh` solution doesn't work on mobile Safari or Android Chrome. Address bar still visible on load and after device rotation. Need alternative approach (possibly viewport-fit=cover meta tag or iOS-specific handling).

## Known Working Features

- ✅ WASD movement (desktop)
- ✅ Chat profanity filter
- ✅ Code quality
- ✅ WebSocket warnings eliminated in solo mode
