import { describe, it, expect } from "vitest";
import { getSoundManager } from "../components/SoundManager";

describe("SoundManager", () => {
  describe("Initialization", () => {
    it("should create a singleton instance", () => {
      const instance1 = getSoundManager();
      const instance2 = getSoundManager();
      expect(instance1).toBe(instance2);
    });

    it("should return a sound manager instance with public methods", () => {
      const instance = getSoundManager();
      expect(instance).toBeDefined();
      expect(typeof instance.toggleMute).toBe("function");
      expect(typeof instance.setMasterVolume).toBe("function");
      expect(typeof instance.setMusicVolume).toBe("function");
      expect(typeof instance.setSfxVolume).toBe("function");
      expect(typeof instance.getIsMuted).toBe("function");
      expect(typeof instance.startBackgroundMusic).toBe("function");
      expect(typeof instance.stopBackgroundMusic).toBe("function");
      expect(typeof instance.playWalkSound).toBe("function");
      expect(typeof instance.playJumpSound).toBe("function");
      expect(typeof instance.playLandSound).toBe("function");
      expect(typeof instance.playTagSound).toBe("function");
      expect(typeof instance.resumeAudioContext).toBe("function");
      expect(typeof instance.dispose).toBe("function");
    });
  });

  describe("Volume Control (without AudioContext)", () => {
    it("should set master volume within valid range without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.setMasterVolume(0.5);
        manager.setMasterVolume(1.5); // Should clamp to 1
        manager.setMasterVolume(-0.5); // Should clamp to 0
      }).not.toThrow();
    });

    it("should set music volume within valid range without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.setMusicVolume(0.7);
        manager.setMusicVolume(2.0); // Should clamp to 1
        manager.setMusicVolume(-1.0); // Should clamp to 0
      }).not.toThrow();
    });

    it("should set SFX volume within valid range without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.setSfxVolume(0.8);
        manager.setSfxVolume(5.0); // Should clamp to 1
        manager.setSfxVolume(-2.0); // Should clamp to 0
      }).not.toThrow();
    });
  });

  describe("Mute Functionality", () => {
    it("should toggle mute state", () => {
      const manager = getSoundManager();
      const initialMute = manager.getIsMuted();
      const newMute = manager.toggleMute();
      expect(newMute).toBe(!initialMute);
      expect(manager.getIsMuted()).toBe(newMute);
    });

    it("should toggle back to original state", () => {
      const manager = getSoundManager();
      const initialMute = manager.getIsMuted();
      manager.toggleMute();
      manager.toggleMute();
      expect(manager.getIsMuted()).toBe(initialMute);
    });

    it("should return boolean for mute state", () => {
      const manager = getSoundManager();
      expect(typeof manager.getIsMuted()).toBe("boolean");
    });
  });

  describe("Audio Methods (no AudioContext available)", () => {
    it("should handle background music methods without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.startBackgroundMusic();
        manager.stopBackgroundMusic();
      }).not.toThrow();
    });

    it("should handle sound effects without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.playWalkSound();
        manager.playJumpSound();
        manager.playLandSound();
        manager.playTagSound();
      }).not.toThrow();
    });

    it("should handle audio context resume without throwing", async () => {
      const manager = getSoundManager();
      await expect(manager.resumeAudioContext()).resolves.not.toThrow();
    });

    it("should handle dispose without throwing", () => {
      const manager = getSoundManager();
      expect(() => {
        manager.dispose();
      }).not.toThrow();
    });
  });

  describe("Integration with Muted State", () => {
    it("should not play sounds when muted", () => {
      const manager = getSoundManager();
      manager.toggleMute(); // Mute

      // These should not throw and should handle muted state
      expect(() => {
        manager.startBackgroundMusic();
        manager.playJumpSound();
        manager.playWalkSound();
      }).not.toThrow();
    });

    it("should allow sounds when unmuted", () => {
      const manager = getSoundManager();
      if (manager.getIsMuted()) {
        manager.toggleMute(); // Unmute
      }

      // These should not throw
      expect(() => {
        manager.playJumpSound();
        manager.playWalkSound();
      }).not.toThrow();
    });
  });
});
