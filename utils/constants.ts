import { NoteDefinition } from '../types';

// Frequencies for the 4th and 5th octaves
const FREQ = {
  C4: 261.63,
  Cs4: 277.18,
  D4: 293.66,
  Ds4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Fs4: 369.99,
  G4: 392.00,
  Gs4: 415.30,
  A4: 440.00,
  As4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  Ds5: 622.25,
  E5: 659.25,
  F5: 698.46,
};

// Mappings for AZERTY keyboard
// Row 1 (Home): Q S D F G H J K L M -> White Keys
// Row 2 (Top): Z E R T Y U I O P -> Black Keys

export const PIANO_KEYS: NoteDefinition[] = [
  { note: 'C4', frequency: FREQ.C4, type: 'white', keyboardChar: 'Q', keyCode: 'KeyQ' },
  { note: 'C#4', frequency: FREQ.Cs4, type: 'black', keyboardChar: 'Z', keyCode: 'KeyZ' },
  { note: 'D4', frequency: FREQ.D4, type: 'white', keyboardChar: 'S', keyCode: 'KeyS' },
  { note: 'D#4', frequency: FREQ.Ds4, type: 'black', keyboardChar: 'E', keyCode: 'KeyE' },
  { note: 'E4', frequency: FREQ.E4, type: 'white', keyboardChar: 'D', keyCode: 'KeyD' },
  { note: 'F4', frequency: FREQ.F4, type: 'white', keyboardChar: 'F', keyCode: 'KeyF' },
  { note: 'F#4', frequency: FREQ.Fs4, type: 'black', keyboardChar: 'T', keyCode: 'KeyT' },
  { note: 'G4', frequency: FREQ.G4, type: 'white', keyboardChar: 'G', keyCode: 'KeyG' },
  { note: 'G#4', frequency: FREQ.Gs4, type: 'black', keyboardChar: 'Y', keyCode: 'KeyY' },
  { note: 'A4', frequency: FREQ.A4, type: 'white', keyboardChar: 'H', keyCode: 'KeyH' },
  { note: 'A#4', frequency: FREQ.As4, type: 'black', keyboardChar: 'U', keyCode: 'KeyU' },
  { note: 'B4', frequency: FREQ.B4, type: 'white', keyboardChar: 'J', keyCode: 'KeyJ' },
  { note: 'C5', frequency: FREQ.C5, type: 'white', keyboardChar: 'K', keyCode: 'KeyK' },
  { note: 'C#5', frequency: FREQ.Cs5, type: 'black', keyboardChar: 'O', keyCode: 'KeyO' },
  { note: 'D5', frequency: FREQ.D5, type: 'white', keyboardChar: 'L', keyCode: 'KeyL' },
  { note: 'D#5', frequency: FREQ.Ds5, type: 'black', keyboardChar: 'P', keyCode: 'KeyP' },
  { note: 'E5', frequency: FREQ.E5, type: 'white', keyboardChar: 'M', keyCode: 'KeyM' },
];

export type InstrumentType = 'triangle' | 'sine' | 'square' | 'sawtooth';

export const INSTRUMENTS: { id: InstrumentType; name: string; desc: string }[] = [
  { id: 'triangle', name: 'Piano Doux', desc: 'Onde triangulaire classique' },
  { id: 'sine', name: 'Sub Pure', desc: 'Onde sinusoïdale pure' },
  { id: 'square', name: 'Retro Game', desc: 'Onde carrée 8-bit' },
  { id: 'sawtooth', name: 'Super Saw', desc: 'Onde en dents de scie agressive' },
];

export type ChordModeType = 'none' | 'major' | 'minor' | 'power' | 'diminished';

// Offsets in semitones relative to root
export const CHORD_MODES: { id: ChordModeType; name: string; offsets: number[] }[] = [
  { id: 'none', name: 'Note seule', offsets: [0] },
  { id: 'major', name: 'Accord Majeur', offsets: [0, 4, 7] }, // Root, Major 3rd, Perfect 5th
  { id: 'minor', name: 'Accord Mineur', offsets: [0, 3, 7] }, // Root, Minor 3rd, Perfect 5th
  { id: 'power', name: 'Power Chord', offsets: [0, 7] }, // Root, Perfect 5th
  { id: 'diminished', name: 'Diminué', offsets: [0, 3, 6] }, // Root, Minor 3rd, Diminished 5th
];