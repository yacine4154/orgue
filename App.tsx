import React, { useState } from 'react';
import Piano from './components/Piano';
import ControlPanel from './components/ControlPanel';
import { GeneratedMelody } from './types';
import { InstrumentType, ChordModeType } from './utils/constants';

const App: React.FC = () => {
  const [currentMelody, setCurrentMelody] = useState<GeneratedMelody | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState<InstrumentType>('triangle');
  const [chordMode, setChordMode] = useState<ChordModeType>('none');

  const handleMelodyGenerated = (melody: GeneratedMelody) => {
    setCurrentMelody(melody);
    setIsPlaying(true);
  };

  const handlePlaybackFinished = () => {
    setIsPlaying(false);
    setCurrentMelody(null); // Clear after playing so it doesn't loop or stick
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <header className="mb-10 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2 tracking-tight drop-shadow-lg">
          Virtuoso Synth
        </h1>
        <p className="text-gray-400 text-lg">Synthétiseur AZERTY Intelligent</p>
      </header>

      <div className="relative z-10 w-full flex flex-col items-center">
        <Piano 
            melodyToPlay={currentMelody}
            onPlaybackFinished={handlePlaybackFinished}
            instrument={instrument}
            chordMode={chordMode}
        />
        
        <ControlPanel 
            onMelodyGenerated={handleMelodyGenerated}
            isPaying={isPlaying}
            instrument={instrument}
            setInstrument={setInstrument}
            chordMode={chordMode}
            setChordMode={setChordMode}
        />
        
        <div className="mt-8 grid grid-cols-2 gap-8 text-center text-gray-500 text-sm max-w-lg opacity-70 hover:opacity-100 transition-opacity">
            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                <strong className="block text-gray-300 mb-1">Touches Blanches</strong>
                <span className="font-mono text-xs tracking-widest">Q S D F G H J K L M</span>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                <strong className="block text-gray-300 mb-1">Touches Noires</strong>
                <span className="font-mono text-xs tracking-widest">Z E R T Y U I O P</span>
            </div>
        </div>
      </div>

      <footer className="mt-8 text-gray-600 text-xs text-center w-full z-10">
        Web Audio API • Gemini 2.5 Flash • React
      </footer>
    </div>
  );
};

export default App;