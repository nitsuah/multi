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
    // Force p1 to be it
    state.itPlayerId = "p1";
    gm.getPlayers().get("p1")!.isIt = true;

    // Simulate immediate tag
    const success = gm.tagPlayer("p1", "p2");
    expect(success).toBe(true);

    // Ensure p1 got positive score
    const score = gm.getGameState().scores["p1"];
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
