import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, CloudRain, Repeat, Shuffle, Radio } from 'lucide-react';
import { Scene, getInterleavedPlaylist, isBhojpuriSong } from '../data';

interface PlayerProps { scene: Scene | null; }

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; }
}

// 10-bar audio visualizer
const VIZ_BARS = [22, 14, 26, 10, 28, 16, 24, 12, 20, 18];

export default function Player({ scene }: PlayerProps) {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
  const [ambienceVolume, setAmbienceVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isInterleaved, setIsInterleaved] = useState(true);
  const [ytReady, setYtReady] = useState(false);

  const ytPlayerRef = useRef<any>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);
  const lastVideoIdRef = useRef<string | null>(null);
  // Refs to avoid stale closures in YT event handlers
  const handleEndedRef = useRef<() => void>(() => {});
  const nextTrackRef = useRef<() => void>(() => {});

  // Compute active playlist with 2:1 Interleaving Engine when active
  const activePlaylist = useMemo(() => {
    if (!scene?.playlist) return [];
    return isInterleaved ? getInterleavedPlaylist(scene.playlist) : scene.playlist;
  }, [scene?.playlist, isInterleaved]);

  const currentSong = activePlaylist[songIndex] || null;
  const isCurrentBhojpuri = currentSong ? isBhojpuriSong(currentSong) : false;

  // Initialize YouTube API
  useEffect(() => {
    const createPlayer = () => {
      ytPlayerRef.current = new window.YT.Player("youtube-player", {
        width: "0", height: "0",
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onReady: () => setYtReady(true),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) handleEndedRef.current();
            if (event.data === window.YT.PlayerState.PLAYING) {
              setDuration(ytPlayerRef.current.getDuration());
            }
          },
          onError: () => nextTrackRef.current(),
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.getElementsByTagName('script')[0]?.parentNode?.insertBefore(tag, document.getElementsByTagName('script')[0]);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else if (window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, []);

  // When scene changes, reset index and auto-play
  const autoPlayRef = useRef(false);
  useEffect(() => {
    setSongIndex(0);
    setCurrentTime(0);
    setDuration(0);
    if (scene) {
      autoPlayRef.current = true;
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [scene?.id]);

  useEffect(() => {
    if (!scene || !ytReady) return;
    if (isPlaying) {
      ambienceRef.current?.src && ambienceRef.current.play().catch(() => {});
      if (currentSong?.videoId) {
        if (lastVideoIdRef.current !== currentSong.videoId) {
          ytPlayerRef.current.loadVideoById(currentSong.videoId);
          lastVideoIdRef.current = currentSong.videoId;
        } else {
          ytPlayerRef.current.playVideo();
        }
      } else {
        ytPlayerRef.current?.stopVideo();
      }
    } else {
      ambienceRef.current?.pause();
      ytPlayerRef.current?.pauseVideo();
    }
  }, [isPlaying, currentSong?.videoId, scene, ytReady]);

  useEffect(() => {
    if (ytReady && ytPlayerRef.current?.setVolume) ytPlayerRef.current.setVolume(musicVolume * 100);
    if (ambienceRef.current) ambienceRef.current.volume = ambienceVolume;
  }, [musicVolume, ambienceVolume, ytReady]);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        if (ytReady && ytPlayerRef.current?.getCurrentTime) setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }, 1000);
    } else {
      if (progressInterval.current) window.clearInterval(progressInterval.current);
    }
    return () => { if (progressInterval.current) window.clearInterval(progressInterval.current); };
  }, [isPlaying, ytReady]);

  const nextTrack = useCallback(() => {
    if (!activePlaylist || activePlaylist.length === 0) return;
    if (isShuffle) {
      setSongIndex(Math.floor(Math.random() * activePlaylist.length));
    } else {
      setSongIndex(prev => (prev + 1) % activePlaylist.length);
    }
  }, [activePlaylist, isShuffle]);

  const prevTrack = useCallback(() => {
    if (!activePlaylist || activePlaylist.length === 0) return;
    setSongIndex(prev => (prev - 1 + activePlaylist.length) % activePlaylist.length);
  }, [activePlaylist]);

  const handleEnded = useCallback(() => {
    if (isRepeat) {
      ytPlayerRef.current?.seekTo(0);
      ytPlayerRef.current?.playVideo();
    } else {
      nextTrack();
    }
  }, [isRepeat, nextTrack]);

  // Always keep refs up to date
  useEffect(() => { handleEndedRef.current = handleEnded; }, [handleEnded]);
  useEffect(() => { nextTrackRef.current = nextTrack; }, [nextTrack]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (ytReady && ytPlayerRef.current?.seekTo) { ytPlayerRef.current.seekTo(time, true); setCurrentTime(time); }
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVisible = !!(scene && currentSong);

  return (
    <>
      {/* YouTube player div MUST always be in DOM for API to find it */}
      <div style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <div id="youtube-player" />
      </div>

      {/* Player UI — only shown when a scene is active */}
      {isVisible && (
      <div className={`spotify-player scene-player-${scene!.tint}`}>
      <audio ref={ambienceRef} src={scene?.ambienceAudio || undefined} loop preload="auto" />

      {/* Left: Artwork + Track Info */}
      <div className="player-left">
        <div className={`player-artwork-wrap${isPlaying ? ' playing' : ''}`}>
          <img
            src={currentSong.artwork}
            alt="Artwork"
            className={`player-artwork${isPlaying ? ' spin-slow' : ''}`}
          />
          {/* Glowing ring when playing */}
          {isPlaying && <div className="artwork-pulse-ring" />}
        </div>
        <div className="player-track-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4>{currentSong.title}</h4>
            <span className={`genre-pill ${isCurrentBhojpuri ? 'bhojpuri-pill' : 'hindi-pill'}`}>
              {isCurrentBhojpuri ? '🪕 Bhojpuri' : '🎬 Bollywood'}
            </span>
          </div>
          <p>{currentSong.artist} • {currentSong.year}</p>
          {/* Scene label */}
          <span className="player-scene-label">{scene.icon} {scene.hindi}</span>
        </div>
      </div>

      {/* Center: Controls + Progress + Visualizer */}
      <div className="player-center">
        {/* Audio Visualizer */}
        <div className={`audio-visualizer${!isPlaying ? ' paused' : ''}`} aria-hidden="true">
          {VIZ_BARS.map((maxH, i) => (
            <div
              key={i}
              className="viz-bar"
              style={{ '--max-h': `${maxH}px` } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="player-controls">
          <button
            className={`control-btn mode-btn${isInterleaved ? ' active' : ''}`}
            onClick={() => setIsInterleaved(!isInterleaved)}
            title={isInterleaved ? "2:1 Interleaved Radio Mode (2 Hindi : 1 Bhojpuri) Active" : "Sequential Playlist Mode"}
          >
            <Radio size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px' }}>2:1</span>
          </button>
          <button className={`control-btn${isShuffle ? ' active' : ''}`} onClick={() => setIsShuffle(!isShuffle)} title="Shuffle">
            <Shuffle size={16} />
          </button>
          <button className="control-btn" onClick={prevTrack} title="Previous">
            <SkipBack size={20} />
          </button>
          <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn" onClick={nextTrack} title="Next">
            <SkipForward size={20} />
          </button>
          <button className={`control-btn${isRepeat ? ' active' : ''}`} onClick={() => setIsRepeat(!isRepeat)} title="Repeat">
            <Repeat size={16} />
          </button>
        </div>

        <div className="player-progress-bar">
          <span className="time-text">{formatTime(currentTime)}</span>
          <div className="seek-track">
            <div className="seek-fill" style={{ width: `${progressPct}%` }} />
            <input
              type="range" min={0} max={duration || 100} value={currentTime}
              onChange={handleSeek} className="seek-slider"
            />
          </div>
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volumes */}
      <div className="player-right">
        <div className="volume-control">
          <Volume2 size={16} />
          <input type="range" min="0" max="1" step="0.01" value={musicVolume}
            onChange={e => setMusicVolume(Number(e.target.value))} className="volume-slider" />
        </div>
        <div className="volume-control">
          <CloudRain size={16} />
          <input type="range" min="0" max="1" step="0.01" value={ambienceVolume}
            onChange={e => setAmbienceVolume(Number(e.target.value))} className="volume-slider" />
        </div>
      </div>
    </div>
      )}
    </>
  );
}

