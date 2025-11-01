# Phase 8: Audio, Visual Polish & Mobile Fixes

## Priority: High - Mobile Issues

### 1. Fix Mobile Joysticks

**Problem**: Right joystick at wrong position (top-right instead of bottom-right), left joystick doesn't respond to touch.

**Investigation Needed**:

- Check touch event propagation
- Verify joystick z-index and pointer-events
- Test on actual devices (not just browser dev tools)
- Consider using a proven React joystick library (e.g., `react-joystick-component`)

**Acceptance Criteria**:

- Left joystick controls movement (bottom-left)
- Right joystick controls camera (bottom-right)
- Both respond to touch immediately
- No visual glitches or grey bars

### 2. Fix Mobile Address Bar

**Problem**: Current `dvh` solution doesn't hide address bar on iOS Safari or Android Chrome.

**Potential Solutions**:

- Add `viewport-fit=cover` meta tag
- Use `window.visualViewport` API for iOS
- Implement scroll-to-hide trigger on load
- Use `standalone` mode detection for PWA

**Resources**:

- https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/

## Priority: Medium - Audio System

### 3. Ambient Space Music

**Requirements**: Looping background music with spacey atmosphere.

**Open Source Music Resources**:

- OpenGameArt.org (CC0/CC-BY)
- Freesound.org (Creative Commons)
- Incompetech.com (Royalty Free)
- Search terms: "space ambient loop", "sci-fi background music", "ethereal atmosphere"

**Implementation**:

- Add to SoundManager class
- Volume control integration
- Fade in/out on game start/end
- Respect mute button state

### 4. Sound Effects

**Needed SFX** (in priority order):

1. Jump/jetpack activation (whoosh)
2. Landing impact (soft thud)
3. Footsteps while moving (subtle, looping)
4. Victory celebration (triumphant fanfare)
5. Bot tag sound (boop/beep)

**Open Source SFX Resources**:

- Freesound.org - search "jump whoosh", "landing soft", "footstep"
- OpenGameArt.org - sci-fi sound packs
- Zapsplat.com - free tier available

## Priority: Low - Visual Enhancements

### 5. Jetpack Thrust Animation

**Current State**: No visual feedback when jumping.

**Proposed Solution**:

- Add cone meshes pointing downward from character's back
- Show only when jumping (isJumping state)
- Pulsing/flickering effect with emissive material
- Scale cones based on jump force/velocity

**Alternative**: Use particle system for thrust particles.

### 6. Improved Terrain Texture

**Current State**: Flat moon-gray color.

**Enhancements**:

- Add normal map for rocky detail
- Use TextureLoader for moon surface texture
- Consider displacement map for 3D relief
- Free moon textures: solarsystemscope.com, NASA image library

### 7. Player Model Enhancements

**Current State**: Basic geometric spaceman.

**Improvements**:

- Better helmet design (fishbowl style)
- Visible jetpack on back (box + nozzles)
- Glove details on hands
- Boot details on feet
- Consider using GLTF model instead of geometric primitives

## Future Features (Phase 9+)

### Gameplay

- Power-ups (speed boost, jump boost, invisibility)
- Multiple game modes (race, collect, survival)
- Procedural obstacle generation
- Day/night cycle with lighting changes

### Multiplayer

- Deploy WebSocket server (see DEPLOYMENT.md)
- Lobby system with room codes
- Player customization (colors, names)
- Leaderboards and stats

### Technical

- Service Worker for offline play
- Progressive Web App (PWA) manifest
- Analytics integration
- Performance profiling and optimization

## Asset Requests

**Need from human**: If you can source these, it would help:

1. **Music**: 1-2 minute looping space ambient track (MP3/OGG, CC0 or CC-BY)
2. **SFX Pack**: Jump, land, footstep, victory sounds (WAV/OGG)
3. **Textures** (optional): Moon surface texture (2048x2048 PNG)

**Search tips**: Look for "Creative Commons Zero" or "CC0" for no-attribution required, or "CC-BY" if attribution is acceptable (we can add to credits).
