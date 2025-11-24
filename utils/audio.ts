import { InstrumentType } from './constants';

// Simple Polyphonic Synth Engine
class AudioEngine {
  private context: AudioContext | null = null;
  private activeOscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public playTone(frequency: number, noteId: string, type: InstrumentType = 'triangle') {
    this.init();
    if (!this.context) return;

    // If note is already playing, stop it first to re-trigger
    if (this.activeOscillators.has(noteId)) {
      this.stopTone(noteId);
    }

    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    // Sound Design based on Instrument Type
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.context.currentTime);

    // Filter configuration based on type
    if (type === 'sawtooth' || type === 'square') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, this.context.currentTime); // Brighter
        filter.Q.value = 2; // Add some resonance for synth feel
    } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, this.context.currentTime); // Softer
    }

    // Envelope (ADSR ish)
    const now = this.context.currentTime;
    
    // Adjust volume based on wave type (Saw/Square are naturally louder)
    const maxGain = (type === 'sawtooth' || type === 'square') ? 0.3 : 0.6;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxGain, now + 0.02); // Attack
    gainNode.gain.exponentialRampToValueAtTime(maxGain * 0.7, now + 0.5); // Decay/Sustain level

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);

    osc.start();

    this.activeOscillators.set(noteId, { osc, gain: gainNode });
  }

  public stopTone(noteId: string) {
    if (!this.context) return;
    const active = this.activeOscillators.get(noteId);
    
    if (active) {
      const { osc, gain } = active;
      const now = this.context.currentTime;
      
      // Release phase
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // Quick fade out

      osc.stop(now + 0.21);
      
      // Cleanup map immediately so UI can update, though sound lingers slightly
      this.activeOscillators.delete(noteId);
      
      // Garbage collection helper for the audio nodes (disconnect after stop)
      setTimeout(() => {
        osc.disconnect();
        gain.disconnect();
      }, 250);
    }
  }
}

export const audioEngine = new AudioEngine();