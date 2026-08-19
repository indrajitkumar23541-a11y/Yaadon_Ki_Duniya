import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, CloudRain, Repeat, Shuffle, Radio, Maximize2, Minimize2, FileText, Music, ChevronDown, X } from 'lucide-react';
import { Scene, getInterleavedPlaylist, isBhojpuriSong, getSongLyrics, getSyncedLyrics } from '../data';
import CassetteDeck from './CassetteDeck';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const ytPlayerRef = useRef<any>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);
  const lastVideoIdRef = useRef<string | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Synced Live Karaoke Lyrics
  const syncedLyrics = useMemo(() => getSyncedLyrics(currentSong, duration), [currentSong, duration]);

  const activeLyricIndex = useMemo(() => {
    let activeIdx = 0;
    for (let i = 0; i < syncedLyrics.length; i++) {
      if (currentTime >= syncedLyrics[i].time) {
        activeIdx = i;
      }
    }
    return activeIdx;
  }, [syncedLyrics, currentTime]);

  // Auto-scroll current active lyric line into center
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.querySelector('.lyric-line.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLyricIndex, showLyrics]);

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

  const handleSeekToTime = (time: number) => {
    if (ytReady && ytPlayerRef.current?.seekTo) {
      ytPlayerRef.current.seekTo(time, true);
      setCurrentTime(time);
    }
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isVisible = !!(scene && currentSong);

  return (
    <>
      {/* YouTube player div MUST always be in DOM for API to find it */}
      <div style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <div id="youtube-player" />
      </div>

      {/* FULL SCREEN PLAYER MODAL */}
      {isVisible && isExpanded && (
        <div className="fullscreen-player-backdrop" onClick={() => setIsExpanded(false)}>
          <div className="fullscreen-player-container" onClick={e => e.stopPropagation()}>
            <div className="fullscreen-player-header">
              <button className="fullscreen-close-btn" onClick={() => setIsExpanded(false)} title="Minimize Player">
                <ChevronDown size={24} />
              </button>
              <div className="fullscreen-header-title">
                <span>{scene.icon} {scene.hindi}</span>
                <span className="subtitle">RETRO VINTAGE PLAYER</span>
              </div>
              <div className="fullscreen-tab-toggles">
                <button
                  className={`tab-btn ${!showLyrics ? 'active' : ''}`}
                  onClick={() => setShowLyrics(false)}
                >
                  <Music size={14} /> <span>Cassette</span>
                </button>
                <button
                  className={`tab-btn ${showLyrics ? 'active' : ''}`}
                  onClick={() => setShowLyrics(true)}
                >
                  <FileText size={14} /> <span>Live Lyrics</span>
                </button>
              </div>
            </div>

            <div className="fullscreen-player-body">
              {!showLyrics ? (
                <div className="fullscreen-deck-view">
                  <CassetteDeck currentSong={currentSong} isPlaying={isPlaying} />
                  
                  <div className="fullscreen-song-meta">
                    <h2>{currentSong.title}</h2>
                    <p>{currentSong.artist} • {currentSong.year}</p>
                    <span className={`genre-pill ${isCurrentBhojpuri ? 'bhojpuri-pill' : 'hindi-pill'}`}>
                      {isCurrentBhojpuri ? '🪕 Bhojpuri Nostalgia' : '🎬 Bollywood Classic'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="fullscreen-lyrics-view" ref={lyricsContainerRef}>
                  <div className="lyrics-header">
                    <h3>✍️ Real-Time Singing Lyrics</h3>
                    <span>{currentSong.title} • {currentSong.artist}</span>
                  </div>
                  <div className="synced-lyrics-container">
                    {syncedLyrics.map((line, index) => {
                      const isPast = index < activeLyricIndex;
                      const isActive = index === activeLyricIndex;
                      const isFuture = index > activeLyricIndex;

                      // Live Typewriter character reveal calculation for active line
                      let textToRender = line.text;
                      let isTyping = false;

                      if (isActive) {
                        const elapsed = Math.max(0, currentTime - line.time);
                        // Reveal approx 14 characters per second
                        const visibleChars = Math.min(line.text.length, Math.floor(elapsed * 14) + 1);
                        textToRender = line.text.slice(0, visibleChars);
                        isTyping = visibleChars < line.text.length;
                      }

                      return (
                        <div
                          key={index}
                          className={`lyric-line ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
                          onClick={() => handleSeekToTime(line.time)}
                          title={`Click to jump to ${formatTime(line.time)}`}
                        >
                          {isActive && <span className="lyric-sparkle">🎙️ </span>}
                          <span>{textToRender}</span>
                          {isActive && <span className="typewriter-cursor">|</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls inside Full Screen */}
            <div className="fullscreen-player-footer">
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

              <div className="player-controls">
                <button
                  className={`control-btn mode-btn${isInterleaved ? ' active' : ''}`}
                  onClick={() => setIsInterleaved(!isInterleaved)}
                  title="2:1 Interleaved Radio Mode"
                >
                  <Radio size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px' }}>2:1</span>
                </button>
                <button className={`control-btn${isShuffle ? ' active' : ''}`} onClick={() => setIsShuffle(!isShuffle)}>
                  <Shuffle size={18} />
                </button>
                <button className="control-btn" onClick={prevTrack}>
                  <SkipBack size={22} />
                </button>
                <button className="play-pause-btn lg" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
                <button className="control-btn" onClick={nextTrack}>
                  <SkipForward size={22} />
                </button>
                <button className={`control-btn${isRepeat ? ' active' : ''}`} onClick={() => setIsRepeat(!isRepeat)}>
                  <Repeat size={18} />
                </button>
              </div>

              {/* Volume Sliders */}
              <div className="fullscreen-volume-row">
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
          </div>
        </div>
      )}

      {/* Mini Player UI — only shown when a scene is active */}
      {isVisible && (
        <div className={`spotify-player scene-player-${scene!.tint}`}>
          <audio ref={ambienceRef} src={scene?.ambienceAudio || undefined} loop preload="auto" />

          {/* Left: Artwork + Track Info */}
          <div className="player-left" onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer' }}>
            <div className={`player-artwork-wrap${isPlaying ? ' playing' : ''}`}>
              <img
                src={currentSong.artwork}
                alt="Artwork"
                className={`player-artwork${isPlaying ? ' spin-slow' : ''}`}
              />
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
                title={isInterleaved ? "2:1 Interleaved Radio Mode Active" : "Sequential Playlist Mode"}
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
              <button className="control-btn expand-btn" onClick={() => setIsExpanded(true)} title="Full Screen Player & Lyrics">
                <Maximize2 size={16} />
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

          {/* Right: Volumes & Full Screen Button */}
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
            <button className="control-btn expand-btn-right" onClick={() => setIsExpanded(true)} title="Full Screen Player & Lyrics">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}


