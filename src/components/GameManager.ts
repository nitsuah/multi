export type GameMode = "none" | "tag" | "collectible" | "race";

export interface GameState {
  mode: GameMode;
  isActive: boolean;
  timeRemaining: number;
  scores: { [playerId: string]: number };
  itPlayerId?: string; // For tag mode
  roundStartTime?: number;
}

export interface TagGameState extends GameState {
  mode: "tag";
  itPlayerId: string;
  tagHistory: { playerId: string; timestamp: number; timeAsIt: number }[];
}

export interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isIt?: boolean;
  timeAsIt?: number;
  lastTagTime?: number;
}

export class GameManager {
  private gameState: GameState;
  private players: Map<string, Player>;
  private callbacks: {
    onGameStateUpdate?: (state: GameState) => void;
    onPlayerUpdate?: (players: Map<string, Player>) => void;
  };

  constructor() {
    this.gameState = {
      mode: "none",
      isActive: false,
      timeRemaining: 0,
      scores: {},
    };
    this.players = new Map();
    this.callbacks = {};
  }

  setCallbacks(callbacks: {
    onGameStateUpdate?: (state: GameState) => void;
    onPlayerUpdate?: (players: Map<string, Player>) => void;
  }) {
    this.callbacks = callbacks;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
    this.callbacks.onPlayerUpdate?.(this.players);
  }

  removePlayer(playerId: string) {
    this.players.delete(playerId);

    // If the 'it' player left during tag game, pick a new 'it'
    if (
      this.gameState.mode === "tag" &&
      this.gameState.itPlayerId === playerId
    ) {
      this.pickNewItPlayer();
    }

    this.callbacks.onPlayerUpdate?.(this.players);
  }

  updatePlayer(playerId: string, updates: Partial<Player>) {
    const player = this.players.get(playerId);
    if (player) {
      Object.assign(player, updates);
      this.callbacks.onPlayerUpdate?.(this.players);
    }
  }

  startTagGame(duration: number = 180) {
    // 3 minutes default
    if (this.players.size < 2) {
      console.log("Need at least 2 players to start tag game");
      return false;
    }

    this.gameState = {
      mode: "tag",
      isActive: true,
      timeRemaining: duration,
      scores: {},
      itPlayerId: this.pickRandomPlayer(),
      roundStartTime: Date.now(),
    };

    // Initialize scores and reset player states
    this.players.forEach((player, id) => {
      this.gameState.scores[id] = 0;
      player.isIt = id === this.gameState.itPlayerId;
      player.timeAsIt = 0;
      player.lastTagTime = undefined;
    });

    this.callbacks.onGameStateUpdate?.(this.gameState);
    this.callbacks.onPlayerUpdate?.(this.players);

    console.log(
      `Tag game started! ${
        this.players.get(this.gameState.itPlayerId!)?.name
      } is IT!`
    );
    return true;
  }

  tagPlayer(taggerId: string, taggedId: string): boolean {
    if (this.gameState.mode !== "tag" || !this.gameState.isActive) {
      return false;
    }

    const tagger = this.players.get(taggerId);
    const tagged = this.players.get(taggedId);

    if (!tagger || !tagged || !tagger.isIt || tagged.isIt) {
      return false;
    }

    // Check if enough time has passed since last tag (prevent spam)
    const now = Date.now();
    if (tagger.lastTagTime && now - tagger.lastTagTime < 2000) {
      // 2 second cooldown
      return false;
    }

    // Update time as 'it' for scoring
    const timeAsIt = now - (this.gameState.roundStartTime || now);
    if (this.gameState.scores[taggerId] !== undefined) {
      this.gameState.scores[taggerId] += Math.max(0, 300 - timeAsIt / 1000); // Points based on how quickly they tagged
    }

    // Transfer 'it' status
    tagger.isIt = false;
    tagger.lastTagTime = now;
    tagged.isIt = true;
    tagged.lastTagTime = now;

    this.gameState.itPlayerId = taggedId;
    this.gameState.roundStartTime = now;

    this.callbacks.onGameStateUpdate?.(this.gameState);
    this.callbacks.onPlayerUpdate?.(this.players);

    console.log(
      `${tagger.name} tagged ${tagged.name}! ${tagged.name} is now IT!`
    );
    return true;
  }

  updateGameTimer(deltaTime: number) {
    if (!this.gameState.isActive) return;

    this.gameState.timeRemaining -= deltaTime;

    if (this.gameState.timeRemaining <= 0) {
      this.endGame();
    } else {
      this.callbacks.onGameStateUpdate?.(this.gameState);
    }
  }

  endGame() {
    this.gameState.isActive = false;
    this.gameState.timeRemaining = 0;

    // Calculate final scores
    const results = Array.from(this.players.entries())
      .map(([id, player]) => ({
        id,
        name: player.name,
        score: this.gameState.scores[id] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    console.log("Game ended! Final scores:", results);

    // Reset player states
    this.players.forEach((player) => {
      player.isIt = false;
      player.timeAsIt = 0;
      player.lastTagTime = undefined;
    });

    this.callbacks.onGameStateUpdate?.(this.gameState);
    this.callbacks.onPlayerUpdate?.(this.players);

    return results;
  }

  private pickRandomPlayer(): string {
    const playerIds = Array.from(this.players.keys());
    return playerIds[Math.floor(Math.random() * playerIds.length)];
  }

  private pickNewItPlayer() {
    if (this.players.size === 0) return;

    const newItId = this.pickRandomPlayer();
    this.gameState.itPlayerId = newItId;

    this.players.forEach((player, id) => {
      player.isIt = id === newItId;
    });

    this.callbacks.onGameStateUpdate?.(this.gameState);
    this.callbacks.onPlayerUpdate?.(this.players);
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getPlayers(): Map<string, Player> {
    return this.players;
  }
}

export default GameManager;
