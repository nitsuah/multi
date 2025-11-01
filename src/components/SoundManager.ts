/**
 * SoundManager - Handles all game audio
 * Uses Web Audio API for sound effects and background music
 */

/* eslint-disable no-undef */
class SoundManager {
  private audioContext: AudioContext | null = null;
  private backgroundMusic: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private masterVolume: number = 0.3;
  private musicVolume: number = 0.15;
  private sfxVolume: number = 0.2;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== "undefined") {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      // Check if AudioContext is available (won't be in test environment)
      if (
        typeof window === "undefined" ||
        (!window.AudioContext &&
          !(window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext)
      ) {
        console.log(
          "AudioContext not available, skipping audio initialization"
        );
        return;
      }

      const WindowWithAudio = window as Window & {
        webkitAudioContext?: typeof AudioContext;
      };
      this.audioContext = new (window.AudioContext ||
        WindowWithAudio.webkitAudioContext!)();

      // Create gain nodes for volume control
      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.audioContext.destination);

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.audioContext.destination);

      console.log("SoundManager initialized");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  /**
   * Ensure audio context is running (required after user interaction on some browsers)
   */
  public async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
      console.log("Audio context resumed");
    }
  }

  /**
   * Start background music (ambient procedural music)
   */
  public startBackgroundMusic() {
    if (!this.audioContext || this.isMusicPlaying || this.isMuted) return;

    try {
      this.resumeAudioContext();

      // Create a simple ambient drone using oscillators
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const filter = this.audioContext.createBiquadFilter();

      // Low frequency ambient tones
      osc1.type = "sine";
      osc1.frequency.value = 110; // A2 note
      osc2.type = "sine";
      osc2.frequency.value = 165; // E3 note (perfect fifth)

      // Filter for warmth
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 1;

      // Connect: oscillators -> filter -> gain -> destination
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.musicGain!);

      // Add subtle LFO for movement
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = 0.2; // Slow modulation
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.start();
      osc2.start();
      lfo.start();

      this.backgroundMusic = osc1; // Keep reference for stopping
      this.isMusicPlaying = true;

      console.log("Background music started");
    } catch (error) {
      console.error("Failed to start background music:", error);
    }
  }

  /**
   * Stop background music
   */
  public stopBackgroundMusic() {
    if (this.backgroundMusic && this.audioContext) {
      try {
        this.backgroundMusic.stop();
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        console.log("Background music stopped");
      } catch (error) {
        console.error("Error stopping music:", error);
      }
    }
  }

  /**
   * Play walking sound effect
   */
  public playWalkSound() {
    if (!this.audioContext || this.isMuted) return;

    try {
      this.resumeAudioContext();

      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc.type = "sine";
      osc.frequency.value = 80 + Math.random() * 20; // Random variation

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        this.sfxVolume * 0.3,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.15
      );

      osc.connect(gainNode);
      gainNode.connect(this.sfxGain!);

      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.15);
    } catch {
      // Silently fail for sound effects
    }
  }

  /**
   * Play jump sound effect
   */
  public playJumpSound() {
    if (!this.audioContext || this.isMuted) return;

    try {
      this.resumeAudioContext();

      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        400,
        this.audioContext.currentTime + 0.1
      );

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        this.sfxVolume * 0.5,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.2
      );

      osc.connect(gainNode);
      gainNode.connect(this.sfxGain!);

      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.2);
    } catch {
      // Silently fail
    }
  }

  /**
   * Play landing sound effect
   */
  public playLandSound() {
    if (!this.audioContext || this.isMuted) return;

    try {
      this.resumeAudioContext();

      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        50,
        this.audioContext.currentTime + 0.15
      );

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        this.sfxVolume * 0.6,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.15
      );

      osc.connect(gainNode);
      gainNode.connect(this.sfxGain!);

      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.15);
    } catch {
      // Silently fail
    }
  }

  /**
   * Play tag sound (when player tags another)
   */
  public playTagSound() {
    if (!this.audioContext || this.isMuted) return;

    try {
      this.resumeAudioContext();

      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        880,
        this.audioContext.currentTime + 0.1
      );
      osc.frequency.exponentialRampToValueAtTime(
        440,
        this.audioContext.currentTime + 0.2
      );

      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(
        this.sfxVolume * 0.7,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.3
      );

      osc.connect(gainNode);
      gainNode.connect(this.sfxGain!);

      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.3);
    } catch {
      // Silently fail
    }
  }

  /**
   * Toggle mute
   */
  public toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.sfxGain && this.musicGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume;
      this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume;
    }

    return this.isMuted;
  }

  /**
   * Set master volume (0-1)
   */
  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set music volume (0-1)
   */
  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set SFX volume (0-1)
   */
  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  private updateVolumes() {
    if (this.musicGain && !this.isMuted) {
      this.musicGain.gain.value = this.musicVolume * this.masterVolume;
    }
    if (this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.value = this.sfxVolume * this.masterVolume;
    }
  }

  /**
   * Get mute state
   */
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cleanup
   */
  public dispose() {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

export const getSoundManager = (): SoundManager => {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
};

export default SoundManager;
