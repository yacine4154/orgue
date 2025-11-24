export interface NoteDefinition {
  note: string;
  frequency: number;
  type: 'white' | 'black';
  keyboardChar: string; // The char to display (e.g. 'Q')
  keyCode: string; // The event.code (e.g., 'KeyQ')
}

export interface MelodyNote {
  note: string;
  duration?: number; // Duration in ms
}

export interface GeneratedMelody {
  title: string;
  description: string;
  notes: MelodyNote[];
}
