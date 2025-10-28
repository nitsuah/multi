# Phase 5 - Game Mechanics & Multiplayer Interactions

## Overview
With the solid foundation from Phase 4 (movement, theme system, tutorials), Phase 5 transforms darkmoon from a tech demo into an actual game with objectives, player interactions, and progression systems.

---

## Core Game Mechanics to Implement

### 1. Player Interactions (High Priority)

#### 1.1 Collision Detection
- **Goal**: Players can interact with each other and the environment
- **Implementation**:
  - Add physics-based collision using Three.js raycasting or Rapier physics
  - Player-to-player collision (bump mechanics)
  - Environment boundaries (walls, obstacles)
  - Collectible item collision detection

#### 1.2 Real-Time Chat System
- **Goal**: Players can communicate in-game
- **Implementation**:
  - Text chat overlay (toggle with C key)
  - Socket.io message broadcasting
  - Chat history (last 50 messages)
  - Message input with Enter to send
  - Player name colors matching their character
  - Chat bubble above character heads (optional)
  - Profanity filter for public rooms

#### 1.3 Emotes/Quick Actions
- **Goal**: Non-verbal communication
- **Implementation**:
  - Number keys 1-5 for emotes (wave, jump, dance, etc.)
  - Animation triggers for character
  - Visual feedback (particle effects, sound)
  - Cooldown system (prevent spam)

---

### 2. Game Objectives (High Priority)

#### 2.1 Tag/Chase Game Mode
- **Goal**: Simple, fun objective for multiplayer
- **Implementation**:
  - One player is "it" (different color/glow effect)
  - Tag by getting close to another player
  - Timer showing how long you've been "it"
  - Score tracking: avoid being "it" longest
  - Round-based gameplay (3-5 minute rounds)

#### 2.2 Collectible Hunt Mode
- **Goal**: Competitive collection game
- **Implementation**:
  - Spawn glowing orbs/coins randomly in map
  - First to collect X items wins
  - Items respawn after collection (with delay)
  - Visual effect when collecting
  - Score display showing each player's count

#### 2.3 Race Mode
- **Goal**: Speed-based competition
- **Implementation**:
  - Checkpoint system (gates/hoops to fly through)
  - Lap counter
  - Best time tracking
  - Ghost replay of fastest lap (optional)
  - Boost pads for speed increase

---

### 3. Progression System (Medium Priority)

#### 3.1 Player Profiles
- **Goal**: Persistent player identity
- **Implementation**:
  - Username registration/login (optional auth)
  - Local storage for casual play
  - Avatar customization (color, shape, accessories)
  - Stats tracking (games played, wins, time played)

#### 3.2 Scoreboard/Leaderboard
- **Goal**: Competitive rankings
- **Implementation**:
  - In-game scoreboard (Tab key to view)
  - Session leaderboard (current room)
  - Global leaderboard (all-time top players)
  - Stats: wins, best times, total score
  - Daily/weekly/all-time filters

#### 3.3 Unlockables/Rewards
- **Goal**: Progression incentive
- **Implementation**:
  - Unlock new character colors after X wins
  - Unlock particle effects (trails, auras)
  - Unlock emotes after achievements
  - Achievement badges (first win, 10 games, etc.)
  - Display unlocks in player profile

---

### 4. Map & Environment (Medium Priority)

#### 4.1 Expanded Map Design
- **Goal**: More interesting gameplay space
- **Implementation**:
  - Add obstacles (walls, pillars, platforms)
  - Multiple elevation levels
  - Hazard zones (slow zones, bounce pads)
  - Interactive elements (doors, switches)
  - Minimap in corner showing player positions

#### 4.2 Multiple Maps
- **Goal**: Variety in gameplay
- **Implementation**:
  - 3-5 different map layouts
  - Map voting system before match
  - Each map optimized for different game modes
  - Environment themes (forest, space, city)

#### 4.3 Dynamic Elements
- **Goal**: Engaging environment
- **Implementation**:
  - Day/night cycle (lighting changes)
  - Weather effects (rain, fog - affects visibility)
  - Moving platforms
  - Rotating obstacles
  - Timed events (power-up spawns)

---

### 5. Power-Ups & Items (Low Priority)

#### 5.1 Speed Boost
- **Effect**: 2x movement speed for 5 seconds
- **Visual**: Blue trail/aura
- **Spawn**: Random locations, 30s cooldown

#### 5.2 Invisibility
- **Effect**: Semi-transparent for 8 seconds (can't be tagged)
- **Visual**: Ghost-like appearance
- **Spawn**: Rare, 60s cooldown

#### 5.3 Shield
- **Effect**: Immune to tagging for 10 seconds
- **Visual**: Glowing bubble around player
- **Spawn**: Random locations, 45s cooldown

#### 5.4 Teleport
- **Effect**: Instantly move to random location
- **Visual**: Portal effect
- **Spawn**: Rare, 90s cooldown

---

## Technical Implementation Plan

### Socket.io Events to Add
```typescript
// Player interactions
socket.on('player-tagged', (data) => { /* ... */ });
socket.on('item-collected', (data) => { /* ... */ });
socket.on('chat-message', (data) => { /* ... */ });
socket.on('emote-triggered', (data) => { /* ... */ });

// Game state
socket.on('game-mode-changed', (data) => { /* ... */ });
socket.on('round-started', (data) => { /* ... */ });
socket.on('round-ended', (data) => { /* ... */ });
socket.on('scoreboard-updated', (data) => { /* ... */ });

// Lobby/Room management
socket.on('room-created', (data) => { /* ... */ });
socket.on('room-joined', (data) => { /* ... */ });
socket.on('player-list-updated', (data) => { /* ... */ });
```

### New Components Needed
- `<ChatBox />` - Text chat UI
- `<Scoreboard />` - In-game scoreboard (Tab key)
- `<GameModeSelector />` - Pre-game mode selection
- `<PowerUpIndicator />` - Active power-up display
- `<Minimap />` - Top-right corner map
- `<PlayerProfile />` - Profile view/edit
- `<Leaderboard />` - Global rankings
- `<AchievementToast />` - Achievement notifications

### State Management
- Consider adding Zustand or Jotai for global game state
- Game mode, current round, scores, player list
- Reduce prop drilling in deeply nested components

---

## Testing Strategy

### New Test Files
- `ChatBox.test.tsx` - Message sending, history, filtering
- `Scoreboard.test.tsx` - Score updates, sorting, display
- `GameMode.test.tsx` - Mode selection, rules, transitions
- `PowerUp.test.tsx` - Spawn logic, effects, timers
- `Collision.test.ts` - Collision detection accuracy
- `Leaderboard.test.tsx` - Ranking algorithm, data fetching

### Integration Tests
- Full game round simulation (tag mode)
- Multi-player interaction scenarios
- Chat message flow
- Power-up collection and effects

### Coverage Goal
- Maintain 80%+ coverage as codebase grows
- Focus on game logic and state management
- Mock socket.io for deterministic tests

---

## Performance Considerations

### Optimizations Needed
1. **Socket Message Throttling**
   - Already doing position updates every 50ms
   - Add same throttling for chat (prevent spam)
   - Batch scoreboard updates (once per second)

2. **Particle Effect Pooling**
   - Reuse particle systems for power-ups/collectibles
   - Limit max active particles (performance budget)

3. **Level of Detail (LOD)**
   - Reduce polygon count for distant players
   - Simplify effects when FPS drops below 45

4. **Memory Management**
   - Cleanup disconnected player objects
   - Clear old chat messages (50 message limit)
   - Dispose Three.js geometries/materials properly

---

## UI/UX Improvements

### HUD (Heads-Up Display)
- **Top-left**: FPS counter, theme toggle (already have)
- **Top-center**: Game mode, round timer, objective
- **Top-right**: Minimap, player count
- **Bottom-left**: Chat box (toggle with C)
- **Bottom-center**: Power-up indicator
- **Bottom-right**: Score/stats for current player

### Accessibility
- High contrast mode for HUD elements
- Colorblind-friendly indicators (shapes + colors)
- Screen reader announcements for game events
- Keyboard shortcuts reference (already have H-key modal)

---

## Deployment Considerations

### Server Requirements
- More socket events = more server load
- Consider horizontal scaling (multiple server instances)
- Add Redis for session management across servers
- Rate limiting for chat/emotes

### Database Setup (Optional for Phase 5)
- PostgreSQL or MongoDB for player profiles
- Store: usernames, stats, unlocks, settings
- Leaderboard queries optimized with indexes
- Consider Firebase/Supabase for quick setup

---

## Success Metrics

### Phase 5 Complete When:
- [ ] At least 2 game modes fully implemented and tested
- [ ] Chat system working with profanity filter
- [ ] Collision detection accurate and performant
- [ ] Scoreboard displays correctly
- [ ] Player profiles with basic stats tracking
- [ ] At least 2 maps available
- [ ] 2+ power-ups implemented
- [ ] All new components have 80%+ test coverage
- [ ] No performance regression (maintain 60fps target)
- [ ] Multiplayer rooms support 4-8 players smoothly

---

## Timeline Estimate

- Player interactions (collision, chat): 8-10 hours
- Tag game mode: 4-6 hours
- Collectible hunt mode: 3-5 hours
- Scoreboard + leaderboard: 4-6 hours
- Player profiles: 3-4 hours
- Map expansion: 6-8 hours
- Power-ups (2-3 types): 4-6 hours
- Testing all features: 6-8 hours
- Bug fixes & polish: 4-6 hours

**Total: ~45-60 hours of development**

---

## Risks & Mitigation

### Potential Issues

1. **Server Cost Scaling**
   - Risk: More players = higher hosting costs
   - Mitigation: Implement room size limits (8 players max), optimize socket messages

2. **Cheating/Exploits**
   - Risk: Client-side game logic can be manipulated
   - Mitigation: Server-side validation for critical actions (score, collisions)

3. **Latency Issues**
   - Risk: High ping affects collision detection accuracy
   - Mitigation: Client-side prediction, lag compensation, fair hit detection

4. **Scope Creep**
   - Risk: Too many features delay release
   - Mitigation: Start with 1 game mode (tag), iterate based on feedback

---

## Phase 6 Preview (Future)

Once Phase 5 is solid, Phase 6 could include:
- User authentication (login/register)
- Custom rooms with passwords
- Spectator mode
- Mobile device support (touch controls)
- Audio effects and background music
- Advanced graphics (shadows, post-processing)
- Tournament/ranked mode
- In-game friends list
- Replay system

---

## Notes

- **Start Simple**: Implement Tag mode first, get feedback
- **Iterate Fast**: Don't over-engineer, ship and improve
- **Community Feedback**: After manual playtesting, gather user opinions
- **Performance First**: Keep the game running smoothly above all else
- **Fun Factor**: Focus on what makes the game enjoyable, not just technical features
