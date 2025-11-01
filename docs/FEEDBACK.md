# DARKMOON FEEDBACK

Active QA feedback and issues. Completed items are removed.

## QA Feedback

- [ ] home page - Game Features section is still cut off. the features should be related to each "game" so that when you hover over the game card it spins to show the features of that game specifically. (keep the existing buttons on the 2nd card side). just apply this to the solo practice game for now since thats the only one that works.
- [ ] idk if we havent built the jetpack yet, but jump still sucks. so definitely needs a jetpack.
- [ ] Tag mechanics and bots have some bugs. there may need to be a delay between how quickly someone can be tagged after the most recent tag/change of who is it. that should help (maybe 1-2 seconds to start and we can tweak it)
- [ ] Bots should only run away when not tagged, and when immediately tagged they should stop moving for a bit if easier to apply this to anyone who is tagged that is fine (ie: frozen for 1-2 seconds).
- [ ] Also sometimes when you tag a bot it registers but when the bot tags the player it doesn't change who is it (but it does register because the "tagged by bot" text appears)
- [ ] when the bot is it, it sometimes will not move closer to the player, it moves the opposite direction.
- [ ] if the bot is "it" it should try and chase the player regardless of distance. the current distance marker should just apply to when the bot is "detecting" a player and choosing to run away (which does sort of work right now so keep this part as is, so tl;dr the distance marker stuff works well)
- [ ] there seems to be a big box collider around the bot that makes it hard to tag sometimes even when you are right next to it. not sure if this needs to be adjusted or is intended (see screenshot/pasted image for bot tagging bugs) but tl;dr the bot tagging the user doesnt change who is it sometimes. the behavior of the bot needs to more aligned to playing tag (so run towards the player when bot is it, only run away when the bot is not it and player enters "visible" radius, etc.)
- [ ] The "press c to open chat" should be positioned below the butttons for mute and chat (so bring it down a row)
- [ ] tag games should be 1 minute long to help with play testing more (maybe dynamic by player count? current is 2 so add 1 minute to 1min for every user above 2? so starting at 1min by default)
- [ ] the Tag game menu should be moved further right and the FPS counter can be placed to its immediate left so they are not overlapping.
- [ ] the bot seems to be able to tag us (but not vice/versa) when not playing tag yet.
- [ ] Jump button works on mobile (and the ui for mobile only appears on mobile so this is good so far.)

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
