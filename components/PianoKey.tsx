import React from 'react';
import { NoteDefinition } from '../types';

interface PianoKeyProps {
  noteData: NoteDefinition;
  isActive: boolean;
  isAIPlaying: boolean;
  onMouseDown: (note: NoteDefinition) => void;
  onMouseUp: (note: NoteDefinition) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ noteData, isActive, isAIPlaying, onMouseDown, onMouseUp }) => {
  const isWhite = noteData.type === 'white';

  // Base classes
  const baseClasses = `
    relative flex flex-col justify-end items-center pb-2 select-none transition-all duration-75 ease-out
    ${isWhite ? 'z-0 w-12 h-48 rounded-b-md' : 'z-10 w-8 h-32 -mx-4 rounded-b-md absolute top-0'}
  `;

  // Visual Styling logic
  let bgClass = '';
  let shadowClass = '';
  let transformClass = isActive ? 'scale-y-[0.98] origin-top' : '';

  if (isWhite) {
    if (isActive) {
      bgClass = 'bg-gray-100 bg-gradient-to-b from-gray-200 to-gray-100';
      shadowClass = 'shadow-key-white-active';
    } else if (isAIPlaying) {
        bgClass = 'bg-blue-100';
        shadowClass = 'shadow-key-white';
    } else {
      bgClass = 'bg-white';
      shadowClass = 'shadow-key-white';
    }
  } else {
    // Black Key
    if (isActive) {
      bgClass = 'bg-gray-800 bg-gradient-to-b from-gray-700 to-black';
      shadowClass = 'shadow-key-black-active';
    } else if (isAIPlaying) {
        bgClass = 'bg-blue-900';
        shadowClass = 'shadow-key-black';
    } else {
      bgClass = 'bg-piano-black bg-gradient-to-b from-gray-800 to-black';
      shadowClass = 'shadow-key-black';
    }
  }

  // Positioning for black keys (manual handling in parent usually, but here we used negative margins for simple overlap flow or absolute)
  // To make the layout simple with Flexbox, we will handle black keys as "overlays" in the parent container logic, OR 
  // we can use a specific structure. 
  // BETTER APPROACH for React + Tailwind:
  // Render White keys as a flex row. Render Black keys absolutely positioned relative to the container, calculated by index.
  // HOWEVER, passing styling down is easier. The parent loop decides structure.
  
  // Actually, let's strictly follow the 'flex' approach where black keys are absolutely positioned within a wrapper or handling it in the main Piano component.
  // For this component, we just render the button. 
  
  return (
    <div
      className={`${baseClasses} ${bgClass} ${shadowClass} ${transformClass}`}
      onMouseDown={() => onMouseDown(noteData)}
      onMouseUp={() => onMouseUp(noteData)}
      onMouseLeave={() => isActive && onMouseUp(noteData)} // Stop if dragging out
      onTouchStart={(e) => { e.preventDefault(); onMouseDown(noteData); }}
      onTouchEnd={(e) => { e.preventDefault(); onMouseUp(noteData); }}
      style={{
        left: !isWhite ? 'auto' : undefined, // Handled by parent for specific absolute pos if needed
      }}
    >
      <span className={`text-xs font-semibold ${isWhite ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
        {noteData.note}
      </span>
      <span className={`text-xs font-bold ${isWhite ? 'text-piano-accent' : 'text-white'} opacity-70`}>
        {noteData.keyboardChar}
      </span>
    </div>
  );
};

export default PianoKey;
