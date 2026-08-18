import { playBusHorn, playScissorsSnip, playChaiPouring, playTrainWhistle, playRadioStatic } from '../utils/soundEffects';
import { Volume2 } from 'lucide-react';

export default function SoundBoard() {
  return (
    <div className="retro-soundboard">
      <div className="soundboard-title">
        <Volume2 size={15} />
        <span>DESI RETRO SOUND FX BOARD</span>
      </div>
      <div className="soundboard-buttons">
        <button className="fx-btn" onClick={playBusHorn} title="Play Bus Horn">
          🎺 Bus Horn
        </button>
        <button className="fx-btn" onClick={playScissorsSnip} title="Play Scissors Snip">
          ✂️ Salon Scissors
        </button>
        <button className="fx-btn" onClick={playChaiPouring} title="Play Kettle Chai Pouring">
          🫖 Kulhad Chai
        </button>
        <button className="fx-btn" onClick={playTrainWhistle} title="Play Train Whistle">
          🚂 Train Whistle
        </button>
        <button className="fx-btn" onClick={playRadioStatic} title="Play FM Static Sweep">
          📻 Radio Tuning
        </button>
      </div>
    </div>
  );
}
