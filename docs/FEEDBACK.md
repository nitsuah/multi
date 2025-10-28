# FEEDBACK for darkmoon.dev — Remaining items (pruned)

Completed items removed from this file. Below are the active tasks we still need to track and prioritize.

Short actionable checklist

- Camera & controls
  - Make left-drag rotate camera around the player and update the character's facing direction.
  - Make right-drag enter a sky/free camera without interrupting movement inputs.
  - Ensure mouse dragging does not cancel movement while keys are held.

- UI
  - Keep theme toggle in bottom-left and avoid overlapping chat UI.
  - Connection status: always top-center, non-interactable, half opacity, show "Solo — Offline" when not connected.

- Game behavior
  - Show "Start Tag (Solo Practice)" when players.size === 0 and ensure GameManager accepts solo practice mode.
  - Verify character size and glow are visually appropriate; reduce overlay if needed.

- Tests & CI
  - KeyDisplay labels should be uppercase (W/A/S/D/SHIFT) to satisfy tests.
  - Remove debug-only console.log or guard with import.meta.env.DEV.

If you'd like, I can now:

1. Remove the leftover PRR/TODO files (done).
2. Open small PRs for each remaining task and implement them in priority order (camera controls → UI → game behavior → tests).
3. Run or help run the test suite locally (you need Node.js available in your environment).

Tell me which item you'd like me to pick next (I recommend fixing character rotation/camera behavior first).
