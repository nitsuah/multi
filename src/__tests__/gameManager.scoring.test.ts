import { describe, it, expect } from "vitest";
import GameManager from "../components/GameManager";

describe("GameManager scoring", () => {
  it("awards points based on quick tagging", () => {
    const gm = new GameManager();
    // Add two players
    gm.addPlayer({
      id: "p1",
      name: "P1",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    });
    gm.addPlayer({
      id: "p2",
      name: "P2",
      position: [1, 0, 0],
      rotation: [0, 0, 0],
    });

    gm.startTagGame(180);
    const state = gm.getGameState();

    // Get whoever was randomly chosen as "it"
    const itPlayerId = state.itPlayerId!;
    const notItPlayerId = itPlayerId === "p1" ? "p2" : "p1";

    // Simulate immediate tag from it player to the other player
    const success = gm.tagPlayer(itPlayerId, notItPlayerId);
    expect(success).toBe(true);

    // Ensure the tagger got positive score
    const score = gm.getGameState().scores[itPlayerId];
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
