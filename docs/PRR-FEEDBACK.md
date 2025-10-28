# PRR FEEDBACK 

src/components/utils.ts
      v.style.textShadow = "1px 1px 2px rgba(0,0,0,0.5)";
      v.style.userSelect = "none";
      v.style.pointerEvents = "none";
      v.textContent = k;
Copilot AI
8 minutes ago
The textContent should display uppercase letters to match test expectations and improve readability. Use k.toUpperCase() instead of k.

Suggested change
      v.textContent = k;
      v.textContent = k.toUpperCase();
Copilot uses AI. Check for mistakes.
@nitsuah	Reply...
src/components/GameManager.ts
    // Update time as 'it' for scoring
    const timeAsIt = now - (this.gameState.roundStartTime || now);
    if (this.gameState.scores[taggerId] !== undefined) {
      this.gameState.scores[taggerId] += Math.max(0, 300 - timeAsIt / 1000); // Points based on how quickly they tagged
Copilot AI
8 minutes ago
The scoring calculation uses timeAsIt which is the total time since round start, not the time the tagger was 'it'. This will give points based on how quickly they tag after the round starts, not how long they were 'it'. Should track individual 'it' duration instead.

Copilot uses AI. Check for mistakes.
@nitsuah	Reply...
server.js

        // Basic profanity filter (simple word replacement)
        const profanityFilter = (text) => {
            const badWords = ['fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard']
Copilot AI
8 minutes ago
Hardcoded profanity list should be moved to a configuration file or environment variable for easier maintenance and customization without code changes.

Copilot uses AI. Check for mistakes.
@nitsuah	Reply...
src/pages/Solo.tsx
    });

    socketClient.on("chat-message", (message: ChatMessage) => {
      setChatMessages((prev) => [...prev.slice(-(MAX_CHAT_MESSAGES - 1)), message]); // Keep last 50 messages
Copilot AI
8 minutes ago
Creating new array on every message with slice operation. Consider using a circular buffer or limiting messages during rendering instead of on every update.

Copilot uses AI. Check for mistakes.


