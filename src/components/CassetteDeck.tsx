import { Song } from '../data';

interface CassetteDeckProps {
  currentSong: Song | null;
  isPlaying: boolean;
}

export default function CassetteDeck({ currentSong, isPlaying }: CassetteDeckProps) {
  if (!currentSong) return null;

  return (
    <div className={`cassette-deck-card ${isPlaying ? 'tape-spinning' : ''}`}>
      <div className="cassette-body">
        {/* Cassette Header Label */}
        <div className="cassette-label-header">
          <span className="cassette-brand">TDK • HIGH POSITION</span>
          <span className="cassette-side">SIDE A • 90 MIN</span>
        </div>

        {/* Cassette Center Window with Spools */}
        <div className="cassette-window">
          {/* Left Reel */}
          <div className={`spool spool-left ${isPlaying ? 'spin-clock' : ''}`}>
            <div className="spool-teeth" />
            <div className="spool-center" />
          </div>

          {/* Tape Magnetic Ribbon */}
          <div className="tape-ribbon">
            <div className="tape-window-center">
              <span className="track-running-title">{currentSong.title}</span>
              <span className="track-running-artist">{currentSong.artist}</span>
            </div>
          </div>

          {/* Right Reel */}
          <div className={`spool spool-right ${isPlaying ? 'spin-clock' : ''}`}>
            <div className="spool-teeth" />
            <div className="spool-center" />
          </div>
        </div>

        {/* Cassette Bottom Screws & Tape Head */}
        <div className="cassette-bottom">
          <div className="screw screw-l" />
          <div className="head-gap">
            <span className="stereo-badge">★ RETRO STEREO AUDIO ★</span>
          </div>
          <div className="screw screw-r" />
        </div>
      </div>
    </div>
  );
}
