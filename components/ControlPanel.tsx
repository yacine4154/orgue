import React, { useState } from 'react';
import { generateMelody } from '../services/geminiService';
import { GeneratedMelody } from '../types';
import { InstrumentType, ChordModeType, INSTRUMENTS, CHORD_MODES } from '../utils/constants';

// Icons
const IconSparkles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6 20.25a.75.75 0 01.75.75v.008c0 .414-.336.75-.75.75h-.008a.75.75 0 01-.75-.75V21c0-.414.336-.75.75-.75H6zm13.5 0a.75.75 0 01.75.75v.008c0 .414-.336.75-.75.75h-.008a.75.75 0 01-.75-.75V21c0-.414.336-.75.75-.75h.008z" clipRule="evenodd" />
  </svg>
);

const IconMusic = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V9.017c0-.428.267-.815.663-.962l10-2.857a.75.75 0 01.963.453z" clipRule="evenodd" />
</svg>
)

const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.922-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </svg>
)

interface ControlPanelProps {
  onMelodyGenerated: (melody: GeneratedMelody) => void;
  isPaying: boolean;
  instrument: InstrumentType;
  setInstrument: (i: InstrumentType) => void;
  chordMode: ChordModeType;
  setChordMode: (m: ChordModeType) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    onMelodyGenerated, isPaying, instrument, setInstrument, chordMode, setChordMode 
}) => {
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('Happy');
  const [melodyInfo, setMelodyInfo] = useState<{title: string, desc: string} | null>(null);

  const moods = ['Joyeux', 'Mélancolique', 'Mystérieux', 'Énergique', 'Jazz', 'Synthwave'];

  const handleGenerate = async () => {
    setLoading(true);
    setMelodyInfo(null);
    const melody = await generateMelody(mood);
    setLoading(false);
    
    if (melody) {
      setMelodyInfo({ title: melody.title, desc: melody.description });
      onMelodyGenerated(melody);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8 flex flex-col gap-6">
        {/* Synth Controls */}
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
            {/* Instrument Selector */}
            <div>
                <h3 className="text-white font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-blue-400">
                    <IconSettings /> Instrument
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {INSTRUMENTS.map((inst) => (
                        <button
                            key={inst.id}
                            onClick={() => setInstrument(inst.id)}
                            className={`p-3 rounded-lg text-left transition-all border ${
                                instrument === inst.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                        >
                            <div className="font-semibold text-sm">{inst.name}</div>
                            <div className="text-xs opacity-70 truncate">{inst.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chord Mode Selector */}
            <div>
                <h3 className="text-white font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-purple-400">
                    <IconMusic /> Mode Accords
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CHORD_MODES.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setChordMode(mode.id)}
                            className={`p-2 rounded-lg text-sm transition-all border ${
                                chordMode === mode.id 
                                ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                        >
                            {mode.name}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                    Astuce: Appuyez sur une seule touche pour jouer un accord complet.
                </p>
            </div>
        </div>

        {/* AI Composer */}
        <div className="bg-piano-dark/50 backdrop-blur-md border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                    <IconSparkles />
                    Compositeur IA
                </h3>
                <p className="text-gray-400 text-sm">
                    Générez une boucle mélodique avec Gemini.
                </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                        value={mood} 
                        onChange={(e) => setMood(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 flex-1 md:flex-none"
                    >
                        {moods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || isPaying}
                        className={`
                            flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all min-w-[120px]
                            ${loading 
                                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25'
                            }
                        `}
                    >
                        {loading ? '...' : 'Générer'}
                    </button>
                </div>
            </div>

            {melodyInfo && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/5 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
                            <IconMusic />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{melodyInfo.title}</h4>
                            <p className="text-sm text-gray-400">{melodyInfo.desc}</p>
                        </div>
                    </div>
                    {isPaying && <p className="text-xs text-blue-400 mt-2 font-medium animate-pulse">Lecture en cours...</p>}
                </div>
            )}
        </div>
    </div>
  );
};

export default ControlPanel;