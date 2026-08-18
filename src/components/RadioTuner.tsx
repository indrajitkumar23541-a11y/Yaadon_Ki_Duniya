import { useState } from 'react';
import { Radio as RadioIcon, Volume2 } from 'lucide-react';
import { Scene, scenes } from '../data';
import { playRadioStatic } from '../utils/soundEffects';

interface RadioTunerProps {
  currentScene: Scene | null;
  onSelectScene: (scene: Scene) => void;
}

const FREQUENCIES = [
  { freq: '88.5 FM', sceneId: 'bus-ka-safar', label: '🚌 Bus Safar' },
  { freq: '92.7 FM', sceneId: 'desi-salon', label: '✂️ Desi Salon' },
  { freq: '98.3 FM', sceneId: 'chai-tapri', label: '☕ Chai Tapri' },
  { freq: '101.2 FM', sceneId: 'railway-station', label: '🚂 Railway' },
  { freq: '104.5 FM', sceneId: 'mohalle-ki-shaam', label: '🌇 Mohalla' },
  { freq: '107.9 FM', sceneId: 'purana-radio', label: '📻 Radio Gold' },
];

export default function RadioTuner({ currentScene, onSelectScene }: RadioTunerProps) {
  const [tuning, setTuning] = useState(false);

  const handleTune = (sceneId: string) => {
    const s = scenes.find(x => x.id === sceneId);
    if (!s) return;
    setTuning(true);
    playRadioStatic();
    onSelectScene(s);
    setTimeout(() => setTuning(false), 400);
  };

  const activeFreq = FREQUENCIES.find(f => f.sceneId === currentScene?.id) || FREQUENCIES[0];

  return (
    <div className={`vintage-radio-tuner ${tuning ? 'tuning-active' : ''}`}>
      <div className="tuner-header">
        <div className="tuner-brand">
          <RadioIcon size={18} className="tuner-icon" />
          <span>YAADON MW / FM TUNER</span>
        </div>
        <div className="tuner-led">
          <span className="led-dot" />
          <span className="led-text">{activeFreq.freq} • LOCKED</span>
        </div>
      </div>

      {/* Analog Frequency Needle Display */}
      <div className="tuner-dial-display">
        <div className="frequency-lines">
          {FREQUENCIES.map((f) => {
            const isActive = f.sceneId === currentScene?.id;
            return (
              <button
                key={f.freq}
                className={`freq-tick ${isActive ? 'active' : ''}`}
                onClick={() => handleTune(f.sceneId)}
                title={`Tune to ${f.label}`}
              >
                <div className="tick-line" />
                <span className="freq-num">{f.freq}</span>
                <span className="freq-name">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tuning Needle */}
        <div
          className="tuner-needle"
          style={{
            left: `${((FREQUENCIES.findIndex(f => f.sceneId === currentScene?.id) + 0.5) / FREQUENCIES.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
