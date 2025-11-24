import React, { useEffect, useState, useCallback } from 'react';
import { PIANO_KEYS, InstrumentType, ChordModeType, CHORD_MODES } from '../utils/constants';
import { audioEngine } from '../utils/audio';
import PianoKey from './PianoKey';
import { NoteDefinition, GeneratedMelody } from '../types';

interface PianoProps {
  melodyToPlay: GeneratedMelody | null;
  onPlaybackFinished: () => void;
  instrument: InstrumentType;
  chordMode: ChordModeType;
}

const Piano: React.FC<PianoProps> = ({ melodyToPlay, onPlaybackFinished, instrument, chordMode }) => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [aiActiveNote, setAiActiveNote] = useState<string | null>(null);

  // Helper to get chord offsets based on current mode
  const getChordOffsets = useCallback(() => {
    return CHORD_MODES.find(m => m.id === chordMode)?.offsets || [0];
  }, [chordMode]);

  const startNote = useCallback((note: NoteDefinition) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.add(note.note);
      return newSet;
    });

    // Play all notes in the chord
    const offsets = getChordOffsets();
    offsets.forEach((semitoneOffset, index) => {
        // Calculate frequency: f = f0 * (2 ^ (n/12))
        const chordFreq = note.frequency * Math.pow(2, semitoneOffset / 12);
        // We append the index to the ID to allow stopping specific harmonic voices later
        audioEngine.playTone(chordFreq, `${note.note}_${index}`, instrument);
    });
  }, [getChordOffsets, instrument]);

  const stopNote = useCallback((note: NoteDefinition) => {
    setActiveNotes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note.note);
      return newSet;
    });

    // Stop all notes in the chord
    const offsets = getChordOffsets();
    offsets.forEach((_, index) => {
        audioEngine.stopTone(`${note.note}_${index}`);
    });
  }, [getChordOffsets]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // Map key code to note
      // Try to find by code first (position), then by char (fallback)
      const note = PIANO_KEYS.find(k => k.keyCode === e.code) || 
                   PIANO_KEYS.find(k => k.keyboardChar.toLowerCase() === e.key.toLowerCase());
      
      if (note) {
        startNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = PIANO_KEYS.find(k => k.keyCode === e.code) || 
                   PIANO_KEYS.find(k => k.keyboardChar.toLowerCase() === e.key.toLowerCase());
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startNote, stopNote]);

  // AI Melody Playback Effect
  useEffect(() => {
    if (!melodyToPlay) return;

    let cancelled = false;

    const playMelody = async () => {
      for (const noteInfo of melodyToPlay.notes) {
        if (cancelled) break;

        // Find note definition
        const def = PIANO_KEYS.find(k => k.note === noteInfo.note);
        if (def) {
          setAiActiveNote(def.note);
          // AI always plays single notes (root only), overriding chord mode for melody clarity
          audioEngine.playTone(def.frequency, `${def.note}_0`, instrument);
          
          const duration = noteInfo.duration || 500;
          
          await new Promise(r => setTimeout(r, duration));
          
          audioEngine.stopTone(`${def.note}_0`);
          setAiActiveNote(null);
          
          // Tiny gap between notes
          await new Promise(r => setTimeout(r, 50));
        }
      }
      if (!cancelled) onPlaybackFinished();
    };

    playMelody();

    return () => {
      cancelled = true;
      setAiActiveNote(null);
      // Stop all sounds potentially playing. We broadly stop the root indices.
      PIANO_KEYS.forEach(k => audioEngine.stopTone(`${k.note}_0`));
    };
  }, [melodyToPlay, onPlaybackFinished, instrument]);


  // Rendering Logic:
  const whiteKeys = PIANO_KEYS.filter(k => k.type === 'white');
  const blackKeys = PIANO_KEYS.filter(k => k.type === 'black');

  // Helper to find black key that sits between this white key and the next
  const getBlackKeyAfter = (whiteKeyNote: string) => {
    const noteMap: {[key: string]: string} = {
      'C4': 'C#4', 'D4': 'D#4', 'F4': 'F#4', 'G4': 'G#4', 'A4': 'A#4',
      'C5': 'C#5', 'D5': 'D#5'
    };
    const target = noteMap[whiteKeyNote];
    return blackKeys.find(k => k.note === target);
  };

  return (
    <div className="relative inline-flex h-52 bg-piano-dark p-4 rounded-lg shadow-2xl border-t-8 border-piano-black">
      {/* Decorative red felt strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-red-900 opacity-50 pointer-events-none" />

      {whiteKeys.map((whiteKey) => {
        const blackKey = getBlackKeyAfter(whiteKey.note);

        return (
          <div key={whiteKey.note} className="relative flex">
             <PianoKey 
                noteData={whiteKey} 
                isActive={activeNotes.has(whiteKey.note)}
                isAIPlaying={aiActiveNote === whiteKey.note}
                onMouseDown={startNote}
                onMouseUp={stopNote}
             />
             
             {blackKey && (
               <div className="absolute left-2/3 w-8 z-10 pointer-events-none"> 
                  <div className="pointer-events-auto -ml-4">
                     <PianoKey 
                        noteData={blackKey} 
                        isActive={activeNotes.has(blackKey.note)}
                        isAIPlaying={aiActiveNote === blackKey.note}
                        onMouseDown={startNote}
                        onMouseUp={stopNote}
                     />
                  </div>
               </div>
             )}
          </div>
        );
      })}
    </div>
  );
};

export default Piano;