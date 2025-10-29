# Darkmoon TODO - Remaining Work

## Phase 5 Status: Partially Complete ✓

### ✅ Completed in Current PR

- [x] Basic tag game mode with collision detection
- [x] Chat system with profanity filter (server-side, env configurable)
- [x] Camera controls (left-drag player-facing, right-drag skycam)
- [x] Solo practice mode
- [x] Scoring system with constants
- [x] GameManager state management
- [x] Test coverage for core systems
- [x] CI/CD pipeline green

### 🚧 Phase 5 Still TODO

#### Game Modes & Features

- [ ] Collectible Hunt Mode
  - Spawn glowing orbs/coins randomly
  - First to X wins
  - Respawn logic with delays
- [ ] Race Mode
  - Checkpoint/gate system
  - Lap counter
  - Best time tracking
- [ ] Emotes/Quick Actions (1-5 keys)
  - Animation triggers
  - Particle effects
  - Cooldown system

#### Progression & UI

- [ ] Player Profiles
  - Username system
  - Stats tracking (wins, games played, time)
  - Avatar customization
- [ ] Scoreboard/Leaderboard
  - In-game scoreboard (Tab key)
  - Session leaderboard
  - Global rankings
- [ ] Achievements/Unlockables
  - Character colors
  - Particle effects/trails
  - Badge system

#### Map & Environment

- [ ] Multiple map layouts (3-5 maps)
- [ ] Map voting system
- [ ] Dynamic elements
  - Day/night cycle
  - Weather effects
  - Moving platforms
- [ ] Minimap in corner

#### Power-Ups

- [ ] Speed Boost
- [ ] Invisibility
- [ ] Shield
- [ ] Teleport

#### Polish & Performance

- [ ] Socket message throttling for chat
- [ ] Particle effect pooling
- [ ] LOD (Level of Detail) for distant players
- [ ] Memory management improvements

---

## Phase 6 Preview (Future)

- User authentication (login/register)
- Custom rooms with passwords
- Spectator mode
- Mobile support (touch controls)
- Audio effects and music
- Advanced graphics (shadows, post-processing)
- Tournament/ranked mode
- Friends list
- Replay system

---

## Immediate Next Steps

1. Test current build for any runtime errors
2. Address any PR review comments
3. Merge Phase 5 PR
4. Pick next feature from Phase 5 TODO (suggest: Collectible Hunt mode)

---

## Known Issues / Tech Debt

- [ ] Server-side validation for collision/tagging (prevent client cheating)
- [ ] Rate limiting for chat/emotes
- [ ] Consider Redis for multi-server session management
- [ ] Add lag compensation for high-ping scenarios
- [ ] Optimize Three.js instance warnings in tests

---

## Notes

- Keep this file updated as features are completed
- Move completed items to CHANGELOG.md
- Use this as scratch space for ideas and quick todos
